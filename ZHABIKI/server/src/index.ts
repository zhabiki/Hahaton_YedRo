import type { SignalData } from './types'

import express from 'express'
import path from 'path'
import { exit } from 'process'
import dotenv from 'dotenv'

import { MqttService } from './mqtt'
import resultsRouter from './routes/resultsRoute'
import beaconsRouter from './routes/beaconsRoute'

dotenv.config() // .env положить в корень каталога server/

const app = express()

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

mqttService.onNewRes((data: SignalData[] | null) => {
    console.log('[m] Получено новое сообщение:', data, '!!!')
})

app.use(express.json())

app.use('/api/beacons', beaconsRouter)
app.use('/api/results', resultsRouter)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(process.env.PORT || 8088, () => {
    mqttService.connect()
    console.log(`[i] Веб-морда и API доступны на порту ${process.env.PORT || 8088}`)
})

process.on('SIGINT', () => { mqttService.disconnect(); exit(0) })
process.on('SIGTERM', () => { mqttService.disconnect(); exit(0) })
