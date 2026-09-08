import express from "express";
import { 
  getDashboard, 
  getMonthly, 
  getCompaniesReport, 
  getMentorsReport, 
  getStudentsReport, 
  exportCSV, 
  exportPDF 
} from "../controllers/report.controller.js";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All report routes require admin privileges
router.use(protect);
router.use(authorizeAdmin);

router.get("/dashboard", getDashboard);
router.get("/monthly", getMonthly);
router.get("/companies", getCompaniesReport);
router.get("/mentors", getMentorsReport);
router.get("/students", getStudentsReport);
router.get("/export/csv", exportCSV);
router.get("/export/pdf", exportPDF);

export default router;
