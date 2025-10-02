export interface SignalData {
    beacon: BeaconData['name'],
    proximity: number,
}

export interface BeaconData {
    name: string,
    x: number,
    y: number,
}

export interface PositionData extends Omit<BeaconData, 'name'> {
    timestamp: Date,
}
