require("dotenv").config(); 
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const { checkOverload } = require("./helpers/check.connection");

//init middlewaremorgan
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// app.use(morgan("combined"));

//init db
require("./dbs/init.mongodb");
// checkOverload();

//init router

app.use("", require("./routers"));

// handle error

module.exports = app;