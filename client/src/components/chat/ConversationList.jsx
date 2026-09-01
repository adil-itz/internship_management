import React from 'react';
import ConversationItem from './ConversationItem';
import EmptyChat from './EmptyChat';
import { Search, UserPlus, Users } from 'lucide-react';

export default function ConversationList({
  conversations = [],
  assignedContacts = [],
  activeConversationId,
  onlineUsers = new Set(),
  searchQuery,
  setSearchQuery,
  onSelectConversation,
  onStartConversationWithContact,
  loading
}) {
  const existingUserIds = new Set(
    conversations.map(c => c.otherUser?.id?.toString() || c.otherUser?._id?.toString())
  );

  const availableContacts = assignedContacts.filter(
    contact => !existingUserIds.has(contact.id?.toString())
  );

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Users size={18} className="text-blue-600 dark:text-blue-400" />
          <span>Messages</span>
        </h2>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="p-3 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 animate-pulse">
                <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="w-36 h-2 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {conversations.length > 0 && (
              <div className="space-y-1">
                {conversations.map((conv) => {
                  const otherUserId = conv.otherUser?.id || conv.otherUser?._id;
                  const isOnline = onlineUsers.has(otherUserId?.toString());
                  const isSelected = activeConversationId === conv.conversationId;

                  return (
                    <ConversationItem
                      key={conv.conversationId}
                      conversation={conv}
                      isSelected={isSelected}
                      isOnline={isOnline}
                      onClick={() => onSelectConversation(conv)}
                    />
                  );
                })}
              </div>
            )}

            {availableContacts.length > 0 && (
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <UserPlus size={12} />
                  <span>Start New Chat</span>
                </div>
                {availableContacts.map((contact) => {
                  const isOnline = onlineUsers.has(contact.id?.toString());
                  return (
                    <button
                      key={contact.id}
                      onClick={() => onStartConversationWithContact(contact)}
                      className="w-full p-3 rounded-2xl flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer text-left group"
                    >
                      <div className="relative shrink-0">
                        {contact.avatar ? (
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-10 h-10 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                            {contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {contact.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">
                          {contact.role} {contact.internshipTitle ? `• ${contact.internshipTitle}` : ''}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {conversations.length === 0 && availableContacts.length === 0 && (
              <EmptyChat mode="no-conversations" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
