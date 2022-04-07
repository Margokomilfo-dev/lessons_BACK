import {Request, Response, Router} from 'express'
import {isNumeric} from '../index'

export const bloggersRouter = Router({})
export type BloggerType = { id: number, name: string, youtubeUrl: string }
export let bloggers = [
    {id: 1, name: 'blogger1', youtubeUrl: 'youtube1.com'},
    {id: 2, name: 'blogger2', youtubeUrl: 'youtube2.com'},
    {id: 3, name: 'blogger3', youtubeUrl: 'youtube3.com'}
]

bloggersRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
})
bloggersRouter.post('/', (req: Request, res: Response) => {
    const bloggerLength = bloggers.length
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl

    if (!name || !youtubeUrl) {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'no res.body', field: 'name or youtubeUrl'}]
        })
        return
    }
    if (youtubeUrl) {
        const regex = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
        const result = regex.test(youtubeUrl)
        if (!result) {
            res.status(400).send({
                data: {},
                resultCode: 1,
                errorsMessages: [
                    {
                        message: 'The field YoutubeUrl must match the regular expression \'^https://([a-zA-Z0-9_-]+\\\\.)+[a-zA-Z0-9_-]+(\\\\/[a-zA-Z0-9_-]+)*\\\\/?$\'.',
                        field: 'youtubeUrl'
                    }
                ]
            })
            return
        }
    }

    const newBlogger: BloggerType = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl,
    }
    bloggers.push(newBlogger)
    if (bloggerLength < bloggers.length) {
        res.status(201).send(newBlogger)
    } else {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'blogger is not created', field: '-'}]
        })
    }
})
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }

    const blogger = bloggers.find(b => b.id === id)
    if (blogger) { //(!!video)
        res.send(blogger)//res.json = res.send
    } else {
        res.send(404)
    }

})
bloggersRouter.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    if (!name || !youtubeUrl) {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'no res.body', field: 'name or youtubeUrl'}]
        })
        return
    }
    if (youtubeUrl) {
        const regex = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
        const result = regex.test(youtubeUrl)
        if (!result) {
            res.status(400).send({
                data: {},
                resultCode: 1,
                errorsMessages: [
                    {
                        message: 'The field YoutubeUrl must match the regular expression \'^https://([a-zA-Z0-9_-]+\\\\.)+[a-zA-Z0-9_-]+(\\\\/[a-zA-Z0-9_-]+)*\\\\/?$\'.',
                        field: 'youtubeUrl'
                    }
                ]
            })
            return
        }
    }
    const blogger = bloggers.find(b => b.id === id)
    if (blogger) {
        bloggers = bloggers.map(b => {
            if (b.id === id) {
                return {...b, name: req.body.name, youtubeUrl: req.body.youtubeUrl}
            } else return b
        })
        res.sendStatus(204)
    } else res.send(404)
})
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }
    if (id) {
        let newBloggers = bloggers.filter(b => b.id !== id)
        if (newBloggers.length < bloggers.length) {
            bloggers = newBloggers
            res.send(204)
        }
    } else res.send(404)
})