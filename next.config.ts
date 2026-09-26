import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server be reached from the LAN for phone testing.
  // Development only — no effect on a production build.
  allowedDevOrigins: ["192.168.31.247"],

  images: {
    // Photos are linked straight from the storage bucket's public URL (see
    // src/payload/storageConfig.ts), so next/image has to be told that host is
    // allowed. Supabase serves the S3 API from <ref>.storage.supabase.co and
    // public reads from <ref>.supabase.co; the site links the public one, so
    // it is derived here from the same env var. The pathname pins the
    // optimiser to this bucket's public objects and nothing else on the host.
    remotePatterns:
      process.env.S3_ENDPOINT && process.env.S3_BUCKET
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.S3_ENDPOINT).hostname.replace(
                ".storage.supabase.co",
                ".supabase.co",
              ),
              pathname: `/storage/v1/object/public/${encodeURIComponent(process.env.S3_BUCKET)}/**`,
            },
          ]
        : [],

    // How long an optimised image is kept before it is fetched and resized
    // again. Unset, the live site served them with `max-age=60`, so nearly
    // every visitor was a cache miss and waited for the full fetch-and-resize.
    // 31 days is safe because a photo never changes under the same URL:
    // Payload gives a clashing upload a new filename (-1, -2 …), so replacing
    // a photo always produces a new URL rather than a stale cached one.
    minimumCacheTTL: 2678400,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
