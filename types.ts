// better I don't force users create the videojs track classes rather
// than simple javascript objects

type Track = { 
  kind?: string;
  id?: string;
  label?: string;
  language?: string;
}
export type AudioSwitchOptions = {
  audioTracks: Array<Track & { url: string }>;
  syncInterval?: number;
  debugInterval?: number;
};
