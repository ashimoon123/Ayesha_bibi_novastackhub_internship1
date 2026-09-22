const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    // Standardized JSON error response
    const response = {
        error_code: err.errorCode || "INTERNAL_SERVER_ERROR",
        message: err.message || "An unexpected error occurred on the server",
        timestamp: new Date().toISOString()
    };

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
