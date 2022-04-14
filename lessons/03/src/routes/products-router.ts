import {Request, Response, Router} from 'express'
import {ProductType} from '../repositories/products-db-repository'
import {productsService} from '../domain/product-service'

export const productsRouter = Router({})

productsRouter.post('/',
    async (req: Request, res: Response) => {
        const newProduct:ProductType = await productsService.createProduct(req.body.title)
        res.status(201).send(newProduct)
    })

productsRouter.put('/:id',
    async (req: Request, res: Response) => {
        const isUpdated = await productsService.updateProduct(+req.params.id, req.body.title)
        if (isUpdated) {
            const product = await productsService.findProductById(+req.params.id)
            res.send(product)
        } else {
            res.send(404)
        }
    })

productsRouter.get('/', async (req: Request, res: Response) => {
    const foundProducts = await productsService.findProducts(req.query.title?.toString())
    res.send(foundProducts)
})
productsRouter.get('/:id', async (req: Request, res: Response) => {
    let product = await productsService.findProductById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})

productsRouter.delete('/:id', async(req: Request, res: Response) => {
    const isDeleted = await productsService.deleteProduct(+req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})
