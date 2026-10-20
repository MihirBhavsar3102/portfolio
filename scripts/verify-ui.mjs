// Browser verification for the portfolio: drives a Chromium-family browser
// (Edge, Chrome or Chromium) headless over the Chrome DevTools Protocol (Node
// 24 global WebSocket, no imports), captures desktop/mobile screenshots and
// checks Trace, nav, a11y and motion behaviour. Its accessibility pass injects
// axe-core from node_modules, so run `npm ci` first.
// Usage: node scripts/verify-ui.mjs <baseUrl> <outDir> [label]
// Set BROWSER_PATH to choose the browser; otherwise the first one found is used.
// Run against `next start` (and `next dev`); exits non-zero if any check fails
// or the run itself breaks.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { delimiter, join, resolve } from "node:path";

const [, , BASE = "http://localhost:3100", OUT = ".", LABEL = "prod"] = process.argv;

/**
 * BROWSER_PATH if set; else Edge or Chrome at their install paths on Windows
 * and macOS; else Chrome, Chromium or Edge on the PATH (GitHub's Linux runners
 * ship Google Chrome).
 */
function findBrowser() {
  const chosen = process.env.BROWSER_PATH;
  if (chosen) {
    if (!existsSync(chosen)) throw new Error(`BROWSER_PATH does not exist: ${chosen}`);
    return chosen;
  }
  const installed = {
    win32: [
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
    ],
    darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"],
  };
  const onPath = ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser", "microsoft-edge-stable", "microsoft-edge"].flatMap((name) =>
    (process.env.PATH ?? "").split(delimiter).filter(Boolean).map((dir) => join(dir, name)),
  );
  const found = [...(installed[process.platform] ?? []), ...onPath].find((p) => existsSync(p));
  if (!found) throw new Error("No Chrome, Chromium or Edge found. Set BROWSER_PATH to one.");
  return found;
}

let BROWSER;
try {
  BROWSER = findBrowser();
} catch (error) {
  console.error(`FAIL  ${error.message}`);
  process.exit(1);
}
// Absolute: Edge silently fails to start (no CDP) with a relative --user-data-dir.
const PROFILE = join(resolve(OUT), `cdp-profile-${Date.now()}`);
mkdirSync(OUT, { recursive: true });
console.log(`browser  ${BROWSER}`);

