import { Router } from "express";
import { getUserProfile, login, logout, register, updateUserProfile } from "../controllers/user_controller.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";


// create router
const userRouter = Router();

// define routes
userRouter.post("/users/register", register );

userRouter.post("/users/login", login);

userRouter.get("/users/me", isAuthenticated, hasPermission('get_user_profile'), getUserProfile);

userRouter.patch("/users/me/:id", isAuthenticated, hasPermission('update_user_profile'), updateUserProfile);

userRouter.post("/users/logout", logout)

// export router here
export default userRouter