require("dotenv").config();

const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
// dns.resolveSrv("_mongodb._tcp.cluster0.wlcrjsh.mongodb.net", console.log);

const express = require("express")
const mongoose = require ("mongoose")
const authRoutes = require ("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {requireAuth, checkUser} = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000

// database connection
  mongoose.connect(process.env.MONGO_URI)
     .then(() => {
      console.log("MongoDB connected successfully");

      app.listen(PORT, () => {
         console.log(`server running on port ${PORT}`);
      });
     })
     .catch((err) => console.log(err));


// app.listen(3000)

// routes
app.get("/{*splat}", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/africanfoods", requireAuth, (req, res) => res.render("africanfoods"));
app.use(authRoutes);

