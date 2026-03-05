export {};

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
      openFile: () => Promise<string | null>;
      openFolder: () => Promise<string | null>;

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
      writeJson: (filePath: string, data: any) => Promise<void>;
      exists: (path: string) => Promise<boolean>;
      listFiles: (dirPath: string) => Promise<string[]>;
      mkdir: (dirPath: string) => Promise<void>;
      deleteFile: (filePath: string) => Promise<void>;
    };
  }
}