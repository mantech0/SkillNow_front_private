'use client';
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { useState } = require('react')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 8080
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const [isEditing, setIsEditing] = useState(false);
const [editedUser, setEditedUser] = useState(user);

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})

async function updateUser(userData: User) {
  // APIエンドポイントへのPUTリクエスト
}
