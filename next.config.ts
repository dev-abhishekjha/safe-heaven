import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server be reached from the LAN for phone testing.
  // Development only — no effect on a production build.
  allowedDevOrigins: ["192.168.31.247"],

  images: {
    // Uploads are served from Supabase Storage, so next/image has to be told
    // which hosts are allowed. Supabase serves the S3 protocol from
    // <ref>.storage.supabase.co and public object URLs from <ref>.supabase.co —
    // two different hostnames for the same files, so both are listed. The S3
    // one is derived from the env var; the public one from the same ref.
    remotePatterns: process.env.S3_ENDPOINT
      ? (() => {
          const s3Host = new URL(process.env.S3_ENDPOINT).hostname;
          const publicHost = s3Host.replace(".storage.supabase.co", ".supabase.co");
          return [...new Set([s3Host, publicHost])].map((hostname) => ({
            protocol: "https" as const,
            hostname,
          }));
        })()
      : [],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
