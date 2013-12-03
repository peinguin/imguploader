var express = require("express"),
 orm = require('./orm'),
 swagger = require("./swagger"),
 auth = require('./auth'),
 config = require('./config'),
 static_files = require('./static'),
 auth_filter = require('./auth_filter');

var app = express();

app.use(express.bodyParser());

auth.init(app);
app.use(auth_filter);
orm.init(app);
swagger(app);
static_files(app);

app.listen(config.listen);