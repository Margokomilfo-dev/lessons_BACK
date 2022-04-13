import {NextFunction, Request, Response} from 'express'
import {validationResult} from 'express-validator'

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction)=> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({resultCode: 1, messages: errors.array()})
    } else {
        next()
    }
}