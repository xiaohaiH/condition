import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: [{ input: './package/core', outDir: 'dist/', builder: 'mkdist' }],
});
