const jwt=require('jsonwebtoken')
const User=require('../models/users')
require('dotenv').config()
const auth=async (req,res,next)=>{
    try {
        const token=req.header('Authorization').replace('Bearer ','')
        const user= jwt.verify(token,process.env.SECRET_KEY)
        //console.log(user)
        const required=await User.findOne({"_id":user._id,"tokens.token":token})
        if(!required){
            throw new Error("User Not found")
        }
        req.token=token
        req.me=required
        //console.log(required)
        next()
    } catch (e) {
        res.status(400).send()
        console.log(e)
    }
   
    
}

module.exports= auth