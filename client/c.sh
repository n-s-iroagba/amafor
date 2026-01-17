./src/app/dashboard/admin/advertisers/[id]/page.tsx:4:1
Module not found: Can't resolve 'react-router-dom'
  2 | import React, { useState } from 'react';
  3 | import { ArrowLeft, CheckCircle, XCircle, ShieldAlert, Briefcase, ExternalLink, BadgeCheck, FileText, Globe, Loader2 } from 'lucide-react';
> 4 | import { Link, useParams, useNavigate } from 'react-router-dom';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 |
  6 | export default function AdvertiserReviewDetail() {
  7 |   const { id } = useParams();



Import traces:
  Client Component Browser:
    ./src/app/dashboard/admin/advertisers/[id]/page.tsx [Client Component Browser]
    ./src/app/dashboard/admin/advertisers/[id]/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/dashboard/admin/advertisers/[id]/page.tsx [Client Component SSR]
    ./src/app/dashboard/admin/advertisers/[id]/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


./src/app/dashboard/admin/health/page.tsx:4:1
Module not found: Can't resolve 'react-router-dom'
  2 | import React, { useState } from 'react';
  3 | import { Activity, Zap, Cpu, HardDrive, RefreshCw, ArrowLeft, ShieldCheck, Globe, Database, Server, Mail, Play, Lock, Loader2 } from 'lucide-react';
> 4 | import { Link } from 'react-router-dom';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 |
  6 | export default function InfrastructureHealthPage() {
  7 |   const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);



Import traces:
  Client Component Browser:
    ./src/app/dashboard/admin/health/page.tsx [Client Component Browser]
    ./src/app/dashboard/admin/health/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/dashboard/admin/health/page.tsx [Client Component SSR]
    ./src/app/dashboard/admin/health/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


./src/app/dashboard/admin/scouts/[id]/page.tsx:5:1
Module not found: Can't resolve 'react-router-dom'
  3 | import React, { useState } from 'react';
  4 | import { ArrowLeft, CheckCircle, XCircle, ShieldAlert, Globe, ExternalLink, UserCheck, FileText, ChevronRight, Loader2 } from 'lucide-react';
> 5 | import { Link, useParams, useNavigate } from 'react-router-dom';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  6 |
  7 | export default function ScoutApplicationDetail() {
  8 |   const { id } = useParams();



Import traces:
  Client Component Browser:
    ./src/app/dashboard/admin/scouts/[id]/page.tsx [Client Component Browser]
    ./src/app/dashboard/admin/scouts/[id]/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/dashboard/admin/scouts/[id]/page.tsx [Client Component SSR]
    ./src/app/dashboard/admin/scouts/[id]/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


./src/app/dashboard/admin/users/[id]/page.tsx:5:1
Module not found: Can't resolve 'react-router-dom'
  3 | import React, { useState } from 'react';
  4 | import { User, Shield, Lock, ArrowLeft, Save, Mail, Trash2, ShieldAlert, Key, Loader2, CheckCircle } from 'lucide-react';
> 5 | import { Link, useParams, useNavigate } from 'react-router-dom';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  6 |
  7 | export default function UserPermissionPage() {
  8 |   const { id } = useParams();



Import traces:
  Client Component Browser:
    ./src/app/dashboard/admin/users/[id]/page.tsx [Client Component Browser]
    ./src/app/dashboard/admin/users/[id]/page.tsx [Server Component]

  Client Component SSR:
    ./src/app/dashboard/admin/users/[id]/page.tsx [Client Component SSR]
    ./src/app/dashboard/admin/users/[id]/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


./src/app/dashboard/advertiser/campaigns/[id]/page.tsx:4:1
Module not found: Can't resolve 'react-router-dom'
  2 | import React, { useState } from 'react';
  3 | import { ArrowLeft, Megaphone, Play, Pause, BarChart3, TrendingUp, Users, MousePointer2, Download, ShieldCheck, Target, Loader2, CheckCircle } from 'lucide-react';
> 4 | import { Link, useParams } from 'react-router-dom';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 |
  6 | export default function CampaignDetailPage() {
  7 |   const { id } = useParams();