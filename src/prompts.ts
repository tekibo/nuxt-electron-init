import prompts from "prompts";
import { SetupOptions } from "./types.js";

export async function askQuestions(): Promise<SetupOptions | null> {
    const response = await prompts([
        {
            type: "select",
            name: "pm",
            message: "Select a package manager",
            choices: [
                { title: "pnpm", value: "pnpm" },
                { title: "npm", value: "npm" },
                { title: "yarn", value: "yarn" },
                { title: "bun", value: "bun" },
            ],
        },
        {
            type: 'text',
            name: 'appName',
            message: 'Enter your App Name for the splash screen:',
            initial: 'My App'
        },
        {
            type: 'text',
            name: 'appDescription',
            message: 'Enter a short description or loading text:',
            initial: 'Initializing Environment...'
        },
        {
            type: 'select',
            name: 'templateType',
            message: 'Select a Splash Screen Template:',
            choices: [
                { title: 'Modern Gradient (Dark)', value: 'gradient' },
                { title: 'Minimalist Solid (Light)', value: 'solid' },
                { title: 'Glassmorphism (Dark)', value: 'glass' }
            ]
        },
        {
            type: 'select',
            name: 'colorPreset',
            message: 'Select a primary color scheme:',
            choices: [
                { title: 'Blue / Sky', value: '#38bdf8' },
                { title: 'Purple / Indigo', value: '#818cf8' },
                { title: 'Emerald / Green', value: '#34d399' },
                { title: 'Rose / Red', value: '#fb7185' },
                { title: 'Custom Hex Color', value: 'custom' },
            ]
        },
        {
            type: (prev) => prev === 'custom' ? 'text' : null,
            name: 'customColor',
            message: 'Enter custom hex color (e.g., #ff0000):',
            initial: '#ff0000',
            validate: (value) => /^#[0-9A-Fa-f]{6}$/.test(value) ? true : 'Please enter a valid hex color code (e.g., #ff0000)'
        }
    ]);

    if (!response.pm) {
        return null;
    }

    return response as SetupOptions;
}
