<template>
  <div>
    <h1>THE FEED</h1>
    <!-- This is the whole page -->
    <div class="feed_container">

      <!-- This is for each video -->
      <div v-for="(video, index) in videos" :key="index" class="video_block">
        <div>
          <img 
            :src="video_thumbnails[index]" 
            alt="Thumbnail"
            />
        </div>
        <div class="video_block__text">
          <h4>{{ video.title }}</h4>
          <p>By: {{ video.uploader.username }}</p>
          <p>{{ video.view }} views</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      videos: [],
      video_ids: [],
      video_thumbnails: [],
      current_video_index: 0,
    };
  },
  mounted() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await axios({
          method: "GET",
          url: `/api/video/feed/`,
        });

        this.videos = response.data;
        this.videos.forEach( async video => {
          await this.video_ids.push(video.id)
        })
        this.fetchThumbnails()
        
      } catch (error) {
        this.error = "An error occurred during fetching video feed. Please try again.";
        console.error("Error:", error);
      }
    },

    async fetchThumbnails() {
      const formData = new FormData();
      formData.append("video_ids", this.video_ids);
      formData.append("bucket", 'thumbnail');
      
      const response = await axios({
        method: "POST",
        url: `/api/video/get-url/`,
        data: formData
      });
      this.video_thumbnails = response.data.urls;
      // this.video_thumbnails = this.fakeThumbnail().urls;
    },

    fakeThumbnail() {
      return {
        "video_ids": [2, 4, 8],
        "urls": [
          "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-scarlet-violet/d/d5/Pokemon_SV_Screenshot_13.jpg",
          "https://images.ctfassets.net/pkeegl0voupm/2wWMLt9oNBJ6XF1aekULGn/129dd3cebfefb8132231665bff2b0e99/news_pokemonsv_bnr.jpg",
          "https://scarletviolet.pokemon.com/_images/news/feb_27/teal_mask_art.jpg",
          "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-scarlet-violet/d/d5/Pokemon_SV_Screenshot_13.jpg",
          "https://images.ctfassets.net/pkeegl0voupm/2wWMLt9oNBJ6XF1aekULGn/129dd3cebfefb8132231665bff2b0e99/news_pokemonsv_bnr.jpg",
          "https://scarletviolet.pokemon.com/_images/news/feb_27/teal_mask_art.jpg",
          "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-scarlet-violet/d/d5/Pokemon_SV_Screenshot_13.jpg",
          "https://images.ctfassets.net/pkeegl0voupm/2wWMLt9oNBJ6XF1aekULGn/129dd3cebfefb8132231665bff2b0e99/news_pokemonsv_bnr.jpg",
          "https://scarletviolet.pokemon.com/_images/news/feb_27/teal_mask_art.jpg",
          "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-scarlet-violet/d/d5/Pokemon_SV_Screenshot_13.jpg",
          "https://images.ctfassets.net/pkeegl0voupm/2wWMLt9oNBJ6XF1aekULGn/129dd3cebfefb8132231665bff2b0e99/news_pokemonsv_bnr.jpg",
          "https://scarletviolet.pokemon.com/_images/news/feb_27/teal_mask_art.jpg",
          "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-scarlet-violet/d/d5/Pokemon_SV_Screenshot_13.jpg",
          "https://images.ctfassets.net/pkeegl0voupm/2wWMLt9oNBJ6XF1aekULGn/129dd3cebfefb8132231665bff2b0e99/news_pokemonsv_bnr.jpg",
          "https://scarletviolet.pokemon.com/_images/news/feb_27/teal_mask_art.jpg",
          "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-scarlet-violet/d/d5/Pokemon_SV_Screenshot_13.jpg",
          "https://images.ctfassets.net/pkeegl0voupm/2wWMLt9oNBJ6XF1aekULGn/129dd3cebfefb8132231665bff2b0e99/news_pokemonsv_bnr.jpg",
          "https://scarletviolet.pokemon.com/_images/news/feb_27/teal_mask_art.jpg",
        ]
      }
    }
  },
};
</script>

<style>
/* Thank you, aj.Boonyanit */
.feed_container {
  /* 
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-evenly;
  align-content: flex-start;
  padding: 3rem; 
  */

  display: grid;
  grid-template-columns: repeat(auto-fit, 400px);
  grid-gap: 5px;
  grid-auto-flow: row;
  justify-items: center;
  justify-content: center;
  padding: 2.5%;
}

.video_block {
  padding: 5px;
  margin-bottom: 10px;
}

.video_block img{
  max-height: 80%;
  max-width: 80%;
  border-radius: 5px;
}

.video_block__text{
  /* padding-left: 50px; */
  padding-left: 15%;
  padding-top: 5px;
  text-align: left;
  max-width: 70%;
}

.video_block__text p,
.video_block__text h4 {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
