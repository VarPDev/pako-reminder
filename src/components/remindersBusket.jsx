import React, { useEffect, useState } from "react";

export default function RemindersBusket() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setReminders(await window.getDelReminders());
  };

  return (
    <div className="p-2">
      <h1 className="font-bold mb-4">DEL Reminders:</h1>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Hour</th>
              <th>Minute</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder, index) => (
              <tr key={index}>
                <th>{reminder.title}</th>
                <td>{reminder.body}</td>
                <td>{reminder.hour}</td>
                <td>{reminder.minute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
