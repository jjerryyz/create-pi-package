# create-pi-package

Scaffold a new pi-package with TypeScript, ESM, and Vitest.

## Usage

```bash
npm init pi-package <name>
pnpm create pi-package <name>
npx create-pi-package <name>
```

### Options

- `--no-prefix` — Use `@mariozechner/<name>` instead of the default `@mariozechner/pi-<name>`

### Example

```bash
npx create-pi-package my-lib
```

Creates `my-lib/` in the current directory with:

- `package.json` — ESM, standard scripts
- `tsconfig.build.json` — TypeScript config for building
- `src/index.ts` — empty entry point
- `CHANGELOG.md` — with `[Unreleased]` section
- `README.md` — basic template

## Publishing

```bash
cd create-pi-package
npm publish
```

## License

MIT
