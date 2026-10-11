// Browser verification for the portfolio: drives Edge headless over the Chrome
// DevTools Protocol (Node 24 global WebSocket, zero dependencies), captures
// desktop/mobile screenshots and checks Trace, nav, a11y and motion behaviour.
// Usage: node scripts/verify-ui.mjs <baseUrl> <outDir> [label]
// Run against `next start` (and `next dev`); exits non-zero if any check fails.
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const [, , BASE = "http://localhost:3100", OUT = ".", LABEL = "prod"] = process.argv;
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9333;
// Absolute: Edge silently fails to start (no CDP) with a relative --user-data-dir.
const PROFILE = join(resolve(OUT), `cdp-profile-${Date.now()}`);
mkdirSync(OUT, { recursive: true });

const edge = spawn(EDGE, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${PROFILE}`,
  "--disable-extensions",
  "--disable-component-extensions-with-background-pages",
  "--disable-sync",
  "--no-first-run",
  "--hide-scrollbars",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" });
      const t = await res.json();
      return t.webSocketDebuggerUrl;
    } catch {
      await sleep(200);
    }
  }
  throw new Error("Edge did not expose CDP");
}

const wsUrl = await connect();
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0;
const pending = new Map();
const listeners = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  } else if (msg.method) listeners.forEach((l) => l(msg));
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description ?? ""));
  return r.result.value;
};

// Browser-level CDP, for what lives on the browser rather than the page (permissions).
async function browserSend(method, params = {}) {
  const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
  const b = new WebSocket(webSocketDebuggerUrl);
  await new Promise((r, j) => ((b.onopen = r), (b.onerror = j)));
  try {
    return await new Promise((resolve, reject) => {
      b.onmessage = (m) => {
        const msg = JSON.parse(m.data);
        if (msg.id !== 1) return;
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      };
      b.send(JSON.stringify({ id: 1, method, params }));
    });
  } finally {
    b.close();
  }
}

await send("Page.enable");
await send("Runtime.enable");
const LIGHT = [{ name: "prefers-color-scheme", value: "light" }];
await send("Emulation.setEmulatedMedia", { features: LIGHT });
await send("Network.enable");
const responses = [];
listeners.push((m) => {
  if (m.method === "Network.responseReceived") responses.push({ url: m.params.response.url, status: m.params.response.status, type: m.params.type });
});
const consoleErrors = [];
listeners.push((m) => {
  if (m.method === "Runtime.exceptionThrown") consoleErrors.push(m.params.exceptionDetails.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
});

async function load(path, { width, height, mobile }, { scripts = true } = {}) {
  current = { width, height, deviceScaleFactor: 1, mobile };
  await send("Emulation.setDeviceMetricsOverride", current);
  responses.length = 0;
  // A same-document navigation (only the hash differs) fires no load event; fail loudly rather than hang.
  const loaded = new Promise((r, j) => {
    const timer = setTimeout(() => j(new Error(`no load event for ${path}`)), 30000);
    const l = (m) => {
      if (m.method === "Page.loadEventFired") {
        listeners.splice(listeners.indexOf(l), 1);
        clearTimeout(timer);
        r();
      }
    };
    listeners.push(l);
  });
  await send("Page.navigate", { url: BASE + path });
  await loaded;
  if (scripts) await evaluate("document.fonts.ready.then(() => true)");
  await sleep(2000); // settle the load orchestration (≤1.6s)
  if (scripts) await evaluate("document.documentElement.style.scrollBehavior = 'auto'; true");
}

let current = null;
async function shot(name, { fullPage = false } = {}) {
  if (fullPage) {
    // Grow the viewport to the page height at the same width (no breakpoint
    // change), let anything that reflowed settle, capture, then restore.
    const m = await send("Page.getLayoutMetrics");
    await send("Emulation.setDeviceMetricsOverride", { ...current, height: Math.ceil(m.cssContentSize.height) });
    await evaluate("window.scrollTo(0, 0); true");
    // A page-tall viewport has no "bottom of the screen" for the section
    // reveal's margin to clear, so play every pending entrance, as a reader
    // scrolling past them would.
    await evaluate("document.querySelectorAll('[data-animate]').forEach((el) => el.setAttribute('data-inview', '')); true");
    await sleep(2500);
  }
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  if (fullPage) await send("Emulation.setDeviceMetricsOverride", current);
  const file = join(OUT, `${name}.png`);
  writeFileSync(file, Buffer.from(data, "base64"));
  console.log(`shot  ${file}`);
}

async function mouseAt(selector) {
  const box = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 24) }; })()`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x, y: box.y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: box.x, y: box.y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: box.x, y: box.y, button: "left", clickCount: 1 });
  await sleep(300);
}
const key = async (k, code = k, keyCode = 0) => {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: keyCode });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: keyCode });
  await sleep(150);
};
const litCount = () => evaluate("document.querySelectorAll('[data-lit]').length");
// Poll instead of sleeping a fixed time: dev mode compiles a route on its first visit.
const waitFor = async (expression, ms = 15000) => {
  for (let t = 0; t < ms; t += 250) {
    if (await evaluate(expression)) return true;
    await sleep(250);
  }
  return false;
};

