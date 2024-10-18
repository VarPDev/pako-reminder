import React, { useState } from "react";

export default function Reminders() {
  window.getReminders().then((reminders) => {
    console.log("🚀 ~ window.getReminders ~ reminders:", reminders);
    // setReminders(reminders);
  });

  const [reminders, setReminders] = useState([]);

  return (
    <div>
      Reminders:
      {reminders.map((reminder, index) => (
        <div key={index}>{reminder.title}</div>
      ))}
    </div>
  );
}
