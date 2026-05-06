"use client";

import dynamic from "next/dynamic";

const HaroldTerminal = dynamic(
  () => import("@/components/HaroldTerminal"),
  { ssr: false }
);

export default function Home() {
  return <HaroldTerminal />;
}
