"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { QualityProvider } from "@/lib/quality";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* reducedMotion="user" disables Motion animations system-wide
          when the OS asks for reduced motion */}
      <MotionConfig reducedMotion="user">
        {/* Detects device capability and scales effects up/down per device */}
        <QualityProvider>{children}</QualityProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
