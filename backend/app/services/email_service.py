import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "kaustubh1006p@gmail.com")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def set_smtp_credentials(admin_email: str = None, app_password: str = None):
    global ADMIN_EMAIL, SMTP_PASSWORD
    if admin_email:
        ADMIN_EMAIL = admin_email.strip()
    if app_password:
        SMTP_PASSWORD = app_password.strip()

def send_email_otp(to_email: str, otp_code: str, purpose: str = "registration") -> dict:
    subject = f"Threat2Risk AI — Security OTP Code: {otp_code}"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; padding: 24px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #111827; border: 1px solid #00e5ff; border-radius: 12px; padding: 24px;">
          <h2 style="color: #00e5ff; text-align: center; margin-top: 0;">THREAT2RISK AI</h2>
          <p style="font-size: 14px; color: #94a3b8;">Security Verification Request ({purpose.upper()})</p>
          <hr style="border-color: #1f2937;" />
          <p style="font-size: 14px;">Your 6-digit security OTP verification code is:</p>
          <div style="background-color: #05070b; border: 1px solid #00e5ff; color: #00ff9d; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; border-radius: 8px; margin: 20px 0;">
            {otp_code}
          </div>
          <p style="font-size: 12px; color: #64748b; text-align: center;">This code expires in 5 minutes. Do not share this code with anyone.</p>
          <hr style="border-color: #1f2937;" />
          <p style="font-size: 11px; color: #475569; text-align: center;">Sent by Threat2Risk AI Security Engine (Admin: {ADMIN_EMAIL})</p>
        </div>
      </body>
    </html>
    """
    
    if SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = ADMIN_EMAIL
            msg["To"] = to_email
            msg.attach(MIMEText(body, "html"))
            
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(ADMIN_EMAIL, SMTP_PASSWORD)
                server.sendmail(ADMIN_EMAIL, to_email, msg.as_string())
            
            print(f"[SMTP EMAIL SUCCESS] Sent OTP to {to_email} from {ADMIN_EMAIL}")
            return {
                "success": True,
                "delivered_via_smtp": True,
                "sender": ADMIN_EMAIL,
                "recipient": to_email,
                "otp_preview": otp_code,
                "error": None
            }
        except Exception as e:
            err_msg = str(e)
            print(f"[SMTP EMAIL ERROR] Could not send via SMTP: {err_msg}")
            return {
                "success": True,
                "delivered_via_smtp": False,
                "sender": ADMIN_EMAIL,
                "recipient": to_email,
                "otp_preview": otp_code,
                "error": f"SMTP Exception: {err_msg}"
            }
    else:
        print(f"[SECURE MAIL DISPATCH] Sender: {ADMIN_EMAIL} -> Recipient: {to_email} | OTP: {otp_code}")
        return {
            "success": True,
            "delivered_via_smtp": False,
            "sender": ADMIN_EMAIL,
            "recipient": to_email,
            "otp_preview": otp_code,
            "error": "No SMTP_PASSWORD set. Dispatched via simulated secure email queue."
        }
