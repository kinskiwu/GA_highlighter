let observer = null;

const highlightGrokPosts = () => {
  const grokButtons = document.querySelectorAll('[aria-label="Grok actions"]');

  for (const button of grokButtons) {
    const post = button.closest('[data-testid="cellInnerDiv"]');

    if (
      post &&
      !post.dataset.grokProcessed &&
      !post.querySelector('[aria-label="Play"]')
    ) {
      post.dataset.grokProcessed = 'true';
      post.style.border = '3px solid #FFD700';
    }
  }
};

const startObserver = () => {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        highlightGrokPosts();
        return;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Process existing posts
  highlightGrokPosts();
};

const clearHighlights = () => {
  // Remove highlights and processing marks
  document
    .querySelectorAll('[data-testid="cellInnerDiv"]')
    .forEach((post) => {
      post.style.border = '';
      delete post.dataset.grokProcessed; // Clear processed state
    });
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleHighlight') {
    if (message.isEnabled) {
      clearHighlights();
      startObserver();
    } else {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      clearHighlights();
    }
  }
});

// Check initial state
chrome.storage.local.get('isEnabled', ({ isEnabled = false }) => {
  if (isEnabled) {
    startObserver();
  }
});

module.exports = {
  highlightGrokPosts,
  startObserver,
  clearHighlights
};
