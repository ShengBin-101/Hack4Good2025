import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
        } = req.body;

        // Validate input
        if (!name || !email || !birthday || !password) {
            return res.status(400).json({ msg: "All fields except Profile Picture URL are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            birthday,
            password: passwordHash,
            userPicturePath,
            voucher: 10, // Default voucher value
            admin: false, // Default admin value
            status: "pending" // Default status
        });

        const savedUser = await newUser.save();
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