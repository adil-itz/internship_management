const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getNotifications = async () => {
  const response = await fetch('/api/notifications', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch notifications';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const getUnreadNotificationCount = async () => {
  const response = await fetch('/api/notifications/unread-count', {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch unread notification count';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const markNotificationAsRead = async (id) => {
  const response = await fetch(`/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to mark notification as read';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const markAllNotificationsAsRead = async () => {
  const response = await fetch('/api/notifications/read-all', {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    let errMsg = 'Failed to mark all notifications as read';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  return response.json();
};
