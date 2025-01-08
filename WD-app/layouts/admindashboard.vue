<template>
    <main>
        <!-- Sidebar (hidden on mobile when not toggled) -->
        <div :class="['fixed z-10', { hidden: !sidebarOpen && isMobile }]">
            <Sidebar />
        </div>

        <!-- Content Section -->
        <div :class="{ 'md:ml-64': !isMobile || sidebarOpen }">
            <!-- Navbar -->
            <nav class="bg-white shadow-sm fixed w-full top-0 md:w-[84%]">
                <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <!-- Mobile Sidebar Toggle Button -->
                            <button @click="toggleSidebar" 
                                    class="p-2 rounded-md hover:bg-gray-100 md:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                     class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                            <h1 class="text-xl font-semibold ml-2">Dashboard</h1>
                        </div>
                        <div class="flex items-center space-x-4 mr-4 md:mr-8">
                            <button class="p-2 rounded-full hover:bg-gray-100">
                                <!-- Add icon or content if needed -->
                            </button>
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span class="text-white text-sm">AD</span>
                                </div>
                                <!-- <span class="text-sm font-medium">Admin</span> -->
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <div class="pt-16">
                <slot />
            </div>
        </div>
    </main>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
    setup() {
        const sidebarOpen = ref(false);
        const isMobile = ref(false);

        const toggleSidebar = () => {
            sidebarOpen.value = !sidebarOpen.value;
        };

        const checkMobile = () => {
            isMobile.value = window.innerWidth < 768;
        };

        onMounted(() => {
            checkMobile();
            window.addEventListener("resize", checkMobile);
        });

        return {
            sidebarOpen,
            isMobile,
            toggleSidebar,
        };
    },
};
</script>

<style>
.hidden {
    display: none;
}
</style>
