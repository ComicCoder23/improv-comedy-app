"use client";

import { useEffect, useState } from "react";
import MobileTerminal from "@/components/MobileTerminal";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ background: "#0A0A00", height: "100vh" }} />;
  return <MobileTerminal />;
}
