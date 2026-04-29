const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

/**
 * バックエンド API のベース URL（末尾スラッシュなし）。
 * 本番・ステージングでは `API_BASE_URL` を必ず `.env` / ホストの環境変数で設定する。
 */
export function getApiBaseUrl(): string {
  const base = process.env.API_BASE_URL?.trim();
  const resolved = base && base.length > 0 ? base : DEFAULT_API_BASE_URL;
  return resolved.replace(/\/+$/, "");
}

//ベース URL とパスを結合する
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${p}`;
}
