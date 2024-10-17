# Use the official Node.js slim image as the base
FROM node:22-slim

# Install dependencies required for Puppeteer to run
# Installing dependencies needed for Puppeteer and Chromium
RUN apt-get update && apt-get install -y \
    wget unzip fontconfig locales gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
    libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils chromium --no-install-recommends \
    && apt-get clean \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Setting Puppeteer env to use system installed Chrome, rather than downloading its own.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Set the Puppeteer environment variable to use the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set the working directory inside the container
WORKDIR /usr/src/app

# Create a non-root user and group, and set permissions for the app folder
RUN groupadd -r appuser && useradd -r -g appuser -d /usr/src/app -m appuser

# Change ownership of the app folder to the non-root user
RUN chown -R appuser:appuser /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies as the non-root user
RUN npm install --only=production

# Copy the rest of the application code
COPY --chown=appuser:appuser . .

# Start the Node.js app (replace 'index.js' with your app's entry point)
USER appuser
CMD ["node", "app.js"]

