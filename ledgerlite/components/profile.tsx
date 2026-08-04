"use client";
import React from "react";
import ProfileClient from "@/components/profileClient";

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

interface ProfileClientProps {
  initialName: string;
  initialEmail: string;
  initialBuisnessName: string;
  initialImage: string;
  createdAt: string;
}

function PersonalProfileSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      {/* <ProfileClient
        initialName={initialName}
        initialEmail={initialEmail}
        initialBuisnessName={initialBuisnessName}
        initialImage={initialImage}
        createdAt={createdAt}
      /> */}
      <SectionHeading>Personal Profile</SectionHeading>
      <TextField
        label="Full Name"
        placeholder="eg. John Doe"
        value={fullName}
        onChange={setFullName}
      />
      <TextField
        label="Email"
        placeholder="eg. you@mail.com"
        type="email"
        value={email}
        onChange={setEmail}
      />
      <div className="max-w-lg space-y-3">
        <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
          Save Changes
        </button>
        <button className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:opacity-80 cursor-pointer ">
          Cancel
        </button>
      </div>
    </div>
  );
}

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

/* ---------------- Root ---------------- */

export default function LedgerLiteProfile() {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("personal");

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto flex max-w-6xl">
        <Sidebar active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 px-10 py-10">
          {activeSection === "personal" && <PersonalProfileSection />}
          {activeSection === "business" && <BusinessProfileSection />}
        </main>
      </div>
    </div>
  );
}
