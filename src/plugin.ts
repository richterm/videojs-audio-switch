import type { AudioSwitchOptions } from "../types";
import throttle from "lodash-es/throttle";
import videojs from "video.js";

const syncTime = (player, audio) => {
  const time = player.currentTime();
  audio.currentTime = time;
};

export function audioSwitchPlugin(options: AudioSwitchOptions) {
  const { audioTracks, debugInterval, syncInterval } = options;
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
      audio.src = audioTracks.find(
        (audioTrack) => audioTrack.language === enabledTrack.language
      )?.url;
      syncTime(player, audio);
      if (isPlaying) player.play();
    }
  };

  var audioTrackList = player.audioTracks();

  audioTrackList.addEventListener(
    "change",
    onAudioTracksChange.bind(null, player, audio)
  );

  if (audioTracks.length > 0) {
    audioTracks.forEach((track) => audioTrackList.addTrack(track));
    audio.src = audioTracks[0].url;
  }

  player.on("play", () => {
    syncTime(player, audio);
    if (audio.paused) audio.play();
  });
  player.on("pause", () => {
    syncTime(player, audio);
    if (!audio.paused) audio.pause();
  });
  player.on("seeked", () => {
    if (!player.paused()) player.pause();
    player.one("canplay", () => {
      const sync = () => {
        syncTime(player, audio);
        audio.removeEventListener("canplay", sync);
        if (player.paused()) player.play();
      };
      audio.addEventListener("canplay", sync);
    });
  });
  player.on("volumechange", () => {
    if (player.muted()) {
      audio.muted = true;
    } else {
      audio.muted = false;
      audio.volume = player.volume();
    }
  });

  if (syncInterval) {
    const syncOnInterval = throttle(() => {
      syncTime(player, audio);
    }, syncInterval);
    player.on("timeupdate", syncOnInterval);
  }

  if (debugInterval) {
    const debugOnInterval = throttle(() => {
      const _audioBefore = audio.currentTime;
      const _videoBefore = player.currentTime();
      console.log("debug", {
        audio: _audioBefore,
        video: _videoBefore,
        diff: _videoBefore - _audioBefore,
      });
    }, debugInterval);
    player.on("timeupdate", debugOnInterval);
  }
}
