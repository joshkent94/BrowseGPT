import { Button } from '@mui/material'
import { FC } from 'react'
import browser from 'webextension-polyfill'

const UrlPermissions: FC = () => {
    return (
        <div className="mt-6 flex flex-col items-center justify-center">
            <span className="max-w-[80%] text-center text-sm">
                In order to provide contextual help, BrowseGPT needs full access
                to your browser data, such as current site, location etc. Click
                the button below to grant access.
            </span>
            <Button
                onClick={() => {
                    browser.permissions.request({
                        origins: ['<all_urls>'],
                    })
                }}
                variant="outlined"
                color="success"
                className="mt-8 w-56 bg-success text-dark-blue hover:bg-success-dark"
                sx={{ textTransform: 'none' }}
            >
                Grant Access
            </Button>
        </div>
    )
}

export default UrlPermissions
