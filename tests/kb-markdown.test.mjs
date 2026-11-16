import { test } from "node:test";
import assert from "node:assert/strict";
import { TAG_LINE } from "../src/lib/kb-line-breaks.mjs";
import { words } from "../tools/lib/stubs.mjs";

test("tag-only lines are recognised, headings and text are not", () => {
  for (const t of ["#todo", "#todo/cleanup", "#ospf #bgp", "#certifications/cisco/ccie/enterprise"]) assert.ok(TAG_LINE.test(t), t);
  for (const t of ["## Heading", "#1 priority", "see #ospf", "# Title"]) assert.ok(!TAG_LINE.test(t), t);
});

test("tag lines do not count as words", () => {
  assert.equal(words("one two\n#todo/cleanup\n#ospf #bgp"), 2);
});
