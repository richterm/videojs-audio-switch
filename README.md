# videojs-audio-switch plugin

This is a simple attempt to introduce audio track switchability to video.js.

The assumption is that the video file you wrap with a `video` element and the videojs call is without any audio track itself.
You add those for the languages/ translations you want via the plugin config on initialiation:

```html
<video id="my-video" class="video-js" controls preload="auto">
  <source src="your_video.mp4" type="video/mp4" />
  <!-- any track elements if applicable -->
</video>
<script src="https://vjs.zencdn.net/7.11.4/video.js"></script>
<script src="https://unpkg.com/videojs-plugin-audio-switch"></script>
<script>
  videojs("my-video", {
    plugins: {
      "audio-switch": {
        audioTracks: [
          {
            language: "de",
            label: "Deutsch",
            kind: "translation",
            id: "de",
            url: "your_audio_file.mp3",
          },
        ],
        debugInterval: 10000,
        // syncInterval: 10000
      },
    },
  });
</script>
```

You might, for debugging purposes, provide `debugInterval` with a number (milliseconds). What that does, is, that every n milliseconds the difference between audio and video track are being console.logged.

The `syncInterval` lets you force a audio-video sync in a interval of the given milliseconds.
