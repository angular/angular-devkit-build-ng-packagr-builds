/**
 * ng-packagr target options for Build Architect.
 */
export interface Schema {
    /**
     * The file path for the ng-packagr configuration file, relative to the current workspace.
     */
    project: string;
    /**
     * The file path of the TypeScript configuration file.
     */
    tsConfig?: string;
    /**
     * Run build when files change.
     */
    watch?: boolean;
}
