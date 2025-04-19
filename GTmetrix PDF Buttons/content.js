// Default settings
const defaultSettings = {
    primaryColor: "#35dece",
    secondaryColor: "#832ad0",
    textColor: "#47ffbf",
    buttonMargin: "10px",
    borderRadius: "4px"
  };
  
  let settings = {...defaultSettings};
  let buttonsAdded = false;
  let hasSeenNotification = false;
  
  // Load settings when content script initializes
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      settings = { ...defaultSettings, ...result.settings };
    }
    
    // Only add buttons if they don't exist yet
    if (!buttonsAdded && !document.querySelector('.gtm-pdf-buttons')) {
      addButtonsToPage();
      buttonsAdded = true;
    } else if (buttonsAdded) {
      updateButtonStyles();
    }
  });
  
  // Listen for hotkey commands from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "download-summary") {
      downloadSummaryReport();
    } else if (message.command === "download-full") {
      downloadFullReport();
    } else if (message.command === "download-both") {
      downloadBothReports();
    } else if (message.command === "update-settings") {
      // Update settings when changed in options page
      chrome.storage.sync.get(['settings'], (result) => {
        if (result.settings) {
          settings = { ...defaultSettings, ...result.settings };
          updateButtonStyles();
        }
      });
    }
    return true;
  });
  
  function addButtonsToPage() {
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'gtm-pdf-buttons';
    
    // Apply styles from settings
    updateContainerStyles(buttonContainer);
    
    // Check if we should show the notification
    chrome.storage.local.get(['hasSeenNotification'], function(result) {
      if (!result.hasSeenNotification) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'gtm-notification';
        notification.innerHTML = `
          <div class="notification-content">
            <p>💡 Customize button colors in the <strong>Settings</strong> panel!</p>
            <div class="notification-buttons">
              <button class="settings-notification-button">Settings</button>
              <button class="dismiss-button">Got it!</button>
            </div>
          </div>
        `;
        
        // Add notification to the container
        buttonContainer.appendChild(notification);
        
        // Add event listener to dismiss button
        notification.querySelector('.dismiss-button').addEventListener('click', function() {
          notification.style.opacity = '0';
          setTimeout(() => {
            notification.remove();
          }, 300); // Wait for opacity transition
          
          // Mark as seen
          chrome.storage.local.set({ 'hasSeenNotification': true });
        });
        
        // Add event listener to settings button
notification.querySelector('.settings-notification-button').addEventListener('click', function() {
    // Open settings page
    chrome.runtime.openOptionsPage();
    
    // Mark notification as seen
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
    chrome.storage.local.set({ 'hasSeenNotification': true });
  });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove();
              }
            }, 300); // Wait for opacity transition
          }
        }, 10000);
      }
    });
    
    // Create the Executive Summary button
    const executiveSummaryBtn = document.createElement('button');
    executiveSummaryBtn.textContent = 'Download Summary PDF';
    executiveSummaryBtn.className = 'gtm-pdf-button summary-button';
    executiveSummaryBtn.setAttribute('data-tooltip', 'Keyboard Shortcut: Alt+1');
    executiveSummaryBtn.addEventListener('click', downloadSummaryReport);
    
    // Create the Full Report button
    const fullReportBtn = document.createElement('button');
    fullReportBtn.textContent = 'Download Full PDF';
    fullReportBtn.className = 'gtm-pdf-button full-button';
    fullReportBtn.setAttribute('data-tooltip', 'Keyboard Shortcut: Alt+2');
    fullReportBtn.addEventListener('click', downloadFullReport);
    
    // Create the Both Reports button
    const bothReportsBtn = document.createElement('button');
    bothReportsBtn.textContent = 'Download Both PDFs';
    bothReportsBtn.className = 'gtm-pdf-button both-button';
    bothReportsBtn.setAttribute('data-tooltip', 'Keyboard Shortcut: Alt+3');
    bothReportsBtn.addEventListener('click', downloadBothReports);
    
    // Create the PageSpeed Insights button
    const pageSpeedBtn = document.createElement('button');
    pageSpeedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="white">
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
    </svg>`;
    pageSpeedBtn.className = 'gtm-pdf-button pagespeed-button';
    pageSpeedBtn.setAttribute('data-tooltip', 'View in PageSpeed Insights');
    pageSpeedBtn.addEventListener('click', openPageSpeedInsights);
    
    // Add buttons to container
    buttonContainer.appendChild(executiveSummaryBtn);
    buttonContainer.appendChild(fullReportBtn);
    buttonContainer.appendChild(bothReportsBtn);
    buttonContainer.appendChild(pageSpeedBtn);
    
    // Insert after header
    const targetElement = document.querySelector('.report-header') || document.querySelector('header');
    if (targetElement) {
      targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling);
    } else {
      // Fallback: add to top of body
      document.body.insertBefore(buttonContainer, document.body.firstChild);
    }
    
    // Apply button styles
    updateButtonStyles();
    
    // Add bounce animation
    setTimeout(() => {
      const buttons = document.querySelectorAll('.gtm-pdf-button');
      buttons.forEach((button, index) => {
        setTimeout(() => {
          button.classList.add('bounce-animation');
          // Remove the animation class after it completes to allow it to be triggered again
          setTimeout(() => {
            button.classList.remove('bounce-animation');
          }, 1000);
        }, index * 150); // Stagger the animations
      });
    }, 500); // Short delay before starting animations
  }
  
  function updateContainerStyles(container) {
    if (!container) {
      container = document.querySelector('.gtm-pdf-buttons');
      if (!container) return;
    }
    
    container.style.margin = settings.buttonMargin + ' 0';
  }
  
  function updateButtonStyles() {
    const buttons = document.querySelectorAll('.gtm-pdf-button');
    
    buttons.forEach(button => {
      // Apply gradient background
      button.style.background = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`;
      button.style.color = settings.textColor;
      button.style.borderRadius = settings.borderRadius;
      button.style.margin = settings.buttonMargin;
    });
  }
  
  function downloadSummaryReport() {
    const url = window.location.href;
    let reportUrl = "";
    
    // Remove any existing PDF modifiers
    if (url.includes('/pdf')) {
      reportUrl = url.split('/pdf')[0];
    } else {
      reportUrl = url;
    }
    
    // Remove any trailing slashes
    if (reportUrl.endsWith('/')) {
      reportUrl = reportUrl.slice(0, -1);
    }
    
    const summaryReportUrl = reportUrl + '/pdf';
    
    // Simply open the URL in a new tab
    window.open(summaryReportUrl, '_blank');
  }
  
  function downloadFullReport() {
    const url = window.location.href;
    let reportUrl = "";
    
    // Remove any existing PDF modifiers
    if (url.includes('/pdf')) {
      reportUrl = url.split('/pdf')[0];
    } else {
      reportUrl = url;
    }
    
    // Remove any trailing slashes
    if (reportUrl.endsWith('/')) {
      reportUrl = reportUrl.slice(0, -1);
    }
    
    const fullReportUrl = reportUrl + '/pdf?full=1';
    
    // Simply open the URL in a new tab
    window.open(fullReportUrl, '_blank');
  }
  
  function downloadBothReports() {
    downloadSummaryReport();
    // Add a slight delay to prevent browser throttling
    setTimeout(() => {
      downloadFullReport();
    }, 500);
  }
  
  function openPageSpeedInsights() {
    // Extract the current URL being tested from the GTmetrix report URL
    const gtmetrixUrl = window.location.href;
    const urlPattern = /https:\/\/gtmetrix\.com\/reports\/([^\/]+)/;
    const match = gtmetrixUrl.match(urlPattern);
    
    if (match && match[1]) {
      // Construct the URL for the site being tested
      let testedUrl = match[1];
      
      // Clean up the URL if needed
      if (testedUrl.includes('?')) {
        testedUrl = testedUrl.split('?')[0];
      }
      
      // Add protocol if missing
      if (!testedUrl.startsWith('http')) {
        testedUrl = 'https://' + testedUrl;
      }
      
      // Create the PageSpeed Insights URL
      const pageSpeedUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(testedUrl)}`;
      
      // Open in a new tab
      window.open(pageSpeedUrl, '_blank');
    } else {
      // If URL extraction fails, open PageSpeed Insights with empty URL
      window.open('https://pagespeed.web.dev/', '_blank');
    }
  }