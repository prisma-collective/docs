import os
import re

def strip_frontmatter(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Use regex to strip out the frontmatter (between ---)
    stripped_content = re.sub(r'^---\s*\n(.+?)\n---\s*\n', '', content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(stripped_content)

def strip_frontmatter_from_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                strip_frontmatter(file_path)

# Example usage: Strip frontmatter from all markdown files in the current directory
strip_frontmatter_from_files(".")
