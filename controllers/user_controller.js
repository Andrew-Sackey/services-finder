import { UserModel } from "../models/user.js";
import { loginUserValidator, registerUserValidator, updateProfileValidator } from "../validators/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        // validate user input
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error)
        }
        // check if user does not exist
        const user = await UserModel.findOne({ email: value.email});
        if (user) {
            return res.status(409).json('user already exists!');
        }
        // hash their password
        const hashedPassword = bcrypt.hashSync(value.password, 12);
        // save the user into the database
        await UserModel.create({
            ...value,
            password: hashedPassword
        });
        // send the user confirmation email
        // respond to request
        res.status(201).json("User registered succesfully")
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
   try {
    // validate user login
    const {error, value } = loginUserValidator.validate(req.body);
    if (error) {
        return res.status(422).json(error);
    }
    // check if the user exists in the database
    const user = await UserModel.findOne({ email: value.email });
    if (!user) {
        return res.status(404).json('user does not exist');

    }
    // check if the user logged in with the correct password
    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
        return res.status(401).json('invalid credentials!');
    }
    // logged in user a token
    const token = jwt.sign(
        { id: user.id, role: 'user' },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: '24h' }
    )
    // return response
     res.status(200).json({
        message:  'User logged in sucessfully!',
        accessToken: token
     })
   } catch (error) {
    next(error);
   }
};

export const getUserProfile = async (req, res, next) => {
    try {
        // find authenticated user from the database
        const user = await UserModel
        .findById(req.auth.id)
        .select({
            password: false
        });
        // check if the user exist
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        // return response
        res.json(user)
    } catch (error) {
        next(error);
    }
}


export const updateUserProfile = async (req, res, next) => {
   try {
    // validate user input
    const {error, value} = updateProfileValidator.validate(req.body);
    if (error) {
        return res.status(422).json(error)
    }
    // check if user exists
    const updateduser = await UserModel.findByIdAndUpdate(req.auth.id, value, {new: true});
    if (!updateduser) {
        return res.status(404).json('User not found')
    }
    // return response
     res.json('User profile updated')
   } catch (error) {
    next(error);
   }
}


export const logout = (req, res, next) => {
    res.json('user logged out')
}