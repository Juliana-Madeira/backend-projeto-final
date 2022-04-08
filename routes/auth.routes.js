const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if(!name || !email || !password){
            throw new Error(`All fields are required`);
        }

        const user = await User.findOne({email});
        if(user){
            throw new Error (`User already exists`);
        }

        const salt = bcrypt.genSaltSync(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            passwordHash
        })
        res.status(201).json(`User created!`);

    } catch (error) {
        res.status(500).json({message: `Sorry, Please try again!`, error})
        }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFromDb = await User.findOne({email});
        if(!userFromDb){
            throw new Error (`User not found`);
        }
        const verifiedHash = bcrypt.compareSync(password, userFromDb.passwordHash);
        if(!verifiedHash){
            throw new Error (`Email or Password invalid!`)
        }

        const payload = {
            id: userFromDb._id,
            name: userFromDb.name,
            email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.status(200).json({user: payload, token});

    } catch (error) {
        res.status(500).json({message: `Sorry, Please try logging again!`, error})
    }
});

module.exports = router;
