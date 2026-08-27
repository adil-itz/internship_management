const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const assignMentor = async (data) => {
  const response = await fetch('/api/mentor-assignments', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to assign mentor';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getMyAssignments = async () => {
  const response = await fetch('/api/mentor-assignments/my', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch mentor assignments';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getStudentAssignments = async () => {
  const response = await fetch('/api/mentor-assignments/student', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch student mentor assignments';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getInternshipAssignments = async (internshipId) => {
  const response = await fetch(`/api/mentor-assignments/internship/${internshipId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch internship mentor assignments';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getAllAssignmentsAdmin = async () => {
  const response = await fetch('/api/mentor-assignments/admin/all', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch all mentor assignments';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getAssignmentById = async (id) => {
  const response = await fetch(`/api/mentor-assignments/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch assignment details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateAssignmentStatus = async (id, data) => {
  const response = await fetch(`/api/mentor-assignments/${id}/status`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to update assignment status';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getMentors = async () => {
  const response = await fetch('/api/mentor-assignments/mentors', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch mentors list';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
