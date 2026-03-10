"use client";

import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import Link from "next/link";
import { Target, BookOpen, Users, TrendingUp, Loader2 } from "lucide-react";
import { AcademyStaff } from "@/features/academy/types";
import { useGet } from "@/shared/hooks/useApiQuery";
import { API_ROUTES } from "@/config/routes";
import { PaginatedData } from "@/shared/types/common";
import AdDisplay from "@/features/advertisement/component/AdDisplay";

/**
 * Academy Hub
 * 
 * Public landing page for the youth academy, showcasing philosophy, 
 * curriculum, eligibility, and professional staff profiles.
 * 
 * @screen SC-002
 * @implements REQ-ACA-01, REQ-ACS-01
 * @usecase UC-TRI-03 (Academy Information), UC-ACA-06 (Manage Coaches)
 * @requires SRS-I-001 (Academy Staff API - GET /academy/staff)
 * @performance NFR-PERF-01
 * @observability SRS-OBS-005 Track academy info engagement and application intent
 */
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function AcademyContent() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "overview";

  // Fetch staff data when staff section is active
  const {
    data: staffResponse,
    loading: staffLoading,
    error: staffError,
    refetch: refetchStaff,
  } = useGet<PaginatedData<AcademyStaff>>(
    activeSection === "staff" ? API_ROUTES.STAFF.LIST : null,
    {
      params: {
        category: "coaching", // Optional: filter by category
        limit: 10,
      },
      enabled: activeSection === "staff", // Only fetch when staff section is active
    },
  );

  const staffData = staffResponse?.data;

  const sections = [
    { id: "/academy", name: "Overview", icon: Target },
    { id: "/academy?section=staff", name: "Staff", icon: Users },
    { id: "/academy/apply", name: "Apply", icon: TrendingUp },
  ];

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Header />

      <main className="py-16 bg-sky-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl mb-8 font-heading">
            Youth Academy
          </h1>

          {/* Sub-Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <Link
                  key={sec.id}
                  href={`${sec.id}`}
                  className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeSection === sec.id
                    ? "bg-sky-700 text-white font-medium"
                    : "bg-white text-sky-700 hover:bg-sky-100"
                    }`}
                  aria-current={activeSection === sec.id ? "page" : undefined}
                  data-testid={`nav-item-${sec.name.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  {sec.name}
                </Link>
              );
            })}
          </div>

          {/* Native inline ad — sits between sub-nav and main content card */}
          <AdDisplay identifier="NATIVE" className="mb-8" showLabel={true} />

          {/* Content */}
          <div className="bg-white rounded-lg shadow-card p-8">
            {activeSection === "overview" && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Academy Overview</h2>
                {/* ... existing overview content ... */}
              </div>
            )}

            {activeSection === "philosophy" && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">Our Philosophy</h2>
                {/* ... existing philosophy content ... */}
              </div>
            )}

            {activeSection === "curriculum" && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">
                  Training Curriculum
                </h2>
                {/* ... existing curriculum content ... */}
              </div>
            )}

            {activeSection === "staff" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-heading">Coaching Staff</h2>
                  <button
                    onClick={() => refetchStaff()}
                    className="px-4 py-2 text-sm bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors"
                    data-testid="btn-refresh-staff"
                  >
                    Refresh Staff
                  </button>
                </div>

                {staffLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-sky-700 animate-spin mb-4" />
                    <p className="text-sky-600">Loading staff members...</p>
                  </div>
                )}

                {staffError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">
                      Error loading staff: {staffError}
                    </p>
                    <button
                      onClick={() => refetchStaff()}
                      className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                      data-testid="btn-retry-staff"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!staffLoading && !staffError && staffData && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffData.length > 0 ? (
                      staffData.map((staff) => (
                        <div
                          key={staff.id}
                          className="bg-sky-50 p-6 rounded-lg shadow-card hover:shadow-lg transition-shadow"
                          data-testid={`staff-card-${staff.id}`}
                        >
                          <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                            {staff.initials || getInitials(staff.name)}
                          </div>
                          <h3 className="text-xl mb-2 text-center font-heading">
                            {staff.name}
                          </h3>
                          <p className="text-sky-700 text-center mb-3 font-medium">
                            {staff.role}
                          </p>
                          {staff.qualifications && (
                            <div className="flex flex-wrap justify-center gap-2 mb-3">
                              {staff.qualifications.map((qual, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full"
                                >
                                  {qual}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-sky-600 text-center">
                            {staff.bio}
                          </p>
                          {staff.yearsOfExperience && (
                            <p className="text-xs text-sky-500 text-center mt-3">
                              {staff.yearsOfExperience}+ years experience
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Users className="w-12 h-12 text-sky-300 mx-auto mb-4" />
                        <p className="text-sky-500">No staff members found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Fallback to hardcoded data if API not ready */}
                {!staffLoading && !staffError && !staffData && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Keep your existing hardcoded staff as fallback */}
                    <div className="bg-sky-50 p-6 rounded-lg shadow-card">
                      <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                        SA
                      </div>
                      <h3 className="text-xl mb-2 text-center font-heading">
                        Samuel Adeleke
                      </h3>
                      <p className="text-sky-700 text-center mb-3 font-medium">
                        Academy Director
                      </p>
                      <p className="text-sm text-sky-600 text-center">F.</p>
                    </div>
                    {/* ... other hardcoded staff cards ... */}
                  </div>
                )}
              </div>
            )}

            {activeSection === "pathway" && (
              <div>
                <h2 className="text-3xl mb-6 font-heading">
                  Player Pathway to Success
                </h2>
                {/* ... existing pathway content ... */}
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-12 pt-8 border-t border-sky-200">
              <h3 className="text-2xl mb-4 font-heading">
                Interested in Joining Our Academy?
              </h3>
              <p className="text-sky-700 mb-6">
                Contact us to learn more about trial dates and enrollment
                information.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/help"
                  className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  data-testid="link-contact-us"
                >
                  Contact Us
                </Link>
                <button
                  onClick={() => {
                    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
                    const message = encodeURIComponent(
                      "Hello, I'm interested in joining the Amafor Gladiators FC Academy...",
                    );
                    if (!phoneNumber) return;
                    window.open(
                      `https://wa.me/${phoneNumber}?text=${message}`,
                      "_blank",
                    );
                  }}
                  className="border border-sky-700 text-sky-700 hover:bg-sky-50 px-6 py-3 rounded-lg transition-colors font-medium"
                  data-testid="btn-whatsapp"
                >
                  WhatsApp Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function AcademyHub() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sky-50">
          <Loader2 className="w-10 h-10 text-sky-700 animate-spin" />
        </div>
      }
    >
      <AcademyContent />
    </Suspense>
  );
}
