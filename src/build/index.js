"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const fs = require("fs");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
const NEW_NG_PACKAGR_VERSION = '4.0.0-rc.3';
// TODO move this function to architect or somewhere else where it can be imported from.
// Blatantly copy-pasted from 'require-project-module.ts'.
function requireProjectModule(root, moduleName) {
    return require(require.resolve(moduleName, { paths: [root] }));
}
function resolveProjectModule(root, moduleName) {
    return require.resolve(moduleName, { paths: [root] });
}
function checkNgPackagrVersion(projectRoot) {
    let ngPackagrJsonPath;
    try {
        ngPackagrJsonPath = resolveProjectModule(projectRoot, 'ng-packagr/package.json');
    }
    catch (_a) {
        // ng-packagr is not installed
        throw new Error(core_1.tags.stripIndent `
    ng-packagr is not installed. Run \`npm install ng-packagr --save-dev\` and try again.
  `);
    }
    const ngPackagrPackageJson = fs.readFileSync(ngPackagrJsonPath).toString();
    const ngPackagrVersion = JSON.parse(ngPackagrPackageJson)['version'];
    if (!semver.gte(ngPackagrVersion, NEW_NG_PACKAGR_VERSION)) {
        throw new Error(core_1.tags.stripIndent `
    The installed version of ng-packagr is ${ngPackagrVersion}. The watch feature
    requires ng-packagr version to satisfy ${NEW_NG_PACKAGR_VERSION}.
    Please upgrade your ng-packagr version.
  `);
    }
    return true;
}
class NgPackagrBuilder {
    constructor(context) {
        this.context = context;
    }
    run(builderConfig) {
        const root = this.context.workspace.root;
        const options = builderConfig.options;
        if (!options.project) {
            throw new Error('A "project" must be specified to build a library\'s npm package.');
        }
        return new rxjs_1.Observable(obs => {
            const projectNgPackagr = requireProjectModule(core_1.getSystemPath(root), 'ng-packagr');
            const packageJsonPath = core_1.getSystemPath(core_1.resolve(root, core_1.normalize(options.project)));
            const ngPkgProject = projectNgPackagr.ngPackagr()
                .forProject(packageJsonPath);
            if (options.tsConfig) {
                const tsConfigPath = core_1.getSystemPath(core_1.resolve(root, core_1.normalize(options.tsConfig)));
                ngPkgProject.withTsConfig(tsConfigPath);
            }
            if (options.watch) {
                checkNgPackagrVersion(core_1.getSystemPath(root));
                const ngPkgSubscription = ngPkgProject
                    .watch()
                    .pipe(operators_1.tap(() => obs.next({ success: true })), operators_1.catchError(e => {
                    obs.error(e);
                    return rxjs_1.EMPTY;
                }))
                    .subscribe();
                return () => ngPkgSubscription.unsubscribe();
            }
            else {
                ngPkgProject.build()
                    .then(() => {
                    obs.next({ success: true });
                    obs.complete();
                })
                    .catch(e => obs.error(e));
            }
        });
    }
}
exports.NgPackagrBuilder = NgPackagrBuilder;
exports.default = NgPackagrBuilder;
