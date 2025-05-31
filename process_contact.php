<?php
session_start();
header('Content-Type: application/json');

// Проверка дали заявката е POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Проверка на CSRF токен
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid security token']);
    exit;
}

// Валидация на входните данни
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$department = filter_input(INPUT_POST, 'department', FILTER_VALIDATE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
$captcha = filter_input(INPUT_POST, 'captcha', FILTER_VALIDATE_INT);

// Проверка на задължителните полета
if (!$name || !$email || !$department || !$subject || !$message || !$captcha) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Проверка на дължината на съобщението
if (strlen($message) < 60 || strlen($message) > 1500) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Message must be between 60 and 1500 characters']);
    exit;
}

// Проверка на captcha
if ($captcha != $_SESSION['captcha_answer']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid captcha answer']);
    exit;
}

// Подготовка на имейл съдържанието
$email_subject = "New Contact Form Submission: " . $subject;
$email_body = "Name: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Department: " . $department . "\n";
$email_body .= "Subject: " . $subject . "\n\n";
$email_body .= "Message:\n" . $message;

// Настройки за изпращане на имейл
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

try {
    // Изпращане на имейл
    if (mail($department, $email_subject, $email_body, $headers)) {
        // Логване на успешното изпращане
        $log_message = date('Y-m-d H:i:s') . " - Message sent successfully from " . $email . " to " . $department . "\n";
        file_put_contents('contact_log.txt', $log_message, FILE_APPEND);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    // Логване на грешката
    $error_message = date('Y-m-d H:i:s') . " - Error sending message: " . $e->getMessage() . "\n";
    file_put_contents('error_log.txt', $error_message, FILE_APPEND);
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred while sending your message. Please try again.']);
}
?> 