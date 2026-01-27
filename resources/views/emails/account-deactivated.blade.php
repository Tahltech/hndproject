<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Account Deactivated</title>
    <style>
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
        .highlight-box {
            display: inline-block;
            padding: 15px 25px;
            font-size: 20px;
            font-weight: bold;
            background-color: #FF3D37; 
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
            color: #FF3D37; 
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
            Your account with <strong>{{ $user->bank->name }}</strong> has been <strong>deactivated</strong> by the bank administrator. 
            This may be due to a violation of terms or other reasons determined by the bank. 
            Please contact your bank administrator or visit the bank branch to verify your account status.
        </p>

        <div class="highlight-box">
            Account ID: {{ $user->user_id }}
        </div>

        <hr>

        <p class="footer">
            © {{ date('Y') }} {{ $user->bank->name }}. All rights reserved.
        </p>
    </div>
</body>
</html>
