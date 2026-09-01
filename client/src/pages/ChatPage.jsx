import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChatLayout from '../components/chat/ChatLayout';

export default function ChatPage({ darkMode, setDarkMode }) {
  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let user = null;
  if (sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      user = JSON.parse(sessionUserStr);
    } catch (e) {}
  }

  return (
    <DashboardLayout
      user={user}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      activeTab="messages"
    >
      <ChatLayout />
    </DashboardLayout>
  );
}
