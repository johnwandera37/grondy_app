const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async(req, res)=>{
    const cookies = req.cookies;
    //checking existance of cookies and jwt properties
    if(!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt);

    //now that we have refreshToken within cookies
    const refreshToken = cookies.jwt;

    //check if user's refreshToken exists, remember a user is added with a refreshToken in the database
    const userExisting = User.findOne({ refreshToken }).exec();//pass the const refreshToken here
    if(!userExisting) return res.sendStatus(403); //if no refreshToken send Forbidden status
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) =>{
            if(err || userExisting.username !== decoded.username) return res.sendStatus(403); //Forbidden, username was encoded into refreshToken
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "username": decoded.username, //same user verified before
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '40s'} //ensure you change yours to something like 5 min, this is for testing
            );
            res.json({ accessToken })
        }
    );
}
module.exports = { handleRefreshToken }; //in object for easy export