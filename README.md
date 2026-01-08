# 🐛 BugVault

> Your portable developer issue tracker — a single HTML file that runs anywhere.

## Why BugVault?

Ever fixed a bug and completely forgotten how you did it six months later? BugVault is your personal knowledge base for every error, issue, and solution you encounter. No accounts, no servers, no subscriptions — just one HTML file you can carry on a USB stick.

## ✨ Features

### Core
- **📝 Quick Capture** — Log issues with error messages, context, and solutions
- **🔍 Instant Search** — Full-text search with highlighted results
- **🏷️ Smart Filtering** — Filter by project, tags, or date range
- **📦 Fully Portable** — Single HTML file, works offline, runs in any browser
- **🎨 Dark Theme** — Easy on the eyes during those late-night debugging sessions

### Organization
- **📌 Pin Issues** — Keep important issues at the top
- **📋 Duplicate Issues** — Clone existing issues as templates
- **🕐 Recently Viewed** — Quick access to your last 5 viewed issues
- **🔖 Saved Filters** — Save and reuse your favorite filter combinations

### Search & Filter
- **🔦 Search Highlighting** — Matches highlighted in yellow
- **📅 Date Range Filter** — Filter issues by creation date
- **🧹 Clear All Filters** — One-click reset for all active filters

### Data & Sync
- **💾 Auto-Backup** — Automatic JSON backup every 5 minutes
- **📥 Drag & Drop Import** — Drop a JSON file anywhere to import
- **🔗 Share as Link** — Generate a shareable URL for any issue (base64 encoded)
- **📤 Export/Import** — Full JSON backup you can sync however you like

### Bulk Operations
- **☑️ Bulk Select** — Select multiple issues at once
- **🗑️ Bulk Delete** — Delete multiple issues in one action
- **✏️ Bulk Edit** — Change project or add tags to multiple issues

### Markdown Support
Solutions support basic markdown:
- `**bold**` → **bold**
- `*italic*` → *italic*
- `` `inline code` `` → `inline code`
- ` ```code blocks``` ` → formatted code blocks
- `[links](url)` → clickable links

## 🚀 Quick Start

1. **Download** `index.html`
2. **Open** in any modern browser
3. **Start logging** your issues

That's it. No install, no build step, no dependencies.

## 💡 Usage Tips

### Logging an Issue

Click **New Issue** and fill in:
- **Title** — Brief description (required)
- **Error Message** — Paste the stack trace or error
- **Solution** — How did you fix it? (supports markdown)
- **Project** — Group issues by project
- **Tags** — Add keywords like `react`, `api`, `auth`
- **Context** — Any additional notes or links

### Sharing an Issue

1. Open any issue
2. Click **🔗 Share**
3. Copy the generated URL
4. Anyone with the link can import that single issue

### Syncing Across Devices

BugVault stores data in your browser's localStorage. To move your data:

1. Click **Export** to download a JSON file
2. Copy the JSON to your other device
3. Click **Import** or drag & drop the file to load it

Pro tip: Keep the JSON in a synced folder (Dropbox, Google Drive, iCloud) for automatic sync.

### Using with GitHub Pages

Host your own BugVault:

1. Fork this repository
2. Go to Settings → Pages
3. Enable GitHub Pages from the main branch
4. Access at `https://yourusername.github.io/bugvault`

## 🛠️ Tech Stack

- Vanilla HTML, CSS, JavaScript
- No frameworks, no build tools
- LocalStorage for persistence
- ~1200 lines of well-commented code

## 📄 License

MIT — do whatever you want with it.

## 🤝 Contributing

Found a bug? (Ironic, right?) Open an issue or submit a PR.

---

Made with ☕ by developers, for developers.
