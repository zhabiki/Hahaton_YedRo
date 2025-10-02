import type { SignalData } from './types'

import { MqttService } from './mqtt'
import { exit } from 'process'
import { getBeacons } from './beacons'

const mqttService = new MqttService(
    process.env.MQTT_ADDR || '',
    process.env.MQTT_TOPIC || '',
    {
        port: +(process.env.MQTT_PORT || -1),
        clientId: process.env.MQTT_CID || '',
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASS,
    },
)

mqttService.connect()

async function startPublishing() {
    const beacons = await getBeacons()

    setInterval(() => {
        const newSignals: SignalData[] = []
        // beacons.sort(() => Math.random() - 0.5)

        for (const beacon of beacons) {
            const newSignal: SignalData = {
                beacon: beacon.name,
                proximity: Math.random()
            }
            newSignals.push(newSignal)
        }

        console.log(newSignals)

        mqttService.publish(newSignals)
    }, 2000)
}

startPublishing()

process.on('SIGINT', () => { mqttService.disconnect(); exit(0) })
process.on('SIGTERM', () => { mqttService.disconnect(); exit(0) })
