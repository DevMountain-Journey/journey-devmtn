var express = require('express'),
    expressSession = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config/config.js');

var usersCtrl = require('./controllers/usersCtrl.js'),
    postsCtrl = require('./controllers/postsCtrl.js')
    authCtrl = require('./controllers/authCtrl.js');

require('./controllers/passport')(passport);

var app = express(),
    port = config.port;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../public'));
app.use(expressSession(config.express)); // use separate config file for secret
app.use(passport.initialize());
app.use(passport.session());


var mongoUri = config.mongoUri;

mongoose.connect(mongoUri);

mongoose.connection.once('open', function() {
    console.log("Successfully connected to mongodb")
}) 



// Endpoints

// Auth
app.post('/api/login', passport.authenticate('local-login'), authCtrl.successRespond);
app.post('/api/signup', authCtrl.localSignup);
app.get('/api/logout', authCtrl.logout);
app.get('/api/current_user', authCtrl.current_user);

// Posts
app.get('/api/posts', authCtrl.requireAuth, postsCtrl.read); // Get posts. Accepts query parameter. Posts collection.
app.get('/api/posts/:id', authCtrl.requireAuth, postsCtrl.readOne); // Gets individual post. Posts collection.
app.put('/api/posts/:id', authCtrl.requireAuth, postsCtrl.update); // Update post. Posts collection.
app.post('/api/posts/', authCtrl.requireAuth, postsCtrl.create); // Create new post. Posts collection.
app.delete('/api/posts/:id', authCtrl.requireAuth, postsCtrl.delete); // Delete post. Posts collection.

// Users
app.get('/api/users', authCtrl.requireAuth, usersCtrl.read); // Get users. Accepts query parameter. Users collection.
app.put('/api/users/:id', authCtrl.requireAuth, usersCtrl.update); // Update user. Users collection.
app.post('/api/users/', authCtrl.requireAuth, usersCtrl.create); // Create new user. Users collection.
app.delete('/api/users/:id', authCtrl.requireAuth, usersCtrl.delete); // Delete user. Users collection.



app.listen(port, function() {
    console.log('Server is running on port ' + port);
})

