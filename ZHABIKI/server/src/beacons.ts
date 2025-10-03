import type { BeaconData } from './types'

import path from 'path'
import neatCsv from 'neat-csv'
import fs from 'fs/promises'

const BEACONS_FILENAME = 'beacons_kpa.beacons'

export async function getBeacons(): Promise<BeaconData[]> {
    // console.log(__dirname)
    const file = await fs.readFile(
        path.resolve(__dirname, `../../data/${BEACONS_FILENAME}`), 'utf-8'
    )
    const data = await neatCsv(file, {
        separator: ';',
        mapHeaders: ({ header, index }) => header.toLowerCase(),
        mapValues: ({ header, index, value }) => (header !== 'name') ? +value : value
    }) as BeaconData[]
    // console.log(data)

    return data
}
