import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Edge, LatestRes, LoadingStatus, StreamRes } from "@/types";
import { Loader2 } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";

const IMAGE_BASE = import.meta.env.VITE_BASE_IMAGE_URL;

type ModalOptions = {
  open: boolean;
  data?: LatestRes["data"][number];
};

type DispatchActions =
  | { type: "OPEN_MODAL"; payload: LatestRes["data"][number] }
  | { type: "CLOSE_MODAL" };

function reducer(state: ModalOptions, action: DispatchActions): ModalOptions {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, open: true, data: action.payload };
    case "CLOSE_MODAL":
      return { ...state, open: false };
    default:
      return state;
  }
}

const ModalContext = createContext<
  | {
      modalOptions: ModalOptions;
      modalDispatch: React.ActionDispatch<[action: DispatchActions]>;
    }
  | undefined
>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [subs, setSubs] = useState<string[]>([]);
  const [dubs, setDubs] = useState<string[]>([]);
  const [resolution, setResolution] = useState<string | null>(null);
  const [segments, setSegments] = useState(false);
  const [stream, setStream] = useState<StreamRes["data"]>();
  const [selectedEdge, setSelectedEdge] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("FETCHING");
  const [downloadingStatus, setDownloadingStatus] = useState<
    "DOWNLOADING" | "FINISHED"
  >("FINISHED");
  const [modalOptions, modalDispatch] = useReducer(reducer, { open: false });
  const value = { modalOptions, modalDispatch };

  async function fetchStream(id: string) {
    try {
      setLoadingStatus("FETCHING");
      const res = await fetch(
        "http://proxy.localhost:1323/api/anime/details/episode/stream?id=" + id,
      );
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as StreamRes;
      setStream(json.data);
      setLoadingStatus("FINISHED");
      console.log(json);
      return;
    } catch (error) {
      setLoadingStatus("ERROR");
      console.log(error);
      return;
    }
  }

  async function download(req: DownloadRequest) {
    try {
      setDownloadingStatus("DOWNLOADING");
      const body = JSON.stringify(req);
      console.log(body);
      const res = await fetch("http://api.localhost:1323/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      if (!res.ok) {
        console.log("Download request failed");
        setDownloadingStatus("FINISHED");
        return;
      }
      const json = await res.json();
      console.log(json);
      setDownloadingStatus("FINISHED");
      return;
    } catch (error) {
      console.log(error);
      setDownloadingStatus("FINISHED");
      return;
    }
  }

  useEffect(() => {
    if (modalOptions.data) {
      fetchStream(modalOptions.data.episode.id);
    }
  }, [modalOptions]);

  return (
    <ModalContext.Provider value={value}>
      <Dialog
        modal={true}
        open={modalOptions.open}
        onOpenChange={(open) => {
          if (!open) {
            modalDispatch({ type: "CLOSE_MODAL" });
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="grid gap-2 grid-cols-6 rounded-sm"
        >
          <DialogHeader className="col-span-6">
            <DialogTitle className="uppercase text-muted-foreground text-[10px] tracking-widest">
              Download
            </DialogTitle>
            <DialogDescription asChild className="text-foreground w-full">
              <div className=" grid grid-cols-10 gap-1.5">
                <div className="col-span-9 pr-5">
                  <h1 className="truncate font-bold">
                    {modalOptions.data?.name}
                  </h1>
                  <div className="truncate text-xs">
                    {modalOptions.data?.name_alt}
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-end text-lg w-full">
                  <h1 className="w-fit font-bold">
                    {modalOptions.data?.episode.number}
                  </h1>
                </div>
              </div>
            </DialogDescription>
            <Separator className="w-full" />
          </DialogHeader>
          <div className="col-span-6 grid grid-cols-12 gap-1">
            <div className="col-span-12 p-1 rounded border border-border grid grid-cols-10 gap-2">
              <img
                className="object-cover col-span-2"
                src={
                  IMAGE_BASE +
                  modalOptions.data?.episode.image.resized["640x360"]
                }
                alt=""
              />
              <Input
                defaultValue={
                  modalOptions.data?.name +
                  " EP" +
                  modalOptions.data?.episode.number +
                  ".mp4"
                }
                className="col-span-8 rounded-none focus-visible:ring-0 border-0 focus-visible:border-0 bg-purple-500"
              />
            </div>
            <h5 className="text-[10px] px-1.5 my-1 tracking-widest text-muted-foreground">
              Options:
            </h5>
            <div className="col-span-full grid grid-cols-6 gap-2 px-3 max-h-32 overflow-y-scroll">
              <div className="col-span-3 space-y-1">
                <span className="text-xs text-muted-foreground">
                  Audio Languages:
                </span>
                {modalOptions.data?.episode.video_meta.audio_languages.map(
                  (lang, i) => {
                    return (
                      <div
                        className="w-full px-2 rounded-sm flex even:bg-accent justify-between"
                        key={i}
                      >
                        <label
                          htmlFor={lang}
                          className="truncate text-sm rounded-sm w-[80%] p-1"
                        >
                          {lang}
                        </label>
                        <input
                          type="checkbox"
                          id={lang}
                          value={lang}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDubs((prev) => [...prev, lang]);
                            } else {
                              setDubs((prev) =>
                                prev.filter((item) => item !== lang),
                              );
                            }
                          }}
                        />
                      </div>
                    );
                  },
                )}
              </div>
              <div className="col-span-3 relative space-y-1">
                <span className="text-xs text-muted-foreground">
                  Subtitles:
                </span>
                {modalOptions.data?.episode.video_meta.subtitle_languages.map(
                  (sub, i) => {
                    return (
                      <div
                        className="w-full px-2 rounded-sm flex even:bg-accent justify-between"
                        key={i}
                      >
                        <label
                          htmlFor={sub}
                          className="truncate text-sm w-[80%] p-1"
                        >
                          {sub}
                        </label>
                        <input
                          type="checkbox"
                          id={sub}
                          value={sub}
                          onChange={(e) => {
                            if (e.currentTarget.checked) {
                              setSubs((prev) => [...prev, sub]);
                            } else {
                              setSubs((prev) =>
                                prev.filter((item) => item !== sub),
                              );
                            }
                          }}
                        />
                      </div>
                    );
                  },
                )}
              </div>
            </div>
            <Separator className="col-span-full my-2" />
            <div className="col-span-full grid grid-cols-6 gap-6 px-3 max-h-32 overflow-y-scroll">
              <div className="col-span-3 space-y-1">
                <span className="text-xs text-muted-foreground">Quality:</span>
                <Select
                  disabled={loadingStatus !== "FINISHED" || !stream}
                  onValueChange={(value) => {
                    setResolution(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Resolution" />
                  </SelectTrigger>

                  <SelectContent>
                    {stream && (
                      <SelectGroup>
                        {Object.entries(
                          stream.video_meta.file_size_streams,
                        ).map(([quality, size]) => {
                          return (
                            <SelectItem
                              key={quality}
                              value={quality}
                              className="flex w-full justify-between"
                            >
                              <div>
                                {quality.substring(quality.indexOf("x") + 1)}p
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {(size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 space-y-1">
                <span className="text-xs text-muted-foreground">Edges:</span>
                <Edges setSelectedEdge={setSelectedEdge} />
              </div>
            </div>
            <div className="col-span-full grid grid-cols-6 gap-6 px-3 max-h-32 overflow-y-scroll">
              <div className="col-span-3 space-y-1">
                <span className="text-xs text-muted-foreground">Misc:</span>
                <div className="w-full px-2 rounded-sm flex even:bg-accent justify-between">
                  <label
                    htmlFor="segments"
                    className="truncate text-sm w-[80%] p-1"
                  >
                    Save Segments
                  </label>
                  <input
                    type="checkbox"
                    id="segments"
                    value="segments"
                    checked={segments}
                    onChange={(e) => setSegments(e.currentTarget.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="h-fit col-span-6 py-3">
            <div className="flex gap-x-2.5">
              <Button
                variant={"secondary"}
                className="focus-visible:bg-destructive/10 text-destructive focus-visible:border-destructive focus-visible:ring-0"
                onClick={() => modalDispatch({ type: "CLOSE_MODAL" })}
              >
                Cancel
              </Button>
              <Button
                variant={"secondary"}
                className="focus-visible:bg-purple-500/10 text-purple-500 focus-visible:border-purple-500 focus-visible:ring-0"
                disabled={
                  downloadingStatus === "DOWNLOADING" ||
                  loadingStatus !== "FINISHED" ||
                  !stream ||
                  dubs.length === 0 ||
                  !resolution
                }
                onClick={async () => {
                  await download({
                    anime_id: modalOptions.data!.id,
                    anime_name: modalOptions.data!.name,
                    anime_alt_name: modalOptions.data!.name_alt,
                    filename: `${modalOptions.data!.name}.${modalOptions.data!.episode}.${resolution}.mp4`, //TODO: use provided filename
                    episode_id: modalOptions.data!.episode.id,
                    episode_number: modalOptions.data!.episode.number,
                    slug: modalOptions.data!.episode.slug,
                    dubs: dubs,
                    subs: subs,
                    quality: resolution!,
                    segments,
                    stream: stream!,
                    edge: selectedEdge,
                  });
                }}
              >
                {downloadingStatus === "DOWNLOADING" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Download"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {children}
    </ModalContext.Provider>
  );
}

type DownloadRequest = {
  anime_id: string;
  anime_name: string;
  anime_alt_name: string;
  episode_id: string;
  episode_number: number;
  filename: string;
  slug: string;
  dubs: string[];
  subs: string[];
  quality: string;
  segments: boolean;
  stream: StreamRes["data"];
  edge?: string;
};

function Edges({
  setSelectedEdge,
}: {
  setSelectedEdge: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("FETCHING");

  async function fetchEdges() {
    try {
      setLoadingStatus("FETCHING");
      const res = await fetch("http://api.localhost:1323/edges");
      if (!res.ok) {
        setLoadingStatus("ERROR");
        return;
      }
      const json = (await res.json()) as Edge[];
      setEdges(json);
      setLoadingStatus("FINISHED");
      return;
    } catch (error) {
      setLoadingStatus("ERROR");
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchEdges();
  }, []);

  return (
    <Select
      disabled={loadingStatus !== "FINISHED" || !edges || edges.length === 0}
      onValueChange={(value) => {
        setSelectedEdge(value);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Edge" />
      </SelectTrigger>

      <SelectContent className="w-full">
        {edges && (
          <SelectGroup className="w-full">
            {edges
              .toSorted((a, b) => a.id.localeCompare(b.id))
              .map((edge, index) => {
                return (
                  <SelectItem key={index} value={edge.host}>
                    <div>
                      {edge.location.substring(0, edge.location.indexOf(","))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {edge.id}
                    </div>
                  </SelectItem>
                );
              })}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ThemeProvider");
  }
  return context;
}
