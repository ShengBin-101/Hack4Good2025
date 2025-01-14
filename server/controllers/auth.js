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

         const salt = await bcrypt.genSalt(); // create a salt provided by bcrypt, and this encrypts the password
         const passwordhash = await bcrypt.hash(password, salt); //hash the password with the salt

         const newUser = new User({
            name, 
            email,
            birthday, 
            password: passwordhash,
            userPicturePath,
            admin,
            voucher
         });
         const savedUser = await newUser.save();
         res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist "});

        // Compare provided password with hashed password in MongoDB
        const isMatch =  await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg:"Invalid credentials "});

        //
        const token = jwt.sign(
            { id: user._id, admin: user.admin}, 
            process.env.JWT_SECRET
        );
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};