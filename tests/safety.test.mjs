// The secrets check that keeps credentials and private addresses off the public site.
import { test } from "node:test";
import assert from "node:assert/strict";
import { secrets } from "../tools/lib/safety.mjs";

test("finds credentials", () => {
  assert.ok(secrets("curl -u admin:hunter22 https://example.com").length);
  assert.ok(secrets("see https://bob:pa55word@example.com/x").length);
  assert.ok(secrets("password: s3cr3tvalue").length);
  assert.ok(secrets("-----BEGIN OPENSSH PRIVATE KEY-----").length);
  assert.ok(secrets("token ghp_" + "a".repeat(36)).length);
  assert.ok(secrets("enable secret 5 $1$mERr$abcdefg").length);
  assert.ok(secrets("username admin password 0 Cisco123").length);
});

test("leaves placeholders and prose alone", () => {
  assert.deepEqual(secrets("ip ospf message-digest-key <id> md5 <password>"), []);
  assert.deepEqual(secrets("neighbor <ip> password <password>"), []);
  assert.deepEqual(secrets("curl -u $USERNAME:$PASSWORD https://example.com"), []);
  assert.deepEqual(secrets("Type 2 authentication uses plain-text passwords."), []);
  assert.deepEqual(secrets("key-string <secret key string>"), []);
});

test("private addresses need private_ips_ok", () => {
  assert.ok(secrets("neighbor 10.1.1.1").length);
  assert.ok(secrets("ip address 192.168.1.1 255.255.255.0").length);
  assert.deepEqual(secrets("neighbor 10.1.1.1", { private_ips_ok: true }), []);
  assert.deepEqual(secrets("ip address 192.0.2.1 and 8.8.8.8"), []);
});

test("shell history", () => {
  assert.ok(secrets("  101  2024-03-01 10:22:13 ssh root@host").length);
});
