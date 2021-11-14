# Evocher management system

## Info

Node.js app using [Express 4](http://expressjs.com/)

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js (14.xx.xx or later)
- Mongodb (4.x or later)

## Running Locally

```sh
npm install
npm start
```

App should now be running on [localhost:3000](http://localhost:3000/).

## Postman collection

https://www.getpostman.com/collections/4fe432f5c556e51566d5


## Restore database

Unzip seeds/evoucher-management.zip and run the following command

```sh
mongorestore -d evoucher-management seeds/evoucher-mangement
```