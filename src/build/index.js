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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX25nX3BhY2thZ3Ivc3JjL2J1aWxkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBUUgsK0NBQStFO0FBQy9FLHlCQUF5QjtBQUV6QiwrQkFBeUM7QUFDekMsOENBQWlEO0FBQ2pELGlDQUFpQztBQUVqQyxNQUFNLHNCQUFzQixHQUFHLFlBQVksQ0FBQztBQUU1Qyx3RkFBd0Y7QUFDeEYsMERBQTBEO0FBQzFELDhCQUE4QixJQUFZLEVBQUUsVUFBa0I7SUFDNUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQsOEJBQThCLElBQVksRUFBRSxVQUFrQjtJQUM1RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFRRCwrQkFBK0IsV0FBbUI7SUFDaEQsSUFBSSxpQkFBaUIsQ0FBQztJQUV0QixJQUFJO1FBQ0YsaUJBQWlCLEdBQUcsb0JBQW9CLENBQUMsV0FBVyxFQUFFLHlCQUF5QixDQUFDLENBQUM7S0FDbEY7SUFBQyxXQUFNO1FBQ04sOEJBQThCO1FBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7R0FFakMsQ0FBQyxDQUFDO0tBQ0Y7SUFFRCxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzRSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVyRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBSSxDQUFDLFdBQVcsQ0FBQTs2Q0FDUyxnQkFBZ0I7NkNBQ2hCLHNCQUFzQjs7R0FFaEUsQ0FBQyxDQUFDO0tBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDtJQUVFLFlBQW1CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUksQ0FBQztJQUUvQyxHQUFHLENBQUMsYUFBNEQ7UUFDOUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFFdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1NBQ3JGO1FBRUQsT0FBTyxJQUFJLGlCQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FDM0Msb0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQXFCLENBQUM7WUFDekQsTUFBTSxlQUFlLEdBQUcsb0JBQWEsQ0FBQyxjQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqRixNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUU7aUJBQzlDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUUvQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLE1BQU0sWUFBWSxHQUFHLG9CQUFhLENBQUMsY0FBTyxDQUFDLElBQUksRUFBRSxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLFlBQVksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDekM7WUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQ2pCLHFCQUFxQixDQUFDLG9CQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFM0MsTUFBTSxpQkFBaUIsR0FBRyxZQUFZO3FCQUNuQyxLQUFLLEVBQUU7cUJBQ1AsSUFBSSxDQUNILGVBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFDdEMsc0JBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDYixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUViLE9BQU8sWUFBSyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUNIO3FCQUNBLFNBQVMsRUFBRSxDQUFDO2dCQUVmLE9BQU8sR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDOUM7aUJBQU07Z0JBQ0wsWUFBWSxDQUFDLEtBQUssRUFBRTtxQkFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDVCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQzVCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakIsQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUVGO0FBcERELDRDQW9EQztBQUVELGtCQUFlLGdCQUFnQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBCdWlsZEV2ZW50LFxuICBCdWlsZGVyLFxuICBCdWlsZGVyQ29uZmlndXJhdGlvbixcbiAgQnVpbGRlckNvbnRleHQsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QnO1xuaW1wb3J0IHsgZ2V0U3lzdGVtUGF0aCwgbm9ybWFsaXplLCByZXNvbHZlLCB0YWdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgbmdQYWNrYWdyIGZyb20gJ25nLXBhY2thZ3InO1xuaW1wb3J0IHsgRU1QVFksIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuXG5jb25zdCBORVdfTkdfUEFDS0FHUl9WRVJTSU9OID0gJzQuMC4wLXJjLjMnO1xuXG4vLyBUT0RPIG1vdmUgdGhpcyBmdW5jdGlvbiB0byBhcmNoaXRlY3Qgb3Igc29tZXdoZXJlIGVsc2Ugd2hlcmUgaXQgY2FuIGJlIGltcG9ydGVkIGZyb20uXG4vLyBCbGF0YW50bHkgY29weS1wYXN0ZWQgZnJvbSAncmVxdWlyZS1wcm9qZWN0LW1vZHVsZS50cycuXG5mdW5jdGlvbiByZXF1aXJlUHJvamVjdE1vZHVsZShyb290OiBzdHJpbmcsIG1vZHVsZU5hbWU6IHN0cmluZykge1xuICByZXR1cm4gcmVxdWlyZShyZXF1aXJlLnJlc29sdmUobW9kdWxlTmFtZSwgeyBwYXRoczogW3Jvb3RdIH0pKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVByb2plY3RNb2R1bGUocm9vdDogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJlcXVpcmUucmVzb2x2ZShtb2R1bGVOYW1lLCB7IHBhdGhzOiBbcm9vdF0gfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdQYWNrYWdyQnVpbGRlck9wdGlvbnMge1xuICBwcm9qZWN0OiBzdHJpbmc7XG4gIHRzQ29uZmlnPzogc3RyaW5nO1xuICB3YXRjaD86IGJvb2xlYW47XG59XG5cbmZ1bmN0aW9uIGNoZWNrTmdQYWNrYWdyVmVyc2lvbihwcm9qZWN0Um9vdDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGxldCBuZ1BhY2thZ3JKc29uUGF0aDtcblxuICB0cnkge1xuICAgIG5nUGFja2Fnckpzb25QYXRoID0gcmVzb2x2ZVByb2plY3RNb2R1bGUocHJvamVjdFJvb3QsICduZy1wYWNrYWdyL3BhY2thZ2UuanNvbicpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBuZy1wYWNrYWdyIGlzIG5vdCBpbnN0YWxsZWRcbiAgICB0aHJvdyBuZXcgRXJyb3IodGFncy5zdHJpcEluZGVudGBcbiAgICBuZy1wYWNrYWdyIGlzIG5vdCBpbnN0YWxsZWQuIFJ1biBcXGBucG0gaW5zdGFsbCBuZy1wYWNrYWdyIC0tc2F2ZS1kZXZcXGAgYW5kIHRyeSBhZ2Fpbi5cbiAgYCk7XG4gIH1cblxuICBjb25zdCBuZ1BhY2thZ3JQYWNrYWdlSnNvbiA9IGZzLnJlYWRGaWxlU3luYyhuZ1BhY2thZ3JKc29uUGF0aCkudG9TdHJpbmcoKTtcbiAgY29uc3QgbmdQYWNrYWdyVmVyc2lvbiA9IEpTT04ucGFyc2UobmdQYWNrYWdyUGFja2FnZUpzb24pWyd2ZXJzaW9uJ107XG5cbiAgaWYgKCFzZW12ZXIuZ3RlKG5nUGFja2FnclZlcnNpb24sIE5FV19OR19QQUNLQUdSX1ZFUlNJT04pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgVGhlIGluc3RhbGxlZCB2ZXJzaW9uIG9mIG5nLXBhY2thZ3IgaXMgJHtuZ1BhY2thZ3JWZXJzaW9ufS4gVGhlIHdhdGNoIGZlYXR1cmVcbiAgICByZXF1aXJlcyBuZy1wYWNrYWdyIHZlcnNpb24gdG8gc2F0aXNmeSAke05FV19OR19QQUNLQUdSX1ZFUlNJT059LlxuICAgIFBsZWFzZSB1cGdyYWRlIHlvdXIgbmctcGFja2FnciB2ZXJzaW9uLlxuICBgKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgY2xhc3MgTmdQYWNrYWdyQnVpbGRlciBpbXBsZW1lbnRzIEJ1aWxkZXI8TmdQYWNrYWdyQnVpbGRlck9wdGlvbnM+IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dDogQnVpbGRlckNvbnRleHQpIHsgfVxuXG4gIHJ1bihidWlsZGVyQ29uZmlnOiBCdWlsZGVyQ29uZmlndXJhdGlvbjxOZ1BhY2thZ3JCdWlsZGVyT3B0aW9ucz4pOiBPYnNlcnZhYmxlPEJ1aWxkRXZlbnQ+IHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZXh0LndvcmtzcGFjZS5yb290O1xuICAgIGNvbnN0IG9wdGlvbnMgPSBidWlsZGVyQ29uZmlnLm9wdGlvbnM7XG5cbiAgICBpZiAoIW9wdGlvbnMucHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIFwicHJvamVjdFwiIG11c3QgYmUgc3BlY2lmaWVkIHRvIGJ1aWxkIGEgbGlicmFyeVxcJ3MgbnBtIHBhY2thZ2UuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9icyA9PiB7XG4gICAgICBjb25zdCBwcm9qZWN0TmdQYWNrYWdyID0gcmVxdWlyZVByb2plY3RNb2R1bGUoXG4gICAgICAgIGdldFN5c3RlbVBhdGgocm9vdCksICduZy1wYWNrYWdyJykgYXMgdHlwZW9mIG5nUGFja2FncjtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uUGF0aCA9IGdldFN5c3RlbVBhdGgocmVzb2x2ZShyb290LCBub3JtYWxpemUob3B0aW9ucy5wcm9qZWN0KSkpO1xuXG4gICAgICBjb25zdCBuZ1BrZ1Byb2plY3QgPSBwcm9qZWN0TmdQYWNrYWdyLm5nUGFja2FncigpXG4gICAgICAgIC5mb3JQcm9qZWN0KHBhY2thZ2VKc29uUGF0aCk7XG5cbiAgICAgIGlmIChvcHRpb25zLnRzQ29uZmlnKSB7XG4gICAgICAgIGNvbnN0IHRzQ29uZmlnUGF0aCA9IGdldFN5c3RlbVBhdGgocmVzb2x2ZShyb290LCBub3JtYWxpemUob3B0aW9ucy50c0NvbmZpZykpKTtcbiAgICAgICAgbmdQa2dQcm9qZWN0LndpdGhUc0NvbmZpZyh0c0NvbmZpZ1BhdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy53YXRjaCkge1xuICAgICAgICBjaGVja05nUGFja2FnclZlcnNpb24oZ2V0U3lzdGVtUGF0aChyb290KSk7XG5cbiAgICAgICAgY29uc3QgbmdQa2dTdWJzY3JpcHRpb24gPSBuZ1BrZ1Byb2plY3RcbiAgICAgICAgICAud2F0Y2goKVxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgdGFwKCgpID0+IG9icy5uZXh0KHsgc3VjY2VzczogdHJ1ZSB9KSksXG4gICAgICAgICAgICBjYXRjaEVycm9yKGUgPT4ge1xuICAgICAgICAgICAgICBvYnMuZXJyb3IoZSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIEVNUFRZO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4gbmdQa2dTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5nUGtnUHJvamVjdC5idWlsZCgpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgb2JzLm5leHQoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgICAgb2JzLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZSA9PiBvYnMuZXJyb3IoZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmdQYWNrYWdyQnVpbGRlcjtcbiJdfQ==