const browser = spawn(BROWSER, [
  "--headless=new",
  // Port 0: the browser picks a free port and writes it to DevToolsActivePort in
  // the profile, so a browser left over from an earlier run can never be the one
  // this run attaches to.
  "--remote-debugging-port=0",
  `--user-data-dir=${PROFILE}`,
  "--disable-extensions",
  "--disable-component-extensions-with-background-pages",
  "--disable-sync",
  "--no-first-run",
  "--hide-scrollbars",
  // Containers give /dev/shm 64MB, too little for Chrome; and Chrome refuses to sandbox as root.
  ...(process.platform === "linux" ? ["--disable-dev-shm-usage"] : []),
  ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
  "about:blank",
]);
browser.on("error", (error) => {
  console.error(`FAIL  could not start ${BROWSER}: ${error.message}`);
  process.exit(1);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

let PORT = 0;
let closed = false;
/** Closes the browser through CDP and removes its profile. Safe to call twice. */
async function closeBrowser() {
  if (closed) return;
  closed = true;
  // On Windows the msedge.exe we spawned hands off to a separate browser
  // process and exits, so killing it would leave the browser running with the
  // throwaway profile locked; close it through CDP first.
  try {
    if (PORT) {
      const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${PORT}/json/version`, { signal: AbortSignal.timeout(3000) })).json();
      const b = new WebSocket(webSocketDebuggerUrl);
      await new Promise((r, j) => ((b.onopen = r), (b.onerror = j)));
      b.send(JSON.stringify({ id: 1, method: "Browser.close" }));
      await sleep(1500);
    }
  } catch {
    // Already gone.
  }
  browser.kill();
  try {
    rmSync(PROFILE, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    console.log(`note  could not remove ${PROFILE}`);
  }
}

// A run that breaks (a page that never loads, a browser that dies) must close
// the browser and fail. Installing this handler makes Node exit 0 after an
// uncaught error or a rejected top-level await, so it sets the code itself.
// One failure can surface twice (a rejection and the await it breaks); only
// the first cleans up, because exiting mid-cleanup aborts Node on Windows.
let crashed = false;
const crash = async (error) => {
  process.exitCode = 1;
  if (crashed) return;
  crashed = true;
  console.error(`FAIL  the verifier crashed: ${error?.stack ?? error}`);
  await closeBrowser();
  process.exit(1);
};
process.on("uncaughtException", crash);
process.on("unhandledRejection", crash);

async function devtoolsPort() {
  const file = join(PROFILE, "DevToolsActivePort");
  for (let i = 0; i < 150; i++) {
    try {
      const port = Number(readFileSync(file, "utf8").split("\n")[0]);
      if (port > 0) return port;
    } catch {
      // Not written yet.
    }
    await sleep(100);
  }
  throw new Error(`${BROWSER} did not open a DevTools port within 15s`);
}

async function connect() {
  PORT = await devtoolsPort();
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" });
      const t = await res.json();
      return t.webSocketDebuggerUrl;
    } catch {
      await sleep(200);
    }
  }
  throw new Error("the browser did not expose CDP");
}

const wsUrl = await connect();
const ws = new WebSocket(wsUrl);
await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = () => j(new Error("could not open the CDP socket")))));
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
// A browser that dies mid-run fails every call in flight instead of hanging the run.
ws.onclose = () => {
  for (const { reject } of pending.values()) reject(new Error("the browser connection closed"));
  pending.clear();
};
/** One CDP call; one that gets no answer within 60s fails rather than hangs. */
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP ${method} got no answer within 60s`));
    }, 60000);
    pending.set(id, {
      resolve: (v) => (clearTimeout(timer), resolve(v)),
      reject: (e) => (clearTimeout(timer), reject(e)),
    });
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
// A resource the Content Security Policy blocks is a console error too, so a
// policy too tight for the site fails the run instead of silently breaking it.
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `document.addEventListener("securitypolicyviolation", (e) => console.error("CSP violation: " + e.effectiveDirective + " blocked " + (e.blockedURI || "inline")));`,
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
// A budget on the home page's first-load JavaScript, compressed as served: the phone menu and the copy
// toast (Radix) load on first use, so a static import that drags them back in fails here. Measured
// 2026-10-21; raise it on purpose, never to make a run pass.
const JS_BUDGET_KB = 200;
const firstLoadJs = await evaluate(
  `Math.round(performance.getEntriesByType('resource').filter((e) => { const p = new URL(e.name).pathname; return p.startsWith('/_next/static/') && p.endsWith('.js'); }).reduce((n, e) => n + e.encodedBodySize, 0) / 1024)`,
);
// A dev build ships unminified code with its dev overlay (<nextjs-portal>), so the budget only judges production builds.
if (await evaluate("!!document.querySelector('nextjs-portal')")) console.log(`skip  home's first-load JavaScript budget: a dev build (${firstLoadJs} KB unminified)`);
else check(`home's first-load JavaScript stays within ${JS_BUDGET_KB} KB compressed`, firstLoadJs > 0 && firstLoadJs <= JS_BUDGET_KB, `${firstLoadJs} KB`);
await shot(`${LABEL}-desktop-viewport`);
await shot(`${LABEL}-desktop-full`, { fullPage: true });

const fontsLoaded = await evaluate("[...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))].join(', ')");
const monoFamily = await evaluate("getComputedStyle(document.querySelector('a[href^=mailto]')).fontFamily");
check("both web fonts load", /Schibsted/.test(fontsLoaded) && /Fragment/.test(fontsLoaded), fontsLoaded + " | mono: " + monoFamily);
// The statement owns the first screen; the figures are the second (the Statement direction).
// The hero's proof lines (the AWS certification and the current role) are what a recruiter screens for: first screen too.
const firstScreenOf = () =>
  evaluate(`(() => { const inView = (el) => !!el && el.getBoundingClientRect().bottom <= innerHeight; const p = [...document.querySelectorAll('section[aria-labelledby=hero-name] p')]; return { name: inView(document.querySelector('h1')), role: inView(p[0]), positioning: inView(p[1]), proof: inView(document.querySelector('[data-hero] ul')), outcomes: Math.round(document.getElementById('outcomes').getBoundingClientRect().top) }; })()`);
const firstScreen = await firstScreenOf();
check(
  "name, role, positioning and the proof lines fill the first 1440x900 screen; the figures start the next",
  firstScreen.name && firstScreen.role && firstScreen.positioning && firstScreen.proof && firstScreen.outcomes <= 900 * 1.1,
  JSON.stringify(firstScreen),
);

// ---------- The hero's story and the nav's name ----------
// The last word rolls through built, shipped, monitored while the estate preview
// lights the same step; the nav holds its name back until the hero's has gone.
const heroState = () =>
  evaluate(`(() => {
    const accent = getComputedStyle(document.querySelector('section[data-hero] a[href^=mailto]')).color;
    const lit = (sel, prop) => [...document.querySelectorAll(sel)].filter(e => getComputedStyle(e)[prop] === accent).map(e => e.dataset.step);
    return {
      phase: document.querySelector('[data-hero]').dataset.phase ?? null,
      word: [...document.querySelectorAll('.hero-roll-word')].find(w => getComputedStyle(w).opacity === '1')?.textContent ?? null,
      litNodes: lit('.hero-node', 'color'),
      litWires: lit('.hero-wire', 'backgroundColor'),
    };
  })()`);
const navName = () => evaluate(`getComputedStyle(document.querySelector('header a[href="/"] > span:last-child')).opacity`);
const atTop = {
  name: await navName(),
  monogram: await evaluate(`document.querySelector('header a[href="/"] > span').textContent`),
  preview: await evaluate("getComputedStyle(document.querySelector('[data-hero] > div:nth-child(2)')).display"),
};
check(
  "at the top of home the nav shows the monogram, not a second name, and the estate preview sits beside the hero",
  atTop.name === "0" && atTop.monogram === "MB" && atTop.preview !== "none",
  JSON.stringify(atTop),
);
const sentence = await evaluate(
  `(() => { const s = document.querySelector('.hero-static'); return { text: s.textContent.replace(/\\s+/g, ' ').trim(), clip: getComputedStyle(s).clipPath, display: getComputedStyle(s).display }; })()`,
);
check(
  "screen readers get the whole positioning line while the word rolls",
  sentence.text.endsWith("built, shipped and monitored.") && sentence.clip !== "none" && sentence.display !== "none",
  JSON.stringify(sentence),
);
const p0 = (await heroState()).phase;
const stepped = await waitFor(`document.querySelector('[data-hero]').dataset.phase !== ${JSON.stringify(p0)}`, 5000);
await sleep(1700); // past the 500ms transitions and the longest stagger, well inside the 3.2s step
const story = await heroState();
const verb = { build: "built.", ship: "shipped.", observe: "monitored." }[story.phase];
const wantNodes = story.phase === "ship" ? 0 : await evaluate(`document.querySelectorAll('.hero-node[data-step=${story.phase}]').length`);
check(
  "the hero's story steps on its own, and the rolling word and the lit preview show the same step",
  !!p0 &&
    stepped &&
    story.word === verb &&
    story.litNodes.length === wantNodes &&
    story.litNodes.every((s) => s === story.phase) &&
    (story.phase === "build" ? story.litWires.length === 0 : story.litWires.length === 2 && story.litWires.every((s) => s === story.phase)),
  JSON.stringify({ p0, ...story }),
);
await evaluate("document.getElementById('work').scrollIntoView({ block: 'start' }); true");
await sleep(800);
const offPhase = (await heroState()).phase;
await sleep(4000);
const stillPhase = (await heroState()).phase;
await evaluate("window.scrollTo(0, 0); true");
const resumed = await waitFor(`document.querySelector('[data-hero]').dataset.phase !== ${JSON.stringify(stillPhase)}`, 5000);
check("the story pauses while the hero is off screen and resumes on return", offPhase === stillPhase && resumed, `${offPhase} → ${stillPhase}, resumed ${resumed}`);

// The pause button (WCAG 2.2.2): it holds the story where it stands, the choice survives a reload, and play carries on.
const motion = () =>
  evaluate(`(() => { const hero = document.querySelector('[data-hero]'); const packets = [...hero.querySelectorAll('.hero-packet')]; return { phase: hero.dataset.phase ?? null, paused: hero.hasAttribute('data-paused'), packetsStill: packets.length > 0 && packets.every(p => getComputedStyle(p).animationName === 'none'), label: hero.querySelector('.hero-motion').getAttribute('aria-label') }; })()`);
await evaluate("window.scrollTo(0, 0); true");
await mouseAt("[data-hero] .hero-motion");
const heldAt = (await motion()).phase;
await sleep(4200);
const held = await motion();
check(
  "the pause button holds the story where it stands and stops the packets",
  !!heldAt && held.phase === heldAt && held.paused && held.packetsStill && held.label === "Play animation",
  JSON.stringify({ heldAt, ...held }),
);
await load("/", DESKTOP);
await sleep(3600);
const pauseKept = await motion();
check("a pause is remembered on the next visit: the story stays at rest", pauseKept.phase === null && pauseKept.label === "Play animation", JSON.stringify(pauseKept));
await mouseAt("[data-hero] .hero-motion");
const playedOn = await waitFor(`document.querySelector('[data-hero]').dataset.phase === 'ship'`, 5000);
check("play starts the story again and forgets the pause", playedOn && (await motion()).label === "Pause animation" && (await evaluate("localStorage.getItem('hero-motion')")) === null, String(playedOn));
await evaluate("window.scrollTo({ top: document.querySelector('h1').getBoundingClientRect().bottom + scrollY + 40, behavior: 'instant' }); true");
await sleep(900);
const scrolledName = await navName();
await evaluate("window.scrollTo({ top: 0, behavior: 'instant' }); true");
await sleep(900);
const backName = await navName();
check(
  "the nav's name joins the monogram once the hero's has scrolled away, and leaves again at the top",
  scrolledName === "1" && backName === "0",
  `${scrolledName} / ${backName}`,
);
await load("/work/avd-automation", DESKTOP);
const workName = await navName();
check("on a case study the nav shows the name from the start", workName === "1", workName);
await load("/", { width: 1024, height: 768, mobile: false });
const split = await evaluate(`(() => {
  const h1 = document.querySelector('h1');
  const fs = parseFloat(getComputedStyle(h1).fontSize);
  return {
    nameLines: Math.round(h1.getBoundingClientRect().height / (fs * 0.92)),
    wrapped: [...document.querySelectorAll('.hero-zone li, .hero-chip')].filter(e => e.getBoundingClientRect().height > 34).map(e => e.textContent),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
})()`);
check(
  "at 1024, the narrowest split, the name holds one line and no preview label wraps",
  split.nameLines === 1 && split.wrapped.length === 0 && split.overflow === 0,
  JSON.stringify(split),
);
await shot(`${LABEL}-hero-1024`);
await load("/", MOBILE);
const phonePreview = await evaluate("getComputedStyle(document.querySelector('[data-hero] > div:nth-child(2)')).display");
check("below lg the hero is text only", phonePreview === "none", phonePreview);
await load("/", DESKTOP);

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
  "credentials: five verify links, one per certification, open safely in a new tab",
  verifyLinks.length === 5 && verifyLinks.every((v) => v === "_blank noopener noreferrer"),
  verifyLinks.join(" | "),
);
// Both own repos came off the site on 2026-10-21 and the fork stays hidden, so the GitHub section has nothing to show.
const repos = await evaluate(
  `({ section: !!document.getElementById('github'), unlisted: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /Rag-Assistant-Chatbot|Automatic-Deployment|Natural-Language-to-Robot/.test(h)) })`,
);
check("GitHub: no section and no link to an unlisted repo", !repos.section && repos.unlisted.length === 0, JSON.stringify(repos));

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
const toastBox = await evaluate(`(() => { const t = [...document.querySelectorAll('li')].find(li => li.textContent.includes('Email address copied')); if (!t) return null; const r = t.getBoundingClientRect(); return { right: Math.round(innerWidth - r.right), bottom: Math.round(innerHeight - r.bottom), inBody: t.closest('#contact') === null }; })()`);
check("the copy toast rises in the viewport's corner, outside the section", !!toastBox && toastBox.inBody && toastBox.right >= 0 && toastBox.right < 40 && toastBox.bottom >= 0 && toastBox.bottom < 40, JSON.stringify(toastBox));

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
const phoneFirstScreen = await firstScreenOf();
check("on a 375x812 phone the hero's proof lines are on the first screen", phoneFirstScreen.proof, JSON.stringify(phoneFirstScreen));
const svgShown = await evaluate("getComputedStyle(document.querySelector('figure')?.parentElement ?? document.body).display");
check("drawing replaced by the stack below md", svgShown === "none", svgShown);
await mouseAt("button[aria-label='Open menu']");
// The menu loads on first use, so wait for it rather than reading the page straight after the tap.
const menuOpen = await waitFor("!!document.querySelector('[role=dialog]')", 3000);
check("mobile menu opens", menuOpen);
await shot(`${LABEL}-mobile-menu`);
// Copying from inside the modal menu: its toast must be readable and dismissable while the menu is open.
await mouseAt("[role=dialog] button[aria-label='Copy email address']");
const menuToast = await waitFor(`document.body.innerText.includes('Email address copied') || document.body.innerText.includes('Address selected')`, 3000);
const reach = await evaluate(`(() => { const close = [...document.querySelectorAll('button[aria-label=Dismiss]')].pop(); if (!close) return null; const r = close.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { hit: !!hit && close.contains(hit), hidden: !!close.closest('[aria-hidden=true]') }; })()`);
await mouseAt("button[aria-label=Dismiss]");
const dismissed = await waitFor("!document.querySelector('button[aria-label=Dismiss]')", 2000);
check("copying from the mobile menu raises a toast that can be read and dismissed", menuToast && !!reach && reach.hit && !reach.hidden && dismissed, JSON.stringify({ menuToast, reach, dismissed }));
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

