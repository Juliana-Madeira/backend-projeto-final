const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MyFavorites = require('../models/MyFavorites');

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
        const hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            passwordHash: hash
        })
        const favorite = newUser._id;
        await MyFavorites.create({userId: favorite})
        res.status(201).json(`User Created!`);

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
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.status(200).json({user: payload, token});

    } catch (error) {
        res.status(500).json({message: `Sorry, Please try logging again!`, error})
    }
});

router.get('/logout', async(req, res) => {
    const token = req.headers.token;
    try{
        if(token){
        res.header("token", null, {httpOnly:true})   //ou res.cookie? 
        }
    } catch (error) {
        res.status(401).send('Logout not authorizated!')
    }
    res.send("Success Logout!")
})


module.exports = router;
