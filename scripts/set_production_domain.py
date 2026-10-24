"""
Centralized Production Domain & SEO URL Configuration Script
Usage:
    python scripts/set_production_domain.py [NEW_BASE_URL]

Examples:
    python scripts/set_production_domain.py https://shreebhatiawaditrust.org/
"""

import sys
import os
import re

# Workspace root
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Default confirmed production URL
DEFAULT_BASE_URL = "https://shreebhatiawaditrust.org/"

PUBLIC_PAGES = [
    ("index.html", "1.0", "weekly"),
    ("about.html", "0.8", "monthly"),
    ("history.html", "0.8", "monthly"),
    ("banquet-halls.html", "0.9", "weekly"),
    ("cultural-forum.html", "0.8", "weekly"),
    ("trustees.html", "0.8", "monthly"),
    ("contact.html", "0.9", "monthly"),
    ("privacy.html", "0.5", "yearly"),
    ("terms.html", "0.5", "yearly"),
]

def update_production_urls(base_url):
    if not base_url.endswith("/"):
        base_url += "/"

    print(f"Applying Production Base URL: {base_url}")
    
    # 1. Update robots.txt
    robots_path = os.path.join(WORKSPACE_DIR, "robots.txt")
    sitemap_url = f"{base_url}sitemap.xml"
    robots_content = f"User-agent: *\nAllow: /\n\nSitemap: {sitemap_url}\n"
    with open(robots_path, "w", encoding="utf-8") as f:
        f.write(robots_content)
    print("  [OK] Updated robots.txt")

    # 2. Update sitemap.xml
    sitemap_path = os.path.join(WORKSPACE_DIR, "sitemap.xml")
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for page, priority, changefreq in PUBLIC_PAGES:
        clean_name = "" if page == "index.html" else page.replace(".html", "")
        page_url = f"{base_url}{clean_name}"
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{page_url}</loc>")
        xml_lines.append(f"    <changefreq>{changefreq}</changefreq>")
        xml_lines.append(f"    <priority>{priority}</priority>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>\n")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml_lines))
    print("  [OK] Updated sitemap.xml")

    # 3. Update HTML files
    html_files = [p[0] for p in PUBLIC_PAGES]
    logo_url = f"{base_url}assets/logo/sbt-logo.png"

    # Regex patterns to replace canonical and social URLs
    canonical_pattern = re.compile(r'<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']+["\']', re.IGNORECASE)
    og_url_pattern = re.compile(r'<meta\s+property=["\']og:url["\']\s+content=["\'][^"\']+["\']', re.IGNORECASE)
    og_img_pattern = re.compile(r'<meta\s+property=["\']og:image["\']\s+content=["\'][^"\']+["\']', re.IGNORECASE)
    tw_img_pattern = re.compile(r'<meta\s+name=["\']twitter:image["\']\s+content=["\'][^"\']+["\']', re.IGNORECASE)

    for html_file in html_files:
        file_path = os.path.join(WORKSPACE_DIR, html_file)
        if not os.path.exists(file_path):
            continue
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        clean_slug = "" if html_file == "index.html" else html_file.replace(".html", "")
        page_url = f"{base_url}{clean_slug}"
        new_canonical = f'<link rel="canonical" href="{page_url}"'
        new_og_url = f'<meta property="og:url" content="{page_url}"'
        new_og_img = f'<meta property="og:image" content="{logo_url}"'
        new_tw_img = f'<meta name="twitter:image" content="{logo_url}"'

        content = canonical_pattern.sub(new_canonical, content)
        content = og_url_pattern.sub(new_og_url, content)
        content = og_img_pattern.sub(new_og_img, content)
        content = tw_img_pattern.sub(new_tw_img, content)

        # Update JSON-LD structured data URLs if present
        content = re.sub(
            r'("url":\s*")https://[^"]+(")',
            f'\\1{base_url}\\2',
            content
        )
        content = re.sub(
            r'("logo":\s*")https://[^"]+(")',
            f'\\1{logo_url}\\2',
            content
        )
        content = re.sub(
            r'("image":\s*")https://[^"]+(")',
            f'\\1{logo_url}\\2',
            content
        )

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  [OK] Updated {html_file}")

    print("All production URLs updated successfully.")

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BASE_URL
    update_production_urls(target_url)
