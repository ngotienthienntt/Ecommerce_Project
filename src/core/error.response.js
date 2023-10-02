"use strict"

const StatusCode = {
    FORBIDDEND: 403,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    FORBIDDEND: "Bad request error",
    CONFLICT: "Conflict error"
}

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

module.exports = {
    ConfictResponseError,
    BadRequestError
}