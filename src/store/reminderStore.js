import Store from "electron-store";
import isDev from "../utilities/is-dev";

let instance;
// const store = new Store({name: `${isDev ? 'development' : 'production'}-reminders`});

class ReminderStore {
  store = new Store({name: `${isDev ? 'development' : 'production'}-reminders`});

  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  getStore() {
    return this.store;
  }
}

const singletonStore = Object.freeze(new ReminderStore());
export default singletonStore;
