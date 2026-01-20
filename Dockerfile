FROM nikolaik/python-nodejs:python3.11-nodejs18

WORKDIR /app

# Install system dependencies (Nginx)
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend package files
COPY MANPRO-BackendR/package*.json ./
COPY MANPRO-BackendR/python_service/requirements.txt ./python_service/

# Install Node dependencies
RUN npm install

# Install Python dependencies
RUN pip install --no-cache-dir -r python_service/requirements.txt

# Copy backend application code
COPY MANPRO-BackendR/ .

# Copy Nginx config
COPY MANPRO-BackendR/nginx.conf /etc/nginx/sites-available/default

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Expose the port HF Spaces uses
EXPOSE 7860

# Make start script executable
RUN chmod +x start.sh

CMD ["./start.sh"]
