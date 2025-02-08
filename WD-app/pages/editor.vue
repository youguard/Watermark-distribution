<template>
    <div class="min-h-screen bg-gray-50 ">
        <Header />
        <div v-if="userDetails.Approval === true" class="max-w-4xl mt-4 md:mt-4 mx-auto p-4">
            <h1 class="text-4xl font-medium mb-4 text-center">Watermark Editor</h1>
            <div class="relative">
                <div ref="containerRef"
                    class="relative w-full aspect-video bg-gray-100 rounded overflow-hidden cursor-move"
                    @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
                    @mouseleave="handleMouseUp" @click="!baseImage && triggerFileUpload">
                    <img v-if="baseImage" ref="baseImageRef" :src="baseImage" alt="Base"
                        class="w-full h-full md:w-full md:h-full object-contain" />
                    <div v-if="baseImage && watermarkType === 'text'" :style="{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: textStyle.color,
                        fontSize: `${textStyle.fontSize}px`,
                        fontFamily: textStyle.fontFamily,
                        fontWeight: textStyle.isBold ? 'bold' : 'normal',
                        fontStyle: textStyle.isItalic ? 'italic' : 'normal',
                    }" class="absolute select-none pointer-events-none">
                        {{ watermarkText }}
                    </div>
                    <img v-if="baseImage && watermarkType === 'image' && watermarkImage" ref="watermarkImageRef"
                        :src="watermarkImage" alt="Watermark" :style="{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }" class="absolute w-24 h-24 object-contain select-none pointer-events-none" />
                    <div v-if="!baseImage" class="absolute inset-0 flex items-center justify-center">
                        <input id="watermark-upload" type="file" accept="image/*" @change="handleWatermarkImageUpload"
                        class="w-full p-2 border rounded hidden" />
                        <label for="watermark-upload" class="cursor-pointer text-center text-gray-500">
                            <!-- <LucideUpload size="48" class="mx-auto mb-2" /> -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-center" width="4.5em"
                                height="4.5em" viewBox="0 0 24 24">
                                <path fill="currentColor" fill-rule="evenodd"
                                    d="M12 1.25a.75.75 0 0 1 .57.262l3 3.5a.75.75 0 1 1-1.14.976l-1.68-1.96V15a.75.75 0 0 1-1.5 0V4.027L9.57 5.988a.75.75 0 1 1-1.14-.976l3-3.5A.75.75 0 0 1 12 1.25M6.996 8.252a.75.75 0 0 1 .008 1.5c-1.093.006-1.868.034-2.457.142c-.566.105-.895.272-1.138.515c-.277.277-.457.666-.556 1.4c-.101.755-.103 1.756-.103 3.191v1c0 1.436.002 2.437.103 3.192c.099.734.28 1.122.556 1.4c.277.276.665.456 1.4.555c.754.102 1.756.103 3.191.103h8c1.435 0 2.436-.001 3.192-.103c.734-.099 1.122-.279 1.399-.556s.457-.665.556-1.399c.101-.755.103-1.756.103-3.192v-1c0-1.435-.002-2.436-.103-3.192c-.099-.733-.28-1.122-.556-1.399c-.244-.243-.572-.41-1.138-.515c-.589-.108-1.364-.136-2.457-.142a.75.75 0 1 1 .008-1.5c1.082.006 1.983.032 2.72.167c.758.14 1.403.405 1.928.93c.602.601.86 1.36.982 2.26c.116.866.116 1.969.116 3.336v1.11c0 1.368 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116c-.9-.121-1.658-.38-2.26-.982s-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337v-1.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.525-.524 1.17-.79 1.928-.929c.737-.135 1.638-.161 2.72-.167"
                                    clip-rule="evenodd" />
                            </svg>
                            <p>Upload an image to begin</p>
                        </label>
                    </div>
                    <input type="file" accept="image/*" @change="handleBaseImageUpload" ref="fileInput" class="hidden" />
                </div>
            </div>
            <div v-if="baseImage" class="mt-2 text-sm text-gray-500 text-center">
                Position: X: {{ position.x.toFixed(1) }}%, Y: {{ position.y.toFixed(1) }}%
            </div>
            <div class="mt-4 flex flex-col text-center items-center justify-between">
                <div class="text-gray-500 flex items-center gap-2">
                    <!-- <LucideMove size="20" /> -->
                    <span class="text-xs md:text-md">Click and drag or use arrow buttons to position the
                        watermark</span>
                </div>
            </div>
            <div class="flex w-full items-center justify-between mt-2">
                <div v-if="baseImage" class="flex gap-1">
                    <NudgeButton direction="up" :icon="LucideArrowUp" />
                    <div class="flex justify-start gap-1">
                        <NudgeButton direction="left" :icon="LucideArrowLeft" />
                        <NudgeButton direction="right" :icon="LucideArrowRight" />
                    </div>
                    <NudgeButton direction="down" :icon="LucideArrowDown" />
                </div>
                <button v-if="baseImage" @click="handleDownload"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <!-- <LucideDownload size="20" /> -->
                    Save
                </button>
            </div>
            <div class="my-6 space-y-4">
                <div class="flex gap-4">
                    <button @click="setWatermarkType('text')"
                        :class="`flex items-center gap-2 px-4 py-2 rounded ${watermarkType === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`">
                        <!-- <LucideType size="20" />  -->
                        Text Watermark
                    </button>
                    <button @click="setWatermarkType('image')"
                        :class="`flex items-center gap-2 px-4 py-2 rounded ${watermarkType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`">
                        <!-- <LucideImage size="20" />  -->
                        Image Watermark
                    </button>
                </div>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium mb-2">Upload Base Image</label>
                        <input type="file" accept="image/*" @change="handleBaseImageUpload"
                            class="w-full p-2 border rounded" />
                    </div>
                    <div v-if="watermarkType === 'image'" class="flex-1">
                        <label class="block text-sm font-medium mb-2">Upload Watermark Image</label>
                        <input id="watermark-upload" type="file" accept="image/*" @change="handleWatermarkImageUpload"
                            class="w-full p-2 border rounded" />
                    </div>
                </div>
                <div v-if="watermarkType === 'text'" class="space-y-4">
                    <input type="text" v-model="watermarkText" class="w-full p-2 border rounded"
                        placeholder="Enter watermark text" />
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Font Size</label>
                            <input type="number" v-model.number="textStyle.fontSize" class="w-full p-2 border rounded"
                                min="8" max="72" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Color</label>
                            <input type="color" v-model="textStyle.color" class="w-full h-10 border rounded" />
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <button @click="textStyle.isBold = !textStyle.isBold"
                            :class="`px-4 py-2 rounded ${textStyle.isBold ? 'bg-blue-500 text-white' : 'bg-gray-200'}`">
                            Bold
                        </button>
                        <button @click="textStyle.isItalic = !textStyle.isItalic"
                            :class="`px-4 py-2 rounded ${textStyle.isItalic ? 'bg-blue-500 text-white' : 'bg-gray-200'}`">
                            Italic
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-[80vh]">
            <Icon icon="solar:sad-circle-broken" width="5.5em" height="5.5em" />
            <p class="text-gray-500 text-center mt-2">Admin hasn't approved you yet.</p>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue/dist/iconify.js';