const DESKTOP = { width: 1440, height: 900, mobile: false };
const MOBILE = { width: 375, height: 812, mobile: true };

// ---------- Desktop ----------
await load("/", DESKTOP);
const css = responses.filter((r) => r.url.includes(".css"));
check("stylesheet loads", css.length > 0 && css.every((r) => r.status === 200), css.map((r) => r.status).join(","));
await shot(`${LABEL}-desktop-viewport`);
await shot(`${LABEL}-desktop-full`, { fullPage: true });

const fontsLoaded = await evaluate("[...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))].join(', ')");
const monoFamily = await evaluate("getComputedStyle(document.querySelector('a[href^=mailto]')).fontFamily");
check("both web fonts load", /Schibsted/.test(fontsLoaded) && /Fragment/.test(fontsLoaded), fontsLoaded + " | mono: " + monoFamily);
// The statement owns the first screen; the figures are the second (the Statement direction).
const firstScreen = await evaluate(`(() => { const inView = (el) => el && el.getBoundingClientRect().bottom <= innerHeight; const p = [...document.querySelectorAll('section[aria-labelledby=hero-name] p')]; return { name: inView(document.querySelector('h1')), role: inView(p[0]), positioning: inView(p[1]), outcomes: Math.round(document.getElementById('outcomes').getBoundingClientRect().top) }; })()`);
check(
  "name, role and positioning fill the first 1440x900 screen; the figures start the next",
  firstScreen.name && firstScreen.role && firstScreen.positioning && firstScreen.outcomes <= 900 * 1.1,
  JSON.stringify(firstScreen),
);

// Keyboard: focus the first figure button.
await evaluate("document.activeElement?.blur(); window.scrollTo(0,0); true");
let lit = 0;
for (let i = 0; i < 25 && lit === 0; i++) {
  await key("Tab", "Tab", 9);
  const onFigure = await evaluate("!!document.activeElement?.closest('#outcomes ul')");
  if (onFigure) lit = await litCount();
}
check("keyboard focus on a figure lights its path", lit > 0, `${lit} lit elements`);
await shot(`${LABEL}-desktop-trace-focus`);
await key("Escape", "Escape", 27);
check("Escape clears the trace", (await litCount()) === 0);

