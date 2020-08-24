// le commmencement de notre app
const express = require("express");
const app = express();
const router = require("./routes/routes");

const bodyParser = require("body-parser");
const morgan = require("morgan");

const mongoose = require("mongoose");

// connecte l'app au database (mongoDB)
mongoose.connect("mongodb://localhost:blog/blog", {useNewUrlParser: true, useUnifiedTopology: true});

// parametrer notre app (morgan et body-parser des middleware pour Express)
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*"}));

// parametrer router
router(app);

// exporter notre app pour le server
module.exports = app;
