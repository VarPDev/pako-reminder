import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function CreateReminders() {
  const defaultFormDate = () => {
    return {
      title: "",
      body: "",
      minute: "",
      hour: "",
      days: [],
      enableTelegram: false,
      telegramToken: "",
      telegramChannel: "",
      id: uuidv4(),
    };
  };

  const [formData, setFormData] = useState(defaultFormDate());

  const days = [
    "Sunday",
    "Monday",
    "Thuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCheckbox = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const array = prevFormData[name].includes(index)
        ? prevFormData[name].filter((i) => i !== index)
        : [...prevFormData[name], index];
      return { ...prevFormData, [name]: array };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.saveReminder(formData);
    setFormData(defaultFormDate());
    // alert(
    //   `${formData.title}, Body: ${formData.body}, ${JSON.stringify(
    //     formData.days
    //   )}`
    // );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <label htmlFor="title">Title:</label>
        <input
          value={formData.name}
          onChange={handleChange}
          required
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          name="body"
          required
          value={formData.message}
          onChange={handleChange}
          className="textarea textarea-bordered"
          placeholder="Body"
        ></textarea>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="hour">Hour:</label>
          <input
            value={formData.hour}
            onChange={handleChange}
            required
            type="number"
            id="hour"
            name="hour"
            placeholder="Hour"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="minute">Minute:</label>
          <input
            value={formData.minute}
            onChange={handleChange}
            required
            type="number"
            id="minute"
            name="minute"
            placeholder="Minute"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>

      <div className="font-bold">Repeat on:</div>

      {days.map((d, i) => (
        <div className="w-[33%]" key={i}>
          <label className="label cursor-pointer gap-2 p-0">
            <span className="label-text">{d}</span>
            <input
              name="days"
              onChange={(e) => handleCheckbox(e, i)}
              type="checkbox"
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
      ))}

      <button className="btn" type="submit">
        Create reminder
      </button>
    </form>
  );
}
