import { Episode, EpisodeSkeleton } from "@/components/Latest";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnimeDetailsRes, EpisodesRes, LoadingStatus } from "@/types";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListOrdered,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const IMAGE_BASE = import.meta.env.VITE_BASE_IMAGE_URL;

export function EpisodesAndRelations({
  relations,
}: {
  relations?: AnimeDetailsRes["data"]["relations"];
}) {
  const [episodes, setEpisodes] = useState<EpisodesRes>();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("FETCHING");
  const [perPage, setPerPage] = useState("24");
  const [sortBy, setSortBy] = useState("asc");
  const params = useParams();
  const id = params.id;

  if (!id) {
    return <div>Error not found</div>;
  }

  async function fetchEpisodes(
    id: string,
    page: number,
    perPage: number,
    sortBy: string,
  ) {
    try {
      setLoadingStatus("FETCHING");
      const res = await fetch(
        "http://proxy.localhost:1323//api/anime/details/episodes?id=" +
          id +
          "&page=" +
          page +
          "&perPage=" +
          perPage +
          "&order=" +
          sortBy +
          "&fillers=true&recaps=true",
      );
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as EpisodesRes;
      setEpisodes(json);
      console.log(json);
      setLoadingStatus("FINISHED");
      return;
    } catch (error) {
      setLoadingStatus("ERROR");
      return;
    }
  }

  useEffect(() => {
    if (!Number.isNaN(perPage)) {
      fetchEpisodes(id, 1, Number(perPage), sortBy);
    }
  }, [id, perPage, sortBy]);

  return (
    <Tabs
      className="flex flex-col gap-2 lg:pr-3.5"
      orientation="horizontal"
      defaultValue="episodes"
    >
      <div className="-mx-4 px-4 overflow-x-auto scrollbar-none md:mx-0 md:px-0">
        <TabsList className="text-muted-foreground items-center justify-center rounded mb-4 bg-card/50 backdrop-blur-sm border border-border/50 p-1.5 h-auto w-max flex gap-1">
          <TabsTrigger className="rounded py-3" value="episodes">
            Episodes
          </TabsTrigger>
          <TabsTrigger className="rounded py-3" value="relations">
            Relations
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="episodes" className="flex-1 outline-none">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
              disabled={
                loadingStatus === "FETCHING" ||
                !episodes ||
                episodes.meta.current_page === 1
              }
              onClick={() => {
                fetchEpisodes(id, 1, Number(perPage), sortBy);
              }}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
              disabled={
                loadingStatus === "FETCHING" ||
                !episodes ||
                episodes.meta.current_page === 1
              }
              onClick={() => {
                if (episodes) {
                  fetchEpisodes(
                    id,
                    episodes.meta.current_page - 1,
                    Number(perPage),
                    sortBy,
                  );
                }
              }}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
              disabled={
                loadingStatus === "FETCHING" ||
                !episodes ||
                episodes.meta.current_page === episodes.meta.last_page
              }
              onClick={() => {
                if (episodes) {
                  fetchEpisodes(
                    id,
                    episodes.meta.current_page + 1,
                    Number(perPage),
                    sortBy,
                  );
                }
              }}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
              disabled={
                loadingStatus === "FETCHING" ||
                !episodes ||
                episodes.meta.current_page === episodes.meta.last_page
              }
              onClick={() => {
                if (episodes) {
                  fetchEpisodes(
                    id,
                    episodes.meta.last_page,
                    Number(perPage),
                    sortBy,
                  );
                }
              }}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-accent-foreground">
                  <ListOrdered className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-medium">
                    {perPage}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="uppercase">Per Page</span>
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={perPage}
                    onValueChange={setPerPage}
                  >
                    <DropdownMenuRadioItem value="12">12</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="18">18</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="24">24</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-accent-foreground">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-medium">
                    {sortBy === "asc" ? "Oldest" : "Newest"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="uppercase">Sort</span>
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <DropdownMenuRadioItem value="asc">
                      Oldest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="desc">
                      Newest
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 episodes-container mb-6">
          {loadingStatus === "FETCHING" ? (
            Array.from({ length: 12 }).map((_, i) => (
              <EpisodeSkeleton key={i} />
            ))
          ) : loadingStatus === "FINISHED" ? (
            episodes &&
            episodes.data.map((episode, index) => {
              return (
                <Episode
                  key={index}
                  episode={episode}
                  name={episode.title ?? "Episode " + episode.number}
                />
              );
            })
          ) : (
            <div>Error</div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="relations" className="flex-1 outline-none">
        {relations ? (
          <Relations relations={relations} />
        ) : (
          <RelationsSkeleton />
        )}
      </TabsContent>
    </Tabs>
  );
}

function Relations({
  relations,
}: {
  relations: AnimeDetailsRes["data"]["relations"];
}) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-8">
      {relations.map((rel, index) => {
        return (
          <div
            key={index}
            className="text-card-foreground flex flex-col rounded-none border-none bg-card-none shadow-none relative gap-0 py-0"
          >
            <div className="relative aspect-[640/960]">
              <Link
                to={"/anime/" + rel.id}
                className="flex flex-col absolute size-full border-none"
              >
                {rel.poster && (
                  <div className="relative">
                    <picture className="relative">
                      <img
                        sizes="100vw"
                        className="transition-all hover:scale-105 object-cover size-full"
                        alt={rel.name}
                        loading="lazy"
                        srcSet={`${IMAGE_BASE + rel.poster.resized["1560x2340"]} 1560w, ${IMAGE_BASE + rel.poster.resized["640x960"]} 640w, ${IMAGE_BASE + rel.poster.resized["480x720"]} 480w, ${IMAGE_BASE + rel.poster.resized["240x360"]} 240w, `}
                        src={IMAGE_BASE + rel.poster.resized["1560x2340"]}
                      ></img>
                    </picture>
                  </div>
                )}
              </Link>
            </div>
            <CardContent className="space-y-1 b-0 p-0 mt-3">
              <div className="line-clamp-1 break-all text-[12px] uppercase font-medium">
                {rel.name}
              </div>
              <div className="line-clamp-1 break-all text-[9px] uppercase text-muted-foreground">
                {rel.relation}
              </div>
            </CardContent>
          </div>
        );
      })}
    </div>
  );
}

function RelationsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-8">
      <div className="text-card-foreground flex flex-col rounded-none border-none bg-card-none shadow-none relative gap-0 py-0">
        <Skeleton className="relative aspect-[640/960]"></Skeleton>
        <CardContent className="space-y-1 b-0 p-0 mt-3">
          <Skeleton className="w-fit *:invisible">
            <div className="line-clamp-1 break-all text-[12px] uppercase font-medium *:invisible">
              Lorem ipsum dolor sit amet.
            </div>
          </Skeleton>
          <Skeleton className="*:invisible w-fit">
            <div className="line-clamp-1 break-all text-[9px] uppercase text-muted-foreground w-fit ">
              Prequel
            </div>
          </Skeleton>
        </CardContent>
      </div>
      <div className="text-card-foreground flex flex-col rounded-none border-none bg-card-none shadow-none relative gap-0 py-0">
        <Skeleton className="relative aspect-[640/960]"></Skeleton>
        <CardContent className="space-y-1 b-0 p-0 mt-3">
          <Skeleton className="w-fit *:invisible">
            <div className="line-clamp-1 break-all text-[12px] uppercase font-medium *:invisible">
              Lorem ipsum dolor sit amet.
            </div>
          </Skeleton>
          <Skeleton className="*:invisible w-fit">
            <div className="line-clamp-1 break-all text-[9px] uppercase text-muted-foreground w-fit ">
              Prequel
            </div>
          </Skeleton>
        </CardContent>
      </div>
    </div>
  );
}
