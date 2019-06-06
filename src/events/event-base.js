import Vue from 'vue';

const eventBus = new Vue();

export default (eventName) => {
  const off = () => {
    eventBus.$off(eventName);
  };

  const emit = (...args) => {
    eventBus.$emit(eventName, ...args);
  };

  const on = (cb) => {
    eventBus.$on(eventName, cb);
  };

  return {
    on,
    off,
    emit,
  };
};
