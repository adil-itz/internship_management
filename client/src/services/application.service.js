const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const createApplication = async (data) => {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to submit application';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getMyApplications = async () => {
  const response = await fetch('/api/applications/my', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch applications';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getApplicationById = async (id) => {
  const response = await fetch(`/api/applications/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch application details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getInternshipApplications = async (internshipId, params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  
  const queryString = query.toString();
  const url = `/api/internships/${internshipId}/applications${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch applications for internship';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getAllApplicationsAdmin = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const queryString = query.toString();
  const url = `/api/applications/admin/all${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch all applications';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateApplicationStatus = async (id, data) => {
  const response = await fetch(`/api/applications/${id}/status`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to update application status';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const scheduleInterview = async (id, data) => {
  const response = await fetch(`/api/applications/${id}/interview`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errMsg = 'Failed to schedule/update interview';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const withdrawApplication = async (id) => {
  const response = await fetch(`/api/applications/${id}/withdraw`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to withdraw application';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
