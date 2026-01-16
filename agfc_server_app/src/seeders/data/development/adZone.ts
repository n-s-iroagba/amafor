// data/development/ad-zone.ts

import { AdZone } from "../../../models/AdCampaign";
import { AdZoneAttributes, AdZoneType, AdZoneStatus } from "../../../models/AdZones";


export const developmentAdZones: AdZoneAttributes[] = [
  {
    id: '10101010-1010-1010-1010-101010101010',
    name: 'Home Top Banner',
    zone: AdZone.TOP_PAGE_BANNER,
    description: 'Prime real estate at the very top of the homepage.',
    pricePerView: 500, // 5 Naira (500 kobo)
    type: AdZoneType.BANNER,
    dimensions: '728x90',
    maxAds: 3,
    status: AdZoneStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '20202020-2020-2020-2020-202020202020',
    name: 'General Sidebar',
    zone: AdZone.SIDEBAR,
    description: 'Standard square ad displayed on the right sidebar of news articles.',
    pricePerView: 250, // 2.50 Naira
    type: AdZoneType.SIDEBAR,
    dimensions: '300x250',
    maxAds: 5,
    status: AdZoneStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '30303030-3030-3030-3030-303030303030',
    name: 'In-Article Break',
    zone: AdZone.MID_ARTICLE,
    description: 'High engagement placement in the middle of long-form content.',
    pricePerView: 300, // 3 Naira
    type: AdZoneType.INLINE,
    dimensions: '728x90',
    maxAds: 2,
    status: AdZoneStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];