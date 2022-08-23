const express = require("express");
const ejs =require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/orderDB",{useNewUrlParser:true});
const orderSchema= new mongoose.Schema({
name:{
  type:String,
  required: [true, 'Please Enter Name']
},
volume:{
  type:Number,
  min:[1,"Minimum Amount 1L"],
  required: [true, 'Please Enter Volume in L']
},

date:{
  type:String,
  validate:{
  validator: function(v) {
        return /\d{2}-\d{2}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid date in form DD-MM-YYYY!`
    },
    required: [true, 'Date required']
  }
}
)

const Order=mongoose.model("Order",orderSchema);

app.route("/orders")

.get(function(req,res){
  Order.find({date:req.body.date},function(err,result){
    if(err){
      console.log(err);}
      else
      res.send(result);

  })
})


.post(function(req,res){
  console.log(req.body.name);
  console.log(req.body.volume);
  console.log(req.body.date);

  const order=new Order({
    name:req.body.name,
    volume:req.body.volume,
    date:req.body.date
  })
  order.save(function(err){
    if(err)
    res.send(err);
    else
    res.send("Successful");
  })
})

.put(function(req,res){
  Order.update({name:req.body.name},{$set:{name:req.body.name,volume:req.body.volume,date:req.body.date}},{overwrite:true},function(err){
    if(err)
    console.log(err);
    else
    res.send("Successfully Updated");
  })
})

.delete(function(req,res){
  Order.deleteMany({name:req.body.name,date:req.body.date},function(err){
    if(err){
      res.send(err);
      console.log(err);
    }else{
      console.log("Successful");
      res.send("Successful");

    }
  })
})


app.listen(3000,function(req,res){
  console.log("Server Running");
})
