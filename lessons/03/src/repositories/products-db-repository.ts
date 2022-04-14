import {bd} from './db'

export type ProductType = {
    id: number
    title: string
}

export const productsRepository = {
    async findProducts(title: string | null | undefined): Promise<ProductType[]> {
        let filter = {}
        if (title) {
            filter = {title: {$regex: title}} //any вхождение title в поле title
        }
        return bd.find(filter).toArray()
    },

    async findProductById(id: number): Promise<ProductType | null> {
        return bd.findOne({id})
    },

    async createProduct(newProduct: ProductType): Promise<ProductType> {
        await bd.insertOne(newProduct)
        return newProduct
    },

    async updateProduct(id: number, title: string): Promise<boolean> {
        let product = await bd.updateOne(
            {id},
            {$set: {title}},
            {upsert: true})
        return !!product
    },

    async deleteProduct(id: number): Promise<boolean> {
        const res = await bd.deleteOne({id})
        return !!res
    }
}
