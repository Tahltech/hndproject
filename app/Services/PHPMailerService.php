<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;

class PHPMailerService
{
    public function sendEmail(string $to, string $subject, string $body, array $attachments = []): bool
    {
        $mail = new PHPMailer(true);

        try {
            // SMTP configuration from Laravel config
            $mail->isSMTP();
            $mail->Host       = config('mail.mailers.smtp.host');
            $mail->SMTPAuth   = true;
            $mail->Username   = config('mail.mailers.smtp.username');
            $mail->Password   = config('mail.mailers.smtp.password');
            $mail->SMTPSecure = config('mail.mailers.smtp.encryption', 'tls');
            $mail->Port       = config('mail.mailers.smtp.port', 587);

            $mail->CharSet = 'UTF-8';

            $mail->setFrom(
                config('mail.from.address'),
                config('mail.from.name')
            );

            $mail->addReplyTo(
                config('mail.from.address'),
                config('mail.from.name')
            );
            $mail->addAddress($to);

           
            foreach ($attachments as $filePath => $fileName) {
                $mail->addAttachment($filePath, $fileName);
            }

           
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            // // Optional debugging
            // $mail->SMTPDebug = 2;
            // $mail->Debugoutput = function ($str, $level) {
            //     Log::info("SMTP DEBUG: $str");
            // };

            return $mail->send();

        } catch (Exception $e) {
            Log::error('PHPMailer error', [
                'to' => $to,
                'error' => $mail->ErrorInfo,
            ]);
            return false;
        }
    }
}
