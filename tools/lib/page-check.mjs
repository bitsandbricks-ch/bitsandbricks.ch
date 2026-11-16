// The per-page rules of tools/check.mjs, kept apart so they can be tested on small html strings.
// Link targets and anchors need the whole dist/ folder and stay in check.mjs.

/** Tags whose href/src makes the browser fetch something by itself (not a link a reader clicks) */
const FETCHES = new Set(["stylesheet", "preload", "modulepreload", "prefetch", "icon", "manifest", "apple-touch-icon"]);
/** The only other site a page may name in its CSP: giscus, loaded when a reader asks for comments */
const CSP_SITES = new Set(["https://giscus.app"]);

/** Problems with one built page, as short messages */
export function pageProblems(text, { notFound = false } = {}) {
  const out = [];
  const body = text.replace(/<script[\s\S]*?<\/script>/g, (s) => s.replace(/>[\s\S]*<\//, "></"));
  for (const [tag, name, attrs] of tags(body)) {
    for (const [attr, raw] of [["src", attrOf(attrs, "src")], ["href", attrOf(attrs, "href")]]) {
      if (raw == null || !/^(https?:)?\/\//i.test(raw)) continue;
      const rel = (attrOf(attrs, "rel") || "").toLowerCase().split(/\s+/);
      if (attr === "src" || (name === "link" && rel.some((r) => FETCHES.has(r)))) out.push(`loads ${raw} from another site`);
    }
    if (name === "script" && attrOf(attrs, "src") == null && !/type="application\/(ld\+)?json"/.test(attrs)) out.push("inline <script> (blocked by the CSP: move it to public/assets)");
    if (/\son[a-z]+="/i.test(attrs)) out.push(`inline handler (blocked by the CSP): ${tag.slice(0, 80)}`);
    if (name === "img" && attrOf(attrs, "alt") == null) out.push(`image without alt: ${tag.slice(0, 80)}`);
  }
  if (/http-equiv="refresh"/.test(text)) return out; // redirect pages for moved notes
  if (!/<html[^>]*\slang="/.test(text)) out.push("no lang on <html>");
  if (!/<title>[^<]+<\/title>/.test(text)) out.push("no <title>");
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (!notFound && h1 !== 1) out.push(`${h1} <h1> elements`);
  const seen = new Set();
  for (const [, id] of body.matchAll(/\sid="([^"]+)"/g)) { if (seen.has(id)) out.push(`duplicate id "${id}"`); seen.add(id); }
  const csp = text.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/);
  if (!csp) out.push("no Content-Security-Policy");
  else out.push(...cspProblems(csp[1].replace(/&#39;|&apos;/g, "'")));
  return out;
}

/** A policy that lets in other sites or inline code would quietly undo "no outside requests" */
export function cspProblems(policy) {
  const out = [];
  for (const site of policy.match(/https?:\/\/[^\s;']+/g) ?? []) if (!CSP_SITES.has(site)) out.push(`CSP allows ${site}`);
  if (/(^|\s)(\*|https?:|data:)(?=[\s;]|$)/.test(policy.replace(/img-src[^;]*/, ""))) out.push("CSP allows any site (* or a bare scheme)");
  if (/'unsafe-eval'/.test(policy)) out.push("CSP allows eval");
  if (/script-src[^;]*'unsafe-inline'/.test(policy)) out.push("CSP allows inline scripts");
  return out;
}

/** Outside url(...) in a stylesheet */
export function cssProblems(css) {
  return [...css.matchAll(/(?:url\(\s*['"]?|@import\s+['"])((?:https?:)?\/\/[^'")]+)/g)].map((m) => `loads ${m[1]} from another site`);
}

function* tags(html) {
  for (const m of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)) yield [m[0], m[1].toLowerCase(), m[2]];
}
function attrOf(attrs, name) {
  const m = attrs.match(new RegExp(`(?:^|\\s)${name}(?:="([^"]*)"|(?=[\\s/]|$))`, "i"));
  return m ? (m[1] ?? "") : null;
}
