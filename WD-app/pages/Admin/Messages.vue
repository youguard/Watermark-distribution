<template>
    <NuxtLayout name="admindashboard">
        <div class="h-screen flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b">
                <h1 class="text-2xl font-bold">Messages</h1>
            </div>

            <div class="flex-1 flex overflow-hidden">
                <!-- Conversations List -->
                <div class="w-1/3 border-r overflow-y-auto">
                    <div class="p-4">
                        <input type="text" v-model="searchQuery" placeholder="Search users..."
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div class="space-y-2">
                        <div v-for="conversation in conversations" :key="conversation._id"
                            @click="selectUser(conversation.sender)" class="p-4 cursor-pointer hover:bg-gray-100"
                            :class="{ 'bg-gray-100': selectedUser?._id === conversation.sender._id }">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-semibold">{{ conversation.sender._id }}</h3>
                                    <p class="text-sm text-gray-600 truncate">{{ conversation.latestMessage }}</p>
                                </div>
                                <div class="flex flex-col items-end">
                                    <span class="text-xs text-gray-500">{{ formatDate(conversation.timestamp) }}</span>
                                    <span v-if="conversation.unread"
                                        class="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat Window -->
                <div class="flex-1 flex flex-col">
                    <template v-if="selectedUser">
                        <!-- Chat Header -->
                        <div class="p-4 border-b">
                            <h2 class="font-semibold">{{ selectedUser.name }}</h2>
                        </div>

                        <!-- Messages -->
                        <div class="flex-1 overflow-y-auto p-4 space-y-4">
                            <div v-for="message in messages" :key="message._id" class="flex"
                                :class="{ 'justify-end': message.senderType === 'Admin' }">
                                <div class="max-w-[70%] rounded-lg px-4 py-2" :class="{
                                    'bg-blue-500 text-white': message.senderType === 'Admin',
                                    'bg-gray-100': message.senderType === 'User'
                                }">
                                    <p>{{ message.content }}</p>
                                    <span class="text-xs opacity-75 block mt-1">{{ formatDate(message.createdAt)
                                        }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Message Input -->
                        <div class="p-4 border-t">
                            <form @submit.prevent="sendMessage" class="flex gap-2">
                                <input v-model="newMessage" type="text" placeholder="Type your message..."
                                    class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button type="submit"
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Send
                                </button>
                            </form>
                        </div>
                    </template>

                    <!-- No Selected User State -->
                    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to start messaging
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const selectedUser = ref(null);
const newMessage = ref('');
const searchQuery = ref('');
const conversations = ref([]);
const allMessages = ref([]);

// Fetch all messages and group by sender
const fetchMessages = async () => {
    try {
        const { data } = await axios.get(
            "https://watermark-distribution.onrender.com/api/messages",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );

        allMessages.value = data.messages;

        // Map to store sender IDs to usernames
        const userNameCache = {};

        // Group messages by sender._id and extract the latest message
        const groupedConversations = {};
        for (const message of allMessages.value) {
            const senderId = message.sender._id;

            // Check if username is already fetched or cached
            if (!userNameCache[senderId]) {
                const userName = await fetchUserName(senderId);
                userNameCache[senderId] = userName; // Cache the username
            }

            // Add username to the message object
            message.sender.name = userNameCache[senderId];

            // Group and pick the latest message
            if (!groupedConversations[senderId]) {
                groupedConversations[senderId] = message;
            } else {
                if (new Date(message.createdAt) > new Date(groupedConversations[senderId].createdAt)) {
                    groupedConversations[senderId] = message;
                }
            }
        }

        // Convert grouped conversations to an array
        conversations.value = Object.values(groupedConversations);
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

// Fetch username by ID
const fetchUserName = async (id) => {
    try {
        const { data } = await axios.get(`https://watermark-distribution.onrender.com/api/users/${id}`);
        return data.data; // Assuming the API returns `name` in the response
    } catch (error) {
        console.error(`Error fetching username for ID ${id}:`, error);
        return "Unknown User"; // Fallback username
    }
};

// Format date helper
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

// Select user handler
const selectUser = async (user) => {
    selectedUser.value = user;

    // Fetch messages for the selected user using /messages/{id} endpoint
    try {
        const { data } = await axios.get(
            `https://watermark-distribution.onrender.com/api/messages/${user._id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        allMessages.value = data.messages;
    } catch (error) {
        console.error("Error fetching user messages:", error);
    }
};

// Send message handler
const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedUser.value) return;

    try {
        // Placeholder for sending the message via API
        newMessage.value = ''; // Clear input
    } catch (error) {
        console.error("Failed to send message:", error);
    }
};

// Fetch messages on mount
onMounted(fetchMessages);
</script>
