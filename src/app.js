const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

//init middlewaremorgan
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// app.use(morgan("combined"));

//init db

//init router

app.get("/", (req, res, next) => {
    const strCompress = "Hello world";
    res.status(200).json({
        message: "Hello",
        data: strCompress.repeat(100000)
    })
});

// handle error

module.exports = app;