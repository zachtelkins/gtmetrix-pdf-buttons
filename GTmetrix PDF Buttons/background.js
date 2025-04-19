// Color presets
const colorPresets = {
    teal: {
      name: "Teal & Purple",
      primaryColor: "#35dece",
      secondaryColor: "#832ad0",
      textColor: "#47ffbf"
    },
    sunset: {
      name: "Sunset",
      primaryColor: "#ff5e62",
      secondaryColor: "#ff9966",
      textColor: "#ffffff"
    },
    forest: {
      name: "Forest Dream",
      primaryColor: "#134e5e",
      secondaryColor: "#eb6ba8",
      textColor: "#71ffe9"
    }
  };
  
  chrome.commands.onCommand.addListener((command) => {
    if (command === "download-summary" || command === "download-full" || command === "download-both") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.url && activeTab.url.includes("https://gtmetrix.com/reports/")) {
          chrome.tabs.sendMessage(activeTab.id, { command: command });
        }
      });
    }
  });
  
  // Initialize default settings if not present
  chrome.runtime.onInstalled.addListener(() => {
    // Reset the notification flag when the extension is installed/updated
    chrome.storage.local.set({ 'hasSeenNotification': false });
    
    chrome.storage.sync.get(['settings'], (result) => {
      if (!result.settings) {
        const defaultSettings = {
          primaryColor: colorPresets.teal.primaryColor,
          secondaryColor: colorPresets.teal.secondaryColor,
          textColor: colorPresets.teal.textColor,
          buttonMargin: "10px",
          borderRadius: "4px",
          activePreset: "teal"
        };
        chrome.storage.sync.set({ 
          settings: defaultSettings,
          colorPresets: colorPresets
        });
      }
    });
  });

  // Add this to the bottom of your background.js file
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "open_options_page") {
      chrome.runtime.openOptionsPage();
    }
    return true;
  });