<template>
    <div class="container mx-auto mt-10 p-8">
        <h1 class="text-3xl font-bold mb-6">Watermark Editor</h1>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Canvas for Image Preview -->
            <div class="mb-6 relative">
                <canvas ref="canvas" class="w-full border border-gray-300 rounded-md"></canvas>
                <div v-if="watermarkType === 'text'" ref="textWatermark" :style="{
                    position: 'absolute',
                    left: `${watermarkPosition.x}px`,
                    top: `${watermarkPosition.y}px`,
                    fontSize: `${textStyle.fontSize}px`,
                    fontWeight: textStyle.fontWeight,
                    fontStyle: textStyle.fontStyle,
                    color: textStyle.color,
                    cursor: 'move',
                    userSelect: 'none'
                }" @mousedown="startDragging" @touchstart="startDragging">
                    {{ watermarkText }}
                </div>
                <img v-else-if="watermarkType === 'image' && watermarkImage" ref="imageWatermark" :src="watermarkImage"
                    :style="{
                        position: 'absolute',
                        left: `${watermarkPosition.x}px`,
                        top: `${watermarkPosition.y}px`,
                        width: '100px',
                        cursor: 'move',
                        userSelect: 'none'
                    }" @mousedown="startDragging" @touchstart="startDragging">
            </div>

            <div class="">
                <!-- Image Upload -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input type="file" @change="handleImageUpload" accept="image/*" class="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
        " />
                </div>

                <!-- Watermark Options -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Watermark Type</label>
                    <div class="flex space-x-4">
                        <button @click="watermarkType = 'text'"
                            :class="{ 'bg-violet-600 text-white': watermarkType === 'text' }"
                            class="px-4 py-2 rounded-md border border-violet-600 text-violet-600 hover:bg-violet-50">
                            <Icon icon="mdi:format-text" class="mr-2" />
                            Text
                        </button>
                        <button @click="watermarkType = 'image'"
                            :class="{ 'bg-violet-600 text-white': watermarkType === 'image' }"
                            class="px-4 py-2 rounded-md border border-violet-600 text-violet-600 hover:bg-violet-50">
                            <Icon icon="mdi:image" class="mr-2" />
                            Image
                        </button>
                    </div>
                </div>

                <!-- Text Watermark Options -->
                <div v-if="watermarkType === 'text'" class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
                    <input v-model="watermarkText" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
                        placeholder="Enter watermark text">

                    <!-- Text Styling Options -->
                    <div class="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                            <input v-model="textStyle.fontSize" type="number"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
                                min="8" max="72">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Color</label>
                            <input v-model="textStyle.color" type="color"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
                            <select v-model="textStyle.fontWeight"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50">
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                            <select v-model="textStyle.fontStyle"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50">
                                <option value="normal">Normal</option>
                                <option value="italic">Italic</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Image Watermark Options -->
                <div v-if="watermarkType === 'image'" class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload Watermark Image</label>
                    <input type="file" @change="handleWatermarkImageUpload" accept="image/*" class="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
        " />
                </div>
            </div>
        </div>








        <!-- Action Buttons -->
        <div class="flex space-x-4">
            <button @click="saveDraft"
                class="px-4 py-2 flex items-center bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                <Icon icon="mdi:content-save" class="mr-2" />
                Save Draft
            </button>
            <button @click="downloadImage"
                class="px-4 py-2 flex items-center bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                <Icon icon="mdi:download" class="mr-2" />
                Download
            </button>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useFirebase } from '~/composables/useFirebase'


const { saveDraftToFirebase } = useFirebase()

const canvas = ref(null)
const ctx = ref(null)
const baseImage = ref(null)
const watermarkType = ref('text')
const watermarkText = ref('Watermark')
const watermarkImage = ref(null)
const watermarkPosition = reactive({ x: 50, y: 50 })
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const textStyle = reactive({
  fontSize: 24,
  color: '#000000',
  fontWeight: 'normal',
  fontStyle: 'normal'
})

const textWatermark = ref(null)
const imageWatermark = ref(null)

onMounted(() => {
    ctx.value = canvas.value.getContext('2d')
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('touchmove', drag)
    window.addEventListener('touchend', stopDragging)
})

onUnmounted(() => {
    window.removeEventListener('mousemove', drag)
    window.removeEventListener('mouseup', stopDragging)
    window.removeEventListener('touchmove', drag)
    window.removeEventListener('touchend', stopDragging)
})

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            baseImage.value = new Image()
            baseImage.value.onload = () => {
                drawImage()
            }
            baseImage.value.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const handleWatermarkImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            watermarkImage.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const drawImage = () => {
    if (baseImage.value) {
        canvas.value.width = baseImage.value.width
        canvas.value.height = baseImage.value.height
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
        ctx.value.drawImage(baseImage.value, 0, 0)
    }
}

// const startDragging = (event) => {
//     isDragging.value = true
//     dragOffset.x = event.clientX - watermarkPosition.x
//     dragOffset.y = event.clientY - watermarkPosition.y
// }

// const drag = (event) => {
//     if (isDragging.value) {
//         watermarkPosition.x = event.clientX - dragOffset.x
//         watermarkPosition.y = event.clientY - dragOffset.y
//     }
// }

// const stopDragging = () => {
//     isDragging.value = false
// }


const startDragging = (event) => {
    isDragging.value = true
    const clientX = event.clientX || event.touches[0].clientX
    const clientY = event.clientY || event.touches[0].clientY
    const rect = event.target.getBoundingClientRect()
    dragOffset.x = clientX - rect.left
    dragOffset.y = clientY - rect.top
}

const drag = (event) => {
    if (isDragging.value) {
        event.preventDefault()
        const clientX = event.clientX || event.touches[0].clientX
        const clientY = event.clientY || event.touches[0].clientY
        const canvasRect = canvas.value.getBoundingClientRect()

        watermarkPosition.x = Math.min(
            Math.max(clientX - canvasRect.left - dragOffset.x, 0),
            canvasRect.width - (watermarkType.value === 'image' ? 100 : 0)
        )
        watermarkPosition.y = Math.min(
            Math.max(clientY - canvasRect.top - dragOffset.y, 0),
            canvasRect.height - (watermarkType.value === 'image' ? 100 : 0)
        )
    }
}

const stopDragging = () => {
    isDragging.value = false
}

const saveDraft = async () => {
    const draft = {
        baseImage: baseImage.value.src,
        watermarkType: watermarkType.value,
        watermarkText: watermarkText.value,
        watermarkImage: watermarkImage.value,
        watermarkPosition,
        textStyle
    }
    await saveDraftToFirebase(draft)
    alert('Draft saved successfully!')
    toast.success('Draft saved successfully!')
}

const downloadImage = () => {
    drawImage()
    if (watermarkType.value === 'text') {
        ctx.value.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px Arial`
        ctx.value.fillStyle = textStyle.color
        ctx.value.fillText(watermarkText.value, watermarkPosition.x, watermarkPosition.y)
    } else if (watermarkType.value === 'image' && watermarkImage.value) {
        const img = new Image()
        img.onload = () => {
            ctx.value.drawImage(img, watermarkPosition.x, watermarkPosition.y, 100, 100)
            const link = document.createElement('a')
            link.download = 'watermarked-image.png'
            link.href = canvas.value.toDataURL()
            link.click()
        }
        img.src = watermarkImage.value
    }
}
</script>

<style>
input {
    padding: 10px;
}

select {
    padding: 10px;
}
</style>