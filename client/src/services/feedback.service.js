const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const createInternshipRating = async (internshipId, data) => {
  const response = await fetch(`/api/feedback/internship/${internshipId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit internship rating';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createCompanyRating = async (companyId, data) => {
  const response = await fetch(`/api/feedback/company/${companyId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit company rating';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createMentorOngoingFeedback = async (studentId, data) => {
  const response = await fetch(`/api/feedback/mentor/ongoing/${studentId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit ongoing feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createMentorMidtermFeedback = async (studentId, data) => {
  const response = await fetch(`/api/feedback/mentor/midterm/${studentId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit midterm feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createMentorFinalFeedback = async (studentId, data) => {
  const response = await fetch(`/api/feedback/mentor/final/${studentId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit final feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createCompanyFinalFeedback = async (studentId, data) => {
  const response = await fetch(`/api/feedback/company/final/${studentId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit company final evaluation';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getStudentFeedback = async (studentId) => {
  const response = await fetch(`/api/feedback/student/${studentId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch student feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getCompanyRatings = async (companyId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  
  const queryString = query.toString();
  const url = `/api/feedback/company/${companyId}/ratings${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch company ratings';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getInternshipRatings = async (internshipId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const queryString = query.toString();
  const url = `/api/feedback/internship/${internshipId}/ratings${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch internship ratings';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getFeedbackById = async (feedbackId) => {
  const response = await fetch(`/api/feedback/${feedbackId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch feedback details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateFeedback = async (feedbackId, data) => {
  const response = await fetch(`/api/feedback/${feedbackId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to update feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const deleteFeedback = async (feedbackId) => {
  const response = await fetch(`/api/feedback/${feedbackId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to delete feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getAdminFeedback = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.type) query.append('type', params.type);
  if (params.studentId) query.append('studentId', params.studentId);
  if (params.companyId) query.append('companyId', params.companyId);

  const queryString = query.toString();
  const url = `/api/feedback/admin${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch admin feedback';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
