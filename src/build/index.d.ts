/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { Schema } from './schema';
/** @deprecated Since 10.1 use `NgPackagrBuilderOptions` from `@angular-devkit/build-angular` instead. */
export declare type NgPackagrBuilderOptions = Schema;
/** @deprecated Since 10.1 use `executeNgPackagrBuilder` from `@angular-devkit/build-angular` instead. */
export declare function execute(options: NgPackagrBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<Record<string, string> & Schema>;
export default _default;
