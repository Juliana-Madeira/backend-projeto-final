const { Router } = require('express');
const Subscribe = require('../models/Subscribe');

const router = Router();

//post email
router.post("/", async (req, res) => {
    try {
      const newSubscribed = await Subscribe.create({ ...req.body });
      res.status(201).json(newSubscribed);
    } catch (error) {
      res.status(500).json({ message: "Could not subscribe", error });
    }
  });

module.exports = router;