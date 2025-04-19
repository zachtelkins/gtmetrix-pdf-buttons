document.addEventListener('DOMContentLoaded', function() {
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
  
    // Default settings
    const defaultSettings = {
      primaryColor: colorPresets.teal.primaryColor,
      secondaryColor: colorPresets.teal.secondaryColor,
      textColor: colorPresets.teal.textColor,
      buttonMargin: "10px",
      borderRadius: "4px",
      activePreset: "teal"
    };
  
    // Initialize preset button styles
    initPresetButtons();
  
    // Load saved settings
    chrome.storage.sync.get(['settings'], function(result) {
      const settings = result.settings || defaultSettings;
      
      // Update form values
      document.getElementById('primaryColor').value = settings.primaryColor || defaultSettings.primaryColor;
      document.getElementById('secondaryColor').value = settings.secondaryColor || defaultSettings.secondaryColor;
      document.getElementById('textColor').value = settings.textColor || defaultSettings.textColor;
      document.getElementById('buttonMargin').value = settings.buttonMargin ? parseInt(settings.buttonMargin) : 10;
      document.getElementById('borderRadius').value = settings.borderRadius ? parseInt(settings.borderRadius) : 4;
      
      // Set the preset selector
      const presetSelector = document.getElementById('presetSelector');
      presetSelector.value = settings.activePreset || 'teal';
      
      // Update save button styling
      updateSaveButtonStyle(
        settings.primaryColor || defaultSettings.primaryColor,
        settings.secondaryColor || defaultSettings.secondaryColor,
        settings.textColor || defaultSettings.textColor
      );
      
      // Toggle custom colors visibility
      toggleCustomColors(presetSelector.value === 'custom');
      
      // Highlight active preset button
      highlightActivePreset(settings.activePreset || 'teal');
      
      // Update preview
      updateButtonPreview();
    });
    
    // Initialize preset buttons
    function initPresetButtons() {
      Object.keys(colorPresets).forEach(key => {
        const preset = colorPresets[key];
        const presetButton = document.getElementById(`preset-${key}`);
        if (presetButton) {
          presetButton.style.background = `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`;
          
          presetButton.addEventListener('click', function() {
            const presetName = this.getAttribute('data-preset');
            selectPreset(presetName);
          });
        }
      });
    }
    
    // Highlight active preset
    function highlightActivePreset(presetName) {
      // Remove active class from all
      document.querySelectorAll('.preset-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to selected
      if (presetName !== 'custom') {
        const activeButton = document.getElementById(`preset-${presetName}`);
        if (activeButton) {
          activeButton.classList.add('active');
        }
      }
    }
    
    // Helper function to update save button style
    function updateSaveButtonStyle(primaryColor, secondaryColor, textColor) {
      const saveButton = document.getElementById('saveSettings');
      if (saveButton) {
        saveButton.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
        saveButton.style.color = textColor;
      }
    }
    
    // Select a preset
    function selectPreset(presetName) {
      const presetSelector = document.getElementById('presetSelector');
      presetSelector.value = presetName;
      
      highlightActivePreset(presetName);
      toggleCustomColors(presetName === 'custom');
      
      if (presetName !== 'custom') {
        const preset = colorPresets[presetName];
        document.getElementById('primaryColor').value = preset.primaryColor;
        document.getElementById('secondaryColor').value = preset.secondaryColor;
        document.getElementById('textColor').value = preset.textColor;
        
        // Update save button styling
        updateSaveButtonStyle(preset.primaryColor, preset.secondaryColor, preset.textColor);
      }
      
      updateButtonPreview();
    }
    
    // Toggle custom colors section
    function toggleCustomColors(show) {
      document.getElementById('custom-colors').style.display = show ? 'block' : 'none';
    }
    
    // Set up event listeners for form inputs
    document.getElementById('primaryColor').addEventListener('input', updateButtonPreview);
    document.getElementById('secondaryColor').addEventListener('input', updateButtonPreview);
    document.getElementById('textColor').addEventListener('input', updateButtonPreview);
    document.getElementById('buttonMargin').addEventListener('input', updateButtonPreview);
    document.getElementById('borderRadius').addEventListener('input', updateButtonPreview);
    
    // Preset selector change
    document.getElementById('presetSelector').addEventListener('change', function() {
      selectPreset(this.value);
    });
    
    // Save settings
    document.getElementById('saveSettings').addEventListener('click', function() {
      const presetSelector = document.getElementById('presetSelector');
      const settings = {
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        textColor: document.getElementById('textColor').value,
        buttonMargin: document.getElementById('buttonMargin').value + 'px',
        borderRadius: document.getElementById('borderRadius').value + 'px',
        activePreset: presetSelector.value
      };
      
      chrome.storage.sync.set({ 
        settings: settings,
        colorPresets: colorPresets
      }, function() {
        // Notify content scripts to update
        chrome.tabs.query({}, function(tabs) {
          tabs.forEach(function(tab) {
            if (tab.url && tab.url.includes('https://gtmetrix.com/reports/')) {
              chrome.tabs.sendMessage(tab.id, { command: "update-settings" });
            }
          });
        });
        
        // Show save confirmation
        const saveBtn = document.getElementById('saveSettings');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Settings Saved!';
        saveBtn.style.backgroundColor = '#4CAF50';
        setTimeout(function() {
          saveBtn.textContent = originalText;
          saveBtn.style.background = `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`;
          saveBtn.style.color = settings.textColor;
        }, 2000);
      });
    });
    
    function updateButtonPreview() {
      const preview = document.getElementById('buttonPreview');
      const primaryColor = document.getElementById('primaryColor').value;
      const secondaryColor = document.getElementById('secondaryColor').value;
      const textColor = document.getElementById('textColor').value;
      const borderRadius = document.getElementById('borderRadius').value + 'px';
      const buttonMargin = document.getElementById('buttonMargin').value + 'px';
      
      preview.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
      preview.style.color = textColor;
      preview.style.borderRadius = borderRadius;
      preview.style.margin = buttonMargin;
      preview.style.transition = 'all 0.3s ease';
      preview.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      // Update save button styling
      updateSaveButtonStyle(primaryColor, secondaryColor, textColor);
      
      // Add hover effect using mouseover/mouseout
      preview.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      };
      preview.onmouseout = function() {
        this.style.transform = '';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      };
      
      // Update preset selector if colors match a preset
      const presetSelector = document.getElementById('presetSelector');
      let matchedPreset = null;
      
      Object.keys(colorPresets).forEach(key => {
        const preset = colorPresets[key];
        if (preset.primaryColor === primaryColor && 
            preset.secondaryColor === secondaryColor && 
            preset.textColor === textColor) {
          matchedPreset = key;
        }
      });
      
      if (matchedPreset && presetSelector.value !== matchedPreset) {
        presetSelector.value = matchedPreset;
        highlightActivePreset(matchedPreset);
      } else if (!matchedPreset && presetSelector.value !== 'custom') {
        presetSelector.value = 'custom';
        highlightActivePreset('custom');
      }
    }
  });