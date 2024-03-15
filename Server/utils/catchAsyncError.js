const catchAsyncError = (theFunc) => {
    return async (req, res, next) => {
        try {
            await theFunc(req, res, next);
        } catch (err) {
            err.statusCode = err.statusCode || 500;
            err.message = err.message || "Internal Server Error";
            if (err.name === "CastError") {
                const message = `Resource not found. Invalid : ${err.path}`;
                err = new Error(message, 400);
            }
            // mongoose duplicate key error
            if (err.code === 11000) {
                const message = `Duplicate ${Object.keys(err.keyValue)} value`;
                err = new Error(message, 400);
            }
            res.status(err.statusCode).json({
                message: err.message,
            });
        }
    };
};

module.exports = catchAsyncError;
