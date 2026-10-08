import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Open Sauce One untuk heading
const openSauceOne = localFont({
  src: [
    {
      path: "../public/OpenSauceOne-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/OpenSauceOne-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce-one",
  display: "swap",
});

// Open Sauce Sans untuk body text
const openSauceSans = localFont({
  src: [
    {
      path: "../public/OpenSauceSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/OpenSauceSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tracking.torch.id"),
  title: "Tracking Pengiriman Torch | Lacak Status Order & Paket Anda",
  description:
    "Lacak status pengiriman pesanan Torch secara real-time. Masukkan nomor resi untuk melihat lokasi paket, riwayat perjalanan, kurir, dan estimasi waktu tiba.",
  icons: {
    icon: [
      { url: "/torch-icon.ico", sizes: "48x48" },
      { url: "/avatar.svg", type: "image/svg+xml" }
    ],
    shortcut: "/torch-icon.ico",
    apple: "/avatar.svg",
  },
  openGraph: {
    title: "Tracking Pengiriman Torch | Lacak Status Order & Paket Anda",
    description:
      "Lacak status pengiriman pesanan Torch secara real-time dengan dukungan Lion Parcel & SiCepat.",
    url: "https://tracking.torch.id",
    siteName: "Torch Indonesia",
    images: [
      {
        url: "/TORCH_LOGOS.png",
        width: 1200,
        height: 630,
        alt: "Tracking Pengiriman Torch",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracking Pengiriman Torch",
    description: "Lacak status pengiriman pesanan Torch secara real-time.",
    images: ["/TORCH_LOGOS.png"],
  },
};

// Dijalankan sebelum paint supaya tidak ada kedipan tema saat halaman dimuat.
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${openSauceSans.variable} ${openSauceOne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" type="image/x-icon" href="/torch-icon.ico" />
        <link rel="icon" type="image/svg+xml" href="/avatar.svg" />
        <link rel="apple-touch-icon" href="/avatar.svg" />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        {children}
      </body>
    </html>
  );
}