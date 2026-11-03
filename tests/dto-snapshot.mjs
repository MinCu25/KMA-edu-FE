import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const snapshot = JSON.parse(readFileSync("docs/backend-contract.json", "utf8"));
const scheduling = JSON.parse(
  readFileSync("docs/scheduling-contract.json", "utf8"),
);
const overrides = new Map(scheduling.files.map((f) => [f.path, f]));
const files = [
  ...snapshot.files.filter((f) => !overrides.has(f.path)),
  ...scheduling.files,
];
const types = readFileSync("src/types/dto.ts", "utf8");
let checked = 0;
for (const file of files) {
  const name = file.path.split("/").pop().replace(".java", "");
  const match = types.match(
    new RegExp(
      "export interface " + name + "(?:<[^>]+>)?\\s*\\{([\\s\\S]*?)\\n\\}",
    ),
  );
  if (!match) continue;
  // Lombok boolean isX fields expose JSON x via isX() getters under default Jackson naming.
  const source = file.content.replace(
    /@(NotNull|Positive|Valid)\b(?:\([^)]*\))?/g,
    "",
  );
  const fields = [
    ...source.matchAll(/private\s+([\w<>?, ]+)\s+(\w+)\s*(?:=[^;]*)?;/g),
  ]
    .map(([, type, key]) =>
      type.trim() === "boolean" && /^is[A-Z]/.test(key)
        ? key[2].toLowerCase() + key.slice(3)
        : key,
    )
    .sort();
  const local = [...match[1].matchAll(/^\s*(\w+)\??:/gm)]
    .map((m) => m[1])
    .sort();
  assert.deepEqual(
    local,
    fields,
    `${name}: property names diverge from pinned Java source`,
  );
  checked++;
}
assert.ok(checked >= 40);
console.log(
  `PASS: ${checked} DTO field sets match backend snapshot ${snapshot.sha}; scheduling overrides ${scheduling.sha}. Boolean JSON names assume default Jackson/Lombok; verify response fixtures at integration.`,
);
