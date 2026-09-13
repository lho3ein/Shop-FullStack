"use client";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

interface ScriptProps {
  /** کانتینر head — فقط در صورت وجود NEXT_PUBLIC_GTM_ID اسکریپت می‌دهد */
  nonce?: string;
  strategy?: "afterInteractive";
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/** اسکریپت main GTM — در <head> (لایوت ریشه) */
export function GoogleTagManagerScript({ nonce }: ScriptProps) {
  if (!GTM_ID) return null;

  return (
    <script
      nonce={nonce}
      async
      src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
    />
  );
}

/** اگر NEXT_PUBLIC_GTM_ID نباشد، هیچ چیزی رندر نمی‌شود */
export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
