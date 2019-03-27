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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// TODO move this function to architect or somewhere else where it can be imported from.
// Blatantly copy-pasted from 'require-project-module.ts'.
function requireProjectModule(root, moduleName) {
    return require(require.resolve(moduleName, { paths: [root] }));
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
