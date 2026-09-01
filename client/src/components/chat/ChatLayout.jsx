import React from 'react';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import EmptyChat from './EmptyChat';
import { useChat } from '../../hooks/useChat';
import { AlertCircle, WifiOff, X } from 'lucide-react';

export default function ChatLayout() {
  const {
    currentUser,
    conversations,
    assignedContacts,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
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
    clearActiveConversation
  } = useChat();

  const currentUserId = currentUser?._id || currentUser?.id;

  const otherUser = activeConversation?.otherUser;
  const otherUserId = otherUser?.id || otherUser?._id;
  const isOnline = otherUserId ? onlineUsers.has(otherUserId.toString()) : false;
  const isTyping = activeConversation ? !!typingUsers[activeConversation.conversationId] : false;

  return (
    <div className="w-full flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden relative">
      {!isConnected && (
        <div className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-500/20">
          <WifiOff size={14} className="animate-pulse" />
          <span>Socket disconnected. Reconnecting...</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-rose-500/20">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-rose-500/20 rounded-lg cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex-1 flex min-h-0 relative">
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
            activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ConversationList
            conversations={conversations}
            assignedContacts={assignedContacts}
            activeConversationId={activeConversation?.conversationId}
            onlineUsers={onlineUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectConversation={selectConversation}
            onStartConversationWithContact={startNewConversationWithContact}
            loading={loadingConversations}
          />
        </div>

        <div
          className={`flex-1 flex flex-col h-full min-h-0 bg-slate-50/20 dark:bg-slate-950/20 ${
            activeConversation ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeConversation ? (
            <>
              <ChatHeader
                participant={otherUser}
                role={otherUser?.role === 'mentor' ? 'Mentor' : 'Student'}
                isOnline={isOnline}
                onBack={clearActiveConversation}
              />

              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                isTyping={isTyping}
                otherUserName={otherUser?.name}
                loadingMessages={loadingMessages}
                loadingMoreMessages={loadingMoreMessages}
                hasMoreMessages={hasMoreMessages}
                onLoadMore={loadOlderMessages}
              />

              <MessageInput
                onSendMessage={sendMessageText}
                onTyping={handleTyping}
                onStopTyping={handleStopTyping}
                disabled={loadingMessages}
              />
            </>
          ) : (
            <EmptyChat mode="no-selection" />
          )}
        </div>
      </div>
    </div>
  );
}
