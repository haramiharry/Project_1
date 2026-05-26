"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3l10 10M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ManualModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function ManualModal({ onClose, children }: ManualModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  // One tick after mount so the opacity transition fires after the DOM node is painted.
  useEffect(() => {
    setVisible(true);
    closeButtonRef.current?.focus();
  }, []);

  // Escape key: close modal.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Body scroll lock: prevent background page scrolling while modal is open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Focus trap: Tab and Shift+Tab cycle within the panel only.
  useEffect(() => {
    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-900/60 flex items-start justify-center transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-modal-title"
        className="relative bg-white rounded-lg w-full max-w-3xl mx-4 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <h2 id="manual-modal-title" className="text-sm font-semibold text-slate-800">
            User Manual
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <XIcon />
          </button>
        </div>

        {/* Body: children render here */}
        <div className="px-6 py-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            ERP ROI Calculator v1.0&nbsp;&nbsp;|&nbsp;&nbsp;ro1calculator.netlify.app
          </p>
        </div>
      </div>
    </div>
  );
}
