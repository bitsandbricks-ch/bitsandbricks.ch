// Markdown habits of the old Grav kb, kept working for kb notes:
// - Grav rendered every line break as a <br>, and the imported notes rely on it ("No type 3
//   LSA\nNo type 5 LSA" are separate lines there). Plain Markdown joins them into one sentence.
// - Callouts written Obsidian/GitHub style: "> [!note]" becomes a labelled callout box.
const CALLOUT = /^\[!(\w+)\][-+]?\s*/;

export const kbLineBreaks = (ctx) =>
  ctx.fileURL && /\/content\/docs\/kb\//.test(ctx.fileURL.pathname) && {
    name: "kb-line-breaks",
    text(node, v) {
      const para = v.parent(node);
      if (para?.type !== "paragraph") return;
      let value = node.value;
      const out = [];
      const quote = v.parent(para);
      const m = quote?.type === "blockquote" && v.indexOf(para) === 0 && v.indexOf(node) === 0 && CALLOUT.exec(value);
      if (m) {
        const kind = m[1].toLowerCase();
        v.setField(quote, "data", { hProperties: { className: ["callout", "callout-" + kind] } });
        out.push({ type: "strong", data: { hProperties: { className: ["callout-label"] } }, children: [{ type: "text", value: kind }] });
        value = value.slice(m[0].length).replace(/^\n/, "");
      }
      if (!m && !value.includes("\n")) return;
      value.split("\n").forEach((t, i) => { if (i) out.push({ type: "break" }); if (t) out.push({ type: "text", value: t }); });
      v.replaceNode(node, out);
    },
  };
