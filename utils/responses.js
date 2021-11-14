export const successResponse = (data, message = 'Success') => {
    const response = {
        success: true,
        message: message,
        data
    };
    return response;
}

export const errorResponse = (error) => {
    const response = {
        success: false,
        message: typeof error === 'string' ? error : error.message || 'Internal server error'
    }
    return response;
}