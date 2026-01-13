'use client';

import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface CustomEditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const CustomEditor = forwardRef<Quill, CustomEditorProps>(
  (
    {
      value = '',
      onChange,
      readOnly = false,
      placeholder = 'Write something...',
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const isSettingContentRef = useRef(false);
    const isInitialized = useRef(false);

    // Store the onChange callback reference
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Initialize Quill only once
    useEffect(() => {
      if (!editorRef.current || quillRef.current || isInitialized.current)
        return;

      // Mark as initialized to prevent multiple initializations
      isInitialized.current = true;

      // Copy ref to variable for cleanup function
      const editorElement = editorRef.current;

      // Clear any existing content in the container
      editorElement.innerHTML = '';

      const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['image'],
        ],
      };

      const quill = new Quill(editorElement, {
        theme: 'snow',
        modules,
        placeholder,
        readOnly,
      });

      // Store handler reference for cleanup
      const textChangeHandler = () => {
        if (isSettingContentRef.current) return;
        const html = quill.root.innerHTML;
        onChangeRef.current(html);
      };

      quill.on('text-change', textChangeHandler);
      quillRef.current = quill;

      // Cleanup function
      return () => {
        if (quillRef.current) {
          quillRef.current.off('text-change', textChangeHandler);
          quillRef.current = null;
        }
        // Reset initialization flag and clear DOM
        isInitialized.current = false;
        // Use the copied variable instead of ref
        editorElement.innerHTML = '';
      };
    }, [placeholder, readOnly]); // Include dependencies

    // Update readOnly state when prop changes
    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    // Update placeholder when prop changes
    useEffect(() => {
      if (quillRef.current && editorRef.current) {
        const placeholderElement =
          editorRef.current.querySelector('.ql-editor');
        if (placeholderElement) {
          placeholderElement.setAttribute('data-placeholder', placeholder);
        }
      }
    }, [placeholder]);

    useEffect(() => {
      const quill = quillRef.current;
      if (!quill) return;

      const currentHtml = quill.root.innerHTML;

      if (value !== currentHtml && value !== '<p><br></p>') {
        isSettingContentRef.current = true;

        if (value === '') {
          quill.setText('');
        } else {
          // ✅ safer paste with explicit index
          quill.clipboard.dangerouslyPasteHTML(0, value, 'api');
        }

        // place cursor at end (avoid broken selection restore)
        const length = quill.getLength();
        quill.setSelection(length - 1, 0);

        isSettingContentRef.current = false;
      }
    }, [value]);

    // Expose Quill instance through ref
    useImperativeHandle(ref, () => quillRef.current as Quill, []);

    return <div ref={editorRef} style={{ minHeight: 200 }} />;
  }
);

CustomEditor.displayName = 'CustomEditor';

export default CustomEditor;
