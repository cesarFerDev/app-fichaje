import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const supportedLocales = ["en", "es"];
const domainsDirectory = path.resolve("src/domains");
const mode = process.argv[2] ?? "--check";

if (!new Set(["--check", "--write"]).has(mode)) {
  throw new Error("Use --check or --write.");
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sortKeys(value) {
  if (!isObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.keys(value)
      .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0))
      .map((key) => [key, sortKeys(value[key])]),
  );
}

function collectLeafPaths(value, prefix = "") {
  if (!isObject(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    collectLeafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

async function directoryExists(directory) {
  try {
    await access(directory);
    return true;
  } catch {
    return false;
  }
}

async function readTranslations(file) {
  const source = await readFile(file, "utf8");
  const translations = JSON.parse(source);

  if (!isObject(translations)) {
    throw new Error(`${file} must contain a JSON object.`);
  }

  return { source, translations };
}

const domainEntries = await readdir(domainsDirectory, { withFileTypes: true });
const errors = [];

for (const domainEntry of domainEntries.filter((entry) =>
  entry.isDirectory(),
)) {
  const translationsDirectory = path.join(
    domainsDirectory,
    domainEntry.name,
    "i18n",
  );

  if (!(await directoryExists(translationsDirectory))) {
    continue;
  }

  const translationsByLocale = new Map();

  for (const locale of supportedLocales) {
    const file = path.join(translationsDirectory, `${locale}.json`);

    try {
      const { source, translations } = await readTranslations(file);
      const sortedSource = `${JSON.stringify(sortKeys(translations), null, 2)}\n`;

      if (mode === "--write") {
        await writeFile(file, sortedSource);
      } else if (source !== sortedSource) {
        errors.push(`${file} does not have alphabetically sorted keys.`);
      }

      translationsByLocale.set(locale, translations);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  const reference = translationsByLocale.get(supportedLocales[0]);

  if (!reference) {
    continue;
  }

  const referencePaths = collectLeafPaths(reference).sort();

  for (const locale of supportedLocales.slice(1)) {
    const translations = translationsByLocale.get(locale);

    if (!translations) {
      continue;
    }

    const paths = collectLeafPaths(translations).sort();

    if (JSON.stringify(paths) !== JSON.stringify(referencePaths)) {
      errors.push(
        `${domainEntry.name}: ${supportedLocales[0]} and ${locale} do not contain the same translation keys.`,
      );
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }

  process.exitCode = 1;
}
