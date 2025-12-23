import express from "express";
import { Appointment } from "../models/Appointment";
import { appointments, patients } from "../data/Store";

const router = express.Router();

router
  .post("/", (req, res) => {
    const pId = Number(req.body.pId);
    const newAppoinment: Appointment = {
      aId: appointments.length + 1,
      pId: req.body.pId,
      date: req.body.date,
      reason: req.body.reason,
    };
    console.log(newAppoinment);
    const patientExits = patients.find((e) => e.pId === pId);
    if (!patientExits) {
      res.json({
        status: 404,
        respond: "Patient Not Found",
      });
    } else {
      appointments.push(newAppoinment);
      res.json({
        status: 200,
        respond: "Appoinment created sucessfully",
      });
    }
  })
  .get("/", (req, res) => {
    res.status(200).json(appointments);
  });

export default router;
