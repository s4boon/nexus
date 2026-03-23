import type { FeaturedRes } from "@/App";
import { AlertTriangle, Calendar, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function Hero() {
  const [data, setData] = useState<FeaturedRes["data"]>();
  const [currentEntry, setCurrentEntry] = useState({ index: 0, max: 0 });
  const [loadingStatus, setLoadingStatus] = useState<
    "FETCHING" | "FINISHED" | "ERROR"
  >("FETCHING");

  async function fetchFeatured() {
    try {
      setLoadingStatus("FETCHING");
      const res = await fetch("http://proxy.localhost:1323/api/anime/featured");
      if (!res.ok) {
        setData([]);
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as FeaturedRes;
      setData(json.data);
      setLoadingStatus("FINISHED");
      console.log(json);
      return;
    } catch (err) {
      console.log(err);
      setLoadingStatus("ERROR");
    }
  }
  useEffect(() => {
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (data) {
      setCurrentEntry({ index: 0, max: data.length - 1 });
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data) {
        setCurrentEntry((prev) => {
          if (prev.index < prev.max) {
            return { ...prev, index: prev.index + 1 };
          }
          return { ...prev, index: 0 };
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentEntry]);

  return loadingStatus === "FINISHED" ? (
    <div className="w-full relative h-120">
      {data?.map((entry, index) => (
        <div
          className={`absolute inset-0 w-full ${currentEntry.index === index ? "" : "opacity-0"} transition-opacity duration-500`}
          key={index}
        >
          <Background {...entry} />
          <div className="absolute top-0 left-0 w-full h-full z-50 pt-12 px-12 space-y-3">
            <Splash {...entry} />
            <div className="flex mx-auto h-[25px] w-[65px] md:mx-0 items-center rounded border border-accent bg-accent/40 text-accent-foreground/50 text-xs justify-center gap-x-1.5">
              <Calendar size={12} />
              {new Date(entry.release_date).getFullYear()}
            </div>
            <div className="flex w-fit gap-x-1.5 mx-auto md:mx-0">
              {entry.genres.map((genre) => {
                return (
                  <Badge
                    key={genre.id}
                    variant={"secondary"}
                    className="text-[10px] text-accent-foreground/60 hover:brightness-125"
                  >
                    {genre.name}
                  </Badge>
                );
              })}
            </div>
            <p
              className="text-accent-foreground/50 w-[80%] text-sm line-clamp-3 hidden 
                md:[display:-webkit-box]! overflow:hidden! [box-orient:vertical]!"
            >
              {entry.description}
            </p>
            <Button
              className="text-xs mx-auto md:mx-0 flex space-x-1.5 items-center hover:brightness-90 h-8 w-34"
              onClick={() => {
                console.log(entry.name);
              }}
            >
              <Download /> Download Now
            </Button>
            <Badge className="flex w-fit mx-auto mt-10" variant={"outline"}>
              {data.map((e, i) => {
                return (
                  <div
                    key={i}
                    className={`${i === currentEntry.index ? "w-5 bg-accent-foreground" : "w-2 bg-accent"} h-2 rounded-full cursor-pointer hover:brightness-110 transition-all duration-500`}
                    onClick={() => {
                      setCurrentEntry((prev) => {
                        return { ...prev, index: i };
                      });
                    }}
                  ></div>
                );
              })}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  ) : loadingStatus === "ERROR" ? (
    <Error />
  ) : (
    <Loading />
  );
}

function Background({ background, poster, name }: FeaturedRes["data"][number]) {
  return (
    <figure className="z-0 figure-dim overflow-hidden relative h-full">
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
          className="w-full object-cover md:object-top h-full block md:scale-110 "
        />
      </picture>
    </figure>
  );
}

function Splash(entry: FeaturedRes["data"][number]) {
  return (
    <figure className="mx-auto md:mx-0 w-fit">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={"https://anime.delivery" + entry.logo.resized["small"]}
          sizes="100vw"
        />
        <source
          media="(max-width: 1920px)"
          srcSet={"https://anime.delivery" + entry.logo.resized["medium"]}
          sizes="100vw"
        />
        <source
          media="(min-width: 1921px)"
          srcSet={"https://anime.delivery" + entry.logo.resized["large"]}
          sizes="100vw"
        />

        <img
          src={entry.logo.resized["medium"]}
          alt={entry.name}
          className="drop-shadow-lg drop-shadow-black object-scale-down h-40 w-fit"
        />
      </picture>
    </figure>
  );
}

function Loading() {
  return (
    <div className="w-full relative h-120">
      <div className="absolute inset-0 w-full transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-full z-50 pt-12 px-12 space-y-3">
          <Skeleton className="mx-auto md:mx-0 h-40 w-[90%] md:w-120" />
          <Skeleton className="mx-auto h-[25px] w-[65px] md:mx-0 rounded border" />
          <Skeleton className="flex w-40 h-5 gap-x-1.5 mx-auto md:mx-0" />
          <Skeleton className="w-[80%] h-15 hidden md:block" />
          <Skeleton className="h-8 w-34 mx-auto md:mx-0" />
        </div>
      </div>
    </div>
  );
}

function Error() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full relative h-120 place-content-center place-items-center">
      <div className="flex flex-col place-content-center place-items-center w-fit h-fit gap-y-2 border border-destructive p-3 rounded bg-destructive/10">
        <span className=" text-red-800">Something went wrong!</span>
        <AlertTriangle className="text-red-800" size={48} />
        <Button
          variant={"destructive"}
          onClick={() => {
            navigate(0);
          }}
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}
