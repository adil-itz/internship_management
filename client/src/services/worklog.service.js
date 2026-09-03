const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const createWorkLog = async (data) => {
  const response = await fetch('/api/worklogs', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to create work log.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getStudentWorkLogs = async (studentId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/worklogs/student/${studentId}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch student work logs.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getInternshipWorkLogs = async (internshipId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/worklogs/internship/${internshipId}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch internship work logs.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getWorkLogById = async (id) => {
  const response = await fetch(`/api/worklogs/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Work log not found.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateWorkLog = async (id, data) => {
  const response = await fetch(`/api/worklogs/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to update work log.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const deleteWorkLog = async (id) => {
  const response = await fetch(`/api/worklogs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to delete work log.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const submitWorkLog = async (id) => {
  const response = await fetch(`/api/worklogs/${id}/submit`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit work log.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const reviewWorkLog = async (id, data) => {
  const response = await fetch(`/api/worklogs/${id}/review`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to review work log.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getWorkLogSummary = async (studentId) => {
  const response = await fetch(`/api/worklogs/summary/${studentId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch work log summary.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
