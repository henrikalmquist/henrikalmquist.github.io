import{M as a}from"./index-0a696d3b.js";import{_ as i,o as c,c as d,a as t,n as l}from"./index-2aba3e95.js";const m={name:"StartPage",data(){return{bgUrl:"",md:new a,moreText:`&ast;   
More culture  
More continuity  
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
Less investment   
`}},methods:{renderMarkdown(e){return this.md.render(e||"")},go(){this.$router.push("/architecture")},pickRandom(e){return e[Math.floor(Math.random()*e.length)]}},mounted(){const e=["/img/AAAstart/01.jpg"];this.bgUrl=this.pickRandom(e)}},u={class:"quote"},_={class:"quote-inner"},M={class:"left-col"},g=["innerHTML"],p=["innerHTML"];function h(e,s,f,v,o,r){return c(),d("section",{class:"start-cover",style:l({backgroundImage:`url(${o.bgUrl})`}),onClick:s[0]||(s[0]=(...n)=>r.go&&r.go(...n))},[t("div",u,[t("div",_,[s[1]||(s[1]=t("p",{class:"line"}," In embracing the complexity of an existing building or place – we can do more* – with less** ",-1)),t("div",M,[t("div",{innerHTML:r.renderMarkdown(o.moreText)},null,8,g),t("div",{innerHTML:r.renderMarkdown(o.lessText)},null,8,p)])])])],4)}const x=i(m,[["render",h],["__scopeId","data-v-7f2d5126"]]);export{x as default};
