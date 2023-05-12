const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res)=>{
    const {user, pswd} = req.body;
    if(!user || !pswd) return res.status(400).json({"message": "username and password are required"});

    //checking if user exists
    const userExisting = User.findOne({username: user}).exec();
    if(!userExisting) return res.sendStatus(409); //conflict
    const match = await bcrypt.compare(pswd, userExisting.password);
    if(match){
        //here jwt are created to protect routes
        //accessToken
        const accessToken = jwt.sign(
            //here we pass an object with username, not password
            { username: userExisting.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "40s" }//should be 5min or more if app in production
          );
          //refreshToken
          const refreshToken = jwt.sign(
            //here we pass an object with username, not password
            { username: userExisting.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );
          //saving refreshToken with current user
          userExisting.refreshToken = refreshToken;
          const result = await userExisting.save();
          console.log(result);

     //for front end the accessToken should be in memory(short life span like 15 min), not secured in local storage and any cookie that can be accessed by JS, or anything that JS can access is not secured
    //also setting a cookie as http only, not available to JS, not 100% secured but it's much secured
    res.cookie("jwt", refreshToken, {
        //same Site and secure are added to enable cross site with the front end
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 1000,
      }); //maxAge is 24hrs
      res.json({ accessToken }); //front end developer can grab
  
    }else{
        res.sendStatus(401); //Unauthorized
    }
}
module.exports = {handleLogin}; //in object for easy export






















// const register = (req, res, next) => {
//     bcrypt.hash(req.boy.password, 10, function(err, hasedPass){
//         if(err) {
//             res.json({
//                 error: err
//             })
//         }

//         let user = new User ({
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             password: hashedPass
//         })
//         user.save()
//         .then(user => {
//             res.json({
//                 message:'An error occures!'
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: 'An error occured!'
//             })
//         })
//     }) 
// }

// const login = (req, res, next) => {
//     var username = req.body.username
//     var password = req.body.password

//     User.findOne({$or: [{email:username},{phone:username}]})
//     .then(user => {
//         if(user){
//             bcrypt.compare(password, user.password, function(err, result){
//                 if(err){
//                     res.json({
//                         error: err
//                     })
//                 }
//                 if(result){
//                     let token = jwt.sign({name: user.name},'verySecretValue', {expiresIn: '48h'})
//                     res.json({
//                         message: 'Login Successfully',
//                         token
//                     })
//                 }else{
//                     res.json({
//                         message: 'Password does not match!'
//                     })
//                 }
//             })
//         }else {
//             res.json({
//                 message: 'No user found!'
//             })
//         }
//     })
// }
// module.exports = {
//     register, login
// }