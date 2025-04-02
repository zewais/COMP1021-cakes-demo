//Initailizations
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const Cake = require("./models/cake");
const methodOverrider = require("method-override");
require("dotenv").config();
const { DB_URI } = process.env;
const port = 3000;

//Middleware
server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverrider("_method"));

//Connection
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Connected to Database\nServer is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//Index route
server.get("/cakes", async (request, response) => {
  try {
    const cakes = await Cake.find();
    response.render("cakesIndexPage", { cakes });
  } catch (error) {
    response.status(500).send(error);
  }
});

//New page route
server.get("/cakes/new", (request, response) => {
  response.render("cakeNewPage");
});

//Show route
server.get("/cakes/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const cake = await Cake.findById(id);
    response.render("cakeShowPage", { cake });
  } catch (error) {
    response.status(500).send(`Can't find cake with ID ${id}`);
  }
});

//Post route
server.post("/cakes", async (request, response) => {
  // create a new cake using the information sent via request.body
  const newCake = new Cake({
    name: request.body.name,
    type: request.body.type,
    price: {
      "8 inch": request.body["8 inch"],
      "10 inch": request.body["10 inch"],
      "12 inch": request.body["12 inch"],
    },
    image: request.body.image,
  });
  try {
    await newCake.save();
    response.redirect("/cakes");
  } catch (error) {
    response.status(500).send("Cannot add cake to Database");
  }
});

//Delete route
server.delete("/cakes/:id", async (request, respose) => {
  const { id } = request.params;
  try {
    await Cake.findByIdAndDelete(id);
    respose.redirect("/cakes");
  } catch (error) {
    respose.status(500).send("Cannot delete cake");
  }
});

//Edit page route
server.get("/cakes/:id/edit", async (request, response) => {
  const { id } = request.params;
  try {
    const editCake = await Cake.findById(id);
    response.render("cakeEditPage", { editCake });
  } catch (error) {
    response.status(500).send("Cannot find cake");
  }
});

//Patch route
server.patch("/cakes/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Cake.findByIdAndUpdate(id, {
      name: request.body.name,
      type: request.body.type,
      price: {
        "8 inch": request.body["8 inch"],
        "10 inch": request.body["10 inch"],
        "12 inch": request.body["12 inch"],
      },
      image: request.body.image,
    });
    response.redirect(`/cakes/${id}`);
  } catch (error) {
    response.status(500).send("Cannot patch cake");
  }
});
