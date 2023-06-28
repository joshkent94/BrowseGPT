export const getDetailsFromStorage = async () => {
    const { firstName, lastName, latitude, longitude } =
        await chrome.storage.sync.get()
    return {
        firstName,
        lastName,
        userLocation: [latitude, longitude],
    }
}
