import React, { useState } from "react";
import CreateReminders from "./components/createReminders.jsx";
import Reminders from "./components/reminders.jsx";
import RemindersBusket from "./components/remindersBusket.jsx";

// const { ipcRenderer } = window.require('electron');

export default function App() {
  const [tabSelected, setTabSelected] = useState(0);

  const onSelectTab = (index) => {
    setTabSelected(index);
  };
  const sendNotification = () => {
    window.sendNotification({ title: "test", body: "cazzimma" });
    // ipcRenderer.sendNotification()
    // ipcRenderer.send(channels.NOTIFICATION, { title: 'test', body: "body cazzima" });
  };

  return (
    <div>
      {/* <div id="output" className="font-bold">
        Testing
      </div> */}
      {/* <button className="btn" onClick={sendNotification}>
        notifica
      </button> */}
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab ${tabSelected === 0 ? "tab-active" : ""}`}
          onClick={() => onSelectTab(0)}
        >
          All
        </a>
        <a
          role="tab"
          className={`tab ${tabSelected === 1 ? "tab-active" : ""}`}
          onClick={() => onSelectTab(1)}
        >
          Add
        </a>
        <a
          role="tab"
          className={`tab ${tabSelected === 2 ? "tab-active" : ""}`}
          onClick={() => onSelectTab(2)}
        >
          Busket
        </a>
      </div>
      {tabSelected === 0 && <Reminders />}
      {tabSelected === 1 && <CreateReminders />}
      {tabSelected === 2 && <RemindersBusket />}
    </div>
  );
}
