(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{208:function(e,a){},214:function(e,a,t){"use strict";t.r(a);var s=t(0),r=t.n(s),c=t(10),l=t(14),n=t(15),m=t(184),i=t.n(m),u=t(3);a.default=()=>{const e=Object(s.useRef)(null),a=Object(s.useRef)(null),t=Object(s.useRef)(null),m=Object(s.useContext)(c.a),o=Object(s.useContext)(l.a),[h,p]=Object(n.a)({fieldValue:"",chatMessages:[]});Object(s.useEffect)(()=>{m.isChatOpen&&(a.current.focus(),o({type:"clearUnreadChatCount"}))},[m.isChatOpen]),Object(s.useEffect)(()=>(e.current=i()("http://localhost:8080"),e.current.on("chatFromServer",e=>{p(a=>{a.chatMessages.push(e)})}),()=>e.current.disconnect()),[]),Object(s.useEffect)(()=>{t.current.scrollTop=t.current.scrollHeight,h.chatMessages.length&&!m.isChatOpen&&o({type:"incrementUnreadChatCount"})},[h.chatMessages]);return r.a.createElement("div",{id:"chat-wrapper",className:"chat-wrapper shadow border-top border-left border-right "+(m.isChatOpen?"chat-wrapper--is-visible":"")},r.a.createElement("div",{className:"chat-title-bar bg-primary"},"Chat",r.a.createElement("span",{onClick:()=>o({type:"closeChat"}),className:"chat-title-bar-close"},r.a.createElement("i",{className:"fas fa-times-circle"}))),r.a.createElement("div",{id:"chat",className:"chat-log",ref:t},h.chatMessages.map((e,a)=>e.username==m.user.username?r.a.createElement("div",{className:"chat-self",key:a},r.a.createElement("div",{className:"chat-message"},r.a.createElement("div",{className:"chat-message-inner"},e.message)),r.a.createElement("img",{className:"chat-avatar avatar-tiny",src:e.avatar})):r.a.createElement("div",{className:"chat-other"},r.a.createElement(u.b,{to:"/profile/"+e.username},r.a.createElement("img",{className:"avatar-tiny",src:e.avatar})),r.a.createElement("div",{className:"chat-message"},r.a.createElement("div",{className:"chat-message-inner"},r.a.createElement(u.b,{to:"/profile/"+e.username},r.a.createElement("strong",null,e.username,": ")),e.message))))),r.a.createElement("form",{onSubmit:a=>{a.preventDefault(),e.current.emit("chatFromBrowser",{message:h.fieldValue,token:m.user.token}),p(e=>{e.chatMessages.push({message:e.fieldValue,username:m.user.username,avatar:m.user.avatar}),e.fieldValue=""})},id:"chatForm",className:"chat-form border-top"},r.a.createElement("input",{value:h.fieldValue,onChange:e=>{const a=e.target.value;p(e=>{e.fieldValue=a})},ref:a,type:"text",className:"chat-field",id:"chatField",placeholder:"Type a message…",autoComplete:"off"})))}}}]);