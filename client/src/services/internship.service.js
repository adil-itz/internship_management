const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getInternships = async () => {
  const response = await fetch('/api/internships', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch internships';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getInternshipById = async (id) => {
  const response = await fetch(`/api/internships/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch internship details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getCompanyInternships = async () => {
  const response = await fetch('/api/internships/company/my', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch company internships';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getAllInternshipsAdmin = async () => {
  const response = await fetch('/api/internships/admin/all', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch all internships for admin';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};


export const createInternship = async (data) => {
  const response = await fetch('/api/internships', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errMsg = 'Failed to create internship';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateInternship = async (id, data) => {
  const response = await fetch(`/api/internships/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errMsg = 'Failed to update internship';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const deleteInternship = async (id) => {
  const response = await fetch(`/api/internships/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to delete internship';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
