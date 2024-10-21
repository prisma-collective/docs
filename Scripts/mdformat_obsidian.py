import re
import mdformat

# Function to detect and separate frontmatter from content
def split_frontmatter_and_content(text):
    frontmatter_match = re.match(r'^---\s*\n(.+?)\n---\s*\n', text, re.DOTALL)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(0)
        content = text[len(frontmatter):].strip()
        return frontmatter, content
    else:
        return None, text

def unescape_obsidian_links(text):
    text = re.sub(r'\\\[\[', '[[', text)
    text = re.sub(r'\\\]\]', ']]', text)
    return text

# Plugin entry point
def format_markdown(text, options=None):
    frontmatter, content = split_frontmatter_and_content(text)

    # Format the content (without frontmatter)
    formatted_content = mdformat.text(content, options=options)
    
    # Unescape Obsidian links
    formatted_content = unescape_obsidian_links(formatted_content)
    
    # If frontmatter exists, return it with formatted content, otherwise just return formatted content
    if frontmatter:
        return f"{frontmatter}\n\n{formatted_content}"
    else:
        return formatted_content
