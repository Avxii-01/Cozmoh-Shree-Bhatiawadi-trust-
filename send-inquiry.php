<?php
/**
 * ==============================================================================
 * SHREE BHATIAWADI TRUST — CONTACT & ENQUIRY PROCESSING ENDPOINT
 * ==============================================================================
 * 
 * Production-ready server-side form handler utilizing PHPMailer & Google SMTP.
 * 
 * Features:
 * - Method enforcement (POST only)
 * - Request size & payload sanity limits
 * - Invisible honeypot spam protection
 * - Concurrency-safe atomic rate limiting using flock()
 * - Strict field validation and email injection defense
 * - Safe credential loading (fails gracefully without exposing server internals)
 * - Branded, responsive HTML email template + plain text alternative
 * - Strict JSON responses with standard HTTP status codes
 * ==============================================================================
 */

// Strict error reporting for server logs, but NEVER display errors to HTTP clients
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Set JSON response headers immediately
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

/**
 * Helper function to output JSON response and terminate.
 */
function sendJsonResponse(int $statusCode, string $status, string $message, array $extra = []): void {
    http_response_code($statusCode);
    $payload = array_merge([
        'status'  => $status,
        'message' => $message,
    ], $extra);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// ------------------------------------------------------------------------------
// 1. HTTP METHOD VERIFICATION
// ------------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    sendJsonResponse(405, 'error', 'Method Not Allowed. This endpoint only accepts POST requests.');
}

// ------------------------------------------------------------------------------
// 2. REQUEST SIZE LIMITATION (Max 50 KB)
// ------------------------------------------------------------------------------
$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int)$_SERVER['CONTENT_LENGTH'] : 0;
if ($contentLength > 51200) {
    sendJsonResponse(413, 'error', 'Request entity too large.');
}

// ------------------------------------------------------------------------------
// 3. HONEYPOT SPAM PROTECTION
// ------------------------------------------------------------------------------
// Form includes a hidden field 'trust_inquiry_hp' which must remain blank
if (!empty($_POST['trust_inquiry_hp']) || !empty($_POST['website'])) {
    // Silently reject spam bots with generic bad request
    sendJsonResponse(400, 'error', 'Invalid submission detected.');
}

// ------------------------------------------------------------------------------
// 4. RATE LIMITING WITH FILE LOCKING CONCURRENCY CONTROL
// ------------------------------------------------------------------------------
/**
 * Enforces rate limiting per IP using atomic file locks.
 */
function enforceRateLimit(string $ip, string $storageDir, int $maxAttempts = 5, int $decaySeconds = 600): array {
    if (!is_dir($storageDir)) {
        @mkdir($storageDir, 0750, true);
    }

    // Hash client IP for privacy and clean file names
    $ipHash = hash('sha256', 'sbt_limit_' . $ip);
    $lockFile = $storageDir . '/' . $ipHash . '.lock';
    $dataFile = $storageDir . '/' . $ipHash . '.json';

    $fp = @fopen($lockFile, 'c+');
    if (!$fp) {
        // If file system locking fails, allow request to avoid blocking legitimate users
        return ['allowed' => true, 'retry_after' => 0];
    }

    if (!flock($fp, LOCK_EX)) {
        @fclose($fp);
        return ['allowed' => true, 'retry_after' => 0];
    }

    $now = time();
    $timestamps = [];

    if (file_exists($dataFile)) {
        $raw = @file_get_contents($dataFile);
        if ($raw) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $timestamps = $decoded;
            }
        }
    }

    // Filter out attempts older than the rate limit window
    $cutoff = $now - $decaySeconds;
    $validTimestamps = array_filter($timestamps, function ($ts) use ($cutoff) {
        return is_numeric($ts) && $ts > $cutoff;
    });

    if (count($validTimestamps) >= $maxAttempts) {
        $oldest = min($validTimestamps);
        $retryAfter = max(1, ($oldest + $decaySeconds) - $now);
        flock($fp, LOCK_UN);
        fclose($fp);
        return ['allowed' => false, 'retry_after' => $retryAfter];
    }

    // Append current request timestamp
    $validTimestamps[] = $now;
    @file_put_contents($dataFile, json_encode(array_values($validTimestamps)), LOCK_EX);

    flock($fp, LOCK_UN);
    fclose($fp);

    // Random cleanup of expired files (1 in 50 requests)
    if (mt_rand(1, 50) === 1) {
        $files = @glob($storageDir . '/*.json');
        if ($files) {
            foreach ($files as $f) {
                if (is_file($f) && ($now - @filemtime($f) > 86400)) {
                    @unlink($f);
                    $lock = str_replace('.json', '.lock', $f);
                    if (is_file($lock)) {
                        @unlink($lock);
                    }
                }
            }
        }
    }

    return ['allowed' => true, 'retry_after' => 0];
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$storageDir = __DIR__ . '/storage/rate_limits';
$rateLimit = enforceRateLimit($clientIp, $storageDir, 5, 600);

