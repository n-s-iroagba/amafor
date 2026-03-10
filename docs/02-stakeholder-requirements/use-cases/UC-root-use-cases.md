# Amafor Gladiators FC - System Use Cases

This document outlines the system use cases derived from the Amafor Gladiators Digital Ecosystem Business Requirements Document (BRD) and maps them to the existing application route structure (`client/src/app`).

## 1. Public Fans & Supporters
**Actor**: Fan (Unauthenticated User)

* **UC-FAN-01: Browse Public Content**: Browse club articles, featured news, and media highlights on the platform's public portal. *(BR-CE-01, BR-CE-08, BR-CE-09, BR-CE-10, BR-CE-11)*
* **UC-FAN-02: Monitor League & Fixtures**: Monitor real-time league standings, top performers, and the organized match calendar. *(BR-CE-02, BR-CE-03)*
* **UC-FAN-03: View Match Details**: Access detailed match data, including starting lineups and scoring events. *(BR-CE-07)*
* **UC-FAN-04: View Team & Player Profiles**: View comprehensive rosters and individual player performance profiles. *(BR-TM-06)*
* **UC-FAN-05: Share Content**: Share articles and match information via social integrations. *(BR-CE-04)*
* **UC-FAN-06: Commit to Patronage**: Register for and manage recurring or one-time patronage commitments. *(BR-PP-01, BR-PP-06)*
* **UC-FAN-07: Display Patron Recognition**: Display active patrons and supporters in a centralized recognition center. *(BR-PP-03, BR-PP-04)*
* **UC-FAN-08: Communicate with Club Staff**: Initiate direct communication with the club via integrated messaging widgets. *(BR-AO-02)*
* **UC-FAN-09: Access Legal & Compliance Information**: Access and review privacy policies, terms of service, and compliance documents. *(BR-DSR-01)*
* **UC-FAN-10: Execute Personal Data Requests**: Submit and process requests for personal data deletion or export. *(BR-DSR-01)*

## 2. Trialists & Guardians
**Actor**: Prospective Player / Parent / Guardian (Unauthenticated User)

* **UC-TRI-01: Apply for Academy Enrollment**: Submit a formal trialist application including personal details, guardian consent, and performance media. *(BR-TP-06, BR-TP-07, BR-AO-04)*
* **UC-TRI-02: Receive Application Updates**: Receive automated status updates across various communication channels regarding enrollment status. *(BR-TP-10)*
* **UC-TRI-03: Research Academy Philosophy**: Access the academy curriculum and philosophy documentation. *(BR-AO-01, BR-AO-03)*

## 3. Scouts
**Actor**: Authorized Scout (Pro View user)

* **UC-SCT-01: Register for Professional Access**: Submit registration for verified professional scout access. *(BR-TP-04)*
* **UC-SCT-02: Access Professional Scout Portal**: Authenticate and access the secure scout-specific dashboard. *(BR-TP-02)*
* **UC-SCT-03: Evaluate Player Talent**: Browse, filter, and analyze verified player profiles and performance statistics. *(BR-TP-01)*
* **UC-SCT-04: View Match Video Archives**: Review recorded match video streams for talent evaluation. *(BR-TP-02, BR-TP-05, BR-TP-14)*
* **UC-SCT-05: Record Performance Analysis**: Generate and record scouting reports based on match performance evaluations. *(BR-TP-13)*

## 4. Advertisers
**Actor**: External Business/Advertiser

* **UC-ADV-01: Register Advertising Business**: Submit business verification and corporate details for advertising access. *(BR-AD-01)*
* **UC-ADV-02: Orchestrate Advertising Campaigns**: Create, schedule, and fund advertising campaigns, including creative asset management. *(BR-AD-02)*
* **UC-ADV-03: Settle Advertising Fees**: Execute and record payments for advertising campaigns via electronic or manual methods. *(BR-AD-03, BR-AD-15)*
* **UC-ADV-04: Analyze Campaign Performance**: Access real-time analytics for ad delivery, engagement, and resource consumption. *(BR-AD-05, BR-AD-08)*
* **UC-ADV-05: Manage Advertising Disputes**: Initiate and track the resolution of disputes related to ad delivery. *(BR-AD-13)*

## 5. Academy Staff (Head, Coach, Admin)
**Actor**: Academy User (Admin Dashboard)

