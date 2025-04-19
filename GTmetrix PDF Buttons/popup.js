document.addEventListener('DOMContentLoaded', function() {
    // Load default settings
    const defaultSettings = {
      primaryColor: "#35dece",
      secondaryColor: "#832ad0",
      textColor: "#47ffbf",
      buttonMargin: "10px",
      borderRadius: "4px"
    };
  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentUrl = tabs[0].url;
      const isGTmetrixReport = currentUrl.includes('https://gtmetrix.com/reports/');
      
      document.getElementById('gtmetrix-page').style.display = isGTmetrixReport ? 'block' : 'none';
      document.getElementById('not-gtmetrix-page').style.display = isGTmetrixReport ? 'none' : 'block';
      
      if (isGTmetrixReport) {
        // Load settings to style buttons
        chrome.storage.sync.get(['settings'], (result) => {
          if (result.settings) {
            const settings = {...defaultSettings, ...result.settings};
            const buttons = document.querySelectorAll('.summary-button, .full-button, .both-button');
            
            buttons.forEach(button => {
              button.style.background = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`;
              button.style.color = settings.textColor;
              button.style.borderRadius = settings.borderRadius;
            });
          }
        });
        
        // Add click handlers
        document.getElementById('summaryBtn').addEventListener('click', function() {
          chrome.tabs.sendMessage(tabs[0].id, { command: "download-summary" });
          window.close();
        });
        
        document.getElementById('fullBtn').addEventListener('click', function() {
          chrome.tabs.sendMessage(tabs[0].id, { command: "download-full" });
          window.close();
        });
        
        document.getElementById('bothBtn').addEventListener('click', function() {
          chrome.tabs.sendMessage(tabs[0].id, { command: "download-both" });
          window.close();
        });
      }
      
      document.getElementById('settingsBtn').addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
        window.close();
      });
    });
  });