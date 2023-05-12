const User = require('../models/User');
const bcrypt = require('bycrypt');

const handleNewUser = async(req, res)=>{
    //destructuring user and password
    const {user, pswd} = req.body;
    if(!user || !pswd) return res.sendStatus(400).json({"message": "username and password are required"});

    //check if user credentials already exist in the database
    const duplicate = User.findOne({username: user}).exec(); //the exec method is required here,
    if(duplicate) return res.sendStatus(409); //conflict

    //no duplicate?
    try {
        const hashedPswd = await bcrypt.hash(pswd, 10); //salt an hashed added, makes difficult to be hacked

        //store username in Mongo, id will be created by mongo automatically, also for user roles can be created in the database, not included in the schema model
        const result = await User.create({
            "username": user,
            "password": hashedPswd
        })
        console.log(result);
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
}
//export function
module.exports = {handleNewUser}; //put this in object for easy exporting