// Mouse: pin then unpin, with the URL mirroring the pin.
await evaluate("document.activeElement?.blur(); true");
await mouseAt("#outcomes ul li:nth-child(5) button");
const pinnedUrl = await evaluate("location.search");
const pinnedLit = await litCount();
check("click pins a figure and writes ?trace=", pinnedUrl.includes("trace=uptime") && pinnedLit > 0, `${pinnedUrl}, ${pinnedLit} lit`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
await sleep(250);
check("a pinned trace survives the pointer leaving", (await litCount()) === pinnedLit);
const hint = await evaluate(`document.body.innerText.includes('is lit on the map')`);
check("pinning a figure with the map out of view offers the way to it", hint);
await mouseAt("a[href='#map']");
await sleep(900);
const mapShown = await evaluate(`(() => { const r = document.getElementById('map').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })()`);
check("the hint brings the lit map into view and steps aside", mapShown && !(await evaluate(`document.body.innerText.includes('is lit on the map')`)), String(mapShown));
await evaluate("window.scrollTo(0, 0); true");
await sleep(300);
await shot(`${LABEL}-desktop-trace-pinned`);
await mouseAt("#outcomes ul li:nth-child(5) button");
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
await sleep(250);
check("second click unpins and clears the URL", (await litCount()) === 0 && !(await evaluate("location.search")).includes("trace"));

// Escape clears a pin even after focus has moved elsewhere on the page.
await mouseAt("#outcomes ul li:nth-child(2) button");
await mouseAt("h1");
await key("Escape", "Escape", 27);
check("Escape clears a pin with focus outside the hero", (await litCount()) === 0);

// Shared link restores the pin.
await load("/?trace=answers", DESKTOP);
await sleep(300);
check("?trace= link restores the pin", (await litCount()) > 0 && (await evaluate("document.querySelector('[aria-pressed=true]') !== null")));

// Resume download target.
const pdf = await evaluate(`fetch(document.querySelector('a[download]').getAttribute('href')).then(r => r.status + ' ' + r.headers.get('content-type'))`);
check("resume link returns a PDF", pdf.startsWith("200") && pdf.includes("pdf"), pdf);

// ---------- Work and experience on the home page ----------
await load("/", DESKTOP);
const deadNav = await evaluate(
  `[...document.querySelectorAll('nav[aria-label=Sections] a')].map(a => a.hash.slice(1)).filter(id => !document.getElementById(id))`,
);
check("every nav link has its section on the home page", deadNav.length === 0, deadNav.join(", "));
const legalCount = await evaluate(`document.body.innerText.split("Parkar Global Technologies Pvt Ltd").length - 1`);
check("legal employer name appears exactly once", legalCount === 1, String(legalCount));
const cardHrefs = await evaluate(`[...document.querySelectorAll('#work article h3 a')].map(a => a.getAttribute('href'))`);
check(
  "four case-study cards link to /work/*",
  cardHrefs.length === 4 && cardHrefs.every((h) => /^\/work\/[a-z-]+$/.test(h)),
  cardHrefs.join(", "),
);

// Keyboard: Tab reaches a card's title link and its inset ring shows.
await evaluate("document.activeElement?.blur(); window.scrollTo(0, 0); true");
let cardRing = null;
for (let i = 0; i < 60 && !cardRing; i++) {
  await key("Tab", "Tab", 9);
  cardRing = await evaluate(
    `(() => { const a = document.activeElement; return a?.closest('#work article h3') ? getComputedStyle(a, '::after').boxShadow : null; })()`,
  );
}
check("keyboard reaches a card and shows its focus ring", !!cardRing && cardRing !== "none", String(cardRing));

// Client-side round trip: card → case study → All work → the nav still tracks sections.
await evaluate("document.activeElement?.blur(); true");
await mouseAt("#work article:nth-child(1) h3 a");
const opened = await waitFor(`location.pathname === ${JSON.stringify(cardHrefs[0])} && !!document.querySelector('[data-diagram]')`);
check("a card opens its case study", opened, await evaluate("location.pathname"));
const homeLinks = await evaluate(
  `[...document.querySelectorAll('nav[aria-label=Sections] a')].every(a => a.getAttribute('href').startsWith('/#'))`,
);
check("nav links point home from a case study", homeLinks);
await mouseAt("article > a[href='/#work']");
const back = await waitFor(`location.pathname === '/' && location.hash === '#work' && !!document.getElementById('experience')`);
check("All work returns to the work section", back, await evaluate("location.pathname + location.hash"));
await evaluate("document.getElementById('experience').scrollIntoView({ block: 'start' }); true");
await sleep(800);
const tracked = await evaluate(`document.querySelector('nav[aria-label=Sections] a[aria-current]')?.dataset.section ?? null`);
check("nav tracks sections after returning from a case study", tracked === "experience", String(tracked));

// The marked section clears when no section is in view: back up at the hero,
// and after returning home through the name link from a case study.
const marked = () => evaluate(`document.querySelector('nav[aria-label=Sections] a[aria-current]')?.dataset.section ?? null`);
await evaluate("window.scrollTo(0, 0); true");
await sleep(800);
const atHero = await marked();
check("scrolling back to the hero clears the marked section", atHero === null, String(atHero));
await evaluate("document.getElementById('work').scrollIntoView({ block: 'start' }); true");
await sleep(800);
await mouseAt("#work article:nth-child(2) h3 a");
await waitFor(`location.pathname === ${JSON.stringify(cardHrefs[1])} && !!document.querySelector('[data-diagram]')`);
await mouseAt("header a[href='/']");
const home = await waitFor(`location.pathname === '/' && !!document.getElementById('work')`);
await sleep(800);
const afterName = await marked();
check("returning home through the name link marks no section", home && afterName === null, `${home} ${afterName}`);

// ---------- Stack, credentials, GitHub and contact ----------
await load("/", DESKTOP);
const navIds = await evaluate(`[...document.querySelectorAll('header nav[aria-label=Sections] a')].map(a => a.dataset.section).join()`);
check("nav lists the five sections in order", navIds === "work,experience,stack,credentials,contact", navIds);
const stack = await evaluate(
  `(() => { const s = document.getElementById('stack'); return { groups: s.querySelectorAll('h3').length, work: s.querySelectorAll('li[data-evidence=work]').length, project: s.querySelectorAll('li[data-evidence=project]').length, key: s.innerText.includes('Used at work') && s.innerText.includes('Used in a project') }; })()`,
);
check("stack: nine groups, both markers and a key naming them", stack.groups === 9 && stack.work > 0 && stack.project > 0 && stack.key, JSON.stringify(stack));
const verifyLinks = await evaluate(`[...document.querySelectorAll('#credentials a[href^="http"]')].map(a => a.target + ' ' + a.rel)`);
check(
  "credentials: four verify links open safely in a new tab",
  verifyLinks.length === 4 && verifyLinks.every((v) => v === "_blank noopener noreferrer"),
  verifyLinks.join(" | "),
);
const repos = await evaluate(
  `({ names: [...document.querySelectorAll('#github h3 a')].map(a => a.firstChild.textContent.trim()), live: document.getElementById('github')?.innerText.includes('Last pushed') ?? false })`,
);
check("GitHub: the two own repos, never the uncredited fork", repos.names.length === 2 && !repos.names.some((n) => n.includes("Robot")), JSON.stringify(repos));

// The Contact section is too short to reach the observer band; at the foot of the page it is still the one marked.
await evaluate("window.scrollTo(0, 0); true");
await sleep(500);
await mouseAt("header nav[aria-label=Sections] a[data-section=contact]");
await sleep(900);
const atContact = await marked();
check(
  "the Contact link lands at the foot and marks Contact",
  atContact === "contact",
  `${atContact}, at ${await evaluate("Math.round(scrollY + innerHeight) + ' of ' + document.documentElement.scrollHeight")}`,
);
await shot(`${LABEL}-desktop-contact`);

// Copy: the success path with clipboard permission, then a browser with no Clipboard API (a plain-http origin).
const email = await evaluate(`document.querySelector('#contact a[href^="mailto:"]').getAttribute('href').slice(7)`);
let granted = "granted";
try {
  await browserSend("Browser.grantPermissions", { origin: new URL(BASE).origin, permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] });
} catch (e) {
  granted = e.message;
}
// Headless refuses clipboard reads, so record what the page hands the real writeText.
await evaluate(`(() => { const write = navigator.clipboard.writeText.bind(navigator.clipboard); window.__copied = null; navigator.clipboard.writeText = (t) => ((window.__copied = t), write(t)); return true; })()`);
await mouseAt("#contact button[aria-label='Copy email address']");
const copiedToast = await waitFor(`document.body.innerText.includes('Email address copied')`, 3000);
const clip = await evaluate("window.__copied");
check("Contact: the copy button copies the address and says so", copiedToast && clip === email, `${granted}; toast ${copiedToast}; wrote "${clip}"`);

