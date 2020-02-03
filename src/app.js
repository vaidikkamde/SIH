const geocode=require("./utils/geocode")
const express =require("express")
const multer=require("multer")
const Clarifai=require("clarifai")
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const nodemailer=require("nodemailer");
const path=require("path")

const upload = multer()
const app=express()

// socket = io.listen(process.env.PORT);

// const port=process.env.PORT||3000

const publicDirectoryPath=path.join(__dirname,'../public')
const clarifai = new Clarifai.App({
    apiKey: "240bebc6527b4e9f8d6c5d6413fce30c"
  })


  const port = app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port %d in %s mode', port.address().port, app.settings.env);
  });

  const io = require('socket.io')(port);
  io.on('connection', function(socket){
    console.log('a user connected');
  });

  require('dotenv').config()
  const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
var rand;
app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
  extended: true
}));
var transporter = nodemailer.createTransport({
  service: 'sendinblue',
  auth: {
    user: 'harjotscs@gmail.com',
    pass: 'yLEv0UCpDSHKBZqr'
  }
});
mongoose.connect("mongodb+srv://admin-dot:test123@cluster0-jdmy6.mongodb.net/formDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://admin-dot:test123@cluster0-jdmy6.mongodb.net/contactDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex",true);
const formSchema = new mongoose.Schema ({
  firstName:String,
  lastName:String,
  email: String,
  mobileNumber:String,
  resAddress:String,
  crimeAddress:String,
  crimeDate:String,
  crimeTime:String,
  criminalName:String,
  criminalAddress:String,
  crimeSummary:String,
  verifyRand:String,
  // verified:Boolean

});
const contactSchema = new mongoose.Schema({
  name:String,
  message:String,
  email:String
});
const Contact = new mongoose.model("Contact",formSchema);
const Form = new mongoose.model("Form", formSchema);
app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.post("/contactSubmit",(req,res)=>{
  const newContact = new Contact({
  name:req.body.name,
  email:req.body.email,
  message:req.body.message
});
newContact.save(function(err){
  if (err) {
    console.log(err);
  } else {
    res.render("index");
  }
});
});

const apiai = require('apiai')(APIAI_TOKEN);


app.get('/chat', (req, res) => {
  res.render('chat.hbs');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();
  });
});



app.get('/contact',(req,res)=>{
    res.render('contact')
})

app.get('/manualReport',(req,res)=>{
    res.render('mreport')
})

app.get('/Realtimereport',(req,res)=>{
    res.render('areport')
})

app.get("/suspect", (req, res) => {
    res.render('suspect')
})
app.post("/upload", upload.single("photo"), (req, res) => {
  rand=Math.floor((Math.random() * 100) + 54);
    const base64String = Buffer.from(req.file.buffer).toString("base64")
    clarifai.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
        .then(generalModel => {
          return generalModel.predict(base64String);
        }).then(response => {
          var concepts = response['outputs'][0]['data']['concepts']
          res.render('out',{
            new:'Created By Harjot Singh',
            concepts: response.outputs[0].data.concepts,
            image: base64String
          })
      },
      err => {
        console.log(err)
      }
    )
})



app.post("/formSubmit",(req,res)=>{
  const newForm =  new Form({
    firstName:req.body.firstname,
    lastName:req.body.lastname,
    email:req.body.email,
    mobileNumber:req.body.mobilenumber,
    resAddress:req.body.address,
    crimeAddress:req.body.crimeAddress,
    crimeDate:req.body.crimedate,
    crimeTime:req.body.crimetime,
    criminalName:req.body.criminalname,
    criminalAddress:req.body.criminaladdress,
    crimeSummary:req.body.crimesummary,
    verifyRand:rand,

  });
  newForm.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("index");
    }
  });
})


app.get('/sendotp',(req,res)=>{
  if (!req.query.email)
  { 
      return res.send({
          error:'You must provide an E-mail id'
      })
  }
  else{
    
    host=req.get('host');
    var rand="global"
    var rand=Math.floor((1000+Math.random() * 9999) + 54); 
    link="http://"+req.get('host')+"/verify?id="+rand;
    var mailOptions = {
      from: 'coderharjot@gmail.com',
      to: req.query.email,
      subject: 'Your OTP for Crime Report',
      html : "Hello,<br><h1>Your OTP is</h1>&nbsp;&nbsp;<h1>"+rand+"</h1>"
    };
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        return res.send({
          info:"E-mail Sent Successfully",
          key:rand
        })
      }
    });
  }
})


app.get('/verify',(req,res)=>{
  if(!req.query.otp){
    return res.send({
      error:'OTP Not Found'
  })
  }
  else if(req.query.otp==='true')
  {
    return res.render('mreport',{
      fail:'OTP Matched'
    })
  }
  else{
    return res.render('mreport',{
      Success:'OTP Not Matched'
    })
  }
})


app.get('/location',(req,res)=>{
    res.render('location')
})

app.get('/getlocation',(req,res)=>{
    if (!req.query.geo)
    {
        return res.send({
            error:'You must provide an address'
        })
    }
    else{
        geocode(req.query.geo,(error,{address}={})=>{
            if(error){
                return res.send({
                    error:error
                })
            }
            else{
                return res.send({
                    address:address
                                })
                }

        })
    }
})


app.get('/*',(req,res)=>{
    res.render('404',{
        title:'404',
      message:'Page not Found',
      name:'Harjot Singh'
    })
})

