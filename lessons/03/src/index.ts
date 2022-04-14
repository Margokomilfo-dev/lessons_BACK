import express, {Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser'
import {runDb} from './repositories/db'
import {productsRouter} from './routes/products-router'

// create express app
const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 5000

app.use('/products', productsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()
