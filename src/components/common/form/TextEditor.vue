<template>
  <div v-if="editor">
    <div v-if="!hideConfiguration" class="flex items-center gap-3">
      <div class="flex gap-0.5">
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 1 }) }"
        >
          <Heading1 />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 2 }) }"
        >
          <Heading2 />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 3 }) }"
        >
          <Heading3 />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-primary text-white': editor.isActive('bold') }"
        >
          <BoldIcon />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-primary text-white': editor.isActive('italic') }"
        >
          <ItalicIcon />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="setLink"
          :class="{ 'bg-primary text-white': editor.isActive('link') }"
        >
          <LinkIcon />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-primary text-white': editor.isActive('bulletList') }"
        >
          <ListIcon />
        </Button>
        <Button
          class="min-w-10 size-10"
          size="icon"
          variant="outline"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-primary text-white': editor.isActive('orderedList') }"
        >
          <LogsIcon />
        </Button>
      </div>
    </div>
    <EditorContent :editor="editor" class="mt-3" />
    <Dialog v-model:open="showLinkDialog">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Enter URL</DialogTitle>
          <DialogDescription class="hidden">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem, nostrum.
          </DialogDescription>
        </DialogHeader>
        <div class="flex gap-3 py-6">
          <Input v-model="url" />
          <Button @click="addLink"> Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
// icons
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Link as LinkIcon,
  List as ListIcon,
  Logs as LogsIcon,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-vue-next'

export default {
  components: {
    EditorContent,
    BoldIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    LogsIcon,
    Heading1,
    Heading2,
    Heading3
  },
  emits: ['update:modelValue', 'blur'],
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    hideConfiguration: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showLinkDialog: false,
      url: '',
      editor: null,
      selectedStyle: 'regular',
      options: [{ label: 'Regular', value: 'regular' }]
    }
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) {
        return
      }
      this.editor.commands.setContent(value, false)
    }
  },

  mounted() {
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class:
            'prose max-h-40 h-40 border rounded-lg focus:ring-primary focus:ring focus:outline-none overflow-y-auto p-3'
        }
      },
      extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        Link.configure({
          openOnClick: false,
          defaultProtocol: 'https'
        }),
        Heading.configure({
          levels: [1, 2, 3]
        })
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit(
          'update:modelValue',
          this.editor.getHTML() === '<p></p>' ? '' : this.editor.getHTML()
        )
      },
      onBlur: () => {
        this.$emit('blur')
      }
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  },
  methods: {
    setLink() {
      this.showLinkDialog = true
      let previousUrl = this.editor.getAttributes('link').href
      this.url = previousUrl
    },
    addLink() {
      this.showLinkDialog = false
      if (this.url === null) {
        return
      }
      // empty
      if (this.url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      // update link
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: this.url }).run()
    }
  }
}
</script>
