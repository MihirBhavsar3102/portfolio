// Browser verification for the portfolio: drives Edge headless over the Chrome
// DevTools Protocol (Node 24 global WebSocket, zero dependencies), captures
// desktop/mobile screenshots and checks Trace, nav, a11y and motion behaviour.
// Usage: node scripts/verify-ui.mjs <baseUrl> <outDir> [label]
// Run against `next start` (and `next dev`); exits non-zero if any check fails.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , BASE = "http://localhost:3100", OUT = ".", LABEL = "prod"] = process.argv;
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9333;
const PROFILE = join(OUT, `cdp-profile-${Date.now()}`);
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

await send("Page.enable");
await send("Runtime.enable");
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
  const loaded = new Promise((r) => {
    const l = (m) => {
      if (m.method === "Page.loadEventFired") {
        listeners.splice(listeners.indexOf(l), 1);
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
check("both web fonts load", /Mona/.test(fontsLoaded) && /Fragment/.test(fontsLoaded), fontsLoaded + " | mono: " + monoFamily);
const figuresInView = await evaluate(`[...document.querySelectorAll('section[aria-labelledby=proof-heading] ul .type-figure')].filter(e => e.getBoundingClientRect().top < innerHeight).length`);
check("all six figures visible in the first 1440x900 viewport", figuresInView === 6, `${figuresInView} of 6`);

// Keyboard: focus the first figure button.
await evaluate("document.activeElement?.blur(); window.scrollTo(0,0); true");
let lit = 0;
for (let i = 0; i < 25 && lit === 0; i++) {
  await key("Tab", "Tab", 9);
  const onFigure = await evaluate("!!document.activeElement?.closest('section[aria-labelledby=proof-heading] ul')");
  if (onFigure) lit = await litCount();
}
check("keyboard focus on a figure lights its path", lit > 0, `${lit} lit elements`);
await shot(`${LABEL}-desktop-trace-focus`);
await key("Escape", "Escape", 27);
check("Escape clears the trace", (await litCount()) === 0);

// Mouse: pin then unpin, with the URL mirroring the pin.
await evaluate("document.activeElement?.blur(); true");
await mouseAt("section[aria-labelledby=proof-heading] ul li:nth-child(5) button");
const pinnedUrl = await evaluate("location.search");
const pinnedLit = await litCount();
check("click pins a figure and writes ?trace=", pinnedUrl.includes("trace=uptime") && pinnedLit > 0, `${pinnedUrl}, ${pinnedLit} lit`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
await sleep(250);
check("a pinned trace survives the pointer leaving", (await litCount()) === pinnedLit);
await shot(`${LABEL}-desktop-trace-pinned`);
await mouseAt("section[aria-labelledby=proof-heading] ul li:nth-child(5) button");
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
await sleep(250);
check("second click unpins and clears the URL", (await litCount()) === 0 && !(await evaluate("location.search")).includes("trace"));

// Escape clears a pin even after focus has moved elsewhere on the page.
await mouseAt("section[aria-labelledby=proof-heading] ul li:nth-child(2) button");
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

// ---------- Map legibility at the narrowest split and below it ----------
const minSvgFont = () =>
  evaluate(`(() => { const svg = document.querySelector('figure svg'); const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width; return Math.min(...[...svg.querySelectorAll('text')].map(t => Number(t.getAttribute('font-size')) * scale)).toFixed(2); })()`);
for (const width of [1024, 1280, 1440]) {
  await load("/", { width, height: 900, mobile: false });
  const px = Number(await minSvgFont());
  check(`map text >= 11px at ${width}`, px >= 11, `${px}px`);
  if (width === 1024) await shot(`${LABEL}-lg-1024-viewport`);
}
// Row two's labels (not just numerals) must be readable at 1440x900.
await load("/", DESKTOP);
const labelBottom = await evaluate(`Math.max(...[...document.querySelectorAll('section[aria-labelledby=proof-heading] li')].slice(3).map(li => li.querySelector('button span:last-child').getBoundingClientRect().bottom))`);
check("row two labels readable above the 900px fold", labelBottom <= 900, `label bottom ${Math.round(labelBottom)}px`);

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
await mouseAt("section[aria-labelledby=proof-heading] ul li:nth-child(1) button");
check("tap pins a figure on mobile and lights the stack", (await litCount()) > 0);
const pathLit = await evaluate(`getComputedStyle(document.querySelector('section[aria-labelledby=proof-heading] li p:last-child')).color`);
check("tapped cell's path line turns accent", pathLit.replace(/\s/g, "") === "rgb(76,141,255)", pathLit);
await shot(`${LABEL}-mobile-trace`);

// ---------- Reduced motion ----------
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await load("/", DESKTOP);
const running = await evaluate("document.getAnimations().length");
check("reduced motion runs no animations", running === 0, `${running} running`);
await send("Emulation.setEmulatedMedia", { features: [] });

// ---------- JavaScript off ----------
await send("Emulation.setScriptExecutionDisabled", { value: true });
await load("/", DESKTOP, { scripts: false });
await send("Emulation.setScriptExecutionDisabled", { value: false });
const noJs = await evaluate(`({ figures: document.querySelectorAll('section[aria-labelledby=proof-heading] ul .type-figure').length, provenance: document.querySelectorAll('[id^=proof-][id$=-how]').length, name: document.querySelector('h1')?.textContent })`);
check("content complete with JavaScript off", noJs.figures === 6 && noJs.provenance === 6 && !!noJs.name, JSON.stringify(noJs));
await shot(`${LABEL}-desktop-nojs`);

check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

writeFileSync(join(OUT, `${LABEL}-results.json`), JSON.stringify(results, null, 2));
ws.close();
edge.kill();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
