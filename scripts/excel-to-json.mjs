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

  if (stRow && S(stRow.Position)) {
    console.log("✅ Found Plus row:", stRow.Position);
  } else {
    console.warn("⚠️ No 'Plus' row matched. Check spelling or hidden chars in Excel.");
  }

// --- Agency: "Plus" statement ---
const statement = {
  headerEn:  S(stRow.Title),
  headerSv:  S(stRow.TitleSv),
  textEn:    S(stRow.English),
  textSv:    S(stRow.Swedish),
  descriptionEn: S(stRow.English),  // fallback field name for compatibility
  descriptionSv: S(stRow.Swedish),
  showonload: showProb(stRow.Showonload)
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
    partThree: { en: S(partThree.English), sv: S(partThree.Swedish) },
    rightColumnImages: ["/img/AAA019/AAA019_Generative_Care_06.gif"] // placeholder empty array for consistency
  };
}




// ---------- Architecture ----------
function loadArchitecture(ws) {
  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });
  const projects = rows.map(r => ({
    index: S(r.Index),
    title: S(r.Title),
    titleSv: S(r.TitleSv),
    en: S(r.English),
    sv: S(r.Swedish),
    images: splitImages(r.Images),
    showonload: showProb(r.Showonload),
    prio: N(r.Prio, 0)
  }));
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
