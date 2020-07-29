const { join } = require('path')
const express = require('express')

const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000

const app = express()

app.get([ '/health', '/healthz' ], (req, resp) => {
	resp.status(200).type('text/html').end('OK')
})

app.use(express.static(join(__dirname, 'public')))
app.use((req, resp) => {
	resp.status(404).type('text/html')
	resp.sendFile(join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
