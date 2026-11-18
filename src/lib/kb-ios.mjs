// Marks up Cisco IOS code blocks in kb notes at build time (see ios-highlight.mjs). Blocks with a
// language other than cisco/ios, or that do not look like IOS, are left alone.
import { looksLikeIos, tokens } from "./ios-highlight.mjs";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const iosHtml = (code) =>
  `<pre class="ios"><code>${tokens(code).map(([c, t]) => (c ? `<span class="${c}">${esc(t)}</span>` : esc(t))).join("")}</code></pre>`;

/** The same decision as the Markdown plugin, for code taken straight from a note (cheat sheets) */
export const isIos = (lang, code) => (lang ? IOS_LANGS.includes(lang.toLowerCase()) : looksLikeIos(code));
const IOS_LANGS = ["cisco", "ios", "ios-xe", "nxos"];

export const kbIos = (ctx) =>
  ctx.fileURL && /\/content\/docs\/kb\//.test(ctx.fileURL.pathname) && {
    name: "kb-ios",
    code(node, v) {
      const lang = (node.lang || "").toLowerCase();
      if (!isIos(lang, node.value)) return;
      v.replaceNode(node, { type: "html", value: iosHtml(node.value) });
    },
  };
