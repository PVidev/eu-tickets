<?php
header('Content-Type: application/json');

// Проверка дали заявката е POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Валидация на входните данни
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$department = filter_input(INPUT_POST, 'department', FILTER_VALIDATE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Проверка за задължителни полета
if (!$name || !$email || !$department || !$subject || !$message) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Проверка на дължината на съобщението
if (strlen($message) < 60 || strlen($message) > 1500) {
    echo json_encode(['success' => false, 'message' => 'Message must be between 60 and 1500 characters']);
    exit;
}

// Подготовка на имейл съдържанието
$emailSubject = "New Contact Form Submission: $subject";
$emailBody = "Name: $name\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Department: $department\n";
$emailBody .= "Subject: $subject\n\n";
$emailBody .= "Message:\n$message";

// Изпращане на имейл
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($department, $emailSubject, $emailBody, $headers)) {
    // Записване в лог файл
    $logEntry = date('Y-m-d H:i:s') . " - From: $email, To: $department, Subject: $subject\n";
    file_put_contents('contact_log.txt', $logEntry, FILE_APPEND);
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?> 