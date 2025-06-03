/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://lindaatkinsonart.com/',
    generateRobotsTxt: true,
    exclude: [
        '/admin',
        '/admin/**',
        '/api/**',
        '/thank-you',
        '/not-found',
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin/*',
                    '/api/*',
                    '/thank-you',
                    '/not-found',
                ],
            },
        ],
    },
};  