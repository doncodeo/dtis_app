"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const menuItems = [
    { action: () => editor.chain().focus().toggleBold().run(), name: 'bold', isActive: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), name: 'italic', isActive: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleStrike().run(), name: 'strike', isActive: editor.isActive('strike') },
    { action: () => editor.chain().focus().setParagraph().run(), name: 'paragraph', isActive: editor.isActive('paragraph') },
  ];

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 flex items-center flex-wrap gap-2 bg-gray-50">
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={item.action}
          type="button"
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            item.isActive
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } border border-gray-300 transition-colors duration-150`}
        >
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </button>
      ))}
    </div>
  );
};

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  onBlur: () => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, onBlur }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full p-4 min-h-[200px] border-l border-r border-gray-300 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onBlur() {
      onBlur();
    },
  });

  return (
    <div className="rounded-lg shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="border-b border-l border-r border-gray-300 rounded-b-lg" />
    </div>
  );
};

export default TiptapEditor;
