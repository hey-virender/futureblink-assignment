import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";
import { agendaReady } from "./config/agenda.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;
connectToDatabase();
await agendaReady;
app.use(
  cors({
    origin: "https://futureblink-assignment.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/email", emailRoutes);
app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
