// What must never reach the public site. Used by the Grav importer and by tools/check-content.mjs,
// which runs before every build, so a note copied in by hand is checked too.

const PRIVATE_IP = /\b(10\.\d{1,3}|172\.(1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/;

/** Things that look like credentials, private addresses or shell history. Private (RFC 1918)
 *  addresses are allowed when the frontmatter says `private_ips_ok: true`, for lab examples. */
export function secrets(body, fm = {}) {
  const found = [];
  if (/(^|\s)-u\s+['"]?(?!\$)[^\s'"]+:(?![$<])[^\s'"<]+['"]?/.test(body)) found.push("a user:password after -u");
  if (/[a-z]+:\/\/[^\s/:@]+:[^\s/@<]+@/i.test(body)) found.push("a user:password inside a URL");
  if (/\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*['"]?(?![<$`])[^\s'"]{6,}/i.test(body)) found.push("a password, secret or token value");
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(body)) found.push("a private key");
  if (/\b(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|glpat-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|sk-[A-Za-z0-9]{32,})\b/.test(body)) found.push("an API token");
  if (/^\s*(username\s+\S+\s+(password|secret)\s+[0-7]?\s*(?!<)\S+|enable (password|secret)\s+[0-9]?\s*(?!<)\S{4,})/im.test(body)) found.push("a device password in a config");
  if (fm.private_ips_ok !== true && PRIVATE_IP.test(body)) found.push("private IP addresses (set private_ips_ok: true if they are lab examples)");
  if (/^\s*\d+\s+\d{4}-\d\d-\d\d \d\d:\d\d:\d\d /m.test(body)) found.push("shell history with timestamps");
  return found;
}
