FROM nikolaik/python-nodejs:python3.11-nodejs18

WORKDIR /app

# Install system dependencies (Nginx)
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY python_service/requirements.txt ./python_service/

# Install Node dependencies
RUN npm install

# Install Python dependencies
RUN pip install --no-cache-dir -r python_service/requirements.txt

# Copy application code
COPY . .

# Copy Nginx config
COPY nginx.conf /etc/nginx/sites-available/default

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Expose the port HF Spaces uses
EXPOSE 7860

# Start script
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
