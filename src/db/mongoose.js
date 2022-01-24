//connecting to the databse with the mongoose server

const mongoose =require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
})
// Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false.
// Please remove these options from your code.





// At first You need to create a model
// const user=mongoose.model('user',{
//     name:{
//         type:String
//     },
//     age:{
//         type:Number
//     }
// })

// //Now you have a model created b the name user

// //After that you need to create an instance for that model

// const me=new user({
//     name:"karthikeya",
//     age:20
// })
// //Now the instance for the model is created but we didnot save the data anywhere


// //And at last you need to save the model to the database
// me.save().then(()=>{
//   console.log(me)
// }).catch((error)=>{
//   console.log(error)
// })

//Creating another new model

// const man=mongoose.model('man',{
//     name:{
//         type:String
//     },
//     age:{
//         type:Number
//     }
// })
// //create a new instance using this model
// const ah=new man({
//     name:"mani_babu",
//     age:27
// })

// //save the instance in the database
// ah.save().then(()=>{
// console.log(ah)
// }).catch((error)=>{
//  console.log(error)
// })


//Validator is the one which validates whether the paramter is reuired or optional
//In Mongoose there are not much Built-in validators but we can create our own custom validators and we can use them


//Creating another new model
//Creating a custom validator

//create a new instance using this model
// const ah=new man({
//     name:"mani_babu",
//     age:20,
//     email:"Kartikeyamani@gmail.com",
//     password:"password"
// })

//save the instance in the database
// ah.save().then(()=>{
// console.log(ah)
// }).catch((error)=>{
//  console.log(error)
// })

//Now as there are not much validators in the Built-in mongoose so you need to install npm validator library 


//trim:true --> removes the extra spaces if there are any