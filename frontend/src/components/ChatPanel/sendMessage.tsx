import config from '@/config'

async function sendMessage(message: string) {
  const url = `${config.chatAPI}/chat/123`

  // Define the payload
  const payload = {
    message: message,
  }

  try {
    // Make the POST request and await response
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Await and parse the JSON response
    const data = await response.json()

    // Extract message and role from the response
    const { message: responseMessage } = data

    // Log or handle the response data
    return responseMessage.content
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}

export default sendMessage
