document.addEventListener('DOMContentLoaded', async () => {
  const button = document.getElementById('toggleButton');

  // Get current state
  const { isEnabled = false } = await chrome.storage.local.get('isEnabled');
  updateButtonState(isEnabled);

  button.addEventListener('click', async () => {
    const { isEnabled = false } = await chrome.storage.local.get('isEnabled');
    const newState = !isEnabled;

    await chrome.storage.local.set({ isEnabled: newState });
    updateButtonState(newState);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlight', isEnabled: newState });
    }
  });
});

function updateButtonState(isEnabled) {
  const button = document.getElementById('toggleButton');
  button.textContent = isEnabled ? 'Disable Grok Highlighter' : 'Enable Grok Highlighter';
  button.classList.toggle('disabled', !isEnabled);
}
