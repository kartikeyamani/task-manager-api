const  express=require('express')
const sharp=require('sharp')
const router = new express.Router()
const User=require('../models/users')
const bcrypt=require('bcrypt')
const auth=require('../middleware/auth')
const{ sendWelcomeEmail,sendcancellationEmail}=require('../Emails/accounts')

router.post('/users',async(req,res)=>{
    //If we use async &await here then it'll reduce the code repetition & allow us to write a simple code.
    const man=new User(req.body)
    try {
        await man.save()
        sendWelcomeEmail(man.email,man.name)
        const token= await man.generateAuthToken()
        res.status(201).send({man,token})
    } catch (e) {
             res.status(400).send()
             console.log(e)
         }
})


router.post('/users/login',async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
    const token=await user.generateAuthToken()
     res.send({ user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})
//This route helps us in logging out from a single device when you're logged in from many devices.
router.post('/users/logout',auth,async (req,res)=>{
    try {
       req.me.tokens=req.me.tokens.filter((token)=>{
           return token.token!=req.token
       })
       await req.me.save()
       
       res.status(200).send("Logged out successfully")
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})
//This route helps to logout from all devices in which you're logged in.
router.post('/users/logoutall',auth,async (req,res)=>{
    try {
      req.me.tokens=[]
      await req.me.save()
      res.status(200).send("Logged out from all devices")
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})


router.get('/users/me',auth,async(req,res)=>{
    try {
        res.send(req.me)
    } catch (error) {
        res.status(400).send(error)
    }
    



    // User.find({}).then((value)=>{
    //     if(!value){
    //         return  res.status(404).send()
    //     }
    //     res.send(value)
    // }).catch((e)=>{
    //         res.status(401).send(e)
    // })
})



router.delete('/users/me',auth,async(req,res)=>{
    try {
       await sendcancellationEmail(req.me.email,req.me.name)
        await req.me.remove()
        res.status(200).send(req.me)
    } catch (e) {
        res.status(401).send()
        console.log(e)
    }
})

router.patch('/users/me',auth,async(req,res)=>{
    
    //Now youll have values which are to be updated in req.body and it's an object.
    //So convert that object into array of object & check whether that is present in the allowed objects or not.

    const needtobeupdated=Object.keys(req.body)
    const allowedupdates=["name","age","email","password"]
    const success=needtobeupdated.every((updates)=>{
       return allowedupdates.includes(updates)
    })
        if(!success){
           return res.status(404).send("Invalid operator is being updated")
        }

    try {
        //const nam=await User.findById(req.params.id)
        
        needtobeupdated.forEach((update)=>{
            //console.log(nam[update])
            req.me[update]=req.body[update]

            //console.log(nam[update])
            //console.log(req.body[update])
        })
        await req.me.save()

        //const sum5=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        res.status(200).send(req.me)
    } catch (error) {
        res.status(401).send(error)
    }

    //If you update any attribute that doesn't exist then it'll just ignore the attribute so we should manually write a code which throws an error when attributes which are not present are entered.

})
const multer=require('multer')
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter: (req,file,cb)=>{
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload a image file'))
        }
        cb(undefined,true)
    }
})

router.post("/users/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
   req.me.avatar=buffer
   await req.me.save()
   res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})
//In the above multer function if we remove the destination "dest" from the function then it'll not
//directly save the files to the dest file but it'll give the files to the call back function so that the file
//can be accessed with the function & changes can be made through it.

router.delete("/users/me/avatar",auth,async(req,res)=>{
    req.me.avatar=undefined
    await req.me.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get("/users/:id/avatar",async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)
    if(!user || !user.avatar){
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
    
})
module.exports=router