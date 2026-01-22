export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    domain: undefined,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  };

  console.log('Cookie options:', {
    ...options,
    environment: process.env.NODE_ENV,
    cookieDomain: process.env.COOKIE_DOMAIN,
  });

  return options;
};
