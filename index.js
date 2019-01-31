require('dotenv').config();
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');

// App instance
const app = express();

// Set up middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));

// Helper function: This allows our server to parse the incoming token from the client
// This is being run as middleware, so it has access to the incoming request
function fromRequest(req){
  console.log(req.body.headers);
  if(req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
      console.log(req.body.headers.Authorization.split(' ')[1])
    return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

// Controllers
app.use('/auth', expressJwt({
  secret: process.env.TOKEN_SECRET_KEY,
  getToken: fromRequest
}).unless({
  // Unless() Not required unless you need sth to be NOT protected
  path: [{ url: '/auth/login', methods: ['POST'] }, { url: '/auth/signup', methods: ['POST'] }]
}), require('./controllers/auth'));

app.get('/', function(req, res, next) {
  res.status(404).send({ message: 'Found' });
});
// This is the catch-all route. Ideally you don't get here unless you made a mistake on your front-end
app.get('*', function(req, res, next) {
	res.status(404).send({ message: 'Not Found' });
});


// Listen on specified PORT or default to 3000
app.listen(process.env.PORT || 3000);
