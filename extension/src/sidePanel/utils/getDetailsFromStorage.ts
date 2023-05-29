export const getDetailsFromStorage = async () => {
    const { firstName, lastName, userAPIKey } = await chrome.storage.sync.get()
    return {
        firstName,
        lastName,
        userAPIKey,
    }
}
