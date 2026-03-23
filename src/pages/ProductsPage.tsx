import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, PAGE_SIZE } from '../api/products';
import { getPaginationRange } from '../lib/pagination';
import { useAuthStore } from '../store/authStore';
import { useSelectionStore } from '../store/selectionStore';
import { useSortStore } from '../store/sortStore';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { ProductSortField } from '../types';
import { ProductTable } from '../components/products/ProductTable';
import { AddProductModal } from '../components/products/AddProductModal';
import { LinearProgress } from '../components/ui/LinearProgress';
import { IconSearch } from '../components/icons/Icons';
import styles from './ProductsPage.module.css';

export function ProductsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const accessToken = useAuthStore((s) => s.accessToken);

  const sortBy = useSortStore((s) => s.sortBy);
  const order = useSortStore((s) => s.order);
  const toggleSort = useSortStore((s) => s.toggleSort);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const toggleRow = useSelectionStore((s) => s.toggle);
  const toggleAll = useSelectionStore((s) => s.toggleAll);
  const clearSelection = useSelectionStore((s) => s.clear);

  useEffect(() => {
    clearSelection();
  }, [page, debouncedSearch, sortBy, order, clearSelection]);

  const query = useQuery({
    queryKey: ['products', page, sortBy, order, debouncedSearch],
    queryFn: () =>
      fetchProducts({
        page,
        sortBy,
        order,
        search: debouncedSearch,
      }),
    enabled: !!accessToken,
  });

  const products = query.data?.products ?? [];
  const total = query.data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = getPaginationRange(page, pageCount);

  function onSort(field: ProductSortField) {
    toggleSort(field);
  }

  function onLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.layout}>
      <header className={styles.topBar}>
        <h1 className={styles.topTitle}>Товары</h1>
        <div className={styles.searchWrap}>
          <IconSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Найти"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Поиск товаров"
          />
        </div>
        <button type="button" className={styles.logoutBtn} onClick={onLogout}>
          Выйти
        </button>
      </header>

      <div className={styles.subBar}>
        <h2 className={styles.subTitle}>Все позиции</h2>
        <div className={styles.subActions}>
          <button
            type="button"
            className={styles.refreshBtn}
            title="Обновить"
            aria-label="Обновить таблицу"
            onClick={() => query.refetch()}
          >
            <img
              src={`${import.meta.env.BASE_URL}icons/icon-refresh.png`}
              alt=""
              width={42}
              height={42}
              className={styles.refreshBtnImg}
              decoding="async"
            />
          </button>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setAddOpen(true)}
            aria-label="Добавить"
          >
            <img
              src={`${import.meta.env.BASE_URL}icons/icon-add-toolbar.png`}
              alt=""
              width={147}
              height={42}
              className={styles.addBtnImg}
              decoding="async"
            />
          </button>
        </div>
      </div>

      <div className={styles.progressSlot}>
        {query.isFetching ? <LinearProgress indeterminate /> : null}
      </div>

      <main className={styles.main}>
        {query.isError ? (
          <div className={styles.errorBanner} role="alert">
            {query.error instanceof Error ? query.error.message : 'Ошибка загрузки'}
          </div>
        ) : null}

        <ProductTable
          products={products}
          sortBy={sortBy}
          order={order}
          onSort={onSort}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
        />

        <footer className={styles.footer}>
          <span className={styles.range}>
            Показано {from}-{to} из {total}
          </span>
          <nav className={styles.pager} aria-label="Страницы">
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Предыдущая страница"
            >
              ‹
            </button>
            {pageItems.map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`e-${idx}`} className={styles.ellipsis}>
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={item === page ? styles.pageActive : styles.pageBtn}
                  onClick={() => setPage(item)}
                  aria-current={item === page ? 'page' : undefined}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              aria-label="Следующая страница"
            >
              ›
            </button>
          </nav>
        </footer>
      </main>

      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
