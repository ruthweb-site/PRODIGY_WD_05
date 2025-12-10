# Use official Nginx image
FROM nginx:latest

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your project files to Nginx public folder
COPY . /usr/share/nginx/html

# Expose port 80 (optional for documentation)
EXPOSE 80
