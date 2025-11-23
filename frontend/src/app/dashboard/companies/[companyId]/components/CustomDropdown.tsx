'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface CustomDropdownProps {
    options: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function CustomDropdown({ 
    options, 
    value, 
    onChange, 
    placeholder = 'Select option' 
}: CustomDropdownProps) {
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
        
        setPosition({ top, left, width: dropdownWidth, maxHeight });
    }, []);

    useEffect(() => {
        if (!open) return;

        calculatePosition();

        const handleScrollResize = () => calculatePosition();

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
                className="min-w-[200px] px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                            className={`w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white transition-colors ${
                                opt === value ? 'font-semibold bg-white/5 text-white' : ''
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
