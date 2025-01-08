<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <nav class="bg-white/70 backdrop-blur-md border-b border-gray-100">
            <div class="max-w-5xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <Icon icon="material-symbols:water-drop-outline-rounded" width="1.5em" height="1.5em" class="text-blue-600" />
                        <span class="text-xl font-medium uppercase font-bold"> <span
                                class="text-blue-700">You</span>Guard</span>
                    </div>
                    <div class="flex items-center space-x-4">

                        <!-- Notification Icon -->
                        <button @click="toggleModal" class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                <path fill="#000" fill-rule="evenodd"
                                    d="M12 1.25A7.75 7.75 0 0 0 4.25 9v.704a3.53 3.53 0 0 1-.593 1.958L2.51 13.385c-1.334 2-.316 4.718 2.003 5.35q1.133.309 2.284.523l.002.005C7.567 21.315 9.622 22.75 12 22.75s4.433-1.435 5.202-3.487l.002-.005a29 29 0 0 0 2.284-.523c2.319-.632 3.337-3.35 2.003-5.35l-1.148-1.723a3.53 3.53 0 0 1-.593-1.958V9A7.75 7.75 0 0 0 12 1.25m3.376 18.287a28.5 28.5 0 0 1-6.753 0c.711 1.021 1.948 1.713 3.377 1.713s2.665-.692 3.376-1.713M5.75 9a6.25 6.25 0 1 1 12.5 0v.704c0 .993.294 1.964.845 2.79l1.148 1.723a2.02 2.02 0 0 1-1.15 3.071a26.96 26.96 0 0 1-14.187 0a2.02 2.02 0 0 1-1.15-3.07l1.15-1.724a5.03 5.03 0 0 0 .844-2.79z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <button @click="logout" class="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                            <Icon name="mdi:logout" class="h-5 w-5" />
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                    viewBox="0 0 24 24">
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

        <!-- Notification Modal -->
        <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg p-2 max-w-lg w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Notifications</h3>
                    <button @click="toggleModal" class="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                            <g fill="none" fill-rule="evenodd">
                                <path
                                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path fill="#000"
                                    d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z" />
                            </g>
                        </svg>
                    </button>
                </div>

                <Notifications />
            </div>
        </div>


        <main class="max-w-5xl mx-auto px-4 py-8">
            <!-- Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Welcome back, {{ userDetails.Username }}</h2>
                        <p class="text-gray-500 mt-1">{{ userDetails.Email }}</p>
                    </div>
                    <div v-if="userDetails?.Approval !== undefined"
                        :class="`px-3 py-1 rounded-full text-sm font-medium ${userDetails.Approval === true || userDetails.Approval === 'true' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`">
                        {{ userDetails?.Approval === true || userDetails?.Approval === 'true' ? 'Approved' : 'Pending Approval' }}
                    </div>


                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Software Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Software</h3>
                        <span class="text-sm text-gray-500 capitalize"> {{ currentVersion }}</span>
                    </div>

                    <div v-if="userDetails.Approval === true" class="space-y-4">
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
import Notifications from './notifications.vue';
import { Icon } from "@iconify/vue";

definePageMeta({
    middleware: 'auth'
})

const isModalVisible = ref(false);
const userDetails = ref({})

const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
};

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

const currentVersion = ref('');
const needsUpdate = ref(true);


// Example software list
const softwares = ref([
]);

const softwareId = ref('')

// Sort the software list by release date (descending order)
softwares.value.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

const fetchAllSoftwares = async () => {
    try {
        const token = localStorage.getItem("accessToken")
        const response = await axios.get('https://watermark-distribution.onrender.com/api/softwares', {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });
        softwares.value = response.data.softwares
        softwareId.value = response.data.softwares[0]._id
        currentVersion.value = response.data.softwares[0].version
        console.log(softwares.value);

    } catch (error) {
        console.log(error);

    }
}

const downloadSoftware = async () => {
    console.log("SoftwareId:", softwareId.value);
    
    const token = localStorage.getItem("accessToken");
    try {
        const data  = await axios.get(
            `https://watermark-distribution.onrender.com/api/softwares/download/${softwareId.value}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Assuming the response contains a downloadUrl
        const downloadUrl = data.data.downloadUrl;

        console.log("Download url:", downloadUrl);
        
                // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `software-${softwareId.value}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
onMounted(fetchAllSoftwares)
</script>
