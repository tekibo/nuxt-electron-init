export function useElectronApp() {
  const electron = typeof window !== 'undefined' ? window.electronAPI : undefined;

  const getVersion = async () => {
    if (!electron) return '0.0.0';
    return await electron.getVersion();
  };

  const getName = async () => {
    if (!electron) return 'my-scrape';
    return await electron.getName();
  };

  const getPaths = async () => {
    if (!electron) return null;
    return await electron.getPaths();
  };

  const getPath = async (pathName: string) => {
    if (!electron) return '';
    return await electron.getPath(pathName);
  };

  return {
    getVersion,
    getName,
    getPaths,
    getPath,
    isAvailable: !!electron
  };
}
