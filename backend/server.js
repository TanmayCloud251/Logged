import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import {User} from "./user.model.js"
import nodemailer from "nodemailer"
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();
const app = express();

//middleware to parse data in json format
app.use(bodyParser.json());

//CrossOriginResourceSharing allows to share resources even in different ports
app.use(cors());

//connection of mongo
mongoose.connect(`${process.env.MONGODB_URI}`,{
    useUnifiedTopology: true, //These are used for 
    useNewUrlParser: true     //smoothing the performance on mongoDB
}).then(()=>{
    console.log("DB Connected!!!")
}).catch((err)=>{
    console.error(err)
});

//get request (not usefull in this particular app) used for getting data from server to client
app.get("/",(req,res)=>{
    res.send("Server Kaam Kar raha hai")
})

//for setting up a port in which the app can run
app.listen(process.env.PORT,()=>{
    console.log(`Server ${process.env.PORT} me chal raha`)
})

//post used to send data to server
app.post("/register", async (req,res)=>{
    
     if(!req.body || !req.body.name || !req.body.age || !req.body.email) {
        return res.status(400).send("Invalid request body");
    }

    const{ name, age, email} = req.body;

    try{
        
        const newUser = new User({ name, age, email})
        
        await newUser.save();   

        await sendEmail(email);

        res.status(201).send("User registerd")
    }catch(err){
        console.log(err)
        res.status(501).send("Error while registering")
    }
    
    function sendEmail(email){
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.MYEMAIL,
                pass: process.env.EPASS
            }
        });
        
        const MailOptions = {
            from: process.env.MYEMAIL,
            to : email,
            subject: "Registration completed",
            text: `Thanks for registering!!! ${name}
            these are the info you provided 
            Name: ${name}
            Age: ${age}
            email: ${email}
            ` 
        };
         transport.sendMail(MailOptions, (err, info)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Email sent:  "+ info.response);
            }
        });
    }
})