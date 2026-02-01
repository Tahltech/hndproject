<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Transaction Successful</title>
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
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        td {
            padding: 8px 0;
            font-size: 15px;
        }
        td.label {
            color: #555;
            font-weight: 600;
        }
        td.value {
            text-align: right;
            color: #202020;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello, {{ $user->full_name }}!</h2>

        <p>
            Your <strong>{{ ucfirst($transaction->type) }}</strong> transaction has been
            <strong>successfully processed</strong>.
        </p>

        <div class="highlight-box">
            {{ strtoupper($transaction->type) }} · {{ number_format($transaction->amount, 2) }} FCFA
        </div>

        <table>
            <tr>
                <td class="label">Transaction Type</td>
                <td class="value">{{ ucfirst($transaction->type) }}</td>
            </tr>
            <tr>
                <td class="label">Payment Method</td>
                <td class="value">{{ strtoupper(str_replace('_', ' ', $transaction->method)) }}</td>
            </tr>
            <tr>
                <td class="label">Reference Number</td>
                <td class="value">{{ $transaction->reference_no }}</td>
            </tr>
            <tr>
                <td class="label">Transaction Date</td>
                <td class="value">{{ $transaction->created_at->format('d M Y, H:i') }}</td>
            </tr>
            <tr>
                <td class="label">Status</td>
                <td class="value">Successful</td>
            </tr>
        </table>

        <p class="small">
            If you did not authorize this transaction, please contact your bank
            administrator immediately.
        </p>

        <hr>

        <p class="footer">
            © {{ date('Y') }} TahlFin. All rights reserved.
        </p>
    </div>
</body>
</html>