await load("/", DESKTOP);
await evaluate(`Object.defineProperty(Navigator.prototype, 'clipboard', { get: () => undefined, configurable: true }); true`);
await mouseAt("#contact button[aria-label='Copy email address']");
const told = await waitFor(`document.body.innerText.includes('Address selected')`, 3000);
const selected = await evaluate("window.getSelection().toString()");
check(
  "Contact: without the Clipboard API, copy selects the address and says how to copy it",
  told && selected === email && (await evaluate("location.pathname")) === "/",
  `selected "${selected}", told ${told}`,
);
await shot(`${LABEL}-contact-copy-fallback`);

// md is the narrowest width with the full nav: five links and the Resume button must fit beside the name.
await load("/", { width: 768, height: 1024, mobile: false });
const nav768 = await evaluate(`(() => {
  const row = document.querySelector('header > div').getBoundingClientRect();
  const name = document.querySelector('header a[href="/"]').getBoundingClientRect();
  const links = [...document.querySelectorAll('header nav[aria-label=Sections] a')].map(a => a.getBoundingClientRect());
  const resumeBtn = [...document.querySelectorAll('header a[download]')].find(a => getComputedStyle(a).display !== 'none')?.getBoundingClientRect();
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    shown: links.filter(r => r.width > 0 && r.left >= row.left && r.right <= row.right).length,
    clear: links.length > 0 && name.right <= links[0].left,
    resume: !!resumeBtn && resumeBtn.right <= row.right,
    oneLine: links.every(r => Math.round(r.top) === Math.round(links[0].top)),
  };
})()`);
check(
  "at 768 the nav fits five links and the Resume button beside the name",
  nav768.overflow === 0 && nav768.shown === 5 && nav768.clear && nav768.resume && nav768.oneLine,
  JSON.stringify(nav768),
);
await shot(`${LABEL}-md-768-viewport`);
await shot(`${LABEL}-md-768-full`, { fullPage: true });

