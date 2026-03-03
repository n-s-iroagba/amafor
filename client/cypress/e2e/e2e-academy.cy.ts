/**
 * ============================================================
 * E2E TEST SUITE — ACADEMY (PUBLIC + ADMIN)
 * Journeys: UJ-ACA-001, UJ-ACA-002, UJ-ADM-005
 *
 * SERVER RESPONSE SHAPES:
 *   POST /trialists  → 201 { success, message, data: Trialist }
 *   GET  /trialists  → 200 { success, message, data: Trialist[], meta: { total, page, totalPages, limit } }
 *   GET  /trialists/:id → 200 { success, message, data: Trialist }
 *   PUT  /trialists/:id → 200 { success, message, data: Trialist }
 *   GET  /academy/sessions → 200 { success, data: Session[] }  (custom route)
 *   POST /academy/communications/send → 200 { success, data: { sent, channel } }
 *   GET  /academy-staff  → 200 { success, data: AcademyStaff[] }   ← FLAT array in data
 *   GET  /academy-staff/:id → 200 { success, data: AcademyStaff }
 *   POST /academy-staff  → 201 { success, data: AcademyStaff, message }
 *   PUT  /academy-staff/:id → 200 { success, data: AcademyStaff, message }
 *   DELETE /academy-staff/:id → 200 { success, message }
 *
 * Trialist fields: id, firstName, lastName, email, phone, dob, position,
 *   preferredFoot, height, weight, previousClub, videoUrl, cvUrl, status,
 *   notes, guardianName, guardianPhone, guardianEmail, consentEmail, consentSmsWhatsapp
 * Trialist status enum: 'APPLIED' | 'INVITED' | 'ATTENDED' | 'SIGNED' | 'REJECTED'
 * AcademyStaff fields: id, name, role, bio, initials, imageUrl, category,
 *   qualifications, yearsOfExperience
 * ============================================================
 */

const trialist = {
    id: 'tri_1',
    firstName: 'Emeka',
    lastName: 'Okoye',
    email: 'emeka@test.com',
    phone: '08012345678',
    dob: '2008-03-15',
    position: 'Midfielder',
    preferredFoot: 'Right',
    height: 172,
    weight: 65,
    previousClub: 'None',
    videoUrl: null,
    cvUrl: null,
    status: 'APPLIED',
    notes: '',
    guardianName: 'Mr Okoye',
    guardianPhone: '08012345679',
    guardianEmail: 'guardian@test.com',
    consentEmail: true,
    consentSmsWhatsapp: true,
};

const staffMember = {
    id: 'st1',
    name: 'Coach Nweze',
    role: 'Head Coach',
    bio: 'Experienced coach',
    initials: 'CN',
    imageUrl: '/coach.jpg',
    category: 'Coaching',
    qualifications: ['UEFA B', 'CAF C'],
    yearsOfExperience: 8,
};

