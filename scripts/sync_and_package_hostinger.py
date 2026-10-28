import os
import shutil
import zipfile
import re
import sys

WORKSPACE = r"d:\Cozmoh\Shree_Bhatiawadi_tryout new things"
DEPLOY_DIR = os.path.join(WORKSPACE, "hostinger_deploy")
ZIP_PATH = os.path.join(WORKSPACE, "hostinger_deploy.zip")

FILES_TO_COPY = [
    ".htaccess",
    "404.html",
    "about.html",
    "banquet-halls.html",
    "cultural-forum.html",
    "history.html",
    "index.html",
    "privacy.html",
    "terms.html",
    "trustees.html",
    "contact.html",
    "favicon.ico",
    "favicon.png",
    "robots.txt",
    "sitemap.xml",
    "send-inquiry.php",
    "composer.json",
    "composer.lock",
]

DIRS_TO_COPY = [
    "css",
    "js",
    "assets",
    "config",
    "storage",
    "api",
    "vendor",
]

FORBIDDEN_FILES = [
    ".env",
    "mail.local.php",
    "mail.config.php",
    ".git",
    ".gitignore",
    ".vscode",
]

def sync():
    print("=== Step 1: Synchronizing workspace to hostinger_deploy/ ===")
    os.makedirs(DEPLOY_DIR, exist_ok=True)

    # Copy individual root files
    for fname in FILES_TO_COPY:
        src = os.path.join(WORKSPACE, fname)
        dst = os.path.join(DEPLOY_DIR, fname)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  [Copied File] {fname}")
        else:
            print(f"  [Warning] Missing source file {fname}")

    # Copy directories
    for dname in DIRS_TO_COPY:
        src = os.path.join(WORKSPACE, dname)
        dst = os.path.join(DEPLOY_DIR, dname)
        if os.path.exists(src):
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns('.git*', '*.pyc', '__pycache__', '.env*', 'mail.local.php'))
            print(f"  [Copied Dir] {dname}/")
        else:
            print(f"  [Warning] Missing source dir {dname}")

    print("Synchronization complete.\n")

