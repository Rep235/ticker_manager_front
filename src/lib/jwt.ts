export type JwtPayload = {
  sub?: string;
  id?: string;
  userId?: string;
  [key: string]: unknown;
};

const decodeBase64Url = (str: string) => {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return atob(padded);
  } catch {
    return '';
  }
};

export const parseJwt = (token: string | null): JwtPayload | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const stored = localStorage.getItem('userId');
  if (stored && isUuid(stored)) return stored;

  const token = localStorage.getItem('authToken');
  const payload = parseJwt(token);
  if (!payload) return null;
  const candidate =
    (payload.userId as string) || (payload.id as string) || (payload.sub as string) || null;
  if (candidate && isUuid(candidate)) return candidate;
  return null;
};

export const isUuid = (value: string): boolean => {
  // Accept common UUID formats (v1-v5)
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    value
  );
};
