<?php
// Simple PHP Router and API Endpoint
// Run with: php -S localhost:5000 php_server.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs";
$RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4";

$base_dir = dirname(__DIR__); // Point to root

// API Routing
if ($method === 'POST' && strpos($request_uri, '/api/payment/create-order') === 0) {
    header('Content-Type: application/json');
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    $amount = isset($input['amount']) ? intval($input['amount']) * 100 : 0;
    $studentId = isset($input['studentId']) ? $input['studentId'] : 'unknown';
    
    $payload = json_encode([
        "amount" => $amount,
        "currency" => "INR",
        "receipt" => "rcpt_" . $studentId . "_" . time()
    ]);
    
    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, $RAZORPAY_KEY_ID . ":" . $RAZORPAY_KEY_SECRET);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    ]);
    
    $result = curl_exec($ch);
    
    if(curl_errno($ch)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Curl error: " . curl_error($ch)]);
    } else {
        echo json_encode(["success" => true, "order" => json_decode($result)]);
    }
    curl_close($ch);
    exit;
}

// Static File Routing
$path = parse_url($request_uri, PHP_URL_PATH);

if ($path === '/' || $path === '/index.html') {
    include($base_dir . '/index.html');
} else if ($path === '/dashboard' || $path === '/dashboard.html') {
    include($base_dir . '/dashboard.html');
} else if ($path === '/course-details' || $path === '/course-details.html') {
    include($base_dir . '/course-details.html');
} else if ($path === '/login' || $path === '/login.html') {
    include($base_dir . '/login.html');
} else if ($path === '/register' || $path === '/register.html') {
    include($base_dir . '/register.html');
} else if ($path === '/programs' || $path === '/programs.html') {
    include($base_dir . '/programs.html');
} else if ($path === '/admin' || $path === '/admin.html') {
    include($base_dir . '/admin.html');
} else {
    // Serve static files (css, js, images) if they exist
    $file = $base_dir . $path;
    if (file_exists($file) && !is_dir($file)) {
        $mime_type = mime_content_type($file);
        if (strpos($file, '.css') !== false) $mime_type = 'text/css';
        if (strpos($file, '.js') !== false) $mime_type = 'application/javascript';
        header("Content-Type: " . $mime_type);
        readfile($file);
    } else {
        http_response_code(404);
        echo "404 Not Found";
    }
}
?>
