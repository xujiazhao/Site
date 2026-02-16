import csv
import os
import shutil
import urllib.parse
import re
import datetime

# Configuration
SOURCE_ROOT = "Notion Version/许嘉昭 Jiazhao Xu"
DEST_CONTENT_ROOT = "content"
DEST_PUBLIC_ROOT = "public"
ASSETS_DIR_NAME = "assets/blog"

# Mappings
CATEGORY_MAPPING = {
    "经历 Experience": "experience",
    "项目 Project": "project",
    "写作 Writing": "writing",
    "创作 Creation": "creation"
}

# CSV Filenames
CSV_FILES = {
    "经历 Experience": "经历 Experience 11e0fa8878394b8eb15f0ffeef61ab1c_all.csv",
    "项目 Project": "项目 Project 98b140efc0554f328ccc6237250a791d_all.csv",
    "写作 Writing": "写作 Writing 37e2c53e1215443b83cd7a443a130d2a_all.csv",
    "创作 Creation": "创作 Creation e90164d45cb74a44b0277cc13155be57_all.csv"
}

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\u4e00-\u9fa5]+', '-', text) # Keep chinese chars
    text = text.strip('-')
    return text

def parse_date(date_str):
    if not date_str:
        return datetime.date.today().isoformat()
    try:
        # March 14, 2022
        try:
             dt = datetime.datetime.strptime(date_str, "%B %d, %Y")
             return dt.date().isoformat()
        except ValueError:
             pass

        # 2023.1
        if re.match(r'\d{4}\.\d{1,2}', date_str):
             parts = date_str.split('.')
             return f"{parts[0]}-{int(parts[1]):02d}-01"
        
        # 2023/1/1 or similar
        if '/' in date_str:
             parts = date_str.split('/')
             return f"{parts[0]}-{int(parts[1]):02d}-{int(parts[2]):02d}"
             
    except:
        pass
    return date_str

def move_asset(source_path, dest_rel_path):
    full_dest_path = os.path.join(DEST_PUBLIC_ROOT, dest_rel_path)
    ensure_dir(os.path.dirname(full_dest_path))
    
    if os.path.exists(source_path):
        shutil.copy2(source_path, full_dest_path)
        return "/" + dest_rel_path
    else:
        return None

def process_markdown_content(content, source_dir, slug, category):
    
    def replace_image(match):
        alt = match.group(1)
        path = match.group(2)
        
        # Decode path
        decoded_path = urllib.parse.unquote(path)
        
        # Skip http/https links
        if decoded_path.startswith('http://') or decoded_path.startswith('https://'):
             return match.group(0)

        # Determine source path
        # Notion export images usually relative to the text file
        image_source_path = os.path.join(source_dir, decoded_path)
        
        # New filename
        ext = os.path.splitext(decoded_path)[1]
        if not ext:
            ext = ".png" # fallback

        # To avoid collisions, use slug prefix
        safe_filename = f"{slug}-{os.path.basename(decoded_path).replace(' ', '_')}"
        dest_rel_path = os.path.join(ASSETS_DIR_NAME, category, slug, safe_filename)
        
        new_path = move_asset(image_source_path, dest_rel_path)
        
        if new_path:
            return f"![{alt}]({new_path})"
        else:
             print(f"Warning: Image asset not found: {image_source_path}")
             
        return match.group(0)

    return re.sub(r'!\[(.*?)\]\((.*?)\)', replace_image, content)

def find_markdown_file(folder_path, name):
    if not os.path.exists(folder_path):
        return None
        
    safe_name = name.replace('/', ' ').replace(':', ' ').strip()
    
    candidates = []
    try:
        for filename in os.listdir(folder_path):
            if filename.endswith(".md"):
                if filename.startswith(safe_name):
                     candidates.append(filename)
    except FileNotFoundError:
        return None
    
    if candidates:
        return os.path.join(folder_path, candidates[0])
    return None

