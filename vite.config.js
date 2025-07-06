import {base} from './trak.config.js'

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
