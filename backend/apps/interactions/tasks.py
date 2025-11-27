from celery import shared_task
import time

@shared_task
def send_comment_notification(comment_id, user_email):
    # Simulate sending an email or push notification
    print(f"Sending notification to {user_email} for comment {comment_id}...")
    time.sleep(2) # Simulate delay
    print(f"Notification sent to {user_email}!")
    return f"Notification sent for comment {comment_id}"
