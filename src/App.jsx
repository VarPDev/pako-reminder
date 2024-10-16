import React from "react";

// const { ipcRenderer } = window.require('electron');

export default function App() {
  const sendNotification = () => {
    window.sendNotification({title: "test", body: "cazzimma"})
    // ipcRenderer.sendNotification()
    // ipcRenderer.send(channels.NOTIFICATION, { title: 'test', body: "body cazzima" });
  };

  return (
    <div className="min-h-screen max-h-full bg-zinc-950">
      <div id="output" className="font-bold text-white">Testing</div>
      <button onClick={sendNotification}>notifica</button>
    </div>
  );
}