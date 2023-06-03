export const stripHTMLTags = (strToSanitize: string) => {
    const myHTML = new DOMParser().parseFromString(strToSanitize, 'text/html')
    return myHTML.body.textContent || ''
}
