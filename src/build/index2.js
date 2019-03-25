"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const index2_1 = require("@angular-devkit/architect/src/index2");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
async function initialize(options, root) {
    const packager = (await Promise.resolve().then(() => require('ng-packagr'))).ngPackagr();
    packager.forProject(path_1.resolve(root, options.project));
    if (options.tsConfig) {
        packager.withTsConfig(path_1.resolve(root, options.tsConfig));
    }
    return packager;
}
function buildLibrary(options, context) {
    return rxjs_1.from(initialize(options, context.workspaceRoot)).pipe(operators_1.switchMap(packager => options.watch ? packager.watch() : packager.build()), operators_1.mapTo({ success: true }), operators_1.catchError(error => {
        context.reportStatus('Error: ' + error);
        return [{ success: false }];
    }));
}
exports.buildLibrary = buildLibrary;
exports.default = index2_1.createBuilder(buildLibrary);
