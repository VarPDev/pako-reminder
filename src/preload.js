// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");
const { channels } = require("./shared/constants");

contextBridge.exposeInMainWorld("electronAPI", {
  sendNotification: (params) =>
    ipcRenderer.send(channels.SEND_NOTIFICATION, params),
  saveReminder: (params) => {
    return ipcRenderer.send(channels.SAVE_REMINDER, params);
  },
  getReminders: (params) => {
    return ipcRenderer.invoke(channels.GET_REMINDERS, params);
  },
  getDelReminders: (params) => {
    return ipcRenderer.invoke(channels.GET_DEL_REMINDERS, params);
  },
  delReminder: (id) => {
    return ipcRenderer.send(channels.DEL_REMINDER, id);
  },
});
