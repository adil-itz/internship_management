import MentorAssignment from "../models/MentorAssignment.js";

export const validateMentorStudentAssignment = async (mentorId, studentId, internshipId = null) => {
  const query = {
    mentor: mentorId,
    student: studentId,
    status: "active"
  };
  
  if (internshipId) {
    query.internship = internshipId;
  }

  const assignment = await MentorAssignment.findOne(query);
  return assignment; // Returns the assignment doc if valid, otherwise null
};
