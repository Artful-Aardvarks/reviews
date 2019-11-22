FROM node:10

ARG DB_USERNAME=root
ENV DB_USERNAME=${DB_USERNAME}

ARG DB_PASSWORD=Grover96!
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_NAME=reviews
ENV DB_NAME=${DB_NAME}

ARG DB_HOST=ec2-18-222-224-168.us-east-2.compute.amazonaws.com
ENV DB_HOST=${DB_HOST}

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install    
COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]   
