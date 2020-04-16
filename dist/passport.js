"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
function passportJWT(users) {
    passport_1.default.use(new passport_jwt_1.Strategy({
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET
    }, (payload, done) => {
        const user = users.find(user => user.id === payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }));
}
exports.default = passportJWT;
