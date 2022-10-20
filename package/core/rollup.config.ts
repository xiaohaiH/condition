import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';

const external = ['vue', 'vue-demi'];
const globals = {
    vue: 'Vue',
    // 'vue-composition-api': 'VueCompositionAPI',
    'vue-demi': 'VueDemi',
};
const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8');
const injectVueDemi: Plugin = {
    name: 'inject-vue-demi',
    renderChunk(code) {
        return `${VUE_DEMI_IIFE};\n;${code}`;
    },
};

/** @type {import('rollup').RollupOptions[]} */
const options: RollupOptions[] = [
    {
        input: 'index.ts',
        plugins: [
            commonjs(),
            resolve(),
            typescript(),
            babel({
                presets: ['@vue/babel-preset-jsx'],
                extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx'],
            }),
            // copy({
            //     targets: [{ src: 'index.ts', dest: 'dist' }],
            //     // targets: [{ src: './dist/index.umd.js', dest: '../../example-static/js/core-condition.js' }],
            // }),
        ],
        external,
        output: [
            { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
            {
                file: 'dist/index.esm.min.js',
                format: 'es',
                sourcemap: true,
                plugins: [terser({ format: { comments: false } })],
            },
            { file: 'dist/index.cjs.js', format: 'cjs', exports: 'named', sourcemap: true },
            {
                file: 'dist/index.cjs.min.js',
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
                plugins: [terser({ format: { comments: false } })],
            },
            {
                file: 'dist/index.umd.js',
                format: 'umd',
                name: 'CoreCondition',
                exports: 'named',
                sourcemap: true,
                globals: globals,
                plugins: [injectVueDemi],
            },
            {
                file: 'dist/index.umd.min.js',
                format: 'umd',
                name: 'CoreCondition',
                exports: 'named',
                sourcemap: true,
                globals: globals,
                plugins: [injectVueDemi, terser({ format: { comments: false } })],
            },
        ],
    },
    {
        input: 'index.ts',
        plugins: [dts()],
        output: { file: 'dist/index.d.ts', format: 'es' },
    },
];

export default options;
