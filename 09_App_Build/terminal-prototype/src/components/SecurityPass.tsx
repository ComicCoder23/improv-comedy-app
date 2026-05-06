"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

type Props = {
  rp: number;
  level: string;
  onClose: () => void;
};

const AMBER = "#FFB300";
const AMBER_DIM = "#996800";
const BLACK = "#0A0A00";
const RED = "#FF2222";

export default function SecurityPass({ rp, level, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [backstageUrl, setBackstageUrl] = useState("https://scene-map.vercel.app/backstage");

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    setBackstageUrl(`${window.location.origin}/backstage`);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        background: "rgba(0,0,0,0.92)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Pass card */}
      <div
        className="relative max-w-sm w-full font-mono"
        style={{
          background: BLACK,
          border: `2px solid ${AMBER}`,
          boxShadow: `0 0 40px ${AMBER}33, inset 0 0 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Top stripe */}
        <div
          className="w-full py-1 text-center text-xs tracking-widest"
          style={{ background: AMBER, color: BLACK, letterSpacing: "0.3em" }}
        >
          ▌ AUTHORISED ACCESS ONLY ▐
        </div>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="text-xs tracking-widest" style={{ color: AMBER_DIM }}>
              CENTRAL SCOTLAND IMPROV SCENE MAP
            </div>
            <div
              className="text-xl font-bold tracking-wide"
              style={{ color: AMBER }}
            >
              FOUNDING MEMBER
            </div>
            <div
              className="text-sm tracking-widest border-t border-b py-1"
              style={{ color: AMBER, borderColor: AMBER_DIM }}
            >
              SECURITY PASS
            </div>
          </div>

          {/* Status badges */}
          <div className="grid grid-cols-2 gap-2 text-xs text-center">
            <div
              className="py-2 px-1"
              style={{ border: `1px solid ${AMBER_DIM}` }}
            >
              <div style={{ color: AMBER_DIM }}>STATUS</div>
              <div style={{ color: AMBER }} className="font-bold">
                {level}
              </div>
            </div>
            <div
              className="py-2 px-1"
              style={{ border: `1px solid ${AMBER_DIM}` }}
            >
              <div style={{ color: AMBER_DIM }}>REP POINTS</div>
              <div style={{ color: AMBER }} className="font-bold">
                {rp} RP
              </div>
            </div>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="p-3"
              style={{ background: "#111100", border: `1px solid ${AMBER_DIM}` }}
            >
              <QRCode
                value={backstageUrl}
                size={120}
                bgColor="#111100"
                fgColor={AMBER}
                level="M"
              />
            </div>
            <div
              className="text-xs text-center leading-tight"
              style={{ color: AMBER_DIM }}
            >
              SCAN FOR BACKSTAGE ACCESS
              <br />
              <span style={{ color: AMBER }}>Do not share widely.</span>
            </div>
          </div>

          {/* Stamp */}
          <div
            className="text-center py-2 text-xs space-y-1"
            style={{
              border: `1px solid ${RED}`,
              color: RED,
              opacity: 0.85,
            }}
          >
            <div className="text-base font-bold tracking-widest">✦ APPROVED ✦</div>
            <div className="tracking-wider">THE STAGE MANAGER</div>
            <div style={{ color: AMBER_DIM }}>CENTRAL SCOTLAND SCENE MAP — PILOT 2026</div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs" style={{ color: AMBER_DIM }}>
            Screenshot this. Share it.
            <br />
            <span style={{ color: AMBER }}>Say nothing about who sent you.</span>
          </div>
        </div>

        {/* Bottom stripe */}
        <div
          className="w-full py-1 text-center text-xs"
          style={{ background: AMBER_DIM, color: BLACK, letterSpacing: "0.2em" }}
        >
          ████ SCENE-MAP-PILOT-2026 ████
        </div>

        {/* Dismiss */}
        <button
          onClick={onClose}
          className="absolute top-8 right-3 text-xs opacity-40 hover:opacity-100 transition-opacity"
          style={{ color: AMBER }}
        >
          [✕]
        </button>
      </div>
    </div>
  );
}