// ---------- Map legibility at the narrowest split and below it ----------
const minSvgFont = (selector = "figure svg") =>
  evaluate(
    `(() => { const svg = document.querySelector(${JSON.stringify(selector)}); const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width; return Math.min(...[...svg.querySelectorAll('text')].map(t => Number(t.getAttribute('font-size')) * scale)).toFixed(2); })()`,
  );
for (const width of [1024, 1280, 1440]) {
  await load("/", { width, height: 900, mobile: false });
  const px = Number(await minSvgFont());
  check(`map text >= 11px at ${width}`, px >= 11, `${px}px`);
  if (width === 1024) await shot(`${LABEL}-lg-1024-viewport`);
}

// ---------- Mobile ----------
await load("/", MOBILE);
await shot(`${LABEL}-mobile-viewport`);
await shot(`${LABEL}-mobile-full`, { fullPage: true });
const overflow = await evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
check("no horizontal scroll at 375px", overflow === 0, `overflow ${overflow}px`);
const svgShown = await evaluate("getComputedStyle(document.querySelector('figure')?.parentElement ?? document.body).display");
check("drawing replaced by the stack below md", svgShown === "none", svgShown);
await mouseAt("button[aria-label='Open menu']");
const menuOpen = await evaluate("!!document.querySelector('[role=dialog]')");
check("mobile menu opens", menuOpen);
await shot(`${LABEL}-mobile-menu`);
await key("Escape", "Escape", 27);
check("mobile menu closes on Escape", !(await evaluate("!!document.querySelector('[role=dialog]')")));
await mouseAt("#map [role=group] button:nth-child(1)");
check("tapping a figure chip on mobile lights the map list", (await litCount()) > 0);
const chipLit = await evaluate(`(() => { const chip = document.querySelector('#map [role=group] button:nth-child(1)'); const probe = document.createElement('span'); probe.style.color = 'var(--color-accent)'; document.body.append(probe); const want = getComputedStyle(probe).color; probe.remove(); return { got: getComputedStyle(chip).color, want }; })()`);
check("the tapped figure chip turns accent", chipLit.got === chipLit.want, JSON.stringify(chipLit));
await shot(`${LABEL}-mobile-trace`);

// ---------- Responsive sweep and target sizes ----------
// WCAG 2.5.8 without the spacing exception: every target that isn't inside running text is >= 24x24.
const smallTargets = () =>
  evaluate(`(() => {
    // In running text: its parent lays out inline (not a flex or grid row) and the block holds other words.
    const inSentence = (el) => {
      if (/flex|grid/.test(getComputedStyle(el.parentElement).display)) return false;
      const block = el.parentElement.closest('p, li, dd, td');
      return !!block && block.textContent.replace(el.textContent, '').trim().length > 1;
    };
    return [...document.querySelectorAll('a[href], button, summary')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || el.closest('.sr-only') || el.classList.contains('skip-link') || getComputedStyle(el).visibility === 'hidden') return false;
      return (r.width < 24 || r.height < 24) && !inSentence(el);
    }).map((el) => (el.getAttribute('aria-label') || el.textContent.trim()).slice(0, 32) + ' ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height));
  })()`);
