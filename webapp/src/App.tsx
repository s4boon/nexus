import { useEffect, useState } from "react";

export type FeaturedRes = {
  data: Array<{
    id: string;
    slug: string;
    name: string;
    name_alt: any;
    logo: {
      resized: {
        large: string;
        medium: string;
        small: string;
      };
      resized_blur: {
        large: string;
        medium: string;
        small: string;
      };
    };
    poster: {
      resized: {
        "1560x2340": string;
        "640x960": string;
        "480x720": string;
        "240x360": string;
      };
      resized_blur: {
        "1560x2340": string;
        "640x960": string;
        "480x720": string;
        "240x360": string;
      };
    };
    description: string;
    background: {
      resized: {
        "3840x2160": string;
        "1920x1080": string;
        "1360x768": string;
        "960x540": string;
      };
      resized_blur: {
        "3840x2160": string;
        "1920x1080": string;
        "1360x768": string;
        "960x540": string;
      };
    };
    release_date: string;
    genres: Array<{
      id: string;
      name: string;
      code: string;
    }>;
    backdrop?: {
      resized: {
        "3840x1524": string;
        "1920x762": string;
        "1360x540": string;
        "960x380": string;
      };
      resized_blur: {
        "3840x1524": string;
        "1920x762": string;
        "1360x540": string;
        "960x380": string;
      };
    };
  }>;
};

export default function App() {
  const [data, setData] = useState<FeaturedRes["data"]>();

  async function fetchFeatured() {
    const res = await fetch("http://proxy.localhost:1323/api/anime/featured");
    if (!res.ok) {
      setData([]);
      return;
    }
    const json = (await res.json()) as FeaturedRes;
    setData(json.data);
  }
  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div className="text-foreground">
      {data?.map((entry, index) => (
        <div key={index}>{entry.name}</div>
      ))}
    </div>
  );
}
