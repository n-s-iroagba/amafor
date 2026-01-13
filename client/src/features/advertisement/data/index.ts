import { AdZone } from "../types";

export const adZones:AdZone[] = [

  {
    id: 'TP_BAN',
    name: 'Top Page Banner',
    dimensions: '970x250',
    maxSize: '2MB',
    description: 'Top of content pages across the site for maximum visibility'
  },
  {
    id: 'SIDEBAR',
    name: 'Sidebar',
    dimensions: '300x250',
    maxSize: '1MB',

    description: 'Persistent sidebar placement on content pages for sustained exposure'
  },
  {
    id: 'ART_FOOT',
    name: 'Article Footer',
    dimensions: '728x90',
    maxSize: '1.5MB',
  
    description: 'Banner at the bottom of article pages after content'
  },
  {
    id: 'MID_ART',
    name: 'Mid-Article Banner',
    dimensions: '640x360',
  
    maxSize: '2MB',

    description: 'Video ad embedded within article content after first 100 words (or at end if article <100 words)'
  }
];