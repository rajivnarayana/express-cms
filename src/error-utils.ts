export function processMongooseErrors(error) {
    return Object.keys(error.errors).map(key => {
        return {message : error.errors[key]}
    });
}