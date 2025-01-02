<template>
    <main>
        <div class="container">
            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-2">
                    <Sidebar />
                </div>
                <div class="col-span-10">
                    <slot />
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {

}
</script>

<style></style>