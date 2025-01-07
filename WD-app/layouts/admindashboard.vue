<template>
    <main>
        <div class="fixed">
            <Sidebar />
        </div>
        <div class="md:ml-64">
            <nav class="bg-white shadow-sm fixed w-[84%] top-0">
                <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <h1 class="text-xl font-semibold">Dashboard</h1>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button class="p-2 rounded-full hover:bg-gray-100">

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
            <div class="pt-16">
                <slot />
            </div>
        </div>
    </main>
</template>

<script>
export default {

}
</script>

<style></style>