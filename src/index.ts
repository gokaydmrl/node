console.log("ne yazmak istersen");
// npm run dev
import express, { Application, Request, Response } from "express";
import cors from "cors";
import session, { SessionData } from "express-session";
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

app.use(
  session({
    name: "deneme",
    secret: "secret",
    resave: false, //
    saveUninitialized: true,
    cookie: {
      secure: false, // This will only work if you have https enabled!
      maxAge: 600000, // 1 min
      sameSite: "strict",
    },
  })
);

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

app.get("/", (req: Request, res: Response) => {
  console.log("this is sess", req.session.cookie);
  console.log("req.session.", req.session.isAuth);
  if (req.session.isAuth) {
    res.send("Welcome User");
  } else res.send("no welc");
});

// app.get("/", function (req, res) {
//   if (req.session.page_views) {
//     req.session.page_views++;
//     console.log("You visited this page " + req.session.page_views + " times");
//   } else {
//     req.session.page_views = 1;
//     console.log("Welcome to this page for the first time!");
//   }
// });

app.post("/login", (req: Request, res: Response) => {
  const { name } = req.body;

  for (var x = 0; x < users.length; x++) {
    if (users[x].fName.includes(name)) {
      req.session.isAuth = true;
      console.log(`${name} exists`);
      console.log("req.session.isAuth", req.session.isAuth);
      res.send()
    } else {
      req.session.isAuth = false;
      console.log("not loggedin");
      console.log("req.session.isAuth", req.session.isAuth);
    }
  }

  //  console.log(session);
  // req.session.userName = name;
  // console.log(req.session.isAuth);

  // console.log("success");
});

app.listen(3001, () => {
  console.log("express server is running on port 3001");
});
