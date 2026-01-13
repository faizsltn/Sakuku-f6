# Menggunakan node versi 18 alpine
FROM node:18-alpine

# Set direktori kerja
WORKDIR /usr/drc/app

# Copy file dependency
COPY package*.json ./

# Install dependency
RUN npm install

# Copy seluruh source code
COPY . .

# Port internal aplikasi
EXPOSE 3000

# PERBAIKAN: Jalankan app.js sesuai kodingan Anda
CMD ["node", "app.js"]