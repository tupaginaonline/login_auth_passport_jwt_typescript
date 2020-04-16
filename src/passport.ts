import dotenv  from 'dotenv';
dotenv.config();
import passport  from 'passport';
import {Strategy , ExtractJwt }  from 'passport-jwt';
import {IUser} from './interfaces';

 
 export default  function passportJWT(users:IUser[]) {
 
passport.use(new Strategy( {
		 
		 jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
		 secretOrKey : process.env.ACCESS_TOKEN_SECRET
		 
	 }, ( payload, done ) => {
		 
		
		const user =  users.find( user => user.id===payload.id );
		
		if(user){
			return done(null,user);
		}
		return done(null,false);
		 
	 })
	 );
 
 }