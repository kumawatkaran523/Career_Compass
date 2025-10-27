import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient(); 
dotenv.config();
const app = express();
app.use(cors())

app.post("/", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        fname: req.body.fname,
        email: req.body.email,
      },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(PORT);
  console.log(`Server is running at http://localhost:${PORT}`);
});