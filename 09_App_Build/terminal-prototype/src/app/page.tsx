"use client";

import dynamic from "next/dynamic";

const MobileTerminal = dynamic(
  () => import("@/components/MobileTerminal"),
  { ssr: false }
);

export default function Home() {
  return <MobileTerminal />;
}
