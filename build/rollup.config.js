// rollup.config.js
const fs = require('fs');
const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const babel = require('rollup-plugin-babel');
const {terser} = require('rollup-plugin-terser');
const minimist = require('minimist');

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs.readFileSync('./.browserslistrc')
    .toString()
    .split('\n')
    .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

console.log(projectRoot, 'projectRoot');

const baseConfig = {
    input: 'src/entry.js',
    plugins: {
        replace: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.ES_BUILD': JSON.stringify('false'),
        },
        babel: {
            exclude: 'node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
    // list external dependencies, exactly the way it is written in the import statement.
    // eg. 'jquery'
    'vue',
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
    // Provide global variable names to replace your external imports
    // eg. jquery: '$'
    vue: 'Vue',
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === 'es') {
    const esConfig = {
        ...baseConfig,
        external,
        output: {
            sourcemap: true,
            file: 'dist/vue-iplus.esm.js',
            format: 'esm',
            exports: 'named',
        },
        plugins: [
            replace({
                ...baseConfig.plugins.replace,
                'process.env.ES_BUILD': JSON.stringify('true'),
            }),
            babel({
                ...baseConfig.plugins.babel,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: esbrowserslist,
                        },
                    ],
                ],
            }),
            commonjs(),
        ],
    };
    buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
    const umdConfig = {
        ...baseConfig,
        external,
        output: {
            sourcemap: true,
            compact: true,
            file: 'dist/vue-iplus.ssr.js',
            format: 'cjs',
            name: 'VueIplus',
            exports: 'named',
            globals,
        },
        plugins: [
            replace(baseConfig.plugins.replace),
            babel(baseConfig.plugins.babel),
            commonjs(),
        ],
    };
    buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'umd') {
    const unpkgConfig = {
        ...baseConfig,
        external,
        output: {
            sourcemap: true,
            compact: true,
            file: 'dist/vue-iplus.js',
            format: 'umd',
            name: 'VueIplus',
            exports: 'named',
            globals,
        },
        plugins: [
            replace(baseConfig.plugins.replace),
            babel(baseConfig.plugins.babel),
            commonjs(),
            terser({
                output: {
                    ecma: 5,
                },
            }),
        ],
    };
    buildFormats.push(unpkgConfig);
}


//
// buildFormats.forEach((config, i) => {
//     buildFormats[i] = [
//         config,
//
//     ]
// })


// Export config
// export default buildFormats;
module.exports = buildFormats
