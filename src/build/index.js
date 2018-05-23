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
            ngPkgProject.build()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX25nX3BhY2thZ3Ivc3JjL2J1aWxkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBUUgsK0NBQXlFO0FBRXpFLCtCQUFrQztBQUVsQyx3RkFBd0Y7QUFDeEYsMERBQTBEO0FBQzFELDhCQUE4QixJQUFZLEVBQUUsVUFBa0I7SUFDNUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFRRDtJQUVFLFlBQW1CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUksQ0FBQztJQUUvQyxHQUFHLENBQUMsYUFBNEQ7UUFDOUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3pDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLGlCQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FDM0Msb0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQXFCLENBQUM7WUFDekQsTUFBTSxlQUFlLEdBQUcsb0JBQWEsQ0FBQyxjQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqRixNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUU7aUJBQzlDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUUvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxZQUFZLEdBQUcsb0JBQWEsQ0FBQyxjQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0UsWUFBWSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsWUFBWSxDQUFDLEtBQUssRUFBRTtpQkFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBRUY7QUFsQ0QsNENBa0NDO0FBRUQsa0JBQWUsZ0JBQWdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEJ1aWxkRXZlbnQsXG4gIEJ1aWxkZXIsXG4gIEJ1aWxkZXJDb25maWd1cmF0aW9uLFxuICBCdWlsZGVyQ29udGV4dCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdCc7XG5pbXBvcnQgeyBnZXRTeXN0ZW1QYXRoLCBub3JtYWxpemUsIHJlc29sdmUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgKiBhcyBuZ1BhY2thZ3IgZnJvbSAnbmctcGFja2Fncic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbi8vIFRPRE8gbW92ZSB0aGlzIGZ1bmN0aW9uIHRvIGFyY2hpdGVjdCBvciBzb21ld2hlcmUgZWxzZSB3aGVyZSBpdCBjYW4gYmUgaW1wb3J0ZWQgZnJvbS5cbi8vIEJsYXRhbnRseSBjb3B5LXBhc3RlZCBmcm9tICdyZXF1aXJlLXByb2plY3QtbW9kdWxlLnRzJy5cbmZ1bmN0aW9uIHJlcXVpcmVQcm9qZWN0TW9kdWxlKHJvb3Q6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiByZXF1aXJlKHJlcXVpcmUucmVzb2x2ZShtb2R1bGVOYW1lLCB7IHBhdGhzOiBbcm9vdF0gfSkpO1xufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdQYWNrYWdyQnVpbGRlck9wdGlvbnMge1xuICBwcm9qZWN0OiBzdHJpbmc7XG4gIHRzQ29uZmlnPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTmdQYWNrYWdyQnVpbGRlciBpbXBsZW1lbnRzIEJ1aWxkZXI8TmdQYWNrYWdyQnVpbGRlck9wdGlvbnM+IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dDogQnVpbGRlckNvbnRleHQpIHsgfVxuXG4gIHJ1bihidWlsZGVyQ29uZmlnOiBCdWlsZGVyQ29uZmlndXJhdGlvbjxOZ1BhY2thZ3JCdWlsZGVyT3B0aW9ucz4pOiBPYnNlcnZhYmxlPEJ1aWxkRXZlbnQ+IHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZXh0LndvcmtzcGFjZS5yb290O1xuICAgIGNvbnN0IG9wdGlvbnMgPSBidWlsZGVyQ29uZmlnLm9wdGlvbnM7XG5cbiAgICBpZiAoIW9wdGlvbnMucHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIFwicHJvamVjdFwiIG11c3QgYmUgc3BlY2lmaWVkIHRvIGJ1aWxkIGEgbGlicmFyeVxcJ3MgbnBtIHBhY2thZ2UuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9icyA9PiB7XG4gICAgICBjb25zdCBwcm9qZWN0TmdQYWNrYWdyID0gcmVxdWlyZVByb2plY3RNb2R1bGUoXG4gICAgICAgIGdldFN5c3RlbVBhdGgocm9vdCksICduZy1wYWNrYWdyJykgYXMgdHlwZW9mIG5nUGFja2FncjtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uUGF0aCA9IGdldFN5c3RlbVBhdGgocmVzb2x2ZShyb290LCBub3JtYWxpemUob3B0aW9ucy5wcm9qZWN0KSkpO1xuXG4gICAgICBjb25zdCBuZ1BrZ1Byb2plY3QgPSBwcm9qZWN0TmdQYWNrYWdyLm5nUGFja2FncigpXG4gICAgICAgIC5mb3JQcm9qZWN0KHBhY2thZ2VKc29uUGF0aCk7XG5cbiAgICAgIGlmIChvcHRpb25zLnRzQ29uZmlnKSB7XG4gICAgICAgIGNvbnN0IHRzQ29uZmlnUGF0aCA9IGdldFN5c3RlbVBhdGgocmVzb2x2ZShyb290LCBub3JtYWxpemUob3B0aW9ucy50c0NvbmZpZykpKTtcbiAgICAgICAgbmdQa2dQcm9qZWN0LndpdGhUc0NvbmZpZyh0c0NvbmZpZ1BhdGgpO1xuICAgICAgfVxuXG4gICAgICBuZ1BrZ1Byb2plY3QuYnVpbGQoKVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgb2JzLm5leHQoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IG9icy5lcnJvcihlKSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBOZ1BhY2thZ3JCdWlsZGVyO1xuIl19