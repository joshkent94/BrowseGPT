export const getDetailsFromStorage = async () => {
    const { firstName, lastName, encryptedAPIKey, salt } =
        await chrome.storage.sync.get()
    return {
        firstName,
        lastName,
        encryptedAPIKey,
        salt,
    }
}
