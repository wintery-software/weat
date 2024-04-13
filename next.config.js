// @ts-check

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./lib/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wintery-software-weat.s3.amazonaws.com',
        pathname: '/**/*',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/*',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = withNextIntl(nextConfig);
