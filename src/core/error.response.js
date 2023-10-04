"use strict"

const StatusCode = {
    FORBIDDEND: 403,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    FORBIDDEND: "Bad request error",
    CONFLICT: "Conflict error"
} 

const {
    StatusCodes,
    ReasonPhrases,
} = require("../utils/httpStatusCode")

class ErrorResponse extends Error{
    constructor(message, status){
        super(message);
        this.status = status;
    }
}

class ConfictResponseError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.CONFLICT){
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.FORBIDDEND, status = StatusCode.FORBIDDEND){
        super(message, status);
    }
}


class AuthFailureError extends ErrorResponse{
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED){
        super(message, status);
    }
}

class ServerError extends ErrorResponse{
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR){
        super(message, status);
    }
}

module.exports = {
    ConfictResponseError,
    BadRequestError,
    AuthFailureError,
    ServerError,
}