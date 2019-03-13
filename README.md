[![Build Status](https://travis-ci.org/Felglitzzz/Population-Management-API.svg?branch=master)](https://travis-ci.org/Felglitzzz/Population-Management-API)
[![Coverage Status](https://coveralls.io/repos/github/Felglitzzz/Population-Management-API/badge.svg?branch=master)](https://coveralls.io/github/Felglitzzz/Population-Management-API?branch=master)

# Population-Management-API
 Population Management API manages the list of locations and the total number of residents in each location broken down by gender.

## Take a Peek
API is hosted on heroku via this [link](https://api-population-management.herokuapp.com/api/v1/home)

## Technologies Used

* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built on chrome V8 engine that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJs](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [Mongoose](https://mongoosejs.com//) - An ODM for Node.js that provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
* [MongoDb](https://www.mongodb.com//) - A powerful, open source object-relational database system.

## How To Install

1. Install [`node`](https://nodejs.org/en/download/), version 9 or greater
2. Install [`mongodb`](https://docs.mongodb.com/v3.2/installation/)
3. Clone the repository `git clone https://github.com/Felglitzzz/Population-Management-API.git`
4. Navigate to the project directory `cd ~/path/to/Population-Management-API`
5. Install all dependencies `npm i`
6. Configure Mongo
7. Start the app `npm run start-dev`
8. Navigate to the API home `http://localhost:3000/api/v1/home`

## Testing

- Uses `Mocha`, `Chai` and `Supertest`
- Have a test database
- run `npm test`