* **UC-ACA-01: Oversee Trialist Pipeline**: Review, filter, and progress trialist applications through the evaluation workflow. *(BR-TP-08, BR-ADV-02)*
* **UC-ACA-02: Transition Applicant to Player**: Promote verified trialists to full project roster status. *(BR-TP-09)*
* **UC-ACA-03: Plan Academy Operations**: Schedule evaluation sessions and manage trialist assignments. *(BR-ADV-04)*
* **UC-ACA-04: Monitor Academy Attendance**: Record and track the participation of academy attendees in training and matches. *(BR-ADV-03)*
* **UC-ACA-05: Facilitate Academy Communication**: Manage communications with guardians and applicants via the hub. *(BR-ADV-06)*
* **UC-ACA-06: Manage Coaching Roster**: Manage the profiles and assignments of formal coaching staff. *(BR-ADV-01)*

## 6. Media & Communications Team
**Actor**: CMS Administrator

* **UC-MED-01: Curate Club Content**: Draft and publish club-specific news, media, and featured articles. *(BR-CE-01)*
* **UC-MED-02: Manage Multimedia Assets**: Integrate and manage match highlights and club videos. *(BR-CE-01)*
* **UC-MED-03: Monitor Audience Engagement**: Analyze platform engagement metrics and content reach. *(BR-CE-05)*

## 7. Sports Administrator / Data Steward
**Actor**: Sports Admin

* **UC-SPT-01: Manage Fixtures & Outcomes**: Update match organized schedules and record competition results. *(BR-CE-03)*
* **UC-SPT-02: Document Match Events**: Record match-specific data including lineups, scoring incidents, and summaries. *(BR-CE-07)*
* **UC-SPT-03: Maintain Performance Statistics**: Maintain global and league-specific performance metrics and leaderboards. *(BR-CE-02)*

## 8. Commercial Manager / Finance
**Actor**: Commercial Manager / Finance Officer

* **UC-COM-01: Verify Business Partners**: Review and authorize external advertiser and business partner accounts. *(BR-AD-01)*
* **UC-COM-02: Authorize Manual Transactions**: Approve and activate campaigns based on physical payment verification. *(BR-AD-15)*
* **UC-COM-03: Control Advertising Rates**: Configure and adjust the economic parameters of ad zone placements. *(BR-AD-11)*
* **UC-COM-04: Oversee Dispute Resolution**: Direct the investigation and resolution of partner disputes. *(BR-AD-13)*
* **UC-COM-05: Authorize Professional Scout Access**: Approve and manage verified scout credentials. *(BR-TP-04)*
* **UC-COM-06: Monitor Revenue Subscriptions**: Oversee active patronage and recurring revenue subscriptions. *(BR-PP-01)*

## 9. IT / Security Lead & System Admin
**Actor**: Super Administrator

* **UC-SYS-01: Govern User Identities**: Create, manage, and authorize system user identities and role assignments. *(BR-TP-04 snippet)*
* **UC-SYS-02: Oversight of System Operations**: Audit critical system actions and monitor specialized health metrics.
* **UC-SYS-03: Manage System Configuration**: Orchestrate global settings, data protection policies, and backup schedules.
* **UC-SYS-04: Orchestrate System Communications**: Configure and send automated administrative alerts and system notifications.

## 10. Team Management
**Actor**: Team Administrator (can be generalized under Sports Admin/Head Coach)

* **UC-TEA-01: Orchestrate Team Data**: Create, maintain, and manage the lifecycle of team entities. *(BR-TM-01, BR-TM-08)*
* **UC-TEA-02: Govern Player Rotations**: Assign and transfer players across team rosters. *(BR-TM-02, BR-TM-03, BR-TM-04)*
* **UC-TEA-03: Assign Team Leadership**: Designate and manage team captains. *(BR-TM-07)*
* **UC-TEA-04: Maintain Historical Rosters**: Ensure full traceability of player and team lineage. *(BR-TM-09)*

## 11. System Observability & Monitoring
**Actor**: IT / Security Lead & System Admin

* **UC-OBS-01: Monitor System Latencies**: Track and report on digital platform response times relative to SLAs.
* **UC-OBS-02: Monitor System Reliability**: Monitor exception rates and the integrity of third-party service abstractions.
* **UC-OBS-03: Governance of Audit Records**: Ensure immutable records of high-privilege system and business actions are maintained.
* **UC-OBS-04: Monitor Infrastructure Capacity**: Track resource consumption against platform capacity thresholds.
* **UC-OBS-05: Monitor Strategic Business Metrics**: Track conversion events and business outcomes relative to established targets.
