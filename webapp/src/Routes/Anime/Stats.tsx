import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LoadingStatus, StatsRes } from "@/types";
import { Heart, Plus, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsContainer({ id }: { id: string }) {
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
