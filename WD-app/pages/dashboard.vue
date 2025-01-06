<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <nav class="bg-white/70 backdrop-blur-md border-b border-gray-100">
            <div class="max-w-5xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <Icon name="mdi:water" class="h-8 w-8 text-blue-500" />
                        <span class="text-xl font-medium uppercase font-bold"> <span class="text-blue-700">You</span>Guard</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button @click="logout" class="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                            <Icon name="mdi:logout" class="h-5 w-5" />
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5z" />
                                    <path fill="currentColor"
                                        d="m20.65 11.65l-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-5xl mx-auto px-4 py-8">
            <!-- Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Welcome back, {{ userDetails.Username }}</h2>
                        <p class="text-gray-500 mt-1">{{ userDetails.Region }}</p>
                    </div>
                    <div :class="`px-3 py-1 rounded-full text-sm font-medium ${userDetails.Approval === 'true'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`">
                        {{ userDetails.Approval === 'true' ? 'Approved' : 'Pending Approval' }}
                    </div>

                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Software Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Software</h3>
                        <span class="text-sm text-gray-500">Version {{ currentVersion }}</span>
                    </div>

                    <div v-if="userDetails.status === 'Approved'" class="space-y-4">
                        <div class="" v-for="(software, index) in softwares" :key="software.id">
                            <button v-if="index === 0" @click="downloadSoftware(software.id)"
                                class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                                <Icon name="mdi:download" class="h-5 w-5" />
                                <span>Download Software</span>
                            </button>
                        </div>


                        <p v-if="needsUpdate" class="text-sm text-amber-600 flex items-center space-x-2">
                            <Icon name="mdi:alert-circle" class="h-5 w-5" />
                            <span>New version available. Please update your software.</span>
                        </p>
                    </div>
                    <div v-else class="bg-gray-50 rounded-lg p-4">
                        <p class="text-gray-600 text-sm">
                            Your account is pending approval. Once approved, you'll be able to download the software.
                        </p>
                    </div>
                </div>

                <!-- Messages Section -->
                <UserMessaging />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';


definePageMeta({
    middleware: 'auth'
})

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
        userDetails.value = response.data.userDetails;
        console.log("User details", userDetails);

    } catch (err) {
        console.error(err);

    }
}

const currentVersion = ref('2.1.0');
const needsUpdate = ref(true);


// Example software list
const softwares = ref([
    { id: '1', name: 'Software A', releaseDate: '2025-01-01' },
    { id: '2', name: 'Software B', releaseDate: '2025-01-02' },
    { id: '3', name: 'Software C', releaseDate: '2025-01-03' },
]);

// Sort the software list by release date (descending order)
softwares.value.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

const downloadSoftware = async (softwareId) => {
    if (!softwareId) {
        console.error('Software ID is required to download software.');
        return;
    }

    try {
        const { data } = await axios.post(
            'https://watermark-distribution.onrender.com/api/softwares/download',
            { softwareId },
            { responseType: 'blob' }
        );

        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `software-${softwareId}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading software:', error);
    }
};


// Logout
const logout = () => {
    try {
        // Remove the access token and any other stored user data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");

        // Optionally clear sessionStorage if used
        sessionStorage.clear();

        // Redirect the user to the login page or any desired route
        navigateTo('/signin')
        console.log("User has been logged out successfully.");
    } catch (error) {
        console.error("An error occurred during logout:", error);
    }
};

onMounted(fetchUserDetails)
</script>
