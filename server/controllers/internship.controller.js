import Internship from "../models/Internship.js";

export const createInternship = async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      skills,
      internshipType,
      location,
      workMode,
      duration,
      stipend,
      stipendType,
      openings,
      startDate,
      applicationDeadline,
      eligibility,
      responsibilities,
      requirements,
      benefits,
      status,
    } = req.body;

    if (!title || !description || !domain || !skills || !internshipType || !location || !workMode || !duration || !openings || !applicationDeadline) {
      return res.status(400).json({ message: "Invalid internship data" });
    }

    if (openings <= 0) {
      return res.status(400).json({ message: "Openings must be greater than 0" });
    }

    if (stipend !== undefined && stipend < 0) {
      return res.status(400).json({ message: "Stipend cannot be negative" });
    }

    if (eligibility && eligibility.minimumCGPA !== undefined) {
      if (eligibility.minimumCGPA < 0 || eligibility.minimumCGPA > 10) {
        return res.status(400).json({ message: "CGPA must be between 0 and 10" });
      }
    }
    
    if (isNaN(Date.parse(applicationDeadline))) {
      return res.status(400).json({ message: "Invalid application deadline date" });
    }

    const internship = new Internship({
      company: req.user.id,
      title,
      description,
      domain,
      skills,
      internshipType,
      location,
      workMode,
      duration,
      stipend,
      stipendType,
      openings,
      startDate,
      applicationDeadline,
      eligibility,
      responsibilities,
      requirements,
      benefits,
      status,
    });

    const createdInternship = await internship.save();
    res.status(201).json({ success: true, internship: createdInternship });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ status: "published" })
      .populate("company", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCompanyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllInternshipsAdmin = async (req, res) => {
  try {
    const internships = await Internship.find({})
      .populate("company", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      "company",
      "name email"
    );

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    
    if (
      internship.status !== "published" &&
      internship.company._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
       return res.status(404).json({ message: "Internship not found" });
    }

    res.json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.company.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to modify this internship",
      });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("company", "name email");

    res.json({ success: true, internship: updatedInternship });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.company.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to modify this internship",
      });
    }

    await internship.deleteOne();

    res.json({ success: true, message: "Internship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
