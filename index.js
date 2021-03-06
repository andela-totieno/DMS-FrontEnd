var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    require('dotenv').load();
}
// Modules
var express = require('express');
var app = express();
var path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var port = process.env.PORT || 3000;

require('./seeds/seed');



// Use bodyparser so that we can grab infromation from POST requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Log all requests to the console
app.use(morgan('dev'));

// Override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

// Configure our routes
require('./server/routes/users')(app, express);
require('./server/routes/documents')(app, express);
require('./server/routes/roles')(app, express);

// Set path of static files
app.use(express.static(path.join(__dirname, './public')));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {
        root: './public'
    });
});


// Start the Server
app.listen(port);
console.log('Magic happening at port ' + port);

process.on('SIGINT', function() {
    console.log('Exiting...');
    process.exit();
});



// Expose App
module.exports = app;
