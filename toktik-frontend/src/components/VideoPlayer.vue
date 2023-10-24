<template>
    <div v-show="videoLoaded">
        <h2>Video Player</h2>
        <video 
            ref="s3VideoPlayer"
            id="video"
            class="video-js vjs-default-skin" 
            preload="auto"
            crossorigin="use-credentials"
            controls 
            width="640" height="268"
            data-setup='{ "fluid": true }'
            autoplay="true"
        >
        </video>
    </div>
</template>
  
<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';

export default {
    name:"video-player",
    data() {
        return {
            player: null,
            videoLoaded: false,
            videoId: 2,
        };
    },
    mounted() {
        this.getVideo()
    },
    methods: {
        async getVideo() {
            // this part sends an api call to backend for chunked vid
            const payload = new FormData();
            payload.append("video_ids", [this.videoId]);
            payload.append("bucket", "chunked");
            
            // const videoUrl = "https://chonky.toktik.thanawat.sgp1.cdn.digitaloceanspaces.com/IMG_6376_2/IMG_6376_2.m3u8"
            try {
                const response = await this.axios({
                    method: "POST",
                    url: `/api/video/get-url/`,
                    data: payload,
                    credentials: "include"
                });

                const videoUrl = response.data.urls[0];
                
                this.initVideoPlayer(videoUrl);
                this.videoLoaded = true;
                // TODO: incr view to the video with this id
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        },

        initVideoPlayer(fileUrl) {
            // videojs.options.html5.nativeAudioTracks = false;
            // videojs.options.html5.nativeTextTracks = false;

            this.player = videojs(this.$refs.s3VideoPlayer, {
                techOrder: ['html5'],
                html5: {
                    hls: {
                        overrideNative: true,
                        withCredentials: true,
                    }
                }
            });
            
            this.player.src({
                src: fileUrl,
                type: 'application/x-mpegURL'
            });
            
            this.player.on('error', (error) => {
                console.error('VIDEOJS: ERROR:', error);
            });
        }
    }
};
</script>
