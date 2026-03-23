import { useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';
import styles from './Toast.module.css';

export function Toast() {
  const message = useToastStore((s) => s.message);
  const hide = useToastStore((s) => s.hide);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => hide(), 3200);
    return () => window.clearTimeout(t);
  }, [message, hide]);

  if (!message) return null;

  return (
    <div className={styles.root} role="status">
      {message}
    </div>
  );
}
