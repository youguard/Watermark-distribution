<template>
    <div>
        <section class="py-10 bg-gray-50 h-screen sm:py-16 lg:py-16">
            <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="max-w-2xl mx-auto text-center">
                    <h2 class="text-3xl font-bold leading-tight text-black sm:text-xl lg:text-2xl">Create Admin account
                    </h2>
                </div>

                <div class="relative max-w-md mx-auto mt-8 md:mt-8">
                    <div class="overflow-hidden bg-white rounded-md shadow-md">
                        <div class="px-4 py-6 sm:px-8 sm:py-7">
                            <form action="#" method="POST">
                                <div class="space-y-5">
                                    <div>
                                        <label for="" class="text-base font-medium text-gray-900"> Fullname
                                        </label>
                                        <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div
                                                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>

                                            <input type="text" placeholder="Enter your full name"
                                                class="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                v-model="name" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="" class="text-base font-medium text-gray-900"> Email address
                                        </label>
                                        <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div
                                                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>

                                            <input type="email" placeholder="Enter email to get started"
                                                class="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                v-model="email" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="" class="text-base font-medium text-gray-900"> Password </label>
                                        <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                            <div
                                                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                                </svg>
                                            </div>

                                            <input type="password" placeholder="Enter your password"
                                                class="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                v-model="password" />
                                        </div>
                                    </div>

                                    <!-- <div class="flex items-center">
                                        <input type="checkbox" name="agree" id="agree"
                                            class="w-5 h-5 text-green-500 bg-white border-gray-200 rounded" checked />

                                        <label for="agree" class="ml-3 text-sm font-medium text-gray-500">
                                            I agree to Postcraft’s <a href="#" title=""
                                                class="text-blue-600 hover:text-blue-700 hover:underline">Terms of
                                                Service</a> and <a href="#" title=""
                                                class="text-blue-600 hover:text-blue-700 hover:underline">Privacy
                                                Policy</a>
                                        </label>
                                    </div> -->

                                    <div>
                                        <button type="button" @click="signup"
                                            class="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700">
                                            <span v-if="isLoading" class="mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                                    viewBox="0 0 24 24">
                                                    <circle cx="18" cy="12" r="0" fill="#fff">
                                                        <animate attributeName="r" begin=".67" calcMode="spline"
                                                            dur="1.5s"
                                                            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                                            repeatCount="indefinite" values="0;2;0;0" />
                                                    </circle>
                                                    <circle cx="12" cy="12" r="0" fill="#fff">
                                                        <animate attributeName="r" begin=".33" calcMode="spline"
                                                            dur="1.5s"
                                                            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                                            repeatCount="indefinite" values="0;2;0;0" />
                                                    </circle>
                                                    <circle cx="6" cy="12" r="0" fill="#fff">
                                                        <animate attributeName="r" begin="0" calcMode="spline"
                                                            dur="1.5s"
                                                            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                                                            repeatCount="indefinite" values="0;2;0;0" />
                                                    </circle>
                                                </svg>
                                            </span>
                                            <span v-else> Create account </span>
                                        </button>
                                    </div>

                                    <div class="text-center">
                                        <p class="text-base text-gray-600">Already have an account?
                                            <NuxtLink to="/admin/signin" title=""
                                                class="font-medium text-orange-500 transition-all duration-200 hover:text-orange-600 hover:underline">
                                                Login
                                                here
                                            </NuxtLink>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            isLoading: false
        }
    },
    methods: {
        async signup() {
            try {
                this.isLoading = true;
                const response = await axios.post('https://watermark-distribution.onrender.com/api/admin/signup', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                })

                const data = await response.data
                alert(data.message);
                this.$router.push('/admin/signin')
                console.log(data)
                this.isLoading = false;
            } catch (error) {
                alert('An error occurred. Please try again later.')
                console.error(error)
                this.isLoading = false;
            }
        }
    }
}
</script>

<style></style>