def main():
    for category_name, category_slug in CATEGORY_MAPPING.items():
        print(f"Processing category: {category_name} -> {category_slug}")
        
        csv_filename = CSV_FILES.get(category_name)
        csv_path = os.path.join(SOURCE_ROOT, csv_filename)
        if not os.path.exists(csv_path):
            print(f"CSV file not found: {csv_path}")
            continue

        category_dir = os.path.join(SOURCE_ROOT, category_name)

        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                name = row.get('Name', '').strip()
                if not name:
                    continue
                
                # Language
                lang_raw = row.get('Language', '').strip()
                if not lang_raw:
                     lang = 'en'
                else:
                     lang = 'zh' if '中文' in lang_raw else 'en'
                
                slug = slugify(name)
                
                # Metadata
                date_str = row.get('Date') or row.get('Created', '')
                location_date = row.get('Location & Date', '')
                
                final_date = datetime.date.today().isoformat()
                location = ""
                
                if date_str:
                     final_date = parse_date(date_str)
                elif location_date:
                    date_match = re.search(r'(\d{4}(?:\.\d{1,2})?)', location_date)
                    if date_match:
                        date_part = date_match.group(1)
                        if '.' in date_part:
                            y, m = date_part.split('.')
                            final_date = f"{y}-{int(m):02d}-01"
                        else:
                            final_date = f"{date_part}-01-01"
                        location = location_date.replace(date_part, '').strip()
                    else:
                        location = location_date
                
                intro = row.get('Intro', '').strip()
                type_ = row.get('Type', '').strip()
                
                area_raw = row.get('Area', '')
                area_parts = [a.strip() for a in area_raw.split(',')] if area_raw else []
                # Format area as JSON array string for frontmatter
                area_str = str(area_parts).replace("'", '"')
                    
                skill = []
                tags_raw = row.get('Tags', '')
                if tags_raw:
                    tags_list = [t.strip() for t in tags_raw.split(',')]
                    if category_slug == 'creation':
                        skill = tags_list

                skill_str = str(skill).replace("'", '"')

                sorting = row.get('Sorting', '')
                
                # Cover Image
                cover_raw = row.get('Cover', '')
                cover_image_path = ""
                if cover_raw:
                    decoded_cover = urllib.parse.unquote(cover_raw)
                    # "许嘉昭 Jiazhao Xu/file.png"
                    # Relative to "Notion Version/"
                    source_cover_path = os.path.join("Notion Version", decoded_cover)
                    
                    if os.path.exists(source_cover_path):
                        ext = os.path.splitext(source_cover_path)[1]
                        if not ext: ext = ".png" # Fallback
                        safe_cover_name = f"cover{ext}"
                        dest_rel_path = os.path.join(ASSETS_DIR_NAME, category_slug, slug, safe_cover_name)
                        cover_image_path = move_asset(source_cover_path, dest_rel_path)
                    else:
                        print(f"Cover image not found: {source_cover_path}")

                # Find Markdown Content
                md_path = find_markdown_file(category_dir, name)
                content = ""
                if md_path:
                    try:
                        with open(md_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        md_dir = os.path.dirname(md_path)
                        content = process_markdown_content(content, md_dir, slug, category_slug)
                        
                    except Exception as e:
                        print(f"Error reading MD {md_path}: {e}")
                
                # Create Frontmatter
                frontmatter = "---\n"
                frontmatter += f"title: \"{name}\"\n"
                frontmatter += f"date: \"{final_date}\"\n"
                if cover_image_path:
                    frontmatter += f"coverImage: \"{cover_image_path}\"\n"
                if intro:
                    frontmatter += f"intro: \"{intro}\"\n"
                if type_:
                    frontmatter += f"type: \"{type_}\"\n"
                if area_parts:
                     frontmatter += f"area: {area_str}\n"
                if location:
                    frontmatter += f"location: \"{location}\"\n"
                if skill and category_slug == 'creation':
                    frontmatter += f"skill: {skill_str}\n"
                if sorting:
                     frontmatter += f"sorting: {sorting}\n"
                frontmatter += "---\n\n"
                
                final_content = frontmatter + content
                
                # Write to destination
                dest_dir = os.path.join(DEST_CONTENT_ROOT, lang, category_slug)
                ensure_dir(dest_dir)
                dest_file_path = os.path.join(dest_dir, f"{slug}.md")
                
                with open(dest_file_path, 'w', encoding='utf-8') as f:
                    f.write(final_content)
                
                print(f"Generated: {dest_file_path}")

if __name__ == "__main__":
    main()
