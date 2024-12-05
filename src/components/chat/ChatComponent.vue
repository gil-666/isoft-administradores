<template>
    <div>
        <!-- Button to toggle chat visibility -->
        <button class="chat-toggle-btn" @click="toggleChat" v-if="!isChatOpen">
            Chat
        </button>

        <!-- Chat container that appears/disappears based on isChatOpen -->
        <div v-show="isChatOpen" class="chat-box">
            <h2 class="title">Chat</h2>
            <div class="messages-box">
                <div v-for="(message, index) in messages" :key="index">
                    <p>{{ message }}</p>
                </div>
            </div>

            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
            <button class="chat-toggle-btn" @click="toggleChat">Cerrar Chat</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newMessage: '',
            messages: [],
            socket: null,
            isChatOpen: false, // To track if chat is open or closed
        };
    },
    created() {
        // Connect to the WebSocket server
        this.socket = new WebSocket('ws://localhost:3000');

        // Listen for messages from the server
        // Check if the message is a Blob (binary data)
        this.socket.onmessage = (event) => {
    let data;

    try {
        // Parse the incoming JSON data
        data = JSON.parse(event.data);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return;
    }

    // Process the data based on its type
    if (data.type === 'history') {
        // Handle the chat history
        console.log("Chat history received:", data.messages);
        data.messages.forEach((message) => {
            // Add each historical message to the UI or messages array
            this.messages.push(message);
        });
    } else if (data.type === 'message') {
        // Handle a new incoming message
        console.log("New message received:", data.message);
        this.messages.push(data.message);
    } else {
        console.warn('Unknown data type received:', data.type);
    }
};




        // Handle WebSocket connection open
        this.socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        // Handle WebSocket connection close
        this.socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim()) {
                // Send the message to the WebSocket server
                this.socket.send(this.newMessage);
                // Clear the input field
                this.newMessage = '';
            }
        },
        toggleChat() {
            this.isChatOpen = !this.isChatOpen; // Toggle chat visibility
        },
    },
};
</script>

<style scoped>
/* Basic styles for chat box */
.chat-box {
    position: fixed;
    bottom: 70px;
    right: 20px;
    width: 300px;
    max-height: 400px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.messages-box {
    flex-grow: 1;
    height: 250px;
    overflow-y: auto;
    margin-bottom: 10px;
}

input {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.chat-toggle-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1001;
}

/* Add dark mode support */
@media (prefers-color-scheme: dark) {
    .title {
        color: white;
    }

    .messages-box {
        color: white;
    }

    .chat-box {
        background-color: hsla(0, 0%, 5%, 0.76);
    }

    .chat-toggle-btn {
        background-color: #1e90ff;
    }
}
</style>