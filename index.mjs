#!/usr/bin/env node
/**
 * Scaffold a new pi-package with TypeScript, ESM, and Vitest.
 *
 * Supports standard npm/pnpm init conventions:
 *   npm init pi-package <name>
 *   pnpm create pi-package <name>
 *   npx create-pi-package <name>
 *   node create-pi-package/index.mjs <name>
 *
 * Options:
 *   --no-prefix   Use @mariozechner/<name> instead of @mariozechner/pi-<name>
 *
 * Creates the package directory under the current working directory.
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(process.cwd());

// --- Parse args ---
const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("-")));

const dirName = args[0];
if (!dirName) {
	console.error("Usage: create-pi-package <name> [--no-prefix]");
	console.error("");
	console.error("  <name>        Package directory name (e.g. 'foo')");
	console.error("  --no-prefix   Use @mariozechner/<name> instead of @mariozechner/pi-<name>");
	console.error("");
	console.error("Examples:");
	console.error("  npm init pi-package my-lib");
	console.error("  pnpm create pi-package my-lib");
	console.error("  npx create-pi-package my-lib");
	process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(dirName)) {
	console.error(`Invalid package name "${dirName}". Use lowercase alphanumeric + hyphens, starting with a letter.`);
	process.exit(1);
}

const noPrefix = flags.has("--no-prefix");
const npmName = noPrefix ? `@mariozechner/${dirName}` : `@mariozechner/pi-${dirName}`;
const pkgDir = join(ROOT, dirName);

if (existsSync(pkgDir)) {
	console.error(`Directory already exists: ${dirName}`);
	process.exit(1);
}

const version = "0.0.1";

// --- Templates ---

const packageJson = {
	name: npmName,
	version,
	description: "",
	type: "module",
	main: "./dist/index.js",
	types: "./dist/index.d.ts",
	files: ["dist", "README.md"],
	scripts: {
		clean: "shx rm -rf dist",
		build: "tsgo -p tsconfig.build.json",
		dev: "tsgo -p tsconfig.build.json --watch --preserveWatchOutput",
		test: "vitest --run",
		prepublishOnly: "npm run clean && npm run build",
	},
	keywords: [],
	author: "Mario Zechner",
	license: "MIT",
	repository: {
		type: "git",
		url: "",
	},
	engines: {
		node: ">=20.0.0",
	},
	dependencies: {},
	devDependencies: {
		"@types/node": "^24.3.0",
		vitest: "^3.2.4",
	},
};

const tsconfigBuild = {
	compilerOptions: {
		target: "ES2022",
		module: "Node16",
		moduleResolution: "Node16",
		declaration: true,
		declarationMap: true,
		sourceMap: true,
		strict: true,
		esModuleInterop: true,
		skipLibCheck: true,
		outDir: "./dist",
		rootDir: "./src",
	},
	include: ["src/**/*.ts"],
	exclude: ["node_modules", "dist"],
};

const indexTs = "export {};\n";

const changelogMd = `# Changelog

## [Unreleased]
`;

const readmeMd = `# ${npmName}

## Installation

\`\`\`bash
npm install ${npmName}
\`\`\`

## Usage

\`\`\`typescript
import {} from "${npmName}";
\`\`\`

## License

MIT
`;

// --- Create files ---

function writeJson(filePath, data) {
	writeFileSync(filePath, JSON.stringify(data, null, "\t") + "\n");
}

mkdirSync(join(pkgDir, "src"), { recursive: true });

writeJson(join(pkgDir, "package.json"), packageJson);
writeJson(join(pkgDir, "tsconfig.build.json"), tsconfigBuild);
writeFileSync(join(pkgDir, "src", "index.ts"), indexTs);
writeFileSync(join(pkgDir, "CHANGELOG.md"), changelogMd);
writeFileSync(join(pkgDir, "README.md"), readmeMd);

console.log(`\nCreated ${dirName}/`);
console.log(`  package.json        (${npmName} @ ${version})`);
console.log("  tsconfig.build.json");
console.log("  src/index.ts");
console.log("  CHANGELOG.md");
console.log("  README.md");
console.log("");
console.log("Next steps:");
console.log(`  1. cd ${dirName}`);
console.log("  2. npm install");
console.log("  3. Add a description in package.json");
console.log("  4. Start coding in src/index.ts");
console.log("");
