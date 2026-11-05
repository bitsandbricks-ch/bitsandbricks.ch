// Shared site data: logo, project marks, icons, links and the {{placeholder}} filler.
// Ported from the old tools/build.py so the existing pages render the same.

export const SITE = "https://bitsandbricks.ch";
export const NAME = "Bits & Bricks";
export const GITHUB = "https://github.com/reykimedev";
export const LINKEDIN = "https://www.linkedin.com/in/mike-keller-181827253/";
export const MAIL = "mike@cheller.dev";

export const NAV: [string, string][] = [
  ["/#rack", "projects"],
  ["/blog/", "blog"],
  ["/kb/", "kb"],
  ["/courses/", "courses"],
  ["/about/", "about"],
];

// The logo: a brick wall (a firewall) with one green RJ45 port in it.
export const LOGO = "<svg class=\"mark\" viewBox=\"0 0 64 64\" aria-hidden=\"true\"><rect x=\"5\" y=\"12\" width=\"17\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"24.5\" y=\"12\" width=\"17.0\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"44\" y=\"12\" width=\"17\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"5\" y=\"24.5\" width=\"7.5\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"15\" y=\"24.5\" width=\"17\" height=\"10\" rx=\"1.4\" fill=\"var(--core)\"/><path d=\"M19.0 26.7h9v4.4h-2.4v1.4h-4.2v-1.4h-2.4z\" fill=\"#111111\"/><rect x=\"34.5\" y=\"24.5\" width=\"17.0\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"54\" y=\"24.5\" width=\"7\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"5\" y=\"37\" width=\"17\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"24.5\" y=\"37\" width=\"17.0\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/><rect x=\"44\" y=\"37\" width=\"17\" height=\"10\" rx=\"1.4\" fill=\"var(--brick)\"/></svg>";
export const HUBRA = "<svg class=\"logo\" viewBox=\"0 0 64 64\" aria-hidden=\"true\"><rect width=\"64\" height=\"64\" rx=\"15\" fill=\"#7441e0\"/><path d=\"M21 14V50M21 35a11 11 0 0 1 22 0V50\" fill=\"none\" stroke=\"#fff\" stroke-width=\"8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"32\" cy=\"45\" r=\"4\" fill=\"#fece2b\"/></svg>";
export const LABDEX = "<svg class=\"logo\" viewBox=\"0 0 32 32\" aria-hidden=\"true\"><rect width=\"32\" height=\"32\" rx=\"7\" fill=\"#7c3aed\"/><rect x=\"6\" y=\"6\" width=\"20\" height=\"20\" rx=\"4\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\"2\"/><rect x=\"10.5\" y=\"10.5\" width=\"11\" height=\"11\" rx=\"2.5\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".8\" stroke-width=\"2\"/><rect x=\"14\" y=\"14\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#fff\"/></svg>";
export const HOMELAB = "<svg class=\"logo\" viewBox=\"0 0 64 64\" aria-hidden=\"true\"><rect width=\"64\" height=\"64\" rx=\"15\" fill=\"#b23b14\"/><g fill=\"none\" stroke=\"#fff\" stroke-width=\"3.5\" stroke-linejoin=\"round\"><rect x=\"15\" y=\"14\" width=\"34\" height=\"10\" rx=\"3\"/><rect x=\"15\" y=\"27\" width=\"34\" height=\"10\" rx=\"3\"/><rect x=\"15\" y=\"40\" width=\"34\" height=\"10\" rx=\"3\"/></g><g fill=\"#4ade80\"><circle cx=\"22\" cy=\"19\" r=\"2.2\"/><circle cx=\"22\" cy=\"32\" r=\"2.2\"/><circle cx=\"22\" cy=\"45\" r=\"2.2\"/></g></svg>";

const icon = (body: string) =>
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
  `stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ICONS: Record<string, string> = {
  github: icon("<path d=\"M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21\"/>"),
  linkedin: icon("<rect x=\"2.5\" y=\"2.5\" width=\"19\" height=\"19\" rx=\"4\"/><path d=\"M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5\"/>"),
  mail: icon("<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"m4 7 8 6 8-6\"/>"),
  arrow: icon("<path d=\"M5 12h14M13 6l6 6-6 6\"/>"),
  ext: icon("<path d=\"M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5\"/>"),
  moon: icon("<path class=\"moon\" d=\"M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z\"/><g class=\"sun\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></g>"),
  menu: icon("<path class=\"open\" d=\"M4 7h16M4 12h16M4 17h16\"/><path class=\"shut\" d=\"M6 6l12 12M18 6 6 18\"/>"),
  star: icon("<path d=\"m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z\"/>"),
};

/** Replaces {{logo}}, {{hubra}}, {{icon:github}}, {{linkedin}} ... in page sources. */
export function fill(text: string): string {
  text = text.replace(/\{\{icon:(\w+)\}\}/g, (_, name) => ICONS[name]);
  const values: Record<string, string> = { logo: LOGO, hubra: HUBRA, labdex: LABDEX, homelab: HOMELAB, github: GITHUB, linkedin: LINKEDIN, mail: MAIL };
  for (const [k, v] of Object.entries(values)) text = text.split("{{" + k + "}}").join(v);
  return text;
}

/** Is `href` the current section? Used to mark the nav item. */
export function isCurrent(href: string, path: string): boolean {
  if (href === "/#rack") return false;
  return path === href || path.startsWith(href);
}

/**
 * Comments via Giscus (GitHub Discussions). Loaded only when a reader clicks "show comments".
 * To switch on: enable Discussions on the repo, install the giscus app, then copy repoId and
 * categoryId from https://giscus.app into here. Until both are set, the button says comments are off.
 */
export const GISCUS = {
  repo: "bitsandbricks-ch/bitsandbricks.ch",
  repoId: "",
  category: "Comments",
  categoryId: "",
};
