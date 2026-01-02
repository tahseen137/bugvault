# 🐛 BugVault

> Your portable developer issue tracker — a single HTML file that runs anywhere.

![BugVault Screenshot](screenshot.png)

## Why BugVault?

Ever fixed a bug and completely forgotten how you did it six months later? BugVault is your personal knowledge base for every error, issue, and solution you encounter. No accounts, no servers, no subscriptions — just one HTML file you can carry on a USB stick.

## ✨ Features

- **📝 Quick Capture** — Log issues with error messages, context, and solutions
- **🔍 Instant Search** — Full-text search across all your entries
- **🏷️ Smart Filtering** — Filter by status, project, or tags
- **📦 Fully Portable** — Single HTML file, works offline, runs in any browser
- **💾 Export/Import** — JSON backup you can sync however you like
- **🎨 Dark Theme** — Easy on the eyes during those late-night debugging sessions

## 🚀 Quick Start

1. **Download** `bugvault.html`
2. **Open** in any modern browser
3. **Start logging** your issues

That's it. No install, no build step, no dependencies.

## 💡 Usage Tips

### Logging an Issue

Click **New Issue** and fill in:
- **Title** — Brief description (required)
- **Error Message** — Paste the stack trace or error
- **Context** — What were you doing when it happened?
- **Solution** — How did you fix it?
- **Project** — Group issues by project
- **Tags** — Add keywords like `react`, `api`, `auth`

### Syncing Across Devices

BugVault stores data in your browser's localStorage. To move your data:

1. Click **Export** to download a JSON file
2. Copy the JSON to your other device
3. Click **Import** to load it

You can automate this by keeping the JSON in a synced folder (Dropbox, Google Drive, iCloud, etc.)

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
- ~800 lines of code

## 📄 License

MIT — do whatever you want with it.

## 🤝 Contributing

Found a bug? (Ironic, right?) Open an issue or submit a PR.

Ideas welcome:
- Keyboard shortcuts
- Markdown support in solutions
- Dark/light theme toggle
- Browser extension for quick capture

---

Made with ☕ by developers, for developers.