// ---------- Reflow at 320 (WCAG 1.4.10), keyboard reach and focus, unknown share-card slug ----------
// 360 too: the commonest Android width, and the narrowest where the nav shows its name beside the Resume link.
for (const width of [320, 360]) {
  for (const path of ["/", cardHrefs[0]]) {
    await load(path, { width, height: 640, mobile: true });
    const o = await evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
    check(`${path} at ${width}: no horizontal scroll`, o === 0, `overflow ${o}px`);
  }
}
await load("/", DESKTOP);
await evaluate("document.activeElement?.blur(); window.scrollTo(0, 0); true");
const focusables = await evaluate(`[...document.querySelectorAll('a[href], button:not([disabled])')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('[aria-hidden=true]') && getComputedStyle(el).visibility !== 'hidden'; }).length`);
const seen = new Set();
const unringed = [];
for (let i = 0; i < focusables + 10; i++) {
  await key("Tab", "Tab", 9);
  // A custom-element host (next dev's tools badge, nextjs-portal) isn't part of the site.
  const f = await evaluate(`(() => { const a = document.activeElement; if (!a || a === document.body || a.tagName.includes('-')) return null; const s = getComputedStyle(a), after = getComputedStyle(a, '::after'); const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none' || after.boxShadow !== 'none'; const id = a.getAttribute('href') || a.getAttribute('aria-label') || a.textContent.trim().slice(0, 30); return { id: a.tagName + ':' + id + ':' + [...document.querySelectorAll(a.tagName)].indexOf(a), label: id, ring }; })()`);
  if (!f || seen.has(f.id)) continue;
  seen.add(f.id);
  if (!f.ring) unringed.push(f.label);
}
check("Tab reaches every visible control on the home page", seen.size >= focusables, `${seen.size} reached of ${focusables}`);
check("every focused control shows a visible focus indicator", unringed.length === 0, unringed.slice(0, 6).join(" | "));
const ogMissing = await evaluate(`fetch('/work/not-a-case-study/opengraph-image').then(r => r.status)`);
check("an unknown case study has no share card", ogMissing === 404, String(ogMissing));
// /work has no page of its own: a trimmed case-study URL lands on the work section, not the 404.
const workIndex = await fetch(`${BASE}/work`, { redirect: "manual" });
check("/work redirects to the work section on home", workIndex.status === 307 && /\/#work$/.test(workIndex.headers.get("location") ?? ""), `${workIndex.status} ${workIndex.headers.get("location")}`);

// ---------- Stack chips keep their height; the hero's separator never dangles ----------
await load("/", DESKTOP);
const chipH = await evaluate("[...document.querySelectorAll('#stack h3 + ul > li')].map(li => Math.round(li.getBoundingClientRect().height))");
check("Stack chips are one height at 1440, whatever their row's heading does", chipH.length > 40 && Math.max(...chipH) - Math.min(...chipH) <= 2, `${Math.min(...chipH)}–${Math.max(...chipH)}px over ${chipH.length}`);
const danglingSeparator = () =>
  evaluate(`(() => {
    const p = document.querySelector('section[aria-labelledby=hero-name] p');
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    const chars = [];
    for (let n; (n = walker.nextNode()); ) {
      if (n.parentElement.closest('.sr-only')) continue;
      for (let i = 0; i < n.length; i++) {
        if (!n.data[i].trim()) continue;
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const b = r.getBoundingClientRect();
        if (b.width > 0) chars.push({ c: n.data[i], top: Math.round(b.top) });
      }
    }
    return chars.some((ch, i) => ch.c === '·' && (i === chars.length - 1 || chars[i + 1].top > ch.top + 4 || (i > 0 && chars[i - 1].top < ch.top - 4)));
  })()`);
for (const v of [MOBILE, DESKTOP]) {
  await load("/", v);
  check(`at ${v.width} the hero's role line never starts or ends a line on its separator`, !(await danglingSeparator()));
}

// ---------- Case studies ----------
// In the drawing a width shows (desktop from md, the phone layout below it): every node's text inside its box, and
// edge labels clear of nodes. A hidden drawing has no boxes to measure, so each check names the one on screen.
const drawingFits = (which) =>
  evaluate(`(() => {
    const root = '[data-drawing=${which}]';
    const clipped = [...document.querySelectorAll(root + ' [data-node]')].filter(g => { const r = g.querySelector('rect').getBBox(); return [...g.querySelectorAll('text')].some(t => { const b = t.getBBox(); return b.x < r.x || b.x + b.width > r.x + r.width - 4 || b.y < r.y || b.y + b.height > r.y + r.height; }); }).map(g => g.dataset.node);
    const rects = [...document.querySelectorAll(root + ' [data-node] rect')].map(r => r.getBBox());
    const labelHits = [...document.querySelectorAll(root + ' [data-edge-label]')].filter(t => { const b = t.getBBox(); return rects.some(r => b.x < r.x + r.width && r.x < b.x + b.width && b.y < r.y + r.height && r.y < b.y + b.height); }).map(t => t.textContent);
    return { clipped, labelHits };
  })()`);
for (const href of cardHrefs) {
  const slug = href.split("/").pop();
  await load(href, DESKTOP);
  const page = await evaluate(
    `({ h1: document.querySelector('h1')?.textContent ?? '', sections: [...document.querySelectorAll('article h2')].map(h => h.textContent), drawn: getComputedStyle(document.querySelector('[data-drawing=desktop]')).display !== 'none' })`,
  );
  check(
    `${slug}: headline, required sections and drawing render`,
    !!page.h1 && ["Context", "Architecture", "Results"].every((s) => page.sections.includes(s)) && page.drawn,
    page.sections.join(" | "),
  );
  const desk = await drawingFits("desktop");
  check(`${slug}: every node's text fits its box`, desk.clipped.length === 0, desk.clipped.join(", "));
  check(`${slug}: edge labels clear of nodes`, desk.labelHits.length === 0, desk.labelHits.join(", "));
  await shot(`${LABEL}-work-${slug}-desktop-full`, { fullPage: true });

  for (const width of [768, 1024, 1440]) {
    await load(href, { width, height: 900, mobile: false });
    const px = Number(await minSvgFont("[data-drawing=desktop] svg"));
    check(`${slug}: diagram text >= 11px at ${width}`, px >= 11, `${px}px`);
  }

  // Phones get the drawing laid out for a tall screen, never a list, with its text at 11px or more.
  for (const width of [360, 375, 414]) {
    await load(href, { width, height: 800, mobile: true });
    const phone = await evaluate(
      `({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, desktopHidden: getComputedStyle(document.querySelector('[data-drawing=desktop]')).display === 'none', phoneShown: document.querySelector('[data-drawing=phone] svg').getBoundingClientRect().height > 0, listHidden: (() => { const r = document.querySelector('[data-diagram] [data-connections]').closest('.sr-only').getBoundingClientRect(); return r.width <= 1 && r.height <= 1; })() })`,
    );
    const px = Number(await minSvgFont("[data-drawing=phone] svg"));
    check(
      `${slug} at ${width}: the phone drawing replaces the desktop one, text >= 11px, no horizontal scroll`,
      phone.overflow === 0 && phone.desktopHidden && phone.phoneShown && phone.listHidden && px >= 11,
      JSON.stringify({ ...phone, px }),
    );
  }

  await load(href, MOBILE);
  const fits = await drawingFits("phone");
  check(`${slug}: on a phone every node's text fits its box and edge labels clear nodes`, fits.clipped.length === 0 && fits.labelHits.length === 0, JSON.stringify(fits));
  // A chip lights its step in the drawing (persimmon arrows included), says why, and pins it to the URL; a second tap clears.
  await mouseAt("[data-diagram] [role=group] button:nth-child(1)");
  const traced = await evaluate(
    `(() => { const edges = [...document.querySelectorAll('[data-drawing=phone] path[data-lit]')]; return { nodes: document.querySelectorAll('[data-drawing=phone] [data-node][data-lit]').length, edges: edges.length, arrows: edges.every(p => getComputedStyle(p).markerEnd.includes('-arrow-lit')), caption: document.querySelector('[data-diagram] [aria-live]').textContent, url: location.search }; })()`,
  );
  check(
    `${slug}: tapping a chip lights its step in the phone drawing, explains it and pins it`,
    traced.nodes > 0 && traced.edges > 0 && traced.arrows && !traced.caption.startsWith("Pick") && traced.url.includes("trace="),
    JSON.stringify(traced),
  );
  await shot(`${LABEL}-work-${slug}-mobile-trace`);
  await mouseAt("[data-diagram] [role=group] button:nth-child(1)");
  check(`${slug}: tapping the chip again clears it`, (await litCount()) === 0 && !(await evaluate("location.search")).includes("trace"));
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

// ---------- Security headers (lib/security-headers.ts) ----------
// no-store: a response Chrome serves from its HTTP cache drops some headers (HSTS among them).
const SECURITY_HEADERS = ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy", "cross-origin-opener-policy"];
const headerGaps = await evaluate(`Promise.all(${JSON.stringify(["/", cardHrefs[0], "/no-such-page", "/robots.txt", "/opengraph-image", "/favicon.ico", "/MihirBhavsar_Resume.pdf"])}.map((p) =>
  fetch(p, { cache: "no-store" }).then((r) => ({ p, missing: ${JSON.stringify(SECURITY_HEADERS)}.filter((h) => !r.headers.has(h)), poweredBy: r.headers.get("x-powered-by"), framing: /frame-ancestors 'none'/.test(r.headers.get("content-security-policy") ?? "") }))
)).then((all) => all.filter((r) => r.missing.length || r.poweredBy || !r.framing))`);
check("pages, files and the 404 send the security headers, and no X-Powered-By", headerGaps.length === 0, JSON.stringify(headerGaps));

// ---------- Section reveal ----------
await load("/", DESKTOP);
const before = await evaluate(`(() => { const r = document.querySelector('#work .reveal'); return { animate: r.hasAttribute('data-animate'), inview: r.hasAttribute('data-inview'), opacity: getComputedStyle(r).opacity }; })()`);
await evaluate("document.getElementById('work').scrollIntoView({ block: 'start' }); true");
await sleep(1200);
const after = await evaluate(`(() => { const r = document.querySelector('#work .reveal'); return { inview: r.hasAttribute('data-inview'), opacity: getComputedStyle(r).opacity, transform: getComputedStyle(r).transform }; })()`);
check(
  "an off-screen section waits, then rises into place once it scrolls into view",
  before.animate && !before.inview && before.opacity === "0" && after.inview && after.opacity === "1" && after.transform === "none",
  JSON.stringify({ before, after }),
);
const reveals = await evaluate("[...document.querySelectorAll('.reveal')].map(r => r.closest('section')?.id)");
check("the page has one section reveal, on Selected work", reveals.length === 1 && reveals[0] === "work", reveals.join(", "));
await load("/?deep#work", DESKTOP); // a query makes it a fresh document, not a same-page hash jump
const deep = await evaluate(`(() => { const r = document.querySelector('#work .reveal'); return { animate: r.hasAttribute('data-animate'), opacity: getComputedStyle(r).opacity, top: Math.round(document.getElementById('work').getBoundingClientRect().top) }; })()`);
check("a deep link leaves the section it lands on at rest", !deep.animate && deep.opacity === "1", JSON.stringify(deep));
await load("/?land#credentials", DESKTOP); // its own query: a hash-only change from the last URL fires no load
const landed = await evaluate("Math.round(document.getElementById('credentials').getBoundingClientRect().top)");
check("a direct #credentials link lands on the section", Math.abs(landed - 80) <= 24, `top ${landed}px`);
await load("/", DESKTOP);
await send("Emulation.setEmulatedMedia", { media: "print", features: LIGHT });
const printed = await evaluate("[...document.querySelectorAll('.reveal')].map(r => getComputedStyle(r).opacity).every(o => o === '1')");
await send("Emulation.setEmulatedMedia", { media: "", features: LIGHT });
check("printing shows every section, revealed or not", printed);
// A viewport that grows after load (crawlers expand it to the page height) must still reveal every section.
await load("/", DESKTOP);
await send("Emulation.setDeviceMetricsOverride", { ...current, height: await evaluate("document.documentElement.scrollHeight") });
await sleep(1500);
const tallHidden = await evaluate("[...document.querySelectorAll('.reveal')].filter(r => getComputedStyle(r).opacity !== '1').map(r => r.closest('section')?.id)");
await send("Emulation.setDeviceMetricsOverride", current);
check("a viewport grown to the page's height reveals every section", tallHidden.length === 0, tallHidden.join(", "));

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
      googlebot: meta('googlebot'),
      // Every node's type, a @graph's and a ProfilePage's mainEntity included.
      ld: [...d.querySelectorAll('script[type="application/ld+json"]')].flatMap(s => { const j = JSON.parse(s.textContent); return (j['@graph'] ?? [j]).flatMap(n => [n['@type'], n.mainEntity?.['@type']]).filter(Boolean); }),
      icons: [...d.querySelectorAll('link[rel=icon], link[rel=apple-touch-icon]')].map(l => l.rel + ' ' + l.getAttribute('href').split('?')[0]),
    };
  })`);
const homeHead = await head("/");
const indexable = (h) => h.robots.length === 1 && h.robots[0] === "index, follow" && /max-image-preview:large/.test(h.googlebot ?? "");
check(
  "home: indexable, canonical, its own share block, and the site, profile page and person",
  // Next prints the root canonical without its slash; http://x and http://x/ are the same URL.
  new URL(homeHead.canonical ?? "x:").pathname === "/" &&
    indexable(homeHead) &&
    homeHead.ogType === "website" &&
    /\/opengraph-image/.test(homeHead.ogImage ?? "") &&
    ["WebSite", "ProfilePage", "Person"].every((t) => homeHead.ld.includes(t)),
  JSON.stringify(homeHead),
);
const iconFiles = await evaluate(`Promise.all(['/favicon.ico', '/apple-icon'].map((p) => fetch(p).then((r) => ({ p, status: r.status, type: r.headers.get('content-type') }))))`);
check(
  "a favicon.ico, the SVG icon and an Apple touch icon, each served",
  ["icon /favicon.ico", "icon /icon.svg", "apple-touch-icon /apple-icon"].every((i) => homeHead.icons.includes(i)) &&
    iconFiles.every((f) => f.status === 200 && /^image\//.test(f.type ?? "")),
  JSON.stringify({ icons: homeHead.icons, iconFiles }),
);
for (const href of cardHrefs) {
  const h = await head(href);
  check(
    `${href}: indexable, its own canonical, title, URL and card, and an Article`,
    (h.canonical ?? "").endsWith(href) &&
      indexable(h) &&
      (h.ogUrl ?? "").endsWith(href) &&
      h.ogType === "article" &&
      h.ogTitle?.startsWith(h.title.split(" — ")[0]) &&
      (h.ogImage ?? "").includes(`${href}/opengraph-image`) &&
      h.site === "Mihir Bhavsar" &&
      h.ld.includes("Article"),
    JSON.stringify(h),
  );
}
// On a deployment, EXPECT_ORIGIN (e.g. https://portfolio.vercel.app) checks the
// built-in origin is the real one: links, share cards and the sitemap pointing
// at localhost would pass every path check above.
if (process.env.EXPECT_ORIGIN) {
  const want = new URL(process.env.EXPECT_ORIGIN).origin;
  const origins = await evaluate(`(async () => {
    const sitemap = await (await fetch('/sitemap.xml')).text();
    const robots = await (await fetch('/robots.txt')).text();
    return {
      locs: [...sitemap.matchAll(/<loc>([^<]+)<\\/loc>/g)].map(m => new URL(m[1]).origin),
      robots: (robots.match(/Sitemap:\\s*(\\S+)/) ?? [])[1] ?? null,
    };
  })()`);
  const seen = [homeHead.canonical, homeHead.ogUrl, homeHead.ogImage, origins.robots, ...origins.locs].map((u) => (u ? new URL(u).origin : null));
  check(`canonical, share URLs, robots and the sitemap all use ${want}`, seen.length > 4 && seen.every((o) => o === want), JSON.stringify([...new Set(seen)]));
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
// Colour transitions started by the switch (the hero's own story and the hovered toggle aside).
await evaluate(`window.__themeTransitions = 0; document.addEventListener('transitionrun', (e) => { if (!e.target.closest('[data-hero], .theme-toggle')) window.__themeTransitions++; }, true); true`);
await mouseAt("header button.theme-toggle");
const switchTransitions = await evaluate("window.__themeTransitions");
check("the theme switches in one frame: nothing eases from the old colours", switchTransitions === 0, `${switchTransitions} transitions`);
const toggled = { theme: await theme(), bg: await canvas(), label: await evaluate("document.querySelector('header button.theme-toggle').getAttribute('aria-label')") };
await load("/", DESKTOP);
const remembered = await theme();
check("the toggle switches the theme and remembers it", toggled.theme === "dark" && toggled.bg === "rgb(10, 10, 10)" && toggled.label === "Switch to light theme" && remembered === "dark", JSON.stringify({ toggled, remembered }));
await shot(`${LABEL}-desktop-dark`);
await shot(`${LABEL}-desktop-dark-full`, { fullPage: true });
await load("/", MOBILE);
await shot(`${LABEL}-mobile-dark-full`, { fullPage: true });
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
const restingReduced = await evaluate("getComputedStyle(document.querySelector('#work .reveal')).opacity");
check("reduced motion: off-screen sections are fully visible", restingReduced === "1", restingReduced);
const heroReduced = await evaluate(
  `({ phase: document.querySelector('[data-hero]').dataset.phase ?? null, sentence: getComputedStyle(document.querySelector('.hero-static')).clipPath, rolling: getComputedStyle(document.querySelector('.hero-rolling')).display, pause: getComputedStyle(document.querySelector('.hero-motion')).display })`,
);
check(
  "reduced motion: the hero rests, its line read as one sentence, with no pause button (nothing moves)",
  heroReduced.phase === null && heroReduced.sentence === "none" && heroReduced.rolling === "none" && heroReduced.pause === "none",
  JSON.stringify(heroReduced),
);
await send("Emulation.setEmulatedMedia", { features: LIGHT });

// ---------- JavaScript off ----------
await send("Emulation.setScriptExecutionDisabled", { value: true });
await load("/", DESKTOP, { scripts: false });
await send("Emulation.setScriptExecutionDisabled", { value: false });
const noJs = await evaluate(`({ figures: document.querySelectorAll('#outcomes ul .type-figure').length, provenance: document.querySelectorAll('[id^=proof-][id$=-how]').length, name: document.querySelector('h1')?.textContent, sections: ['work', 'experience', 'stack', 'credentials', 'contact'].filter(id => document.getElementById(id)).length, revealOpacity: getComputedStyle(document.querySelector('#work .reveal')).opacity })`);
check("content complete with JavaScript off", noJs.figures === 6 && noJs.provenance === 6 && !!noJs.name && noJs.sections === 5 && noJs.revealOpacity === "1", JSON.stringify(noJs));
const noJsLine = await evaluate(
  `({ sentence: getComputedStyle(document.querySelector('.hero-static')).clipPath, rolling: getComputedStyle(document.querySelector('.hero-rolling')).display, pause: getComputedStyle(document.querySelector('.hero-motion')).display })`,
);
check(
  "with JavaScript off the hero's line reads as one sentence, and the pause button (which would do nothing) hides",
  noJsLine.sentence === "none" && noJsLine.rolling === "none" && noJsLine.pause === "none",
  JSON.stringify(noJsLine),
);
await shot(`${LABEL}-desktop-nojs`);

await send("Emulation.setScriptExecutionDisabled", { value: true });
await load(cardHrefs[0], DESKTOP, { scripts: false });
await send("Emulation.setScriptExecutionDisabled", { value: false });
const noJsWork = await evaluate(
  `({ h1: !!document.querySelector('h1'), sections: document.querySelectorAll('article h2').length, edges: document.querySelectorAll('[data-diagram] [data-edge]').length })`,
);
check("a case study is complete with JavaScript off", noJsWork.h1 && noJsWork.sections >= 5 && noJsWork.edges > 0, JSON.stringify(noJsWork));

// ---------- Accessibility engine (axe-core) ----------
// Every route, in both themes, at desktop and phone widths: WCAG 2.0–2.2 A and AA rules and axe's best
// practices, plus label-in-name (WCAG 2.5.3), which axe ships switched off. CDP's evaluate isn't bound by
// the page's CSP, so the engine goes in straight from node_modules (npm ci installs it; see package.json).
const axePath = join(process.cwd(), "node_modules", "axe-core", "axe.min.js");
const axeSource = existsSync(axePath) ? readFileSync(axePath, "utf8") : null;
check("axe-core is installed for the accessibility pass", !!axeSource, axePath);
if (axeSource) {
  await send("Emulation.setEmulatedMedia", { features: LIGHT });
  await load("/", DESKTOP);
  await evaluate("localStorage.clear(); true"); // no stored theme or pause: the system setting decides
  const findings = [];
  let runs = 0;
  for (const scheme of ["light", "dark"]) {
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] });
    for (const view of [DESKTOP, MOBILE]) {
      for (const path of ["/", ...cardHrefs, "/no-such-page"]) {
        await load(path, view);
        // Scroll through once so the one section reveal has played, then rest at the top.
        await evaluate("(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); return true; })()");
        await sleep(900);
        await evaluate(`${axeSource}; true`);
        const violations = await evaluate(
          "axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, rules: { 'label-content-name-mismatch': { enabled: true } }, resultTypes: ['violations'] }).then((r) => r.violations.map((v) => v.id + ' x' + v.nodes.length + ' at ' + v.nodes[0].target.join(' ')))",
        );
        runs++;
        for (const v of violations) findings.push(`${path} ${view.width}px ${scheme}: ${v}`);
      }
    }
  }
  await send("Emulation.setEmulatedMedia", { features: LIGHT });
  check(`axe: no violation on any route, theme or width (${runs} runs)`, findings.length === 0, findings.slice(0, 6).join(" | "));
}

check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

writeFileSync(join(OUT, `${LABEL}-results.json`), JSON.stringify(results, null, 2));
ws.close();
await closeBrowser();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
