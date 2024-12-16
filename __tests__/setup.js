global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element, options) {
    this.element = element;
    this.options = options;
    global.currentObserver = this;
  }

  disconnect() {
    global.currentObserver = null;
  }

  // Method to simulate mutations
  triggerMutation(addedNodes = []) {
    this.callback([{
      addedNodes,
      type: 'childList'
    }]);
  }
};
