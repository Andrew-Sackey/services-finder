import { Router } from "express";
import { getUserProfile, login, logout, register, updateUserProfile } from "../controllers/user_controller.js";


// create router
const userRouter = Router();

// define routes
userRouter.post("/users/register", register );

userRouter.post("/users/login", login);

userRouter.post("/users/me", getUserProfile);

userRouter.patch("/users/me/id", updateUserProfile);

userRouter.post("/users/logout", logout)

// export router here
export default userRouter