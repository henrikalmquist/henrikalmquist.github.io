import xlsx from "xlsx";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "Input text AAA.xlsx");
const OUTPUT = path.join(ROOT, "src", "site.json");

const wb = xlsx.readFile(INPUT);

const S = v => (v == null ? "" : String(v).trim());

const N = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

function splitImages(v) {
  return S(v)
    .split(/[\n,;]/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => `/img/${s}`);
}

function showProb(v) {
  const s = S(v).replace("%", "");
  if (!s) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? (n > 1 ? n / 100 : n) : 0;
}

function slugKey(str) {
  return S(str)
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseMeta(val) {
  const text = S(val);
  if (!text) return [];

  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const m = line.match(/^([^:]+):\s*(.*)$/);
      if (!m) return null;

      const label = S(m[1]);
      const value = S(m[2]);

      if (!label || !value) return null;

      return {
        label,
        key: slugKey(label),
        value
      };
    })
    .filter(Boolean);
}

function loadArchitecture(ws) {
  if (!ws) return { projects: [] };

  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const projects = rows
    .map(r => ({
      index: S(r.Index),
      title: S(r.Title),
      titleSv: S(r.TitleSv),
      en: S(r.English),
      sv: S(r.Swedish),
      meta: parseMeta(r.Meta),
      images: splitImages(r.Images),
      showonload: showProb(r.Showonload),
      prio: N(r.Prio, 0)
    }))
    .filter(p => p.index || p.title || p.titleSv || p.en || p.sv || p.images.length);

  return { projects };
}

function loadAdaptive(ws) {
  if (!ws) return {};

  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const obj = {};
  for (const row of rows) {
    const key = S(row.Key || row.key || row.Name || row.name);
    if (!key) continue;
    obj[key] = row.Value ?? row.value ?? "";
  }

  return obj;
}

function loadAgency(ws) {
  if (!ws) return {};

  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const obj = {};
  for (const row of rows) {
    const key = S(row.Key || row.key || row.Name || row.name);
    if (!key) continue;
    obj[key] = row.Value ?? row.value ?? "";
  }

  return obj;
}

function loadHome(ws) {
  if (!ws) return {};

  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const obj = {};
  for (const row of rows) {
    const key = S(row.Key || row.key || row.Name || row.name);
    if (!key) continue;
    obj[key] = row.Value ?? row.value ?? "";
  }

  return obj;
}

let existing = {};
if (fs.existsSync(OUTPUT)) {
  try {
    existing = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  } catch {
    existing = {};
  }
}

const data = {
  adaptive: wb.Sheets["Adaptive"] ? loadAdaptive(wb.Sheets["Adaptive"]) : (existing.adaptive || {}),
  agency: wb.Sheets["Agency"] ? loadAgency(wb.Sheets["Agency"]) : (existing.agency || {}),
  home: wb.Sheets["Home"] ? loadHome(wb.Sheets["Home"]) : (existing.home || {}),
  architecture: loadArchitecture(wb.Sheets["Architecture"])
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), "utf8");

console.log(`Wrote ${OUTPUT}`);