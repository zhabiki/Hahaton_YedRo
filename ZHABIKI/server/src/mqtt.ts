import type MqttClient from 'mqtt'
import type IClientOptions from 'mqtt'
import type { SignalData } from './types'

import mqtt from 'mqtt'

export class MqttService {
    private client: MqttClient | null = null
    private latestRes: SignalData[] | null = null
    private onResCallback: ((data: SignalData[] | null) => void) = () => {}

    constructor(
        private brokerUrl: string,
        private topic: string,
        private options: IClientOptions,
    ) {}

    connect(): void {
        console.log(`[m] Подключение к брокеру "${this.brokerUrl}"...`)
        
        this.client = mqtt.connect(this.brokerUrl, this.options)

        this.client.on('connect', () => {
            this.subscribe()
        })

        this.client.on('message', (topic: any, message: any) => {
            const msgStr = message.toString()
            // console.log(`[m] Получено сообщение: ${msgStr}`)

            const res = JSON.parse(msgStr)
            this.latestRes = res
            this.onResCallback(this.latestRes)
        })

        this.client.on('error', (err: any) => {
            console.error('[m] Ошибка подключения:', err)
        })
    }

    private subscribe(): void {
        if (!this.client) return
        console.log(`[m] Подключение к топику "${this.topic}"...`)

        this.client.subscribe(this.topic, (err: any) => {
            if (err) console.error('[m] Не удалось подписаться на топик!')
            else console.log('[m] Соединение установлено.')
        })
    }

    publish(data: SignalData[]): void {
        if (!this.client) return

        this.client.publish(this.topic, JSON.stringify(data))
    }

    getLatestRes(): SignalData[] | null { return this.latestRes }

    onNewRes(callback: (data: SignalData[] | null) => void) { this.onResCallback = callback }

    disconnect(): void {
        if (this.client) {
            this.client.end()
            this.client = null

            console.log('[m] Соединение окончено.')
        }
    }
}
