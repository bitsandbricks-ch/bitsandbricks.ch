import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "yaml";
import { plan, slug } from "../tools/new.mjs";

const fm = (text) => parse(text.match(/^---\n([\s\S]*?)\n---/)[1]);

test("slug", () => {
  assert.equal(slug("OSPF: LSA Types & Areas"), "ospf-lsa-types-and-areas");
  assert.equal(slug("Zürich Lab"), "zurich-lab");
});

test("a note lands in its kb folder with the folder as tag", () => {
  const { file, text } = plan(["note", "kb/cisco/campus/routing/ospf/", "OSPF: LSA Types"]);
  assert.match(file, /src\/content\/docs\/kb\/cisco\/campus\/routing\/ospf\/ospf-lsa-types\.md$/);
  assert.deepEqual(fm(text), { title: "OSPF: LSA Types", tags: ["ospf"], status: "draft" });
});

test("a post starts as a draft with today's date and given tags", () => {
  const { file, text } = plan(["post", "My Lab, Part 1", "--tags", "Homelab,OPNsense"], "2026-11-16");
  assert.match(file, /src\/content\/blog\/my-lab-part-1\.md$/);
  const d = fm(text);
  assert.equal(d.title, "My Lab, Part 1");
  assert.equal(d.draft, true);
  assert.deepEqual(d.tags, ["homelab", "opnsense"]);
  assert.equal(String(d.date instanceof Date ? d.date.toISOString().slice(0, 10) : d.date), "2026-11-16");
});

test("bad input explains the usage", () => {
  assert.throws(() => plan(["note"]), /usage/);
  assert.throws(() => plan(["thing"]), /usage/);
});
