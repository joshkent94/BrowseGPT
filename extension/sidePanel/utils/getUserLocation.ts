export const getUserLocation = async () => {
    let position: GeolocationPosition | null
    try {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
    } catch (error) {
        position = null
    }
    return {
        latitude: position?.coords.latitude || null,
        longitude: position?.coords.longitude || null,
    }
}
