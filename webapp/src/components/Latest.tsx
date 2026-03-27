import { formatDuration } from "@/lib/utils";
import type { LatestRes } from "@/types";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  MessageSquareMore,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Popular from "./Popular";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const IMAGE_BASE = import.meta.env.VITE_BASE_IMAGE_URL;

export default function LatestContainer() {
  return (
    <div className="xl:container px-0 xl:px-12 mx-auto relative pt-8">
      <div className="grid grid-cols-4 gap-8">
        <Latest />
        <Popular />
      </div>
    </div>
  );
}

function Latest() {
  const [latest, setLatest] = useState<LatestRes>();
  const [loadingStatus, setLoadingStatus] = useState<
    "FETCHING" | "FINISHED" | "ERROR"
  >("FETCHING");

  async function fetchLatest(page: number = 0) {
    setLoadingStatus("FETCHING");
    try {
      const res = await fetch(
        "http://proxy.localhost:1323/api/anime/latest?page=" + page,
      );
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }

      const json = (await res.json()) as LatestRes;
      setLatest(json);
      setLoadingStatus("FINISHED");
      return;
    } catch (error) {
      setLoadingStatus("ERROR");
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <div className="col-span-full xl:col-span-3">
      <LatestHeader
        current_page={latest?.meta.current_page ?? 0}
        last_page={latest?.meta.last_page ?? 0}
        fetchLatest={fetchLatest}
        loadingStatus={loadingStatus}
      />
      {loadingStatus === "ERROR" ? (
        <Error />
      ) : loadingStatus === "FETCHING" ? (
        <LatestSkeleton />
      ) : (
        latest && (
          <>
            <div className="hidden xl:grid gap-4 grid-cols-2 xl:grid-cols-5">
              {latest.data.map((entry, i) => {
                return <Episode {...entry} key={i} />;
              })}
            </div>
            <div className="flex xl:hidden px-4">
              <div className="overflow-x-scroll">
                <div className="flex mb-6 gap-4">
                  {latest?.data.map((entry, i) => {
                    return (
                      <div
                        key={i}
                        className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]"
                      >
                        <Episode {...entry} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

function LatestHeader({
  current_page,
  last_page,
  fetchLatest,
  loadingStatus,
}: {
  current_page: number;
  last_page: number;
  fetchLatest: (page?: number) => Promise<void>;
  loadingStatus: "FETCHING" | "FINISHED" | "ERROR";
}) {
  return (
    <div className="mb-6 px-4 xl:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Latest Episodes
            </h2>
            <p className="text-sm text-muted-foreground">
              Recently released episodes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <Button
            className="text-accent-foreground"
            variant={"ghost"}
            disabled={
              loadingStatus === "FETCHING" || !current_page || current_page <= 1
            }
            onClick={() => {
              let p = current_page ?? 1;
              fetchLatest(p - 1);
            }}
          >
            <ArrowLeft />
          </Button>
          <span className="text-foreground">
            {current_page}/{last_page}
          </span>
          <Button
            className="text-accent-foreground"
            variant={"ghost"}
            disabled={
              loadingStatus === "FETCHING" ||
              !current_page ||
              current_page === last_page
            }
            onClick={() => {
              let p = current_page ?? 1;
              fetchLatest(p + 1);
            }}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Episode({
  episode,
  id,
  name,
  poster,
  name_alt,
  slug,
}: LatestRes["data"][number]) {
  return (
    <div className="relative">
      <div className="overflow-hidden group block relative aspect-[640/360] transition-all hover:scale-105 rounded-md">
        <figure>
          <div className="absolute w-full h-full">
            <picture className="relative">
              <img
                className="size-full object-cover"
                sizes="(min-width: 135em) 274px, (min-width: 107.5em) 320px, (min-width: 50em) 384px, (min-width: 35.5em) 480px, (min-width: 30em) 640px, 50vw"
                srcSet={`${IMAGE_BASE + episode.image.resized["1920x1080"]} 1920w, ${IMAGE_BASE + episode.image.resized["1280x720"]} 1280w, ${IMAGE_BASE + episode.image.resized["1024x576"]} 1024w, ${IMAGE_BASE + episode.image.resized["640x360"]} 640w`}
                src={IMAGE_BASE + episode.image.resized["1920x1080"]}
              ></img>
            </picture>
          </div>
        </figure>
        <Link to={"#"} className="absolute w-full h-full" title={name}></Link>
        <Badge className="absolute shadow-none top-0 start-0 bg-black/50 text-white m-1 h-6 text-xs rounded-none rounded-br-md rounded-tl-md pointer-events-none">
          {formatDuration(episode.duration)}
        </Badge>
        <Badge className="absolute shadow-none bottom-2 left-0 bg-black/50 text-white m-1 text-xs rounded-none rounded-bl-md rounded-tr-md">
          <MessageSquareMore className="w-4 h-4 inline-block" />
          {episode.comments}
        </Badge>
      </div>
      <div className="pt-3">
        <div className="text-xs uppercase mb-1 text-muted-foreground">
          Episode {episode.number}
        </div>
        <Link
          to={"#"}
          className="truncate max-h-12 block text-sm text-foreground"
          title={name}
        >
          {name}
        </Link>
        <Separator className="my-3" />
        <div className="flex items-center">
          <span className="flex gap-2 items-center">
            <div className="flex items-center">
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tr-none rounded-br-none"
              >
                Sub
              </Badge>
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tl-none rounded-bl-none"
              >
                {episode.video_meta.subtitle_languages.length}
              </Badge>
            </div>
            <div className="flex items-center">
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tr-none rounded-br-none"
              >
                Aud
              </Badge>
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tl-none rounded-bl-none"
              >
                {episode.video_meta.audio_languages.length}
              </Badge>
            </div>
          </span>
          <span className="ml-auto items-center inline-flex">
            <CircleDot className="w-4 h-4 text-green-500" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function EpisodeSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="overflow-hidden group block relative aspect-[640/360] transition-all hover:scale-105 rounded-md"></Skeleton>
      <div className="pt-3">
        <Skeleton className="text-xs uppercase mb-1 text-muted-foreground w-20">
          &nbsp;
        </Skeleton>
        <Skeleton className="truncate max-h-12 block text-sm text-foreground w-40">
          &nbsp;
        </Skeleton>
        <Separator className="my-3" />
        <div className="flex items-center">
          <Skeleton className="flex gap-2 items-center">
            <div className="flex items-center invisible">
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tr-none rounded-br-none"
              >
                Sub
              </Badge>
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tl-none rounded-bl-none"
              >
                0
              </Badge>
            </div>
            <div className="flex items-center invisible">
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tr-none rounded-br-none"
              >
                Aud
              </Badge>
              <Badge
                variant={"outline"}
                className=" rounded-xs px-1.5 uppercase hover:bg-primary pointer-events-none rounded-tl-none rounded-bl-none"
              >
                0
              </Badge>
            </div>
          </Skeleton>
          <span className="ml-auto items-center inline-flex invisible">
            <CircleDot className="w-4 h-4 text-green-500" />
          </span>
        </div>
      </div>
    </div>
  );
}

function LatestSkeleton() {
  return (
    <>
      <div className="hidden xl:grid gap-4 grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 15 }).map((v, i) => {
          return <EpisodeSkeleton key={i} />;
        })}
      </div>
      <div className="flex xl:hidden px-4">
        <div className="overflow-x-scroll">
          <div className="flex mb-6 gap-4">
            {Array.from({ length: 10 }).map((entry, i) => {
              return (
                <div
                  key={i}
                  className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]"
                >
                  <EpisodeSkeleton />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Error() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full relative h-fit place-content-center place-items-center">
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
