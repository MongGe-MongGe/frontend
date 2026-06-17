<template>
  <div class="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-white">
    <div class="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
      <!-- Headings -->
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 1 }) }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-bold"
        type="button"
        title="Heading 1"
      >
        H1
      </button>
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 2 }) }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-bold"
        type="button"
        title="Heading 2"
      >
        H2
      </button>
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 3 }) }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-bold"
        type="button"
        title="Heading 3"
      >
        H3
      </button>

      <div class="w-px h-5 bg-gray-300 mx-1"></div>

      <!-- Text Styles -->
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-gray-200': editor?.isActive('bold') }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-bold"
        type="button"
        title="Bold"
      >
        B
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-gray-200': editor?.isActive('italic') }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 italic font-serif"
        type="button"
        title="Italic"
      >
        I
      </button>
      <button
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="{ 'bg-gray-200': editor?.isActive('strike') }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 line-through"
        type="button"
        title="Strikethrough"
      >
        S
      </button>

      <div class="w-px h-5 bg-gray-300 mx-1"></div>

      <!-- Lists -->
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-gray-200': editor?.isActive('bulletList') }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 flex items-center justify-center"
        type="button"
        title="Bullet List"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-gray-200': editor?.isActive('orderedList') }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 flex items-center justify-center"
        type="button"
        title="Ordered List"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h14M7 12h14M7 16h14M3 8h.01M3 12h.01M3 16h.01"
          ></path>
        </svg>
      </button>

      <div class="w-px h-5 bg-gray-300 mx-1"></div>

      <!-- Link -->
      <button
        @click="setLink"
        :class="{ 'bg-gray-200': editor?.isActive('link') }"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center"
        type="button"
        title="Link"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          ></path>
        </svg>
      </button>

      <!-- Image Insert -->
      <label
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 cursor-pointer flex items-center justify-center"
        title="Insert Image"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
      </label>
    </div>

    <!-- Editor Content -->
    <div class="p-4 min-h-[300px] cursor-text" @click="focusEditor">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const authStore = useAuthStore()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image,
    Link.configure({
      openOnClick: false,
    }),
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none',
    },
  },
})

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value
    if (!isSame && editor.value) {
      editor.value.commands.setContent(value, false)
    }
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const focusEditor = () => {
  editor.value?.commands.focus()
}

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // update link
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    // API returns tempUrl as response data (text)
    const url = response.data
    if (url) {
      editor.value?.chain().focus().setImage({ src: url }).run()
    }
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    alert('이미지 업로드에 실패했습니다.')
  } finally {
    // Reset file input
    input.value = ''
  }
}
</script>

<style>
/* Prose styles for tiptap content */
.prose h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}
.prose h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}
.prose h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
}
.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.prose ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.prose ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.prose a {
  color: #3b82f6;
  text-decoration: underline;
}
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
