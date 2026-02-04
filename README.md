# 🐛 BugVault

A portable, single-file developer issue tracker. Store bugs, errors, and solutions in your browser—no servers, no accounts, just one HTML file.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://tahseen137.github.io/bugvault)

## 🎯 Why BugVault?

Ever fixed a bug and forgotten the solution six months later? BugVault is your personal knowledge base for every error and fix you encounter. Carry it on a USB stick, sync it via Dropbox, or host it on GitHub Pages.

## ✨ Features

### Core Functionality
- **📝 Quick Capture** — Log issues with error messages, context, and solutions
- **🔍 Full-Text Search** — Instant search with highlighted results
- **🏷️ Smart Filtering** — Filter by project, tags, or date range
- **📦 Fully Portable** — Single HTML file, works offline, runs anywhere
- **🎨 Dark Theme** — Easy on the eyes during late-night debugging

### Organization
- **📌 Pin Issues** — Keep important bugs at the top
- **📋 Duplicate Issues** — Clone entries as templates
- **🕐 Recently Viewed** — Quick access to last 5 viewed issues
- **🔖 Saved Filters** — Save and reuse filter combinations

### Data Management
- **💾 Auto-Backup** — Automatic JSON backup every 5 minutes
- **📥 Drag & Drop Import** — Drop JSON files to import
- **🔗 Share as Link** — Generate shareable URLs (base64 encoded)
- **📤 Export/Import** — Full JSON backup for syncing

### Bulk Operations
- **☑️ Multi-Select** — Select multiple issues at once
- **🗑️ Bulk Delete** — Remove multiple issues in one action
- **✏️ Bulk Edit** — Change project or tags for multiple issues

### Markdown Support
Write solutions with basic markdown:
- **bold**, *italic*, `inline code`
- Code blocks with syntax highlighting
- Clickable links

## 🚀 Quick Start

1. **Download** `index.html`
2. **Open** in any modern browser
3. **Start logging** bugs

That's it. No install, no build, no dependencies.

## 💡 Usage

### Logging an Issue
Click **New Issue** and fill in:
- **Title** — Brief description (required)
- **Error Message** — Stack trace or error output
- **Solution** — How you fixed it (supports markdown)
- **Project** — Group related issues
- **Tags** — Keywords like `react`, `api`, `auth`
- **Context** — Additional notes or links

### Sharing an Issue
1. Open any issue
2. Click **🔗 Share**
3. Copy the URL
4. Anyone with the link can import it

### Syncing Across Devices
BugVault stores data in browser localStorage. To sync:
1. Click **Export** to download JSON
2. Copy JSON to other device
3. Click **Import** or drag & drop

**Pro tip:** Keep the JSON in a synced folder (Dropbox, Google Drive, iCloud) for automatic sync.

### Self-Hosting with GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Enable GitHub Pages from `main` branch
4. Access at `https://yourusername.github.io/bugvault`

## 🛠️ Tech Stack

- Vanilla HTML, CSS, JavaScript
- No frameworks, no build tools
- LocalStorage for persistence
- ~1200 lines of well-commented code

## 📋 Sample Data

Want to see it in action? Import the included `sample-bugs.json` file with realistic developer issues to explore the interface.

## 🤝 Contributing

Found a bug? (Ironic, right?) Open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ☕ by developers, for developers. Keep track of your bugs before they track you down.

---

**[Try the Live Demo →](https://tahseen137.github.io/bugvault)**
