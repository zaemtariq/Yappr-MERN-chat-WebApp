import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utils.lib.js";
import cloudinary from "../libs/cloudinary.lib.js";

// Signup route to register a new user
export let signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Validate password length
        if (password.length < 6 || password.length > 12) {
            return res.status(400).json({ message: "Password must be between 6 and 12 characters long" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        // Save new user and generate token
        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid data" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login route 
export let login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let isUser = await User.findOne({ email })
        console.log(password)
        if (!isUser) { return res.status(400).json({ message: "User Not Found" }) }
        if (email != isUser.email) {
            return res.status(400).json({ message: "Credentials Not matched" })
        }
        let isPasswordCorrect = (await bcrypt.compare(password, isUser.password)) || (password==isUser.password) ;
        console.log(isPasswordCorrect)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Credentials Not matched" })
        }
        generateToken(isUser._id, res);
        console.log("token generated")
        res.status(200).json({
            _id: isUser._id,
            fullName: isUser.fullName,
            email: isUser.email,
            profilePic: isUser.profilePic,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Bad Request12" })
    }

};

// Logout route 
export let logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully" })
    } catch (e) {
        res.status(400).json({ message: "Bad Request" })
    }
};

// updateProfile route 
export let updateProfile = async (req, res) => {
    console.log("hello");
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url }, // Store only the image URL
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: e.message });
    }
};


// CheckUserAuth route
export let checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "User not authenticated!" })
    }
}