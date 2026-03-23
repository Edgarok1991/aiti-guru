import styles from './LinearProgress.module.css';

export function LinearProgress({ indeterminate }: { indeterminate?: boolean }) {
  return (
    <div className={styles.track} aria-hidden={indeterminate}>
      <div className={indeterminate ? styles.barIndeterminate : styles.bar} />
    </div>
  );
}
