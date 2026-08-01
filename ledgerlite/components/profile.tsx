 "use client"
import React, {  } from "react";
import {
  CheckSquare,
  Bell,
  Building2,
  Search,
  ChevronDown,
} from "lucide-react";

import { useState, useRef } from "react";
import {
  Camera,
  User,
  Mail,
  Building,
  Calendar,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

/**
 * LedgerLite - Profile Module
 * Sidebar sections: Personal Profile, Business Profile
 */

type ProfileSection = "personal" | "business";

const NAV_ITEMS: {
  id: ProfileSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "personal",
    label: "Personal Profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "business",
    label: "Business Profile",
    icon: <Building2 className="h-4 w-4" />,
  },
];

const BUSINESS_TYPES = [
  "Retail / Shop",
  "Restaurant / Food Vendor",
  "Fashion & Apparel",
  "Grocery / Market Stall",
  "Services",
  "Wholesale / Distribution",
  "Other",
];



function Sidebar({
  active,
  onSelect,
}: {
  active: ProfileSection;
  onSelect: (s: ProfileSection) => void;
}) {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-100 bg-white px-6 py-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Profile</h2>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? "font-medium text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <span className="absolute -left-6 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-teal-600" />
              )}
              <span className={isActive ? "text-teal-600" : "text-slate-400"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-8 text-2xl font-bold text-slate-900">{children}</h1>;
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="mb-6 max-w-lg">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mb-8 flex w-full max-w-lg items-center justify-between">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${
          checked ? "bg-teal-600" : "bg-slate-200"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "-translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ---------------- Sections ---------------- */

// function PersonalProfileSection() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");

//   return (
//     <div>
//       <SectionHeading>Personal Profile</SectionHeading>
//       <TextField
//         label="Full Name"
//         placeholder="eg. John Doe"
//         value={fullName}
//         onChange={setFullName}
//       />
//       <TextField
//         label="Email"
//         placeholder="eg. you@mail.com"
//         type="email"
//         value={email}
//         onChange={setEmail}
//       />
//       <div className="max-w-lg space-y-3">
//         <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
//           Save Changes
//         </button>
//         <button className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:opacity-80 cursor-pointer ">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

function BusinessProfileSection() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const [inventoryEnabled, setInventoryEnabled] = useState(true);

  const filteredTypes = BUSINESS_TYPES.filter((t) =>
    t.toLowerCase().includes(typeQuery.toLowerCase()),
  );

  return (
    <div>
      <SectionHeading>Business Profile</SectionHeading>

      <TextField
        label="Business Name"
        placeholder="eg. LedgerLite"
        value={businessName}
        onChange={setBusinessName}
      />

      <div className="relative mb-8 max-w-lg">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Business Type
        </label>
        <button
          type="button"
          onClick={() => setTypeOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <span
            className={`flex-1 text-sm ${businessType ? "text-slate-800" : "text-slate-400"}`}
          >
            {businessType || "Select Business Type"}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              typeOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {typeOpen && (
          <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredTypes.length === 0 && (
                <li className="px-4 py-2 text-sm text-slate-400">No matches</li>
              )}
              {filteredTypes.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => {
                      setBusinessType(t);
                      setTypeOpen(false);
                      setTypeQuery("");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ToggleRow
        label="Enable Inventory"
        checked={inventoryEnabled}
        onChange={setInventoryEnabled}
      />

      <div className="max-w-lg space-y-3">
        <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
          Save Changes
        </button>
        <button className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer hover:opacity-80">
          Cancel
        </button>
      </div>
    </div>
  );
}

// Testing Application
interface ProfileClientProps {
  initialName: string;
  initialEmail: string;
  initialBuisnessName: string;
  initialImage: string;
  createdAt: string;
}

 function ProfileClient({
  initialName,
  initialEmail,
  initialBuisnessName,
  initialImage,
  createdAt,
}: ProfileClientProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialName);
  const [buisnessName, setBuisnessName] = useState(initialBuisnessName);
  const [image, setImage] = useState(initialImage || "");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format Date
  const joinDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle Profile Photo Upload
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size check: 1.5MB max to protect DB payload limits
    if (file.size > 1.5 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 1.5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  }

  // Handle Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/protected/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          buisnessName,
          image,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Profile updated successfully!");

        // Dispatch custom event to dynamically update the avatar in UserNav without reload
        const event = new CustomEvent("profile-avatar-update", {
          detail: image,
        });
        window.dispatchEvent(event);
      } else {
        setErrorMessage(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMessage("Network error: Could not save profile changes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* <LedgerLiteProfile /> */}
      <div className="mx-auto max-w-2xl border border-slate-200 bg-white p-8 rounded-4xl shadow-sm">
        <div className="border-b border-slate-100 pb-6 mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900">
            Profile Settings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal details, business name, and profile
            credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Avatar Selection */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
            {/* Profile Image Display */}

            <div className="relative group h-28 w-28 overflow-hidden rounded-full border-2 border-[#0b7a75] bg-slate-50 flex items-center justify-center shadow-md">
              {image ? (
                <Image
                  src={image}
                  alt="User avatar"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                  <User className="w-15 h-15  text-white" />
                </div>
              )}

              {/* Hover Camera Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer"
                title="Change profile picture"
              >
                <Camera size={20} />
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
                  Upload
                </span>
              </button>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-800">
                Profile Picture
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Supports JPEG, PNG or WEBP formats. Maximum file size of 1.5MB.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
              >
                <Camera size={12} />
                Choose File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-2xl bg-[#edf7f6] p-4 text-sm font-medium text-[#0b7a75]">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Form Inputs */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#6DAFAC]/15"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bizName"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Business Name
              </label>
              <div className="relative">
                <Building
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="bizName"
                  type="text"
                  required
                  value={buisnessName}
                  onChange={(e) => setBuisnessName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#6DAFAC]/15"
                  placeholder="Enter business name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  disabled
                  value={initialEmail}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-500 shadow-sm outline-none cursor-not-allowed"
                  title="Email cannot be changed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Date Joined
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  disabled
                  value={joinDate}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-500 shadow-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b7a75] text-white hover:bg-[#09615e] px-6 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


/* ---------------- Root ---------------- */

export default function LedgerLiteProfile() {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("personal");

  

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto flex max-w-6xl">
        <Sidebar active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 px-10 py-10">
          {activeSection === "personal" && (<ProfileClient initialName="" initialEmail="" initialBuisnessName="" initialImage="" createdAt=""/>)}
          {activeSection === "business" && <BusinessProfileSection />}
        </main>
      </div>
    </div>
  );
}
