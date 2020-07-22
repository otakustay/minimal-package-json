import {omit} from 'lodash';
import {minimize} from '../index';

const packageJSON = {
    name: 'minimal-package-json',
    version: '1.0.0',
    repository: 'https://github.com/otakustay/minimal-package-json.git',
    author: 'otakustay <otakustay@gmail.com>',
    license: 'MIT',
    main: 'cjs/index.js',
    module: 'es/index.js',
    types: 'es/index.d.ts',
    files: ['cjs', 'es', 'src'],
    scripts: {
        build: 'rm -rf es cjs && tsc & tsc --module ESNext --outDir ./es',
        'build-check': 'tsc',
        lint: 'skr lint',
        test: 'skr test --coverage --target=react',
    },
    dependencies: {
        eslint: '^7.0.0',
        '@babel/core': '^7.0.0',
    },
    devDependencies: {
        '@reskript/cli': '^0.9.0',
        '@reskript/cli-lint': '^0.9.9',
        '@reskript/cli-test': '^0.9.4',
        '@reskript/config-lint': '^0.12.3',
        typescript: '^3.9.7',
    },
    peerDependencies: {
        webpack: '^4.0.0',
    },
};

const minimal = {
    name: packageJSON.name,
    version: packageJSON.version,
    dependencies: packageJSON.dependencies,
    devDependencies: packageJSON.devDependencies,
    peerDependencies: packageJSON.peerDependencies,
    scripts: {start: packageJSON.scripts.start},
    license: packageJSON.license,
    main: packageJSON.main,
    module: packageJSON.module,
    types: packageJSON.types,
};

test('default options', () => {
    expect(minimize(packageJSON)).toEqual(minimal);
});

test('exclude devDependencies', () => {
    expect(minimize(packageJSON, {devDependencies: false})).toEqual(omit(minimal, 'devDependencies'));
});

test('exclude peerDependencies', () => {
    expect(minimize(packageJSON, {peerDependencies: false})).toEqual(omit(minimal, 'peerDependencies'));
});

test('exclude scripts.start', () => {
    expect(minimize(packageJSON, {startScript: false})).toEqual(omit(minimal, 'scripts'));
});

test('include custom property', () => {
    const minimized = minimize(packageJSON, {includes: ['author', 'repository']});
    expect(minimized).toEqual({...minimal, author: packageJSON.author, repository: packageJSON.repository});
});

test('includes deep proeprty', () => {
    const minimized = minimize(packageJSON, {includes: ['scripts.build']});
    expect(minimized).toEqual({...minimal, scripts: {...minimal.scripts, build: packageJSON.scripts.build}});
});

test('includes deep new', () => {
    const minimized = minimize(packageJSON, {devDependencies: false, includes: ['devDependencies.typescript']});
    expect(minimized).toEqual({...minimal, devDependencies: {typescript: packageJSON.devDependencies.typescript}});
});
