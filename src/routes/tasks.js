const auth=require('../middleware/auth')
const express=require('express')
const router = new express.Router()

const karthik = require('../models/tasks')
router.post('/tasks',auth,async(req,res)=>{
    const mani=new karthik({
        ...req.body,
        owner:req.me._id
    })
    try {
        await mani.save() 
        res.status(201).send(mani)
    } catch (error) {
        res.status(400).send()
        console.log(error)
    }
})


//sort=createdAt:asc
router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed
    }
    if(req.query.sortby){
       const parts= req.query.sortby.split(":")
       sort[parts[0]]=parts[1]==="asc"?1:-1 
    }
    try {
        await req.me.populate({
           path:'tasks',
           match,
           options:{
             limit:parseInt(req.query.limit),
             skip:parseInt(req.query.skip),
             sort
           }
       })
       res.status(200).send(req.me.tasks)
    } catch (error) {
        res.send(401).send(error)
        console.log(error)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try {
        const sum4=await karthik.findOne({_id,owner:req.me._id})
        if(!sum4){
            res.status(404).send()
        }
        res.send(sum4)
    } catch (error) {
        res.status(401).send(error)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdates=['Title','Description']
    const binary =updates.every((update)=>{
       return allowedupdates.includes(update)
    })
    if(!binary){
      return  res.status(401).send("Attribute not present")
    }
    try {
        const sum6=await karthik.findOne({_id:req.params.id,owner:req.me._id})
        //const sum6=await karthik.findById(req.params.id)
        
        if(!sum6){
           return res.status(404).send()
        }
        updates.forEach((update)=>{
            sum6[update]=req.body[update]
        })
        await sum6.save()
        res.status(200).send(sum6)

    } catch (error) {
        res.status(400).send(error)
    }
})



router.delete('/tasks/:id',auth,async(req,res)=>{
    try {
        const sum8=await karthik.findOneAndDelete({_id:req.params.id,owner:req.me._id})
        //const sum8=await karthik.findByIdAndDelete(req.params.id)
        if(!sum8){
            return res.status(404).send()
        }
        res.status(200).send(sum8)
    } catch (error) {
        res.status(401).send(error)
    }
})


module.exports = router