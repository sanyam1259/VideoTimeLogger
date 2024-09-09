document.addEventListener('DOMContentLoaded', () => {

    const bookmarksList = document.getElementById('bookmarks');
  
    const renderBookmarks = () => {
      chrome.storage.local.get(['bookmarks'], (result) => {
        const bookmarks = result.bookmarks || [];
        bookmarksList.innerHTML = '';
        bookmarks.forEach((bookmark, index) => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = `Timestamp: ${bookmark.time.toFixed(2)}s`;
          link.onclick = () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (time) => {
                  const video = document.querySelector('video');
                  if (video) video.currentTime = time;
                },
                args: [bookmark.time]
              });
            });
          };
  
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.style.marginLeft = '10px';
          removeButton.onclick = () => {
            chrome.runtime.sendMessage({ action: 'removeBookmark', index: index });
          };
  
          listItem.appendChild(link);
          listItem.appendChild(removeButton);
          bookmarksList.appendChild(listItem);
        });
      });
    };
  
    renderBookmarks();
  
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'updateBookmarks') {
        renderBookmarks();
      }
    });
  }
);
  