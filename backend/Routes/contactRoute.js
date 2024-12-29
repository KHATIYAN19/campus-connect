const express=require("express");
const route=express.Router();
const {auth,isAdmin}=require("../Middlewares/userMiddleware");
const { getContacts, createContact,  deleteContact ,getContactById} = require("../Controllers/contactController");
route.get("/getAll", auth,isAdmin, getContacts);
route.post("/create", createContact);
route.delete("/:id", auth, isAdmin, deleteContact);
route.get("/get/:email", auth, getContactById);
module.exports = route;