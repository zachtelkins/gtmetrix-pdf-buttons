# GTmetrix PDF Buttons

A Chrome extension that adds convenient buttons to GTmetrix report pages for one-click PDF downloads.

**IMPORTANT: Requires a GTmetrix PRO account to function properly.**

## Features

### Core Functionality
- **One-Click PDF Downloads**: Adds dedicated buttons directly to GTmetrix report pages
  - Download Summary PDF 
  - Download Full PDF
  - Download Both PDFs (in sequence)
- **Keyboard Shortcuts**: Power-user friendly shortcuts for faster workflow
  - Alt+1: Download Summary PDF
  - Alt+2: Download Full PDF  
  - Alt+3: Download Both PDFs
- **PageSpeed Insights Integration**: Quickly analyze the same URL in Google's PageSpeed Insights with a single click
- **First-Time Guide**: Helpful notification shows first-time users how to access the settings panel

### Customization Options
- **Beautiful Color Themes**: Three built-in themes to choose from
  - Teal & Purple (Default)
  - Sunset (Orange & Red)
  - Forest Dream (Green & Pink)
- **Button Appearance**: Fine-tune the look and feel
  - Adjustable Button Margin
  - Adjustable Border Radius

### Technical Details
- Lightweight: Minimal impact on browser performance
- No data collection: Your browsing data stays private
- Fast and responsive: Native integration with GTmetrix reports
- Clean design: Follows modern UI principles

## Installation

### Chrome Web Store (Recommended)
1. Go to the [Chrome Web Store](https://chrome.google.com/webstore/detail/gtmetrix-pdf-buttons/[extension-id])
2. Click "Add to Chrome"
3. Confirm the installation when prompted

### Manual Installation (For Developers)
1. Download or clone this repository
2. Go to `chrome://extensions/` in your Chrome browser
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files

## Usage

1. Go to any GTmetrix report page (must be logged in with a PRO account)
2. You'll see three new buttons at the top of the page:
   - "Download Summary PDF"
   - "Download Full PDF"
   - "Download Both PDFs"
   - "View in PageSpeed Insights" (Google 'G' icon)
3. Click any button to download the respective PDF(s)
4. Use keyboard shortcuts (Alt+1, Alt+2, Alt+3) for even faster access

### Settings
1. Click the extension icon in your browser toolbar
2. Click "Open Settings" to customize the appearance
3. Choose from preset color themes or adjust button appearance
4. Changes apply instantly to all GTmetrix report pages

## Requirements

- Google Chrome browser (or Chromium-based browser)
- GTmetrix PRO account (essential for PDF downloads to work)
- Active internet connection

## Known Issues

- The extension only works on pages starting with `https://gtmetrix.com/reports/`
- PDF downloads will fail if you don't have a GTmetrix PRO account
- Some corporate networks may block PDF downloads

## Privacy

This extension:
- Does not collect or transmit any user data
- Does not track your browsing activity
- Does not modify GTmetrix reports except to add the download buttons
- Does not communicate with any third-party servers (except opening PageSpeed Insights when requested)

## Contributing

While this is a commercial extension, bug reports are welcome:
1. Open an issue describing the bug in detail
2. Include steps to reproduce the issue
3. Mention your browser version and operating system

## License

MIT License

Copyright (c) 2025 ZachWP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

- Built with inspiration from GTmetrix's design philosophy
- Special thanks to the Chrome Extensions community

---

Developed by [ZachWP](https://www.zachwp.com/)
