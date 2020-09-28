FROM node:8-slim

RUN mkdir -p /template
WORKDIR /template/
COPY ./template ./template
WORKDIR /template/template
RUN yarn
RUN yarn build
CMD ["node", "server.js"]
EXPOSE 3000