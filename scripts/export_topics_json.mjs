import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = fileURLToPath(new URL("../outputs/topic-ledger/initial-topics.xlsx", import.meta.url));
const outputPath = fileURLToPath(new URL("../outputs/topic-ledger/initial-topics.json", import.meta.url));

const blob = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(blob);
const headers = [
  "id", "year", "category", "カテゴリ表示名", "title", "shortDescription", "conversationPrompt",
  "genderAffinity", "ageMin", "ageMax", "imageAsset", "sourceName", "sourceURL", "linkCheckedAt",
  "tags", "isActive", "version", "出典確認", "事実確認", "文章確認", "権利確認", "配慮区分",
  "reviewer", "notes", "公開可能", "updatedAt",
];
const values = [];
for (let start = 6; start <= 474; start += 10) {
  const end = Math.min(start + 9, 474);
  const inspected = await workbook.inspect({
    kind: "table",
    range: `トピック台帳!A${start}:Z${end}`,
    include: "values",
    tableMaxRows: 10,
    tableMaxCols: 26,
  });
  const line = inspected.ndjson.trim().split("\n").find((item) => item.includes('"kind":"table"'));
  if (!line) throw new Error(`Topic ledger inspection failed at rows ${start}:${end}`);
  values.push(...JSON.parse(line).values);
}
if (values.length !== 469) throw new Error(`Expected 469 rows, got ${values.length}`);

const column = Object.fromEntries(headers.map((name, index) => [name, index]));
const required = [
  "id", "year", "category", "title", "shortDescription", "conversationPrompt", "genderAffinity",
  "imageAsset", "sourceName", "sourceURL", "linkCheckedAt", "tags", "isActive", "version", "公開可能",
];
for (const name of required) {
  if (!(name in column)) throw new Error(`Missing column: ${name}`);
}

const topics = values.map((row) => {
  if (row[column["公開可能"]] !== "可") throw new Error(`${row[column.id]} is not publishable`);
  const tags = String(row[column.tags] ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const linkCheckedAt = String(row[column.linkCheckedAt]).slice(0, 10);
  return {
    id: row[column.id],
    title: row[column.title],
    shortDescription: row[column.shortDescription],
    conversationPrompt: row[column.conversationPrompt],
    year: row[column.year],
    category: row[column.category],
    genderAffinity: row[column.genderAffinity],
    imageAsset: row[column.imageAsset],
    sourceName: row[column.sourceName],
    sourceURL: row[column.sourceURL],
    linkCheckedAt,
    tags,
    isActive: Boolean(row[column.isActive]),
    version: row[column.version],
  };
});

const ids = new Set(topics.map((topic) => topic.id));
if (ids.size !== topics.length) throw new Error("Duplicate topic IDs");
for (let year = 1960; year <= 2026; year += 1) {
  const yearTopics = topics.filter((topic) => topic.year === year);
  if (yearTopics.length !== 7) throw new Error(`${year}: expected 7 topics, got ${yearTopics.length}`);
  if (new Set(yearTopics.map((topic) => topic.category)).size !== 7) throw new Error(`${year}: duplicate or missing categories`);
}

const payload = {
  schemaVersion: 1,
  contentVersion: "1.0.0",
  generatedAt: "2026-11-10T00:00:00Z",
  topics,
};

await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath} (${topics.length} topics)`);
