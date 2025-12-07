# Custom Bangs Firefox Extension 🔍

A Firefox extension that provides custom bang shortcuts for quick navigation and search, similar to DuckDuckGo bangs but fully customizable.

## Features

- ✅ **Pre-loaded with 25+ popular bangs** (Google, YouTube, Wikipedia, GitHub, etc.)
- ✅ **Only processes queries starting with !** - all other searches handled by your default search engine
- ✅ **Easy management** - Add, edit, and delete custom bangs through a beautiful UI
- ✅ **Import/Export** - Share your bang collections as JSON files
- ✅ **Search & Filter** - Quickly find bangs in your collection
- ✅ **Persistent storage** - Your custom bangs are saved across browser sessions
- ✅ **Case-insensitive** - Bangs work regardless of case
- ✅ **Domain badge counter** - Shows number of bangs for current domain
- ✅ **Context menu** - Right-click extension icon for quick actions
- ✅ **Domain filtering** - View/delete bangs by domain

## How It Works

When you type a query in the address bar starting with `!`, the extension intercepts it and redirects to your configured URL:

- `!g cats` → Searches Google for "cats"
- `!yt music` → Searches YouTube for "music"
- `!gh firefox` → Searches GitHub for "firefox"
- `cats !g` → Uses default search engine (bang must be at the start)

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension directory and select `manifest.json`

The extension will be loaded temporarily and will work until you restart Firefox.

### Permanent Installation

To permanently install the extension, you'll need to:
1. Package the extension as a .xpi file
2. Sign it through Mozilla's Add-on Developer Hub
3. Install the signed .xpi file

## Usage

### Using Bangs

Simply type `!` followed by a bang trigger and your search terms in the address bar:

```
!g search terms here
!yt video name
!w article name
```

### Managing Bangs

1. Click the extension icon in the toolbar, or
2. Right-click the extension icon and select "Options"

From the options page you can:
- **Add new bangs** - Click "+ Add Bang" button
- **Edit existing bangs** - Click "Edit" button next to any bang
- **Delete bangs** - Click "Delete" button
- **Search bangs** - Use the search box to filter
- **Export bangs** - Download your collection as JSON
- **Import bangs** - Upload a JSON file to import
- **Reset to defaults** - Restore the original bang collection

### Creating Custom Bangs

When creating a bang, you need to provide:

1. **Trigger**: The shortcut (e.g., `g` for Google)
2. **URL Template**: The URL with `{{{s}}}` as placeholder for search terms
   - Example: `https://www.google.com/search?q={{{s}}}`
3. **Description**: A human-readable description

## Default Bangs Included

- `!g` - Google Search
- `!gi` - Google Images
- `!gm` - Google Maps
- `!yt` - YouTube
- `!w` - Wikipedia
- `!a` - Amazon
- `!gh` - GitHub
- `!so` - Stack Overflow
- `!r` - Reddit
- `!tw` - Twitter/X
- `!imdb` - IMDb
- `!wa` - Wolfram Alpha
- `!dd` - DuckDuckGo
- `!bing` - Bing
- `!mdn` - MDN Web Docs
- `!npm` - npm
- `!py` - Python Docs
- `!translate` - Google Translate
- `!maps` - Google Maps
- `!ebay` - eBay
- `!news` - Google News
- `!scholar` - Google Scholar
- `!linkedin` - LinkedIn
- `!wayback` - Wayback Machine
- `!giphy` - Giphy

## File Structure

```
bang-extension/
├── manifest.json          # Extension configuration
├── background.js          # Main logic for intercepting and redirecting
├── default-bangs.js       # Pre-populated common bangs
├── options/
│   ├── options.html       # UI for managing bangs
│   ├── options.css        # Styling
│   └── options.js         # Logic for CRUD operations
└── icons/
    ├── icon-48.png
    ├── icon-96.png
    └── icon-128.png
```

## Import/Export Format

Bangs are exported as JSON arrays:

```json
[
  {
    "trigger": "g",
    "url": "https://www.google.com/search?q={{{s}}}",
    "description": "Google Search"
  },
  {
    "trigger": "yt",
    "url": "https://www.youtube.com/results?search_query={{{s}}}",
    "description": "YouTube"
  }
]
```

## Technical Details

- **Permissions**: `webRequest`, `webRequestBlocking`, `storage`, `<all_urls>`
- **Storage**: Uses `browser.storage.local` for persistence
- **Interception**: Uses `webRequest.onBeforeRequest` to intercept address bar queries
- **Bang Detection**: Only processes queries starting with `!` followed by a trigger
- **URL Placeholder**: Uses `{{{s}}}` as the search term placeholder

## Privacy

- All data is stored locally in your browser
- No telemetry or external requests (except for your bang redirects)
- No tracking or analytics
- Open source - inspect the code yourself!

## Contributing

Suggestions and contributions are welcome! This extension is designed to be simple and user-focused.

## License

MIT License - Feel free to modify and distribute as you wish.

## Credits

Created as a custom, privacy-focused alternative to DuckDuckGo bangs.
