import User from "../models/User.js";
import createError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) return next(new createError("User already exists!", 400));

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Assign JWT
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(201).json({
      status: "success",
      message: "User Registered Successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new createError("Invalid email or password!", 401));
    }

    // Assign JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};
