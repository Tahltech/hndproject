<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Account Created Successfully</title>
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
            Your account has been <strong>successfully created</strong>.  
            Welcome to <strong>TahlFIN</strong> — we're glad to have you on board.
        </p>

        <div class="highlight-box">
            User ID: {{ $user->user_id }}
        </div>

        <p class="small">
            You can now log in to your account.  
            Please note that some banking features (such as savings and withdrawals)
            will become available once your account is linked to a bank.
        </p>

        <hr>

        <p class="footer">
            © {{ date('Y') }} TahlFin. All rights reserved.
        </p>
    </div>
</body>
</html>
