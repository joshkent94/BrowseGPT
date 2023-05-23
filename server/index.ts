import express from 'express'

const app = express()
const port = 3000

const { aiConversation } = require('./routes/aiConversation')

app.get('/api/conversation', aiConversation)

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})
