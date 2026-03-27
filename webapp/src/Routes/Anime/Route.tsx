import { EpisodeSkeleton } from "@/components/Latest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { AnimeDetailsRes, LoadingStatus, StatsRes } from "@/types";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  ListOrdered,
  Play,
  Plus,
  Star,
  Users,
  ZoomIn,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import NotFound from "../NotFound";

type Props = {};

export default function AnimeDetails({}: Props) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [currentEpisode, setCurrentEpisode] = useState<number>();
  const [modalOpen, setModalOpen] = useState(false);
  const [animeDetails, AnimeDetails] = useState<AnimeDetailsRes["data"]>();
  const navigate = useNavigate();

  if (!id) {
    return <NotFound />;
  }

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

  async function fetchAnimeDetails(id: string) {
    try {
      const includes = [
        "background",
        "poster",
        "relations",
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
        return;
      }
      const json = await res.json();

      console.log(json);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchAnimeDetails(id);
    return () => {};
  }, []);

  return (
    <div className="relative flex-1">
      <Background />

      <div className="container md:pt-30 pb-4 px-4 lg:px-8 xl:px-4 mx-auto relative">
        <div className="grid grid-cols-5 grid-flow-col-dense gap-4">
          <Dialog
            open={modalOpen}
            onOpenChange={(open) => {
              setModalOpen(open);
              navigate({ search: "" }, { replace: true });
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>{currentEpisode}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <SideCard />
          <div className="col-span-5 xl:col-span-4 flex flex-col gap-2">
            <Title />
            <StatsContainer id={id} />
            <Description />
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

function Background() {
  return (
    <>
      <figure>
        <div className="absolute max-h-[600px] lg:max-h-none lg:fixed inset-0">
          <picture className="relative">
            <source srcSet="https://anime.delivery/UyiSLzC4KEr0GzAJD7m3znx87_s7OFLUK9YNbczzkbA/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 1560w, https://anime.delivery/aG59QqYR_QF485_sYFr5hkKcjT-3gXcdwJbOca2rwEc/rs:fill/q:70/w:640/h:960/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 640w, https://anime.delivery/RSJaWIcFk8lUqsz3DI1oF-cOJIOeTZn3j8nIP4wQRk8/rs:fill/q:70/w:480/h:720/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 480w, https://anime.delivery/gHZyWcgAL3VVYkKtFlL3Q6o7N9ziDK27GurNv3gu73o/rs:fill/q:70/w:240/h:360/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 240w" />
            <img
              className="size-full object-cover"
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              srcSet="https://anime.delivery/BUgiEQzzkGs1-6lpNnB8AY3JfnDxoGGapEYCy-suMxQ/rs:fill/q:70/w:3840/h:2160/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5OC8zODUv/YjcxLzY5ODM4NWI3/MTAxZWE5ODc2NDQ5/MjMucG5n.avif 3840w, https://anime.delivery/Ci5wyYMeM0Fpp_aYtj7Ny5etqYR535yaQcc-9MOoEbE/rs:fill/q:70/w:1920/h:1080/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5OC8zODUv/YjcxLzY5ODM4NWI3/MTAxZWE5ODc2NDQ5/MjMucG5n.avif 1920w, https://anime.delivery/OadmOtbHXBniLmJMBlIPHlRl5Kr7vHKkdjKOAsi00XU/rs:fill/q:70/w:1360/h:768/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5OC8zODUv/YjcxLzY5ODM4NWI3/MTAxZWE5ODc2NDQ5/MjMucG5n.avif 1360w, https://anime.delivery/WT5qUxvxAQx6AbzGsRLybVxHKEAuORyGFW4HfPyUqt4/rs:fill/q:70/w:960/h:540/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5OC8zODUv/YjcxLzY5ODM4NWI3/MTAxZWE5ODc2NDQ5/MjMucG5n.avif 960w"
              src="https://anime.delivery/BUgiEQzzkGs1-6lpNnB8AY3JfnDxoGGapEYCy-suMxQ/rs:fill/q:70/w:3840/h:2160/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5OC8zODUv/YjcxLzY5ODM4NWI3/MTAxZWE5ODc2NDQ5/MjMucG5n.avif"
              alt="Jujutsu Kaisen: The Culling Game Part 1"
            />
          </picture>
        </div>
      </figure>
      <div className="absolute max-h-[600px] lg:max-h-none lg:fixed inset-0 flex bg-gradient-to-t from-background to-background/82"></div>
    </>
  );
}

function SideCard() {
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
                  srcSet="https://anime.delivery/UyiSLzC4KEr0GzAJD7m3znx87_s7OFLUK9YNbczzkbA/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 1560w, https://anime.delivery/aG59QqYR_QF485_sYFr5hkKcjT-3gXcdwJbOca2rwEc/rs:fill/q:70/w:640/h:960/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 640w, https://anime.delivery/RSJaWIcFk8lUqsz3DI1oF-cOJIOeTZn3j8nIP4wQRk8/rs:fill/q:70/w:480/h:720/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 480w, https://anime.delivery/gHZyWcgAL3VVYkKtFlL3Q6o7N9ziDK27GurNv3gu73o/rs:fill/q:70/w:240/h:360/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 240w"
                  src="https://anime.delivery/UyiSLzC4KEr0GzAJD7m3znx87_s7OFLUK9YNbczzkbA/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif"
                  alt="Jujutsu Kaisen: The Culling Game Part 1"
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
            <Tag key_="Type" value="TV" />
            <Tag key_="Status" value="Currently Airing" />
            <Tag key_="Release" value="January 8, 2026" />
            <Tag key_="Broadcast time" value="5:30" />
            <Tag key_="Episodes" value="11/12" />
            <Tag key_="Rating" value="R - 17+ (violence & profanity)" />
          </div>
          <div className="border-t border-border/50"></div>
          <div className="p-4 space-y-1">
            <TagMulti key_="Themes" values={["school"]} />
            <TagMulti key_="Demographics" values={["Shounen"]} />
          </div>
          <div className="border-t border-border/50"></div>
          <div className="p-4 space-y-1">
            <TagMulti key_="Studios" values={["MAPPA"]} />
            <TagMulti
              key_="Producers"
              values={[
                "Mainichi Broadcasting System",
                "ShueishaToho Music",
                "TOHO animation",
                "dugout",
                "Sumzap",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="mt-20 md:mt-0">
      <div>
        <div className="mb-0 lg:mb-4">
          <div className="flex flex-row items-center justify-center gap-4 lg:gap-6 mb-6">
            <div className="hidden lg:block *:text-accent-foreground">
              <span className="block text-sm lg:text-base xl:text-lg font-bold mb-1">
                Jujutsu Kaisen: Shimetsu Kaiyuu - Zenpen
              </span>
              <h1 className="block font-black leading-none text-base lg:text-2xl xl:text-4xl uppercase">
                Jujutsu Kaisen: The Culling Game Part 1
              </h1>
            </div>
            <div className="mx-auto lg:mr-0 lg:ml-auto">
              <div className="relative max-w-[250px] lg:max-w-[300px]">
                <img
                  className=" drop-shadow-[0_0_3px] dark:filter-none m-auto size-full lg:m-0 object-contain object-[bottom_center]"
                  sizes="(max-width: 960px) 320px, (max-width: 1260px) 480px, 600px"
                  loading="eager"
                  srcSet="https://anime.delivery/4_COQZIuXiQ3XAsdH2lEbXxhn7dJEPDY_Y-BLcuRfNg/rs:fill/q:80/w:600/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NS9lNmMv/MDIwLzY5NWU2YzAy/MGNjZDg2NDM3NjM2/MjQucG5n.avif 600w, https://anime.delivery/dHm5wTtUF-2gy5zLgDJhUFbCNbE-yALisNNqB0otqDY/rs:fill/q:80/w:480/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NS9lNmMv/MDIwLzY5NWU2YzAy/MGNjZDg2NDM3NjM2/MjQucG5n.avif 480w, https://anime.delivery/4Z_ebeuPB26H79A9uFKvC9vD8hWftiU3p6kqQjXESZM/rs:fill/q:80/w:320/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NS9lNmMv/MDIwLzY5NWU2YzAy/MGNjZDg2NDM3NjM2/MjQucG5n.avif 320w"
                  src="https://anime.delivery/4_COQZIuXiQ3XAsdH2lEbXxhn7dJEPDY_Y-BLcuRfNg/rs:fill/q:80/w:600/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NS9lNmMv/MDIwLzY5NWU2YzAy/MGNjZDg2NDM3NjM2/MjQucG5n.avif"
                  alt="Jujutsu Kaisen: The Culling Game Part 1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex flex-wrap gap-3 items-center">
          <Badge variant={"outline"} className="border-primary/20 rounded py-3">
            Action
          </Badge>
          <Badge variant={"outline"} className="border-primary/20 rounded py-3">
            Supernatural
          </Badge>
        </div>
      </div>
      <div className="flex lg:hidden flex-wrap gap-3">
        <Badge variant={"outline"} className="border-primary/20 rounded py-3">
          Action
        </Badge>
        <Badge variant={"outline"} className="border-primary/20 rounded py-3">
          Supernatural
        </Badge>
      </div>
    </div>
  );
}

function StatsContainer({ id }: { id: string }) {
  const [stats, setStats] = useState<StatsRes["data"]>();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("FETCHING");

  async function fetchStats(id: string) {
    try {
      const res = await fetch(
        "http://proxy.localhost:1323/api/anime/details/statistics?id=" + id,
      );
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as StatsRes;
      setStats(json.data);
      setLoadingStatus("FINISHED");
      return;
    } catch (error) {
      console.log(error);
      setLoadingStatus("ERROR");
      return;
    }
  }

  useEffect(() => {
    fetchStats(id);
  }, []);

  return (
    <div className="md:mb-4 flex flex-wrap items-center gap-2">
      <div className="flex gap-2 items-center">
        <div className="min-w-fit max-w-[200px]">
          <Button variant={"secondary"} className="gap-2">
            <Plus className="w-4 h-4" />
            Add to Collection
          </Button>
        </div>
        <Button variant={"secondary"} className="text-muted-foreground">
          <Heart className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex gap-1.5 items-center">
        <Button className="px-2 rounded-full w-9 h-9 bg-[#02a9ff]/20 hover:bg-[#02a9ff]/60 shadow-none">
          <svg viewBox="0 0 512 512">
            <path
              d="M321.92 323.27V136.6c0-10.698-5.887-16.602-16.558-16.602h-36.433c-10.672 0-16.561 5.904-16.561 16.602v88.651c0 2.497 23.996 14.089 24.623 16.541 18.282 71.61 3.972 128.92-13.359 131.6 28.337 1.405 31.455 15.064 10.348 5.731 3.229-38.209 15.828-38.134 52.049-1.406.31.317 7.427 15.282 7.87 15.282h85.545c10.672 0 16.558-5.9 16.558-16.6v-36.524c0-10.698-5.886-16.602-16.558-16.602z"
              fill="#02a9ff"
            ></path>
            <path
              d="M170.68 120 74.999 393h74.338l16.192-47.222h80.96L262.315 393h73.968l-95.314-273zm11.776 165.28 23.183-75.629 25.393 75.629z"
              fill="#fefefe"
            ></path>
          </svg>
        </Button>
        <Button className="px-2 rounded-full w-9 h-9 bg-[#2e51a2]/20 hover:bg-[#2e51a2]/60 shadow-none">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#2e51a2"
              d="M8.273 7.247v8.423l-2.103-.003v-5.216l-2.03 2.404-1.989-2.458-.02 5.285H.001L0 7.247h2.203l1.865 2.545 2.015-2.546 2.19.001zm8.628 2.069l.025 6.335h-2.365l-.008-2.871h-2.8c.07.499.21 1.266.417 1.779.155.381.298.751.583 1.128l-1.705 1.125c-.349-.636-.622-1.337-.878-2.082a9.296 9.296 0 0 1-.507-2.179c-.085-.75-.097-1.471.107-2.212a3.908 3.908 0 0 1 1.161-1.866c.313-.293.749-.5 1.1-.687.351-.187.743-.264 1.107-.359a7.405 7.405 0 0 1 1.191-.183c.398-.034 1.107-.066 2.39-.028l.545 1.749H14.51c-.593.008-.878.001-1.341.209a2.236 2.236 0 0 0-1.278 1.92l2.663.033.038-1.81h2.309zm3.992-2.099v6.627l3.107.032-.43 1.775h-4.807V7.187l2.13.03z"
            ></path>
          </svg>
        </Button>
      </div>
      {loadingStatus === "FETCHING" ? (
        <>
          <StatsSkeleton />
          <StatsMobileSkeleton />
        </>
      ) : loadingStatus === "FINISHED" ? (
        stats && (
          <>
            <Stats {...stats} />
            <StatsMobile {...stats} />
          </>
        )
      ) : null}
    </div>
  );
}

function Stats({ average, weighted }: StatsRes["data"]) {
  return (
    <div className="ml-auto hidden md:block">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Star className="h-5 w-5 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-accent-foreground">
              {average.score}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="font-medium">{average.users}</span>
              <span className="uppercase">Average</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Star className="h-5 w-5 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-accent-foreground">
              {weighted.score}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="font-medium">{weighted.users}</span>
              <span className="uppercase">Weighted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <Skeleton className="ml-auto hidden md:block w-100">
      <div className="flex items-center gap-3 invisible">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Star className="h-5 w-5 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-accent-foreground">
              &nbsp;
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="font-medium">&nbsp;</span>
              <span className="uppercase">&nbsp;</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Star className="h-5 w-5 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-accent-foreground">
              &nbsp;
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="font-medium">&nbsp;</span>
              <span className="uppercase">&nbsp;</span>
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}

function StatsMobile({ average, weighted }: StatsRes["data"]) {
  return (
    <div className="block md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-border/50 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Star className="h-4 w-4 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-accent-foreground">
              {average.score}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase flex gap-x-1">
              <span className="font-medium">{average.users}</span> Avg
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-border/50 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Star className="h-4 w-4 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-accent-foreground">
              {weighted.score}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase flex gap-x-1">
              <span className="font-medium">{weighted.users}</span> Wtd
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatsMobileSkeleton() {
  return (
    <Skeleton className="block md:hidden w-50">
      <div className="flex items-center gap-2 invisible">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-border/50 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Star className="h-4 w-4 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-accent-foreground">
              &nbsp;
            </div>
            <div className="text-[10px] text-muted-foreground uppercase">
              <span className="font-medium">&nbsp;</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-border/50 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Star className="h-4 w-4 text-primary fill-primary" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-accent-foreground">
              &nbsp;
            </div>
            <div className="text-[10px] text-muted-foreground uppercase">
              <span className="font-medium">&nbsp;</span>
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}

function Description() {
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
                Kenjaku, the one known as Noritoshi Kamo and most recently as
                Suguru Getou, has initiated the next step in his destructive,
                thousand-year plan of ordinary humans' evolution and eventual
                eradication. The jujutsu world higher-ups reinstate 15-year-old
                Yuuji Itadori's execution, as Satoru Gojou is incapacitated as a
                result of Kenjaku's master plan in Shibuya. While Yuuji is
                unaware of this, he patrols the abandoned Tokyo streets with
                Chousou, exterminating any and all cursed spirits in his way.
                Meanwhile, the bigoted and arrogant Naoya Zenin's pride takes a
                hit when Megumi Fushiguro is selected as the Zenin Clan's next
                head. To draw out Megumi and eliminate him, he goes after
                Yuuji—but Yuuta Okkotsu is set on being Yuuji's executioner.
                Kenjaku's "Culling Game"—a rigorous battle royale spanning
                throughout Japan and forcing the jujutsu competitors to kill
                each other—is set in motion, and the young jujutsu sorcerers
                join the fray to settle old scores, free Gojou, and liberate the
                jujutsu world from the threat that is Kenjaku.
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

function EpisodesAndRelations() {
  const [perPage, setPerPage] = useState("24");
  const [sortBy, setSortBy] = useState("asc");
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
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant={"outline"}
              className="text-accent-foreground h-8 w-8 p-0"
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
          {/* <Episode  /> */}
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <EpisodeSkeleton />
        </div>
      </TabsContent>
      <TabsContent value="relations" className="flex-1 outline-none">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-8">
          <div className="text-card-foreground flex flex-col rounded-none border-none bg-card-none shadow-none relative gap-0 py-0">
            <div className="relative aspect-[640/960]">
              <Link
                to={"#"}
                className="flex flex-col absolute size-full border-none"
              >
                <div className="relative">
                  <picture className="relative">
                    <img
                      sizes="100vw"
                      className="transition-all hover:scale-105 object-cover size-full"
                      alt="Jujutsu Kaisen: Shibuya Incident"
                      loading="lazy"
                      srcSet="https://anime.delivery/rHjPehi-5WOnJRv9LD6LHBYuvz9FHWfrDCUjJmzf1sM/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY0Yy82MzUv/ZTFlLzY0YzYzNWUx/ZWExZmIyOTAzOTM1/MTEucG5n.avif 1560w, https://anime.delivery/NVG1doa_-uFVu4nxgHraR-j8mvAculEMTNWuo7hFsAg/rs:fill/q:70/w:640/h:960/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY0Yy82MzUv/ZTFlLzY0YzYzNWUx/ZWExZmIyOTAzOTM1/MTEucG5n.avif 640w, https://anime.delivery/6S5GbK5MB2b6p4myqW0KYlNpVHK5IqjDwxyzjDhx4sg/rs:fill/q:70/w:480/h:720/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY0Yy82MzUv/ZTFlLzY0YzYzNWUx/ZWExZmIyOTAzOTM1/MTEucG5n.avif 480w, https://anime.delivery/2OS7F7BYlABRDtMlAUEDE9bwPx2FFiTdlmusVc0srNo/rs:fill/q:70/w:240/h:360/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY0Yy82MzUv/ZTFlLzY0YzYzNWUx/ZWExZmIyOTAzOTM1/MTEucG5n.avif 240w"
                      src="https://anime.delivery/rHjPehi-5WOnJRv9LD6LHBYuvz9FHWfrDCUjJmzf1sM/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY0Yy82MzUv/ZTFlLzY0YzYzNWUx/ZWExZmIyOTAzOTM1/MTEucG5n.avif"
                    ></img>
                  </picture>
                </div>
              </Link>
            </div>
            <CardContent className="space-y-1 b-0 p-0 mt-3">
              <div className="line-clamp-1 break-all text-[12px] uppercase font-medium">
                Jujutsu Kaisen: Shibuya Incident
              </div>
              <div className="line-clamp-1 break-all text-[9px] uppercase text-muted-foreground">
                Prequel
              </div>
            </CardContent>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function Page() {
  return (
    <div className="relative flex-1">
      <Background />

      <div className="container md:pt-30 pb-4 px-4 lg:px-8 xl:px-4 mx-auto relative">
        <div className="grid grid-cols-5 grid-flow-col-dense gap-4">
          <SideCard />
          <div className="col-span-5 xl:col-span-4 flex flex-col gap-2">
            <Title />
            {/* <StatsContainer /> */}
            <Description />
            <EpisodesAndRelations />
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadDialog() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => {
        setModalOpen(open);
        navigate({ search: "" }, { replace: true });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>{}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
