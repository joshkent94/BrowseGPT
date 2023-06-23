import CryptoJS from 'crypto-js'

export const decryptString = (encryptedStr: string, salt: string): string => {
    return CryptoJS.AES.decrypt(encryptedStr, salt).toString(CryptoJS.enc.Utf8)
}
