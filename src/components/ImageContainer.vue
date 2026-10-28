<template>
  <div class="image-frame" :class="imageClassComputed">
    <img
      class="image-frame__img cursor-crosshair"
      :src="imageSrc"
      @click="$emit('nextClicked')"
    >
  </div>
</template>

<script>
export default {
    props: {
        imageSrc: String,
        maxHeight: Number,
        centerContent: Boolean,
        isSmallScreen: Boolean,
    },
    computed: {
        imageStyleComputed(){
            if(this.isSmallScreen){
                return 'height: 76vw;'
            }
            return `height: ${this.maxHeight}rem`
        },
        imageClassComputed(){
            let result = "";
            if(this.centerContent){
                result = "mx-auto";
            }
            return result;
        }
    }
}
</script>

<style scoped>
.image-frame {
  width: 100%;
  aspect-ratio: 5 / 5;
  overflow: hidden;
  background: white;
}

.image-frame__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}
</style>
