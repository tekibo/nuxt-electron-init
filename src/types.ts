export type PackageManager = "pnpm" | "bun" | "yarn" | "npm";

export interface SetupOptions {
    pm: PackageManager;
    appName: string;
    appDescription: string;
    templateType: string;
    colorPreset: string;
    customColor?: string;
}
