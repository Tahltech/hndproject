<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class PHPMailerService
{
    public function sendEmail($to, $subject, $body)
    {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = env('SMTP_HOST');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('SMTP_USERNAME');
            $mail->Password   = env('SMTP_PASSWORD');
            $mail->SMTPSecure = env('SMTP_ENCRYPTION', 'tls');
            $mail->Port       = env('SMTP_PORT', 587);

            // Sender
            $mail->setFrom(env('SMTP_FROM_EMAIL'), env('SMTP_FROM_NAME'));

            // Recipient
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            return $mail->send();

        } catch (Exception $e) {
            return false;
        }
    }
}
