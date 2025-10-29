# Obsidian Setup Guide

This guide will help you connect Obsidian to this repository so you can edit content files and use git directly from Obsidian.

## Prerequisites

1. **Obsidian installed** on your Mac
2. **Git installed** and configured on your system
3. **Obsidian Git plugin** (we'll install this during setup)

## Setup Steps

### Step 1: Open Repository as Obsidian Vault

1. **Open Obsidian**
2. Click **"Open folder as vault"** (or click the folder icon in the bottom left if Obsidian is already open)
3. Navigate to and select: `/Users/cquinterom096/Documents/Javascript/Backend/docs`
4. Click **"Open"**

### Step 2: Install Required Plugin

1. In Obsidian, go to **Settings** (⚙️ icon in bottom left)
2. Navigate to **Community plugins**
3. Click **"Turn on community plugins"** if not already enabled
4. Click **"Browse"**
5. Search for **"Git"** by Vincent
6. Click **"Install"** then **"Enable"**

### Step 3: Configure Obsidian Git Plugin

1. Go to **Settings** → **Git**
2. Configure the following settings:
   - **Auto save interval**: `60` (auto-commit every 60 seconds when changes detected)
   - **Auto pull interval**: `5` (pull changes every 5 minutes)
   - **Auto pull on startup**: Enable ✓
   - **Pull updates before push**: Enable ✓
   - **Disable push**: Disable (unchecked) - you want to push
   - **Vault backup interval**: `0` (disable, or set to your preference)
   
   **For first-time setup:**
   - **Disable push**: Leave disabled so you can push
   - **Pull updates on startup**: Enable ✓ (recommended)

3. **Backup settings**:
   - You can leave backup settings disabled if you prefer git-only version control

### Step 4: Configure Git Repository (if needed)

Make sure your git credentials are configured:

```bash
# Set your git identity (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Or configure just for this repository
cd /Users/cquinterom096/Documents/Javascript/Backend/docs
git config user.name "Your Name"
git config user.email "your.email@example.com"
```
## Using Obsidian Git

### Manual Git Operations

1. **Open Git Source Control**: Click the git icon in the left ribbon (or use Command Palette: `Cmd+P` → "Open Git source control"
2. **Commit changes**: Click "Commit all changes" button
3. **Push changes**: Click "Push" button
4. **Pull changes**: Click "Pull" button

### Automatic Git Operations

With auto-save enabled:
- Obsidian Git will automatically commit changes every 60 seconds (or your configured interval)
- It will automatically pull updates on startup
- You'll still need to manually push (for safety)

### Keyboard Shortcuts

- `Cmd+P` - Command Palette
- `Cmd+Shift+P` - Git source control
- The git panel shows file changes and allows you to commit/pull/push

## Recommended Workflow

1. **Start working**: Open Obsidian and start editing files in the `content/` folder
2. **Edit freely**: Make changes to `.md` and `.mdx` files
3. **Auto-commit**: Changes are automatically committed (if auto-save is enabled)
4. **Pull before pushing**: Always pull first to get latest changes
5. **Push changes**: Push your commits to the remote repository
6. **Verify**: Check GitHub to see your changes

## Troubleshooting

### Obsidian Git Not Showing Changes

1. Make sure the plugin is enabled
2. Check that your `.obsidian/` folder exists (it's gitignored, which is correct)
3. Try disabling and re-enabling the plugin

### Git Authentication Issues

If you encounter authentication issues when pushing:
1. Use SSH keys instead of HTTPS (recommended)
2. Or use a personal access token for HTTPS
3. Update your remote URL: `git remote set-url origin git@github.com:prisma-collective/docs.git`

### Conflicts

If you get merge conflicts:
1. Resolve conflicts in Obsidian or your terminal
2. The Obsidian Git plugin will show conflicts in the source control panel
3. You can also use terminal: `git status` to see conflicts

### Can't Find Git Ribbon Icon

1. Go to Settings → Appearance
2. Look for "Show ribbon" option
3. Or use Command Palette (`Cmd+P`) → "Open Git source control"

## File Structure

```
docs/
├── .obsidian/          # Obsidian config (gitignored)
├── content/            # Main content folder - edit here!
│   ├── collaborators/
│   ├── events/
│   ├── processes/
│   └── ...
├── scripts/            # Obsidian config templates
└── ...
```

## Tips

- **Focus on `content/` folder**: This is where your documentation lives
- **Use wiki-links**: Obsidian will help with linking between files
- **Graph view**: Use Obsidian's graph view to visualize connections between documents
- **Backlinks**: See what files link to the current file in the backlinks panel
- **Search**: Use `Cmd+Shift+F` for global search across all files

## Next Steps

After setup, you should be able to:
1. ✅ Open Obsidian and see your vault
2. ✅ Edit `.md` and `.mdx` files in the `content/` folder
3. ✅ Use git operations directly from Obsidian
4. ✅ Have changes automatically saved and committed

