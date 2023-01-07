console.log("ne yazmak isterseasdasdn");
// npm run dev
import express, { Application, Request, Response } from "express";
import cors from "cors";
import session, { SessionData } from "express-session";
import * as redis from "redis";
import connectRedis from "connect-redis";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.set("trust proxy", 1); // trust first proxy

declare module "express-session" {
  interface SessionData {
    userName: string;
    userID: number;
    page_views: number;
    isAuth: boolean;
  }
}

interface UserType {
  fName: string;
  email: string;
  userID: number;
}

const users: UserType[] = [
  {
    fName: "gökay",
    email: "abc@gmail.com",
    userID: 1,
  },
];

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  legacyMode: true,
  url: "redis://localhost:6379/",
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    name: "deneme",
    secret: "secret",
    resave: false, //
    saveUninitialized: true,
    cookie: {
      secure: false, // This will only work if you have https enabled!
      maxAge: 600000,
    },
  })
);
redisClient.connect();
redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function () {
  console.log("Connected to redis successfully");
});

// app.get("/", (req: Request, res: Response) => {
//   console.log("req.session.page_views", req.session.page_views);

//   console.log("req.session", req.session);

//   if (req.session.page_views) {
//     req.session.page_views++;
//     res.send("You visited this page " + req.session.page_views + " times");
//     req.session.userName = "abc";
//   } else {
//     req.session.page_views = 1;
//     res.send("Welcome to this page for the first time!");
//   }
// });

async function isAuthenticated(req: Request, res: Response, next) {
  const isLogged = await redisClient.get("isAuth", (err, data) => {
    if (err) {
      console.log("err redis", err);
      return;
    }
    console.log("data", data);
    next();
  });
  // console.log(isLogged, "isLogged");

  // if (isLogged === "true") {
  //   next();
  // } else {
  //   console.log("middl said no");
  // }
}

app.get("/", isAuthenticated, (req: Request, res: Response) => {
  // console.log("this is sess", req.session.cookie);
  console.log("getlendi");

  res.send("Welcome User");
});

// app.get("/", function (req, res) {
//   if (req.session.page_views) {

//     req.session.page_views++;
//     res.send("You visited this page " + req.session.page_views + " times");
//   } else {
//     req.session.page_views = 1;
//     res.send("Welcome to this page for the first time!");
//   }
// });

app.post("/login", (req: Request, res: Response) => {
  const { name } = req.body;
  const includes = users.find((user) => user.fName === name);
  if (includes) {
    req.session.userName = name;
    req.session.isAuth = true;
    redisClient.set("userName", name);
    redisClient.set("isAuth", "true");

    console.log(`${name} exists`);
    console.log("req session login", req.session);
    // console.log("req.session.isAuth", req.session.isAuth);
  } else {
    req.session.isAuth = false;
    console.log("not loggedin");
    // console.log("req.session.isAuth", req.session.isAuth);
  }
  res.send();
});

app.listen(3001, () => {
  console.log("express server is running on port 3001");
});
