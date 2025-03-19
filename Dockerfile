FROM node:18

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Expose the port Vite uses
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "preview"] 