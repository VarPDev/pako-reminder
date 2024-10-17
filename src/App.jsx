import React from "react";
import Reminders from "./components/reminders.jsx";

// const { ipcRenderer } = window.require('electron');

export default function App() {
  const sendNotification = () => {
    window.sendNotification({title: "test", body: "cazzimma"})
    // ipcRenderer.sendNotification()
    // ipcRenderer.send(channels.NOTIFICATION, { title: 'test', body: "body cazzima" });
  };

  return (
    <div>
      <div id="output" className="font-bold">Testing</div>
      <button onClick={sendNotification}>notifica</button>
      <Reminders />
    </div>
  );
}