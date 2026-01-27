<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Bank Admin Account Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .info-box {
            display: block;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: bold;
            background-color: #3D37FF;
            color: #ffffff;
            border-radius: 6px;
            text-align: left;
            margin: 20px 0;
        }
        .info-item {
            margin: 10px 0;
            font-size: 15px;
            color: #ffffff;
           
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
        .info-item > strong{
             opacity: 50%;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello, {{ $user->full_name }}!</h2>
        <p>
            Your bank administrator account has been successfully created. Below are your login credentials and account details. Please keep them safe.
        </p>

        <div class="info-box">
            <p class="info-item"><strong>Username:</strong> {{ $user->username }}</p>
            <p class="info-item"><strong>Email:</strong> {{ $user->email }}</p>
            <p class="info-item"><strong>Phone Number:</strong> {{ $user->phone_number }}</p>
            <p class="info-item"><strong>Bank:</strong> {{ $user->bank->name }}</p>
            @if($user->branch)
                <p class="info-item"><strong>Branch:</strong> {{ $user->branch->name }}</p>
            @endif
            <p class="info-item"><strong>Temporary Password:</strong> {{ $password }}</p>
        </div>

        <p class="small">
            For security reasons, we recommend you change your password immediately after your first login.
        </p>

        <hr>

        <p class="footer">
            © {{ date('Y') }} TahlFin. All rights reserved.
        </p>
    </div>
</body>
</html>