def audit_deploy_dir():
    print("=== Step 2: Auditing hostinger_deploy/ ===")
    # Check for forbidden files
    for root, dirs, files in os.walk(DEPLOY_DIR):
        for f in files:
            for forbidden in FORBIDDEN_FILES:
                if f == forbidden or f.startswith(".env") or f.endswith(".local.php"):
                    if f != "mail.local.example.php":
                        raise Exception(f"SECURITY ALERT: Found forbidden file {os.path.join(root, f)}")

    # Check 2024 dates in deploy dir
    print("  Checking for old 2024 dates...")
    found_2024 = False
    for root, dirs, files in os.walk(DEPLOY_DIR):
        if "vendor" in root:
            continue
        for f in files:
            if f.endswith((".html", ".js", ".css")):
                fpath = os.path.join(root, f)
                with open(fpath, "r", encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
                    matches = re.findall(r'.{0,30}2024.{0,30}', content)
                    if matches:
                        print(f"  [WARN] Found 2024 in {os.path.relpath(fpath, DEPLOY_DIR)}: {matches[:3]}")
                        found_2024 = True

    if not found_2024:
        print("  [OK] No 2024 dates found in production deploy files.")

    # Check footer credit and contact details across all 10 html pages
    html_pages = [
        "index.html", "about.html", "banquet-halls.html", "cultural-forum.html",
        "history.html", "trustees.html", "contact.html", "privacy.html",
        "terms.html", "404.html"
    ]
    for page in html_pages:
        p_path = os.path.join(DEPLOY_DIR, page)
        with open(p_path, "r", encoding="utf-8") as fh:
            content = fh.read()
            if "Designed by Itsuki" not in content:
                raise Exception(f"Missing 'Designed by Itsuki' in {page}")
            if "https://itsuki.co.in/" not in content:
                raise Exception(f"Missing link 'https://itsuki.co.in/' in {page}")
            if "2026 Shree Bhatiawadi Trust" not in content:
                raise Exception(f"Missing '2026 Shree Bhatiawadi Trust' in {page}")

            # Verify both WhatsApp numbers
            if "https://wa.me/917039327737" not in content:
                raise Exception(f"Missing WhatsApp 1 link (https://wa.me/917039327737) in {page}")
            if "https://wa.me/919653256680" not in content:
                raise Exception(f"Missing WhatsApp 2 link (https://wa.me/919653256680) in {page}")

            # Verify unchanged telephone number
            if "tel:02221028801" not in content or "022-21028801" not in content:
                raise Exception(f"Missing telephone 022-21028801 in {page}")

            # Verify standardized Ghatkopar address
            if "Shree Bhatia wadi trust, Vithal Baug" not in content or "Tilak road, Ghatkopar (east)" not in content or "400077" not in content:
                raise Exception(f"Missing standardized address in {page}")

    print("  [OK] All 10 HTML pages verified for 'Designed by Itsuki', link, 2026 copyright, both WhatsApp numbers, telephone, and Ghatkopar address.")

    # Check that old phone numbers and old addresses are completely absent
    print("  Checking for old WhatsApp number and old Kalbadevi address in deploy files...")
    for root, dirs, files in os.walk(DEPLOY_DIR):
        if "vendor" in root:
            continue
        for f in files:
            if f.endswith((".html", ".js", ".css", ".php")):
                fpath = os.path.join(root, f)
                with open(fpath, "r", encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
                    if "7506433819" in content or "75064 33819" in content:
                        raise Exception(f"Found old WhatsApp number in {os.path.relpath(fpath, DEPLOY_DIR)}")
                    if "Kalbadevi" in content:
                        raise Exception(f"Found old Kalbadevi address in {os.path.relpath(fpath, DEPLOY_DIR)}")
                    if "400002" in content:
                        raise Exception(f"Found old postal code 400002 in {os.path.relpath(fpath, DEPLOY_DIR)}")
    print("  [OK] Confirmed zero references to old WhatsApp number (7506433819) and old address (Kalbadevi, 400002).")

    # Check events.js
    events_js_path = os.path.join(DEPLOY_DIR, "js", "events.js")
    with open(events_js_path, "r", encoding="utf-8") as fh:
        ev_content = fh.read()
        if "OCTOBER 11–19, 2026" not in ev_content:
            raise Exception("Missing Navratri 2026 dates in hostinger_deploy/js/events.js")
        if "NOVEMBER 08, 2026" not in ev_content:
            raise Exception("Missing Diwali 2026 date in hostinger_deploy/js/events.js")
        if "COMING SOON" not in ev_content:
            raise Exception("Missing COMING SOON status in hostinger_deploy/js/events.js")
    print("  [OK] hostinger_deploy/js/events.js contains verified 2026 event data.")

    # Check footer.css
    footer_css_path = os.path.join(DEPLOY_DIR, "css", "footer.css")
    with open(footer_css_path, "r", encoding="utf-8") as fh:
        ft_content = fh.read()
        if ".footer__credit" not in ft_content:
            raise Exception("Missing .footer__credit styles in hostinger_deploy/css/footer.css")
        if "grid-template-columns: 1fr auto 1fr;" not in ft_content:
            raise Exception("Missing 3-column desktop layout in hostinger_deploy/css/footer.css")
    print("  [OK] hostinger_deploy/css/footer.css contains verified styles.")

def create_and_verify_zip():
    print("\n=== Step 3: Packaging hostinger_deploy.zip ===")
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(DEPLOY_DIR):
            for file in files:
                abs_file = os.path.join(root, file)
                rel_path = os.path.relpath(abs_file, DEPLOY_DIR)
                # Ensure forward slashes in zip
                zip_path = rel_path.replace(os.sep, '/')
                zf.write(abs_file, zip_path)

    zip_size_bytes = os.path.getsize(ZIP_PATH)
    zip_size_mb = zip_size_bytes / (1024 * 1024)
    print(f"  [OK] Created ZIP: {ZIP_PATH}")
    print(f"  [OK] ZIP Size: {zip_size_bytes:,} bytes ({zip_size_mb:.2f} MB)")

    print("\n=== Step 4: Verifying hostinger_deploy.zip integrity & contents ===")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zf:
        # 1. Test zip integrity
        bad_file = zf.testzip()
        if bad_file:
            raise Exception(f"ZIP integrity check FAILED on file: {bad_file}")
        print("  [OK] Zip testzip() integrity test PASSED.")

        namelist = zf.namelist()

        # 2. Check root-level required files
        if "index.html" not in namelist:
            raise Exception("ZIP root missing index.html")
        if ".htaccess" not in namelist:
            raise Exception("ZIP root missing .htaccess")
        print("  [OK] Root-level index.html and .htaccess confirmed present.")

        # 3. Check all 10 pages in zip
        html_pages = [
            "index.html", "about.html", "banquet-halls.html", "cultural-forum.html",
            "history.html", "trustees.html", "contact.html", "privacy.html",
            "terms.html", "404.html"
        ]
        for page in html_pages:
            if page not in namelist:
                raise Exception(f"ZIP missing page: {page}")
            # Verify content inside zip
            with zf.open(page) as f:
                c = f.read().decode('utf-8', errors='ignore')
                if "Designed by Itsuki" not in c:
                    raise Exception(f"ZIP content check failed: 'Designed by Itsuki' not found in {page}")
                if "2026 Shree Bhatiawadi Trust" not in c:
                    raise Exception(f"ZIP content check failed: '2026 Shree Bhatiawadi Trust' not found in {page}")
                if "https://wa.me/917039327737" not in c:
                    raise Exception(f"ZIP content check failed: WhatsApp 1 link missing in {page}")
                if "https://wa.me/919653256680" not in c:
                    raise Exception(f"ZIP content check failed: WhatsApp 2 link missing in {page}")
                if "tel:02221028801" not in c or "022-21028801" not in c:
                    raise Exception(f"ZIP content check failed: Telephone 022-21028801 missing in {page}")
                if "Shree Bhatia wadi trust, Vithal Baug" not in c or "Tilak road, Ghatkopar (east)" not in c or "400077" not in c:
                    raise Exception(f"ZIP content check failed: Ghatkopar address missing in {page}")

        print("  [OK] All 10 HTML pages in ZIP verified for Itsuki credit, 2026 copyright, both WhatsApp links, telephone, and Ghatkopar address.")

        # 4. Check events.js in zip
        if "js/events.js" not in namelist:
            raise Exception("ZIP missing js/events.js")
        with zf.open("js/events.js") as f:
            ev_c = f.read().decode('utf-8', errors='ignore')
            if "OCTOBER 11–19, 2026" not in ev_c or "NOVEMBER 08, 2026" not in ev_c or "COMING SOON" not in ev_c:
                raise Exception("ZIP js/events.js missing required 2026 event updates")
        print("  [OK] ZIP js/events.js contains verified 2026 event updates.")

        # 5. Check PHPMailer & PHP scripts
        if "send-inquiry.php" not in namelist:
            raise Exception("ZIP missing send-inquiry.php")
        if "vendor/autoload.php" not in namelist:
            raise Exception("ZIP missing vendor/autoload.php")
        if "vendor/phpmailer/phpmailer/src/PHPMailer.php" not in namelist:
            raise Exception("ZIP missing PHPMailer library")
        print("  [OK] PHP form files and PHPMailer dependencies confirmed inside ZIP.")

        # 6. Check for secrets/forbidden files in ZIP
        for name in namelist:
            base = os.path.basename(name)
            if base.startswith(".env") or (base.endswith(".local.php") and base != "mail.local.example.php"):
                raise Exception(f"SECURITY ALERT: Secret file found inside ZIP: {name}")
        print("  [OK] No secrets or .env files found in ZIP.")

        # 7. Check for absence of old numbers in ZIP
        for name in namelist:
            if "vendor/" in name:
                continue
            if name.endswith((".html", ".js", ".css", ".php")):
                with zf.open(name) as f:
                    c = f.read().decode('utf-8', errors='ignore')
                    if "7506433819" in c or "75064 33819" in c:
                        raise Exception(f"Old WhatsApp number found inside ZIP: {name}")
                    if "Kalbadevi" in c:
                        raise Exception(f"Old Kalbadevi address found inside ZIP: {name}")
                    if "400002" in c:
                        raise Exception(f"Old postal code 400002 found inside ZIP: {name}")
        print("  [OK] Confirmed zero old contact/address references inside ZIP.")

    print("\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    sync()
    audit_deploy_dir()
    create_and_verify_zip()
