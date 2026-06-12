import { readFile, writeFile } from "node:fs/promises";

const albums = JSON.parse(await readFile("public/data/albums.json", "utf8"));

const NUWRLD_MIXTAPES = new Set([
  "シェンムーONLINE",
  "ティーンファンタジー：MYSTIC QUEST",
  "D.E.S.I.R.E.私が若い頃",
  "RPGウィンドウズ ビスタ",
  "#NUWRLDの気持ち",
  "世界大戦OLYMPICS",
  "SEAWRLDハートブレーク",
  "DERELICTメガタワー",
  "失われた時REGRET",
]);

const STUDIO = new Set([
  "신세기 EVANGELIS",
  "VIRTUAL UTOPIA EXPERIENCE",
  "I'll Try Living Like This",
  "I'll Try Living Like This (NUWRLD Version)",
  "I'll Try Living In Like This (Authentic Goods Version)",
  "CLASSROOM SEXXTAPE",
  "Heavy Black Heart",
  "Darklife",
  "After Angel",
]);

const LIVE = new Set([
  "Live From Japan", "Live from Japan",
  "Live on the Big Stream",
  "FORESTLIMIT BOOTLEG",
]);

// Producer credits from Wikipedia. Null entries = unknown.
const PRODUCERS = {
  // ── NUWRLD Mixtapes (.wmv) ──────────────────────────────
  "シェンムーONLINE":              ["James Webster"],
  "ティーンファンタジー：MYSTIC QUEST": ["Tech Honors"],
  "D.E.S.I.R.E.私が若い頃":        ["James Webster"],
  "RPGウィンドウズ ビスタ":          ["James Webster"],
  "#NUWRLDの気持ち":               ["James Webster"],
  "世界大戦OLYMPICS":              ["Tech Honors"],
  "SEAWRLDハートブレーク":          ["Tech Honors"],
  "DERELICTメガタワー":            ["James Webster"],
  "失われた時REGRET":              ["James Webster", "Tech Honors"],
  // ── Studio albums ───────────────────────────────────────
  "신세기 EVANGELIS":              ["James Webster", "Keith Rankin"],
  "VIRTUAL UTOPIA EXPERIENCE":    ["James Webster"],
  "I'll Try Living Like This":    ["James Webster", "Keith Rankin"],
  "I'll Try Living Like This (NUWRLD Version)": ["James Webster", "Keith Rankin"],
  "I'll Try Living In Like This (Authentic Goods Version)": ["James Webster", "Keith Rankin"],
  "CLASSROOM SEXXTAPE":           ["Tech Honors"],
  "Heavy Black Heart":            ["Tech Honors", "James Webster", "Keith Rankin"],
  "Darklife":                     ["Tech Honors", "James Webster", "Keith Rankin"],
  "After Angel":                  ["Tech Honors", "James Webster"],
  // ── Live ────────────────────────────────────────────────
  "Live From Japan":              ["James Webster", "Tech Honors"],
  "Live from Japan":              ["James Webster", "Tech Honors"],
  "Live on the Big Stream":       ["James Webster", "Tech Honors"],
  "FORESTLIMIT BOOTLEG":          ["Tech Honors", "James Webster"],
  // ── NUWRLD Mixtape Club / other ─────────────────────────
  "SEAWRLD 2":                    ["Tech Honors"],
  "さよならTAISAI":               ["James Webster"],
  "YELLOW FLOWER LOST":           ["Tech Honors"],
  "ENDLESSメガタワー I":          ["James Webster"],
  "おはよう ATHLETICS!":          ["Tech Honors"],
  "Sleepless":                    ["James Webster"],
  "サンシャインMANIA":            ["James Webster"],
  "ENDLESSメガタワー II":         ["James Webster"],
  "softwrld":                     ["Tech Honors"],
  "A Quiet Reset":                ["Tech Honors"],
  "ENDLESSメガタワー III":        ["James Webster"],
  "Crisis パーティ":              ["Tech Honors"],
  "Kingdom of One":               ["Tech Honors"],
  "DREAMガーデン":               ["James Webster"],
  "Reality 2 : Archive of Fading Mist (part ii)": ["Keith Rankin"],
  "ENDLESSメガタワー IV":         ["James Webster"],
  "MYSTIC QUEST REMAKE":          ["Tech Honors"],
  "Holy Magic Self":              ["James Webster"],
  "Bright Heart Rotating Into View": ["Tech Honors"],
  "Letter to Myself":             ["Keith Rankin"],
  "Blue Ocean":                   ["James Webster"],
  "Rainbow Prison":               ["Tech Honors", "James Webster"],
  "No Tomorrow":                  ["Keith Rankin"],
  "CASTLEデザイア":              ["James Webster"],
  "From a Distance":              ["Tech Honors", "James Webster"],
  "Reality 2 : Archive of Fading Mist (part i)": ["Keith Rankin"],
  "The Cleft":                    ["James Webster"],
  "Angel Ribbon":                 ["James Webster"],
  "Before The Killing Spree":     ["Tech Honors"],
  "Before the Killing Spree":     ["Tech Honors"],
  "Never Really Over":            ["Keith Rankin"],
  "Endless VI: Void Complex":     ["James Webster"],
  "Everything Is Easy!":          ["Tech Honors"],
  "Flower’s Testament":      ["James Webster", "Tamao Ninomiya"],
  "Flower's Testament":           ["James Webster", "Tamao Ninomiya"],
  "Ghosts Beyond The Glass":      ["Tech Honors"],
  "Ghosts Beyond the Glass":      ["Tech Honors"],
  "Dream Is Over":                ["Keith Rankin"],
  "Dream is Over":                ["Keith Rankin"],
  "APPLE GIRL MANIA":             ["James Webster"],
  "1982-1989: The Complete Recordings of Gary Coin": ["Tech Honors"],
  "4k god projected on the smoldering ashes": ["Keith Rankin"],
  "The Great Zero":               ["James Webster"],
  "Women of the Future":          ["Tech Honors"],
  "Sleep Utility 2025":           ["Keith Rankin"],
  "Fuchsia Groan":                ["James Webster"],
  "Still Life+":                  ["Tech Honors"],
  "Ungodly Gaze":                 ["Keith Rankin"],
  "Why I Took Your Advice: A Tribute to Grandaddy": ["James Webster"],
  "Foundations: Module 01 - “Crystal”": ["Tech Honors"],
  "Foundations: Module 01 - \"Crystal\"": ["Tech Honors"],
  "Mobile Suit Gym Rat":          ["Keith Rankin", "Galen Tipton"],
  "History of Holy Magic":        ["James Webster"],
  "Together, Our Thing":          ["Keith Rankin", "Holly Waxwing"],
  "RIBBON EP":                    ["James Webster"],
  "MYSTIC SIDEQUEST EP":          ["Tech Honors"],
  "Darklife Anthology":           ["Tech Honors", "James Webster", "Keith Rankin"],
  "The Masterflan":               ["Tech Honors", "James Webster"],
  "The Lunar Curtain":            ["Tech Honors", "James Webster", "Keith Rankin"],
  "Bio System-J":                 ["Tech Honors", "James Webster", "Keith Rankin"],
  "The Lunar Curtain II":         ["Tech Honors", "James Webster", "Keith Rankin"],
  "American Candy":               ["Tech Honors"],
  "POISONの時代に":              ["Tech Honors"],
  "Poisonの時代に":             ["Tech Honors"],
  "Monument to the Architect":    ["James Webster"],
  "GenoMods":                     ["Keith Rankin"],
  "Faith in Persona":             ["Keith Rankin"],
  "Keys to the Gate":             ["James Webster"],
  "Transcendence Bot":            ["Keith Rankin"],
  "Midnight Tangerine":           ["Tech Honors"],
  "You Like Music":               ["Keith Rankin", "Galen Tipton"],
};

