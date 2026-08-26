import Resource from "../models/Resource.js";

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private/Mentor,Admin
export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      category,
      skills,
      tags,
      level,
      status,
    } = req.body;

    if (!title || !description || !youtubeUrl || !category || !level) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const resource = new Resource({
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      category,
      skills: Array.isArray(skills) ? skills : [],
      tags: Array.isArray(tags) ? tags : [],
      level,
      status: status || "draft",
      createdBy: req.user.id,
    });

    await resource.save();

    res.status(201).json({ success: true, message: "Resource created successfully", resource });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.user.role === "student") {
      query.status = "published";
    } else if (req.query.status) {
      query.status = req.query.status;
    } else if (req.user.role === "mentor") {
      query.status = "published";
    }

    if (req.query.category) query.category = req.query.category;
    if (req.query.level) query.level = req.query.level;
    if (req.query.skills) {
      const skillsArray = Array.isArray(req.query.skills) ? req.query.skills : req.query.skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }
    if (req.query.tags) {
      const tagsArray = Array.isArray(req.query.tags) ? req.query.tags : req.query.tags.split(',').map(t => t.trim());
      query.tags = { $in: tagsArray };
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    let sortObj = { createdAt: -1 };
    if (req.query.sort === "oldest") sortObj = { createdAt: 1 };
    else if (req.query.sort === "title") sortObj = { title: 1 };
    else if (req.query.sort === "newest") sortObj = { createdAt: -1 };

    if (req.query.search && !req.query.sort) {
      sortObj = { score: { $meta: "textScore" } };
    }

    const total = await Resource.countDocuments(query);
    
    let resourcesQuery = Resource.find(query);
    if (req.query.search && !req.query.sort) {
       resourcesQuery = resourcesQuery.select({ score: { $meta: "textScore" } });
    }
    
    const resources = await resourcesQuery
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      resources,
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

// @desc    Get resource by ID
// @route   GET /api/resources/:id
// @access  Private
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("createdBy", "name email");

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    if (req.user.role === "student" && resource.status !== "published") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    
    if (req.user.role === "mentor" && resource.status !== "published" && resource.createdBy._id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user's resources
// @route   GET /api/resources/my
// @access  Private/Mentor,Admin
export const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private/Mentor,Admin
export const updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    if (req.user.role !== "admin" && resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const {
      title,
      description,
      youtubeUrl,
      thumbnailUrl,
      category,
      skills,
      tags,
      level,
      status,
    } = req.body;

    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (youtubeUrl) fieldsToUpdate.youtubeUrl = youtubeUrl;
    if (thumbnailUrl !== undefined) fieldsToUpdate.thumbnailUrl = thumbnailUrl;
    if (category) fieldsToUpdate.category = category;
    if (skills) fieldsToUpdate.skills = Array.isArray(skills) ? skills : [];
    if (tags) fieldsToUpdate.tags = Array.isArray(tags) ? tags : [];
    if (level) fieldsToUpdate.level = level;
    if (status) fieldsToUpdate.status = status;

    resource = await Resource.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    res.status(200).json({ success: true, message: "Resource updated successfully", resource });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private/Mentor,Admin
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    if (req.user.role !== "admin" && resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await resource.deleteOne();

    res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
