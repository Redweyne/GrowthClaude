// ═══════════════════════════════════════════════════════════════════════════
// ECHOES - THE REFLECTION EXCHANGE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
//
// "The best way to learn is to teach."
//
// This system enables meaningful human connection through anonymous
// reflection exchange. No likes. No popularity contests. Just two souls
// reflecting on each other's growth journeys.
//
// ═══════════════════════════════════════════════════════════════════════════

// How users are referred to anonymously
export type GenderIdentity = 'brother' | 'sister' | 'traveler';

export function getGenderPronoun(gender: GenderIdentity): {
  subject: string;      // he/she/they
  object: string;       // him/her/them
  possessive: string;   // his/her/their
  reflexive: string;    // himself/herself/themselves
} {
  switch (gender) {
    case 'brother':
      return { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' };
    case 'sister':
      return { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' };
    case 'traveler':
      return { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' };
  }
}

export function getGenderLabel(gender: GenderIdentity): string {
  switch (gender) {
    case 'brother': return 'Brother';
    case 'sister': return 'Sister';
    case 'traveler': return 'Traveler';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC REFLECTION
// A reflection the user chose to share anonymously
// ─────────────────────────────────────────────────────────────────────────────

export interface PublicReflection {
  id: string;
  lessonId: string;
  lessonTitle: string;
  authorId: string;           // Anonymous identifier (not displayed)
  authorGender: GenderIdentity;
  content: string;
  createdAt: string;          // ISO date string
  isOpenToConnect: boolean;   // Did author signal openness to connect?
}

// ─────────────────────────────────────────────────────────────────────────────
// ECHO RESPONSE
// Someone's reflection on another person's reflection
// ─────────────────────────────────────────────────────────────────────────────

export interface EchoResponse {
  id: string;
  reflectionId: string;       // The reflection being responded to
  responderId: string;        // Who wrote the response
  responderGender: GenderIdentity;
  content: string;
  createdAt: string;
  isOpenToConnect: boolean;   // Did responder signal openness?
  isRead: boolean;            // Has the author seen this?
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTION INVITATION
// When someone wants to connect after an echo exchange
// ─────────────────────────────────────────────────────────────────────────────

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface ConnectionInvitation {
  id: string;
  // The reflection that started it all
  originalReflectionId: string;
  originalReflectionContent: string;
  // The echo response
  echoResponseId: string;
  echoResponseContent: string;
  // Who is inviting whom
  inviterId: string;
  inviterGender: GenderIdentity;
  inviteeId: string;
  inviteeGender: GenderIdentity;
  // The invitation message
  message: string;
  // State
  status: ConnectionStatus;
  createdAt: string;
  respondedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTION
// An established connection between two users
// ─────────────────────────────────────────────────────────────────────────────

export interface Connection {
  id: string;
  // The two connected users
  userId1: string;
  userId2: string;
  user1Gender: GenderIdentity;
  user2Gender: GenderIdentity;
  // Context of how they connected
  originReflectionContent: string;
  originEchoContent: string;
  // Timestamps
  connectedAt: string;
  lastMessageAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE
// A message in a growth conversation
// ─────────────────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// INBOX ITEMS
// Unified type for inbox notifications
// ─────────────────────────────────────────────────────────────────────────────

export type InboxItemType = 'echo_received' | 'connection_invitation' | 'connection_accepted' | 'new_message';

export interface InboxItem {
  id: string;
  type: InboxItemType;
  createdAt: string;
  isRead: boolean;
  // Polymorphic data based on type
  data: EchoResponse | ConnectionInvitation | Connection | Message;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED REFLECTION
// Pre-written reflections for when no real ones are available
// ─────────────────────────────────────────────────────────────────────────────

export interface SeedReflection {
  lessonId: string;
  content: string;
  gender: GenderIdentity;
}

// ─────────────────────────────────────────────────────────────────────────────
// ECHO STATE
// The complete state for the Echoes system
// ─────────────────────────────────────────────────────────────────────────────

export interface EchoesState {
  // User's identity
  genderIdentity: GenderIdentity | null;

  // Reflections
  publicReflections: PublicReflection[];

  // Responses to user's reflections
  receivedEchos: EchoResponse[];

  // User's responses to others
  sentEchos: EchoResponse[];

  // Connection invitations (received)
  receivedInvitations: ConnectionInvitation[];

  // Connection invitations (sent)
  sentInvitations: ConnectionInvitation[];

  // Active connections
  connections: Connection[];

  // Messages in connections
  messages: Message[];

  // Reflections user has already responded to (to avoid showing again)
  respondedReflectionIds: string[];

  // Unread counts
  unreadEchoCount: number;
  unreadInvitationCount: number;
  unreadMessageCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ECHO ACTIONS
// Actions for managing the Echoes system
// ─────────────────────────────────────────────────────────────────────────────

export interface EchoesActions {
  // Identity
  setGenderIdentity: (gender: GenderIdentity) => void;

  // Publishing reflections
  publishReflection: (reflection: Omit<PublicReflection, 'id' | 'authorId' | 'authorGender' | 'createdAt'>) => void;

  // Responding to reflections
  sendEchoResponse: (
    reflection: PublicReflection,
    content: string,
    isOpenToConnect: boolean
  ) => void;

  // Mark echo as read
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

  // Get a reflection to review (excludes already responded)
  getReflectionToReview: (lessonId?: string) => PublicReflection | null;

  // Get connection by partner ID
  getConnectionWith: (partnerId: string) => Connection | null;
}
