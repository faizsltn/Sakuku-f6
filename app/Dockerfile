# import image node versi 18 alpine
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Copy file dependency
COPY package*.json ./

# Install dependency
RUN npm install

# Copy seluruh source code aplikasi
COPY . .

# Expose port aplikasi (internal, bukan port browser)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]