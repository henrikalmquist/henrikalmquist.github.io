import{M as a}from"./index-0a696d3b.js";import{_ as i,o as l,c,a as t,n as d}from"./index-bf99bd32.js";const m={name:"StartPage",data(){return{bgUrl:"",md:new a,moreText:`&ast;   
More culture  
More patina  
More diversity  
More value  
More memories  
More attachment  
More craftmanship  
More beauty   
 `,lessText:`&ast;&ast;   
Less costs  
Less co₂  
Less disturbance  
Less resources  
Less pollution  
Less monotony  
Less material   
Less large investment   
`}},methods:{renderMarkdown(e){return this.md.render(e||"")},go(){this.$router.push("/adaptive")},pickRandom(e){return e[Math.floor(Math.random()*e.length)]}},mounted(){const e=["/img/AAAstart/01.jpg","/img/AAAstart/02.jpg","/img/AAAstart/04.jpg","/img/AAAstart/05.jpg"];this.bgUrl=this.pickRandom(e)}},u={class:"quote"},_={class:"quote-inner"},g={class:"left-col"},p=["innerHTML"],M=["innerHTML"];function h(e,s,f,v,o,r){return l(),c("section",{class:"start-cover",style:d({backgroundImage:`url(${o.bgUrl})`}),onClick:s[0]||(s[0]=(...n)=>r.go&&r.go(...n))},[t("div",u,[t("div",_,[s[1]||(s[1]=t("p",{class:"line"}," In embracing the complexity of an existing building or place – we can do more* – with less** ",-1)),t("div",g,[t("div",{innerHTML:r.renderMarkdown(o.moreText)},null,8,p),t("div",{innerHTML:r.renderMarkdown(o.lessText)},null,8,M)])])])],4)}const k=i(m,[["render",h],["__scopeId","data-v-576345fa"]]);export{k as default};
