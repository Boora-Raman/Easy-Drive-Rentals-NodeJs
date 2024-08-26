FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon express mongoose

# Copy all files from the current directory to /app in the container
COPY . .

EXPOSE 5600

CMD ["nodemon", "app.js"]