import axios from 'axios';



export default {
    components: {
        Icon,
    },
    data() {
        return {
            baseImage: null,
            watermarkType: 'text',
            watermarkText: 'Your Watermark',
            watermarkImage: null,
            position: { x: 50, y: 50 },
            isDragging: false,
            textStyle: {
                fontSize: 24,
                color: '#000000',
                fontFamily: 'Arial',
                isBold: false,
                isItalic: false,
            },
            userDetails: {},
        };
    },
    methods: {
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        async fetchUserDetails() {
            try {
                const token = localStorage.getItem("accessToken")
                const response = await axios.get('https://watermark-distribution.onrender.com/api/user/details',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                this.userDetails = response.data.userDetails;
                console.log("User details", userDetails);

            } catch (err) {
                console.error(err);

            }
        },
        handleBaseImageUpload(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => (this.baseImage = e.target.result);
                reader.readAsDataURL(file);
            }
        },
        handleWatermarkImageUpload(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => (this.watermarkImage = e.target.result);
                reader.readAsDataURL(file);
            }
        },
        handleMouseDown(e) {
            if (!this.baseImage) return;
            const container = this.$refs.containerRef.getBoundingClientRect();
            const x = ((e.clientX - container.left) / container.width) * 100;
            const y = ((e.clientY - container.top) / container.height) * 100;
            this.position = { x, y };
            this.isDragging = true;
        },
        handleMouseMove(e) {
            if (!this.isDragging || !this.baseImage) return;
            const container = this.$refs.containerRef.getBoundingClientRect();
            const x = ((e.clientX - container.left) / container.width) * 100;
            const y = ((e.clientY - container.top) / container.height) * 100;
            this.position = {
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
            };
        },
        handleMouseUp() {
            this.isDragging = false;
        },
        handleNudge(direction) {
            const nudgeAmount = 1; // 1% of the container size
            this.position = {
                ...this.position,
                x: direction === 'left' ? Math.max(0, this.position.x - nudgeAmount) : direction === 'right' ? Math.min(100, this.position.x + nudgeAmount) : this.position.x,
                y: direction === 'up' ? Math.max(0, this.position.y - nudgeAmount) : direction === 'down' ? Math.min(100, this.position.y + nudgeAmount) : this.position.y,
            };
        },
        async handleDownload() {
            if (!this.baseImage) return;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const baseImg = new Image();
            baseImg.crossOrigin = 'anonymous';
            const loadBaseImage = new Promise((resolve) => {
                baseImg.onload = () => {
                    canvas.width = baseImg.width;
                    canvas.height = baseImg.height;
                    ctx.drawImage(baseImg, 0, 0);
                    resolve();
                };
            });
            baseImg.src = this.baseImage;
            await loadBaseImage;
            const addTextWatermark = () => {
                ctx.fillStyle = this.textStyle.color;
                let font = `${this.textStyle.isBold ? 'bold ' : ''}${this.textStyle.isItalic ? 'italic ' : ''}${this.textStyle.fontSize}px ${this.textStyle.fontFamily}`;
                ctx.font = font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const x = (this.position.x / 100) * canvas.width;
                const y = (this.position.y / 100) * canvas.height;
                ctx.fillText(this.watermarkText, x, y);
            };
            const addImageWatermark = () => {
                return new Promise((resolve) => {
                    if (this.watermarkImage) {
                        const watermarkImg = new Image();
                        watermarkImg.crossOrigin = 'anonymous';
                        watermarkImg.onload = () => {
                            const watermarkWidth = Math.min(canvas.width * 0.3, 300);
                            const aspectRatio = watermarkImg.height / watermarkImg.width;
                            const watermarkHeight = watermarkWidth * aspectRatio;
                            const x = ((this.position.x / 100) * canvas.width) - (watermarkWidth / 2);
                            const y = ((this.position.y / 100) * canvas.height) - (watermarkHeight / 2);
                            ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
                            resolve();
                        };
                        watermarkImg.src = this.watermarkImage;
                    } else {
                        resolve();
                    }
                });
            };
            try {
                if (this.watermarkType === 'text') {
                    addTextWatermark();
                } else if (this.watermarkType === 'image') {
                    await addImageWatermark();
                }
                const link = document.createElement('a');
                link.download = 'watermarked-image.png';
                link.href = canvas.toDataURL('image/png', 1.0);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error creating watermarked image:', error);
                alert('There was an error creating the watermarked image. Please try again.');
            }
        },
        setWatermarkType(type) {
            this.watermarkType = type;
        },
    },

    mounted() {
        this.fetchUserDetails()
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>