for (const path of ["/", cardHrefs[0]]) {
  for (const [width, height] of [[375, 812], [768, 1024], [1024, 768], [1440, 900]]) {
    await load(path, { width, height, mobile: width < 1024 });
    const o = await evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
    const small = await smallTargets();
    check(`${path} at ${width}: no horizontal scroll and every target at least 24px`, o === 0 && small.length === 0, `overflow ${o}; ${small.join(" | ")}`);
  }
}
for (const width of [360, 375, 414]) {
  await load("/", { width, height: 800, mobile: true });
  const row = await evaluate(`(() => { const a = document.querySelector('#contact a[href^="mailto:"]').getBoundingClientRect(); const b = document.querySelector('#contact button[aria-label="Copy email address"]').getBoundingClientRect(); return Math.round(Math.abs((a.top + a.height / 2) - (b.top + b.height / 2))); })()`);
  check(`Contact at ${width}: the copy button sits on the email's line`, row < 6, `${row}px apart`);
}
await load("/", MOBILE);
const stackHeight = await evaluate("Math.round(document.getElementById('stack').getBoundingClientRect().height)");
check("Stack at 375 is shorter than the 2,180px it started at", stackHeight < 1900, `${stackHeight}px`);

// ---------- Case studies ----------
for (const href of cardHrefs) {
  const slug = href.split("/").pop();
  await load(href, DESKTOP);
  const page = await evaluate(
    `({ h1: document.querySelector('h1')?.textContent ?? '', sections: [...document.querySelectorAll('article h2')].map(h => h.textContent), drawn: getComputedStyle(document.querySelector('[data-diagram] svg').parentElement).display !== 'none' })`,
  );
  check(
    `${slug}: headline, required sections and drawing render`,
    !!page.h1 && ["Context", "Architecture", "Results"].every((s) => page.sections.includes(s)) && page.drawn,
    page.sections.join(" | "),
  );
  const clipped = await evaluate(
    `[...document.querySelectorAll('[data-diagram] [data-node]')].filter(g => { const r = g.querySelector('rect').getBBox(); return [...g.querySelectorAll('text')].some(t => { const b = t.getBBox(); return b.x < r.x || b.x + b.width > r.x + r.width - 4 || b.y < r.y || b.y + b.height > r.y + r.height; }); }).map(g => g.dataset.node)`,
  );
  check(`${slug}: every node's text fits its box`, clipped.length === 0, clipped.join(", "));
  const labelHits = await evaluate(
    `(() => { const rects = [...document.querySelectorAll('[data-diagram] [data-node] rect')].map(r => r.getBBox()); return [...document.querySelectorAll('[data-diagram] [data-edge-label]')].filter(t => { const b = t.getBBox(); return rects.some(r => b.x < r.x + r.width && r.x < b.x + b.width && b.y < r.y + r.height && r.y < b.y + b.height); }).map(t => t.textContent); })()`,
  );
  check(`${slug}: edge labels clear of nodes`, labelHits.length === 0, labelHits.join(", "));
  await shot(`${LABEL}-work-${slug}-desktop-full`, { fullPage: true });

  for (const width of [768, 1024, 1440]) {
    await load(href, { width, height: 900, mobile: false });
    const px = Number(await minSvgFont("[data-diagram] svg"));
    check(`${slug}: diagram text >= 11px at ${width}`, px >= 11, `${px}px`);
  }

  await load(href, MOBILE);
  const phone = await evaluate(
    `({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, drawingHidden: getComputedStyle(document.querySelector('[data-diagram] svg').parentElement).display === 'none', listShown: document.querySelector('[data-diagram] [data-connections]').getBoundingClientRect().height > 0 })`,
  );
  check(
    `${slug}: at 375 no horizontal scroll and the diagram is a list`,
    phone.overflow === 0 && phone.drawingHidden && phone.listShown,
    JSON.stringify(phone),
  );
  await shot(`${LABEL}-work-${slug}-mobile-full`, { fullPage: true });
}

const missing = await evaluate(`fetch('/work/not-a-case-study').then(r => r.status)`);
check("an unknown case study is a 404", missing === 404, String(missing));

const unknownStatus = await evaluate(`fetch('/no-such-page').then(r => r.status)`);
await load("/no-such-page", DESKTOP);
const nf = await evaluate(
  `({ h1: document.querySelector('h1')?.textContent, home: !!document.querySelector('main a[href="/"]'), work: !!document.querySelector('main a[href="/#work"]') })`,
);
check("an unknown page is a styled 404 linking home and to the work", unknownStatus === 404 && nf.h1 === "Page not found" && nf.home && nf.work, `${unknownStatus} ${JSON.stringify(nf)}`);
await shot(`${LABEL}-404-desktop`);

