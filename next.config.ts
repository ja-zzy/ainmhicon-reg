import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development'
 
const cspHeader = `
    default-src 'self' https://accounts.google.com/gsi/;
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://accounts.google.com/gsi/client https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style;
    img-src 'self' blob: data: https://jxkruzcavimhseccupfu.supabase.co;
    font-src 'self';
    object-src 'none';
    connect-src 'self' https://jxkruzcavimhseccupfu.supabase.co;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    frame-src https://js.stripe.com/;
    worker-src blob:;
`

const nextConfig: NextConfig = {
  /* config options here */
  headers: async() => [
    {
      source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
    }
  ]

};

export default nextConfig;
