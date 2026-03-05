export function useElectronDialog() {
  const electron = typeof window !== 'undefined' ? window.electronAPI : undefined;

  const openFile = async () => {
    if (!electron) return null;
    return await electron.openFile();
  };

  const openFolder = async () => {
    if (!electron) return null;
    return await electron.openFolder();
  };

  return {
    openFile,
    openFolder,
    isAvailable: !!electron
  };
}
