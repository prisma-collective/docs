# Contributing to Prisma Docs

Thank you for contributing to our documentation! To maintain the highest quality and consistency, we have a few tools in place to automatically check and format Markdown files.

## Setup Instructions

Before making any changes, follow these steps to ensure everything is set up correctly:

1. **Clone the repository**:
   If you haven’t cloned the repository yet, you can do so using the following commands:
   ```bash
   git clone https://github.com/prisma-collective/docs.git
   cd docs
   ```

2. **Run the setup script** to install necessary dependencies and configure Git hooks for automatic Markdown formatting and linting:
   - **For macOS/Linux**:
     ```bash
     ./Scripts/setup.sh
     ```
   - **For Windows**:
     ```cmd
     Scripts\setup.bat
     ```

This will install the necessary tools and set up Git hooks that will automatically format and lint Markdown files before every commit.

## Making Changes to the Documentation

Once your environment is set up, follow these steps to make and submit your changes:

### 1. Create a New Branch

Before making changes, it’s a good practice to create a new branch for your work. This keeps your changes separate from the main branch:

```bash
git checkout -b your-branch-name
```

Choose a meaningful name for your branch, like `update-readme` or `fix-typo-in-docs`.

### 2. Make Your Changes

Edit the Markdown files as needed. You can use any text editor to make the changes. For example, to edit a specific file, you can open it in your preferred editor:

```bash
nano docs/getting-started.md
```

Or use a graphical text editor like **VS Code**, **Atom**, or **Sublime Text**.

### 3. Add Your Changes

Once you have made the necessary changes, stage them by running the following command:

```bash
git add <file1> <file2>  # Replace with the names of the files you modified
```

If you want to add all the changes at once, you can use:

```bash
git add .
```

### 4. Commit Your Changes

After staging your changes, you need to commit them. When you commit, the pre-commit hooks will automatically run the Markdown linting and formatting checks. If there are any issues, the commit will be stopped, and you will need to fix them before proceeding.

Run the following command to commit your changes:

```bash
git commit -m "Your descriptive commit message"
```

Make sure your commit message is descriptive and explains what changes you made, e.g., `Update installation guide for clarity` or `Fix typo in getting-started.md`.

### 5. Push Your Changes

Once your changes are committed, push them to GitHub. If you're on a new branch, you’ll need to push your branch to the remote repository:

```bash
git push origin your-branch-name
```

### 6. Open a Pull Request

After pushing your changes to GitHub, go to the repository’s [Pull Requests page](https://github.com/prisma-collective/docs/pulls) and open a new pull request:

- Compare the branch you just pushed (`your-branch-name`) with the `main` branch.
- Provide a description of the changes you made.
- Submit the pull request.

Once the pull request is submitted, it will be reviewed by a maintainer, and any necessary changes will be discussed with you.

## Additional Help with Git

If you're new to Git, here are some common Git commands that might help:

- **Check the status of your working directory**:
  ```bash
  git status
  ```

- **See the changes you made**:
  ```bash
  git diff
  ```

- **Undo changes before staging them**:
  ```bash
  git checkout -- <file>
  ```

- **Unstage files after running `git add`**:
  ```bash
  git reset <file>
  ```

### Troubleshooting

#### Pre-Commit Hook Errors
If the pre-commit hooks fail during a commit (e.g., due to Markdown formatting issues), you will need to fix the errors and try again:

1. Review the errors shown in the terminal.
2. Fix the issues in the files.
3. Stage the fixed files (`git add <file>`) and attempt to commit again.

## Workflow Summary

1. **Create a new branch**: `git checkout -b your-branch-name`
2. **Make your changes**: Edit the Markdown files.
3. **Stage the changes**: `git add .`
4. **Commit**: `git commit -m "Your descriptive commit message"`
5. **Push**: `git push origin your-branch-name`
6. **Open a pull request**: Submit the changes on GitHub.

## Additional Resources

- **GitHub Documentation**: [https://docs.github.com/](https://docs.github.com/)
- **Git Cheat Sheet**: [https://education.github.com/git-cheat-sheet-education.pdf](https://education.github.com/git-cheat-sheet-education.pdf)

If you have any questions or need further assistance, feel free to reach out to the maintainers or open an issue on GitHub.
