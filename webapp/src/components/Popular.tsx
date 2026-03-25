import { cn } from "@/lib/utils";
import type { PopularRes } from "@/types";
import { AlertTriangle, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

const IMAGE_BASE = import.meta.env.VITE_BASE_IMAGE_URL;

function PopularEntry({
  entry,
  index,
}: {
  entry: PopularRes["data"][number];
  index: number;
}) {
  return (
    <div className="group relative flex gap-4 p-3 mb-2 rounded-md transition-all duration-300 hover:bg-card/50 hover:backdrop-blur-sm">
      <div className="absolute -left-1 top-3 z-10 flex h-7 w-7 items-center justify-center">
        <div
          className={cn(
            "text-2xl font-bold",
            index === 1
              ? "text-yellow-500"
              : index === 2
                ? "text-zinc-400"
                : index === 3
                  ? "text-amber-700"
                  : "text-muted-foreground/40",
          )}
        >
          {index}
        </div>
      </div>
      <Link
        to={"/anime/" + entry.id}
        className="relative ml-6 aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105"
      >
        <div className="relative size-full object-cover">
          <picture className="relative">
            <img
              className="size-full object-fit"
              sizes="80px"
              srcSet={`${IMAGE_BASE + entry.poster.resized["1560x2340"]} 1560w, ${IMAGE_BASE + entry.poster.resized["640x960"]} 640w, ${IMAGE_BASE + entry.poster.resized["480x720"]} 480w, ${IMAGE_BASE + entry.poster.resized["240x360"]} 240w,`}
              src={`${IMAGE_BASE + entry.poster.resized["1560x2340"]}`}
              alt="Jujutsu Kaisen: The Culling Game Part 1"
              loading="lazy"
            />
          </picture>
        </div>
        <div className="absolute inset-0 rounded-md ring-2 ring-inset ring-yellow-500/30"></div>
      </Link>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <Link
          to={"/anime/" + entry.id}
          className="font-medium text-foreground text-sm line-clamp-1 hover:text-primary transition-colors"
        >
          {entry.name}
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {entry.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span>{new Intl.NumberFormat("en-US").format(entry.views)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PEntrySkeleton() {
  return (
    <div className="group relative flex gap-4 p-3 mb-2 rounded-md transition-all duration-300 hover:bg-card/50 hover:backdrop-blur-sm">
      <Skeleton className="relative ml-6 aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md "></Skeleton>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <Skeleton className="font-medium text-sm line-clamp-1">&nbsp;</Skeleton>
        <Skeleton className="text-xs text-transparent line-clamp-2 mt-1 leading-relaxed">
          <span className="invisible">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum,
            asperiores incidunt fugit quam voluptate molestias blanditiis alias
            ullam ea atque minus modi nihil ab reprehenderit, nesciunt ex facere
            inventore? Voluptas.
          </span>
        </Skeleton>
        <div className="flex items-center gap-3 mt-2">
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Skeleton className="w-16">&nbsp;</Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Error() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full relative min-h-60 place-content-center place-items-center">
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

export default function Popular() {
  const [loadingStatus, setLoadingStatus] = useState<
    "FETCHING" | "FINISHED" | "ERROR"
  >("FETCHING");
  const [popular, setPopular] = useState<PopularRes["data"]>();

  async function fetchPopular(period: "day" | "week" | "month" = "day") {
    try {
      setLoadingStatus("FETCHING");
      const res = await fetch(
        "http://proxy.localhost:1323/api/anime/popular?period=" + period,
      );
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as PopularRes;
      setPopular(json.data);
      setLoadingStatus("FINISHED");
      return;
    } catch (error) {
      setLoadingStatus("ERROR");
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchPopular();
  }, []);

  return (
    <div className="col-span-full xl:col-span-1">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 xl:px-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-md font-semibold tracking-tight text-foreground">
                Popular Shows
              </h2>
              <p className="text-xs text-muted-foreground">Trending by views</p>
            </div>
          </div>
          <Select
            defaultValue="day"
            onValueChange={(e: "day" | "week" | "month") => {
              //whatever
              fetchPopular(e);
            }}
          >
            <SelectTrigger className="w-[110px] px-2 rounded text-foreground">
              <SelectValue placeholder="Period" className="text-foreground" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="px-4 xl:px-0">
          <div className="md:grid md:grid-cols-3 md:gap-4 xl:gap-0 xl:grid-cols-1 w-full">
            {loadingStatus === "FINISHED" ? (
              popular?.map((entry, index) => {
                return (
                  <PopularEntry entry={entry} index={index + 1} key={index} />
                );
              })
            ) : loadingStatus === "FETCHING" ? (
              <>
                <PEntrySkeleton />
                <PEntrySkeleton />
                <PEntrySkeleton />
                <PEntrySkeleton />
                <PEntrySkeleton />
              </>
            ) : (
              <Error />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
