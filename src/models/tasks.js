const mongoose =require('mongoose')

const taskschema=mongoose.Schema({
  Title:{
    type:String,
    required:true,
    trim:true
  },
  Description:{
       type:String,
       required:true,
       trim:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'user'
  },
  completed:{
     type:String,
     required:true
  }
},{
  timestamps:true
})

const task=mongoose.model('taskup',taskschema)



module.exports=task