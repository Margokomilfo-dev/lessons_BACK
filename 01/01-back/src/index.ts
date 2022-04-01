import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
//create express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


const port = 5005

let videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
]

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello: World!!!!')

})

app.get('/videos', (req: Request, res: Response ) => {
    res.send(videos) //res.json = res.send
})

app.get('/videos/:id', (req: Request, res: Response ) => {
    const id = +req.params.id
    const video = videos.find(v=> v.id === id)
    if(video) { //(!!video)
        res.send(video)//res.json = res.send
    }
    else res.send(404)
})

app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.put('/videos/update/video/:id', (req: Request, res: Response ) => {
    const id = +req.params.id

    //реализация Димыча
    // const video = videos.find(v=> v.id === id)
    // if(video){
    //     video.title = req.body.title
    //     res.send(videos)
    // }else res.send(videos)

    videos = videos.map(v => {
        if (v.id === id) {
            return {...v, title: req.body.title}
        }else return v
    })
    res.send(videos)
})

app.delete('/videos/:id', (req: Request, res: Response ) => {
    const id = +req.params.id
    let newVideos = videos.filter(v => v.id !== id)
    if (newVideos.length< videos.length){
        videos = newVideos
        res.send(204)
    }else  res.send(404)

})



//start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
