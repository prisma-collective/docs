import requests
import json
import time
from datetime import datetime, timezone
from collections import defaultdict

# GitHub Repo Details
OWNER = "prisma-collective"
REPO = "docs"
GITHUB_API_URL = f"https://api.github.com/repos/{OWNER}/{REPO}/stats/contributors"
HEADERS = {"Accept": "application/vnd.github.v3+json"}

def fetch_contributor_stats():
    """Fetch contributor commit history, retrying if data is not ready."""
    for attempt in range(10):  # Retry up to 10 times
        response = requests.get(GITHUB_API_URL, headers=HEADERS)

        if response.status_code == 200:
            return response.json()  # Data is ready, return it
        elif response.status_code == 202:
            print(f"⏳ GitHub is generating the stats (attempt {attempt + 1}/10)...")
            time.sleep(10)  # Wait before retrying
        else:
            print(f"Error fetching data: {response.status_code} - {response.text}")
            return None

    print("Giving up after 10 attempts. Try again later.")
    return None

def aggregate_commits_by_month(contributor_data):
    """Convert weekly commit history into monthly aggregated data."""
    contributors = []

    for contributor in contributor_data:
        username = contributor["author"]["login"]

        # Filter out bot accounts by checking if '[bot]' is part of the username
        if '[bot]' in username:
            print(f"Skipping bot contributor: {username}")
            continue

        history = defaultdict(int)  # { "YYYY-MM": commit_count }

        for week in contributor["weeks"]:
            timestamp = week["w"]  # Start of the week (Unix timestamp)
            commits = week["c"]

            # Convert timestamp to YYYY-MM format
            # Using timezone-aware datetime to avoid deprecation warning
            dt = datetime.fromtimestamp(timestamp, timezone.utc)
            month = dt.strftime("%Y-%m")
            history[month] += commits  # Aggregate commits per month

        # Convert defaultdict to list format for JSON storage
        history_list = [{"month": month, "commits": commits} for month, commits in sorted(history.items())]

        contributors.append({"user": username, "history": history_list})

    return contributors

def save_contributions_json(data, filename="docs/contributions.json"):
    """Save the contributor history to a JSON file."""
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Contributions data saved to {filename}")

if __name__ == "__main__":
    raw_data = fetch_contributor_stats()
    if raw_data:
        structured_data = aggregate_commits_by_month(raw_data)
        save_contributions_json(structured_data)
