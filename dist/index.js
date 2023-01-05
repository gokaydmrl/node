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
app.use(
  (0, import_express_session.default)({
    name: "deneme",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 6e5,
      sameSite: "strict"
    }
  })
);
app.get("/", (req, res) => {
  console.log("req.session.page_views", req.session.page_views);
  console.log("req.session", req.session);
  if (req.session.page_views) {
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});
app.get("/login", (req, res) => {
  console.log("this is sess", req.session.cookie);
  req.session.name = "asd";
  if (req.session) {
    res.send("Welcome User");
  } else
    res.send("no welc");
});
app.post("/login", (req, res) => {
  const { name } = req.body;
  if (name === "name") {
    req.session.name = name;
    console.log("success");
  }
});
app.listen(3001, () => {
  console.log("express server is running on port 3001");
});
