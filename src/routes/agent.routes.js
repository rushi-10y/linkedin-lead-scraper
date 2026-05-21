import express from "express";
import { LeadAgentController } from "../controllers/leadAgent.controller.js";

export const createAgentRouter = ({ mongoService }) => {
  const router = express.Router();
  const controller = new LeadAgentController({ mongoService });

  router.post("/agents/lead-research", controller.research);
  router.get("/leads", controller.listLeads);
  router.get("/runs/:jobId", controller.getRun);
  router.get("/exports/:filename", controller.downloadExport);

  return router;
};
