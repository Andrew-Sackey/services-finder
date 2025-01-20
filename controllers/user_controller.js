export const register = (req, res, next) => {
    try {
        // validate user input
        
        // check if user does not exist
        // hash their password
        // save the user into the database
        // send the user confirmation email
        // respond to request
        res.json("User Registered")
    } catch (error) {
        next(error);
    }
}