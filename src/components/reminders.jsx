import React, { useEffect, useState } from "react";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setReminders(await window.getReminders());
  };

  const onDelReminder = (id) => () => {
    console.log("🚀 ~ onDelReminder ~ id:", id);
    // window.delReminder(id);
    // setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="p-2">
      <h1 className="font-bold mb-4">Reminders:</h1>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Hour</th>
              <th>Minute</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder, index) => (
              <tr key={index}>
                <th>{reminder.title}</th>
                <td>{reminder.body}</td>
                <td>{reminder.hour}</td>
                <td>{reminder.minute}</td>
                <td>
                  <button
                    onClick={() => onDelReminder(reminder.id)}
                    type="button"
                    className="btn btn-xs btn-square btn-outline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
