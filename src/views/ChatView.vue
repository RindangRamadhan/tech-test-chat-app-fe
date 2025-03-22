<template>
  <div class="chat-container">
    <div class="dark-overlay"></div>
    <div class="chat-header">General</div>
    <div class="messages" ref="chatContainer">
      <transition-group name="fade-slide">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-wrapper', msg.sender === username ? 'sent' : 'received']"
        >
          <img :src="getRandomAvatar(msg.sender)" alt="Avatar" class="avatar" />
          <div class="message">
            <p class="sender-msg">{{ msg.text }}</p>
            <div class="arrow"></div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="chat-input">
      <input v-model="inputMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, nextTick } from 'vue'
import { WebSocketClient } from '@/websocket'

export default {
  data() {
    return {
      messages: [] as { text: string; sender: string }[],
      inputMessage: '',
      username: localStorage.getItem('username') || 'User' + Math.floor(Math.random() * 1000),
      chatContainer: null as HTMLElement | null,
      wsClient: new WebSocketClient(import.meta.env.VITE_WEBSOCKET_URL),
    }
  },
  mounted() {
    this.wsClient.onMessage((data) => {
      const msg = JSON.parse(data)
      this.messages.push(msg)
      this.scrollToBottom()
    })
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim() !== '') {
        const message = { text: this.inputMessage, sender: this.username }
        this.wsClient.sendMessage(JSON.stringify(message))
        this.inputMessage = ''
        this.scrollToBottom()
      }
    },
    scrollToBottom() {
      nextTick(() => {
        if (this.chatContainer) {
          this.chatContainer.scrollTop = this.chatContainer.scrollHeight
        }
      })
    },
    getRandomAvatar(sender: string) {
      return `https://api.dicebear.com/8.x/adventurer/svg?seed=${sender.replace(/\s+/g, '')}`
    },
  },
}
</script>
