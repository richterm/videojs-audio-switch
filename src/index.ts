import videojs from "video.js";
import { audioSwitchPlugin } from "./plugin";

videojs.registerPlugin("audio-switch", audioSwitchPlugin);
