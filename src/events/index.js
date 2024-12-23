import { ipcMain, net, Notification } from "electron"
import { Telegraf } from "telegraf"
import { channels } from "../shared/constants"
import Store from "../store/reminderStore"

const store = Store.getStore()

export const sendNotification = (reminder) => {
  switch(true) {
    case reminder.enableTelegram:
      sendTelegramNotification(reminder)
    default: 
      sendDesktopNotification({ title: reminder.title, body: reminder.body })
  }
};

const sendTelegramNotification = ({telegramToken, telegramChannel, title, body}) => {
  if (net.online) {
    const bot = new Telegraf(telegramToken)
    bot.telegram.sendMessage(telegramChannel, `*${title}*\n\n${body}`, { parse_mode: "MarkdownV2" })
  } else {
    console.log("�� No internet connection, telegram notifications won't be sent.");
  }
}

const sendDesktopNotification = ({ title, body }) => {
  new Notification({
    title,
    body,
  }).show();
};

export const deleteReminder = (id, safeDelete = true) => {
  const reminders = store.get("reminders");

  const remToDelete = reminders.find((r) => r.id === id);

  store.set(
    "reminders",
    reminders.filter((r) => r.id !== id)
  );

  if (safeDelete){
    const old = store.get("del_reminders");
    store.set(
      "del_reminders",
      old && Array.isArray(old) ? [...old, remToDelete] : [remToDelete]
    );
  }
}

export const initEvents = () => {
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
    deleteReminder(id)
  });
}