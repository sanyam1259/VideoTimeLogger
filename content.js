const addBookmarkButton = () => {
    const controls = document.querySelector('.ytp-right-controls');
    
    if (!controls) {
      setTimeout(addBookmarkButton, 1000); // Try again in 1 second if controls are not found
      return;
    }
  
    const existingButton = document.querySelector('.bookmark-button');
    if (existingButton) {
      return; // Button already exists
    }
  
    const button = document.createElement('button');
    button.className = 'ytp-button bookmark-button'; // Add a class for styling
  
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('images/icon16.jpg'); // Get the image URL
    img.alt = 'Bookmark';
    img.style.width = '26px'; // Set the width of the image
    img.style.height = '26px'; // Set the height of the image
  
    button.appendChild(img);
  
    button.onclick = () => {
      const video = document.querySelector('video');
    const currentTime = video.currentTime;
    chrome.runtime.sendMessage(chrome.runtime.id, { action: 'addBookmark', time: currentTime },     (response) => {
      if (response && response.success) {
        showNotification('Bookmark added!');
      } else {
        showNotification('Failed to add bookmark.');
      }
    });
    };
  
    controls.insertBefore(button, controls.firstChild); // Insert button as the first child to the right controls
  };
  


  
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'ytp-notification';
    notification.innerText = message;
  
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 600); // Match the transition duration
    }, 2000); // Display for 2 seconds
  };
  
  const observeUrlChange = () => {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        addBookmarkButton(); // Re-inject button on URL change
      }
    }).observe(document, { subtree: true, childList: true });
  };
  
  addBookmarkButton();
  observeUrlChange();
  