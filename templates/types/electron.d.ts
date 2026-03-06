export { };

declare global {
  interface Window {
    electronAPI: {
      // Window controls
      minimizeWindow: () => void;
      toggleMaximize: () => void;
      closeWindow: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximizeChange: (cb: (state: boolean) => void) => void;

      // Dialogs
      openFile: (options?: Electron.OpenDialogOptions) => Promise<string | null>;
      openFolder: (options?: Electron.OpenDialogOptions) => Promise<string | null>;
      showSaveDialog: (options?: Electron.SaveDialogOptions) => Promise<string | null>;
      showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>;
      showErrorBox: (title: string, content: string) => Promise<void>;

      // App info
      getVersion: () => Promise<string>;
      getName: () => Promise<string>;
      getPaths: () => Promise<{
        userData: string;
        temp: string;
        home: string;
        desktop: string;
        documents: string;
        downloads: string;
        app: string;
        logs: string;
        storage: string;
      }>;
      getPath: (pathName: string) => Promise<string>;

      // Filesystem
      readFile: (filePath: string) => Promise<string>;
      writeFile: (filePath: string, content: string) => Promise<void>;
      readJson: <T>(filePath: string) => Promise<T>;
      writeJson: (filePath: string, data: unknown) => Promise<void>;
      exists: (path: string) => Promise<boolean>;
      listFiles: (dirPath: string) => Promise<string[]>;
      mkdir: (dirPath: string) => Promise<void>;
      deleteFile: (filePath: string) => Promise<void>;

      // Shell
      openExternal: (url: string) => Promise<void>;
      showItemInFolder: (path: string) => Promise<void>;
      openPath: (path: string) => Promise<string>;
      trashItem: (path: string) => Promise<void>;
      beep: () => Promise<void>;

      // Clipboard
      writeClipboardText: (text: string) => Promise<void>;
      readClipboardText: () => Promise<string>;
      writeClipboardHTML: (html: string) => Promise<void>;
      readClipboardHTML: () => Promise<string>;
      clearClipboard: () => Promise<void>;

      // Power
      isOnBattery: () => Promise<boolean>;
      onPowerEvent: (event: 'suspend' | 'resume' | 'on-ac' | 'on-battery', callback: () => void) => void;

      // Screen
      getCursorScreenPoint: () => Promise<{ x: number; y: number }>;
      getPrimaryDisplay: () => Promise<Electron.Display>;
      getAllDisplays: () => Promise<Electron.Display[]>;

      // Notifications
      showNotification: (options: Electron.NotificationConstructorOptions) => Promise<'click' | 'close'>;
    };
  }

  // Define minimal Electron namespaces if not already globally available
  namespace Electron {
    interface OpenDialogOptions {
      title?: string;
      defaultPath?: string;
      buttonLabel?: string;
      filters?: FileFilter[];
      properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
      message?: string;
    }

    interface SaveDialogOptions {
      title?: string;
      defaultPath?: string;
      buttonLabel?: string;
      filters?: FileFilter[];
      message?: string;
      nameFieldLabel?: string;
      showsTagField?: boolean;
    }

    interface FileFilter {
      name: string;
      extensions: string[];
    }

    interface MessageBoxOptions {
      type?: 'none' | 'info' | 'error' | 'question' | 'warning';
      buttons?: string[];
      defaultId?: number;
      title?: string;
      message: string;
      detail?: string;
      checkboxLabel?: string;
      cancelId?: number;
      noLink?: boolean;
    }

    interface MessageBoxReturnValue {
      response: number;
      checkboxChecked: boolean;
    }

    interface Display {
      id: number;
      bounds: Rectangle;
      workArea: Rectangle;
      size: Size;
      workAreaSize: Size;
      scaleFactor: number;
    }

    interface Rectangle {
      x: number;
      y: number;
      width: number;
      height: number;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface NotificationConstructorOptions {
      title: string;
      subtitle?: string;
      body?: string;
      silent?: boolean;
      icon?: string;
      hasReply?: boolean;
      replyPlaceholder?: string;
      sound?: string;
      urgency?: 'normal' | 'critical' | 'low';
    }
  }
}
