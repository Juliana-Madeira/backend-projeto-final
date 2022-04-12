const { Router } = require('express');
const User = require('../models/User');
const router = Router();


router.put('/:userId', async (req, res) => {
    const { userId } = req.user;
    try {
        const updateUser = await User.findByIdAndUpdate(userId, req.body,
            {new: true});
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({message: `Update failed`, error});
    }
});


router.delete('/:userId', async (req, res) => {
    const { userId } = req.user;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json("User deleted!");
    } catch (error) {
        res.status(500).json({message: `Unable to delete your username`, error});     
    }
});

module.exports = router;