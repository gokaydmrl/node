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
var redis = __toESM(require("redis"));
var import_connect_redis = __toESM(require("connect-redis"));
console.log("ne yazmak isterseasdasdn");
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
var RedisStore = (0, import_connect_redis.default)(import_express_session.default);
var redisClient = redis.createClient({
  legacyMode: true,
  url: "redis://localhost:6379/"
});
app.use(
  (0, import_express_session.default)({
    store: new RedisStore({ client: redisClient }),
    name: "deneme",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 6e5
    }
  })
);
redisClient.connect();
redisClient.on("error", function(err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function() {
  console.log("Connected to redis successfully");
});
async function isAuthenticated(req, res, next) {
  const isLogged = await redisClient.get("isAuth", (err, data) => {
    if (err) {
      console.log("err redis", err);
      return;
    }
    console.log("data", data);
    next();
  });
}
app.get("/", isAuthenticated, (req, res) => {
  console.log("getlendi");
  res.send("Welcome User");
});
app.post("/login", (req, res) => {
  const { name } = req.body;
  const includes = users.find((user) => user.fName === name);
  if (includes) {
    req.session.userName = name;
    req.session.isAuth = true;
    redisClient.set("userName", name);
    redisClient.set("isAuth", "true");
    console.log(`${name} exists`);
    console.log("req session login", req.session);
  } else {
    req.session.isAuth = false;
    console.log("not loggedin");
  }
  res.send();
});
app.listen(3001, () => {
  console.log("express server is running on port 3001");
});
