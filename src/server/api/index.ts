import Express from "express";

export const api = Express.Router();

api.use((req, res) => {
  res.send("api 4");
});
