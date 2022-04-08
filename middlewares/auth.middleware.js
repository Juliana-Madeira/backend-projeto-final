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
        res.status(401).json({msg: `Unauthorized`, error: error.message})
    }
};

const tokenAndAuthorization = (req, res, next) => {
    authorization (req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not aloewd to do that!");
        }
    }) 
}

const tokenAndAdmin = (req, res, next) => {
    authorization (req, res, () => {
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not aloewd to do that!");
        }
    })
}

module.exports = {authorization, tokenAndAuthorization, tokenAndAdmin};