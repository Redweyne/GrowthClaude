'use client';

// ═══════════════════════════════════════════════════════════════════════════
// ECHO INBOX - WHERE CONNECTIONS LIVE
// ═══════════════════════════════════════════════════════════════════════════
//
// This is the heart of human connection in the app. Here users:
// - See reflections others have written about their words
// - Receive and respond to connection invitations
// - Continue conversations with accepted connections
//
// The design is intimate, not social-media-like. Each interaction matters.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, UserPlus, Check, XIcon, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { AmbientBackground } from '@/components/ambient';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useTranslation } from '@/i18n';
import { getGenderLabel, getGenderPronoun } from '@/types/echoes';
import type { EchoResponse, ConnectionInvitation, Connection } from '@/types/echoes';

interface EchoInboxProps {
  onClose: () => void;
}

type TabType = 'echoes' | 'invitations' | 'connections';

export function EchoInbox({ onClose }: EchoInboxProps) {
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('echoes');
  const [selectedEcho, setSelectedEcho] = useState<EchoResponse | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<ConnectionInvitation | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const {
    receivedEchos,
    receivedInvitations,
    connections,
    markEchoAsRead,
    sendConnectionInvitation,
    respondToInvitation,
    sendMessage,
    getConnectionMessages,
    genderIdentity,
    publicReflections,
  } = useEchoesStore();

  // Counts
  const unreadEchoCount = receivedEchos.filter(e => !e.isRead).length;
  const pendingInvitationCount = receivedInvitations.filter(i => i.status === 'pending').length;

  // Get the original reflection for an echo
  const getOriginalReflection = (reflectionId: string) => {
    return publicReflections.find(r => r.id === reflectionId);
  };

  // Handle viewing an echo
  const handleViewEcho = (echo: EchoResponse) => {
    setSelectedEcho(echo);
    if (!echo.isRead) {
      markEchoAsRead(echo.id);
    }
  };

  // Handle sending connection invitation from echo
  const handleSendInvitation = () => {
    if (!selectedEcho || !invitationMessage.trim()) return;

    const originalReflection = getOriginalReflection(selectedEcho.reflectionId);
    if (!originalReflection) return;

    sendConnectionInvitation(originalReflection, selectedEcho, invitationMessage.trim());
    setInvitationMessage('');
    setSelectedEcho(null);
  };

  // Handle responding to invitation
  const handleRespondToInvitation = (accept: boolean) => {
    if (!selectedInvitation) return;
    respondToInvitation(selectedInvitation.id, accept);
    setSelectedInvitation(null);
  };

  // Handle sending chat message
  const handleSendMessage = () => {
    if (!selectedConnection || !chatMessage.trim()) return;
    sendMessage(selectedConnection.id, chatMessage.trim());
    setChatMessage('');
  };

  // Get partner info from connection
  const getPartnerGender = (connection: Connection) => {
    return connection.userId1 === 'current-user' ? connection.user2Gender : connection.user1Gender;
  };

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'echoes', label: t('echoes.reflections'), count: unreadEchoCount },
    { id: 'invitations', label: t('echoes.invitations'), count: pendingInvitationCount },
    { id: 'connections', label: t('echoes.connectionsTab'), count: connections.length },
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-stone-950 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <AmbientBackground intensity="subtle" particleCount={4} orbCount={1} />

      {/* Header */}
      <div className="relative z-10 border-b border-stone-800">
        <div className={`flex items-center justify-between p-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1 className="text-xl font-semibold text-stone-100">{t('echoes.title')}</h1>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedEcho(null);
                setSelectedInvitation(null);
                setSelectedConnection(null);
              }}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
              }`}
            >
              {tab.label}
              {tab.count && tab.count > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-[calc(100vh-120px)] overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              ECHOES TAB
          ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'echoes' && !selectedEcho && (
            <motion.div
              key="echoes-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-3"
            >
              {receivedEchos.length === 0 ? (
                <div className="text-center py-16">
                  <MessageCircle size={48} className="mx-auto text-stone-700 mb-4" />
                  <p className="text-stone-500">No reflections yet</p>
                  <p className="text-stone-600 text-sm mt-2">
                    When someone reflects on your words, you&apos;ll see it here
                  </p>
                </div>
              ) : (
                receivedEchos.map((echo) => {
                  const originalReflection = getOriginalReflection(echo.reflectionId);
                  return (
                    <motion.button
                      key={echo.id}
                      onClick={() => handleViewEcho(echo)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        !echo.isRead
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !echo.isRead ? 'bg-amber-500/20' : 'bg-stone-800'
                        }`}>
                          <Heart size={18} className={!echo.isRead ? 'text-amber-400' : 'text-stone-500'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-200 font-medium">
                            A fellow {getGenderLabel(echo.responderGender).toLowerCase()} reflected
                          </p>
                          <p className="text-stone-500 text-sm mt-1 line-clamp-2">
                            {echo.content}
                          </p>
                          {echo.isOpenToConnect && (
                            <p className="text-amber-400/70 text-xs mt-2">
                              ✨ Open to connecting
                            </p>
                          )}
                        </div>
                        <ChevronRight size={18} className="text-stone-600 flex-shrink-0" />
                      </div>
                    </motion.button>
                  );
                })
              )}
            </motion.div>
          )}

          {/* Echo Detail View */}
          {activeTab === 'echoes' && selectedEcho && (
            <motion.div
              key="echo-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <button
                onClick={() => setSelectedEcho(null)}
                className="mb-4 text-stone-500 hover:text-stone-300 text-sm flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-amber-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-100">
                    A fellow {getGenderLabel(selectedEcho.responderGender).toLowerCase()} reflected on your words
                  </h2>
                </div>

                {/* Your original reflection */}
                {getOriginalReflection(selectedEcho.reflectionId) && (
                  <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
                    <p className="text-stone-500 text-sm mb-2">Your reflection:</p>
                    <p className="text-stone-400 text-sm">
                      &ldquo;{getOriginalReflection(selectedEcho.reflectionId)?.content}&rdquo;
                    </p>
                  </div>
                )}

                {/* Their reflection */}
                <div className="p-5 rounded-xl bg-stone-900/80 border border-stone-800">
                  <p className="text-stone-500 text-sm mb-3">
                    {getGenderPronoun(selectedEcho.responderGender).possessive.charAt(0).toUpperCase() +
                     getGenderPronoun(selectedEcho.responderGender).possessive.slice(1)} reflection for you:
                  </p>
                  <p className="text-stone-200 text-lg leading-relaxed">
                    &ldquo;{selectedEcho.content}&rdquo;
                  </p>
                  {selectedEcho.isOpenToConnect && (
                    <p className="text-amber-400/70 text-sm mt-4">
                      ✨ {getGenderPronoun(selectedEcho.responderGender).subject.charAt(0).toUpperCase() +
                         getGenderPronoun(selectedEcho.responderGender).subject.slice(1)}&apos;{selectedEcho.responderGender === 'traveler' ? 're' : 's'} open to connecting
                    </p>
                  )}
                </div>

                {/* Invite to connect */}
                <div className="space-y-4">
                  <p className="text-stone-400 text-center text-sm">
                    Would you like to connect with this person?
                  </p>

                  <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800">
                    <textarea
                      value={invitationMessage}
                      onChange={(e) => setInvitationMessage(e.target.value)}
                      placeholder="Write a message with your invitation..."
                      className="w-full min-h-[100px] p-3 bg-transparent text-stone-200 placeholder-stone-600 focus:outline-none resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSendInvitation}
                    disabled={!invitationMessage.trim()}
                    glow={!!invitationMessage.trim()}
                    size="lg"
                    className="w-full"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Invite to Connect
                  </Button>

                  <button
                    onClick={() => setSelectedEcho(null)}
                    className="w-full py-3 text-stone-500 hover:text-stone-400 text-sm"
                  >
                    Close without connecting
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              INVITATIONS TAB
          ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'invitations' && !selectedInvitation && (
            <motion.div
              key="invitations-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-3"
            >
              {receivedInvitations.filter(i => i.status === 'pending').length === 0 ? (
                <div className="text-center py-16">
                  <UserPlus size={48} className="mx-auto text-stone-700 mb-4" />
                  <p className="text-stone-500">No pending invitations</p>
                  <p className="text-stone-600 text-sm mt-2">
                    Connection invitations will appear here
                  </p>
                </div>
              ) : (
                receivedInvitations.filter(i => i.status === 'pending').map((invitation) => (
                  <motion.button
                    key={invitation.id}
                    onClick={() => setSelectedInvitation(invitation)}
                    className="w-full text-left p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <UserPlus size={18} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-200 font-medium">
                          A fellow {getGenderLabel(invitation.inviterGender).toLowerCase()} wants to connect
                        </p>
                        <p className="text-stone-500 text-sm mt-1 line-clamp-2">
                          {invitation.message}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-stone-600 flex-shrink-0" />
                    </div>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}

          {/* Invitation Detail View */}
          {activeTab === 'invitations' && selectedInvitation && (
            <motion.div
              key="invitation-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <button
                onClick={() => setSelectedInvitation(null)}
                className="mb-4 text-stone-500 hover:text-stone-300 text-sm flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                    <UserPlus size={28} className="text-amber-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-100">
                    Connection Request
                  </h2>
                  <p className="text-stone-500 mt-2">
                    A fellow {getGenderLabel(selectedInvitation.inviterGender).toLowerCase()} wants to connect
                  </p>
                </div>

                {/* Context */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50">
                    <p className="text-stone-500 text-sm mb-2">Your reflection:</p>
                    <p className="text-stone-400 text-sm">
                      &ldquo;{selectedInvitation.originalReflectionContent}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
                    <p className="text-stone-500 text-sm mb-2">
                      {getGenderPronoun(selectedInvitation.inviterGender).possessive.charAt(0).toUpperCase() +
                       getGenderPronoun(selectedInvitation.inviterGender).possessive.slice(1)} reflection:
                    </p>
                    <p className="text-stone-300">
                      &ldquo;{selectedInvitation.echoResponseContent}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-amber-400/70 text-sm mb-2">
                      {getGenderPronoun(selectedInvitation.inviterGender).possessive.charAt(0).toUpperCase() +
                       getGenderPronoun(selectedInvitation.inviterGender).possessive.slice(1)} message:
                    </p>
                    <p className="text-stone-200">
                      &ldquo;{selectedInvitation.message}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleRespondToInvitation(false)}
                    variant="ghost"
                    size="lg"
                    className="flex-1"
                  >
                    <XIcon size={18} className="mr-2" />
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleRespondToInvitation(true)}
                    glow
                    size="lg"
                    className="flex-1"
                  >
                    <Check size={18} className="mr-2" />
                    Accept & Connect
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              CONNECTIONS TAB
          ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'connections' && !selectedConnection && (
            <motion.div
              key="connections-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-3"
            >
              {connections.length === 0 ? (
                <div className="text-center py-16">
                  <MessageCircle size={48} className="mx-auto text-stone-700 mb-4" />
                  <p className="text-stone-500">No connections yet</p>
                  <p className="text-stone-600 text-sm mt-2">
                    When you connect with someone, your conversations will appear here
                  </p>
                </div>
              ) : (
                connections.map((connection) => {
                  const partnerGender = getPartnerGender(connection);
                  const messages = getConnectionMessages(connection.id);
                  const lastMessage = messages[messages.length - 1];

                  return (
                    <motion.button
                      key={connection.id}
                      onClick={() => setSelectedConnection(connection)}
                      className="w-full text-left p-4 rounded-xl bg-stone-900/50 border border-stone-800 hover:border-stone-700 transition-all"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <MessageCircle size={18} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-200 font-medium">
                            A fellow {getGenderLabel(partnerGender).toLowerCase()}
                          </p>
                          <p className="text-stone-500 text-sm mt-1 line-clamp-1">
                            {lastMessage
                              ? lastMessage.content
                              : 'Connected through reflection'}
                          </p>
                        </div>
                        <ChevronRight size={18} className="text-stone-600 flex-shrink-0" />
                      </div>
                    </motion.button>
                  );
                })
              )}
            </motion.div>
          )}

          {/* Connection Chat View */}
          {activeTab === 'connections' && selectedConnection && (
            <motion.div
              key="connection-chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Chat header */}
              <div className="p-4 border-b border-stone-800">
                <button
                  onClick={() => setSelectedConnection(null)}
                  className="mb-2 text-stone-500 hover:text-stone-300 text-sm flex items-center gap-1"
                >
                  ← Back
                </button>
                <p className="text-stone-200 font-medium">
                  Growth Conversation
                </p>
                <p className="text-stone-500 text-sm">
                  with a fellow {getGenderLabel(getPartnerGender(selectedConnection)).toLowerCase()}
                </p>
              </div>

              {/* Connection context */}
              <div className="p-4 border-b border-stone-800 bg-stone-900/50">
                <p className="text-stone-500 text-xs mb-2">You connected through:</p>
                <p className="text-stone-400 text-sm line-clamp-2">
                  &ldquo;{selectedConnection.originReflectionContent.slice(0, 100)}...&rdquo;
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getConnectionMessages(selectedConnection.id).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.senderId === 'current-user'
                          ? 'bg-amber-500/20 text-stone-200'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}

                {getConnectionMessages(selectedConnection.id).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-stone-500 text-sm">
                      Start your growth conversation...
                    </p>
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-stone-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-500 focus:outline-none focus:border-stone-600"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    size="lg"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default EchoInbox;
