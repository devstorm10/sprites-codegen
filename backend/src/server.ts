import dotenv from 'dotenv'
dotenv.config() // Load environment variables

import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
