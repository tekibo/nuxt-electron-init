export function useFilesystem() {
  const electron = typeof window !== 'undefined' ? window.electronAPI : undefined;

  const readFile = async (filePath: string) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.readFile(filePath);
  };

  const writeFile = async (filePath: string, content: string) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.writeFile(filePath, content);
  };

  const readJson = async <T>(filePath: string): Promise<T> => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.readJson<T>(filePath);
  };

  const writeJson = async (filePath: string, data: any) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.writeJson(filePath, data);
  };

  const exists = async (path: string) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.exists(path);
  };

  const listFiles = async (dirPath: string) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.listFiles(dirPath);
  };

  const mkdir = async (dirPath: string) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.mkdir(dirPath);
  };

  const deleteFile = async (filePath: string) => {
    if (!electron) throw new Error('Electron API not available');
    return await electron.deleteFile(filePath);
  };

  return {
    readFile,
    writeFile,
    readJson,
    writeJson,
    exists,
    listFiles,
    mkdir,
    deleteFile,
    isAvailable: !!electron
  };
}
