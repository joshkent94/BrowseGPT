interface Position {
    latitude: number | null
    longitude: number | null
}

export const getUserLocation = async (): Promise<Position> => {
    let position: GeolocationPosition | null
    try {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 600000,
            })
        })
    } catch (error) {
        position = null
    }
    return {
        latitude: position?.coords.latitude || null,
        longitude: position?.coords.longitude || null,
    }
}
