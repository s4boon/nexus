import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LatestRes } from "@/types";
import {
  createContext,
  useContext,
  useReducer,
  useState,
  type ReactNode,
} from "react";

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
  const [open, setOpen] = useState<boolean>(false);
  const [modalOptions, modalDispatch] = useReducer(reducer, { open: false });
  const value = { modalOptions, modalDispatch };
  return (
    <ModalContext.Provider value={value}>
      <Dialog
        open={modalOptions.open}
        onOpenChange={(open) => {
          if (!open) {
            modalDispatch({ type: "CLOSE_MODAL" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalOptions.data?.name}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ThemeProvider");
  }
  return context;
}
