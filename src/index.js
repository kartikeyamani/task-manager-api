const express=require('express')

require('./db/mongoose')
const multer=require('multer')

const karthik=require('./routes/tasks')
const router = require('./routes/user')
const app=express()
const port=process.env.PORT


// app.use((req,res,next)=>{
//   res.send("The server is under maintenance so please hold for sometime")
// })

app.use(express.json())
//The above one liner is going to get the object which is sent and convert it to the object so that we can access it easily.


//Setting up Router is best rather than putting all the routes in index.js
// const router=new express.Router()
// router.get('/raw',(req,res)=>{
//     res.send("this is cool")
// })
// app.use(router)
app.use(router)
app.use(karthik)
//Multer is used to upload files.
//Node js doesn't allow files to upload directly so we need to use npm library multer to convert image data to binary and then use it to pass

const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter: (req,file,cb)=>{
        // cb(new Error('File must be a pdf'))
        if(!file.originalname.match('/(.docx|.dox)$/')){
            cb(new Error('Please upload a document'))
        }
        cb(undefined,true)
    }
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})






//Passwords needed to be stored in as Hashing algorithms rather than storing it directly.
//Beacause if database gets hacked then passwords are exposed so we need to store it after hashing is done.
//For performing hashing we need to install bcrypt from npm.

// const bcrypt=require('bcrypt')
// const myfunc=async()=>{
//     const password='Msdhoni@7'
//     const hashedpassword=await bcrypt.hash(password,8)
//     //To add salt 8 is best number recommended by bcrypt creator for easy decoding.
//     console.log(hashedpassword)
//    console.log( await bcrypt.compare(password,hashedpassword))
// }
// myfunc()

app.listen(port,()=>{
    console.log("Web page is open on port",port)
})

//We need to link up the tasks to the owners who created them for that purpose only we placed a new property owner,
// which holds the id of the owner of that particular task
//Now by using the id which is present in the tasks we will fetch the entire property of that particular owner.
//  const Task=require('./models/tasks')
// const main=async ()=>{
//     const task=await Task.findById('61c9f2ca1ed7de0dd1906f38')
//     await task.populate('owner')
//     console.log(task.owner)
// }
//Similarly to connect user with the tasks 
// const user=require('./models/users')
// const main=async()=>{
//     const User=await user.findById('61c9f2c21ed7de0dd1906f32')
//    await User.populate('tasks')
//    console.log(User.tasks)
// }

// main()