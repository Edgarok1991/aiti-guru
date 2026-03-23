import type { DummyProduct } from '../../types';
import type { ProductSortField } from '../../types';
import type { SortOrder } from '../../types';
import { formatRating, splitRubParts } from '../../lib/format';
import styles from './ProductTable.module.css';

const LOW_RATING = 3.5;

const ICON_ROW_ADD = `${import.meta.env.BASE_URL}icons/icon-row-add.png`;
const ICON_MORE = `${import.meta.env.BASE_URL}icons/icon-more.png`;

const COLUMN_ORDER: ProductSortField[] = [
  'title',
  'brand',
  'sku',
  'rating',
  'price',
];

const SORT_LABELS: Record<ProductSortField, string> = {
  title: 'Наименование',
  brand: 'Вендор',
  sku: 'Артикул',
  rating: 'Оценка',
  price: 'Цена, ₽',
  stock: 'Количество',
};

function PriceRub({ value }: { value: number }) {
  const { int, frac } = splitRubParts(value);
  return (
    <span className={styles.priceCell}>
      <span className={styles.priceInt}>{int}</span>
      <span className={styles.priceComma}>,</span>
      <span className={styles.priceFrac}>{frac}</span>
    </span>
  );
}

function SortArrow({
  active,
  order,
}: {
  active: boolean;
  order: SortOrder;
}) {
  if (!active) return <span className={styles.sortMuted}>↕</span>;
  return <span className={styles.sortActive}>{order === 'asc' ? '↑' : '↓'}</span>;
}

export function ProductTable({
  products,
  sortBy,
  order,
  onSort,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: {
  products: DummyProduct[];
  sortBy: ProductSortField;
  order: SortOrder;
  onSort: (field: ProductSortField) => void;
  selectedIds: Set<number>;
  onToggleRow: (id: number) => void;
  onToggleAll: (ids: number[], checked: boolean) => void;
}) {
  const ids = products.map((p) => p.id);
  const allSelected = ids.length > 0 && ids.every((id) => selectedIds.has(id));
  const someSelected = ids.some((id) => selectedIds.has(id));

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thCheck}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={(e) => onToggleAll(ids, e.target.checked)}
                aria-label="Выбрать все на странице"
              />
            </th>
            {COLUMN_ORDER.map((field) => (
              <th key={field} className={styles.thSortable}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => onSort(field)}
                >
                  {SORT_LABELS[field]}
                  <SortArrow active={sortBy === field} order={order} />
                </button>
              </th>
            ))}
            <th className={styles.thActions} />
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => {
            const selected = selectedIds.has(p.id);
            const low = p.rating < LOW_RATING;
            return (
              <tr
                key={p.id}
                className={[
                  !selected && (idx % 2 === 0 ? styles.rowEven : styles.rowOdd),
                  selected ? styles.rowSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <td className={styles.tdCheck}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleRow(p.id)}
                    aria-label={`Выбрать ${p.title}`}
                  />
                </td>
                <td>
                  <div className={styles.nameCell}>
                    <img
                      className={styles.thumb}
                      src={p.thumbnail}
                      alt=""
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className={styles.nameTitle}>{p.title}</div>
                      <div className={styles.nameSub}>{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.tdStrong}>{p.brand}</td>
                <td className={styles.tdMono}>{p.sku}</td>
                <td className={low ? styles.tdRatingLow : styles.tdRating}>
                  {formatRating(p.rating)}
                </td>
                <td className={styles.tdPrice}>
                  <PriceRub value={p.price} />
                </td>
                <td className={styles.tdActions}>
                  <div className={styles.actionGroup}>
                    <button type="button" className={styles.actPrimary} aria-label="Добавить">
                      <img
                        src={ICON_ROW_ADD}
                        alt=""
                        width={52}
                        height={27}
                        className={styles.actPrimaryImg}
                        decoding="async"
                      />
                    </button>
                    <button type="button" className={styles.actGhost} aria-label="Ещё" disabled>
                      <img
                        src={ICON_MORE}
                        alt=""
                        width={32}
                        height={32}
                        className={styles.actGhostImg}
                        decoding="async"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
