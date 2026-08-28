"use client";

import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import styles from "./app-notice.module.css";

type Notice = {
  id: number;
  message: string;
};

let nextId = 1;
const listeners = new Set<(notice: Notice) => void>();

export function notifyNotice(message: string) {
  const text = message.trim();
  if (!text) return;
  const notice = { id: nextId, message: text };
  nextId += 1;
  listeners.forEach((listener) => listener(notice));
}

export function notifyError(message: string) {
  notifyNotice(message);
}

export function AppNoticeHost() {
  const [notice, setNotice] = useState<Notice | null>(null);
  useLingui();

  useEffect(() => {
    const listener = (next: Notice) => setNotice(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => {
      setNotice((current) => (current?.id === notice.id ? null : current));
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;

  return (
    <div className={styles.host} role="alert" aria-live="assertive">
      <p>{notice.message}</p>
      <button type="button" onClick={() => setNotice(null)} aria-label={t`Dismiss notification`}>
        <Trans>Close</Trans>
      </button>
    </div>
  );
}
