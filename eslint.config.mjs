import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

// Biome owns formatting and general linting (see biome.json).
// ESLint is kept ONLY for Next.js core-web-vitals rules, which Biome has no
// equivalent for: next/image over <img>, next/link usage, sync scripts, etc.
const eslintConfig = defineConfig([
	...nextVitals,
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		'src/payload-types.ts',
		'src/app/(payload)/admin/importMap.js',
	]),
]);

export default eslintConfig;
