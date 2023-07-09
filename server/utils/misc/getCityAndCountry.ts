import axios from 'axios'
import 'dotenv/config'

export const getCityAndCountry = async (
    latitude: number,
    longitude: number
) => {
    const response = await axios.get(
        `https://eu1.locationiq.com/v1/reverse?key=${process.env.LOCATION_IQ_TOKEN}&lat=${latitude}&lon=${longitude}&format=json&normalizeaddress=1`
    )
    const { city, country } = response.data.address

    if (!city || !country) return 'an unknown location'

    return `${city}, ${country}`
}
