export const jsonError = (message: string, status = 400, details?: unknown) => {
  return Response.json(
    { error: message, details },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
};

// Di-cache di CDN Vercel: resi yang sama dalam 60 detik tidak menjalankan
// function lagi, dan selama 5 menit berikutnya dilayani basi sambil diperbarui.
export const jsonOK = (data: unknown) =>
  Response.json(data, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    },
  });
