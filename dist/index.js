var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_express_session = __toESM(require("express-session"));
console.log("ne yazmak istersen");
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use((0, import_cors.default)());
app.set("trust proxy", 1);
var users = [
  {
    fName: "g\xF6kay",
    email: "abc@gmail.com",
    userID: 1
  }
];
app.use(
  (0, import_express_session.default)({
    name: "deneme",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 6e5,
      sameSite: "strict"
    }
  })
);
app.get("/", (req, res) => {
  console.log("this is sess", req.session.cookie);
  console.log("req.session.", req.session.isAuth);
  if (req.session.isAuth) {
    res.send("Welcome User");
  } else
    res.send("no welc");
});
app.post("/login", (req, res) => {
  const { name } = req.body;
  for (var x = 0; x < users.length; x++) {
    if (users[x].fName.includes(name)) {
      req.session.isAuth = true;
      console.log(`${name} exists`);
      console.log("req.session.isAuth", req.session.isAuth);
    } else {
      req.session.isAuth = false;
      console.log("not loggedin");
      console.log("req.session.isAuth", req.session.isAuth);
    }
  }
});
app.listen(3001, () => {
  console.log("express server is running on port 3001");
});
