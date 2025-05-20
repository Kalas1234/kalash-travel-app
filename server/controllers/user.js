import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        console.log('check4', req.body);
        const em = await User.findOne({
            email: req.body.email
        });
        if (em) {
            return res.status(409).send({
                message: 'User with given email already exists'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash
        });
        await newUser.save();
        return res.status(200).send('new user is created');
    } catch (error) {
        console.error(error);
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        console.log('check5', user);

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'password is not correct' });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user?.isAdmin || false }, process.env.JWT_SECRET);

        const { password, ...otherDetails } = user._doc;

        res.cookie('access_token', token, { httpOnly: true }).status(200).json({ details: otherDetails });
    } catch (error) {
        res.status(500).send({ message: 'Error in login' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        console.log('check2');
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'user is deleted' });
    } catch (error) {
        res.status(400).json({ message: 'error in deleting the user' });
    }
};
