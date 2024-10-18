const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("node:path");
const { channels } = require("./shared/constants");
import Store from "electron-store";
const { isAfter, isSameDay } = require("date-fns");

const store = new Store();

const reminders = store.get("reminders");

if (!reminders) {
  store.set("reminders", []);
}
const delReminders = store.get("del_reminders");
if (!delReminders) {
  store.set("del_reminders", []);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  ipcMain.on(channels.SEND_NOTIFICATION, (event, { title, body }) => {
    sendNotification({ title, body });

    // new window.Notification(title, {
    //   body,
    // }).onclick = () => {
    //   console.log("NOTIFICATION clicked");
    //   // event.sender.send(channels.SEND_NOTIFICATION, true);
    //   // document.getElementById("output").innerText = CLICK_MESSAGE;
    // };
  });

  ipcMain.on(channels.SAVE_REMINDER, (event, reminder) => {
    const old = store.get("reminders");
    store.set(
      "reminders",
      old && Array.isArray(old) ? [...old, reminder] : [reminder]
    );
  });

  ipcMain.handle(channels.GET_REMINDERS, (event) => {
    const reminders = store.get("reminders");
    return reminders;
  });

  ipcMain.handle(channels.GET_DEL_REMINDERS, (event) => {
    const delReminders = store.get("del_reminders");
    return delReminders;
  });

  ipcMain.on(channels.DEL_REMINDER, (event, id) => {
    const reminders = store.get("reminders");

    const remToDelete = reminders.find((r) => r.id === id);

    store.set(
      "reminders",
      reminders.filter((r) => r.id !== id)
    );

    const old = store.get("del_reminders");
    store.set(
      "del_reminders",
      old && Array.isArray(old) ? [...old, remToDelete] : [remToDelete]
    );
  });

  // and load the index.html of the app.
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  window.webContents.openDevTools();

  const sendNotification = ({ title, body }) => {
    new Notification({
      title,
      body,
    }).show();
  };

  const jobNotification = () => {
    let reminders = store.get("reminders");

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDay();

    reminders = reminders.filter(
      (r) =>
        r.days.includes(currentDay) &&
        (!r.lastSent || !isSameDay(currentDate, new Date(r.lastSent)))
    );

    for (const r of reminders) {
      const rIsAfter = isAfter(
        currentDate,
        new Date(currentYear, currentMonth, currentDay, r.hour, r.minute)
      );

      if (rIsAfter) {
        sendNotification({ title: r.title, body: r.body });
        let allReminders = store.get("reminders");
        allReminders = allReminders.map((rem) =>
          rem.id === r.id
            ? {
                ...rem,
                lastSent: new Date(),
              }
            : rem
        );
        store.set("reminders", allReminders);
      }
    }
  };

  setInterval(() => {
    jobNotification();
  }, 1000);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
