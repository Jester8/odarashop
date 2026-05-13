"use client";

import { useEffect, useState } from "react";
import MobileNav from "@/components/ui/MobileNav";

export default function ClientMobileNav() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-16 md:hidden" />;
  }

  return <MobileNav />;
}