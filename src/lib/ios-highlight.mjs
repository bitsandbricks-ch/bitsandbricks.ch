// A small highlighter for Cisco IOS snippets in kb notes, run at build time (no JavaScript in
// the browser). It only marks what helps reading a config or a capture:
//   p  the prompt (R1(config-router)#, Switch>)   c  "!" comment lines
//   k  show / debug / clear / no at the start      v  <placeholders>
// Code that does not look like IOS is left alone.
const PROMPT = /^([A-Za-z][\w.-]*(?:\([\w.\/-]+\))?[#>])(\s?)/;
const KEYWORD = /^(show|debug|undebug|clear|no|do|ping|traceroute|conf(?:igure)?(?: t(?:erminal)?)?)\b/;
const IOS_LINE = /^\s*(!|interface\b|router\b|ip\b|ipv6\b|show\b|neighbor\b|network\b|line\b|hostname\b|spanning-tree\b|vlan\b|monitor\b|key\b|bfd\b|no\b|debug\b|access-list\b|route-map\b|class-map\b|policy-map\b|snmp-server\b|logging\b|ntp\b|aaa\b|crypto\b|switchport\b|channel-group\b|standby\b|track\b|address-family\b|redistribute\b|area\b|passive-interface\b|router-id\b|[A-Za-z][\w.-]*(?:\([\w.\/-]+\))?#)/;

export const looksLikeIos = (code) => {
  const lines = code.split("\n").filter((l) => l.trim());
  return lines.length > 0 && lines.filter((l) => IOS_LINE.test(l)).length / lines.length >= 0.4;
};

/** Splits code into [class, text] pieces; class "" is plain text. */
export function tokens(code) {
  const out = [];
  const push = (cls, text) => { if (!text) return; const last = out[out.length - 1]; if (last && last[0] === cls) last[1] += text; else out.push([cls, text]); };
  code.split("\n").forEach((line, i) => {
    if (i) push("", "\n");
    if (/^\s*!/.test(line)) return push("c", line);
    let rest = line;
    const p = PROMPT.exec(rest);
    if (p) { push("p", p[1]); push("", p[2]); rest = rest.slice(p[0].length); }
    const lead = /^\s*/.exec(rest)[0];
    push("", lead); rest = rest.slice(lead.length);
    const k = KEYWORD.exec(rest);
    if (k) { push("k", k[0]); rest = rest.slice(k[0].length); }
    let at = 0;
    for (const m of rest.matchAll(/<[^<>\n]{1,48}>/g)) { push("", rest.slice(at, m.index)); push("v", m[0]); at = m.index + m[0].length; }
    push("", rest.slice(at));
  });
  return out;
}
