const {
  app,
  BrowserWindow,
  dialog,
  Menu,
  nativeImage,
  Tray
} = require("electron");
import path from 'path'
import { deleteReminder, initEvents, sendNotification } from "./events"
import Store from "./store/reminderStore"
import isDev from "./utilities/is-dev"

const { isAfter, isSameDay, isBefore } = require("date-fns");

const store = Store.getStore()

const reminders = store.get("reminders");

const REMINDER_CHECK = 1000 * 60

let tray = null

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

function createTray () {
  const icon = path.join(__dirname, '/app.png') // required.
  const trayicon = nativeImage.createFromPath(icon)
  tray = new Tray(trayicon.resize({ width: 16 }))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        createWindow()
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit() // actually quit the app.
      }
    },
  ])

  tray.setContextMenu(contextMenu)
}

const jobNotification = () => {
  let reminders = store.get("reminders");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentWeekDay = currentDate.getDay();
  const currentDay = currentDate.getDate();

  const remindersRecurrent = reminders.filter(
    (r) =>
      !r.isOneShot &&
      r.days.includes(currentWeekDay) &&
      (!r.lastSent || !isSameDay(currentDate, new Date(r.lastSent)))
  );

  const remindersOneShot = reminders.filter(
    (r) =>
      r.isOneShot && isBefore(r.dateOneShot, currentDate) 
  );

  for (const r of remindersRecurrent) {
    const dateToCheck = new Date(
      currentYear,
      currentMonth,
      currentDay,
      r.hour,
      r.minute
    );
    const notify = isAfter(currentDate, dateToCheck);

    if (notify) {
      notifyUser(r, currentDate, dateToCheck)
    }
  }

  for (const r of remindersOneShot) {
    const dateToCheck = new Date(
      currentYear,
      currentMonth,
      currentDay,
      r.hour,
      r.minute
    );
    
    if (!isSameDay(currentDate, new Date(r.dateOneShot))) {
      deleteReminder(r.id, false)
    } else {
      notifyUser(r, currentDate, dateToCheck)
      deleteReminder(r.id, false)
    }
  }
};

const notifyUser = (r, currentDate, dateToCheck) => {
  const notify = isAfter(currentDate, dateToCheck);

  if (notify) {
    sendNotification(r);
    // openDialog({ title: r.title, body: r.body });
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

const createWindow = () => {
  if (!tray) { // if tray hasn't been created already.
    createTray()
    initEvents(store)

    setInterval(() => {
      jobNotification();
    }, REMINDER_CHECK);
  }

  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      devTools: isDev
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  window.webContents.openDevTools();

  const openDialog = ({ title, body }) => {
    window.setAlwaysOnTop(true);
    dialog.showMessageBox(window, {
      title: title,
      message: body,
      type: "info",
    });
    window.setAlwaysOnTop(false);
  };
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
  if (process.platform === "darwin") {
    app.dock.hide()
  }
  // if (process.platform !== "darwin") {
  //   app.quit();
  // }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
