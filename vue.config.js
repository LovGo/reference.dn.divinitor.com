const path = require('path');
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set('@components', path.join(__dirname, 'src/components'))
            .set('@api', path.join(__dirname, 'src/api'))
            .set('@models', path.join(__dirname, 'src/models'))
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'https://reference.dn.divinitor.com',
                changeOrigin: true
            },
            '/localapi': {
                target: 'http://127.0.0.1:8081',
                changeOrigin: false,
                pathRewrite: {
                    '^/localapi': '/api'
                }
            }
        }
    },
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'public/index.html',
        },
        embedShop: {
            entry: 'src/subpages/embedShop.ts',
            template: 'public/embed.html',
        },
    }
};
