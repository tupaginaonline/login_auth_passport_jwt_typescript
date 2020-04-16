import dotenv  from 'dotenv';
dotenv.config();

import express, {Application} from 'express';
import {v4 as uuid}  from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJWT from './passport'
import {IUser} from './interfaces';


const users:IUser[] = [];

// initialization

const app:Application = express();

// settings

app.set('port', process.env.PORT || 4000);

// middlewares

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(passport.initialize());

passportJWT(users);

// routes

app.get('/', (req,res) => {
	res.send('Welcome to my API REST JWT');
});


app.post('/login', async (req, res) => {
	
	
	const { email, password } = req.body;
	
	if( !req.body.email  || !req.body.password  ){
		return res.status(400).json({msg:"Missing fields..."});
	}
	
	try{
		
		const user:IUser | undefined = users.find(  user  =>  user.email===email   );
		
		if(user==null)
		{
			return res.status(400).json({msg:"Email not match"});
			
		}else{
			
		     if(await bcrypt.compare(password, user.password))
			 {
				
				//console.log(process.env.ACCESS_TOKEN_SECRET);
				const jwtSecret = jwt.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`);
				
				return res.status(200).json({token:jwtSecret})  ;    
			 }else{
				 return res.status(400).json({msg:"Password not match"});
			 }
		}
		
	}catch{
		
		res.status(500).json({msg:"Error"});
		
	}
	
});


app.post('/register', async(req, res ) => {
	
	
	if( !req.body.names  || !req.body.email || !req.body.password ){
		return res.status(400).json({msg:"Missing fields..."});
	}
	const { names, email , password } = req.body;
    
	try{
		 const hash = await bcrypt.hash(password,10);
		 
		 users.push({
			 id:uuid(),
			 names,
			 email,
			 password:hash
		 });
		 
		 return res.status(201).json({msg:"Created successfully"});
		
	}catch{
		return res.status(500).json({msg:"Error"});
	}
   
});


// router privated

app.get("/admin", passport.authenticate("jwt", {session:false}) , (req, res) => {
	res.json({ msg:"ADMINISTRATION PANEL", users });
})

export default app;