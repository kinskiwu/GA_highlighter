describe("Grok Highlighter Extension", () => {
  let container;
  let contentScript;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement("div");
    document.body.appendChild(container);

    // Mock Chrome APIs
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: jest.fn((callback) => {
            global.chrome.runtime.messageCallback = callback;
          }),
        },
      },
      storage: {
        local: {
          get: jest.fn((_key, callback) => callback({ isEnabled: true })),
          set: jest.fn(),
        },
      },
    };

    // Clear modules and reimport content script
    jest.isolateModules(() => {
      contentScript = require("../content/content");
    });
  });

  // Cleanup after each test
  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
    container = null;
  });

  // Helper function to create mock posts
  const createMockPost = ({ hasGrokButton = true, hasPlayButton = false }) => {
    const post = document.createElement("div");
    post.setAttribute("data-testid", "cellInnerDiv");

    if (hasGrokButton) {
      const button = document.createElement("button");
      button.setAttribute("aria-label", "Grok actions");
      post.appendChild(button);
    }

    if (hasPlayButton) {
      const playButton = document.createElement("button");
      playButton.setAttribute("aria-label", "Play");
      post.appendChild(playButton);
    }

    return post;
  };

  // Core Highlighting Tests
  describe("Core Highlighting Functionality", () => {
  //   test("should highlight posts with Grok buttons", () => {
  //     const post = createMockPost({ hasGrokButton: true });
  //     container.appendChild(post);

  //     global.chrome.runtime.messageCallback({
  //       action: "toggleHighlight",
  //       isEnabled: true,
  //     });

  //     expect(post.style.border).toBe("3px solid #FFD700");
  //     expect(post.dataset.grokProcessed).toBe("true");
  //   });

    // test("should highlight posts with Grok buttons", async () => {
    //   const post = createMockPost({ hasGrokButton: true });
    //   container.appendChild(post);

    //   // Trigger highlighting
    //   global.chrome.runtime.messageCallback({
    //     action: "toggleHighlight",
    //     isEnabled: true,
    //   });

    //   // Manually trigger the observer
    //   global.currentObserver.triggerMutation([post]);

    //   // Wait for DOM updates
    //   await new Promise((resolve) => setTimeout(resolve, 0));

    //   expect(post.style.border).toBe("3px solid #FFD700");
    //   expect(post.dataset.grokProcessed).toBe("true");
    // });

    test("should not highlight posts with Play buttons", () => {
      const post = createMockPost({ hasGrokButton: true, hasPlayButton: true });
      container.appendChild(post);

      global.chrome.runtime.messageCallback({
        action: "toggleHighlight",
        isEnabled: true,
      });

      expect(post.style.border).toBe("");
      expect(post.dataset.grokProcessed).toBeUndefined();
    });

    test("should not highlight already processed posts", () => {
      const post = createMockPost({ hasGrokButton: true });
      post.dataset.grokProcessed = "true";
      container.appendChild(post);

      global.chrome.runtime.messageCallback({
        action: "toggleHighlight",
        isEnabled: true,
      });

      expect(post.style.border).toBe("");
    });
  });

  // Observer Tests
  describe("MutationObserver Functionality", () => {
  //   test("should highlight new posts when they appear", (done) => {
  //     global.chrome.runtime.messageCallback({
  //       action: "toggleHighlight",
  //       isEnabled: true,
  //     });

  //     // Simulate new post being added
  //     setTimeout(() => {
  //       const newPost = createMockPost({ hasGrokButton: true });
  //       container.appendChild(newPost);

  //       // Let observer process
  //       setTimeout(() => {
  //         expect(newPost.style.border).toBe("3px solid #FFD700");
  //         expect(newPost.dataset.grokProcessed).toBe("true");
  //         done();
  //       }, 0);
  //     }, 0);
  //   });
  // });

  // Toggle Tests
  describe("Toggle Functionality", () => {
    // test("should enable highlighting when turned on", () => {
    //   const post = createMockPost({ hasGrokButton: true });
    //   container.appendChild(post);

    //   global.chrome.runtime.messageCallback({
    //     action: "toggleHighlight",
    //     isEnabled: true,
    //   });

    //   expect(post.style.border).toBe("3px solid #FFD700");
    // });

    test("should remove highlights when turned off", () => {
      const post = createMockPost({ hasGrokButton: true });
      container.appendChild(post);

      // Enable first
      global.chrome.runtime.messageCallback({
        action: "toggleHighlight",
        isEnabled: true,
      });
      // Then disable
      global.chrome.runtime.messageCallback({
        action: "toggleHighlight",
        isEnabled: false,
      });

      expect(post.style.border).toBe("");
      expect(post.dataset.grokProcessed).toBeUndefined();
    });
  });

  // Storage Tests
  describe("Storage Integration", () => {
    // test("should start observer if enabled in storage", (done) => {
    //   const post = createMockPost({ hasGrokButton: true });
    //   container.appendChild(post);

    //   setTimeout(() => {
    //     expect(post.style.border).toBe("3px solid #FFD700");
    //     done();
    //   }, 0);
    // });

    test("should handle missing storage state", () => {
      // Mock storage to return undefined
      chrome.storage.local.get = jest.fn((_key, callback) => callback({}));

      const post = createMockPost({ hasGrokButton: true });
      container.appendChild(post);

      expect(post.style.border).toBe("");
    });
  });

  // Performance Test
  describe("Performance", () => {
//     test("should handle multiple posts", () => {
//       // Create 100 posts
//       for (let i = 0; i < 100; i++) {
//         const post = createMockPost({ hasGrokButton: true });
//         container.appendChild(post);
//       }

//       global.chrome.runtime.messageCallback({
//         action: "toggleHighlight",
//         isEnabled: true,
//       });

//       const highlightedPosts = container.querySelectorAll(
//         '[data-grok-processed="true"]'
//       );
//       expect(highlightedPosts.length).toBe(100);
    });
  });
});
