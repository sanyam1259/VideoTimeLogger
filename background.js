chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'addBookmark') {
      chrome.storage.local.get(['bookmarks'], (result) => {
        const bookmarks = result.bookmarks || [];
        bookmarks.push({ time: message.time });
        chrome.storage.local.set({ bookmarks: bookmarks }, () => {
          chrome.runtime.sendMessage({ action: 'updateBookmarks' });
        });
      });
    }
  
    if (message.action === 'removeBookmark') {
      chrome.storage.local.get(['bookmarks'], (result) => {
        const bookmarks = result.bookmarks || [];
        bookmarks.splice(message.index, 1);
        chrome.storage.local.set({ bookmarks: bookmarks }, () => {
          chrome.runtime.sendMessage({ action: 'updateBookmarks' });
        });
      });
    }
  });
  