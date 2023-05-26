import express from 'express'
import { aiConversation } from 'src/routes/aiConversation'

const app = express()
const port = 3000

app.get('/api/conversation', aiConversation)

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})
