const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getStudentProfile = async () => {
  const response = await fetch('/api/student/profile', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    let errMsg = 'Failed to fetch profile';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const updateStudentProfile = async (data) => {
  const response = await fetch('/api/student/profile', {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errMsg = 'Failed to update profile';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await fetch('/api/student/profile/resume', {
    method: 'POST',
    headers: getAuthHeaders(), // Let the browser set Content-Type to multipart/form-data with boundary
    body: formData,
  });
  if (!response.ok) {
    let errMsg = 'Failed to upload resume';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const deleteResume = async () => {
  const response = await fetch('/api/student/profile/resume', {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to delete resume';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};
