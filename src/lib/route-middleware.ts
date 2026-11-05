// Starlight shows one sidebar for the whole site. This narrows it to the section you are in:
// the kb tree on kb pages, and only the current course on course pages. Folder names show with
// a trailing slash (routing/), and lesson section folders drop their order prefix (1-basics -> basics/).
import { defineRouteMiddleware, type StarlightRouteData } from "@astrojs/starlight/route-data";

type Entry = StarlightRouteData["sidebar"][number];
type Link = Extract<Entry, { type: "link" }>;

function relabel(entries: Entry[]): Entry[] {
  return entries.map((e) => (e.type === "group" ? { ...e, label: e.label.replace(/^\d+-/, "") + "/", entries: relabel(e.entries) } : e));
}
function flat(entries: Entry[]): Link[] {
  return entries.flatMap((e) => (e.type === "group" ? flat(e.entries) : [e]));
}

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const path = context.url.pathname;
  const top = route.sidebar.filter((e): e is Extract<Entry, { type: "group" }> => e.type === "group");
  const kb = top.find((g) => g.label === "kb");
  const courses = top.find((g) => g.label === "courses");

  let entries: Entry[] | null = null;
  if ((path.startsWith("/kb/") || path.startsWith("/tags/")) && kb) entries = relabel(kb.entries);
  else if (path.startsWith("/courses/") && courses) {
    const slug = path.split("/")[2];
    const course = courses.entries.find((e) => e.type === "group" && flat(e.entries).some((l) => l.href.startsWith(`/courses/${slug}/`)));
    if (course && course.type === "group") entries = relabel(course.entries);
  }
  if (!entries) return;
  route.sidebar = entries;

  const links = flat(entries);
  const i = links.findIndex((l) => l.isCurrent);
  route.pagination = { prev: i > 0 ? links[i - 1] : undefined, next: i >= 0 && i < links.length - 1 ? links[i + 1] : undefined };
});
