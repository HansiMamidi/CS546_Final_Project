import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    isEqual: (a, b, options) => {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
  },
});
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  // let the next middleware run:
  next();
};
app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);
app.get("/", (req, res, next) => {
  res.redirect("/login");
});
app.get("/register", (req, res, next) => {
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    return res.redirect("/homepage");
  } else {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Non-Authenticated User)"
    );
    return res.redirect("/login");
    next();
  }
});

app.get("/courses", (req, res, next) => {
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    return res.redirect('/homepage')
  }else if (req.session.user1) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
  } else {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Non-Authenticated User)"
    );
    return res.redirect('/login');
  }
  
  next();
});

app.get("/login", (req, res, next) => {
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    return res.redirect("/homepage");
  } else {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Non-Authenticated User)"
    );
    next();
  }
});

app.get("/homepage", (req, res, next) => {
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    next();
  } else {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    return res.redirect("/login");
  }
});

app.get("/profile", (req, res, next) => {
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    next();
  } else {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    return res.redirect("/login");
  }
});

app.get("/logout", (req, res, next) => {
  if (!req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Non-Authenticated User)"
    );
    return res.redirect("/login");
  }
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    next();
  }
});

app.get("/logout", (req, res, next) => {
  if (!req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Non-Authenticated User)"
    );
    return res.redirect("/login");
  }
  if (req.session.user) {
    console.log(
      "[" +
        new Date().toUTCString() +
        "]:" +
        req.method +
        " " +
        req.originalUrl +
        " (Authenticated User)"
    );
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
