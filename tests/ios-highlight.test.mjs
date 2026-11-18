import { test } from "node:test";
import assert from "node:assert/strict";
import { tokens, looksLikeIos } from "../src/lib/ios-highlight.mjs";

test("marks prompts, keywords, placeholders and comments", () => {
  assert.deepEqual(tokens("R1(config-router)# neighbor <ip> shutdown"), [["p", "R1(config-router)#"], ["", " neighbor "], ["v", "<ip>"], ["", " shutdown"]]);
  assert.deepEqual(tokens("show ip ospf neighbor\n! a comment"), [["k", "show"], ["", " ip ospf neighbor\n"], ["c", "! a comment"]]);
  assert.deepEqual(tokens(" no shutdown"), [["", " "], ["k", "no"], ["", " shutdown"]]);
});

test("keeps the text exactly", () => {
  const code = "R1# conf t\nEnter configuration commands, one per line.\nR1(config)# router bgp 123\n\n R1(config-router)# neigh 192.0.2.1 shutdown";
  assert.equal(tokens(code).map((t) => t[1]).join(""), code);
});

test("only highlights IOS-looking code", () => {
  assert.equal(looksLikeIos("interface Gig 0/0\n ip ospf network point-to-point"), true);
  assert.equal(looksLikeIos("#!/bin/bash\nread -p 'x' NAME\ncurl -s https://example.com"), false);
  assert.equal(looksLikeIos("Internet Protocol Version 4, Src: 12.1.1.1\nOpen Shortest Path First"), false);
});

import { iosHtml } from "../src/lib/kb-ios.mjs";
test("iosHtml escapes text and wraps tokens", () => {
  const html = iosHtml("R1#show ip route <prefix> & more");
  assert.match(html, /^<pre class="ios"><code><span class="p">R1#<\/span>/);
  assert.match(html, /<span class="v">&lt;prefix&gt;<\/span> &amp; more/);
  assert.doesNotMatch(html, /<prefix>/);
});
