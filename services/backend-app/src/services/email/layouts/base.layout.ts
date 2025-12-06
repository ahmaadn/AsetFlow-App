/**
 * Base HTML layout for all email templates
 * Provides consistent styling and structure
 */
export const BaseLayout = {
  /**
   * Wraps email content with consistent HTML structure
   * @param content - The HTML content to wrap
   * @param title - Email title for metadata
   * @returns Complete HTML email structure
   */
  wrap(content: string, title: string = 'AsetFlow'): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 40px 30px;
        }

        .content h2 {
            color: #1a202c;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            line-height: 1.3;
        }

        .content p {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }

        .button:hover {
            transform: translateY(-2px);
        }

        .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer p {
            color: #718096;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }

        .alert {
            background-color: #fef5e7;
            border-left: 4px solid #f6ad55;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .alert p {
            color: #744210;
            margin: 0;
            font-size: 14px;
        }

        @media (max-width: 640px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }

            .header {
                padding: 30px 20px;
            }

            .header h1 {
                font-size: 28px;
            }

            .content {
                padding: 30px 20px;
            }

            .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>AsetFlow</h1>
            <p>Digital Asset Management Platform</p>
        </div>

        <div class="content">
            ${content}
        </div>

        <div class="footer">
            <p>© 2024 AsetFlow. All rights reserved.</p>
            <p>
                Need help? Contact us at
                <a href="mailto:support@asetflow.com">support@asetflow.com</a>
            </p>
            <div class="divider"></div>
            <p style="font-size: 12px; color: #a0aec0;">
                This email was sent from AsetFlow. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`;
  },
};
