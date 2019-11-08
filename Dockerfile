FROM node:6.11.5    

WORKDIR /Users/harryshapiro/hrnyc/reviews
COPY package.json .
RUN npm install    
COPY . .

CMD [ "npm", "start" ]    