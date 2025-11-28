# Use Python 3.11
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app/backend

# Install dependencies
COPY requirements.txt /app/backend/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . /app/backend/

# Create the start script directly inside the image
# This avoids file copying issues and permission issues
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'set -e' >> /start.sh && \
    echo 'echo "Running migrations..."' >> /start.sh && \
    echo 'python manage.py migrate' >> /start.sh && \
    echo 'echo "Starting Daphne..."' >> /start.sh && \
    echo 'daphne -b 0.0.0.0 -p $PORT config.asgi:application' >> /start.sh && \
    chmod +x /start.sh

# Run the script
CMD ["/start.sh"]
