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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX25nX3BhY2thZ3Ivc3JjL2J1aWxkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBUUgsK0NBQStFO0FBQy9FLHlCQUF5QjtBQUV6QiwrQkFBeUM7QUFDekMsOENBQWlEO0FBQ2pELGlDQUFpQztBQUVqQyxNQUFNLHNCQUFzQixHQUFHLFlBQVksQ0FBQztBQUU1Qyx3RkFBd0Y7QUFDeEYsMERBQTBEO0FBQzFELFNBQVMsb0JBQW9CLENBQUMsSUFBWSxFQUFFLFVBQWtCO0lBQzVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsSUFBWSxFQUFFLFVBQWtCO0lBQzVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQVFELFNBQVMscUJBQXFCLENBQUMsV0FBbUI7SUFDaEQsSUFBSSxpQkFBaUIsQ0FBQztJQUV0QixJQUFJO1FBQ0YsaUJBQWlCLEdBQUcsb0JBQW9CLENBQUMsV0FBVyxFQUFFLHlCQUF5QixDQUFDLENBQUM7S0FDbEY7SUFBQyxXQUFNO1FBQ04sOEJBQThCO1FBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7R0FFakMsQ0FBQyxDQUFDO0tBQ0Y7SUFFRCxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzRSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVyRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFO1FBQ3pELE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBSSxDQUFDLFdBQVcsQ0FBQTs2Q0FDUyxnQkFBZ0I7NkNBQ2hCLHNCQUFzQjs7R0FFaEUsQ0FBQyxDQUFDO0tBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxNQUFhLGdCQUFnQjtJQUUzQixZQUFtQixPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFJLENBQUM7SUFFL0MsR0FBRyxDQUFDLGFBQTREO1FBQzlELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUN6QyxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBRXRDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQztTQUNyRjtRQUVELE9BQU8sSUFBSSxpQkFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLENBQzNDLG9CQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxDQUFxQixDQUFDO1lBQ3pELE1BQU0sZUFBZSxHQUFHLG9CQUFhLENBQUMsY0FBTyxDQUFDLElBQUksRUFBRSxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakYsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO2lCQUM5QyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFL0IsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNwQixNQUFNLFlBQVksR0FBRyxvQkFBYSxDQUFDLGNBQU8sQ0FBQyxJQUFJLEVBQUUsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxZQUFZLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUNqQixxQkFBcUIsQ0FBQyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRTNDLE1BQU0saUJBQWlCLEdBQUcsWUFBWTtxQkFDbkMsS0FBSyxFQUFFO3FCQUNQLElBQUksQ0FDSCxlQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQ3RDLHNCQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2IsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFYixPQUFPLFlBQUssQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FDSDtxQkFDQSxTQUFTLEVBQUUsQ0FBQztnQkFFZixPQUFPLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQzlDO2lCQUFNO2dCQUNMLFlBQVksQ0FBQyxLQUFLLEVBQUU7cUJBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUM1QixHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FFRjtBQXBERCw0Q0FvREM7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQnVpbGRFdmVudCxcbiAgQnVpbGRlcixcbiAgQnVpbGRlckNvbmZpZ3VyYXRpb24sXG4gIEJ1aWxkZXJDb250ZXh0LFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0JztcbmltcG9ydCB7IGdldFN5c3RlbVBhdGgsIG5vcm1hbGl6ZSwgcmVzb2x2ZSwgdGFncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG5nUGFja2FnciBmcm9tICduZy1wYWNrYWdyJztcbmltcG9ydCB7IEVNUFRZLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgKiBhcyBzZW12ZXIgZnJvbSAnc2VtdmVyJztcblxuY29uc3QgTkVXX05HX1BBQ0tBR1JfVkVSU0lPTiA9ICc0LjAuMC1yYy4zJztcblxuLy8gVE9ETyBtb3ZlIHRoaXMgZnVuY3Rpb24gdG8gYXJjaGl0ZWN0IG9yIHNvbWV3aGVyZSBlbHNlIHdoZXJlIGl0IGNhbiBiZSBpbXBvcnRlZCBmcm9tLlxuLy8gQmxhdGFudGx5IGNvcHktcGFzdGVkIGZyb20gJ3JlcXVpcmUtcHJvamVjdC1tb2R1bGUudHMnLlxuZnVuY3Rpb24gcmVxdWlyZVByb2plY3RNb2R1bGUocm9vdDogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJlcXVpcmUocmVxdWlyZS5yZXNvbHZlKG1vZHVsZU5hbWUsIHsgcGF0aHM6IFtyb290XSB9KSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVQcm9qZWN0TW9kdWxlKHJvb3Q6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiByZXF1aXJlLnJlc29sdmUobW9kdWxlTmFtZSwgeyBwYXRoczogW3Jvb3RdIH0pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5nUGFja2FnckJ1aWxkZXJPcHRpb25zIHtcbiAgcHJvamVjdDogc3RyaW5nO1xuICB0c0NvbmZpZz86IHN0cmluZztcbiAgd2F0Y2g/OiBib29sZWFuO1xufVxuXG5mdW5jdGlvbiBjaGVja05nUGFja2FnclZlcnNpb24ocHJvamVjdFJvb3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgbmdQYWNrYWdySnNvblBhdGg7XG5cbiAgdHJ5IHtcbiAgICBuZ1BhY2thZ3JKc29uUGF0aCA9IHJlc29sdmVQcm9qZWN0TW9kdWxlKHByb2plY3RSb290LCAnbmctcGFja2Fnci9wYWNrYWdlLmpzb24nKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gbmctcGFja2FnciBpcyBub3QgaW5zdGFsbGVkXG4gICAgdGhyb3cgbmV3IEVycm9yKHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgbmctcGFja2FnciBpcyBub3QgaW5zdGFsbGVkLiBSdW4gXFxgbnBtIGluc3RhbGwgbmctcGFja2FnciAtLXNhdmUtZGV2XFxgIGFuZCB0cnkgYWdhaW4uXG4gIGApO1xuICB9XG5cbiAgY29uc3QgbmdQYWNrYWdyUGFja2FnZUpzb24gPSBmcy5yZWFkRmlsZVN5bmMobmdQYWNrYWdySnNvblBhdGgpLnRvU3RyaW5nKCk7XG4gIGNvbnN0IG5nUGFja2FnclZlcnNpb24gPSBKU09OLnBhcnNlKG5nUGFja2FnclBhY2thZ2VKc29uKVsndmVyc2lvbiddO1xuXG4gIGlmICghc2VtdmVyLmd0ZShuZ1BhY2thZ3JWZXJzaW9uLCBORVdfTkdfUEFDS0FHUl9WRVJTSU9OKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih0YWdzLnN0cmlwSW5kZW50YFxuICAgIFRoZSBpbnN0YWxsZWQgdmVyc2lvbiBvZiBuZy1wYWNrYWdyIGlzICR7bmdQYWNrYWdyVmVyc2lvbn0uIFRoZSB3YXRjaCBmZWF0dXJlXG4gICAgcmVxdWlyZXMgbmctcGFja2FnciB2ZXJzaW9uIHRvIHNhdGlzZnkgJHtORVdfTkdfUEFDS0FHUl9WRVJTSU9OfS5cbiAgICBQbGVhc2UgdXBncmFkZSB5b3VyIG5nLXBhY2thZ3IgdmVyc2lvbi5cbiAgYCk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGNsYXNzIE5nUGFja2FnckJ1aWxkZXIgaW1wbGVtZW50cyBCdWlsZGVyPE5nUGFja2FnckJ1aWxkZXJPcHRpb25zPiB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRleHQ6IEJ1aWxkZXJDb250ZXh0KSB7IH1cblxuICBydW4oYnVpbGRlckNvbmZpZzogQnVpbGRlckNvbmZpZ3VyYXRpb248TmdQYWNrYWdyQnVpbGRlck9wdGlvbnM+KTogT2JzZXJ2YWJsZTxCdWlsZEV2ZW50PiB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGV4dC53b3Jrc3BhY2Uucm9vdDtcbiAgICBjb25zdCBvcHRpb25zID0gYnVpbGRlckNvbmZpZy5vcHRpb25zO1xuXG4gICAgaWYgKCFvcHRpb25zLnByb2plY3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBcInByb2plY3RcIiBtdXN0IGJlIHNwZWNpZmllZCB0byBidWlsZCBhIGxpYnJhcnlcXCdzIG5wbSBwYWNrYWdlLicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnMgPT4ge1xuICAgICAgY29uc3QgcHJvamVjdE5nUGFja2FnciA9IHJlcXVpcmVQcm9qZWN0TW9kdWxlKFxuICAgICAgICBnZXRTeXN0ZW1QYXRoKHJvb3QpLCAnbmctcGFja2FncicpIGFzIHR5cGVvZiBuZ1BhY2thZ3I7XG4gICAgICBjb25zdCBwYWNrYWdlSnNvblBhdGggPSBnZXRTeXN0ZW1QYXRoKHJlc29sdmUocm9vdCwgbm9ybWFsaXplKG9wdGlvbnMucHJvamVjdCkpKTtcblxuICAgICAgY29uc3QgbmdQa2dQcm9qZWN0ID0gcHJvamVjdE5nUGFja2Fnci5uZ1BhY2thZ3IoKVxuICAgICAgICAuZm9yUHJvamVjdChwYWNrYWdlSnNvblBhdGgpO1xuXG4gICAgICBpZiAob3B0aW9ucy50c0NvbmZpZykge1xuICAgICAgICBjb25zdCB0c0NvbmZpZ1BhdGggPSBnZXRTeXN0ZW1QYXRoKHJlc29sdmUocm9vdCwgbm9ybWFsaXplKG9wdGlvbnMudHNDb25maWcpKSk7XG4gICAgICAgIG5nUGtnUHJvamVjdC53aXRoVHNDb25maWcodHNDb25maWdQYXRoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMud2F0Y2gpIHtcbiAgICAgICAgY2hlY2tOZ1BhY2thZ3JWZXJzaW9uKGdldFN5c3RlbVBhdGgocm9vdCkpO1xuXG4gICAgICAgIGNvbnN0IG5nUGtnU3Vic2NyaXB0aW9uID0gbmdQa2dQcm9qZWN0XG4gICAgICAgICAgLndhdGNoKClcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIHRhcCgoKSA9PiBvYnMubmV4dCh7IHN1Y2Nlc3M6IHRydWUgfSkpLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlID0+IHtcbiAgICAgICAgICAgICAgb2JzLmVycm9yKGUpO1xuXG4gICAgICAgICAgICAgIHJldHVybiBFTVBUWTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIClcbiAgICAgICAgICAuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IG5nUGtnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZ1BrZ1Byb2plY3QuYnVpbGQoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIG9icy5uZXh0KHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4gb2JzLmVycm9yKGUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5nUGFja2FnckJ1aWxkZXI7XG4iXX0=