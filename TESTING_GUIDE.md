# Testing PrivacyBlitz on macOS

## Quick Start - Load Extension in Chrome

### Step 1: Open Chrome Extensions Page
1. Open **Google Chrome** on your Mac
2. Go to `chrome://extensions/` in the address bar
   - Or: Click the **three dots menu** (⋮) → **More Tools** → **Extensions**

### Step 2: Enable Developer Mode
1. Look for the **"Developer mode"** toggle in the **top-right corner**
2. **Turn it ON** (toggle should be blue/enabled)

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button (appears after enabling Developer Mode)
2. Navigate to your extension folder:
   - Go to: `/Users/tanushaggarwal/DataVoid`
   - Select the **DataVoid** folder
   - Click **"Select"** or **"Open"**

### Step 4: Verify Installation
- You should see **"PrivacyBlitz - Find & Delete Old Accounts"** in your extensions list
- The extension icon should appear in your Chrome toolbar
- If you don't see it, click the **puzzle piece icon** (🧩) in the toolbar and pin PrivacyBlitz

## Testing the Extension

### Test 1: Open the Popup
1. Click the **PrivacyBlitz icon** (⚡) in your Chrome toolbar
2. You should see the popup with:
   - "⚡ PrivacyBlitz" header
   - "🔍 Scan for Old Accounts" button
   - Dark gradient background

### Test 2: Run a Scan
1. Click **"🔍 Scan for Old Accounts"**
2. You should see:
   - Loading spinner
   - "Scanning your digital footprint..." message
   - Button changes to "⏳ Scanning..."
3. Wait for scan to complete (may take 10-30 seconds)
4. Results should appear showing:
   - Stats (Login Sites, Possible Accounts)
   - List of detected accounts
   - Filter tabs (All, Old, Recent, Active)

### Test 3: Test Search
1. After scan completes, type in the **search box**
2. Accounts should filter in real-time
3. Click **✕** to clear search

### Test 4: Test Tagging
1. Click the **🏷️ tag button** next to any account
2. Select a tag: **Keep**, **Delete**, or **Review**
3. Tag should appear next to the domain name
4. Reload extension - tag should persist

### Test 5: Test Account Actions
1. Click **🌐 Visit** - Should open the website in a new tab
2. Click **🗑️ Delete** - Should open deletion guide or direct link
3. For accounts in the database (Facebook, Twitter, etc.), should open direct deletion page

### Test 6: Test Quick Actions
1. Click **📝 GDPR Template** - Should show modal with template
2. Click **🔒 Privacy Guide** - Should show privacy guide
3. Click **📤 Data Export** - Should show export guide
4. Click **⚙️ Settings** - Should open options page

### Test 7: Test Options Page
1. Right-click the PrivacyBlitz icon
2. Select **"Options"**
3. Should open options page with settings
4. Try changing settings and saving

## Troubleshooting

### Extension Won't Load
**Error: "Manifest file is missing or unreadable"**
- Make sure you selected the **DataVoid folder** (not a subfolder)
- Check that `manifest.json` exists in the root

**Error: "Could not load extension"**
- Check the browser console for errors
- Look for missing files (especially icon files)
- Make sure all files are present

### No Accounts Detected
- Make sure you have browser history
- Visit some login pages first (try logging into a few sites)
- Check that history permission is granted
- Try scanning again

### Popup Not Working
- **Reload the extension**: Go to `chrome://extensions/`, find PrivacyBlitz, click the refresh icon (🔄)
- **Check for errors**: Right-click the extension icon → "Inspect popup" → Check Console tab for errors
- **Check background script**: Go to `chrome://extensions/` → Click "service worker" link under PrivacyBlitz → Check for errors

### Search Not Working
- Make sure you've run a scan first
- Check browser console for JavaScript errors
- Try reloading the extension

### Deletion Links Not Working
- Check that `utils/deletion-database.js` is loading
- Open browser console (F12) and check for errors
- Fallback: Should still open Google search

## Debugging Tips

### View Popup Console
1. Right-click the PrivacyBlitz icon
2. Select **"Inspect popup"**
3. Console tab shows JavaScript errors

### View Background Script Console
1. Go to `chrome://extensions/`
2. Find PrivacyBlitz
3. Click **"service worker"** link
4. Console shows background script errors

### View Content Script Console
1. Open any webpage
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for PrivacyBlitz-related messages

### Check Extension Storage
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Storage** → **Chrome Extension**
4. Check `chrome.storage.local` and `chrome.storage.sync`

## Quick Reload After Changes

After making code changes:
1. Go to `chrome://extensions/`
2. Find **PrivacyBlitz**
3. Click the **refresh icon** (🔄) to reload
4. Test again

## Common Issues

### Icons Not Showing
- Make sure `icon16.png`, `icon48.png`, and `icon128.png` exist in `assets/` folder
- If missing, use `assets/create-icons.html` to generate them

### Permission Errors
- Go to `chrome://extensions/`
- Find PrivacyBlitz
- Make sure all permissions are granted
- If not, click "Details" and grant permissions

### Extension Crashes
- Check browser console for errors
- Try disabling other extensions
- Clear extension storage: Options page → "Clear All Data"

## Success Checklist

✅ Extension loads without errors  
✅ Popup opens and displays correctly  
✅ Scan completes and shows results  
✅ Search filters accounts  
✅ Tagging works and persists  
✅ Delete buttons open correct links  
✅ Quick actions show modals  
✅ Options page opens and saves settings  
✅ No console errors  

## Next Steps

Once everything works:
1. Test with different browser history sizes
2. Test edge cases (empty history, many accounts)
3. Test on different websites
4. Prepare for Chrome Web Store submission

---

**Need Help?** Check the console for error messages and refer to the troubleshooting section above.

