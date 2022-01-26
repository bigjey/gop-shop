import express from "express";

export const api = express.Router();

api.use((req, res) => {
  res.send("api 4");
});