// ---------- Section reveal ----------
await load("/", DESKTOP);
const before = await evaluate(`(() => { const r = document.querySelector('#stack .reveal'); return { animate: r.hasAttribute('data-animate'), inview: r.hasAttribute('data-inview'), opacity: getComputedStyle(r).opacity }; })()`);
await evaluate("document.getElementById('stack').scrollIntoView({ block: 'start' }); true");
await sleep(1200);
const after = await evaluate(`(() => { const r = document.querySelector('#stack .reveal'); return { inview: r.hasAttribute('data-inview'), opacity: getComputedStyle(r).opacity, transform: getComputedStyle(r).transform }; })()`);
check(
  "an off-screen section waits, then rises into place once it scrolls into view",
  before.animate && !before.inview && before.opacity === "0" && after.inview && after.opacity === "1" && after.transform === "none",
  JSON.stringify({ before, after }),
);
await load("/?deep#stack", DESKTOP); // a query makes it a fresh document, not a same-page hash jump
const deep = await evaluate(`(() => { const r = document.querySelector('#stack .reveal'); return { animate: r.hasAttribute('data-animate'), opacity: getComputedStyle(r).opacity, top: Math.round(document.getElementById('stack').getBoundingClientRect().top) }; })()`);
check("a deep link leaves the section it lands on at rest", !deep.animate && deep.opacity === "1", JSON.stringify(deep));
await load("/", DESKTOP);
await send("Emulation.setEmulatedMedia", { media: "print", features: LIGHT });
const printed = await evaluate("[...document.querySelectorAll('.reveal')].map(r => getComputedStyle(r).opacity).every(o => o === '1')");
await send("Emulation.setEmulatedMedia", { media: "", features: LIGHT });
check("printing shows every section, revealed or not", printed);

// ---------- SEO: each route's own canonical, share block and structured data ----------
const head = (path) =>
  evaluate(`fetch(${JSON.stringify(path)}).then(r => r.text()).then(html => {
    const d = new DOMParser().parseFromString(html, 'text/html');
    const meta = (k) => d.querySelector('meta[property="' + k + '"], meta[name="' + k + '"]')?.getAttribute('content') ?? null;
    return {
      title: d.title,
      canonical: d.querySelector('link[rel=canonical]')?.getAttribute('href') ?? null,
      ogTitle: meta('og:title'), ogUrl: meta('og:url'), ogImage: meta('og:image'), ogType: meta('og:type'), site: meta('og:site_name'),
      robots: [...d.querySelectorAll('meta[name=robots]')].map(m => m.content),
      ld: [...d.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)['@type']),
    };
  })`);
const homeHead = await head("/");
check(
  "home: canonical, its own share block and a Person",
  // Next prints the root canonical without its slash; http://x and http://x/ are the same URL.
  new URL(homeHead.canonical ?? "x:").pathname === "/" && homeHead.ogType === "website" && /\/opengraph-image/.test(homeHead.ogImage ?? "") && homeHead.ld.includes("Person"),
  JSON.stringify(homeHead),
);
for (const href of cardHrefs) {
  const h = await head(href);
  check(
    `${href}: its own canonical, title, URL and card, and an Article`,
    (h.canonical ?? "").endsWith(href) &&
      (h.ogUrl ?? "").endsWith(href) &&
      h.ogType === "article" &&
      h.ogTitle?.startsWith(h.title.split(" — ")[0]) &&
      (h.ogImage ?? "").includes(`${href}/opengraph-image`) &&
      h.site === "Mihir Bhavsar" &&
      h.ld.includes("Article"),
    JSON.stringify(h),
  );
}
const nfHead = await head("/no-such-page");
check("the 404 says noindex exactly once", nfHead.robots.length === 1 && nfHead.robots[0].includes("noindex"), JSON.stringify(nfHead.robots));
const siteMap = await evaluate(`fetch('/sitemap.xml').then(r => r.text())`);
check("the sitemap lists home and the four case studies", cardHrefs.every((h) => siteMap.includes(`${h}</loc>`)), `${(siteMap.match(/<loc>/g) ?? []).length} urls`);

