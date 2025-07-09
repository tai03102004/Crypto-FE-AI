import { Metadata } from "next";

export function generateMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://jadenx.ai",
      siteName: "JadenX.AI",
      images: [
        {
          url: "https://jadenx.ai/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://jadenx.ai/twitter-image.png"],
    },
  };
}
