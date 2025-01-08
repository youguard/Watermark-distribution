<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Messages</h3>

        <div class="space-y-4">
            <div class="h-[200px] overflow-y-auto space-y-4">
                <!-- Display 'No messages' message if the list is empty -->
                <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
                    No messages yet
                </div>

                <!-- Loop through messages -->
                <div v-for="message in messages" :key="message._id" :class="`p-3 rounded-lg text-sm ${message.senderType === 'User' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-900'
                    } flex flex-col space-y-2`">
                    <!-- Header for sender and time -->
                    <div class="flex justify-between items-start mb-1">
                        <!-- Sender name -->
                        <span class="font-medium">

                            {{ message.senderType === 'User' ? 'You' : 'Admin' }}
                        </span>

                        <!-- Message time -->
                        <span class="text-xs text-gray-500">
                            {{ formatDate(message.createdAt) }}
                        </span>
                    </div>

                    <!-- Message content -->
                    <div>{{ message.content }}</div>
                </div>

            </div>


            <!-- Message Input -->
            <div class="flex items-center space-x-2">
                <input v-model="newMessage" type="text" placeholder="Type your message..."
                    class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @keyup.enter="sendMessage">
                <button @click="sendMessage"
                    class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="m3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const newMessage = ref('');
const messages = ref([]);


const fetchMessages = async (id) => {
    try {
        console.log("UserIDD", id)
        const data = await axios.get(
            `https://watermark-distribution.onrender.com/api/messages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use token for protected endpoint
                },
            }
        );
        messages.value = data.data.messages;
        console.log("User chatss", messages.value || []);

    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const getSenderName = (message) => {
    // Customize sender display logic based on senderType
    return message.sender._id === localStorage.getItem("userId")
        ? "You"
        : `User ${message.sender._id}`;
}

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    const messageContent = newMessage.value;
    newMessage.value = ''; // Clear the input field immediately

    console.log("Userdet", userDetails.value)

    try {
        // Retrieve the token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token not found. Please log in again.');
            return;
        }

        // Make the API request with the token in the headers
        await axios.post(
            `https://watermark-distribution.onrender.com/api/messages/${userDetails.value}`,
            { content: messageContent },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Fetch the latest messages after sending
        await fetchMessages(userDetails.value);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const userDetails = ref({})


const fetchUserDetails = async () => {
    try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get('https://watermark-distribution.onrender.com/api/user/details',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        userDetails.value = response.data.userDetails.ID;
        const id = response.data.userDetails.ID
        await fetchMessages(id)
        console.log("User details", id);

    } catch (err) {
        console.error(err);

    }
}

// Fetch messages on mount
// onMounted(fetchMessages);
onMounted(fetchUserDetails)

</script>

<style></style>