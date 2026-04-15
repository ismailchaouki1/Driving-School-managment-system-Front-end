<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #8cff2e;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #8cff2e;
        }
        h1 {
            color: #1a1a2e;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: #8cff2e;
            color: #0d0d0d;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: background 0.3s ease;
        }
        .button:hover {
            background: #7ae02a;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
        .warning {
            background: #fef2f2;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            color: #ef4444;
            margin-top: 20px;
            border-left: 3px solid #ef4444;
        }
        .info {
            background: #f0fdf4;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            color: #16a34a;
            margin-top: 20px;
        }
        @media (max-width: 600px) {
            .card {
                padding: 24px;
            }
            .button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="logo">Clario</div>
                <h1>Reset Your Password</h1>
            </div>

            <p>Hello <strong>{{ $name }}</strong>,</p>

            <p>You recently requested to reset your password for your Clario account. Click the button below to reset it.</p>

            <div style="text-align: center;">
                <a href="{{ $reset_url }}" class="button">Reset Password</a>
            </div>

            <div class="info">
                <strong>✨ Link valid for 60 minutes</strong>
            </div>

            <div class="warning">
                <strong>⚠️ Didn't request this?</strong><br>
                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </div>

            <p style="margin-top: 20px; font-size: 13px;">
                If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; font-size: 12px; color: #666; background: #f8f9fa; padding: 10px; border-radius: 6px;">
                {{ $reset_url }}
            </p>

            <div class="footer">
                <p>&copy; {{ date('Y') }} Clario Driving School. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </div>
</body>
</html>
