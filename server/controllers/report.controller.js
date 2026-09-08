import * as reportService from '../services/report.service.js';
import * as reportExportService from '../services/reportExport.service.js';

export const getDashboard = async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;
    
    // Convert month/year to date range if provided
    let start = startDate;
    let end = endDate;
    if (month && year) {
      start = new Date(year, month - 1, 1).toISOString();
      end = new Date(year, month, 0, 23, 59, 59).toISOString();
    }

    if (start && end && new Date(start) > new Date(end)) {
      return res.status(400).json({ success: false, message: "Invalid date range: startDate must be <= endDate" });
    }

    const summary = await reportService.getDashboardSummary(start, end);

    res.json({
      success: true,
      filters: { startDate: start, endDate: end },
      summary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthly = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await reportService.getMonthlyAnalytics(year);

    res.json({
      success: true,
      year: parseInt(year),
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompaniesReport = async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;
    const data = await reportService.getCompanyWiseReport(startDate, endDate, companyId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMentorsReport = async (req, res) => {
  try {
    const { startDate, endDate, mentorId } = req.query;
    const data = await reportService.getMentorWiseReport(startDate, endDate, mentorId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentsReport = async (req, res) => {
  try {
    const { startDate, endDate, studentId } = req.query;
    const data = await reportService.getStudentWiseReport(startDate, endDate, studentId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.query;
    let data = [];
    let fields = [];

    switch (reportType) {
      case 'companies':
        data = await reportService.getCompanyWiseReport(startDate, endDate);
        fields = ['companyName', 'email', 'totalInternships', 'totalApplications', 'selectedApplications'];
        break;
      case 'mentors':
        data = await reportService.getMentorWiseReport(startDate, endDate);
        fields = ['mentorName', 'email', 'totalAssignments', 'activeAssignments'];
        break;
      case 'students':
        data = await reportService.getStudentWiseReport(startDate, endDate);
        fields = ['studentName', 'email', 'applicationsCount', 'acceptedCount'];
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid reportType" });
    }

    const csvData = reportExportService.exportToCSV(data, fields);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report.csv`);
    res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.query;
    let data = [];
    let columns = [];
    let title = 'Report';

    switch (reportType) {
      case 'companies':
        data = await reportService.getCompanyWiseReport(startDate, endDate);
        columns = [
          { key: 'companyName', label: 'Company' },
          { key: 'email', label: 'Email' },
          { key: 'totalInternships', label: 'Internships' },
          { key: 'totalApplications', label: 'Applications' }
        ];
        title = 'Company Analytics Report';
        break;
      case 'mentors':
        data = await reportService.getMentorWiseReport(startDate, endDate);
        columns = [
          { key: 'mentorName', label: 'Mentor' },
          { key: 'email', label: 'Email' },
          { key: 'totalAssignments', label: 'Assignments' },
          { key: 'activeAssignments', label: 'Active' }
        ];
        title = 'Mentor Analytics Report';
        break;
      case 'students':
        data = await reportService.getStudentWiseReport(startDate, endDate);
        columns = [
          { key: 'studentName', label: 'Student' },
          { key: 'email', label: 'Email' },
          { key: 'applicationsCount', label: 'Applications' },
          { key: 'acceptedCount', label: 'Accepted' }
        ];
        title = 'Student Analytics Report';
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid reportType or not supported for PDF" });
    }

    const rawBuffer = await reportExportService.exportToPDF(title, columns, data);
    const buffer = Buffer.from(rawBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${reportType}-report.pdf"`);
    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
