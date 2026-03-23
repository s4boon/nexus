import Hero from "./components/Hero";

export type FeaturedRes = {
  data: Array<{
    id: string;
    slug: string;
    name: string;
    name_alt: any;
    logo: {
      resized: {
        large: string;
        medium: string;
        small: string;
      };
      resized_blur: {
        large: string;
        medium: string;
        small: string;
      };
    };
    poster: {
      resized: {
        "1560x2340": string;
        "640x960": string;
        "480x720": string;
        "240x360": string;
      };
      resized_blur: {
        "1560x2340": string;
        "640x960": string;
        "480x720": string;
        "240x360": string;
      };
    };
    description: string;
    background: {
      resized: {
        "3840x2160": string;
        "1920x1080": string;
        "1360x768": string;
        "960x540": string;
      };
      resized_blur: {
        "3840x2160": string;
        "1920x1080": string;
        "1360x768": string;
        "960x540": string;
      };
    };
    release_date: string;
    genres: Array<{
      id: string;
      name: string;
      code: string;
    }>;
    backdrop?: {
      resized: {
        "3840x1524": string;
        "1920x762": string;
        "1360x540": string;
        "960x380": string;
      };
      resized_blur: {
        "3840x1524": string;
        "1920x762": string;
        "1360x540": string;
        "960x380": string;
      };
    };
  }>;
};

export default function App() {
  return (
    <>
      <Hero />
      <div>qsqss</div>
    </>
  );
  // <div className="text-foreground">
  //   {data?.map((entry, index) => (
  //     <picture key={index}>
  //       <source
  //         media="(max-width: 768px)"
  //         srcSet={
  //           "https://anime.delivery" + entry.background.resized["960x540"]
  //         }
  //         sizes="100vw"
  //       />
  //       <source
  //         media="(max-width: 1024px)"
  //         srcSet={
  //           "https://anime.delivery" + entry.background.resized["1360x768"]
  //         }
  //         sizes="100vw"
  //       />
  //       <source
  //         media="(max-width: 1920px)"
  //         srcSet={
  //           "https://anime.delivery" + entry.background.resized["1920x1080"]
  //         }
  //         sizes="100vw"
  //       />
  //       <source
  //         media="(min-width: 1921px)"
  //         srcSet={
  //           "https://anime.delivery" + entry.background.resized["3840x2160"]
  //         }
  //         sizes="100vw"
  //       />
  //       <img src={entry.poster.resized["1560x2340"]} alt={entry.name} />
  //     </picture>
  //   ))}
  // </div>
}
