//this ensures that the refreshToken is deleted when a user logs out before the 1day period
//also accessToken removed from front end
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleLogout = async(req, res)=>{
      //on client side also delete/set to blank accessToken in memory of clients applications
    //checking if either cookies and jwt properties are not available
  if (!cookies.jwt) return res.sendStatus(204); //no content to send back

  //now we know that we have a refreshToken within the cookies
  const refreshToken = cookies.jwt;

  //checking if user refreshToken exists, remember when a user is added, they are added with a refreshToken now, we now check that and not the user and the password
  const userExisting = User.findOne({ refreshToken }).exec();//pass the const refreshToken here

  //if we dont find the user refreshToken we send forbidden status but there is cookie we delete it
  if (!userExisting) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); //success no content
  }
  //now we delete refreshToken in database
 userExisting.refreshToken = '';
 const result = await userExisting.save();
 console.log(result);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  }); //add secure: true in production to make it use https
  res.sendStatus(204); //no content to send back
};
module.exports = { handleLogout }; //in object for easy export and avoid errors
