export interface SessionEvent {
  type: "logout";
  reason?: string;
  at: number;
  sender: string;
}

const SESSION_CHANNEL_NAME = "lyncs-session-events";
const SESSION_STORAGE_EVENT_KEY = "lyncs-session-event";

const senderId =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `sender-${Date.now()}`;

const parseSessionEvent = (raw: unknown): SessionEvent | null => {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Partial<SessionEvent>;
  if (payload.type !== "logout") return null;
  if (typeof payload.sender !== "string") return null;
  if (typeof payload.at !== "number") return null;

  return {
    type: "logout",
    reason: payload.reason,
    at: payload.at,
    sender: payload.sender,
  };
};

const emitStorageEvent = (event: SessionEvent) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STORAGE_EVENT_KEY, JSON.stringify(event));
  window.localStorage.removeItem(SESSION_STORAGE_EVENT_KEY);
};

export const broadcastLogoutEvent = (reason?: string) => {
  if (typeof window === "undefined") return;

  const payload: SessionEvent = {
    type: "logout",
    reason,
    at: Date.now(),
    sender: senderId,
  };

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(SESSION_CHANNEL_NAME);
    channel.postMessage(payload);
    channel.close();
  }

  emitStorageEvent(payload);
};

export const subscribeToSessionEvents = (
  onEvent: (event: SessionEvent) => void,
) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleEvent = (event: SessionEvent) => {
    if (event.sender === senderId) return;
    onEvent(event);
  };

  let channel: BroadcastChannel | null = null;

  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(SESSION_CHANNEL_NAME);
    channel.onmessage = (message) => {
      const event = parseSessionEvent(message.data);
      if (!event) return;
      handleEvent(event);
    };
  }

  const onStorage = (storageEvent: StorageEvent) => {
    if (storageEvent.key !== SESSION_STORAGE_EVENT_KEY) return;
    if (!storageEvent.newValue) return;

    try {
      const parsed = JSON.parse(storageEvent.newValue) as SessionEvent;
      const event = parseSessionEvent(parsed);
      if (!event) return;
      handleEvent(event);
    } catch {
      // Ignore malformed sync payloads.
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
    if (channel) {
      channel.close();
    }
  };
};

