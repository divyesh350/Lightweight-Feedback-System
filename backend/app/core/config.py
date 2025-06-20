import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from fastapi import BackgroundTasks

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

FROM_EMAIL = SMTP_USER

def send_email_background(background_tasks: BackgroundTasks, to_email: str, subject: str, body: str):
    background_tasks.add_task(send_email, to_email, subject, body)

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(FROM_EMAIL, [to_email], msg.as_string())
