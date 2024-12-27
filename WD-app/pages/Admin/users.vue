<!-- pages/admin/users.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <Icon name="mdi:magnify"
                            class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" v-model="searchQuery" placeholder="Search users..."
                            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64">
                    </div>
                    <select v-model="selectedRegion"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Regions</option>
                        <option v-for="region in regions" :key="region" :value="region">
                            {{ region }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-lg shadow">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th v-for="header in headers" :key="header.key"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    @click="sortBy(header.key)">
                                    <div class="flex items-center space-x-1">
                                        <span>{{ header.label }}</span>
                                        <Icon v-if="sortColumn === header.key"
                                            :name="sortDirection === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                                            class="h-4 w-4" />
                                    </div>
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <div
                                                class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span class="text-blue-600 font-medium">
                                                    {{ user.name.charAt(0) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                                            <div class="text-sm text-gray-500">{{ user.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">{{ user.nickname }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">{{ user.phone }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">{{ user.region }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(user.status)}`">
                                        {{ user.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex justify-end space-x-3">
                                        <button @click="toggleApproval(user)" :class="`px-3 py-1 rounded-lg text-xs font-medium ${user.status === 'Approved'
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`">
                                            {{ user.status === 'Approved' ? 'Revoke' : 'Approve' }}
                                        </button>
                                        <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900">
                                            <Icon name="mdi:pencil" class="h-5 w-5" />
                                        </button>
                                        <button @click="messageUser(user)" class="text-gray-600 hover:text-gray-900">
                                            <Icon name="mdi:message" class="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <select v-model="itemsPerPage" class="border border-gray-300 rounded-lg px-2 py-1 text-sm">
                                <option :value="10">10 / page</option>
                                <option :value="20">20 / page</option>
                                <option :value="50">50 / page</option>
                            </select>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`">
                                {{ page }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const searchQuery = ref('');
const selectedRegion = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortColumn = ref('name');
const sortDirection = ref('asc');

const headers = [
    { key: 'name', label: 'Name' },
    { key: 'nickname', label: 'Nickname' },
    { key: 'phone', label: 'Phone' },
    { key: 'region', label: 'Region' },
    { key: 'status', label: 'Status' },
];

const regions = ['Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 5', 'Region 6'];

// Sample user data
const users = ref([
    {
        id: 1,
        name: 'John Doe',
        nickname: 'johnd',
        email: 'john@example.com',
        phone: '+1234567890',
        region: 'Region 1',
        status: 'Approved'
    },
    // Add more sample users here
]);

// Filter and sort users
const filteredUsers = computed(() => {
    let filtered = [...users.value];

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.nickname.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }

    // Apply region filter
    if (selectedRegion.value) {
        filtered = filtered.filter(user => user.region === selectedRegion.value);
    }

    // Apply sorting
    filtered.sort((a, b) => {
        const aValue = a[sortColumn.value];
        const bValue = b[sortColumn.value];

        if (sortDirection.value === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    return filtered;
});

const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

const getStatusClass = (status) => {
    switch (status) {
        case 'Approved':
            return 'bg-green-100 text-green-700';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'Revoked':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const sortBy = (column) => {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn.value = column;
        sortDirection.value = 'asc';
    }
};

const toggleApproval = (user) => {
    user.status = user.status === 'Approved' ? 'Revoked' : 'Approved';
};

const editUser = (user) => {
    // Implement edit functionality
    console.log('Edit user:', user);
};

const messageUser = (user) => {
    // Implement message functionality
    console.log('Message user:', user);
};
</script>