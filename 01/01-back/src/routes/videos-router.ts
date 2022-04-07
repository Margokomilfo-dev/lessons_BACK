import {Request, Response, Router} from 'express'
import {isNumeric} from '../index'

export const videosRouter = Router({})
export let videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
]

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos) //res.json = res.send
})
videosRouter.post('/', (req: Request, res: Response) => {
    const videosLength = videos.length
    const title = req.body.title
    if (!title) {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'title is required', field: ''}]
        })
        return
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    if (videosLength > videos.length) {
        res.status(201).send(newVideo)
    } else {
        res.status(400).send({
            data: {},
            resultCode: 1,
            errorsMessages: [{message: 'no res.body', field: 'name or youtubeUrl'}]
        })
    }
})
videosRouter.get('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (id) {
        const video = videos.find(v => v.id === id)
        if (video) { //(!!video)
            res.send(video)//res.json = res.send
        } else res.send(404)
    } else {
        res.send(404)
    }
})
videosRouter.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const title = req.body.title
    if(!title){
        res.send(400)
        return
    }
    if (!id || !isNumeric(id)) {
        res.send(400)
        return
    }
    const video = videos.find(v => v.id === id)
    if (video) {
        //реализация Димыча
        // const video = videos.find(v=> v.id === id)
        // if(video){
        //     video.title = req.body.title
        //     res.send(videos)
        // }else res.send(videos)

        videos = videos.map(v => {
            if (v.id === id) {
                return {...v, title: req.body.title}
            } else return v
        })
        res.sendStatus(204)
    } else res.send(404)
})
videosRouter.delete('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (!id || !isNumeric(id)) {
        res.send(404)
        return
    }

    let newVideos = videos.filter(v => v.id !== id)
    if (newVideos.length < videos.length) {
        videos = newVideos
        res.send(204)
        return
    } else {
        res.send(404)
        return
    }
})