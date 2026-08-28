"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

import styles from "./waitlist-button.module.css";

type ActionLock = {
  locked: boolean;
  acquire: () => void;
  release: () => void;
};

const ActionLockContext = createContext<ActionLock | null>(null);

export function WaitlistActionScope({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(0);
  const value = useMemo<ActionLock>(() => ({
    locked: pending > 0,
    acquire: () => setPending((count) => count + 1),
    release: () => setPending((count) => Math.max(0, count - 1)),
  }), [pending]);

  return <ActionLockContext.Provider value={value}>{children}</ActionLockContext.Provider>;
}

type ActionState = { loading: boolean };

export type WaitlistButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  onAction?: () => void | Promise<void>;
  lock?: boolean;
  children?: ReactNode | ((state: ActionState) => ReactNode);
};

export function WaitlistButton({
  onAction,
  onClick,
  lock = true,
  children,
  disabled,
  type = "button",
  className,
  style,
  ...rest
}: WaitlistButtonProps) {
  const [loading, setLoading] = useState(false);
  const [minWidth, setMinWidth] = useState<number>();
  const [busyName, setBusyName] = useState("");
  const loadingRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scope = useContext(ActionLockContext);

  const execute = useCallback(async () => {
    if (disabled || loadingRef.current) return;
    if (lock && scope?.locked) return;
    if (!onAction) return;

    const node = buttonRef.current;
    const width = node?.getBoundingClientRect().width;
    const name = node?.innerText?.trim();
    if (width) setMinWidth(width);
    if (name) setBusyName(name);
    loadingRef.current = true;
    setLoading(true);
    if (lock) scope?.acquire();
    try {
      await Promise.resolve(onAction());
    } catch {
      // Visible errors stay in the action; this catch only ends loading.
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setMinWidth(undefined);
      setBusyName("");
      if (lock) scope?.release();
    }
  }, [disabled, lock, onAction, scope]);

  const executeRef = useRef(execute);
  executeRef.current = execute;

  useEffect(() => {
    if (type !== "submit" || !onAction) return;
    const form = buttonRef.current?.form;
    if (!form) return;
    const onSubmit = (event: Event) => {
      event.preventDefault();
      void executeRef.current();
    };
    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, [onAction, type]);

  const content = typeof children === "function" ? children({ loading }) : children;
  const mergedStyle: CSSProperties | undefined = minWidth
    ? { ...style, minWidth }
    : style;

  return (
    <button
      {...rest}
      ref={buttonRef}
      type={type}
      className={[styles.host, className].filter(Boolean).join(" ")}
      style={mergedStyle}
      disabled={disabled || loading || Boolean(onAction && lock && scope?.locked)}
      aria-busy={loading || undefined}
      aria-label={loading && busyName ? busyName : rest["aria-label"]}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (type === "submit") {
          event.preventDefault();
          void execute();
          return;
        }
        if (onAction) void execute();
      }}
    >
      {loading ? (
        <output className={styles.icon} aria-hidden="true">
          <i className={styles.spinner} />
        </output>
      ) : (
        content
      )}
    </button>
  );
}
