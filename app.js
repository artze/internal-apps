var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./routes');
var imeiAppApiController = require('./controllers/imei-app/apiController');

var app = express();
var port = process.env.PORT || 3000

app.set('view engine', 'ejs');

app.use('/assets', express.static('./public'))
app.use(bodyParser.json());
app.use(morgan('dev'));

routes.init(app);
imeiAppApiController(app);

app.listen(port, function() {
	console.log(`Express running on ${port}`)
})