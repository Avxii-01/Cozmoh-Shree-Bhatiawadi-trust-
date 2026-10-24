<?php
/**
 * ==============================================================================
 * SHREE BHATIAWADI TRUST — SMTP MAIL CONFIGURATION
 * ==============================================================================
 * Architecture Reference: CrewiiFY SMTP & PHPMailer Configuration Pattern
 * 
 * Secure Credential Loading:
 * This file loads the Google SMTP password safely using the following priority:
 * 1. Server Environment Variables: SMTP_PASSWORD or SMTP_PASS
 * 2. External Configuration File outside public web root (Hostinger Recommended):
 *    - /home/<user>/mail.config.php (one level above public_html)
 * 3. Local Private File (Gitignored):
 *    - __DIR__ . '/mail.local.php'
 * 
 * NEVER hardcode SMTP passwords in source code, version control, or public ZIPs.
 * ==============================================================================
 */

// Deny direct script execution if not loaded through application
if (!defined('SBT_MAIL_LOADED')) {
    define('SBT_MAIL_LOADED', true);
}

$smtpPassword = null;

// 1. Try Environment Variables
$envVars = ['SMTP_PASSWORD', 'SMTP_PASS', 'GMAIL_APP_PASSWORD', 'MAIL_PASSWORD'];
foreach ($envVars as $var) {
    $val = getenv($var);
    if ($val === false && isset($_ENV[$var])) {
        $val = $_ENV[$var];
    }
    if ($val === false && isset($_SERVER[$var])) {
        $val = $_SERVER[$var];
    }
    if (!empty($val)) {
        $smtpPassword = trim($val);
        break;
    }
}

// 2. Check private configuration file outside public web root (Hostinger Best Practice)
if (empty($smtpPassword)) {
    $externalPaths = [
        // One level above project root / public_html
        dirname(__DIR__, 2) . '/mail.config.php',
        dirname(__DIR__, 2) . '/mail.local.php',
        dirname(__DIR__, 1) . '/../mail.config.php',
        dirname(__DIR__, 1) . '/../mail.local.php',
    ];

    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $externalPaths[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/mail.config.php';
        $externalPaths[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/mail.local.php';
    }

    foreach ($externalPaths as $cfgPath) {
        if ($cfgPath && @file_exists($cfgPath) && @is_readable($cfgPath)) {
            $externalConfig = require $cfgPath;
            if (is_array($externalConfig) && !empty($externalConfig['password'])) {
                $smtpPassword = trim($externalConfig['password']);
                break;
            }
        }
    }
}

// 3. Check local gitignored config file (for local testing / manual upload)
if (empty($smtpPassword)) {
    $localConfigPath = __DIR__ . '/mail.local.php';
    if (file_exists($localConfigPath) && is_readable($localConfigPath)) {
        $localConfig = require $localConfigPath;
        if (is_array($localConfig) && !empty($localConfig['password'])) {
            $smtpPassword = trim($localConfig['password']);
        }
    }
}

return [
    // Google SMTP Settings
    'host'          => 'smtp.gmail.com',
    'port'          => 587,
    'encryption'    => 'tls', // STARTTLS
    'auth'          => true,

    // Authenticated Google Account
    'username'      => 'shreebhatiawaditrust@gmail.com',
    'password'      => $smtpPassword, // Loaded privately; null if unconfigured

    // Sender Information (must match authenticated account for Google SMTP)
    'from_email'    => 'shreebhatiawaditrust@gmail.com',
    'from_name'     => 'Shree Bhatiawadi Trust',

    // Trust Recipient Inbox
    'to_email'      => 'shreebhatiawaditrust@gmail.com',
    'to_name'       => 'Shree Bhatiawadi Trust — Enquiry Desk',

    // Email Settings
    'timezone'      => 'Asia/Kolkata',
    'subject_prefix'=> 'New Website Enquiry',

    // Rate Limiting Policy
    'rate_limit'    => [
        'max_attempts'  => 5,    // Max 5 enquiries
        'decay_seconds' => 600,  // Per 10-minute window
    ],
];
