type SessionTimeoutCallbacks = {
  onWarning: () => void;
  onTimeout: () => void;
};

type SessionTimeoutConfig = {
  inactivityTimeoutMs: number;
  warningBeforeExpiryMs: number;
  checkIntervalMs: number;
};

type InitOptions = SessionTimeoutCallbacks & Partial<SessionTimeoutConfig>;

const DEFAULT_INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const DEFAULT_WARNING_BEFORE_EXPIRY_MS = 2 * 60 * 1000;
const DEFAULT_CHECK_INTERVAL_MS = 15 * 1000;

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousedown",
  "mousemove",
  "keydown",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];

const parseConfigNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return fallback;
};

const buildDefaultConfig = (): SessionTimeoutConfig => {
  const inactivityTimeoutMs = parseConfigNumber(
    import.meta.env.VITE_INACTIVITY_TIMEOUT_MS,
    DEFAULT_INACTIVITY_TIMEOUT_MS,
  );
  const warningBeforeExpiryMs = parseConfigNumber(
    import.meta.env.VITE_WARNING_BEFORE_EXPIRY_MS,
    DEFAULT_WARNING_BEFORE_EXPIRY_MS,
  );
  const checkIntervalMs = parseConfigNumber(
    import.meta.env.VITE_CHECK_INTERVAL_MS,
    DEFAULT_CHECK_INTERVAL_MS,
  );

  return {
    inactivityTimeoutMs,
    warningBeforeExpiryMs: Math.min(
      warningBeforeExpiryMs,
      Math.max(1000, inactivityTimeoutMs - 1000),
    ),
    checkIntervalMs: Math.max(10_000, checkIntervalMs),
  };
};

let primedActivityTimestamp: number | null = null;

export const primeSessionActivityTimestamp = () => {
  primedActivityTimestamp = Date.now();
};

class SessionTimeoutManager {
  private config: SessionTimeoutConfig = buildDefaultConfig();
  private onWarning: (() => void) | null = null;
  private onTimeout: (() => void) | null = null;
  private lastActivityTimestamp = Date.now();
  private warningRaised = false;
  private awaitingDecision = false;
  private isActive = false;
  private intervalId: number | null = null;

  private handleActivity = () => {
    if (!this.isActive || this.awaitingDecision) return;
    this.lastActivityTimestamp = Date.now();
    this.warningRaised = false;
  };

  private addActivityListeners() {
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, this.handleActivity, { passive: true });
    });
  }

  private removeActivityListeners() {
    ACTIVITY_EVENTS.forEach((event) => {
      window.removeEventListener(event, this.handleActivity);
    });
  }

  private tick() {
    if (!this.isActive) return;

    const remaining = this.getRemainingTimeMs();
    if (remaining <= 0) {
      this.isActive = false;
      this.onTimeout?.();
      return;
    }

    if (
      remaining <= this.config.warningBeforeExpiryMs &&
      !this.warningRaised &&
      !this.awaitingDecision
    ) {
      this.warningRaised = true;
      this.awaitingDecision = true;
      this.onWarning?.();
    }
  }

  init(options: InitOptions) {
    if (typeof window === "undefined") return;

    this.cleanup();

    this.config = {
      inactivityTimeoutMs: parseConfigNumber(
        options.inactivityTimeoutMs,
        buildDefaultConfig().inactivityTimeoutMs,
      ),
      warningBeforeExpiryMs: parseConfigNumber(
        options.warningBeforeExpiryMs,
        buildDefaultConfig().warningBeforeExpiryMs,
      ),
      checkIntervalMs: parseConfigNumber(
        options.checkIntervalMs,
        buildDefaultConfig().checkIntervalMs,
      ),
    };

    this.config.warningBeforeExpiryMs = Math.min(
      this.config.warningBeforeExpiryMs,
      Math.max(1000, this.config.inactivityTimeoutMs - 1000),
    );
    this.config.checkIntervalMs = Math.max(10_000, this.config.checkIntervalMs);

    this.onWarning = options.onWarning;
    this.onTimeout = options.onTimeout;
    this.lastActivityTimestamp = primedActivityTimestamp ?? Date.now();
    primedActivityTimestamp = null;
    this.warningRaised = false;
    this.awaitingDecision = false;
    this.isActive = true;

    this.addActivityListeners();
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, this.config.checkIntervalMs);
    this.tick();
  }

  extendSession() {
    if (!this.isActive) return;
    this.lastActivityTimestamp = Date.now();
    this.warningRaised = false;
    this.awaitingDecision = false;
  }

  getRemainingTimeMs() {
    const elapsed = Date.now() - this.lastActivityTimestamp;
    return Math.max(0, this.config.inactivityTimeoutMs - elapsed);
  }

  isSessionActive() {
    return this.isActive;
  }

  reset() {
    this.lastActivityTimestamp = Date.now();
    this.warningRaised = false;
    this.awaitingDecision = false;
    this.isActive = true;
  }

  cleanup() {
    if (typeof window === "undefined") return;

    this.removeActivityListeners();
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.warningRaised = false;
    this.awaitingDecision = false;
    this.isActive = false;
  }
}

export const sessionTimeoutManager = new SessionTimeoutManager();

export const SESSION_TIMEOUT_CONFIG = buildDefaultConfig();
