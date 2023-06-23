import { sendToUrl } from '@utils/sendToUrl'

export const addEventListenersToLinks = () => {
    const links = [...document.querySelectorAll('a')]
    links.forEach((link) => {
        link.removeEventListener('click', goToUrl)
        link.addEventListener('click', goToUrl)
    })
}

const goToUrl = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const url = target.innerText
    sendToUrl(e, url)
}
