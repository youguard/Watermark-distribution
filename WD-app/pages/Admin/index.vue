<!-- pages/admin/index.vue -->
<template>
    <NuxtLayout name="admindashboard">
        <div class="min-h-screen bg-gray-50">
            <!-- Top Navigation -->
            <nav class="bg-white shadow-sm">
                <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <h1 class="text-xl font-semibold">Admin Dashboard</h1>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button class="p-2 rounded-full hover:bg-gray-100">
                                <!-- <Icon name="heroicons:bell" class="h-6 w-6 text-gray-500" /> -->
                            </button>
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span class="text-white text-sm">AD</span>
                                </div>
                                <span class="text-sm font-medium">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div v-for="stat in stats" :key="stat.title" class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-sm font-medium text-gray-500">{{ stat.title }}</h3>
                        <div class="mt-2 flex items-baseline">
                            <p class="text-2xl font-semibold">{{ stat.value }}</p>
                            <span :class="`ml-2 text-sm ${stat.status === 'increase' ? 'text-green-500' : 'text-red-500'
                                }`">
                                {{ stat.change }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Current Announcement -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-lg font-medium">Current Announcement</h2>
                                <button class="text-sm text-blue-500 hover:text-blue-600">Edit</button>
                            </div>
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-gray-600">{{ currentAnnouncement }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Regional Distribution -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6">
                            <h2 class="text-lg font-medium mb-4">Regional Distribution</h2>
                            <div class="space-y-4">
                                <div v-for="region in regions" :key="region.name" class="flex items-center">
                                    <span class="w-24 text-sm text-gray-500">{{ region.name }}</span>
                                    <div class="flex-1 mx-2">
                                        <div class="h-2 bg-blue-100 rounded-full">
                                            <div class="h-2 bg-blue-500 rounded-full"
                                                :style="`width: ${(region.users / maxUsers) * 100}%`"></div>
                                        </div>
                                    </div>
                                    <span class="text-sm font-medium">{{ region.users }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

               <div class="mt-10">
                <UserTable />
               </div>
            </div>
        </div>
    </NuxtLayout>

</template>

<script setup>
const stats = ref([
    { title: 'Total Users', value: '2,345', change: '+12%', status: 'increase' },
    { title: 'Pending Approvals', value: '48', change: '+5%', status: 'increase' },
    { title: 'Active Members', value: '1,892', change: '-2%', status: 'decrease' },
    { title: 'Downloads', value: '156', change: '+8%', status: 'increase' }
]);

const regions = ref([
    { name: 'Region 1', users: 425 },
    { name: 'Region 2', users: 385 },
    { name: 'Region 3', users: 356 },
    { name: 'Region 4', users: 289 },
    { name: 'Region 5', users: 248 },
    { name: 'Region 6', users: 189 }
]);

const currentAnnouncement = ref('Latest software update v2.1.0 is now available. All users must update their applications by the end of this month.');

const maxUsers = computed(() => {
    return Math.max(...regions.value.map(region => region.users));
});
</script>