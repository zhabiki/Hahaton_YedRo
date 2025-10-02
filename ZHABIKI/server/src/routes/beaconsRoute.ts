import { Router } from 'express'
import { getBeacons } from '../beacons'

const router = Router()

router.get('/', async (req, res) => {
    const beacons = await getBeacons()

    res.json(beacons)
})

export default router
