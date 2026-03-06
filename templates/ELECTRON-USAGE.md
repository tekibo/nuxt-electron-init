# Using Electron Features in Nuxt

This template provides a robust IPC bridge to native Electron APIs. You can access these features via a single, well-typed composable: `useElectron()`.

## The `useElectron()` Composable

Everything you need from Electron is organized into namespaced objects within this hook.

### 1. Filesystem (`fs`)
Safe access to Node.js filesystem operations via IPC.

```typescript
const { fs } = useElectron();

// Example: Read a file
const content = await fs.readFile('/path/to/file.txt');

// Example: Write a JSON file
await fs.writeJson('/path/to/data.json', { name: 'Nuxt Electron' });
```

### 2. Native APIs (`shell`, `clipboard`, `screen`, `power`)

```typescript
const { shell, clipboard, screen, power } = useElectron();

// Shell: Open links or reveal files
shell.openExternal('https://google.com');
shell.showItemInFolder('/path/to/file');

// Clipboard: Copy/Paste
clipboard.writeText('Hello from Nuxt!');

// Screen: Get display info
const primary = await screen.getPrimaryDisplay();
console.log('Scale factor:', primary.scaleFactor);

// Power: Listen for system events
power.onSuspend(() => {
  console.log('System is going to sleep');
});
```

### 3. Dialogs (`dialog`)
Native system dialogs for opening, saving, and messaging.

```typescript
const { dialog } = useElectron();

// Open a file pickers
const path = await dialog.openFile({ 
  filters: [{ name: 'Images', extensions: ['jpg', 'png'] }] 
});

// Show a native message box
await dialog.showMessageBox({
  type: 'info',
  message: 'Download complete!',
  buttons: ['OK']
});
```

### 4. Window Management (`window`)
Control the current browser window.

```typescript
const { window } = useElectron();

// Minimize, Maximize, Close
window.minimize();
window.toggleMaximize();
window.close();

// Reactive state
console.log('Is Maximized:', window.isMaximized.value);
```

### 5. Notifications
Native desktop alerts.

```typescript
const { showNotification } = useElectron();

const result = await showNotification('Title', 'Message body');
if (result === 'click') {
  console.log('User clicked notification');
}
```

## TypeScript Support

The `useElectron` hook is fully typed. You get auto-completion for all Electron-specific options like `OpenDialogOptions`, `MessageBoxOptions`, and `NotificationConstructorOptions`. 

These types are defined in `app/types/electron.d.ts` and are automatically recognized by VS Code.

## Security Note

This template uses **Context Isolation**. You cannot access `require('electron')` or `fs` directly in the renderer. Always use the provided composables or add your own IPC handlers in `electron/ipc/` and expose them in `electron/preload.ts`.
