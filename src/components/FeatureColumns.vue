<template>
    <div class="h-full grid grid-cols-2 gap-6">
        <div>
            <images-container v-for="feature in featureColumnsComputed[0]" :header="feature.header" :images="feature.images" :description="feature.text" :rem-unit="remUnit" />
        </div>
        <div>
            <images-container v-for="feature in featureColumnsComputed[1]" :header="feature.header" :images="feature.images" :description="feature.text" :rem-unit="remUnit" />
        </div>
    </div>
</template>

<script>
import ImagesContainer from './ImagesContainer.vue';
const ColumnCount = 2;
export default {
    name: "FeatureColumns",
    components: {
        ImagesContainer,
    },
    data() {
        return {
            featureColumns : [],
        }
    },
    props: {
        features: Array,
        introText: String,
        remUnit: Number,
    },
    mounted: function () {
        // for (let index = 0; index < ColumnCount; index++) {
        //     featureColumns[index] = { features: [], totalHeight: 0 };
            
        // }
        let reorderedFeatures = this.features.sort((a, b) => crypto.randomUUID() > crypto.randomUUID() ? 1 : -1 );
        let featureColumns = [];
        featureColumns[0] = [ { text: this.introText, images: [] } ]
        let count = 0;
        reorderedFeatures.forEach(feature => {
            if(!Array.isArray(featureColumns[count % ColumnCount])){
                featureColumns[count % ColumnCount] = [];
            }
            featureColumns[count % ColumnCount].push(feature);
            count++;
        });
        this.featureColumns = featureColumns;
    },
    methods: {
        
    },
    computed: {
        featureColumnsComputed(){
            return this.featureColumns;
        }
    }
}

</script>

<style>
.fade-enter-active{
  transition: opacity 0.25s ease;
}
.fade-leave-active {
  transition: opacity 0.25s ease;
  /* display: none; */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
