import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GenderIdentity,
  PublicReflection,
  EchoResponse,
  ConnectionInvitation,
  Connection,
  Message,
} from '@/types/echoes';
import {
  getRandomSeedReflection,
  seedToPublicReflection,
} from '@/content/seedReflections';
import { useStore } from '@/store/useStore';

// ═══════════════════════════════════════════════════════════════════════════
// ECHOES STORE
// ═══════════════════════════════════════════════════════════════════════════
//
// State management for the reflection exchange system.
// Handles public reflections, echo responses, connection invitations,
// and growth conversations.
//
// ═══════════════════════════════════════════════════════════════════════════

interface EchoesState {
  // User's anonymous identity
  genderIdentity: GenderIdentity | null;

  // All public reflections (would be server-side in production)
  publicReflections: PublicReflection[];

  // Echo responses the user has received
  receivedEchos: EchoResponse[];

  // Echo responses the user has sent
  sentEchos: EchoResponse[];

  // Connection invitations received
  receivedInvitations: ConnectionInvitation[];

  // Connection invitations sent
  sentInvitations: ConnectionInvitation[];

  // Active connections
  connections: Connection[];

  // Messages in connections
  messages: Message[];

  // IDs of reflections user has already responded to
  respondedReflectionIds: string[];

  // Has the user seen the echo prompt after completing a lesson today?
  hasSeenEchoPromptToday: boolean;
  lastEchoPromptDate: string | null;
}

interface EchoesActions {
  // Identity
  setGenderIdentity: (gender: GenderIdentity) => void;

  // Publishing reflections
  publishReflection: (
    lessonId: string,
    lessonTitle: string,
    content: string,
    isOpenToConnect: boolean
  ) => void;

  // Get a reflection to review (prioritizes real reflections, falls back to seeds)
  getReflectionToReview: (lessonId: string, lessonTitle: string) => PublicReflection | null;

  // Mark a reflection as responded to
  markReflectionResponded: (reflectionId: string) => void;

  // Send an echo response to someone's reflection
  sendEchoResponse: (
    reflection: PublicReflection,
    content: string,
    isOpenToConnect: boolean
  ) => void;

  // Mark an echo as read
  markEchoAsRead: (echoId: string) => void;

  // Connection invitations
  sendConnectionInvitation: (
    originalReflection: PublicReflection,
    echoResponse: EchoResponse,
    message: string
  ) => void;

  respondToInvitation: (invitationId: string, accept: boolean) => void;

  // Messaging
  sendMessage: (connectionId: string, content: string) => void;
  markMessageAsRead: (messageId: string) => void;

  // Get connection by ID
  getConnection: (connectionId: string) => Connection | null;

  // Get messages for a connection
  getConnectionMessages: (connectionId: string) => Message[];

  // Get unread counts
  getUnreadEchoCount: () => number;
  getUnreadInvitationCount: () => number;
  getUnreadMessageCount: () => number;
  getTotalUnreadCount: () => number;

  // Echo prompt tracking
  markEchoPromptSeen: () => void;
  shouldShowEchoPrompt: () => boolean;

  // Reset (for testing)
  resetEchoes: () => void;
}

const initialState: EchoesState = {
  genderIdentity: null,
  publicReflections: [],
  receivedEchos: [],
  sentEchos: [],
  receivedInvitations: [],
  sentInvitations: [],
  connections: [],
  messages: [],
  respondedReflectionIds: [],
  hasSeenEchoPromptToday: false,
  lastEchoPromptDate: null,
};

