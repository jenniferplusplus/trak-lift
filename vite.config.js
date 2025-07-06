export const base = '/trak-lift/';

export default {
    base: base,
    build: {
        rollupOptions: {
            input: {
                main: `${__dirname}/index.html`,
                notFound: `${__dirname}/404.html`,
            }
        }
    }
}
