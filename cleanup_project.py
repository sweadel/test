import os
import re
import shutil
from datetime import datetime, timedelta

# Directory to clean
directory = '.'

# Define the age threshold for files (e.g., files older than this will be deleted)
age_threshold = timedelta(days=30)

# Function to remove HTTrack artifacts
def remove_httrack_artifacts(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.htm') or file.endswith('.html'):
                os.remove(os.path.join(root, file))

# Function to clean HTML files
def clean_html_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                with open(os.path.join(root, file), 'r+', encoding='utf-8', errors='replace') as f:
                    content = f.read()
                    # Example cleanup: Remove script and style tags
                    content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
                    content = re.sub(r'<style.*?</style>', '', content, flags=re.DOTALL)
                    f.seek(0)
                    f.write(content)
                    f.truncate()

# Function to fix file encodings
def fix_encoding(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html') or file.endswith('.htm'):
                with open(os.path.join(root, file), 'r', encoding='latin-1') as f:
                    content = f.read()
                with open(os.path.join(root, file), 'w', encoding='utf-8') as f:
                    f.write(content)

# Function to remove files older than age_threshold
def remove_old_files(directory):
    now = datetime.now()
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if os.path.getmtime(file_path) < (now - age_threshold).timestamp():
                os.remove(file_path)

if __name__ == '__main__':
    remove_httrack_artifacts(directory)
    clean_html_files(directory)
    fix_encoding(directory)
    remove_old_files(directory)
    print('Cleanup completed!')