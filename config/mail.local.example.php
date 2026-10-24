<?php
/**
 * ==============================================================================
 * SHREE BHATIAWADI TRUST — LOCAL / PRIVATE MAIL CONFIGURATION TEMPLATE
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR HOSTINGER / PRODUCTION:
 * 
 * RECOMMENDED METHOD (Outside public_html):
 * 1. Log in to Hostinger File Manager or SSH.
 * 2. Navigate one level ABOVE public_html (e.g., /home/uXXXXXXXXX/).
 * 3. Create a file named "mail.config.php" with the contents below.
 * 4. Replace YOUR_GOOGLE_APP_PASSWORD_HERE with your 16-character Google App Password.
 * 
 * ALTERNATIVE METHOD (Inside config directory):
 * 1. Copy this file to "config/mail.local.php".
 * 2. Set your 16-character password below.
 * 3. The file "config/mail.local.php" is gitignored and excluded from ZIP packaging.
 * 
 * GENERATING A GOOGLE APP PASSWORD:
 * 1. Log in to the official Google account: shreebhatiawaditrust@gmail.com
 * 2. Go to: https://myaccount.google.com/security
 * 3. Under 'How you sign in to Google', ensure 2-Step Verification is active.
 * 4. Search for 'App passwords'.
 * 5. Enter 'Shree Bhatiawadi Website' as the app name and click Create.
 * 6. Paste the generated 16-character code below (no spaces).
 * ==============================================================================
 */

return [
    'password' => 'YOUR_GOOGLE_APP_PASSWORD_HERE',
];
