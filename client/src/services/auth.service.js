const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const get2FAStatus = async () => {
  const response = await fetch('/api/auth/2fa/status', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to fetch 2FA status';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const setup2FA = async () => {
  const response = await fetch('/api/auth/2fa/setup', {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to initiate 2FA setup';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const verify2FASetup = async (token) => {
  const response = await fetch('/api/auth/2fa/verify-setup', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    let errMsg = 'Invalid OTP code';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const verify2FALogin = async (challengeToken, token) => {
  const response = await fetch('/api/auth/2fa/verify-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ challengeToken, token }),
  });
  if (!response.ok) {
    let errMsg = 'Invalid or expired OTP code';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const disable2FA = async (password) => {
  const response = await fetch('/api/auth/2fa/disable', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    let errMsg = 'Failed to disable 2FA';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};
