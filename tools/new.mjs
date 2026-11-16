// Starts a new kb note or blog post with the frontmatter filled in, so nothing is typed by hand:
//   npm run new -- note cisco/campus/routing/ospf "OSPF LSA Types" [--tags ospf,lsa]
//   npm run new -- post "Why my lab runs on OPNsense" [--tags homelab]
// The folder of a note may be new (it gets its own folder page at build time). A post starts as
// draft: true, so it stays off the site until you remove that line.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = new URL("../src/content/", import.meta.url).pathname;

export const slug = (s) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const yamlStr = (s) => (/^[\w .,()/+-]+$/.test(s) && !/^[-?:]/.test(s) ? s : JSON.stringify(s));

export function plan(args, today = new Date().toISOString().slice(0, 10)) {
  const tagsAt = args.indexOf("--tags");
  const tags = tagsAt >= 0 ? (args[tagsAt + 1] ?? "").split(",").map((t) => slug(t)).filter(Boolean) : null;
  const rest = tagsAt >= 0 ? args.filter((_, i) => i !== tagsAt && i !== tagsAt + 1) : args;
  const [kind, ...more] = rest;
  if (kind === "note") {
    const [folder, title] = more;
    if (!folder || !title) throw new Error('usage: npm run new -- note <folder under kb> "<title>" [--tags a,b]');
    const dir = folder.replace(/^\/*(kb\/)?|\/+$/g, "").split("/").map(slug).filter(Boolean).join("/");
    if (!dir) throw new Error("the folder is empty");
    const t = tags ?? [dir.split("/").pop()];
    return {
      file: join(ROOT, "docs/kb", dir, slug(title) + ".md"),
      text: `---\ntitle: ${yamlStr(title)}\ntags:\n${t.map((x) => `  - ${x}`).join("\n")}\nstatus: draft\n---\n\nTODO: write the note. Link other notes with \`[[their-file-name]]\`.\n`,
    };
  }
  if (kind === "post") {
    const [title] = more;
    if (!title) throw new Error('usage: npm run new -- post "<title>" [--tags a,b]');
    const t = tags ?? [];
    return {
      file: join(ROOT, "blog", slug(title) + ".md"),
      text: `---\ntitle: ${yamlStr(title)}\nsummary: TODO one sentence for the blog list and link previews\ndate: ${today}\ntags:${t.length ? "\n" + t.map((x) => `  - ${x}`).join("\n") : " []"}\ndraft: true\n---\n\nTODO: write the post.\n`,
    };
  }
  throw new Error('usage: npm run new -- note <folder> "<title>"  |  npm run new -- post "<title>"');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { file, text } = plan(process.argv.slice(2));
    if (existsSync(file)) throw new Error(`${relative(process.cwd(), file)} exists already`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
    console.log(`created ${relative(process.cwd(), file)}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
