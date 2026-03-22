import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(pt-BR|en-US|es-ES|fr-FR|it-IT|de-DE)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
