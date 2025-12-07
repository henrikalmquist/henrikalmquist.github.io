import{M as a}from"./index-0a696d3b.js";import{_ as i,o as c,c as l,a as s,n as d}from"./index-17693cc1.js";const m={name:"StartPage",data(){return{bgUrl:"",md:new a,moreText:`&ast;   
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
`}},methods:{renderMarkdown(e){return this.md.render(e||"")},go(){this.$router.push("/agency")},pickRandom(e){return e[Math.floor(Math.random()*e.length)]}},mounted(){const e=["/img/AAAstart/01.jpg"];this.bgUrl=this.pickRandom(e)}},u={class:"quote"},_={class:"quote-inner"},M={class:"left-col"},g=["innerHTML"],p=["innerHTML"];function h(e,t,f,v,o,r){return c(),l("section",{class:"start-cover",style:d({backgroundImage:`url(${o.bgUrl})`}),onClick:t[0]||(t[0]=(...n)=>r.go&&r.go(...n))},[s("div",u,[s("div",_,[t[1]||(t[1]=s("p",{class:"line"}," In embracing the complexity of an existing building or place – we can do more* – with less** ",-1)),s("div",M,[s("div",{innerHTML:r.renderMarkdown(o.moreText)},null,8,g),s("div",{innerHTML:r.renderMarkdown(o.lessText)},null,8,p)])])])],4)}const k=i(m,[["render",h],["__scopeId","data-v-4bfc7381"]]);export{k as default};
