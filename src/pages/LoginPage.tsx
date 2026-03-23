import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { isValidEmailOrUsername, toApiUsername } from '../lib/validation';
import { IconUser, IconLock, IconEye, IconEyeOff } from '../components/icons/Icons';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const initialized = useAuthStore((s) => s.initialized);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!initialized) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>Загрузка…</div>
      </div>
    );
  }

  function validate(): boolean {
    let ok = true;
    setLoginError(null);
    setPasswordError(null);
    setFormError(null);

    if (!login.trim()) {
      setLoginError('Обязательное поле');
      ok = false;
    } else if (!isValidEmailOrUsername(login)) {
      setLoginError('Введите корректную почту или логин');
      ok = false;
    }

    if (!password) {
      setPasswordError('Обязательное поле');
      ok = false;
    }

    return ok;
  }

  if (initialized && accessToken) {
    return <Navigate to="/products" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const username = toApiUsername(login);
      const res = await loginRequest(username, password);
      setSession(res.accessToken, remember);
      navigate('/products', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка входа';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img
            src={`${import.meta.env.BASE_URL}login-logo.png`}
            alt=""
            width={68}
            height={74}
            className={styles.loginLogoImg}
            decoding="async"
          />
        </div>
        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {formError ? (
            <div className={styles.bannerError} role="alert">
              {formError}
            </div>
          ) : null}

          <label className={styles.label}>
            Логин
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <IconUser />
              </span>
              <input
                className={styles.input}
                type="text"
                autoComplete="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="test"
                aria-invalid={!!loginError}
                aria-describedby={loginError ? 'login-error' : undefined}
              />
              {login ? (
                <button
                  type="button"
                  className={styles.clear}
                  onClick={() => setLogin('')}
                  aria-label="Очистить"
                >
                  ×
                </button>
              ) : null}
            </div>
            {loginError ? (
              <span id="login-error" className={styles.fieldError}>
                {loginError}
              </span>
            ) : null}
          </label>

          <label className={styles.label}>
            Пароль
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <IconLock />
              </span>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'pass-error' : undefined}
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPass ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {passwordError ? (
              <span id="pass-error" className={styles.fieldError}>
                {passwordError}
              </span>
            ) : null}
          </label>

          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Запомнить данные</span>
          </label>

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>или</span>
        </div>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <span className={styles.fakeLink} tabIndex={0} role="link">
            Создать
          </span>
        </p>
      </div>
    </div>
  );
}
