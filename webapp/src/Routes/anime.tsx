import { useEffect } from "react";
import { useParams } from "react-router";
import NotFound from "./NotFound";

type Props = {};

export default function anime({}: Props) {
  const { id } = useParams();

  if (!id) {
    return <NotFound />;
  }

  async function fetchDetails(id: string) {
    try {
      const res = await fetch(
        "http://proxy.localhost:1323/api/anime/details?id=" +
          id +
          "&includes[]=relations&includes[]=poster",
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
    fetchDetails(id);
    return () => {};
  }, []);

  return <div className="text-foreground">{id}</div>;
}
