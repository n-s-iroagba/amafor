
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