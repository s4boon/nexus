export type LoadingStatus = "FETCHING" | "FINISHED" | "ERROR";
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

export type PopularRes = {
  data: Array<{
    id: string;
    slug: string;
    name: string;
    name_alt: string;
    description: string;
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
    genres: Array<{
      name: string;
      id: string;
      code: string;
    }>;
    views: number;
  }>;
  links: {
    first: any;
    last: any;
    prev: any;
    next: any;
  };
  meta: {
    path: string;
    per_page: number;
    next_cursor: any;
    prev_cursor: any;
  };
};

export type AnimeDetailsRes = {
  data: {
    background?: {
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
    logo?: {
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
    broadcast: string;
    release_day: string;
    description: string;
    end_date: string;
    episode_count: number;
    episode_count_current: number;
    average: {
      score: number;
      users: number;
    };
    mal_id: number;
    anilist_id: number;
    studios: Array<{
      id: string;
      name: string;
    }>;
    producers: Array<{
      id: string;
      name: string;
    }>;
    genres: Array<{
      name: string;
      id: string;
      code: string;
    }>;
    demographics: Array<{
      name: string;
      id: string;
      code: string;
    }>;
    themes: Array<{
      name: string;
      id: string;
      code: string;
    }>;
    relations: Array<{
      name: string;
      id: string;
      slug: string;
      relation: string;
      poster?: {
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
    }>;
    guid: string;
    id: string;
    name: string;
    name_alt: string;
    parental_rating: string;
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
    premiered: string;
    release_date: string;
    slug: string;
    status: string;
    trailer: string;
    type: string;
  };
};

export type StatsRes = {
  data: {
    average: {
      score: number;
      users: number;
    };
    weighted: {
      score: number;
      users: number;
    };
    episodes: number;
    episodes_total: number;
    followers: number;
  };
};

export type EpisodesRes = {
  data: Array<{
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
  }>;
  links: {
    first: string;
    last: string;
    prev: any;
    next: any;
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

export type StreamRes = {
  data: {
    next: {
      id: string;
      title: any;
      number: number;
      slug: string;
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
    };
    subtitles: Array<{
      id: string;
      src: string;
      label: string;
      srcLang: string;
    }>;
    video_meta: {
      duration: number;
      chapters: string;
      audio_languages: Array<string>;
      status: string;
      qualities: {
        "1920x1080": number;
        "1280x720": number;
        "848x480": number;
      };
      file_size_streams: {
        "848x480": number;
        "1280x720": number;
        "1920x1080": number;
      };
    };
    hls: string;
    thumbnails: string;
  };
};

export type Edge = {
  id: string;
  name: string;
  host: string;
  location: string;
  lat: number;
  lon: number;
  ping_url: string;
};
