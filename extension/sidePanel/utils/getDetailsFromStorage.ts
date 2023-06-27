export const getDetailsFromStorage = async () => {
    const { firstName, lastName, encryptedAPIKey, salt, latitude, longitude } =
        await chrome.storage.sync.get()
    return {
        firstName,
        lastName,
        encryptedAPIKey,
        salt,
        userLocation: [latitude, longitude],
    }
}
