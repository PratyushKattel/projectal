from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_invite_email(email,workspace_name,invited_by,invite_link):

    subject = f"invitation to join {workspace_name}"

    html = render_to_string(
        "email/invite_email.html",
        {
            "workspace":workspace_name,
            "invited_by":invited_by,
            "invite_link":invite_link
        }
    )

    email_message = EmailMultiAlternatives(
            subject=subject,
            body=f"You are invited to join {workspace_name}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )

    email_message.attach_alternative(html, "text/html")
    email_message.send()



