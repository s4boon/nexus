import type { FeaturedRes } from "@/App";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";

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
  buttonVariants;
  return (
    <div className="w-full h-fit overflow-hidden relative">
      {firstEntry && (
        <>
          <Background {...firstEntry} />
          <div className="absolute top-0 left-0 w-full h-full z-10 pt-12 px-14 space-y-3 ">
            <Splash {...firstEntry} />
            <div className="flex items-center rounded border border-accent bg-accent/40 text-accent-foreground/50 w-fit text-xs px-2 py-1 justify-between gap-x-1.5">
              <Calendar size={12} />
              {new Date(firstEntry.release_date).getFullYear()}
            </div>
            <div className="flex w-fit gap-x-1.5">
              {firstEntry.genres.map((genre) => {
                return (
                  <Badge
                    variant={"secondary"}
                    className="text-[10px] text-accent-foreground/60 hover:brightness-125"
                  >
                    {genre.name}
                  </Badge>
                );
              })}
            </div>
            <p className="text-accent-foreground/50 text-sm line-clamp-3 w-[75%]">
              {firstEntry.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Background({ background, poster, name }: FeaturedRes["data"][number]) {
  return (
    <figure className="z-0 figure-dim h-fit overflow-hidden relative">
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
    <figure className="mx-auto md:mx-0 w-fit">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={"https://anime.delivery" + firstEntry.logo.resized["small"]}
          sizes="100vw"
        />
        <source
          media="(max-width: 1920px)"
          srcSet={"https://anime.delivery" + firstEntry.logo.resized["medium"]}
          sizes="100vw"
        />
        <source
          media="(min-width: 1921px)"
          srcSet={"https://anime.delivery" + firstEntry.logo.resized["large"]}
          sizes="100vw"
        />

        <img
          src={firstEntry.logo.resized["medium"]}
          alt={firstEntry.name}
          className="drop-shadow-lg drop-shadow-black"
        />
      </picture>
    </figure>
  );
}
