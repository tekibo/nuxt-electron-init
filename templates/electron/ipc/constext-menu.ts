import type { MenuItemConstructorOptions } from "electron";
import { BrowserWindow, ipcMain, Menu } from "electron";

export function registerContextMenuIPC() {
  ipcMain.on("context-menu", (event, customItems: MenuItemConstructorOptions[] = []) => {
    const defaultTemplate: MenuItemConstructorOptions[] = [
      { role: "copy" },
      { role: "cut" },
      { role: "paste" },
      { role: "selectall" },
    ];

    const template: MenuItemConstructorOptions[] = customItems.length > 0
      ? customItems.map((item) => {
          if (item.id) {
            return {
              ...item,
              click: (menuItem, browserWindow) => {
                const targetWindow = browserWindow || BrowserWindow.fromWebContents(event.sender);
                if (targetWindow) {
                  targetWindow.webContents.send("context-menu-click", item.id);
                }
                else {
                  event.sender.send("context-menu-click", item.id);
                }
              },
            };
          }
          return item;
        })
      : defaultTemplate;

    const menu = Menu.buildFromTemplate(template);

    menu.popup({
      window: BrowserWindow.fromWebContents(event.sender) ?? undefined,
    });
  });
}
