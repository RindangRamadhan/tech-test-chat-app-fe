export class WebSocketClient {
  private socket: WebSocket
  private listeners: ((data: string) => void)[] = []

  constructor(url: string) {
    this.socket = new WebSocket(url)

    this.socket.onmessage = async (event) => {
      const data = event.data instanceof Blob ? await event.data.text() : event.data
      this.listeners.forEach((listener) => listener(data))
    }

    this.socket.onopen = () => console.log('Connected to WebSocket Server')
    this.socket.onclose = () => console.log('Disconnected from WebSocket Server')
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message)
    }
  }

  onMessage(callback: (data: string) => void) {
    this.listeners.push(callback)
  }
}
