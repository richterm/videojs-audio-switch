import type { AudioSwitchOptions } from "../types";
import { throttle } from "lodash-es";
import videojs from "video.js";

const syncTime = (player, audio) => {
  const time = player.currentTime();
  audio.currentTime = time;
};

export function audioSwitchPlugin(options: AudioSwitchOptions) {
  const { audioTracks, debug = false } = options;
  const player = this;

  const audio = new Audio();
  audio.currentTime = 0;

  const onAudioTracksChange = (player, audio) => {
    var audioTrackList = player.audioTracks();

    let enabledTrack;
    for (let i = 0; i < audioTrackList.length; i++) {
      let track = audioTrackList[i];
      if (track.enabled) {
        enabledTrack = track;
        break;
      }
    }

    enabledTrack = enabledTrack || audioTrackList[0];

    if (enabledTrack) {
      const isPlaying = !player.paused();
      if (isPlaying) player.pause();
      audio.src = audioTracks[enabledTrack.language];
      syncTime(player, audio);
      if (isPlaying) player.play();
    }
  };

  var audioTrackList = player.audioTracks();

  audioTrackList.addEventListener(
    "change",
    onAudioTracksChange.bind(null, player, audio)
  );

  const trackEntries = Object.entries(audioTracks);

  const tracks = trackEntries.map(([key, val]) => {
    return {
      id: key,
      kind: key as videojs.AudioTrack.Kind,
      label: key.toUpperCase(),
      language: key,
    };
  });

  tracks.forEach((track) =>
    audioTrackList.addTrack(new videojs.AudioTrack(track))
  );

  if (tracks.length > 0) {
    audio.src = audioTracks[tracks[0].id];
  }

  player.on("play", () => {
    syncTime(player, audio);
    audio.play();
  });
  player.on("pause", () => {
    syncTime(player, audio);
    audio.pause();
  });
  player.on("seeked", () => {
    syncTime(player, audio);
  });
  player.on("volumechange", () => {
    if (player.muted()) {
      audio.muted = true;
    } else {
      audio.muted = false;
      audio.volume = player.volume();
    }
  });

  const onTimeUpdate = throttle(() => {
    const _audioBefore = audio.currentTime;
    const _videoBefore = player.currentTime();
    if (debug) {
      console.log("onTimeUpdate before:", {
        audio: _audioBefore,
        video: _videoBefore,
        diff: _videoBefore - _audioBefore,
      });
    }
    syncTime(player, audio);
  }, 3000);

  player.on("timeupdate", onTimeUpdate);
}
