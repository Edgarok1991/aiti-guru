import { type FormEvent, useState } from 'react';
import { useToastStore } from '../../store/toastStore';
import type { AddProductFormValues } from '../../types';
import styles from './AddProductModal.module.css';

const initial: AddProductFormValues = {
  title: '',
  price: '',
  brand: '',
  sku: '',
};

export function AddProductModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const showToast = useToastStore((s) => s.show);
  const [values, setValues] = useState<AddProductFormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof AddProductFormValues, string>>>({});

  if (!open) return null;

  function validate(): boolean {
    const next: Partial<Record<keyof AddProductFormValues, string>> = {};
    if (!values.title.trim()) next.title = 'Обязательное поле';
    if (!values.price.trim()) next.price = 'Обязательное поле';
    else if (Number.isNaN(Number(values.price.replace(',', '.')))) {
      next.price = 'Введите число';
    }
    if (!values.brand.trim()) next.brand = 'Обязательное поле';
    if (!values.sku.trim()) next.sku = 'Обязательное поле';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    showToast('Товар добавлен (демо, без сохранения на сервере)');
    setValues(initial);
    setErrors({});
    onClose();
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <h2 id="add-product-title" className={styles.title}>
            Новый товар
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            Наименование
            <input
              className={styles.input}
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            />
            {errors.title ? <span className={styles.err}>{errors.title}</span> : null}
          </label>
          <label className={styles.field}>
            Цена, ₽
            <input
              className={styles.input}
              inputMode="decimal"
              value={values.price}
              onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            />
            {errors.price ? <span className={styles.err}>{errors.price}</span> : null}
          </label>
          <label className={styles.field}>
            Вендор
            <input
              className={styles.input}
              value={values.brand}
              onChange={(e) => setValues((v) => ({ ...v, brand: e.target.value }))}
            />
            {errors.brand ? <span className={styles.err}>{errors.brand}</span> : null}
          </label>
          <label className={styles.field}>
            Артикул
            <input
              className={styles.input}
              value={values.sku}
              onChange={(e) => setValues((v) => ({ ...v, sku: e.target.value }))}
            />
            {errors.sku ? <span className={styles.err}>{errors.sku}</span> : null}
          </label>
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.primary}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
