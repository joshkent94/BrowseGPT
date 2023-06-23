import CryptoJS from 'crypto-js'

export const encryptString = (str: string): [string, string] => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8)
    const encrypted = CryptoJS.AES.encrypt(str, salt.toString())

    return [encrypted.toString(), salt.toString()]
}
