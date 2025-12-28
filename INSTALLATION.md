# DataVoid Chrome Extension - Installation Guide

## Quick Start

### Step 1: Create Icons
The extension requires PNG icon files. You have two options:

**Option A: Use the Icon Generator (Recommended)**
1. Open `assets/create-icons.html` in your browser
2. Right-click each icon and save as:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels) 
   - `icon128.png` (128x128 pixels)
3. Save these files in the `assets/` folder

**Option B: Use Placeholder Files**
- The placeholder files are already created but are empty
- Replace them with actual PNG images for proper display

### Step 2: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the DataVoid folder
   - The extension should appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "DataVoid" and click the pin icon
   - The DataVoid icon will appear in your toolbar

## Testing the Extension

### Basic Functionality Test

1. **Open the Popup**
   - Click the DataVoid icon in your toolbar
   - You should see the purple gradient interface

2. **Test Account Scanning**
   - Click "🔍 Scan for Old Accounts"
   - Wait for the scan to complete
   - Review the results showing detected accounts

3. **Test Account Actions**
   - Click "🗑️ Delete" or "👁️ Check" buttons
   - Should open Google search for account deletion guides

### Advanced Testing

1. **Test Options Page**
   - Right-click the DataVoid icon
   - Select "Options"
   - Configure settings and save

2. **Test Content Script**
   - Visit a login page (e.g., `example.com/login`)
   - Look for the DataVoid indicator in the top-right
   - Click it to open the popup

3. **Test Storage**
   - Perform a scan
   - Close and reopen the popup
   - Results should be cached and displayed

## Troubleshooting

### Extension Won't Load
- **Check file structure**: Ensure all required files are present
- **Check manifest.json**: Verify syntax is correct
- **Check icons**: Ensure PNG files exist in assets folder
- **Check console**: Look for error messages in Chrome DevTools

### No Accounts Detected
- **Check permissions**: Ensure history permission is granted
- **Check history**: Make sure you have browser history
- **Check patterns**: Visit some login/signup pages first
- **Check date range**: Try different scan depth settings

### Popup Not Working
- **Check background script**: Look for errors in service worker
- **Check permissions**: Ensure all required permissions are granted
- **Reload extension**: Try reloading the extension
- **Check console**: Look for JavaScript errors

### Icons Not Displaying
- **Replace placeholder files**: Use the icon generator tool
- **Check file format**: Ensure files are valid PNG format
- **Check file size**: Icons should be appropriate sizes
- **Reload extension**: After adding new icons

## Development Mode

### Making Changes
1. Edit any file in the extension
2. Go to `chrome://extensions/`
3. Click the refresh icon on the DataVoid extension
4. Test your changes

### Debugging
1. **Popup Debugging**:
   - Right-click the extension icon → "Inspect popup"
   - Use Chrome DevTools to debug

2. **Background Script Debugging**:
   - Go to `chrome://extensions/`
   - Click "service worker" link under DataVoid
   - Use Chrome DevTools to debug

3. **Content Script Debugging**:
   - Open any webpage
   - Open Chrome DevTools (F12)
   - Look for content script in Sources tab

## File Structure Verification

Ensure your extension folder contains:

```
DataVoid/
├── manifest.json          ✓
├── background.js          ✓
├── popup/
│   ├── popup.html         ✓
│   ├── popup.js           ✓
│   └── popup.css          ✓
├── content/
│   ├── content.js         ✓
│   └── content.css        ✓
├── options/
│   ├── options.html       ✓
│   ├── options.js         ✓
│   └── options.css        ✓
├── assets/
│   ├── icon16.png         ⚠️ (needs proper PNG)
│   ├── icon48.png         ⚠️ (needs proper PNG)
│   ├── icon128.png        ⚠️ (needs proper PNG)
│   ├── icon.svg           ✓
│   └── create-icons.html  ✓
├── utils/
│   ├── account-detector.js ✓
│   ├── email-parser.js    ✓
│   └── storage-helper.js  ✓
├── README.md              ✓
└── INSTALLATION.md        ✓
```

## Next Steps

1. **Create proper icons** using the icon generator
2. **Test all functionality** thoroughly
3. **Customize settings** in the options page
4. **Add your own templates** for account deletion
5. **Share feedback** and report any issues

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the README.md file
3. Check Chrome extension documentation
4. Create an issue in the repository

---

**Happy privacy hunting!** ⚡