// ─────────────────────────────────────────────────────────────
// UJ-ACA-001 — Submit Trial Application
// BR: BR-TP-06, BR-TP-07 | SRS: REQ-ACA-02, REQ-ACA-03
// Screens: SC-109, SC-110
// ─────────────────────────────────────────────────────────────
describe('UJ-ACA-001 — Submit Trial Application', () => {
    describe('Happy Path', () => {
        it('E2E-ACA-001-H01: Academy page publicly accessible; trial apply button visible', () => {
            cy.visit('/academy');
            cy.contains(/academy|trial|apply/i).should('be.visible');
            cy.get('[data-testid="apply-btn"]').should('be.visible');
        });

        it('E2E-ACA-001-H02: POST /trialists → 201 { success, message, data: Trialist } with status APPLIED', () => {
            cy.intercept('POST', '**/api/trialists*', {
                statusCode: 201,
                body: {
                    success: true,
                    message: 'Trialist created successfully',
                    data: trialist,
                },
            }).as('createTrialist');

            cy.visit('/academy/apply');
            cy.get('[data-testid="apply-name"]').type('Emeka Okoye');
            cy.get('[data-testid="apply-email"]').type('emeka@test.com');
            cy.get('input[type="checkbox"]').each(($el) => cy.wrap($el).check({ force: true }));
            cy.get('[data-testid="apply-btn"]').click();

            cy.wait('@createTrialist')
                .its('response.body.data.status').should('eq', 'APPLIED');
            cy.contains(/submitted|thank you|application received/i).should('be.visible');
        });

        it('E2E-ACA-001-H03: Video highlight file input present (BR-TP-07)', () => {
            cy.visit('/academy/apply');
            cy.get('input[type="file"]').should('exist');
        });
    });

    describe('Failure Path', () => {
        it('E2E-ACA-001-F01: Apply button disabled when required fields empty', () => {
            cy.visit('/academy/apply');
            cy.get('[data-testid="apply-btn"]').should('be.disabled');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ACA-002 — Trialist Notification & Attendance
// BR: BR-TP-08, BR-TP-10, BR-ADV-03, BR-ADV-05
// SRS: REQ-ACA-04..REQ-ACA-07 | Screens: SC-017, SC-018, SC-131, SC-132
// ─────────────────────────────────────────────────────────────
describe('UJ-ACA-002 — Trialist Notification & Attendance', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/auth/me*', {
            statusCode: 200,
            body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true },
        });
    });

    describe('Happy Path', () => {
        it('E2E-ACA-002-H01: GET /trialists → { success, message, data: Trialist[], meta } — search visible', () => {
            cy.intercept('GET', '**/api/trialists*', {
                statusCode: 200,
                body: {
                    success: true,
                    message: 'Trialists retrieved successfully',
                    data: [trialist],
                    meta: { total: 1, page: 1, totalPages: 1, limit: 20 },
                },
            }).as('getTrialists');

            cy.visit('/dashboard/admin/academy/trialist');
            cy.wait('@getTrialists');
            cy.get('[data-testid="input-search-trialists"]').should('be.visible');
            cy.contains(trialist.firstName).should('be.visible');
        });

        it('E2E-ACA-002-H02: Admin updates trialist — PUT /trialists/:id returns { success, message, data: Trialist }', () => {
            cy.intercept('GET', `/trialists/${trialist.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Trialist retrieved successfully', data: trialist },
            }).as('getTrialist');
            cy.intercept('PUT', `/trialists/${trialist.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Trialist updated successfully', data: { ...trialist, status: 'INVITED' } },
            }).as('updateTrialist');

            cy.visit(`/dashboard/admin/academy/trialist/${trialist.id}/edit`);
            cy.wait('@getTrialist');
            cy.get('[data-testid="btn-save-trialist"]').click();

            cy.wait('@updateTrialist').its('response.body.data.status').should('eq', 'INVITED');
        });

        it('E2E-ACA-002-H03: Academy Calendar — GET /academy/sessions returns sessions list', () => {
            cy.intercept('GET', '**/api/academy/sessions*', {
                statusCode: 200,
                body: { success: true, data: [{ id: 'sess_1', date: '2026-04-01', type: 'Trial Day' }] },
            }).as('getSessions');

            cy.visit('/dashboard/admin/academy/calendar');
            cy.wait('@getSessions');
            cy.contains(/trial day|training|calendar/i).should('be.visible');
        });

        it('E2E-ACA-002-H04: Communications Hub — POST /academy/communications/send returns { success, data: { sent, channel } }', () => {
            cy.intercept('GET', '**/api/academy/*', { statusCode: 200, body: { success: true, data: [] } });
            cy.intercept('POST', '**/api/academy/communications/send*', {
                statusCode: 200,
                body: { success: true, data: { sent: 0, channel: 'whatsapp' } },
            }).as('sendComm');

            cy.visit('/dashboard/admin/academy/communications');
            cy.contains(/whatsapp|email|sms/i).should('be.visible');

            cy.get('textarea').first().type('Please attend your trial on April 1st.');
            cy.contains('Send Message').click();

            cy.wait('@sendComm').its('response.body.data.channel').should('eq', 'whatsapp');
        });
    });

    describe('Authorization', () => {
        it('E2E-ACA-002-A01: Unauthenticated access to academy admin redirects to login', () => {
            cy.clearCookies().clearLocalStorage();
            cy.visit('/dashboard/admin/academy/trialist');
            cy.url().should('include', '/auth/login');
        });
    });
});

