export default () => ({
    app : {
        port: parseInt(process.env.PORT, 10) || 3000,
        version: '1.0.0'
    },
    swagger: {
        title: 'Your app swagger title goes here.',
        description: 'Your app swagger description goes here.',
        path: 'api-docs'
    },
    mongo_conn_str: process.env.MONGO_CONN_STR,
    jwt: {
        access: {
            secret: process.env.ACCESS_TOKEN_SECRET,
            exp: process.env.ACCESS_TOKEN_EXPIRATION
        },
        refresh: {
            secret: process.env.REFRESH_TOKEN_SECRET,
            exp: process.env.REFRESH_TOKEN_EXPIRATION
        }
    }
});