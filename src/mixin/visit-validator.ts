import { NextFunction, Request, Response } from "express";

export function validateVisit(req: Request, res: Response, next: NextFunction): void {
  const reqVisitId = req.params.visitId;
  const visitId = Number(req.params.visitId);
  let response: string;
  if (isNaN(visitId)) {
    res.status(400);
    response = `Invalid visitId: ${reqVisitId}`;
  } else {
    next();
  }
}
