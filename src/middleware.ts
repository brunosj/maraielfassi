import type { MiddlewareHandler } from 'astro';
import { timingSafeEqual } from 'node:crypto';

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header?.startsWith('Basic ')) return null;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const i = decoded.indexOf(':');
    if (i === -1) return null;
    return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
  } catch {
    return null;
  }
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;
  if (!pathname.startsWith('/keystatic')) {
    return next();
  }

  const expectedUser = process.env.KEYSTATIC_BASIC_AUTH_USER ?? 'editor';
  const expectedPass = process.env.KEYSTATIC_BASIC_AUTH_PASSWORD;

  if (!expectedPass?.length) {
    if (process.env.NODE_ENV === 'production') {
      return new Response(
        'Keystatic admin is unavailable: set KEYSTATIC_BASIC_AUTH_PASSWORD on the server (e.g. in .env).',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      );
    }
    return next();
  }

  const creds = parseBasicAuth(context.request.headers.get('authorization'));
  if (
    creds &&
    safeEqualStrings(creds.user, expectedUser) &&
    safeEqualStrings(creds.pass, expectedPass)
  ) {
    return next();
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Keystatic admin"',
      'Cache-Control': 'no-store',
    },
  });
};
