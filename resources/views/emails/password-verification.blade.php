<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Verification</title>
    <style>
        /* Optional: Add inline-safe font styling */
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .code-box {
            display: inline-block;
            padding: 15px 25px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            background-color: #3D37FF;
            color: #ffffff;
            border-radius: 6px;
            text-align: center;
            margin: 20px 0;
        }
        hr {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 20px 0;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            text-align: center;
            margin-top: 10px;
        }
        h2 {
            color: #3D37FF;
            margin-bottom: 10px;
        }
        p {
            color: #333333;
            font-size: 16px;
            line-height: 1.5;
        }
        p.small {
            color: #555555;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello, {{ $user->full_name }}!</h2>
        <p>
            You requested to update your password. Use the verification code below to confirm your change:
        </p>

        <div class="code-box">
            {{ $code }}
        </div>

        <p class="small">
            This code will expire in 15 minutes. If you did not request a password change, please ignore this email.
        </p>

        <hr>

        <p class="footer">
            © {{ date('Y') }} {{ $user->bank->name }}. All rights reserved.
        </p>
    </div>
</body>
</html>
