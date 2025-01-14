import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            birthday,
            password,
            userPicturePath,
            voucher,
            admin
        } = req.body;

        console.log("Request body:", req.body);

        const salt = await bcrypt.genSalt(); // create a salt provided by bcrypt, and this encrypts the password
        const passwordhash = await bcrypt.hash(password, salt); //hash the password with the salt

        const newUser = new User({
            name,
            email,
            birthday,
            password: passwordhash,
            userPicturePath,
            admin: admin || false, // Ensure admin is a boolean
            status: "pending",
            voucher
         });
         console.log("New user:", newUser);
         
         const savedUser = await newUser.save();
         console.log("Saved user:", savedUser);

         res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: error.message });
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist " });

        // Compare provided password with hashed password in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials " });

        if (user.status !== "approved") {
            return res.status(403).json({ msg: "Account not yet approved" });
        }

        const token = jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional: set token expiration
        );
        const userSafe = { ...user._doc };
        delete userSafe.password;
        res.status(200).json({ token, user: userSafe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}