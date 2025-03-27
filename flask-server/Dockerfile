FROM python:3.10

# Install system dependencies needed for OpenCV
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

# Create app directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the app
COPY . .

# Run the Flask app
CMD ["gunicorn", "server:app", "-w", "2", "-k", "gevent", "-b", "0.0.0.0:8000"]
