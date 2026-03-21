import type { FeaturedRes } from "@/App";
import { useEffect, useState } from "react";

type Props = {};

export default function Hero() {
  const [data, setData] = useState<FeaturedRes["data"]>();
  const [isLoading, setIsLoading] = useState(false);

  async function fetchFeatured() {
    setIsLoading(true);
    const res = await fetch("http://proxy.localhost:1323/api/anime/featured");
    if (!res.ok) {
      setData([]);
      setIsLoading(false);
      return;
    }
    const json = (await res.json()) as FeaturedRes;
    setData(json.data);
    setIsLoading(false);
    console.log(json);
    return;
  }
  useEffect(() => {
    fetchFeatured();
  }, []);

  const firstEntry = data?.[0];
  return (
    <div className="w-full h-fit relative">
      {firstEntry && (
        <>
          <Background {...firstEntry} />
          <Splash {...firstEntry} />
        </>
      )}
    </div>
  );
}

function Background({ background, poster, name }: FeaturedRes["data"][number]) {
  return (
    <figure className="absolute top-0 left-0 z-0 figure-dim overflow-hidden">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={"https://anime.delivery" + poster.resized["640x960"]}
          sizes="100vw"
        />
        <source
          media="(max-width: 1024px)"
          srcSet={"https://anime.delivery" + background.resized["1360x768"]}
          sizes="100vw"
        />
        <source
          media="(max-width: 1920px)"
          srcSet={"https://anime.delivery" + background.resized["1920x1080"]}
          sizes="100vw"
        />
        <source
          media="(min-width: 1921px)"
          srcSet={"https://anime.delivery" + background.resized["3840x2160"]}
          sizes="100vw"
        />
        <img
          src={background.resized["1360x768"]}
          alt={name}
          className="w-full object-cover object-top block scale-110 origin-top"
        />
      </picture>
    </figure>
  );
}

function Splash(firstEntry: FeaturedRes["data"][number]) {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-10 pt-10 px-10 ">
      <figure className="mx-auto md:mx-0 w-fit">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={"https://anime.delivery" + firstEntry.logo.resized["small"]}
            sizes="100vw"
          />
          <source
            media="(max-width: 1024px)"
            srcSet={
              "https://anime.delivery" + firstEntry.logo.resized["medium"]
            }
            sizes="100vw"
          />
          <source
            media="(min-width: 1025px)"
            srcSet={"https://anime.delivery" + firstEntry.logo.resized["large"]}
            sizes="100vw"
          />

          <img src={firstEntry.logo.resized["medium"]} alt={firstEntry.name} />
        </picture>
      </figure>
    </div>
  );
}
