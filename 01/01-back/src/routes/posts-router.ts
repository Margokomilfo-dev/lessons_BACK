import {Request, Response, Router} from 'express'
import {isNumeric} from '../index'
import {bloggers, BloggerType} from './bloggers-router'

export const postsRouter = Router({})

export type PostType = {
    id: number, title: string,
    shortDescription: string,
    content: string,
    bloggerId: BloggerType['id'] }
export let posts: Array<PostType> = [
    {id: 1, title: 'title1', shortDescription: 'shortDescription1', content: 'content1', bloggerId: 1},
    {id: 2, title: 'title2', shortDescription: 'shortDescription2', content: 'content1', bloggerId: 1},
    {id: 3, title: 'title3', shortDescription: 'shortDescription3', content: 'content1', bloggerId: 2},
]

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(posts)
})
postsRouter.post('/', (req: Request, res: Response) => {
    const postsLength = posts.length

    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId
    let blogger = null
    if (!title || !shortDescription || !content || !bloggerId) {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'no res.body', field: 'title or shortDescription or content or bloggerId'}]
        })
        return
    }
    if (bloggerId) {
        blogger = bloggers.find(b => b.id === bloggerId)
        if (!blogger) {
            res.status(400).send({
                data: {},
                resultCode: 1,
                errorsMessages: [{message: 'no blogger with this id', field: '-'}]
            })
            return
        }
    }
    const newPost: PostType = {
        id: +(new Date()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: +req.body.bloggerId,
    }
    posts.push(newPost)
    if (postsLength < posts.length) {
        res.status(201).send(newPost)
        return
    } else {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'post is not created', field: '-'}]
        })
    }
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }

    const post = posts.find(p => p.id === id)
    if (post) {
        const blogger = bloggers.find(b => b.id === post.bloggerId)
        res.send({...post, bloggerName: blogger?.name})

    } else {
        res.send(404)

    }
})
postsRouter.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const bloggerId = +req.body.bloggerId

    if (!title || !shortDescription || !content || !bloggerId) {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'no res.body', field: 'title or shortDescription or content or bloggerId'}]
        })
        return
    }

    const blogger = bloggers.find(b => b.id === bloggerId)
    const post = posts.find(p => p.id === id)
    if (blogger && post) {
        posts = posts.map(p => {
            if (p.id === id) {
                return {...p, title, bloggerId, content, shortDescription}
            } else return p
        })
        res.sendStatus(204)
        return
    } else res.send(404)
})
postsRouter.delete('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }

    let newPosts = posts.filter(p => p.id !== id)
    if (newPosts.length < posts.length) {
        posts = newPosts
        res.send(204)
        return
    } else {
        res.send(404)
        return
    }
})