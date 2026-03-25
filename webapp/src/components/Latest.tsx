import {
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Eye,
  MessageSquareMore,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

export default function Latest() {
  return (
    <div className="xl:container px-0 xl:px-12 mx-auto relative pt-8">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-full xl:col-span-3">
          <LatestHeader />
          <div className="hidden xl:grid gap-4 grid-cols-2 xl:grid-cols-5">
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
            <EpisodeGrid />
          </div>
          <div className="flex xl:hidden px-4">
            <div className="overflow-x-scroll">
              <div className="flex mb-6 gap-4">
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
                <div className="flex-[0_0_200px] xl:flex-[0_0_300px] w-[200px] xl:w-[300px]">
                  <EpisodeGrid />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full xl:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 xl:px-0">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-md font-semibold tracking-tight text-foreground">
                    Popular Shows
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Trending by views
                  </p>
                </div>
              </div>
              <Select defaultValue="day">
                <SelectTrigger className="w-[110px] px-2 rounded text-foreground">
                  <SelectValue
                    placeholder="Period"
                    className="text-foreground"
                  />
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
                <PopularEntry />
                <PopularEntry />
                <PopularEntry />
                <PopularEntry />
                <PopularEntry />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LatestHeader() {
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
        <div className="hidden xl:flex items-center gap-x-1">
          <Button className="text-accent-foreground" variant={"ghost"}>
            <ArrowLeft />
          </Button>
          <span className="text-foreground">0/0</span>
          <Button className="text-accent-foreground" variant={"ghost"}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EpisodeGrid() {
  return (
    <div className="relative">
      <div className="overflow-hidden group block relative aspect-[640/360] transition-all hover:scale-105 rounded-md">
        <figure>
          <div className="absolute w-full h-full">
            <picture className="relative">
              <img
                className="size-full object-cover"
                sizes="(min-width: 135em) 274px, (min-width: 107.5em) 320px, (min-width: 50em) 384px, (min-width: 35.5em) 480px, (min-width: 30em) 640px, 50vw"
                srcSet="https://anime.delivery/f4VId1NxZ60a_Wh_DxsqDebWxMlF3FG6F5mcP5ANCL8/rs:fill/q:70/w:1920/h:1080/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvZXBpc29kZXMv/cHVibGljLzY5Yy8y/Y2QvMjc1LzY5YzJj/ZDI3NTQxNDU3ODkw/OTI1MDcuanBn.avif 1920w, https://anime.delivery/D0FofRs22gBZg5wSSuZMS1smnzB4TCjRmIGwc2r5EHc/rs:fill/q:70/w:1280/h:720/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvZXBpc29kZXMv/cHVibGljLzY5Yy8y/Y2QvMjc1LzY5YzJj/ZDI3NTQxNDU3ODkw/OTI1MDcuanBn.avif 1280w, https://anime.delivery/2fvz_n-8JjCKTTGfBtClNCb6yG8Uj4MWZOsKVJcLKZQ/rs:fill/q:70/w:1024/h:576/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvZXBpc29kZXMv/cHVibGljLzY5Yy8y/Y2QvMjc1LzY5YzJj/ZDI3NTQxNDU3ODkw/OTI1MDcuanBn.avif 1024w, https://anime.delivery/U6K0J3U_-tJLJUwJnEfG-1sdzDxvIMWcTE-1xxxvsUU/rs:fill/q:70/w:640/h:360/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvZXBpc29kZXMv/cHVibGljLzY5Yy8y/Y2QvMjc1LzY5YzJj/ZDI3NTQxNDU3ODkw/OTI1MDcuanBn.avif 640w"
                src="https://anime.delivery/f4VId1NxZ60a_Wh_DxsqDebWxMlF3FG6F5mcP5ANCL8/rs:fill/q:70/w:1920/h:1080/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvZXBpc29kZXMv/cHVibGljLzY5Yy8y/Y2QvMjc1LzY5YzJj/ZDI3NTQxNDU3ODkw/OTI1MDcuanBn.avif"
              ></img>
            </picture>
          </div>
        </figure>
        <Link
          to={"#"}
          className="absolute w-full h-full"
          title="The Case Book of Arne"
        ></Link>
        <Badge className="absolute shadow-none top-0 start-0 bg-black/50 text-white m-1 h-6 text-xs rounded-none rounded-br-md rounded-tl-md pointer-events-none">
          22:59
        </Badge>
        <Badge className="absolute shadow-none bottom-2 left-0 bg-black/50 text-white m-1 text-xs rounded-none rounded-bl-md rounded-tr-md">
          <MessageSquareMore className="w-4 h-4 inline-block" /> 0
        </Badge>
      </div>
      <div className="pt-3">
        <div className="text-xs uppercase mb-1"></div>
        <Link
          to={"#"}
          className="truncate max-h-12 block text-sm text-foreground"
          title="The Case Book of Arne"
        >
          The Case Book of Arne
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
                9
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
                1
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

function PopularEntry() {
  return (
    <div className="group relative flex gap-4 p-3 mb-2 rounded-md transition-all duration-300 hover:bg-card/50 hover:backdrop-blur-sm">
      <div className="absolute -left-1 top-3 z-10 flex h-7 w-7 items-center justify-center">
        <div className="text-2xl font-bold text-yellow-500">1</div>
      </div>
      <Link
        to={"#"}
        className="relative ml-6 aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105"
      >
        <div className="relative size-full object-cover">
          <picture className="relative">
            <img
              className="size-full object-fit"
              sizes="80px"
              srcSet="https://anime.delivery/UyiSLzC4KEr0GzAJD7m3znx87_s7OFLUK9YNbczzkbA/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 1560w, https://anime.delivery/aG59QqYR_QF485_sYFr5hkKcjT-3gXcdwJbOca2rwEc/rs:fill/q:70/w:640/h:960/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 640w, https://anime.delivery/RSJaWIcFk8lUqsz3DI1oF-cOJIOeTZn3j8nIP4wQRk8/rs:fill/q:70/w:480/h:720/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 480w, https://anime.delivery/gHZyWcgAL3VVYkKtFlL3Q6o7N9ziDK27GurNv3gu73o/rs:fill/q:70/w:240/h:360/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif 240w"
              src="https://anime.delivery/UyiSLzC4KEr0GzAJD7m3znx87_s7OFLUK9YNbczzkbA/rs:fill/q:70/w:1560/h:2340/aHR0cHM6Ly9hc3Nl/dHMuYW5pbWUubmV4/dXMvc3RvcmFnZS9h/cHAvc2hvd3MvcHVi/bGljLzY5NC82OWMv/YzFjLzY5NDY5Y2Mx/Y2M2MWI4MjQ5ODMz/OTcucG5n.avif"
              alt="Jujutsu Kaisen: The Culling Game Part 1"
              loading="lazy"
            />
          </picture>
        </div>
        <div className="absolute inset-0 rounded-md ring-2 ring-inset ring-yellow-500/30"></div>
      </Link>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <Link
          to={"#"}
          className="font-medium text-foreground text-sm line-clamp-1 hover:text-primary transition-colors"
        >
          Jujutsu Kaisen: The Culling Game Part 1
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          Kenjaku, the one known as Noritoshi Kamo and most recently as Suguru
          Getou, has initiated the next step in his destructive, thousand-year
          plan of ordinary humans' evolution and eventual eradication. The
          jujutsu world higher-ups reinstate 15-year-old Yuuji Itadori's
          execution, as Satoru Gojou is incapacitated as a result of Kenjaku's
          master plan in Shibuya. While Yuuji is unaware of this, he patrols the
          abandoned Tokyo streets with Chousou, exterminating any and all cursed
          spirits in his way. Meanwhile, the bigoted and arrogant Naoya Zenin's
          pride takes a hit when Megumi Fushiguro is selected as the Zenin
          Clan's next head. To draw out Megumi and eliminate him, he goes after
          Yuuji—but Yuuta Okkotsu is set on being Yuuji's executioner. Kenjaku's
          "Culling Game"—a rigorous battle royale spanning throughout Japan and
          forcing the jujutsu competitors to kill each other—is set in motion,
          and the young jujutsu sorcerers join the fray to settle old scores,
          free Gojou, and liberate the jujutsu world from the threat that is
          Kenjaku.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span>18,281</span>
          </div>
        </div>
      </div>
    </div>
  );
}
