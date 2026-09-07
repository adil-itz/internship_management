const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const generateCertificate = async (internshipId) => {
  const response = await fetch(`/api/certificates/generate/${internshipId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to generate certificate';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const getStudentCertificates = async () => {
  const response = await fetch('/api/certificates/student', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to fetch certificates';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const getCertificateDetails = async (certificateId) => {
  const response = await fetch(`/api/certificates/${certificateId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to fetch certificate details';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const downloadCertificate = async (certificateId) => {
  const response = await fetch(`/api/certificates/${certificateId}/download`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to download certificate';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${certificateId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const resendCertificateEmail = async (certificateId) => {
  const response = await fetch(`/api/certificates/${certificateId}/email`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errMsg = 'Failed to resend certificate email';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};

export const verifyCertificatePublic = async (certificateId) => {
  const response = await fetch(`/api/certificates/verify/${certificateId}`, {
    method: 'GET',
  });
  if (!response.ok) {
    let errMsg = 'Failed to verify certificate';
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (e) {}
    throw new Error(errMsg);
  }
  return response.json();
};
