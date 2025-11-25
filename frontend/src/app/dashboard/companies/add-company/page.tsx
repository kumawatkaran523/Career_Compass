"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Building2, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom Dropdown Component 
function CustomDropdown({ options, value, onChange, placeholder = 'Select option' }: {
  options: string[],
  value: string,
  onChange: (val: string) => void,
  placeholder?: string
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const dropdownMaxHeight = 288;
    const padding = 16;
    const gap = 8;

    let top: number;
    let maxHeight: number;

    if (spaceBelow < 150 && spaceAbove > spaceBelow) {
      maxHeight = Math.min(dropdownMaxHeight, spaceAbove - padding - gap);
      top = rect.top + window.scrollY - maxHeight - gap;
    } else {
      maxHeight = Math.min(dropdownMaxHeight, spaceBelow - padding - gap);
      top = rect.bottom + window.scrollY + gap;
    }

    maxHeight = Math.max(maxHeight, 150);

    let left = rect.left + window.scrollX;
    const dropdownWidth = rect.width;

    if (left + dropdownWidth > viewportWidth - padding) {
      left = Math.max(padding, rect.right + window.scrollX - dropdownWidth);
    }

    if (left < padding) {
      left = padding;
    }

    setPosition({
      top,
      left,
      width: dropdownWidth,
      maxHeight,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    calculatePosition();

    const handleScrollResize = () => {
      calculatePosition();
    };

    window.addEventListener('scroll', handleScrollResize, true);
    window.addEventListener('resize', handleScrollResize);

    return () => {
      window.removeEventListener('scroll', handleScrollResize, true);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [open, calculatePosition]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      >
        <span className={value ? 'text-white' : 'text-white/40'}>
          {value || placeholder}
        </span>
        <svg className="w-4 h-4 text-white/70 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            maxHeight: `${position.maxHeight}px`,
          }}
          className="z-[9999] bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-y-auto"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white transition-colors ${opt === value ? 'font-semibold bg-white/5 text-white' : ''
                }`}
            >
              {opt}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

const INDUSTRIES = [
  'IT Services',
  'Product Development',
  'Consulting',
  'Finance & Banking',
  'E-commerce',
  'Healthcare',
  'Manufacturing',
  'Analytics & Data Science',
  'Cloud & Infrastructure',
  'Cybersecurity',
  'EdTech',
  'FinTech',
];

const EMPLOYEE_COUNTS = [
  '1-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10000+',
];

export default function AddCompanyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    headquarters: '',
    employeeCount: '',
    logo: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Company name must be at least 2 characters';
    }

    if (!formData.description.trim() || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.headquarters.trim()) {
      newErrors.headquarters = 'Headquarters location is required';
    }

    if (!formData.employeeCount) {
      newErrors.employeeCount = 'Please select employee count range';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (formData.logo && !formData.logo.match(/^https?:\/\/.+/)) {
      newErrors.logo = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          website: formData.website || undefined,
          logo: formData.logo || undefined,
          headquarters: formData.headquarters,
          employeeCount: formData.employeeCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create company');
      }

      const data = await response.json();
      console.log('Company created:', data);

      router.push('/dashboard/companies');
    } catch (error) {
      console.error('Error submitting company:', error);
      alert('Failed to add company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/companies"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies
          </Link>

          <h1 className="text-3xl font-bold mb-2">Add Company</h1>
          <p className="text-white/60">
            Share information about a company that visited your college for placements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-white/40"
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-white placeholder:text-white/40"
                  placeholder="Brief description of the company, what they do, and their culture..."
                />
                <div className="mt-1 flex justify-between text-sm">
                  <div>
                    {errors.description && (
                      <p className="text-red-400">{errors.description}</p>
                    )}
                  </div>
                  <p className={`${formData.description.length < 50 ? 'text-white/40' :
                      formData.description.length > 500 ? 'text-red-400' :
                        'text-green-400'
                    }`}>
                    {formData.description.length}/500
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry/Domain <span className="text-red-400">*</span>
                </label>
                <CustomDropdown
                  options={INDUSTRIES}
                  value={formData.industry}
                  onChange={(val) => handleInputChange('industry', val)}
                  placeholder="Select industry"
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-white/40"
                    placeholder="https://company.com"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-400">{errors.website}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-white/40"
                    placeholder="https://..."
                  />
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-400">{errors.logo}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Headquarters <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.headquarters}
                    onChange={(e) => handleInputChange('headquarters', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-white placeholder:text-white/40"
                    placeholder="e.g., Mumbai, India"
                  />
                  {errors.headquarters && (
                    <p className="mt-1 text-sm text-red-400">{errors.headquarters}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Employee Count <span className="text-red-400">*</span>
                  </label>
                  <CustomDropdown
                    options={EMPLOYEE_COUNTS}
                    value={formData.employeeCount}
                    onChange={(val) => handleInputChange('employeeCount', val)}
                    placeholder="Select range"
                  />
                  {errors.employeeCount && (
                    <p className="mt-1 text-sm text-red-400">{errors.employeeCount}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/dashboard/companies"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all border border-white/10"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary hover:bg-primary-600 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  Add Company
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
