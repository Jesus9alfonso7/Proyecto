const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Food = require("../models/Food");
const Reservacion = require("../models/Reservacion");
const jwt =  require('jsonwebtoken')
const config = require('../config');
const verifyToken = require("./verifyToken");
const path = require("path");
const cookieParser = require("cookie-parser");


//AIzaSyDSnK-FHq-0zFgAw9iAK-g07WLS3pfNqqE
//let url = "https://api.edamam.com/api/food-database/parser?ingr="+ search+"&app_id=8b6fdcb4&app_key=c62c55ca66c96e5a829eba67ab76a3f5";
// Para que el usuario se registre
router.post("/signup",async (req,res,next)=>{
     const {username,email,password} = req.body
   
    const user = new User({
        username:username,
        email: email,
        password: password
    });
    
   user.password = await user.encryptPassword(user.password);
  await user.save();
   const token =  jwt.sign({id:user._id ,
                            idAdmin:true,
},config.secret,{
        expiresIn: 60*60*24
    })
    res.redirect('/menuAdmin')
})

// Para que el usuario haga login
router.post("/signin",async (req,res,next)=>{
    console.log(req.body)
    const {email,password} = req.body;
   
    const user = await User.findOne({email:email});
    console.log(email,password)
    if (!user){
        res.redirect('/admin')
    }
    else {
      const valid =  await user.validatePassword(password)
      if (!valid){
          return res.status(401).json({auth:false,token:null});
      }
      else {
       const token =  jwt.sign({id:user._id}, config.secret,{
            expiresIn: 60*60*24
        })
        res.cookie('token', token , {
            httpOnly:true,
            maxAge: 3000000
        })
     res.redirect('/menuAdmin')

      }
      
    }
})

router.post("/newDish",async (req,res,next)=>{

    const {name,price,calories, protein,fat, description, img} = req.body;
   
    const food = new Food({
       name:name,
       price:price,
       calories: calories,
       protein: protein,
       fat: fat,
       img: img,
       description: description,
   });
 await food.save();

   res.redirect('/menuAdmin')
})

router.post("/deleteDish", (req,res,next)=>{
    console.log(req.body);
    console.log("asd");
    Food.findOneAndRemove({name: req.body.dish}).then(response => {
        console.log(response)
    })
    .catch(err =>{
        console.error(err)
    })
   res.redirect('/menuAdmin')
})

router.get("/profile",verifyToken, async (req,res,next)=>{
     
     const user = await User.findById(req.userId,{password:0});
     if(!user){
         return res.status(404).send("No user found");
     }
     else {
         res.json(user);
     }
    
})

router.get("/logout", (req,res)=>{
     res.cookie("token","",{
       maxAge:-1
     }) ;
     res.redirect("/");
})


router.get("/", (req,res)=>{
    res.render('home');
   
})

router.get("/home", (req,res)=>{
  
    res.render('home');
    
})

router.get("/menu", async(req,res)=>{
    const foods = await Food.find();
    res.render('menu', {foods}); 
})

router.get("/about", (req,res)=>{
    res.render('about');
    
})

router.get("/contacto", (req,res)=>{
    res.render('contacto');
    
})

router.get("/reservar", (req,res)=>{
    res.render('reservar');
    
})

router.get("/admin",(req,res)=>{
    res.render('Login');
    
})

router.get("/register",(req,res)=>{
    res.render('register');
    
})
//Food.find({price:23});
router.get("/menuAdmin",verifyToken, async (req,res)=>{
    const foods = await Food.find();
    res.render('menuAdmin', {foods});
    
})

router.get("/reservarAdmin",verifyToken, async (req,res)=>{
    const reservaciones = await Reservacion.find();


    res.render('reservarAdmin', {reservaciones});
   
})

router.post("/nuevaReserva",async (req,res,next)=>{
    console.log(req.body);
    const {date, horaReserva, nombrePersona, apellidoPersona, numeroPersonas, telefono, correo} = req.body;
    await Reservacion.find();

    const reservacion = new Reservacion ({
        nombre: nombrePersona, 
        apellido: apellidoPersona,
        numPersonas: numeroPersonas, 
        fecha: date,
        año: parseInt(date[6]+date[7]+date[8]+date[9]),
        mes:parseInt(date[0]+date[1]),
        dia: parseInt(date[3]+date[4]),
        hora: parseInt(horaReserva[0]+horaReserva[1]),
        minuto: parseInt(horaReserva[3]+horaReserva[4]),
        numeroTelefono: telefono,
        email: correo

    });


   await reservacion.save();

   res.redirect('/reservar')
})




module.exports = router;

