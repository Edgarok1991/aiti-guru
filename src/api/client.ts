export const API_BASE = 'https://dummyjson.com';

export async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error('Пустой ответ сервера');
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Некорректный ответ сервера');
  }
}
