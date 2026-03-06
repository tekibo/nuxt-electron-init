import { ref, onMounted } from 'vue';

/**
 * Unified Electron composable for Nuxt
 * Provides access to all native Electron features via a single hook.
 */
export function useElectron() {
    const electron = typeof window !== 'undefined' ? window.electronAPI : undefined;
    const isAvailable = !!electron;

    // Internal helper to ensure electron is available before calling
    const ensure = <T>(fn: () => T): T => {
        if (!electron) throw new Error('Electron API not available');
        return fn();
    };

    // --- App Info ---
    const app = {
        getVersion: () => ensure(() => electron!.getVersion()),
        getName: () => ensure(() => electron!.getName()),
        getPaths: () => ensure(() => electron!.getPaths()),
        getPath: (pathName: string) => ensure(() => electron!.getPath(pathName)),
    };

    // --- Window Management ---
    const isMaximized = ref(false);
    const win = {
        isMaximized,
        minimize: () => ensure(() => electron!.minimizeWindow()),
        toggleMaximize: () => ensure(() => electron!.toggleMaximize()),
        close: () => ensure(() => electron!.closeWindow()),
    };

    // --- Dialogs ---
    const dialog = {
        openFile: (options?: Electron.OpenDialogOptions) =>
            ensure(() => electron!.openFile(options)),
        openFolder: (options?: Electron.OpenDialogOptions) =>
            ensure(() => electron!.openFolder(options)),
        showSaveDialog: (options?: Electron.SaveDialogOptions) =>
            ensure(() => electron!.showSaveDialog(options)),
        showMessageBox: (options: Electron.MessageBoxOptions) =>
            ensure(() => electron!.showMessageBox(options)),
        showErrorBox: (title: string, content: string) =>
            ensure(() => electron!.showErrorBox(title, content)),
    };

    // --- Filesystem (IPC Bridge) ---
    const fs = {
        readFile: (filePath: string) => ensure(() => electron!.readFile(filePath)),
        writeFile: (filePath: string, content: string) =>
            ensure(() => electron!.writeFile(filePath, content)),
        readJson: <T>(filePath: string) =>
            ensure(() => electron!.readJson<T>(filePath)),
        writeJson: (filePath: string, data: unknown) =>
            ensure(() => electron!.writeJson(filePath, data)),
        exists: (path: string) => ensure(() => electron!.exists(path)),
        listFiles: (dirPath: string) => ensure(() => electron!.listFiles(dirPath)),
        mkdir: (dirPath: string) => ensure(() => electron!.mkdir(dirPath)),
        deleteFile: (filePath: string) => ensure(() => electron!.deleteFile(filePath)),
    };

    // --- Shell ---
    const shell = {
        openExternal: (url: string) => ensure(() => electron!.openExternal(url)),
        showItemInFolder: (path: string) => ensure(() => electron!.showItemInFolder(path)),
        openPath: (path: string) => ensure(() => electron!.openPath(path)),
        trashItem: (path: string) => ensure(() => electron!.trashItem(path)),
        beep: () => ensure(() => electron!.beep()),
    };

    // --- Clipboard ---
    const clipboard = {
        writeText: (text: string) => ensure(() => electron!.writeClipboardText(text)),
        readText: () => ensure(() => electron!.readClipboardText()),
        writeHTML: (html: string) => ensure(() => electron!.writeClipboardHTML(html)),
        readHTML: () => ensure(() => electron!.readClipboardHTML()),
        clear: () => ensure(() => electron!.clearClipboard()),
    };

    // --- Power Monitor ---
    const power = {
        isOnBattery: () => ensure(() => electron!.isOnBattery()),
        onSuspend: (cb: () => void) => ensure(() => electron!.onPowerEvent('suspend', cb)),
        onResume: (cb: () => void) => ensure(() => electron!.onPowerEvent('resume', cb)),
        onAC: (cb: () => void) => ensure(() => electron!.onPowerEvent('on-ac', cb)),
        onBattery: (cb: () => void) => ensure(() => electron!.onPowerEvent('on-battery', cb)),
    };

    // --- Screen ---
    const screen = {
        getCursorScreenPoint: () => ensure(() => electron!.getCursorScreenPoint()),
        getPrimaryDisplay: () => ensure(() => electron!.getPrimaryDisplay()),
        getAllDisplays: () => ensure(() => electron!.getAllDisplays()),
    };

    // --- Notifications ---
    const showNotification = (title: string, body?: string, options: Partial<Electron.NotificationConstructorOptions> = {}) => {
        return ensure(() => electron!.showNotification({ title, body, ...options }));
    };

    // Setup event listeners
    onMounted(async () => {
        if (electron) {
            // Window maximization state
            isMaximized.value = await electron.isMaximized();
            electron.onMaximizeChange((state: boolean) => {
                isMaximized.value = state;
            });
        }
    });

    return {
        isAvailable,
        app,
        window: win,
        dialog,
        fs,
        shell,
        clipboard,
        power,
        screen,
        showNotification
    };
}
