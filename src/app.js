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

//test redis
require("./tests/inventory.test")
const productTest = require("./tests/product.test");
productTest.purchaseProduct("product:001", 10)

// app.use(morgan("combined"));

//init db
require("./dbs/init.mongodb");

// checkOverload();

//init router

app.use("/", require("./routers"));

// handle error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500

    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Internal server error"
    })

})

module.exports = app;