// Label / notes details from Wikipedia
const DETAILS = {
  "シェンムーONLINE":              { label: "Self-released" },
  "ティーンファンタジー：MYSTIC QUEST": { label: "Self-released" },
  "D.E.S.I.R.E.私が若い頃":        { label: "Self-released" },
  "RPGウィンドウズ ビスタ":          { label: "Self-released" },
  "#NUWRLDの気持ち":               { label: "Ailanthus Recordings", catno: "AR080" },
  "世界大戦OLYMPICS":              { label: "Self-released" },
  "SEAWRLDハートブレーク":          { label: "Self-released" },
  "DERELICTメガタワー":            { label: "Self-released / Dream Catalogue", catno: "DREAM_28" },
  "失われた時REGRET":              { label: "Self-released", notes: "First collaborative release" },
  "신세기 EVANGELIS":              { label: "Self-released" },
  "VIRTUAL UTOPIA EXPERIENCE":    { label: "Self-released" },
  "I'll Try Living Like This":    { label: "Dream Catalogue", catno: "DREAM_98" },
  "CLASSROOM SEXXTAPE":           { label: "Self-released" },
  "Heavy Black Heart":            { label: "Orange Milk Records" },
  "Darklife":                     { label: "100% Electronica", catno: "147P" },
  "After Angel":                  { label: "Self-released" },
  "Live From Japan":              { label: "Ghost Diamond", catno: "GDR010" },
  "Live from Japan":              { label: "Ghost Diamond", catno: "GDR010" },
  "FORESTLIMIT BOOTLEG":          { label: "Self-released", notes: "Official live bootleg" },
  "History of Holy Magic":        { notes: "Unedited recordings used to create Holy Magic Self" },
  "Together, Our Thing":          { notes: "First collaborative release made for the NUWRLD Mixtape Club; also released on streaming platforms under the Giant Claw alias" },
  "RIBBON EP":                    { notes: "EP" },
  "MYSTIC SIDEQUEST EP":          { notes: "EP" },
  "Darklife Anthology":           { notes: "Demo recordings for Darklife and After Angel" },
  "The Masterflan":               { notes: "Compilation" },
  "The Lunar Curtain":            { notes: "Compilation" },
  "Bio System-J":                 { notes: "Compilation" },
  "The Lunar Curtain II":         { notes: "Compilation" },
  "American Candy":               { notes: "Also released on YouTube" },
  "POISONの時代に":              { notes: "Also released on vinyl" },
  "Monument to the Architect":    { notes: "Also released on vinyl" },
  "GenoMods":                     { notes: "Also released on vinyl" },
  "Faith in Persona":             { notes: "Also released on streaming platforms and on vinyl" },
  "Keys to the Gate":             { notes: "Also released on streaming platforms and on vinyl" },
  "Transcendence Bot":            { notes: "Also released on streaming platforms and on vinyl" },
  "Midnight Tangerine":           { notes: "Also released on streaming platforms and on vinyl" },
  "You Like Music":               { notes: "Also released on streaming platforms" },
  "Flower’s Testament":      { notes: "Also released on vinyl" },
  "Flower's Testament":           { notes: "Also released on vinyl" },
};

