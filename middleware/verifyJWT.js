const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers['authorization'];//ensure that it is request.headers
    //checking if authorization is not received
    if(!authHeader) return res.sendStatus(401); //Unauthorized
    console.log(authHeader); //Bearer token => a bearer, space token in console
    const token = authHeader.split(' ')[1]; //splitting token, after the space which starts at index 1
    //now verifing the token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403); //forbidden, invalid token(token was tampered)
            req.user = decoded.username; //username was passed to jwt and now decoded
            next();
        }
    );
}

module.exports = verifyJWT;