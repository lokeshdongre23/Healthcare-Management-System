import { patients } from "../data/Store";
import { Patient } from "../models/Patient";
import express from "express";

const router = express.Router();

router
  .post("/", (req, res) => {
    const newPatient: Patient = {
      pId: patients.length + 1,
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      email: req.body.email,
      add: req.body.add,
    };

    patients.push(newPatient);
    res.status(200).json(newPatient);
  })
  .get("/", (req, res) => {
    res.json(patients);
  });

export default router;