// ---------- Themes ----------
const theme = () => evaluate("document.documentElement.dataset.theme ?? null");
const canvas = () => evaluate("getComputedStyle(document.body).backgroundColor");
await evaluate("localStorage.clear(); true");
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
await load("/", DESKTOP);
const darkFirst = { theme: await theme(), bg: await canvas() };
await send("Emulation.setEmulatedMedia", { features: LIGHT });
await load("/", DESKTOP);
const lightFirst = { theme: await theme(), bg: await canvas() };
check(
  "a first visit follows the system theme",
  darkFirst.theme === "dark" && darkFirst.bg === "rgb(10, 10, 10)" && lightFirst.theme === "light" && lightFirst.bg === "rgb(255, 255, 255)",
  JSON.stringify({ darkFirst, lightFirst }),
);
await mouseAt("header button.theme-toggle");
const toggled = { theme: await theme(), bg: await canvas(), label: await evaluate("document.querySelector('header button.theme-toggle').getAttribute('aria-label')") };
await load("/", DESKTOP);
const remembered = await theme();
check("the toggle switches the theme and remembers it", toggled.theme === "dark" && toggled.bg === "rgb(10, 10, 10)" && toggled.label === "Switch to light theme" && remembered === "dark", JSON.stringify({ toggled, remembered }));
await shot(`${LABEL}-desktop-dark`);
await load("/work/avd-automation", DESKTOP);
await shot(`${LABEL}-work-dark`);
await evaluate("localStorage.clear(); true");
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
await send("Emulation.setScriptExecutionDisabled", { value: true });
await load("/", DESKTOP, { scripts: false });
await send("Emulation.setScriptExecutionDisabled", { value: false });
const noJsTheme = { bg: await canvas(), toggle: await evaluate("getComputedStyle(document.querySelector('header button.theme-toggle')).display") };
check("without JavaScript the system theme still applies and the toggle hides", noJsTheme.bg === "rgb(10, 10, 10)" && noJsTheme.toggle === "none", JSON.stringify(noJsTheme));
await send("Emulation.setEmulatedMedia", { features: LIGHT });

// ---------- Reduced motion ----------
await send("Emulation.setEmulatedMedia", { features: [...LIGHT, { name: "prefers-reduced-motion", value: "reduce" }] });
await load("/", DESKTOP);
const running = await evaluate("document.getAnimations().length");
check("reduced motion runs no animations", running === 0, `${running} running`);
const restingReduced = await evaluate("getComputedStyle(document.querySelector('#contact .reveal')).opacity");
check("reduced motion: off-screen sections are fully visible", restingReduced === "1", restingReduced);
await send("Emulation.setEmulatedMedia", { features: LIGHT });

// ---------- JavaScript off ----------
await send("Emulation.setScriptExecutionDisabled", { value: true });
await load("/", DESKTOP, { scripts: false });
await send("Emulation.setScriptExecutionDisabled", { value: false });
const noJs = await evaluate(`({ figures: document.querySelectorAll('#outcomes ul .type-figure').length, provenance: document.querySelectorAll('[id^=proof-][id$=-how]').length, name: document.querySelector('h1')?.textContent, sections: ['work', 'experience', 'stack', 'credentials', 'github', 'contact'].filter(id => document.getElementById(id)).length, revealOpacity: getComputedStyle(document.querySelector('#contact .reveal')).opacity })`);
check("content complete with JavaScript off", noJs.figures === 6 && noJs.provenance === 6 && !!noJs.name && noJs.sections === 6 && noJs.revealOpacity === "1", JSON.stringify(noJs));
await shot(`${LABEL}-desktop-nojs`);

await send("Emulation.setScriptExecutionDisabled", { value: true });
await load(cardHrefs[0], DESKTOP, { scripts: false });
await send("Emulation.setScriptExecutionDisabled", { value: false });
const noJsWork = await evaluate(
  `({ h1: !!document.querySelector('h1'), sections: document.querySelectorAll('article h2').length, edges: document.querySelectorAll('[data-diagram] [data-edge]').length })`,
);
check("a case study is complete with JavaScript off", noJsWork.h1 && noJsWork.sections >= 5 && noJsWork.edges > 0, JSON.stringify(noJsWork));

check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

writeFileSync(join(OUT, `${LABEL}-results.json`), JSON.stringify(results, null, 2));
ws.close();
// Close the browser through CDP. On Windows the msedge.exe we spawned hands
// off to a separate browser process and exits, so killing it would leave the
// browser running with the throwaway profile locked.
try {
  const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
  const browser = new WebSocket(webSocketDebuggerUrl);
  await new Promise((r, j) => ((browser.onopen = r), (browser.onerror = j)));
  browser.send(JSON.stringify({ id: 1, method: "Browser.close" }));
  await sleep(1500);
} catch {
  // Already gone.
}
edge.kill();
try {
  rmSync(PROFILE, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
} catch {
  console.log(`note  could not remove ${PROFILE}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
