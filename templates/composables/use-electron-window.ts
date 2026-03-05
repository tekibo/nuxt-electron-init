export function useElectronWindow() {
  const electron = typeof window !== "undefined" ? window.electronAPI : undefined;
  const isMaximized = ref(false);

  const minimize = () => electron?.minimizeWindow();
  const toggleMaximize = () => electron?.toggleMaximize();
  const close = () => electron?.closeWindow();

  onMounted(async () => {
    if (electron && electron.isMaximized) {
      isMaximized.value = await electron.isMaximized();

      electron.onMaximizeChange((state: boolean) => {
        isMaximized.value = state;
      });
    }
  });

  return {
    isMaximized,
    minimize,
    toggleMaximize,
    close,
    isAvailable: !!electron,
  };
}
