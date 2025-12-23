import express, { Request, Response } from "express";
import cors from "cors";
import patientRouter from "./routes/patientRoutes";
import appointmentRouter from "./routes/appointmentRoutes";
const app = express();
const port = 3001;

// Midsdleware to parse JSON
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to hoome page");
});
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's exact origin
  })
);
app.use("/patients", patientRouter);
app.use("/appointments", appointmentRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
