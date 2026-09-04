import Feedback from "../models/Feedback.js";
import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import MentorAssignment from "../models/MentorAssignment.js";
import mongoose from "mongoose";

// Helper to check if a student completed an internship
const checkInternshipCompletion = async (studentId, internshipId) => {
    // Assuming 'selected' status in Application indicates they participated.
    const application = await Application.findOne({
        candidate: studentId,
        internship: internshipId,
        status: "selected"
    });
    return !!application;
};

// A: Student -> Internship Rating
export const createInternshipRating = async (req, res) => {
    try {
        const { internshipId } = req.params;
        const studentId = req.user.id;

        const internship = await Internship.findById(internshipId);
        if (!internship) return res.status(404).json({ success: false, message: "Internship not found" });

        const isCompleted = await checkInternshipCompletion(studentId, internshipId);
        if (!isCompleted) return res.status(403).json({ success: false, message: "You are not eligible to rate this internship. You must be selected." });

        let feedback = await Feedback.findOne({ studentId, internshipId, type: "internship_rating" });
        if (feedback) {
            Object.assign(feedback, {
                ratings: req.body.ratings,
                comments: req.body.comments,
                recommendation: req.body.recommendation,
                visibility: req.body.visibility || "public"
            });
            await feedback.save();
            return res.status(200).json({ success: true, message: "Internship rating updated successfully", feedback });
        }

        feedback = new Feedback({
            studentId,
            internshipId,
            companyId: internship.company,
            reviewerId: studentId,
            reviewerRole: "student",
            type: "internship_rating",
            ratings: req.body.ratings,
            comments: req.body.comments,
            recommendation: req.body.recommendation,
            visibility: req.body.visibility || "public"
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Internship rating submitted successfully", feedback });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// B: Student -> Company Rating
export const createCompanyRating = async (req, res) => {
    try {
        const { companyId } = req.params;
        const studentId = req.user.id;

        const applications = await Application.find({ candidate: studentId, status: "selected" }).populate('internship');
        const validInternship = applications.find(app => app.internship && app.internship.company.toString() === companyId);

        if (!validInternship) {
            return res.status(403).json({ success: false, message: "You are not eligible to rate this company." });
        }

        const internshipId = validInternship.internship._id;

        let feedback = await Feedback.findOne({ studentId, internshipId, type: "company_rating" });
        if (feedback) {
            Object.assign(feedback, {
                ratings: req.body.ratings,
                comments: req.body.comments,
                recommendation: req.body.recommendation,
                visibility: req.body.visibility || "public"
            });
            await feedback.save();
            return res.status(200).json({ success: true, message: "Company rating updated successfully", feedback });
        }

        feedback = new Feedback({
            studentId,
            internshipId,
            companyId,
            reviewerId: studentId,
            reviewerRole: "student",
            type: "company_rating",
            ratings: req.body.ratings,
            comments: req.body.comments,
            recommendation: req.body.recommendation,
            visibility: req.body.visibility || "public"
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Company rating submitted successfully", feedback });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// C1: Mentor -> Ongoing Feedback
export const createMentorOngoingFeedback = async (req, res) => {
    try {
        const { studentId } = req.params;
        const mentorId = req.user.id;

        const assignment = await MentorAssignment.findOne({ student: studentId, mentor: mentorId, status: "active" }).populate('internship');
        if (!assignment) return res.status(403).json({ success: false, message: "You are not actively assigned to this student." });

        const feedback = new Feedback({
            studentId,
            internshipId: assignment.internship._id,
            companyId: assignment.internship.company,
            reviewerId: mentorId,
            reviewerRole: "mentor",
            type: "mentor_ongoing",
            ratings: req.body.ratings,
            comments: req.body.comments,
            workLogId: req.body.workLogId
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Ongoing feedback submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// C2: Mentor -> Midterm Feedback
export const createMentorMidtermFeedback = async (req, res) => {
    try {
        const { studentId } = req.params;
        const mentorId = req.user.id;

        const assignment = await MentorAssignment.findOne({ student: studentId, mentor: mentorId }).populate('internship');
        if (!assignment) return res.status(403).json({ success: false, message: "You are not assigned to this student." });

        const internshipId = assignment.internship._id;

        const existing = await Feedback.findOne({ studentId, internshipId, type: "mentor_midterm" });
        if (existing) return res.status(409).json({ success: false, message: "Midterm feedback already submitted." });

        const feedback = new Feedback({
            studentId,
            internshipId,
            companyId: assignment.internship.company,
            reviewerId: mentorId,
            reviewerRole: "mentor",
            type: "mentor_midterm",
            ratings: req.body.ratings,
            comments: req.body.comments,
            recommendation: req.body.recommendation
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Midterm feedback submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// C3: Mentor -> Final Feedback
export const createMentorFinalFeedback = async (req, res) => {
    try {
        const { studentId } = req.params;
        const mentorId = req.user.id;

        const assignment = await MentorAssignment.findOne({ student: studentId, mentor: mentorId }).populate('internship');
        if (!assignment) return res.status(403).json({ success: false, message: "You are not assigned to this student." });

        const internshipId = assignment.internship._id;

        const existing = await Feedback.findOne({ studentId, internshipId, type: "mentor_final" });
        if (existing) return res.status(409).json({ success: false, message: "Final feedback already submitted." });

        const feedback = new Feedback({
            studentId,
            internshipId,
            companyId: assignment.internship.company,
            reviewerId: mentorId,
            reviewerRole: "mentor",
            type: "mentor_final",
            ratings: req.body.ratings,
            comments: req.body.comments,
            recommendation: req.body.recommendation
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Final feedback submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// D: Company -> Final Feedback
export const createCompanyFinalFeedback = async (req, res) => {
    try {
        const { studentId } = req.params;
        const companyId = req.user.id;

        const applications = await Application.find({ candidate: studentId, status: "selected" }).populate('internship');
        const validInternship = applications.find(app => app.internship && app.internship.company.toString() === companyId);

        if (!validInternship) return res.status(403).json({ success: false, message: "You are not authorized to evaluate this student." });

        const internshipId = validInternship.internship._id;

        const existing = await Feedback.findOne({ studentId, internshipId, type: "company_final" });
        if (existing) return res.status(409).json({ success: false, message: "Company final evaluation already submitted." });

        const feedback = new Feedback({
            studentId,
            internshipId,
            companyId,
            reviewerId: companyId,
            reviewerRole: "company",
            type: "company_final",
            ratings: req.body.ratings,
            comments: req.body.comments,
            recommendation: req.body.recommendation,
            ppoEligible: req.body.ppoEligible
        });

        await feedback.save();
        res.status(201).json({ success: true, message: "Company final evaluation submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Student Feedback
export const getStudentFeedback = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (req.user.role === 'student' && req.user.id !== studentId) {
            return res.status(403).json({ success: false, message: "You can only view your own feedback." });
        }

        const feedbacks = await Feedback.find({ studentId }).populate("reviewerId", "name").populate("internshipId", "title").populate("companyId", "name");
        res.status(200).json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCompanyRatings = async (req, res) => {
    try {
        const { companyId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchStage = { companyId: new mongoose.Types.ObjectId(companyId), type: "company_rating", visibility: "public" };

        const stats = await Feedback.aggregate([
            { $match: matchStage },
            { $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageOverall: { $avg: "$ratings.overall" },
                learning: { $avg: "$ratings.learning" },
                workEnvironment: { $avg: "$ratings.workEnvironment" },
                mentorSupport: { $avg: "$ratings.mentorSupport" },
                communication: { $avg: "$ratings.communication" },
                professionalGrowth: { $avg: "$ratings.professionalGrowth" },
                recommendedCount: { $sum: { $cond: ["$recommendation", 1, 0] } }
            }}
        ]);

        const reviews = await Feedback.find(matchStage).populate("reviewerId", "name").skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Feedback.countDocuments(matchStage);

        let summary = null;
        if (stats.length > 0) {
            const s = stats[0];
            summary = {
                averageOverall: s.averageOverall?.toFixed(1),
                totalReviews: s.totalReviews,
                learning: s.learning?.toFixed(1),
                workEnvironment: s.workEnvironment?.toFixed(1),
                mentorSupport: s.mentorSupport?.toFixed(1),
                communication: s.communication?.toFixed(1),
                professionalGrowth: s.professionalGrowth?.toFixed(1),
                recommendationPercentage: s.totalReviews > 0 ? Math.round((s.recommendedCount / s.totalReviews) * 100) : 0
            };
        }

        res.status(200).json({
            success: true,
            summary,
            reviews: reviews.map(r => ({
                ...r.toObject(),
                reviewerId: { name: r.visibility === 'public' ? r.reviewerId?.name : 'Anonymous Intern' }
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getInternshipRatings = async (req, res) => {
    try {
        const { internshipId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const matchStage = { internshipId: new mongoose.Types.ObjectId(internshipId), type: "internship_rating", visibility: "public" };

        const stats = await Feedback.aggregate([
            { $match: matchStage },
            { $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageOverall: { $avg: "$ratings.overall" },
                learning: { $avg: "$ratings.learning" },
                taskQuality: { $avg: "$ratings.taskQuality" },
                mentorSupport: { $avg: "$ratings.mentorSupport" },
                workEnvironment: { $avg: "$ratings.workEnvironment" },
                communication: { $avg: "$ratings.communication" },
                workLifeBalance: { $avg: "$ratings.workLifeBalance" },
                recommendedCount: { $sum: { $cond: ["$recommendation", 1, 0] } }
            }}
        ]);

        const reviews = await Feedback.find(matchStage).populate("reviewerId", "name").skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Feedback.countDocuments(matchStage);

        let summary = null;
        if (stats.length > 0) {
            const s = stats[0];
            summary = {
                averageOverall: s.averageOverall?.toFixed(1),
                totalReviews: s.totalReviews,
                learning: s.learning?.toFixed(1),
                taskQuality: s.taskQuality?.toFixed(1),
                mentorSupport: s.mentorSupport?.toFixed(1),
                workEnvironment: s.workEnvironment?.toFixed(1),
                communication: s.communication?.toFixed(1),
                workLifeBalance: s.workLifeBalance?.toFixed(1),
                recommendationPercentage: s.totalReviews > 0 ? Math.round((s.recommendedCount / s.totalReviews) * 100) : 0
            };
        }

        res.status(200).json({
            success: true,
            summary,
            reviews: reviews.map(r => ({
                ...r.toObject(),
                reviewerId: { name: r.visibility === 'public' ? r.reviewerId?.name : 'Anonymous Intern' }
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.feedbackId).populate("reviewerId", "name").populate("studentId", "name").populate("internshipId", "title").populate("companyId", "name");
        if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

        if (req.user.role === 'student' && feedback.studentId._id.toString() !== req.user.id) {
             if (feedback.visibility === 'private' || !["internship_rating", "company_rating"].includes(feedback.type)) {
                 return res.status(403).json({ success: false, message: "Unauthorized" });
             }
        }

        res.status(200).json({ success: true, feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.feedbackId);
        if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

        if (feedback.reviewerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You can only update your own feedback." });
        }

        Object.assign(feedback, req.body);
        await feedback.save();

        res.status(200).json({ success: true, message: "Feedback updated successfully", feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.feedbackId);
        if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

        if (feedback.reviewerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this feedback." });
        }

        if (req.user.role !== 'admin' && !["internship_rating", "company_rating"].includes(feedback.type)) {
             return res.status(403).json({ success: false, message: "Professional evaluations cannot be deleted by users." });
        }

        await feedback.deleteOne();
        res.status(200).json({ success: true, message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdminFeedback = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.type) query.type = req.query.type;
        if (req.query.studentId) query.studentId = req.query.studentId;
        if (req.query.companyId) query.companyId = req.query.companyId;

        const feedbacks = await Feedback.find(query).populate("reviewerId", "name email").populate("studentId", "name email").populate("companyId", "name").populate("internshipId", "title").skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Feedback.countDocuments(query);

        res.status(200).json({ success: true, feedbacks, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
