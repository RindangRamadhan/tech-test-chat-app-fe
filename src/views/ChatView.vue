<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { WebSocketClient } from '@/websocket'

const messages = ref<{ text: string; sender: string }[]>([])
const inputMessage = ref('')
const username = ref(localStorage.getItem('username') || 'User' + Math.floor(Math.random() * 1000))
const chatContainer = ref<HTMLElement | null>(null)
const wsClient = new WebSocketClient('ws://localhost:3000')

onMounted(() => {
  wsClient.onMessage((data) => {
    const msg = JSON.parse(data)
    messages.value.push(msg)
    scrollToBottom()
  })
})

const sendMessage = () => {
  if (inputMessage.value.trim() !== '') {
    const message = { text: inputMessage.value, sender: username.value }
    wsClient.sendMessage(JSON.stringify(message))
    inputMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const getRandomAvatar = (sender: string) => {
  return `https://api.dicebear.com/8.x/adventurer/svg?seed=${sender.replace(/\s+/g, '')}`
}
</script>

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
