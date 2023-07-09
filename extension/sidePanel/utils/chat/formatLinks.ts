import { stripHTMLTags } from './sanitiseString'

export const formatLinks = (section: Message): Message => {
    const links = section.content?.match(/<a[^>]*>([^<]+)<\/a>/g)
    const urlsInLinks = links?.map((link: string) => stripHTMLTags(link))
    const allUrls = section.content
        ?.match(/\bhttps?:\/\/\S+/gi)
        ?.map((url: string) => stripHTMLTags(url))
    const urlsNotInLinks = allUrls?.filter((url: string) => {
        return !urlsInLinks?.includes(url)
    })
    urlsNotInLinks?.forEach((url: string) => {
        section.content = section.content?.replaceAll(
            url,
            `<a class="underline cursor-pointer">${url}</a>`
        )
    })
    return section
}
