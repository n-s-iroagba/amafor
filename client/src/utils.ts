


import api from "@/lib/axiosClient";
import { Dispatch, SetStateAction } from 'react';

// Define a minimal shape for Axios-like errors
interface AppError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Type guard to check if error is AppError
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object'
  );
}

export const handleError = (
  error: unknown,
  setError: Dispatch<SetStateAction<string>>
) => {
  console.error('Failed to perform requested operation', error);

  if (isAppError(error) && error.response?.data?.message) {
    setError(error.response.data.message);
  } else {
    setError('An error occurred while creating the resource.');
  }
};
export const cleanText = (html: string, shouldTruncate?: boolean) => {
  // Create a temporary DOM element to parse and clean the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove all image elements completely
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => img.remove());

  // Remove <p> tags but keep their text content and line breaks
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    // Replace <p> with a line break and its text content
    const br = document.createElement('br');
    const textNode = document.createTextNode(p.textContent || '');
    const fragment = document.createDocumentFragment();
    fragment.appendChild(textNode);
    fragment.appendChild(br);
    
    p.parentNode?.replaceChild(fragment, p);
  });
  
  // Use innerText to get text with line breaks but without HTML tags
  let cleaned = tempDiv.innerText || tempDiv.textContent || '';
  
  // Clean up whitespace
  cleaned = cleaned.trim().replace(/\s+/g, ' ');
  
  // Limit length and add ellipsis if needed
  if (shouldTruncate) {
    cleaned = cleaned.substring(0, 150) + '...';
  }
  
  return cleaned;
};

export const uploadFile = async (
  file: File,
  type: 'thumbnail' | 'video' | 'image'
) => {
  const { cloudName } = (await api.get('/videos/upload/signature')).data;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'amafor');
  formData.append('folder', 'amafor');

  const resourceType = type === 'video' ? 'video' : 'image';
  const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });

  const data = await uploadRes.json();
  return data.url;
};