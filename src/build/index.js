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
const Observable_1 = require("rxjs/Observable");
// TODO move this function to architect or somewhere else where it can be imported from.
// Blatantly copy-pasted from 'require-project-module.ts'.
function requireProjectModule(root, moduleName) {
    const resolve = require('resolve');
    return require(resolve.sync(moduleName, { basedir: root }));
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
        return new Observable_1.Observable(obs => {
            const projectNgPackagr = requireProjectModule(core_1.getSystemPath(root), 'ng-packagr');
            const packageJsonPath = core_1.getSystemPath(core_1.resolve(root, core_1.normalize(options.project)));
            projectNgPackagr.ngPackagr()
                .forProject(packageJsonPath)
                .build()
                .then(() => {
                obs.next({ success: true });
                obs.complete();
            })
                .catch((e) => obs.error(e));
        });
    }
}
exports.NgPackagrBuilder = NgPackagrBuilder;
exports.default = NgPackagrBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX25nX3BhY2thZ3Ivc3JjL2J1aWxkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBUUgsK0NBQXlFO0FBRXpFLGdEQUE2QztBQUU3Qyx3RkFBd0Y7QUFDeEYsMERBQTBEO0FBQzFELDhCQUE4QixJQUFZLEVBQUUsVUFBa0I7SUFDNUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFPRDtJQUVFLFlBQW1CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUksQ0FBQztJQUUvQyxHQUFHLENBQUMsYUFBNEQ7UUFDOUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLHVCQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FDM0Msb0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQXFCLENBQUM7WUFDekQsTUFBTSxlQUFlLEdBQUcsb0JBQWEsQ0FBQyxjQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqRixnQkFBZ0IsQ0FBQyxTQUFTLEVBQUU7aUJBQ3pCLFVBQVUsQ0FBQyxlQUFlLENBQUM7aUJBQzNCLEtBQUssRUFBRTtpQkFDUCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNULEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FFRjtBQTVCRCw0Q0E0QkM7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQnVpbGRFdmVudCxcbiAgQnVpbGRlcixcbiAgQnVpbGRlckNvbmZpZ3VyYXRpb24sXG4gIEJ1aWxkZXJDb250ZXh0LFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0JztcbmltcG9ydCB7IGdldFN5c3RlbVBhdGgsIG5vcm1hbGl6ZSwgcmVzb2x2ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCAqIGFzIG5nUGFja2FnciBmcm9tICduZy1wYWNrYWdyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuXG4vLyBUT0RPIG1vdmUgdGhpcyBmdW5jdGlvbiB0byBhcmNoaXRlY3Qgb3Igc29tZXdoZXJlIGVsc2Ugd2hlcmUgaXQgY2FuIGJlIGltcG9ydGVkIGZyb20uXG4vLyBCbGF0YW50bHkgY29weS1wYXN0ZWQgZnJvbSAncmVxdWlyZS1wcm9qZWN0LW1vZHVsZS50cycuXG5mdW5jdGlvbiByZXF1aXJlUHJvamVjdE1vZHVsZShyb290OiBzdHJpbmcsIG1vZHVsZU5hbWU6IHN0cmluZykge1xuICBjb25zdCByZXNvbHZlID0gcmVxdWlyZSgncmVzb2x2ZScpO1xuXG4gIHJldHVybiByZXF1aXJlKHJlc29sdmUuc3luYyhtb2R1bGVOYW1lLCB7IGJhc2VkaXI6IHJvb3QgfSkpO1xufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdQYWNrYWdyQnVpbGRlck9wdGlvbnMge1xuICBwcm9qZWN0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBOZ1BhY2thZ3JCdWlsZGVyIGltcGxlbWVudHMgQnVpbGRlcjxOZ1BhY2thZ3JCdWlsZGVyT3B0aW9ucz4ge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb250ZXh0OiBCdWlsZGVyQ29udGV4dCkgeyB9XG5cbiAgcnVuKGJ1aWxkZXJDb25maWc6IEJ1aWxkZXJDb25maWd1cmF0aW9uPE5nUGFja2FnckJ1aWxkZXJPcHRpb25zPik6IE9ic2VydmFibGU8QnVpbGRFdmVudD4ge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRleHQud29ya3NwYWNlLnJvb3Q7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGJ1aWxkZXJDb25maWcub3B0aW9ucztcblxuICAgIGlmICghb3B0aW9ucy5wcm9qZWN0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgXCJwcm9qZWN0XCIgbXVzdCBiZSBzcGVjaWZpZWQgdG8gYnVpbGQgYSBsaWJyYXJ5XFwncyBucG0gcGFja2FnZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzID0+IHtcbiAgICAgIGNvbnN0IHByb2plY3ROZ1BhY2thZ3IgPSByZXF1aXJlUHJvamVjdE1vZHVsZShcbiAgICAgICAgZ2V0U3lzdGVtUGF0aChyb290KSwgJ25nLXBhY2thZ3InKSBhcyB0eXBlb2YgbmdQYWNrYWdyO1xuICAgICAgY29uc3QgcGFja2FnZUpzb25QYXRoID0gZ2V0U3lzdGVtUGF0aChyZXNvbHZlKHJvb3QsIG5vcm1hbGl6ZShvcHRpb25zLnByb2plY3QpKSk7XG5cbiAgICAgIHByb2plY3ROZ1BhY2thZ3IubmdQYWNrYWdyKClcbiAgICAgICAgLmZvclByb2plY3QocGFja2FnZUpzb25QYXRoKVxuICAgICAgICAuYnVpbGQoKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgb2JzLm5leHQoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IG9icy5lcnJvcihlKSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBOZ1BhY2thZ3JCdWlsZGVyO1xuIl19