if (!$rateLimit['allowed']) {
    header('Retry-After: ' . $rateLimit['retry_after']);
    sendJsonResponse(429, 'error', 'Too many enquiry submissions from your network. Please wait a few minutes before trying again, or call the trust office directly at 022-21028801.');
}

// ------------------------------------------------------------------------------
// 5. INPUT EXTRACTION, SANITIZATION & STRICT VALIDATION
// ------------------------------------------------------------------------------

/**
 * Remove newlines, carriage returns, and null bytes to prevent email header injection.
 */
function cleanHeaderString(?string $str): string {
    if ($str === null) {
        return '';
    }
    return trim(str_replace(["\r", "\n", "\0", "%0a", "%0d", "%0A", "%0D"], '', $str));
}

$firstName = cleanHeaderString($_POST['first_name'] ?? '');
$lastName  = cleanHeaderString($_POST['last_name'] ?? '');
$email     = cleanHeaderString($_POST['email'] ?? '');
$phone     = cleanHeaderString($_POST['phone'] ?? '');
$venueName = cleanHeaderString($_POST['venue_name'] ?? '');
$eventType = cleanHeaderString($_POST['event_type'] ?? '');
$message   = trim($_POST['message'] ?? '');

$errors = [];

// First Name validation
if ($firstName === '') {
    $errors[] = 'First name is required.';
} elseif (mb_strlen($firstName) > 60) {
    $errors[] = 'First name cannot exceed 60 characters.';
}

// Last Name validation
if ($lastName === '') {
    $errors[] = 'Last name is required.';
} elseif (mb_strlen($lastName) > 60) {
    $errors[] = 'Last name cannot exceed 60 characters.';
}

// Email validation
if ($email === '') {
    $errors[] = 'Email address is required.';
} elseif (mb_strlen($email) > 120) {
    $errors[] = 'Email address cannot exceed 120 characters.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

// Phone validation (7-30 characters, digits, spaces, plus, hyphens, brackets)
if ($phone === '') {
    $errors[] = 'Phone number is required.';
} elseif (mb_strlen($phone) > 30) {
    $errors[] = 'Phone number cannot exceed 30 characters.';
} elseif (!preg_match('/^[0-9+\s\-().]{7,30}$/', $phone)) {
    $errors[] = 'Please enter a valid phone number.';
}

// Venue Name validation
$validVenues = [
    'Basil Hall',
    'Bayleaf Hall',
    'Thyme Hall',
    'Mint Hall',
];
if ($venueName === '') {
    $errors[] = 'Please select a venue.';
} elseif (mb_strlen($venueName) > 60) {
    $errors[] = 'Venue name cannot exceed 60 characters.';
}

// Event Type validation
$validEventTypes = [
    'Wedding & Reception',
    'Cultural Celebration',
    'Corporate Gala / Meeting',
    'Social Gathering',
    'Anniversary / Birthday',
    'Other Special Event',
];
if ($eventType === '') {
    $errors[] = 'Please select an event type.';
} elseif (mb_strlen($eventType) > 60) {
    $errors[] = 'Event type cannot exceed 60 characters.';
}

// Message validation
if ($message === '') {
    $errors[] = 'Please enter your message or event requirements.';
} elseif (mb_strlen($message) < 5) {
    $errors[] = 'Message must be at least 5 characters long.';
} elseif (mb_strlen($message) > 4000) {
    $errors[] = 'Message cannot exceed 4000 characters.';
}

if (!empty($errors)) {
    sendJsonResponse(400, 'error', $errors[0]);
}

$fullName = $firstName . ' ' . $lastName;

// ------------------------------------------------------------------------------
// 6. LOAD MAIL CONFIGURATION
// ------------------------------------------------------------------------------
define('SBT_MAIL_LOADED', true);
$configPath = __DIR__ . '/config/mail.php';

if (!file_exists($configPath)) {
    error_log('[Shree Bhatiawadi Form] Missing config/mail.php');
    sendJsonResponse(500, 'error', 'Mail configuration is missing. Please contact the trust office directly at 022-21028801.');
}

$mailConfig = require $configPath;

if (empty($mailConfig['password'])) {
    // Credentials have not been configured on the host yet
    error_log('[Shree Bhatiawadi Form] SMTP password is not configured on the server.');
    sendJsonResponse(500, 'error', 'Mail delivery service is temporarily unconfigured. For hall bookings and immediate assistance, please call 022-21028801, WhatsApp +91 70393 27737 / +91 96532 56680, or email shreebhatiawaditrust@gmail.com.');
}

// ------------------------------------------------------------------------------
// 7. LOAD PHPMAILER
// ------------------------------------------------------------------------------
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    error_log('[Shree Bhatiawadi Form] Missing vendor/autoload.php');
    sendJsonResponse(500, 'error', 'Mail dependencies are missing. Please contact the trust administration at 022-21028801.');
}

