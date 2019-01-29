FROM node:carbon

WORKDIR /usr/src/samus-server

COPY ./ ./

RUN npm install 

RUN npm install -g nodemon --save

CMD ["/bin/bash"]