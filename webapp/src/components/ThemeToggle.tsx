import { useTheme } from "@/lib/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

type Props = {};

export default function ToggleTheme({}: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded"
      onClick={() => {
        if (resolvedTheme === "light") setTheme("dark");
        else if (resolvedTheme === "dark") setTheme("light");
      }}
    >
      {resolvedTheme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
}
