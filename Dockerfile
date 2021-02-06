FROM node:12-alpine

WORKDIR /app
COPY . /app

RUN yarn --frozen-lockfile && \
	yarn client:build && \
	yarn cache clean && \
	rm -rf src

CMD [ "yarn", "start:prod" ]
EXPOSE 3002

HEALTHCHECK CMD wget -q -O - http://localhost:3002/ > /dev/null
