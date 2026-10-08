import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // /NOMOR_RESI dilayani oleh halaman statis "/" (resi dibaca di browser),
  // jadi membuka link resi tidak menjalankan function sama sekali.
  async rewrites() {
    return [{ source: "/:stt([A-Za-z0-9-]{5,40})", destination: "/" }];
  },
};

export default nextConfig;
