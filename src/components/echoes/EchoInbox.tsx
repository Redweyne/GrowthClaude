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

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, UserPlus, Check, XIcon, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';
import { AmbientBackground } from '@/components/ambient';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useEchoAuthorProfile } from '@/hooks/useEchoAuthorProfile';
import { MiniProfileCard } from '@/components/profile/MiniProfileCard';
import { useTranslation } from '@/i18n';
import type { EchoResponse, ConnectionInvitation, Connection, GenderIdentity } from '@/types/echoes';

interface EchoInboxProps {
  onClose: () => void;
}

type TabType = 'echoes' | 'invitations' | 'connections';

const TAB_ORDER: TabType[] = ['echoes', 'invitations', 'connections'];

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

  // Fetch public profile for selected echo responder or invitation inviter (opt-in only)
  const { profile: selectedResponderProfile } = useEchoAuthorProfile(selectedEcho?.responderId ?? null);
  const { profile: selectedInviterProfile } = useEchoAuthorProfile(selectedInvitation?.inviterId ?? null);

  const getGenderLabelLocalized = (gender: GenderIdentity) => t(`onboarding.identity.${gender}` as const);
  const getGenderLabelLower = (gender: GenderIdentity) => getGenderLabelLocalized(gender).toLowerCase();
  const getPronouns = (gender: GenderIdentity) => {
    switch (gender) {
      case 'brother':
        return {
          subject: t('echoes.pronounHe'),
          object: t('echoes.pronounHim'),
          possessive: t('echoes.pronounHis'),
        };
      case 'sister':
        return {
          subject: t('echoes.pronounShe'),
          object: t('echoes.pronounHer'),
          possessive: t('echoes.pronounHerPossessive'),
        };
      case 'traveler':
      default:
        return {
          subject: t('echoes.pronounThey'),
          object: t('echoes.pronounThem'),
          possessive: t('echoes.pronounTheir'),
        };
    }
  };

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

  // ─── Swipe between tabs ──────────────────────────────────────────────────
  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null);

  const handleSwipeTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't swipe when viewing detail views (they may have their own scroll)
    if (selectedEcho || selectedInvitation || selectedConnection) return;
    swipeTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, [selectedEcho, selectedInvitation, selectedConnection]);

  const handleSwipeTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeTouchStart.current) return;
    const dx = e.changedTouches[0].clientX - swipeTouchStart.current.x;
    const dy = e.changedTouches[0].clientY - swipeTouchStart.current.y;
    swipeTouchStart.current = null;

    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 50) return;

    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (dx < 0 && currentIndex < TAB_ORDER.length - 1) {
      // Swipe left → next tab
      setActiveTab(TAB_ORDER[currentIndex + 1]);
      setSelectedEcho(null);
      setSelectedInvitation(null);
      setSelectedConnection(null);
    } else if (dx > 0 && currentIndex > 0) {
      // Swipe right → previous tab
      setActiveTab(TAB_ORDER[currentIndex - 1]);
      setSelectedEcho(null);
      setSelectedInvitation(null);
      setSelectedConnection(null);
    }
  }, [activeTab, selectedEcho, selectedInvitation, selectedConnection]);

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'echoes', label: t('echoes.reflections'), count: unreadEchoCount },
    { id: 'invitations', label: t('echoes.invitations'), count: pendingInvitationCount },
    { id: 'connections', label: t('echoes.connectionsTab'), count: connections.length },
  ];

  return (
    <div
      className={`h-full flex flex-col bg-stone-950 light:bg-stone-50 ${isRTL ? 'rtl' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onTouchStart={handleSwipeTouchStart}
      onTouchEnd={handleSwipeTouchEnd}
    >
      <AmbientBackground intensity="subtle" particleCount={4} orbCount={1} />

      {/* Header */}
      <div className="relative z-10 border-b border-stone-800 light:border-stone-200">
        <div className={`flex items-center justify-between p-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h1 className="text-xl font-semibold text-stone-100 light:text-stone-900">{t('echoes.title')}</h1>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors"
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
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 hover:bg-stone-800/50'
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
      <div className="relative z-10 flex-1 overflow-y-auto">
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
                <EmptyState
                  icon={<MessageCircle size={24} />}
                  title={t('echoes.noReflectionsYet')}
                  description={t('echoes.whenSomeoneReflects')}
                  className="py-16"
                />
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
                          : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-800 light:border-stone-200 hover:border-stone-700 light:hover:border-stone-400'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !echo.isRead ? 'bg-amber-500/20' : 'bg-stone-800 light:bg-stone-200'
                        }`}>
                          <Heart size={18} className={!echo.isRead ? 'text-amber-400' : 'text-stone-500 light:text-stone-600'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-200 light:text-stone-800 font-medium">
                            {t('echoes.fellowReflected', { gender: getGenderLabelLower(echo.responderGender) })}
                          </p>
                          <p className="text-stone-500 light:text-stone-600 text-sm mt-1 line-clamp-2">
                            {echo.content}
                          </p>
                          {echo.isOpenToConnect && (
                            <p className="text-amber-400/70 text-xs mt-2">
                              ✨ {t('echoes.openToConnecting')}
                            </p>
                          )}
                        </div>
                        {isRTL ? <ChevronLeft size={18} className="text-stone-600 light:text-stone-500 flex-shrink-0" /> : <ChevronRight size={18} className="text-stone-600 light:text-stone-500 flex-shrink-0" />}
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
                className="mb-4 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 text-sm flex items-center gap-1"
              >
                ← {t('common.back')}
              </button>

              <div className="space-y-6">
                {/* Header — with mini profile card if responder opted in */}
                <div className="text-center">
                  {selectedResponderProfile ? (
                    <div className="flex flex-col items-center gap-3 mb-2">
                      <MiniProfileCard
                        name={selectedResponderProfile.name}
                        avatarUrl={selectedResponderProfile.avatar_url}
                        equippedTitleId={selectedResponderProfile.equipped_title_id}
                        level={selectedResponderProfile.current_level}
                        fallbackLabel={`A ${getGenderLabelLower(selectedEcho.responderGender)}`}
                      />
                      <h2 className="text-lg font-semibold text-stone-100 light:text-stone-900">
                        {t('echoes.fellowReflectedOnYourWords', { gender: selectedResponderProfile.name || getGenderLabelLower(selectedEcho.responderGender) })}
                      </h2>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                        <Heart size={28} className="text-amber-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-100 light:text-stone-900">
                        {t('echoes.fellowReflectedOnYourWords', { gender: getGenderLabelLower(selectedEcho.responderGender) })}
                      </h2>
                    </>
                  )}
                </div>

                {/* Your original reflection */}
                {getOriginalReflection(selectedEcho.reflectionId) && (
                  <div className="p-4 rounded-xl bg-stone-800/50 light:bg-stone-200/50 border border-stone-700/50 light:border-stone-300/50">
                    <p className="text-stone-500 light:text-stone-600 text-sm mb-2">{t('echoes.yourReflectionLabel')}</p>
                    <p className="text-stone-400 light:text-stone-600 text-sm">
                      &ldquo;{getOriginalReflection(selectedEcho.reflectionId)?.content}&rdquo;
                    </p>
                  </div>
                )}

                {/* Their reflection */}
                <div className="p-5 rounded-xl bg-stone-900/80 light:bg-stone-200/80 border border-stone-800 light:border-stone-200">
                  <p className="text-stone-500 light:text-stone-600 text-sm mb-3">
                    {t('echoes.theirReflection', {
                      possessive: getPronouns(selectedEcho.responderGender).possessive.charAt(0).toUpperCase() +
                        getPronouns(selectedEcho.responderGender).possessive.slice(1),
                      gender: getGenderLabelLower(selectedEcho.responderGender),
                    })}
                  </p>
                  <p className="text-stone-200 light:text-stone-800 text-lg leading-relaxed">
                    &ldquo;{selectedEcho.content}&rdquo;
                  </p>
                  {selectedEcho.isOpenToConnect && (
                    <p className="text-amber-400/70 text-sm mt-4">
                      ✨ {t('echoes.theyreOpenToConnect', {
                        subject: getPronouns(selectedEcho.responderGender).subject.charAt(0).toUpperCase() +
                          getPronouns(selectedEcho.responderGender).subject.slice(1),
                      })}
                    </p>
                  )}
                </div>

                {/* Invite to connect */}
                <div className="space-y-4">
                  <p className="text-stone-400 light:text-stone-600 text-center text-sm">
                    {t('echoes.wouldYouLikeToConnect')}
                  </p>

                  <div className="p-4 rounded-xl bg-stone-900/50 light:bg-stone-200/50 border border-stone-800 light:border-stone-200">
                    <textarea
                      value={invitationMessage}
                      onChange={(e) => setInvitationMessage(e.target.value)}
                      placeholder={t('echoes.writeInvitationMessage')}
                      className="w-full min-h-[100px] p-3 bg-transparent text-stone-200 light:text-stone-800 placeholder-stone-600 focus:outline-none resize-none"
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
                    {t('echoes.inviteToConnect')}
                  </Button>

                  <button
                    onClick={() => setSelectedEcho(null)}
                    className="w-full py-3 text-stone-500 light:text-stone-600 hover:text-stone-400 light:hover:text-stone-700 text-sm"
                  >
                    {t('echoes.closeWithoutConnecting')}
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
                <EmptyState
                  icon={<UserPlus size={24} />}
                  title={t('echoes.noPendingInvitations')}
                  description={t('echoes.invitationsWillAppear')}
                  className="py-16"
                />
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
                          {t('echoes.wantsToConnect', { gender: getGenderLabelLower(invitation.inviterGender) })}
                        </p>
                        <p className="text-stone-500 light:text-stone-600 text-sm mt-1 line-clamp-2">
                          {invitation.message}
                        </p>
                      </div>
                      {isRTL ? <ChevronLeft size={18} className="text-stone-600 light:text-stone-500 flex-shrink-0" /> : <ChevronRight size={18} className="text-stone-600 light:text-stone-500 flex-shrink-0" />}
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
                className="mb-4 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 text-sm flex items-center gap-1"
              >
                ← {t('common.back')}
              </button>

              <div className="space-y-6">
                {/* Header — with mini profile card if inviter opted in */}
                <div className="text-center">
                  {selectedInviterProfile ? (
                    <div className="flex flex-col items-center gap-3 mb-2">
                      <MiniProfileCard
                        name={selectedInviterProfile.name}
                        avatarUrl={selectedInviterProfile.avatar_url}
                        equippedTitleId={selectedInviterProfile.equipped_title_id}
                        level={selectedInviterProfile.current_level}
                        fallbackLabel={`A ${getGenderLabelLower(selectedInvitation.inviterGender)}`}
                      />
                      <h2 className="text-xl font-semibold text-stone-100 light:text-stone-900">
                        {t('echoes.connectionRequest')}
                      </h2>
                      <p className="text-stone-500 light:text-stone-600">
                        {t('echoes.wantsToConnect', { gender: selectedInviterProfile.name || getGenderLabelLower(selectedInvitation.inviterGender) })}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                        <UserPlus size={28} className="text-amber-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-100 light:text-stone-900">
                        {t('echoes.connectionRequest')}
                      </h2>
                      <p className="text-stone-500 light:text-stone-600 mt-2">
                        {t('echoes.wantsToConnect', { gender: getGenderLabelLower(selectedInvitation.inviterGender) })}
                      </p>
                    </>
                  )}
                </div>

                {/* Context */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-800/50 light:bg-stone-200/50 border border-stone-700/50 light:border-stone-300/50">
                    <p className="text-stone-500 light:text-stone-600 text-sm mb-2">{t('echoes.yourReflectionLabel')}</p>
                    <p className="text-stone-400 light:text-stone-600 text-sm">
                      &ldquo;{selectedInvitation.originalReflectionContent}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-900/80 light:bg-stone-200/80 border border-stone-800 light:border-stone-200">
                    <p className="text-stone-500 light:text-stone-600 text-sm mb-2">
                      {t('echoes.theirReflection', {
                        possessive: getPronouns(selectedInvitation.inviterGender).possessive.charAt(0).toUpperCase() +
                          getPronouns(selectedInvitation.inviterGender).possessive.slice(1),
                        gender: getGenderLabelLower(selectedInvitation.inviterGender),
                      })}
                    </p>
                    <p className="text-stone-300 light:text-stone-700">
                      &ldquo;{selectedInvitation.echoResponseContent}&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-amber-400/70 text-sm mb-2">
                      {t('echoes.invitationMessageLabel', {
                        possessive: getPronouns(selectedInvitation.inviterGender).possessive.charAt(0).toUpperCase() +
                          getPronouns(selectedInvitation.inviterGender).possessive.slice(1),
                        gender: getGenderLabelLower(selectedInvitation.inviterGender),
                      })}
                    </p>
                    <p className="text-stone-200 light:text-stone-800">
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
                    {t('echoes.decline')}
                  </Button>
                  <Button
                    onClick={() => handleRespondToInvitation(true)}
                    glow
                    size="lg"
                    className="flex-1"
                  >
                    <Check size={18} className="mr-2" />
                    {t('echoes.acceptConnect')}
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
                <EmptyState
                  icon={<MessageCircle size={24} />}
                  title={t('echoes.noConnectionsYet')}
                  description={t('echoes.conversationsWillAppear')}
                  className="py-16"
                />
              ) : (
                connections.map((connection) => {
                  const partnerGender = getPartnerGender(connection);
                  const messages = getConnectionMessages(connection.id);
                  const lastMessage = messages[messages.length - 1];

                  return (
                    <motion.button
                      key={connection.id}
                      onClick={() => setSelectedConnection(connection)}
                      className="w-full text-left p-4 rounded-xl bg-stone-900/50 light:bg-stone-200/50 border border-stone-800 light:border-stone-200 hover:border-stone-700 light:hover:border-stone-400 transition-all"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <MessageCircle size={18} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-stone-200 light:text-stone-800 font-medium">
                            {t('echoes.fellowLabel', { gender: getGenderLabelLower(partnerGender) })}
                          </p>
                          <p className="text-stone-500 light:text-stone-600 text-sm mt-1 line-clamp-1">
                            {lastMessage
                              ? lastMessage.content
                              : t('echoes.connectedThroughReflection')}
                          </p>
                        </div>
                        {isRTL ? <ChevronLeft size={18} className="text-stone-600 light:text-stone-500 flex-shrink-0" /> : <ChevronRight size={18} className="text-stone-600 light:text-stone-500 flex-shrink-0" />}
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
              <div className="p-4 border-b border-stone-800 light:border-stone-200">
                <button
                  onClick={() => setSelectedConnection(null)}
                  className="mb-2 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 text-sm flex items-center gap-1"
                >
                  ← {t('common.back')}
                </button>
                <p className="text-stone-200 light:text-stone-800 font-medium">
                  {t('echoes.growthConversation')}
                </p>
                <p className="text-stone-500 light:text-stone-600 text-sm">
                  {t('echoes.withFellow', { gender: getGenderLabelLower(getPartnerGender(selectedConnection)) })}
                </p>
              </div>

              {/* Connection context */}
              <div className="p-4 border-b border-stone-800 light:border-stone-200 bg-stone-900/50 light:bg-stone-200/50">
                <p className="text-stone-500 light:text-stone-600 text-xs mb-2">{t('echoes.youConnectedThrough')}</p>
                <p className="text-stone-400 light:text-stone-600 text-sm line-clamp-2">
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
                          ? 'bg-amber-500/20 text-stone-200 light:text-stone-800'
                          : 'bg-stone-800 light:bg-stone-200 text-stone-300 light:text-stone-700'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}

                {getConnectionMessages(selectedConnection.id).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-stone-500 light:text-stone-600 text-sm">
                      {t('echoes.startConversation')}
                    </p>
                  </div>
                )}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-stone-800 light:border-stone-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('echoes.typeMessage')}
                    className="flex-1 px-4 py-3 rounded-xl bg-stone-800 light:bg-stone-200 border border-stone-700 light:border-stone-300 text-stone-200 light:text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-600"
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
