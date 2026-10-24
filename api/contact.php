<?php
/**
 * ==============================================================================
 * SHREE BHATIAWADI TRUST — API ALIAS ENDPOINT (api/contact.php)
 * ==============================================================================
 * Provides architectural compatibility with the CrewiiFY api/contact.php convention.
 * Delegates execution directly to the root send-inquiry.php handler.
 * ==============================================================================
 */

require_once dirname(__DIR__) . '/send-inquiry.php';
