export interface Options {
    devDependencies?: boolean;
    peerDependencies?: boolean;
    startScript?: boolean;
    includes?: string[];
}

const assign = (to: any, from: any, path: string[]) => {
    const currentPropertyName = path.shift();

    /* istanbul ignore next */
    if (!currentPropertyName) {
        return;
    }

    if (!path.length) {
        to[currentPropertyName] = from[currentPropertyName];
        return;
    }

    if (!to[currentPropertyName]) {
        to[currentPropertyName] = {};
    }
    assign(to[currentPropertyName], from[currentPropertyName], path);
};

export const minimize = (packageJSON: Record<string, any>, options: Options = {}): Record<string, any> => {
    const {
        devDependencies = true,
        peerDependencies = true,
        startScript = true,
        includes = [],
    } = options;

    const minimized: Record<string, any> = {
        name: packageJSON.name,
        version: packageJSON.version,
        main: packageJSON.main,
        module: packageJSON.module,
        types: packageJSON.types,
        license: packageJSON.license,
        dependencies: packageJSON.dependencies,
    };

    if (devDependencies) {
        minimized.devDependencies = packageJSON.devDependencies;
    }
    if (peerDependencies) {
        minimized.peerDependencies = packageJSON.peerDependencies;
    }
    if (startScript) {
        minimized.scripts = {
            start: packageJSON.scripts?.start,
        };
    }

    for (const key of includes) {
        const path = key.split('.');
        assign(minimized, packageJSON, path);
    }

    return minimized;
};
