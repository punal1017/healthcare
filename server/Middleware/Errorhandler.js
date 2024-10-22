const {constants} = require("../constants");
const ErrorHandler = (err,req,res,next) => {
    const StatusCode = res.statusCode ? res.statusCode : 500; //? : ternary operator (if else conditions)
    switch(StatusCode) {
        case constants.VALIDATION_ERROR:
        res.json({
            title : "Validation Failed",
            message :  err.message,
            stackTrace: err.stack ,           // stack trace : resolves issues including matrices and logs generated using the function
        });
        break;
        case constants.NOT_FOUND:
            res.json({
                title: "not found",
                message: err.message,
                stackTrace :  err.stack,
            });
            case constants.UNAUTHORIZED:
            res.json({
                title: "unauthorised",
                message: err.message,
                stackTrace: err.stack,
            });
            case constants.SERVER_ERROR:
                res.json({
                    title: "server error",
                    message: err.message,
                    stackTrace: err.stack,
                });

                default:
                    console.log("no error,all good!");
                    break;

    }
};

module.exports =  ErrorHandler;