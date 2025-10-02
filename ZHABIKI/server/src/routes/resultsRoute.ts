import { Router } from 'express'
import { PositionData } from '../types'

const router = Router()

const pos: PositionData[] = [
    { timestamp: new Date, x: 1, y: 1 },
    { timestamp: new Date, x: 2, y: 2 },
    { timestamp: new Date, x: 3, y: 3 },
    { timestamp: new Date, x: 4, y: 4 },
    { timestamp: new Date, x: 5, y: 5 },
]

router.get('/all', (req, res) => {
    res.json(pos)
})

router.get('/latest', (req, res) => {
    res.json(pos[pos.length - 1])
})

export default router
