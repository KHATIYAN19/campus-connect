const express=require("express");
const route=express.Router();
const {auth,isAdmin}=require("../Middlewares/userMiddleware");
const { getContacts, createContact,  deleteContact } = require("../Controllers/contactController");




route.get("/", auth, getContacts);
route.post("/", auth, createContact);
route.delete("/:id", auth, isAdmin, deleteContact);
module.exports = route;