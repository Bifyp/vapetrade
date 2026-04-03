// lib/pusher.ts

// Server-side Pusher (только для API routes и Server Actions)
import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Singleton для server-side
const globalForPusher = globalThis as unknown as {
  pusherServer: PusherServer | undefined;
};

export const pusherServer =
  globalForPusher.pusherServer ??
  new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPusher.pusherServer = pusherServer;
}

// Client-side Pusher (используется в Client Components)
// Lazy init — только в браузере
let pusherClientInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    );
  }
  return pusherClientInstance;
}

// Имена Pusher каналов и событий — централизованно во избежание опечаток
export const PUSHER_CHANNELS = {
  conversation: (id: string) => `private-conversation-${id}`,
  userNotifications: (userId: string) => `private-user-${userId}`,
} as const;

export const PUSHER_EVENTS = {
  newMessage: "new-message",
  messageRead: "message-read",
  newNotification: "new-notification",
} as const;
