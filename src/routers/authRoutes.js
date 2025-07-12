import express from 'express';
import User from '../models/User.js'; // Assuming you have a User model defined in models/User.js
import jwt from 'jsonwebtoken'; // For generating JWT tokens

const router = express.Router();


const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION || '1d'
    });
}


router.post('/register', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!username.match(/^[a-zA-Z0-9_]+$/)) {
            return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
        }
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 3 and 20 characters long' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        //get random profile image URL
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
        
        const user = new User({
            username,
            email,
            password,
            profileImage, // Default profile image URL
            role: 'main', // Default role is 'user'
            familyId: null, // Assuming familyId is optional
            balance: 0, // Default balance is 0
            isActive: true // Default status is active
        });
        await user.save();
        const token = generateToken(user._id); // Assuming you have a method to generate auth token
        res.status(201).json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    role: user.role,
                    familyId: user.familyId,
                    balance: user.balance,
                    isActive: user.isActive // Include isActive status
                },
                token // Return the generated token
            }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        //check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id); // Assuming you have a method to generate auth token
        res.status(200).json(
            {
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    role: user.role,
                    familyId: user.familyId,
                    balance: user.balance,
                    isActive: user.isActive // Include isActive status
                }, 
                token // Return the generated token
            }
        );
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;