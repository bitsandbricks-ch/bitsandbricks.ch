// Grav rendered every line break in a kb note as a <br>, and the imported notes rely on it
// ("No type 3 LSA\nNo type 5 LSA" are separate lines there). Plain Markdown joins them into
// one sentence, so for kb notes a line break inside a paragraph becomes a real break again.
export const kbLineBreaks = (ctx) =>
  ctx.fileURL && /\/content\/docs\/kb\//.test(ctx.fileURL.pathname) && {
    name: "kb-line-breaks",
    text(node, v) {
      if (!node.value.includes("\n") || v.parent(node)?.type !== "paragraph") return;
      const out = [];
      node.value.split("\n").forEach((t, i) => { if (i) out.push({ type: "break" }); if (t) out.push({ type: "text", value: t }); });
      v.replaceNode(node, out);
    },
  };
