import videojs from "video.js";

export type AudioSwitchOptions = {
  audioTracks: Array<videojs.AudioTrackOptions & { url: string }>;
  syncInterval?: number;
  debugInterval?: number;
};