export const useEchoesStore = create<EchoesState & EchoesActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ────────────────────────────────────────────────────────────────────
      // IDENTITY
      // ────────────────────────────────────────────────────────────────────

      setGenderIdentity: (gender) => {
        set({ genderIdentity: gender });
      },

      // ────────────────────────────────────────────────────────────────────
      // PUBLISHING REFLECTIONS
      // ────────────────────────────────────────────────────────────────────

      publishReflection: (lessonId, lessonTitle, content, isOpenToConnect) => {
        const state = get();
        if (!state.genderIdentity) return;

        const newReflection: PublicReflection = {
          id: crypto.randomUUID(),
          lessonId,
          lessonTitle,
          authorId: 'current-user', // In production, this would be the real user ID
          authorGender: state.genderIdentity,
          content,
          createdAt: new Date().toISOString(),
          isOpenToConnect,
        };

        set({
          publicReflections: [...state.publicReflections, newReflection],
        });
      },

      // ────────────────────────────────────────────────────────────────────
      // GETTING REFLECTIONS TO REVIEW
      // ────────────────────────────────────────────────────────────────────

      getReflectionToReview: (lessonId, lessonTitle) => {
        const state = get();

        // Get all public reflections NOT by the current user and NOT already responded to
        const availableReflections = state.publicReflections.filter(
          (r) =>
            r.authorId !== 'current-user' &&
            !state.respondedReflectionIds.includes(r.id)
        );

        // Prioritize reflections from the same lesson
        const sameLessonReflections = availableReflections.filter(
          (r) => r.lessonId === lessonId
        );

        if (sameLessonReflections.length > 0) {
          // Return a random one from the same lesson
          const randomIndex = Math.floor(Math.random() * sameLessonReflections.length);
          return sameLessonReflections[randomIndex];
        }

        // If no same-lesson reflections, try any reflection
        if (availableReflections.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableReflections.length);
          return availableReflections[randomIndex];
        }

        // Fall back to seed reflections
        const locale = useStore.getState().language;
        const seed = getRandomSeedReflection(lessonId, locale);
        if (seed) {
          return seedToPublicReflection(seed, lessonTitle) as PublicReflection;
        }

        return null;
      },

      markReflectionResponded: (reflectionId) => {
        const state = get();
        if (!state.respondedReflectionIds.includes(reflectionId)) {
          set({
            respondedReflectionIds: [...state.respondedReflectionIds, reflectionId],
          });
        }
      },

      // ────────────────────────────────────────────────────────────────────
      // SENDING ECHO RESPONSES
      // ────────────────────────────────────────────────────────────────────

      sendEchoResponse: (reflection, content, isOpenToConnect) => {
        const state = get();
        if (!state.genderIdentity) return;

        const newEcho: EchoResponse = {
          id: crypto.randomUUID(),
          reflectionId: reflection.id,
          responderId: 'current-user',
          responderGender: state.genderIdentity,
          content,
          createdAt: new Date().toISOString(),
          isOpenToConnect,
          isRead: false,
        };

        // Mark as responded
        const newRespondedIds = state.respondedReflectionIds.includes(reflection.id)
          ? state.respondedReflectionIds
          : [...state.respondedReflectionIds, reflection.id];

        // If this is a real reflection (not a seed), add to received echoes
        // In production, this would be handled server-side
        const isSeedReflection = reflection.id.startsWith('seed-');

        set({
          sentEchos: [...state.sentEchos, newEcho],
          respondedReflectionIds: newRespondedIds,
          // Simulate the author receiving it (for demo purposes)
          // In production, this would be server-side
          ...(isSeedReflection ? {} : {
            receivedEchos: reflection.authorId === 'current-user'
              ? state.receivedEchos
              : [...state.receivedEchos, { ...newEcho, isRead: false }],
          }),
        });
      },

      markEchoAsRead: (echoId) => {
        const state = get();
        set({
          receivedEchos: state.receivedEchos.map((e) =>
            e.id === echoId ? { ...e, isRead: true } : e
          ),
        });
      },

      // ────────────────────────────────────────────────────────────────────
      // CONNECTION INVITATIONS
      // ────────────────────────────────────────────────────────────────────

      sendConnectionInvitation: (originalReflection, echoResponse, message) => {
        const state = get();
        if (!state.genderIdentity) return;

        // Determine who is inviting whom
        // If current user wrote the original reflection, they're inviting the responder
        // If current user wrote the echo, they're inviting the reflection author
        const isCurrentUserAuthor = originalReflection.authorId === 'current-user';

        const invitation: ConnectionInvitation = {
          id: crypto.randomUUID(),
          originalReflectionId: originalReflection.id,
          originalReflectionContent: originalReflection.content,
          echoResponseId: echoResponse.id,
          echoResponseContent: echoResponse.content,
          inviterId: 'current-user',
          inviterGender: state.genderIdentity,
          inviteeId: isCurrentUserAuthor ? echoResponse.responderId : originalReflection.authorId,
          inviteeGender: isCurrentUserAuthor ? echoResponse.responderGender : originalReflection.authorGender,
          message,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set({
          sentInvitations: [...state.sentInvitations, invitation],
          // For demo: also add to received if it's a self-demo scenario
        });
      },

      respondToInvitation: (invitationId, accept) => {
        const state = get();
        const invitation = state.receivedInvitations.find((i) => i.id === invitationId);

        if (!invitation) return;

        const updatedInvitations = state.receivedInvitations.map((i) =>
          i.id === invitationId
            ? { ...i, status: accept ? 'accepted' : 'declined', respondedAt: new Date().toISOString() }
            : i
        ) as ConnectionInvitation[];

        if (accept) {
          // Create a new connection
          const newConnection: Connection = {
            id: crypto.randomUUID(),
            userId1: invitation.inviterId,
            userId2: invitation.inviteeId,
            user1Gender: invitation.inviterGender,
            user2Gender: invitation.inviteeGender,
            originReflectionContent: invitation.originalReflectionContent,
            originEchoContent: invitation.echoResponseContent,
            connectedAt: new Date().toISOString(),
          };

          set({
            receivedInvitations: updatedInvitations,
            connections: [...state.connections, newConnection],
          });
        } else {
          set({
            receivedInvitations: updatedInvitations,
          });
        }
      },

      // ────────────────────────────────────────────────────────────────────
      // MESSAGING
      // ────────────────────────────────────────────────────────────────────

      sendMessage: (connectionId, content) => {
        const state = get();

        const newMessage: Message = {
          id: crypto.randomUUID(),
          connectionId,
          senderId: 'current-user',
          content,
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        // Update lastMessageAt on the connection
        const updatedConnections = state.connections.map((c) =>
          c.id === connectionId
            ? { ...c, lastMessageAt: newMessage.createdAt }
            : c
        );

        set({
          messages: [...state.messages, newMessage],
          connections: updatedConnections,
        });
      },

      markMessageAsRead: (messageId) => {
        const state = get();
        set({
          messages: state.messages.map((m) =>
            m.id === messageId ? { ...m, isRead: true } : m
          ),
        });
      },

      getConnection: (connectionId) => {
        return get().connections.find((c) => c.id === connectionId) || null;
      },

      getConnectionMessages: (connectionId) => {
        return get()
          .messages.filter((m) => m.connectionId === connectionId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      // ────────────────────────────────────────────────────────────────────
      // UNREAD COUNTS
      // ────────────────────────────────────────────────────────────────────

      getUnreadEchoCount: () => {
        return get().receivedEchos.filter((e) => !e.isRead).length;
      },

      getUnreadInvitationCount: () => {
        return get().receivedInvitations.filter((i) => i.status === 'pending').length;
      },

      getUnreadMessageCount: () => {
        return get().messages.filter((m) => !m.isRead && m.senderId !== 'current-user').length;
      },

      getTotalUnreadCount: () => {
        const state = get();
        return (
          state.receivedEchos.filter((e) => !e.isRead).length +
          state.receivedInvitations.filter((i) => i.status === 'pending').length +
          state.messages.filter((m) => !m.isRead && m.senderId !== 'current-user').length
        );
      },

      // ────────────────────────────────────────────────────────────────────
      // ECHO PROMPT TRACKING
      // ────────────────────────────────────────────────────────────────────

      markEchoPromptSeen: () => {
        const today = new Date().toISOString().split('T')[0];
        set({
          hasSeenEchoPromptToday: true,
          lastEchoPromptDate: today,
        });
      },

      shouldShowEchoPrompt: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        // Reset if it's a new day
        if (state.lastEchoPromptDate !== today) {
          return true;
        }

        return !state.hasSeenEchoPromptToday;
      },

      // ────────────────────────────────────────────────────────────────────
      // RESET
      // ────────────────────────────────────────────────────────────────────

      resetEchoes: () => {
        set(initialState);
      },
    }),
    {
      name: 'echoes-storage',
    }
  )
);

export default useEchoesStore;
