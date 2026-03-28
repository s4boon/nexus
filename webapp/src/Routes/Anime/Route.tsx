import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnimeDetailsRes, LoadingStatus } from "@/types";
import { Play, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import NotFound from "../NotFound";
import { EpisodesAndRelations } from "./Episodes";
import { StatsContainer } from "./Stats";

const IMAGE_BASE = import.meta.env.VITE_BASE_IMAGE_URL;

export default function AnimeDetails() {
  const { id } = useParams();
  const [animeDetails, setAnimeDetails] = useState<AnimeDetailsRes["data"]>();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("FETCHING");

  if (!id) {
    return <NotFound />;
  }

  async function fetchAnimeDetails(id: string) {
    try {
      setLoadingStatus("FETCHING");
      const includes = [
        "background",
        "poster",
        "relations",
        "logo",
        "genres",
        "themes",
        "demographics",
        "studios",
        "producers",
      ];
      const params = new URLSearchParams();

      params.append("id", id);

      includes.forEach((include) => {
        params.append("includes[]", include);
      });
      const res = await fetch(
        "http://proxy.localhost:1323/api/anime/details?" + params.toString(),
      );
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as AnimeDetailsRes;
      setAnimeDetails(json.data);
      setLoadingStatus("FINISHED");
      return;
    } catch (error) {
      setLoadingStatus("ERROR");
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchAnimeDetails(id);
  }, [id]);

  return loadingStatus === "FETCHING" ? (
    <PageSkeleton id={id} />
  ) : loadingStatus === "FINISHED" ? (
    animeDetails && <Page animeDetails={animeDetails} />
  ) : (
    <div>Error page</div>
  );
}

function Page({ animeDetails }: { animeDetails: AnimeDetailsRes["data"] }) {
  return (
    <div className="relative flex-1">
      <Background {...animeDetails} />
      <div className="container md:pt-30 pb-4 px-4 lg:px-8 xl:px-4 mx-auto relative">
        <div className="grid grid-cols-5 grid-flow-col-dense gap-4">
          <DownloadDialog />
          <SideCard {...animeDetails} />
          <div className="col-span-5 xl:col-span-4 flex flex-col gap-2">
            <Title {...animeDetails} />
            <StatsContainer id={animeDetails.id} />
            <Description description={animeDetails.description} />
            <EpisodesAndRelations relations={animeDetails.relations} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageSkeleton({ id }: { id: string }) {
  return (
    <div className="relative flex-1">
      <div className="container md:pt-30 pb-4 px-4 lg:px-8 xl:px-4 mx-auto relative">
        <div className="grid grid-cols-5 grid-flow-col-dense gap-4">
          <DownloadDialog />
          <SideCardSkeleton />
          <div className="col-span-5 xl:col-span-4 flex flex-col gap-2">
            <TitleSkeleton />
            <StatsContainer id={id} />
            <DescriptionSkeleton />
            <EpisodesAndRelations />
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ key_, value }: { key_: string; value: string }) {
  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {key_}
        </span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

function TagMulti({ key_, values }: { key_: string; values: string[] }) {
  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {key_}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => {
            return (
              <Badge
                variant={"outline"}
                key={i}
                className="border-primary/20 rounded py-3"
              >
                {v}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Background({ background, poster, name }: AnimeDetailsRes["data"]) {
  console.log(background, poster);
  return (
    <>
      <figure>
        <div className="absolute max-h-[600px] lg:max-h-none lg:fixed inset-0">
          <picture className="relative">
            <source
              srcSet={`${IMAGE_BASE + poster.resized["1560x2340"]} 1560w, ${IMAGE_BASE + poster.resized["640x960"]} 640w, ${IMAGE_BASE + poster.resized["480x720"]} 480w, ${IMAGE_BASE + poster.resized["240x360"]} 240w`}
              sizes="100vw"
              media="(width < 50em)"
            />

            <img
              className="size-full object-cover"
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              srcSet={
                background
                  ? `${IMAGE_BASE + background?.resized["3840x2160"]} 3840w, ${IMAGE_BASE + background?.resized["1920x1080"]} 1920w, ${IMAGE_BASE + background?.resized["1360x768"]} 1360w, ${IMAGE_BASE + background?.resized["960x540"]} 960w`
                  : IMAGE_BASE + poster.resized["640x960"]
              }
              src={IMAGE_BASE + poster.resized["640x960"]}
              alt={name}
            />
          </picture>
        </div>
      </figure>
      <div className="absolute max-h-[600px] lg:max-h-none lg:fixed inset-0 flex bg-gradient-to-t from-background to-background/82"></div>
    </>
  );
}

function SideCard({
  poster,
  name,
  type,
  status,
  release_date,
  broadcast,
  episode_count,
  episode_count_current,
  parental_rating,
  themes,
  demographics,
  studios,
  producers,
}: AnimeDetailsRes["data"]) {
  return (
    <div className="hidden xl:block lg:col-span-2 xl:col-span-1">
      <div className="size-full space-y-4">
        <div className="relative group">
          <figure className="relative overflow-hidden rounded-md cursor-pointer">
            <div className="relative w-full aspect-[640/960] object-cover transition-transform duration-500 group-hover:scale-105">
              <picture className="relative">
                <img
                  className="size-full object-cover"
                  sizes="(min-width: 135em) calc(100vw / 7), (min-width: 107.5em) calc(100vw / 6), (min-width: 50em) calc(100vw / 5), (min-width: 35.5em) calc(100vw / 4), (min-width: 30em) calc(100vw / 3), 50vw"
                  loading="eager"
                  srcSet={`${IMAGE_BASE + poster.resized["1560x2340"]} 1560w, ${IMAGE_BASE + poster.resized["640x960"]} 640w, ${IMAGE_BASE + poster.resized["480x720"]} 480w, ${IMAGE_BASE + poster.resized["240x360"]} 240w`}
                  src={IMAGE_BASE + poster.resized["1560x2340"]}
                  alt={name}
                />
              </picture>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="h-10 w-10 text-white drop-shadow-lg" />
            </div>
          </figure>
        </div>
        <Button
          variant={"ghost"}
          className="w-full h-11 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all duration-200"
        >
          <Play className="w-4 h-4" />
          Watch Trailer
        </Button>
        <div className="rounded-md bg-green-700/10  border border-green-700/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-700 uppercase tracking-wider">
              Next Episode
            </span>
            <span className="text-sm font-bold text-green-700">11h 0m 57s</span>
          </div>
        </div>
        <div className="rounded-md bg-card/50 backdrop-blur-sm border border-border/50 overflow-hidden">
          <div className="p-4 space-y-1">
            <Tag key_="Type" value={type} />
            <Tag key_="Status" value={status} />
            <Tag key_="Release" value={release_date} />
            <Tag key_="Broadcast time" value={broadcast} />
            <Tag
              key_="Episodes"
              value={episode_count_current + "/" + episode_count}
            />
            <Tag key_="Rating" value={parental_rating} />
          </div>
          <div className="border-t border-border/50"></div>
          <div className="p-4 space-y-1">
            <TagMulti key_="Themes" values={themes.map((t) => t.name)} />
            <TagMulti
              key_="Demographics"
              values={demographics.map((d) => d.name)}
            />
          </div>
          <div className="border-t border-border/50"></div>
          <div className="p-4 space-y-1">
            <TagMulti key_="Studios" values={studios.map((s) => s.name)} />
            <TagMulti key_="Producers" values={producers.map((p) => p.name)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCardSkeleton() {
  return (
    <div className="hidden xl:block lg:col-span-2 xl:col-span-1">
      <div className="size-full space-y-4">
        <Skeleton className="relative *:invisible">
          <figure className="relative overflow-hidden rounded-md">
            <div className="relative w-full aspect-[640/960]"></div>
          </figure>
        </Skeleton>
        <Skeleton className="*:invisible rounded-md backdrop-blur-sm h-150 border border-border/50" />
      </div>
    </div>
  );
}

function Title({ name, name_alt, logo, genres }: AnimeDetailsRes["data"]) {
  return (
    <div className="mt-20 md:mt-0">
      <div>
        <div className="mb-0 lg:mb-4">
          <div className="flex flex-row items-center justify-center gap-4 lg:gap-6 mb-6">
            <div className="hidden lg:block *:text-accent-foreground">
              <span className="block text-sm lg:text-base xl:text-lg font-bold mb-1">
                {name_alt}
              </span>
              <h1 className="block font-black leading-none text-base lg:text-2xl xl:text-4xl uppercase">
                {name}
              </h1>
            </div>
            {logo && (
              <div className="mx-auto lg:mr-0 lg:ml-auto">
                <div className="relative max-w-[250px] lg:max-w-[300px]">
                  <img
                    className=" drop-shadow-[0_0_3px] dark:filter-none m-auto size-full lg:m-0 object-contain object-[bottom_center]"
                    sizes="(max-width: 960px) 320px, (max-width: 1260px) 480px, 600px"
                    loading="eager"
                    srcSet={`${IMAGE_BASE + logo.resized.large} 600w,${IMAGE_BASE + logo.resized.medium} 480w,${IMAGE_BASE + logo.resized.small}  320w`}
                    src={IMAGE_BASE + logo.resized.large}
                    alt={name}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mx-auto lg:mx-0 w-fit">
          {genres.map((genre) => {
            return (
              <Badge
                key={genre.id}
                variant={"outline"}
                className="border-primary/20 rounded py-3"
              >
                {genre.name}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TitleSkeleton() {
  return (
    <div className="mt-20 md:mt-0">
      <div>
        <div className="mb-0 lg:mb-4">
          <div className="flex flex-row items-center justify-center gap-4 lg:gap-6 mb-6">
            <div className="hidden lg:block *:text-accent-foreground">
              <Skeleton className="*:invisible">
                <span className="block text-sm lg:text-base xl:text-lg font-bold mb-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing.
                </span>
              </Skeleton>
              <Skeleton className="*:invisible">
                <h1 className="block font-black leading-none text-base lg:text-2xl xl:text-4xl uppercase">
                  Lorem ipsum dolor sit amet consectetur.
                </h1>
              </Skeleton>
            </div>
            <Skeleton>
              <div className="relative mx-auto lg:mr-0 lg:ml-auto">
                <div className="relative w-[250px] lg:w-[300px] aspect-7/3"></div>
              </div>
            </Skeleton>
          </div>
        </div>
        <Skeleton className="hidden lg:flex flex-wrap gap-3 items-center w-fit *:invisible">
          <Badge variant={"outline"} className="border-primary/20 rounded py-3">
            Action
          </Badge>
          <Badge variant={"outline"} className="border-primary/20 rounded py-3">
            Supernatural
          </Badge>
        </Skeleton>
      </div>
      <Skeleton className="flex lg:hidden flex-wrap gap-3 w-fit">
        <Badge variant={"outline"} className="border-primary/20 rounded py-3">
          Action
        </Badge>
        <Badge variant={"outline"} className="border-primary/20 rounded py-3">
          Supernatural
        </Badge>
      </Skeleton>
    </div>
  );
}

function DescriptionSkeleton() {
  return (
    <div className="mb-4">
      <div className="py-3 w-fit">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Synopsis
        </h2>
        <Skeleton>
          <div className="text-sm text-foreground/80 leading-relaxed invisible">
            <p className="line-clamp-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam, ipsum? Laborum exercitationem omnis dicta odit
              eligendi, iste enim dolore tempore accusamus officiis ipsam
              quaerat natus. Provident nisi autem dolores quo animi, sit
              architecto velit perferendis ipsam praesentium fuga alias omnis
              dolorem molestiae eaque, perspiciatis molestias eos officiis qui
              consectetur eveniet.
            </p>
          </div>
          <div className="mt-2 px-0 h-auto text-[10px] invisible">
            "Read More →"
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

function Description({ description }: { description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4">
      <div className="py-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Synopsis
        </h2>
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="relative">
            <div className="text-sm text-foreground/80 leading-relaxed">
              <p className={open ? "line-clamp-none" : "line-clamp-3"}>
                {description}
              </p>
            </div>
            <CollapsibleTrigger className="mt-2 px-0 h-auto text-[10px] cursor-pointer font-medium text-primary hover:text-primary/80 hover:bg-transparent">
              {!open ? "Read More →" : "← Show Less"}
            </CollapsibleTrigger>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

function DownloadDialog() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Number>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ep = searchParams.get("episode");
    if (!ep || Number.isNaN(ep)) {
      return;
    }
    setCurrentEpisode(Number(ep));
  }, [searchParams]);

  useEffect(() => {
    setModalOpen(() => {
      return currentEpisode != undefined ? true : false;
    });
  }, [currentEpisode]);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => {
        setModalOpen(open);
        if (open) {
          navigate({ search: "?epispde=" + currentEpisode }, { replace: true });
        } else {
          navigate({ search: "" }, { replace: true });
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>{currentEpisode?.toString()}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