// ─────────────────────────────────────────────────────────────
// UJ-ADM-005 — Manage Academy Staff
// BR: BR-ADV-01, BR-ADV-02 | SRS: REQ-ACS-01, REQ-ACS-02
// Screens: SC-011, SC-014, SC-015, SC-016
// AcademyStaff list: { success, data: AcademyStaff[] }  (NOT { data: { data } })
// ─────────────────────────────────────────────────────────────
describe('UJ-ADM-005 — Manage Academy Staff', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/auth/me*', {
            body: { id: 'adm1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', emailVerified: true },
        });
    });

    describe('Happy Path', () => {
        it('E2E-ADM-005-H01: Staff list — GET /academy-staff returns { success, data: AcademyStaff[] }', () => {
            cy.intercept('GET', '**/api/academy-staff*', {
                statusCode: 200,
                body: { success: true, data: [staffMember] },
            }).as('getStaff');

            cy.visit('/dashboard/admin/academy/staff');
            cy.wait('@getStaff');
            cy.get('[data-testid="input-search-academy-staff"]').should('be.visible');
            cy.contains(staffMember.name).should('be.visible');
        });

        it('E2E-ADM-005-H02: Create staff — POST /academy-staff → 201 { success, data: AcademyStaff, message }', () => {
            cy.intercept('POST', '**/api/academy-staff*', {
                statusCode: 201,
                body: {
                    success: true,
                    data: { ...staffMember, id: 'st_new', name: 'Coach Amaka' },
                    message: 'Staff member created successfully',
                },
            }).as('createStaff');

            cy.visit('/dashboard/admin/academy/staff/new');
            cy.get('[data-testid="input-staff-name"]').type('Coach Amaka');
            cy.get('[data-testid="input-staff-role"]').type('Assistant Coach');
            cy.get('[data-testid="select-staff-category"]').select('Coaching');
            cy.get('[data-testid="btn-save-staff"]').click();

            cy.wait('@createStaff').its('request.body.name').should('eq', 'Coach Amaka');
        });

        it('E2E-ADM-005-H03: Edit staff — PUT /academy-staff/:id → 200 { success, data: AcademyStaff, message }', () => {
            cy.intercept('GET', `/academy-staff/${staffMember.id}*`, {
                statusCode: 200,
                body: { success: true, data: staffMember },
            }).as('getStaff1');
            cy.intercept('PUT', `/academy-staff/${staffMember.id}*`, {
                statusCode: 200,
                body: { success: true, data: { ...staffMember, name: 'Coach E. Nweze' }, message: 'Staff member updated successfully' },
            }).as('updateStaff');

            cy.visit(`/dashboard/admin/academy/staff/${staffMember.id}/edit`);
            cy.wait('@getStaff1');
            cy.get('[data-testid="input-staff-name"]').clear().type('Coach E. Nweze');
            cy.get('[data-testid="btn-save-staff"]').click();
            cy.wait('@updateStaff');
        });

        it('E2E-ADM-005-H04: Delete staff — DELETE /academy-staff/:id → 200 { success, message }', () => {
            cy.intercept('GET', `/academy-staff/${staffMember.id}*`, {
                body: { success: true, data: staffMember },
            });
            cy.intercept('DELETE', `/academy-staff/${staffMember.id}*`, {
                statusCode: 200,
                body: { success: true, message: 'Staff member deleted successfully' },
            }).as('deleteStaff');

            cy.visit(`/dashboard/admin/academy/staff/${staffMember.id}`);
            cy.get('[data-testid="btn-delete-staff"]').click();
            cy.get('[data-testid="btn-confirm-delete"]').click();
            cy.wait('@deleteStaff').its('response.body.message').should('include', 'deleted');
        });
    });
});
