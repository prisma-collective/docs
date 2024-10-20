# Contributing to Prisma Docs

Thank you for contributing to our documentation! To maintain the highest quality and consistency, we have a few tools in place to automatically check and format Markdown files.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prisma-collective/docs.git
   cd docs
   ```
   
2. **Run the setup script:**
For macOS/Linux:
   ```bash
   Copy code
   ./Scripts/setup.sh
   ```
   
For Windows:
   ```cmd
   Copy code
   Scripts\setup.bat
   ```

This will install the necessary tools and set up Git hooks to automatically format and lint Markdown files before every commit.

## Workflow

1. **Make your changes:** Edit the Markdown files.
2. **Commit your changes:** When you commit, the hooks will automatically format and lint the Markdown files.

If there are any issues (e.g., formatting errors), the commit will be stopped, and you'll be asked to fix them.

Happy contributing! 😎
