const mongoose =require('mongoose')
const validator =require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const karthik=require('./tasks')
require('dotenv').config()

//Internally mongoose converts to schema first and then to a new model.
//We'll create a schema and pass it to mongoose.model so that we can use middleware.
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                console.log(Error("Age must be a positive integer"))
            }
        }
    },
    email:{
        type:String,
        required :true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                console.log(Error("Invalid Email"))
            }
        }
    },
    password:{
        type:String,
        required :true,
        trim: true,
        validate(value){
            if(value.length<6){
                console.log(Error("Password length must be minimum 6 characters"))
            }
            if(value.toLowerCase().includes('password')){
                console.log("Password cannot contain password")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userschema.virtual('tasks',{
    ref:'taskup',
    localField:'_id',
    foreignField:'owner'
})
//userschema.pre() to run a code before something event has occurred.
//userschema.post() to run a code something after some event has occurred.
userschema.pre('save',async function (next) {
    const user =this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})
//this function is to generate auth token & give it to user.
//it is similar to findbycredentials function but we are not accessing this on all User model.
//So instead of userschema.statics use userchema.methods because we are accesing instance not model.
userschema.methods.generateAuthToken =async function () {
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.SECRET_KEY)
    user.tokens=user.tokens.concat({ token })
    // console.log(token)
    await user.save()
    return token
}
//Finding routes with/without middleware
//With Middleware---> do something--->execute the route handler
//Without middle ware-->execute the route handler
userschema.methods.toJSON= function(){
    const user=this
    const Userobject=user.toObject()

    delete Userobject.password
    delete Userobject.tokens
    delete Userobject.avatar
    return Userobject
}


//to find the user we are defining a function so that it becomes easy & we can use it wherever we need it.
//For defining the function which is called in the routes method we need to define it differently
userschema.statics.findByCredentials=async(email,password)=>{
    const emailfound=await user.findOne({ email })
    if(!emailfound){
        throw new Error('Unable to fetch the user')
    } 
    const isMatch=await bcrypt.compare(password,emailfound.password)
    if(!isMatch){
        return Error('Please Enter correct password')
    }
    return emailfound;
}
userschema.pre('remove',async function(next) {
    const user=this
    await karthik.deleteMany({owner:user._id})
    next()
})

const user=mongoose.model('user',userschema)

module.exports=user