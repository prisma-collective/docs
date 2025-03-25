Our documentation site is built using [MkDocs](https://www.mkdocs.org/) with the Material theme and is hosted on GitHub Pages. MkDocs is a static-site generator[^1], build for markdown pages. The deployment process is automated using a GitHub Actions workflow, triggered on every push to the `main` branch. [Obsidian](Obsidian) is used as a client interface to write to the docs, which uses a git plugin to make regular commits (every 1 minute) to the docs repo and ensure version parity across clients. This is not perfectly reliable and merge conflicts can still occur. 

This setup ensures that any changes made to the documentation are automatically published, making it easy to maintain up-to-date content without manual intervention.
## How Deployment Works

1. **Event participants update the documentation** in the `main` branch.
2. **GitHub Actions builds and deploys** the site:
    - It installs MkDocs and required plugins.
    - It generates the static site.
    - It pushes the built site to the `gh-pages` branch.
3. **GitHub Pages serves the latest version** of the documentation from the `gh-pages` branch.
4. **Users access the site** via your custom domain.

## GitHub Actions Workflow

The following GitHub Actions workflow automates the deployment:

```yaml
name: ci
on:
  push:
    branches:
      - master
      - main
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: 3.x
      - uses: actions/cache@v4
        with:
          key: ${{ github.ref }}
          path: .cache
      - run: pip install mkdocs-material
      - run: pip install mkdocs-roamlinks-plugin
      - run: pip install mkdocs-rss-plugin
      - run: mkdocs gh-deploy --force
```

## Key Components

### `mkdocs.yml`

The `mkdocs.yml` file contains configuration settings for the documentation site, including the theme, navigation structure, and plugins.

### `docs/` Directory

All markdown (`.md`) files for the documentation are stored inside the `docs/` folder. MkDocs uses these files to generate the static site.

### `gh-pages` Branch

Once the site is built, MkDocs pushes the generated files to the `gh-pages` branch. GitHub Pages serves the content from this branch. If a `gh-pages` branch doesn't yet exist, a branch will automatically be created by the GitHub action.

### Custom Domain

To make documentation accessible via a custom domain, a `CNAME` file in the `gh-pages` branch is needed to ensure that GitHub Pages serves the site under this domain.

## Troubleshooting

- If the site does not update, check the **GitHub Actions logs** for errors.
- If the site appears without styling, ensure that `mkdocs-material` is installed correctly.
- If the custom domain does not work, verify the `CNAME` file exists in `gh-pages` and that GitHub Pages is configured correctly under **Settings > Pages**.


[^1]: Static-site generation (SSG) is a powerful technology for publishing documentation, offering fast, secure, and scalable websites. It supports embedding various media types, including images, videos, audio, and interactive elements like SVGs or iframes. With Markdown as its primary content format, SSGs provide an accessible syntax that is easy for both technical and non-technical users to learn. Additionally, SSG-based sites can be extended with custom themes, plugins, and integrations, allowing for enhanced functionality tailored to specific documentation needs.