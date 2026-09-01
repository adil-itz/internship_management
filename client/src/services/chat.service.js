const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const getConversations = async () => {
  const response = await fetch('/api/chat/conversations', {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    let errMsg = 'Failed to fetch conversations';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const getMessages = async (conversationId, page = 1, limit = 50) => {
  const response = await fetch(`/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    let errMsg = 'Failed to fetch messages';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const createConversation = async (studentId, mentorId) => {
  const response = await fetch('/api/chat/conversations', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ studentId, mentorId })
  });
  if (!response.ok) {
    let errMsg = 'Failed to create conversation';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const sendMessage = async (conversationId, message) => {
  const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  if (!response.ok) {
    let errMsg = 'Failed to send message';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const markMessagesAsRead = async (conversationId) => {
  const response = await fetch(`/api/chat/conversations/${conversationId}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    let errMsg = 'Failed to mark messages as read';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};
