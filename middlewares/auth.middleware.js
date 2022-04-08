const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
    const bearer = req.get(`Authorization`);
    try {
        if(!bearer){
            return res.status(401).json({msg: `Token not found`});
        }
        const token = bearer.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {...decodedToken};
        next();

    } catch (error) {
        res.status(401).json({message: `Unauthorized`, error})
    }
};

module.exports = authorization;