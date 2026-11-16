// Unit tests for the pure kb helpers. Run: npm test (node --test, no extra dependencies).
import { test } from "node:test";
import assert from "node:assert/strict";
import { url, buildTree, flatTree, linksOf, foldersOf, folderInfo, branchPoint, radial, layout, related, parentOf, type Doc } from "../src/lib/kb-core.ts";

const doc = (id: string, opts: { title?: string; tags?: string[]; order?: number; body?: string } = {}): Doc => ({
  id, body: opts.body ?? "", data: { title: opts.title ?? id.split("/").pop()!, tags: opts.tags ?? [], sidebar: { order: opts.order } },
});

test("url adds slashes and drops index", () => {
  assert.equal(url("kb/a/b"), "/kb/a/b/");
  assert.equal(url("courses/x/index"), "/courses/x/");
});

test("buildTree nests folders, sorts by order then name, numbers naturally", () => {
  const docs = [doc("kb/b/z"), doc("kb/b/a"), doc("kb/top", { order: 1 }), doc("kb/c/10-x/n"), doc("kb/c/2-y/n"), doc("blog/x")];
  const tree = buildTree(docs, "kb");
  assert.deepEqual(tree.map((i) => (i.kind === "dir" ? i.label : i.label)), ["top", "b/", "c/"]);
  const b = tree[1];
  assert.ok(b.kind === "dir");
  assert.equal(b.id, "kb/b");
  assert.deepEqual(b.items.map((i) => i.label), ["a", "z"]);
  const c = tree[2];
  assert.ok(c.kind === "dir");
  assert.deepEqual(c.items.map((i) => i.label), ["y/", "x/"], "2-y before 10-x, prefix stripped");
  assert.deepEqual(flatTree(tree).map((l) => l.id), ["kb/top", "kb/b/a", "kb/b/z", "kb/c/2-y/n", "kb/c/10-x/n"]);
});

test("linksOf resolves absolute, relative, .md and anchors, skips outside links and itself", () => {
  const ids = new Set(["kb/r/ospf/lsa", "kb/r/ospf/areas", "kb/r/bgp/basics", "kb/s/stp"]);
  const d = doc("kb/r/ospf/areas", { body: "[a](../bgp/basics/) [b](./lsa.md#types) [c](/kb/s/stp/) [d](https://example.com/kb/s/stp/) [e](lsa) [self](./areas/) [gone](../nope/)" });
  assert.deepEqual(linksOf(d, ids).sort(), ["kb/r/bgp/basics", "kb/r/ospf/lsa", "kb/s/stp"]);
});

test("folders: every level, direct children and branch point", () => {
  const notes = [doc("kb/cisco/campus/routing/ospf/a"), doc("kb/cisco/campus/routing/b"), doc("kb/cisco/campus/switching/c")];
  assert.deepEqual(foldersOf(notes.map((n) => n.id)), ["kb", "kb/cisco", "kb/cisco/campus", "kb/cisco/campus/routing", "kb/cisco/campus/routing/ospf", "kb/cisco/campus/switching"]);
  const r = folderInfo(notes, "kb/cisco/campus/routing");
  assert.deepEqual(r.dirs, ["kb/cisco/campus/routing/ospf"]);
  assert.deepEqual(r.notes.map((n) => n.id), ["kb/cisco/campus/routing/b"]);
  assert.equal(r.total, 2);
  assert.equal(branchPoint(notes).id, "kb/cisco/campus", "skips the single-folder chain");
  assert.equal(parentOf("kb/a/b"), "kb/a");
});

test("radial puts the root in the middle and every node inside the box", () => {
  const ids = ["kb/x", "kb/x/a", "kb/x/a/1", "kb/x/a/2", "kb/x/b", "kb/x/b/3"];
  const P = radial("kb/x", ids, 400, 300);
  assert.deepEqual([P["kb/x"].x, P["kb/x"].y], [200, 150]);
  for (const id of ids) {
    assert.ok(P[id].x >= 0 && P[id].x <= 400 && P[id].y >= 0 && P[id].y <= 300, id);
  }
});

test("layout is deterministic and keeps nodes apart and inside the box", () => {
  const nodes = Array.from({ length: 40 }, (_, i) => ({ id: "n" + i }));
  const edges = nodes.slice(1).map((n) => ({ a: "n0", b: n.id }));
  const a = layout(nodes, edges, 340, 230, 5), b = layout(nodes, edges, 340, 230, 5);
  assert.deepEqual(a, b);
  const pts = Object.values(a);
  for (const p of pts) assert.ok(p.x >= 18 && p.x <= 322 && p.y >= 18 && p.y <= 212);
  // not all piled into one spot or one line
  const ys = new Set(pts.map((p) => Math.round(p.y / 20)));
  assert.ok(ys.size > 4, "spread over the height");
});

test("related ranks shared tags first, then the nearest folder", () => {
  const me = doc("kb/r/ospf/auth", { tags: ["ospf", "security"] });
  const notes = [me, doc("kb/s/x", { tags: ["ospf"] }), doc("kb/r/ospf/y", { tags: ["ospf"] }), doc("kb/r/z", { tags: ["ospf", "security"] }), doc("kb/q", { tags: ["bgp"] })];
  assert.deepEqual(related(me, notes).map((n) => n.id), ["kb/r/z", "kb/r/ospf/y", "kb/s/x"]);
  assert.deepEqual(related(doc("kb/none"), notes), []);
});

test("codeBlocks finds fenced code and skips diagrams", async () => {
  const { codeBlocks } = await import("../src/lib/kb-core.ts");
  const body = "text\n```\nshow ip ospf neighbor\n```\nmore\n```cisco\nrouter ospf 1\n network 0.0.0.0 255.255.255.255 area 0\n```\n```mermaid\ngraph TD\n```\n````\n```nested```\n````\n";
  assert.deepEqual(codeBlocks(body), [
    { lang: "", code: "show ip ospf neighbor" },
    { lang: "cisco", code: "router ospf 1\n network 0.0.0.0 255.255.255.255 area 0" },
    { lang: "", code: "```nested```" },
  ]);
});
