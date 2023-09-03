<template>
    <div class="h-full grid grid-cols-2" :style="gapComputed">
        <div :style="firstComlumeStyleComputed">
            <images-container v-for="feature in featureColumnsComputed[0]" :header="feature.header" :images="feature.images" :description="feature.text" :rem-unit="remUnit" :use-markdown="useMarkdown" />
        </div>
        <div>
            <images-container v-for="feature in featureColumnsComputed[1]" :header="feature.header" :images="feature.images" :description="feature.text" :rem-unit="remUnit" :use-markdown="useMarkdown" />
        </div>
    </div>
</template>

<script>
import ImagesContainer from './ImagesContainer.vue';
const ColumnCount = 2;

function reOrderFeatures(features){
    const groupBy = (x,f) => x.reduce((a,b,i)=>((a[f(b,i,x)]||=[]).push(b),a),[]);
    const randomOrder = (array) => array.sort((a, b) => crypto.randomUUID() > crypto.randomUUID() ? 1 : -1 );
    let groups = groupBy(features.filter(f => f.prio != null), f => f.prio);
    var result = [];
    groups.forEach(group => {
        var reOrdered = randomOrder(group);
        result = [...result, ...reOrdered];
    });
    return result;
}

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
        useMarkdown: Boolean,
    },
    mounted: function () {
        this.reShuffleFeatures();
    },
    computed: {
        featureColumnsComputed(){
            return this.featureColumns;
        },
        gapComputed(){
            return `gap: ${this.remUnit}rem;`;
        },
        firstComlumeStyleComputed(){
            return this.useMarkdown ? `margin-top: -1.25rem;` : "";
        }
    },
    methods: {
        reShuffleFeatures(){
            let reorderedFeatures = reOrderFeatures(this.features);
            let featureColumns = [];
            featureColumns[0] = this.introText ? [ { text: this.introText, images: [] } ] : [];
            let count = 0;
            reorderedFeatures.forEach(feature => {
                if(!Array.isArray(featureColumns[count % ColumnCount])){
                    featureColumns[count % ColumnCount] = [];
                }
                featureColumns[count % ColumnCount].push(feature);
                count++;
            });
            this.featureColumns = featureColumns;
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
