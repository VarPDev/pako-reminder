import { ipcMain, net, Notification } from "electron"
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
    const text = `*${title}*\n\n${body}`
    const request = net.request(
      `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChannel}&text=${text}&parse_mode=markdown`
    )
    request.end()
  } else {
    console.log("�� No internet connection, notifications won't be sent.");
  }
}

const sendDesktopNotification = ({ title, body }) => {
  new Notification({
    title,
    body,
  }).show();
};

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
}