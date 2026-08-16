"use client";

import React, { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WalletStatus =
  | "disconnected"
  | "connecting"
  | "verifying"
  | "verified"
  | "no-did";

interface WalletStatusIconProps {
  status: WalletStatus;
  /** Icon size in px. Default: 20 */
  size?: number;
  className?: string;
  onClick?: () => void;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  WalletStatus,
  { color: string; label: string; description: string; pulse: boolean }
> = {
  disconnected: {
    color: "#6B7280",
    label: "Disconnected",
    description: "Not connected to any wallet.",
    pulse: false,
  },
  connecting: {
    color: "#F59E0B",
    label: "Connecting",
    description: "Establishing connection with your wallet provider…",
    pulse: true,
  },
  verifying: {
    color: "#3B82F6",
    label: "Verifying",
    description: "Signing message and verifying identity with the backend…",
    pulse: true,
  },
  verified: {
    color: "#10B981",
    label: "Verified",
    description: "Wallet connected and session authenticated.",
    pulse: false,
  },
  "no-did": {
    color: "#EF4444",
    label: "Access Denied",
    description: "Wallet connected, but this address has no DID on record.",
    pulse: false,
  },
};

// ─── Prisma SVG icon (fill driven by `color` prop) ────────────────────────────

function PrismaIcon({
  color,
  size,
  isVerified,
}: {
  color: string;
  size: number;
  isVerified: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 105.83333 105.83333"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 59.5984,105.83331 94.704252,95.445365 A 216.99353,216.99353 0 0 0 91.17531,84.325877 216.99353,216.99353 0 0 0 85.739637,70.541616 216.99353,216.99353 0 0 0 79.375335,57.161097 216.99353,216.99353 0 0 0 72.11281,44.244885 216.99353,216.99353 0 0 0 63.987734,31.855563 216.99353,216.99353 0 0 0 55.034491,20.049968 216.99353,216.99353 0 0 0 45.296765,8.88306 216.99353,216.99353 0 0 0 36.413579,-2.814486e-7 L 11.12908,26.516552 a 180.36355,180.36355 0 0 1 7.796865,7.797158 180.36355,180.36355 0 0 1 8.798091,10.22307 180.36355,180.36355 0 0 1 8.009211,10.852253 180.36355,180.36355 0 0 1 7.175573,11.420821 180.36355,180.36355 0 0 1 6.303431,11.924966 180.36355,180.36355 0 0 1 5.394249,12.36281 180.36355,180.36355 0 0 1 4.45387,12.73048 180.36355,180.36355 0 0 1 0.537981,2.00522 z"
        fill="var(--x-wallet-shape-fill, #E5E7EB)"
      />
      <ellipse
        cx="74.144"
        cy="83.539"
        rx="9.147"
        ry="9.147"
        fill={color}
        className={isVerified ? "wallet-status-verified-orb" : undefined}
      />
    </svg>
  );
}

// ─── Tooltip (desktop) ────────────────────────────────────────────────────────

function Tooltip({
  label,
  description,
  color,
  children,
}: {
  label: string;
  description: string;
  color: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="wallet-status-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      {children}
      {visible && (
        <span
          className="wallet-status-tooltip"
          role="tooltip"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 220,
            background: "var(--x-tooltip-bg, #18181b)",
            border: `1px solid ${color}40`,
            borderRadius: 8,
            padding: "8px 12px",
            boxShadow: `0 4px 20px ${color}20`,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <span
              style={{
                color,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              {label}
            </span>
          </span>
          <span
            style={{
              color: "var(--x-tooltip-text, #a1a1aa)",
              fontSize: 12,
              lineHeight: 1.5,
              display: "block",
              fontFamily: "inherit",
            }}
          >
            {description}
          </span>
        </span>
      )}
    </span>
  );
}

// ─── Mobile modal ─────────────────────────────────────────────────────────────

function MobileModal({
  open,
  onClose,
  label,
  description,
  color,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  description: string;
  color: string;
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
        }}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wallet status"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "var(--x-tooltip-bg, #18181b)",
            border: `1px solid ${color}50`,
            borderRadius: 16,
            padding: "28px 24px",
            width: "100%",
            maxWidth: 320,
            boxShadow: `0 8px 40px ${color}25`,
            pointerEvents: "auto",
          }}
        >
          {/* Status dot + label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <span
              style={{
                color,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>
          <p
            style={{
              color: "var(--x-tooltip-text, #a1a1aa)",
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {description}
          </p>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: `1px solid ${color}40`,
              background: "transparent",
              color: "var(--x-tooltip-text, #a1a1aa)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Keyframes injected once ──────────────────────────────────────────────────

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes wallet-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }
    @keyframes wallet-verified-radiant {
      0%, 100% {
        opacity: 1;
        transform-box: fill-box;
        transform-origin: center;
        transform: scale(1);
        filter:
          drop-shadow(0 0 0 rgba(16, 185, 129, 0))
          drop-shadow(0 0 0 rgba(16, 185, 129, 0));
      }
      50% {
        opacity: 0.92;
        transform-box: fill-box;
        transform-origin: center;
        transform: scale(1.08);
        filter:
          drop-shadow(0 0 12px rgba(16, 185, 129, 0.85))
          drop-shadow(0 0 24px rgba(16, 185, 129, 0.7));
      }
    }
    .wallet-status-pulse {
      animation: wallet-pulse 1.6s ease-in-out infinite;
    }
    .wallet-status-verified-orb {
      animation: wallet-verified-radiant 1.8s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    .wallet-status-icon {
      transition: opacity 0.15s ease;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WalletStatusIcon({
  status,
  size = 20,
  className,
  onClick,
}: WalletStatusIconProps) {
  injectStyles();

  const config = STATUS_CONFIG[status];
  const [modalOpen, setModalOpen] = useState(false);

  // Detect coarse pointer (mobile/touch) to switch between tooltip and modal
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const icon = (
    <span
      className={[
        "wallet-status-icon",
        config.pulse ? "wallet-status-pulse" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`Wallet status: ${config.label}`}
      onClick={() => {
        if (isTouch) setModalOpen(true);
        onClick?.();
      }}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <PrismaIcon color={config.color} size={size} isVerified={status === "verified"} />
    </span>
  );

  if (isTouch) {
    return (
      <>
        {icon}
        <MobileModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          label={config.label}
          description={config.description}
          color={config.color}
        />
      </>
    );
  }

  return (
    <Tooltip label={config.label} description={config.description} color={config.color}>
      {icon}
    </Tooltip>
  );
}
