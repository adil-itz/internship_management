const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getCourses = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const queryString = query.toString();
  const url = queryString ? `/api/courses?${queryString}` : '/api/courses';

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch courses';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getMyCourses = async () => {
  const response = await fetch('/api/courses/my', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch your courses';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getCourseById = async (id) => {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch course details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createCourse = async (data) => {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errMsg = 'Failed to create course';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateCourse = async (id, data) => {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errMsg = 'Failed to update course';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const deleteCourse = async (id) => {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to delete course';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
