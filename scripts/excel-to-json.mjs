// scripts/excel-to-json.mjs
import fs from "fs";
import path from "path";
import xlsx from "xlsx";

// ---------- Helpers ----------
const S = v => (v == null ? "" : String(v).trim());
const N = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const match = (v, keyword) => S(v).toLowerCase().includes(keyword.toLowerCase());

const splitImages = val => {
  if (!val) return [];
  return String(val)
    .split(/[;,|\n]/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => (s.startsWith("/") ? s : "/img/" + s.replace(/^\/?img\//i, "")));
};

const showProb = val => {
  const raw = S(val).replace(",", ".");
  if (/^(1|true)$/i.test(raw)) return 1;
  if (/^(0|false)$/i.test(raw)) return 0;
  if (/%$/.test(raw)) {
    const n = parseFloat(raw.replace("%", ""));
    return Number.isFinite(n) ? Math.min(Math.max(n / 100, 0), 1) : 0;
  }
  const n = parseFloat(raw);
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), 1) : 0;
};

// ---------- Adaptive ----------
function loadAdaptive(ws) {
  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });
  const partOne = rows.find(r => match(r.Position, "part one")) || {};
  const statements = rows
    .filter(r => match(r.Position, "statement"))
    .map(r => ({
      header: S(r.Title),
      headerSv: S(r.TitleSv || r["Title Sv"]),
      en: S(r.English),
      sv: S(r.Swedish),
      images: splitImages(r.Images),
      showonload: showProb(r.Showonload)
    }));
  const rightColumnImages = splitImages(partOne.Images);

  return {
    partOne: { en: S(partOne.English), sv: S(partOne.Swedish) },
    partTwo: { statements },
    rightColumnImages
  };
}

// ---------- Agency ----------
function loadAgency(ws) {
  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const clean = v =>
    S(v)
      .replace(/\u00a0/g, " ")   // convert non-breaking spaces
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  console.log("\n[Agency sheet: detected positions]");
  rows.forEach(r => console.log("→", JSON.stringify(r.Position)));

  const partOne   = rows.find(r => clean(r.Position).includes("part one"))   || {};
  const partTwo   = rows.find(r => clean(r.Position).includes("part two"))   || {};
  const partThree = rows.find(r => clean(r.Position).includes("part three")) || {};
  const stRow     = rows.find(r => clean(r.Position).includes("plus"))       || {};
  const stRow1     = rows.find(r => clean(r.Position).includes("plusone"))       || {};
  const stRow2     = rows.find(r => clean(r.Position).includes("plustwo"))       || {};

// --- Agency: "Plus" statement ---
const statement = {
  headerEn:  S(stRow.Title),
  headerSv:  S(stRow.TitleSv),
  textEn:    S(stRow.English),
  textSv:    S(stRow.Swedish),
  showonload: showProb(stRow.Showonload)
};

// --- Agency: "plus1" plustwo ---
const plusone = {
  headerEn:  S(stRow1.Title),
  headerSv:  S(stRow1.TitleSv),
  textEn:    S(stRow1.English),
  textSv:    S(stRow1.Swedish),
  showonload: showProb(stRow1.Showonload)
};

// --- Agency: "plus two" plustwo ---
const plustwo = {
  headerEn:  S(stRow2.Title),
  headerSv:  S(stRow2.TitleSv),
  textEn:    S(stRow2.English),
  textSv:    S(stRow2.Swedish),
  showonload: showProb(stRow2.Showonload)
};

const profile = rows
  .filter(r => match(r.Position, "profile"))
  .map(r => ({
    header: S(r.Title),
    headerSv: S(r.TitleSv || r["Title Sv"]),
    en: S(r.English),
    sv: S(r.Swedish),
    images: splitImages(r.Images),
    showonload: showProb(r.Showonload)
  }));

  return {
    partOne:   { en: S(partOne.English),  sv: S(partOne.Swedish) },
    profile,
    partTwo:   { en: S(partTwo.English),  sv: S(partTwo.Swedish) },
    statement, // the new “Plus” block (collapsed)
    plusone,
    partThree: { en: S(partThree.English), sv: S(partThree.Swedish) },
    plustwo,
    rightColumnImages: ["/img/AAA019/AAA019_Generative_Care_06.gif"] // placeholder empty array for consistency
  };
}




// ---------- Architecture ----------


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

// ---------- Main ----------
function main() {
  const ROOT = process.cwd();
  const INPUT = path.join(ROOT, "Input text AAA.xlsx");
  const OUTPATH = path.join(ROOT, "src", "site.json");

  if (!fs.existsSync(INPUT)) {
    console.error(`Excel not found: ${INPUT}`);
    process.exit(1);
  }

  const wb = xlsx.readFile(INPUT);
  const adaptiveWS = wb.Sheets["Adaptive"];
  const agencyWS = wb.Sheets["Agency"];
  const architectureWS = wb.Sheets["Architecture"];

  const site = {
    adaptive: adaptiveWS ? loadAdaptive(adaptiveWS) : {},
    agency: agencyWS ? loadAgency(agencyWS) : {},
    architecture: architectureWS ? loadArchitecture(architectureWS) : {}
  };

  fs.mkdirSync(path.dirname(OUTPATH), { recursive: true });
  fs.writeFileSync(OUTPATH, JSON.stringify(site, null, 2), "utf8");
  console.log(`✅ JSON written to ${OUTPATH}`);
}

main();
