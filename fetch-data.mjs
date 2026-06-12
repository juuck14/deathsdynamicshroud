// Fetch death's dynamic shroud data from MusicBrainz + Cover Art Archive
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ARTIST_ID = "e294d11b-fc47-41a9-b38b-3205c34d17ba";
const MB = "https://musicbrainz.org/ws/2";
const UA = "DDS-FanSite/1.0 (jin.parkseo@gmail.com)";
const OUT = path.resolve("public", "data");
const COVERS = path.resolve("public", "covers");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// MusicBrainz allows ~1 req/sec. Keep a polite gap.
async function mb(endpoint) {
  await sleep(1100);
  const url = `${MB}/${endpoint}`;
  console.log("GET", url);
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function save(name, obj) {
  await writeFile(path.join(OUT, name), JSON.stringify(obj, null, 2));
  console.log("saved", name);
}

async function downloadCover(rgId, release) {
  // Try cover art archive for the release-group front cover
  const url = `https://coverartarchive.org/release-group/${rgId}/front`;
  await sleep(300);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "";
    const ext = ct.includes("png") ? "png" : "jpg";
    const file = `${rgId}.${ext}`;
    await writeFile(path.join(COVERS, file), buf);
    console.log("cover saved", file, `(${buf.length} bytes)`);
    return file;
  } catch (e) {
    console.log("no cover for", rgId, e.message);
    return null;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(COVERS, { recursive: true });

  // 1. Artist info with members, urls, tags
  const artist = await mb(
    `artist/${ARTIST_ID}?inc=url-rels+artist-rels+tags+genres+ratings&fmt=json`
  );
  await save("artist.json", artist);

  // 2. All release-groups (albums, EPs, singles) with pagination
  const releaseGroups = [];
  let offset = 0;
  while (true) {
    const page = await mb(
      `release-group?artist=${ARTIST_ID}&type=album|ep|single|other&limit=100&offset=${offset}&fmt=json`
    );
    releaseGroups.push(...page["release-groups"]);
    const total = page["release-group-count"];
    offset += 100;
    if (offset >= total) break;
  }
  // sort by first-release-date
  releaseGroups.sort((a, b) =>
    (a["first-release-date"] || "").localeCompare(b["first-release-date"] || "")
  );
  await save("release-groups.json", releaseGroups);
  console.log(`Found ${releaseGroups.length} release groups`);

  // 3. For each release-group: detailed info + cover art
  const albums = [];
  for (const rg of releaseGroups) {
    const detail = await mb(
      `release-group/${rg.id}?inc=releases+tags+genres+ratings+url-rels&fmt=json`
    );
    const cover = await downloadCover(rg.id);
    albums.push({
      id: rg.id,
      title: rg.title,
      primaryType: rg["primary-type"],
      secondaryTypes: rg["secondary-types"],
      firstReleaseDate: rg["first-release-date"],
      disambiguation: rg.disambiguation,
      tags: detail.tags,
      genres: detail.genres,
      rating: detail.rating,
      releases: (detail.releases || []).map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        country: r.country,
        status: r.status,
      })),
      urls: (detail.relations || []).map((rel) => ({ type: rel.type, url: rel.url?.resource })),
      cover,
    });
  }
  await save("albums.json", albums);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
