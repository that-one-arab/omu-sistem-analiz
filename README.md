# B2B-İYS
####  A CRM, built for companies wih dealerships business model.

### What is it?

It's a CRM that allows the company and it's respective dealers to communicate and track sales applications, as well as reward it's respective dealers depending on the type of sale the dealer submitted.
It has 3 different roles with each role having it's own different UI and responsibilities.
The application was built with dynamic usability in mind, meaning any company with dealerships business model can adapt and use it.

### Wanna try it out?

A demo for the application can be found [here](https://projects.b2b-iys.muhammed-aldulaimi.com/)

### Features

- Create an account with email authentication, change password or reset it incase you've forgotten it.
- 3 Main roles with each role having their UI and abilities.
- Submit an application as a dealer and track all your submitted applications' details and status.
- Have funds processed to your account once your application has been approved.
- Control the work flow of dealers that belong in your territory by processing, approving or rejecting their submitted application.
- Track all users as the sales assistant chef, enable or disable users, add services and add offers to the respective service.
- Track all submitted applications by their service, status or date.


### Stack And Libraries
- **Front End:** React, Redux, XLSX, QS.
- **Back End:** Express, Mailgun, Bree, Multer, JWT, Bcrypt, EJS.
- **Database:** PostgresQL
- **Deployment:** Ubuntu, Nginx, Docker

### Installation
Clone the repository

`$ git clone https://github.com/that-one-arab/b2b-iys.git b2b-iys`

Go into the directory

`$ cd b2b-iys`

Install the dependencies

`$ npm i`

After that you can immediatly run the project by doing

`$ npm start`

Or if you would like to make changes to the files, run it with

`$ npm run startdev`

This will start the project with nodemon, which will listen to any active changes in the directory.

The react build is already pushed to the repository. If you would like to make changes to the front end, make sure to cd to client directory, run `$ npm i` to install the dependencies, then `$ npm start` to start a frontend local development server.


### Thank you for reading!
