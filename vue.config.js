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
                target: 'http://127.0.0.1:8081',
                changeOrigin: false
            },
            '/prodapi': {
                target: 'https://reference.dn.divinitor.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/prodapi': '/api'
                }
            }
        }
    }
};
