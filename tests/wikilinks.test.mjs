import { test } from "node:test";
import assert from "node:assert/strict";
import { wikiLinks, wikiIndex, resolveWiki, headingSlug } from "../tools/lib/wikilinks.mjs";

const idx = wikiIndex([
  { id: "kb/cisco/ospf/ospf-packets", title: "OSPF Packets" },
  { id: "kb/cisco/bgp/timers", title: "BGP Timers" },
  { id: "kb/cisco/ospf/timers", title: "OSPF Timers" },
]);

test("parses targets, headings and labels, skips code", () => {
  const l = wikiLinks("See [[OSPF Packets]], [[ospf-packets#Hello packet|hello]] and `[[not a link]]`\n```\n[[nor this]]\n```");
  assert.deepEqual(l.map((x) => [x.target, x.heading, x.label]), [["OSPF Packets", undefined, undefined], ["ospf-packets", "Hello packet", "hello"]]);
});

test("resolves by file name, title and path; ambiguous names do not resolve", () => {
  assert.equal(resolveWiki(idx, "ospf-packets"), "kb/cisco/ospf/ospf-packets");
  assert.equal(resolveWiki(idx, "ospf packets"), "kb/cisco/ospf/ospf-packets");
  assert.equal(resolveWiki(idx, "timers"), undefined);
  assert.equal(resolveWiki(idx, "bgp/timers"), "kb/cisco/bgp/timers");
  assert.equal(resolveWiki(idx, "nope"), undefined);
});

test("heading slugs follow Astro's ids", () => {
  assert.equal(headingSlug("Type 2 Authentication"), "type-2-authentication");
  assert.equal(headingSlug("What's LSA?"), "whats-lsa");
});
