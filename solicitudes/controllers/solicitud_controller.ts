import { Request, Response } from "express";
import { solicitudes } from "../data/solicitud.data";

export const getSolicitudes = (req: Request, res: Response) => {
  res.json(solicitudes);
};

export const crearSolicitud = (req: Request, res: Response) => {
  const nueva = req.body;
  solicitudes.push(nueva);
  res.status(201).json({ mensaje: "Solicitud creada", data: nueva });
};