require_once $autoloadPath;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ------------------------------------------------------------------------------
// 8. COMPOSE EMAIL CONTENT (HTML + PLAIN TEXT)
// ------------------------------------------------------------------------------
$timezone = $mailConfig['timezone'] ?? 'Asia/Kolkata';
date_default_timezone_set($timezone);
$submissionTime = date('d M Y, h:i A T');

// Escape variables for HTML email insertion
$safeFullName  = htmlspecialchars($fullName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail     = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safePhone     = htmlspecialchars($phone, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeVenue     = htmlspecialchars($venueName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEventType = htmlspecialchars($eventType, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage   = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
$cleanPhoneLink = preg_replace('/[^0-9+]/', '', $phone);

// Premium Bhatiawadi HTML Email Template
$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1914; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E6DFD5; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Header Banner (Deep Charcoal #15120F with Gold Accents) -->
          <tr>
            <td style="background-color: #15120F; padding: 32px 30px; text-align: center; border-bottom: 3px solid #C89A4A;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 6px 0; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: #C89A4A; font-weight: 600;">WEBSITE NOTIFICATION</p>
                    <h1 style="margin: 0 0 4px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: normal; color: #FAF7F2; letter-spacing: 0.5px;">SHREE BHATIAWADI TRUST</h1>
                    <p style="margin: 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #D4AF37; opacity: 0.85;">Serving with Devotion</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Title & Timestamp Banner -->
          <tr>
            <td style="background-color: #F8F5EE; padding: 16px 30px; border-bottom: 1px solid #EBDDC4;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h2 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color: #1F1914; font-weight: 600;">New Website Enquiry</h2>
                  </td>
                  <td align="right" style="font-size: 12px; color: #7A6F64;">
                    <strong>Received:</strong> {$submissionTime}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Details -->
          <tr>
            <td style="padding: 28px 30px;">

              <!-- Section 1: Guest Contact Information -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 22px;">
                <tr>
                  <td style="padding-bottom: 8px; border-bottom: 1px solid #C89A4A;">
                    <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #9A7532; font-weight: 700;">1. Guest Contact Information</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="34%" style="font-size: 13px; color: #7A6F64; font-weight: 600; vertical-align: top;">Full Name:</td>
                        <td width="66%" style="font-size: 14px; color: #1F1914; font-weight: 600;">{$safeFullName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #7A6F64; font-weight: 600; vertical-align: top;">Email Address:</td>
                        <td style="font-size: 14px; color: #1F1914;">
                          <a href="mailto:{$safeEmail}" style="color: #9A7532; text-decoration: underline; font-weight: 600;">{$safeEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #7A6F64; font-weight: 600; vertical-align: top;">Phone / Mobile:</td>
                        <td style="font-size: 14px; color: #1F1914;">
                          <a href="tel:{$cleanPhoneLink}" style="color: #1F1914; text-decoration: none; font-weight: 600;">{$safePhone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section 2: Event & Venue Preferences -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 22px;">
                <tr>
                  <td style="padding-bottom: 8px; border-bottom: 1px solid #C89A4A;">
                    <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #9A7532; font-weight: 700;">2. Event &amp; Venue Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="34%" style="font-size: 13px; color: #7A6F64; font-weight: 600; vertical-align: top;">Requested Venue:</td>
                        <td width="66%" style="font-size: 14px; color: #1F1914; font-weight: 600;">
                          <span style="display: inline-block; background-color: #F8F5EE; border: 1px solid #D9CBB7; padding: 3px 10px; border-radius: 4px;">{$safeVenue}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #7A6F64; font-weight: 600; vertical-align: top;">Event Type:</td>
                        <td style="font-size: 14px; color: #1F1914;">
                          <span style="display: inline-block; background-color: #F8F5EE; border: 1px solid #D9CBB7; padding: 3px 10px; border-radius: 4px;">{$safeEventType}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section 3: Message / Special Requirements -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 15px;">
                <tr>
                  <td style="padding-bottom: 8px; border-bottom: 1px solid #C89A4A;">
                    <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #9A7532; font-weight: 700;">3. Message &amp; Requirements</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <div style="background-color: #FAF7F2; border-left: 3px solid #C89A4A; padding: 14px 18px; border-radius: 0 6px 6px 0; font-size: 14px; line-height: 1.6; color: #2C241D; word-break: break-word;">
{$safeMessage}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Safe Reply-To Tip -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #DDD5C7;">
                <tr>
                  <td style="font-size: 12px; color: #7A6F64; line-height: 1.5;">
                    💡 <em>Reply directly to this email to respond to <strong>{$safeFullName}</strong> (<a href="mailto:{$safeEmail}" style="color: #9A7532;">{$safeEmail}</a>).</em>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1F1914; padding: 20px 30px; text-align: center; border-top: 1px solid #332B23;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #D4AF37; font-weight: 500;">Shree Bhatiawadi Trust &bull; Ghatkopar East, Mumbai</p>
              <p style="margin: 0; font-size: 11px; color: #8F8477;">Telephone: 022-21028801 &bull; WhatsApp: +91 70393 27737 / +91 96532 56680 &bull; https://shreebhatiawaditrust.org</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

// Clean Plain-Text Alternative Body
$textBody = <<<TEXT
============================================================
SHREE BHATIAWADI TRUST — NEW WEBSITE ENQUIRY
============================================================
Submitted: {$submissionTime}

1. GUEST CONTACT INFORMATION
------------------------------------------------------------
Full Name:     {$fullName}
Email Address: {$email}
Phone Number:  {$phone}

2. EVENT & VENUE DETAILS
------------------------------------------------------------
Requested Venue: {$venueName}
Event Type:      {$eventType}

3. MESSAGE & REQUIREMENTS
------------------------------------------------------------
{$message}

------------------------------------------------------------
Reply directly to this email to respond to {$fullName} at {$email}.
Shree Bhatiawadi Trust | Serving with Devotion
Phone: 022-21028801 | WhatsApp: +91 70393 27737 / +91 96532 56680
Website: https://shreebhatiawaditrust.org
TEXT;

// ------------------------------------------------------------------------------
// 9. DISPATCH EMAIL VIA GOOGLE SMTP
// ------------------------------------------------------------------------------
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $mailConfig['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $mailConfig['username'];
    $mail->Password   = $mailConfig['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = (int)$mailConfig['port'];
    $mail->CharSet    = 'UTF-8';

    // Timeout settings (suitable for shared hosting)
    $mail->Timeout    = 15;

    // Sender & Recipients
    $mail->setFrom($mailConfig['from_email'], $mailConfig['from_name']);
    $mail->addAddress($mailConfig['to_email'], $mailConfig['to_name']);
    $mail->addReplyTo($email, $fullName);

    // Subject
    $mail->Subject = "New Website Enquiry: {$fullName} — {$venueName} ({$eventType})";

    // Content
    $mail->isHTML(true);
    $mail->Body    = $htmlBody;
    $mail->AltBody = $textBody;

    // Send the email
    $mail->send();

    // Confirmed success response
    sendJsonResponse(
        200,
        'success',
        "Thank you, {$firstName}! Your event enquiry has been sent to the Shree Bhatiawadi Trust administration. We will review your details promptly."
    );

} catch (Exception $e) {
    // Log exception details privately in server error log
    error_log('[Shree Bhatiawadi Form] PHPMailer Error: ' . $mail->ErrorInfo);

    // Return generic, reassuring error without exposing stack traces or SMTP credentials
    sendJsonResponse(
        500,
        'error',
        'We were unable to deliver your message right now due to a temporary mail server issue. For immediate assistance or hall bookings, please call 022-21028801 or WhatsApp +91 70393 27737 / +91 96532 56680 directly.'
    );
} catch (\Throwable $t) {
    error_log('[Shree Bhatiawadi Form] Unexpected Error: ' . $t->getMessage());
    sendJsonResponse(
        500,
        'error',
        'An unexpected error occurred while processing your enquiry. Please contact the trust directly at 022-21028801.'
    );
}
