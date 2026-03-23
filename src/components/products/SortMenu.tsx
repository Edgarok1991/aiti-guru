import { useEffect, useRef, useState } from 'react';
import type { ProductSortField } from '../../types';
import type { SortOrder } from '../../types';
import { IconFilter } from '../icons/Icons';
import styles from './SortMenu.module.css';

const FIELDS: { value: ProductSortField; label: string }[] = [
  { value: 'title', label: 'Наименование' },
  { value: 'brand', label: 'Вендор' },
  { value: 'sku', label: 'Артикул' },
  { value: 'rating', label: 'Оценка' },
  { value: 'price', label: 'Цена' },
  { value: 'stock', label: 'Количество' },
];

export function SortMenu({
  sortBy,
  order,
  onChangeSort,
  onChangeOrder,
}: {
  sortBy: ProductSortField;
  order: SortOrder;
  onChangeSort: (f: ProductSortField) => void;
  onChangeOrder: (o: SortOrder) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        title="Сортировка"
      >
        <IconFilter />
      </button>
      {open ? (
        <div className={styles.popover} role="dialog" aria-label="Сортировка">
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Поле</div>
            <div className={styles.radios}>
              {FIELDS.map((f) => (
                <label key={f.value} className={styles.radioRow}>
                  <input
                    type="radio"
                    name="sort-field"
                    checked={sortBy === f.value}
                    onChange={() => onChangeSort(f.value)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Порядок</div>
            <label className={styles.radioRow}>
              <input
                type="radio"
                name="sort-order"
                checked={order === 'asc'}
                onChange={() => onChangeOrder('asc')}
              />
              По возрастанию
            </label>
            <label className={styles.radioRow}>
              <input
                type="radio"
                name="sort-order"
                checked={order === 'desc'}
                onChange={() => onChangeOrder('desc')}
              />
              По убыванию
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
