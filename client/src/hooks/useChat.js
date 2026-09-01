import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  getConversations,
  getMessages,
  sendMessage as apiSendMessage,
  markMessagesAsRead as apiMarkAsRead,
  createConversation
} from '../services/chat.service';
import { getMyAssignments, getStudentAssignments } from '../services/mentorAssignment.service';
import {
  getSocket,
  joinConversationRoom,
  leaveConversationRoom,
  emitTyping,
  emitStopTyping,
  emitMarkMessagesAsRead
} from '../services/socket';

export function useChat() {
  const [conversations, setConversations] = useState([]);
  const [assignedContacts, setAssignedContacts] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const typingTimeoutRef = useRef(null);

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  const currentUser = useMemo(() => {
    if (sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
      try {
        return JSON.parse(sessionUserStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [sessionUserStr]);

  const currentUserId = currentUser?._id || currentUser?.id;

  const fetchConversationsList = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const data = await getConversations();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const fetchAssignedContacts = useCallback(async () => {
    if (!currentUser) return;
    try {
      if (currentUser.role === 'mentor') {
        const res = await getMyAssignments();
        if (res.success && res.assignments) {
          const contacts = res.assignments.map(a => ({
            id: a.student._id || a.student.id,
            name: a.student.name,
            email: a.student.email,
            avatar: a.student.avatar,
            role: 'student',
            internshipTitle: a.internship?.title
          }));
          setAssignedContacts(contacts);
        }
      } else if (currentUser.role === 'student') {
        const res = await getStudentAssignments();
        if (res.success && res.assignments) {
          const contacts = res.assignments.map(a => ({
            id: a.mentor._id || a.mentor.id,
            name: a.mentor.name,
            email: a.mentor.email,
            avatar: a.mentor.avatar,
            role: 'mentor',
            internshipTitle: a.internship?.title
          }));
          setAssignedContacts(contacts);
        }
      }
    } catch (e) { }
  }, [currentUser]);

  useEffect(() => {
    fetchConversationsList();
    fetchAssignedContacts();
  }, [fetchConversationsList, fetchAssignedContacts]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onConnectError = () => setIsConnected(false);

    const onOnlineUsersList = ({ userIds }) => {
      setOnlineUsers(new Set(userIds || []));
    };

    const onUserOnline = ({ userId }) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    };

    const onUserOffline = ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    const onNewMessage = (newMessage) => {
      const convId = newMessage.conversationId;

      setMessages(prev => {
        if (activeConversation && activeConversation.conversationId === convId) {
          if (prev.some(m => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        }
        return prev;
      });

      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.conversationId === convId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const isActive = activeConversation && activeConversation.conversationId === convId;
          const isReceiver = newMessage.receiverId === currentUserId;

          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: newMessage.message,
            lastMessageAt: newMessage.createdAt,
            unreadCount: !isActive && isReceiver
              ? updated[existingIndex].unreadCount + 1
              : updated[existingIndex].unreadCount
          };

          const [moved] = updated.splice(existingIndex, 1);
          return [moved, ...updated];
        } else {
          fetchConversationsList();
          return prev;
        }
      });

      if (activeConversation && activeConversation.conversationId === convId && newMessage.receiverId === currentUserId) {
        apiMarkAsRead(convId).catch(() => { });
        emitMarkMessagesAsRead(convId);
      }
    };

    const onMessagesRead = ({ conversationId, readBy, readAt }) => {
      if (activeConversation && activeConversation.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(m => (m.senderId === currentUserId ? { ...m, read: true, readAt } : m))
        );
      }
      setConversations(prev =>
        prev.map(c =>
          c.conversationId === conversationId && readBy === currentUserId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    };

    const onUserTyping = ({ userId, conversationId }) => {
      if (userId !== currentUserId) {
        setTypingUsers(prev => ({ ...prev, [conversationId]: true }));
      }
    };

    const onUserStoppedTyping = ({ userId, conversationId }) => {
      if (userId !== currentUserId) {
        setTypingUsers(prev => ({ ...prev, [conversationId]: false }));
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('onlineUsersList', onOnlineUsersList);
    socket.on('userOnline', onUserOnline);
    socket.on('userOffline', onUserOffline);
    socket.on('newMessage', onNewMessage);
    socket.on('newMessageNotification', onNewMessage);
    socket.on('messagesRead', onMessagesRead);
    socket.on('userTyping', onUserTyping);
    socket.on('userStoppedTyping', onUserStoppedTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('onlineUsersList', onOnlineUsersList);
      socket.off('userOnline', onUserOnline);
      socket.off('userOffline', onUserOffline);
      socket.off('newMessage', onNewMessage);
      socket.off('newMessageNotification', onNewMessage);
      socket.off('messagesRead', onMessagesRead);
      socket.off('userTyping', onUserTyping);
      socket.off('userStoppedTyping', onUserStoppedTyping);
    };
  }, [activeConversation, currentUserId, fetchConversationsList]);

  const selectConversation = useCallback(async (conv) => {
    if (activeConversation && activeConversation.conversationId) {
      leaveConversationRoom(activeConversation.conversationId);
    }

    setActiveConversation(conv);
    setMessages([]);
    setLoadingMessages(true);

    try {
      joinConversationRoom(conv.conversationId);
      const res = await getMessages(conv.conversationId, 1, 50);
      if (res.success) {
        setMessages(res.messages || []);
        setPagination(res.pagination || { page: 1, limit: 50, total: 0, totalPages: 1 });
      }

      if (conv.unreadCount > 0) {
        await apiMarkAsRead(conv.conversationId);
        emitMarkMessagesAsRead(conv.conversationId);
        setConversations(prev =>
          prev.map(c => (c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, [activeConversation]);

  const startNewConversationWithContact = useCallback(async (contact) => {
    try {
      let studentId, mentorId;
      if (currentUser?.role === 'mentor') {
        mentorId = currentUserId;
        studentId = contact.id;
      } else {
        studentId = currentUserId;
        mentorId = contact.id;
      }

      const res = await createConversation(studentId, mentorId);
      if (res.success && res.conversation) {
        const convId = res.conversation._id;
        let formattedConv = conversations.find(c => c.conversationId === convId);
        if (!formattedConv) {
          formattedConv = {
            conversationId: convId,
            otherUser: {
              id: contact.id,
              name: contact.name,
              email: contact.email,
              avatar: contact.avatar,
              role: contact.role
            },
            lastMessage: '',
            lastMessageAt: res.conversation.updatedAt || new Date().toISOString(),
            unreadCount: 0
          };
          setConversations(prev => [formattedConv, ...prev]);
        }
        selectConversation(formattedConv);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start conversation');
    }
  }, [currentUser, currentUserId, conversations, selectConversation]);

  const loadOlderMessages = useCallback(async () => {
    if (!activeConversation || loadingMoreMessages || pagination.page >= pagination.totalPages) return;
    setLoadingMoreMessages(true);
    const nextPage = pagination.page + 1;
    try {
      const res = await getMessages(activeConversation.conversationId, nextPage, pagination.limit);
      if (res.success) {
        setMessages(prev => [...res.messages, ...prev]);
        setPagination(res.pagination);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load older messages');
    } finally {
      setLoadingMoreMessages(false);
    }
  }, [activeConversation, loadingMoreMessages, pagination]);

  const sendMessageText = useCallback(async (text) => {
    if (!activeConversation || !text || text.trim() === '') return;
    const trimmed = text.trim();

    handleStopTyping();

    try {
      const res = await apiSendMessage(activeConversation.conversationId, trimmed);
      if (res.success && res.data) {
        setMessages(prev => {
          if (prev.some(m => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });
        setConversations(prev =>
          prev.map(c =>
            c.conversationId === activeConversation.conversationId
              ? { ...c, lastMessage: trimmed, lastMessageAt: res.data.createdAt }
              : c
          )
        );
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send message');
    }
  }, [activeConversation]);

  const handleTyping = useCallback(() => {
    if (!activeConversation) return;
    emitTyping(activeConversation.conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(activeConversation.conversationId);
    }, 2000);
  }, [activeConversation]);

  const handleStopTyping = useCallback(() => {
    if (!activeConversation) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitStopTyping(activeConversation.conversationId);
  }, [activeConversation]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(c =>
      c.otherUser?.name?.toLowerCase().includes(q) ||
      c.otherUser?.email?.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return assignedContacts;
    const q = searchQuery.toLowerCase();
    return assignedContacts.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }, [assignedContacts, searchQuery]);

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  return {
    currentUser,
    conversations: filteredConversations,
    allConversations: conversations,
    assignedContacts: filteredContacts,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages: pagination.page < pagination.totalPages,
    searchQuery,
    setSearchQuery,
    onlineUsers,
    typingUsers,
    isConnected,
    errorMessage,
    setErrorMessage,
    selectConversation,
    startNewConversationWithContact,
    loadOlderMessages,
    sendMessageText,
    handleTyping,
    handleStopTyping,
    totalUnreadCount,
    clearActiveConversation: () => setActiveConversation(null)
  };
}
