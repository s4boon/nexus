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

export type LatestRes = {
  data: Array<{
    id: string;
    slug: string;
    name: string;
    name_alt: string;
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
    episode: {
      id: string;
      title: any;
      slug: string;
      number: number;
      duration: number;
      image: {
        resized: {
          "1920x1080": string;
          "1280x720": string;
          "1024x576": string;
          "640x360": string;
        };
        resized_blur: {
          "1920x1080": string;
          "1280x720": string;
          "1024x576": string;
          "640x360": string;
        };
      };
      video_meta: {
        subtitle_languages: Array<string>;
        audio_languages: Array<string>;
        status: string;
      };
      comments: number;
      is_filler: number;
      is_recap: number;
    };
  }>;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
};
