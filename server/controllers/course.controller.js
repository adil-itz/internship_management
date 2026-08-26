import Course from "../models/Course.js";

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Mentor,Admin
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      level,
      duration,
      thumbnailUrl,
      skills,
      modules,
      status,
    } = req.body;

    if (!title || !description || !domain || !level) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (modules && !Array.isArray(modules)) {
      return res.status(400).json({ success: false, message: "Modules must be an array" });
    }

    const course = new Course({
      title,
      description,
      domain,
      level,
      duration,
      thumbnailUrl,
      skills: Array.isArray(skills) ? skills : [],
      modules: Array.isArray(modules) ? modules : [],
      status: status || "draft",
      createdBy: req.user.id,
    });

    await course.save();

    res.status(201).json({ success: true, message: "Course created successfully", course });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.user.role === "student") {
      query.status = "published";
    } else if (req.query.status) {
      query.status = req.query.status;
    } else if (req.user.role === "mentor") {
      query.status = "published";
    }

    if (req.query.domain) query.domain = req.query.domain;
    if (req.query.level) query.level = req.query.level;

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { domain: searchRegex },
        { skills: searchRegex },
        { "modules.title": searchRegex },
        { "modules.description": searchRegex },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (req.query.sort === "oldest") sortObj = { createdAt: 1 };
    else if (req.query.sort === "title") sortObj = { title: 1 };
    else if (req.query.sort === "newest") sortObj = { createdAt: -1 };

    const total = await Course.countDocuments(query);
    
    let coursesQuery = Course.find(query);
    
    const courses = await coursesQuery
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (req.user.role === "student" && course.status !== "published") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    
    if (req.user.role === "mentor" && course.status !== "published" && course.createdBy._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user's courses
// @route   GET /api/courses/my
// @access  Private/Mentor,Admin
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Mentor,Admin
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const {
      title,
      description,
      domain,
      level,
      duration,
      thumbnailUrl,
      skills,
      modules,
      status,
    } = req.body;

    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (domain) fieldsToUpdate.domain = domain;
    if (level) fieldsToUpdate.level = level;
    if (duration !== undefined) fieldsToUpdate.duration = duration;
    if (thumbnailUrl !== undefined) fieldsToUpdate.thumbnailUrl = thumbnailUrl;
    if (skills) fieldsToUpdate.skills = Array.isArray(skills) ? skills : [];
    if (modules) fieldsToUpdate.modules = Array.isArray(modules) ? modules : [];
    if (status) fieldsToUpdate.status = status;

    course = await Course.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    res.status(200).json({ success: true, message: "Course updated successfully", course });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Mentor,Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
