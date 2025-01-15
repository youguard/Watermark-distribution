<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
            <div class="flex justify-center mb-6">
                <div class="flex items-center">
                    <Icon icon="material-symbols:water-drop-outline-rounded" width="1.5em" height="1.5em"
                        class="text-blue-600" />
                    <span class="text-xl font-medium uppercase font-bold"> <span
                            class="text-blue-700">You</span>Guard</span>
                </div>
            </div>
            <h1 class="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
            <form @submit.prevent="submitEmail" class="space-y-4">
                <input v-model="email" type="email" placeholder="Enter your email"
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit"
                    class="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    :disabled="loading">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Send Reset Link</span>
                </button>
            </form>
            <p v-if="message" class="mt-4 text-center text-green-500">{{ message }}</p>
            <p class="mt-4 text-center">
                <router-link to="/signin" class="text-blue-500 hover:underline">Back to Login</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue/dist/iconify.js';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default {
    components: {
        Icon
    },
    data() {
        return {
            email: "",
            message: "",
            loading: false
        };
    },
    methods: {
        async submitEmail() {
            this.loading = true;
            try {
                const response = await axios.post("https://watermark-distribution.onrender.com/api/users/verify-email", {
                    email: this.email
                });
                toast.success('Link sent to email')
            } catch (error) {
                toast.error('Something went wrong')
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>