function classify(a) {
  if (NUWRLD_MIXTAPES.has(a.title)) return "NUWRLD Mixtape (.wmv)";
  if (STUDIO.has(a.title)) return "Studio Album";
  if (LIVE.has(a.title)) return "Live Album";
  if (a.primaryType === "EP") return "EP";
  if (a.primaryType === "Single") return "Single";
  return "NUWRLD Mixtape Club";
}

// Build case-insensitive + quote-normalized lookup maps
function normalizeKey(s) {
  return s.toLowerCase()
    .replace(/[‘’ʼ`´']/g, "'")
    .replace(/[“”"]/g, '"')
    .trim();
}
const PROD_NORM = Object.fromEntries(Object.entries(PRODUCERS).map(([k, v]) => [normalizeKey(k), v]));
const DET_NORM  = Object.fromEntries(Object.entries(DETAILS).map(([k, v]) => [normalizeKey(k), v]));

for (const a of albums) {
  a.category = classify(a);
  a.year = (a.firstReleaseDate || "").slice(0, 4) || "Unknown";
  const g = [...(a.genres || [])].sort((x, y) => (y.count || 0) - (x.count || 0));
  a.primaryGenre = g[0]?.name || a.tags?.[0]?.name || null;
  const nk = normalizeKey(a.title);
  a.producers = PROD_NORM[nk] || null;
  const det = DET_NORM[nk] || null;
  a.label = det?.label || null;
  a.catno = det?.catno || null;
  a.notes = det?.notes || null;
}

const counts = {};
albums.forEach((a) => (counts[a.category] = (counts[a.category] || 0) + 1));
console.log("Category counts:", counts);

const withProducers = albums.filter((a) => a.producers).length;
console.log(`Producers attributed: ${withProducers} / ${albums.length}`);

await writeFile("public/data/albums.json", JSON.stringify(albums, null, 2));
console.log("Enriched", albums.length, "albums");
