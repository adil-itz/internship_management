const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const createAttendance = async (data) => {
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to mark attendance.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getStudentAttendance = async (studentId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/attendance/student/${studentId}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch student attendance.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getInternshipAttendance = async (internshipId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/attendance/internship/${internshipId}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch internship attendance.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getCompanyAllAttendance = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/attendance/company/all${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch company attendance records.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateAttendance = async (id, data) => {
  const response = await fetch(`/api/attendance/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to update attendance record.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const deleteAttendance = async (id) => {
  const response = await fetch(`/api/attendance/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to delete attendance record.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getAttendanceSummary = async (studentId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `/api/attendance/summary/${studentId}${query ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch attendance summary.';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
