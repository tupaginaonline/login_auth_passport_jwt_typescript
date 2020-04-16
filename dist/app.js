"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./passport"));
const users = [];
// initialization
const app = express_1.default();
// settings
app.set('port', process.env.PORT || 4000);
// middlewares
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_2.default(users);
// routes
app.get('/', (req, res) => {
    res.send('Welcome to my API REST JWT');
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: "Missing fields..." });
    }
    try {
        const user = users.find(user => user.email === email);
        if (user == null) {
            return res.status(400).json({ msg: "Email not match" });
        }
        else {
            if (yield bcrypt_1.default.compare(password, user.password)) {
                //console.log(process.env.ACCESS_TOKEN_SECRET);
                const jwtSecret = jsonwebtoken_1.default.sign(user, `${process.env.ACCESS_TOKEN_SECRET}`);
                return res.status(200).json({ token: jwtSecret });
            }
            else {
                return res.status(400).json({ msg: "Password not match" });
            }
        }
    }
    catch (_a) {
        res.status(500).json({ msg: "Error" });
    }
}));
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.names || !req.body.email || !req.body.password) {
        return res.status(400).json({ msg: "Missing fields..." });
    }
    const { names, email, password } = req.body;
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        users.push({
            id: uuid_1.v4(),
            names,
            email,
            password: hash
        });
        return res.status(201).json({ msg: "Created successfully" });
    }
    catch (_b) {
        return res.status(500).json({ msg: "Error" });
    }
}));
// router privated
app.get("/admin", passport_1.default.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ msg: "ADMINISTRATION PANEL", users });
});
exports.default = app;
