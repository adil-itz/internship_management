const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getResources = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const queryString = query.toString();
  const url = queryString ? `/api/resources?${queryString}` : '/api/resources';

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch resources';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getMyResources = async () => {
  const response = await fetch('/api/resources/my', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch your resources';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getResourceById = async (id) => {
  const response = await fetch(`/api/resources/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch resource details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const createResource = async (data) => {
  const response = await fetch('/api/resources', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errMsg = 'Failed to create resource';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const updateResource = async (id, data) => {
  const response = await fetch(`/api/resources/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errMsg = 'Failed to update resource';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const deleteResource = async (id) => {
  const response = await fetch(`/api/resources/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errMsg = 'Failed to delete resource';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
