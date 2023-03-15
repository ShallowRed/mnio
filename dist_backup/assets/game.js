var k=Object.defineProperty;var P=(i,e,t)=>e in i?k(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var l=(i,e,t)=>(P(i,typeof e!="symbol"?e+"":e,t),t);import{l as N}from"./index.js";const A=i=>class extends i{constructor(...e){super(...e)}set transitionDuration(e){this.domElement.style.transitionDuration=`${e/1e3}s`}set transform({translation:e,translation2:t,factor:s}){let n="";if(e){const o=e.map(a=>`${a}px`).join(", ");n+=`translate(${o})`}if(t){const o=t.map(a=>`${a}px`).join(", ");n+=` translate(${o})`}s&&(n+=` scale(${s})`),this.domElement.style.transform=n}},_=A(class{constructor(e,t){l(this,"lastCoords",[null,null]);l(this,"coordsInView",[null,null]);l(this,"translateVector",[null,null]);this.game=e,this.position=t}set position(e){this.coords&&(this.lastCoords=[...this.coords]),this.coords=this.game.map.indexToCoords(e),this.lastPosition=parseInt(`${this.position}`,10),this._position=e}get position(){return this._position}setSize(){const e=this.game.map.cellSize-this.game.map.cellPadding*2;this.sprite.style.width=this.sprite.style.height=`${e}px`}translate(e){this.transitionDuration=e;for(const t in[0,1]){const s=this.game.map.canvasOffset[t]+this.game.map.cellPadding;this.translateVector[t]=s+this.coordsInView[t]*this.game.map.cellSize}this.transform={translation:this.translateVector}}stampAnimation(){this.game.flags.isStamping=!0,this.transitionDuration=this.game.durations.stampAnimation/2,this.transform={translation:this.translateVector,factor:.9},this.sprite.classList.add("stamp");const e=()=>{this.sprite.classList.remove("stamp"),this.transform={translation:this.translateVector},this.game.flags.isStamping=!1};this.game.animationTimeout(e,this.game.durations.stampAnimation/2)}bumpAnimation(e){if(this.game.flags.isBumping)return;this.game.flags.isBumping=!0,this.transitionDuration=this.game.durations.bumpAnimation;const t={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[e],s=t.map(a=>a*this.game.map.cellPadding*1.2),n=t.map(a=>1-.1*Math.abs(a));this.transform={translation:this.translateVector,translation2:s,factor:n};const o=()=>{this.transform={translation:this.translateVector},this.game.animationTimeout(()=>{this.game.flags.isBumping=!1},this.game.durations.delayBetweenBumps)};this.game.animationTimeout(o,this.game.durations.bumpAnimation)}});class B extends _{constructor(t,{position:s,palette:n,ownCells:o,allowedCells:a}){super(t,s);l(this,"sprite",document.getElementById("player"));l(this,"coordsInViewCoef",[null,null]);this.domElement=this.sprite,this.palette=n,this.ownCells=o,this.allowedCells=a}setColor(t){this.selectedColorIndex=t,this.selectedColor=this.palette[t],this.sprite.style.background=this.selectedColor}updateCoordsInView(){this.lastCoordsInView=[...this.coordsInView];for(const t in[0,1]){const s=this.coords[t],n=[this.game.map.cols,this.game.map.rows][t],o=this.game.map.maxCoordsInView[t],a=(o-1)/2;this.coordsInView[t]=this.getCoordInView(n,o,a,s),this.coordsInViewCoef[t]=this.getCoordInViewCoef(n,a,s)}this.game.map.updateCanvasOffset()}getCoordInView(t,s,n,o){return o<Math.ceil(n)?o:o>t-n-1?o+s-t:n}getCoordInViewCoef(t,s,n){return n<=s?0:n>=t-s-1?1:1/2}}class W{constructor(){l(this,"collection",new Map)}get(e){return this.collection.get(e)}set(e){this.collection.set(e.userId,e)}delete(e){this.collection.delete(e)}get values(){return[...this.collection.values()]}get positions(){return this.values.map(e=>e.position)}}class R extends _{constructor(e,{userId:t,position:s}){super(e,s),this.userId=t}update(e){this.game.map.areCoordsInView(this.coordsInView)?(this.sprite||(this.sprite=this.domElement=document.createElement("div"),this.sprite.classList.add("player"),document.querySelector("#view").appendChild(this.sprite)),this.translate(e),this.setSize()):this.sprite&&(this.sprite.remove(),delete this.sprite)}set position(e){super.position=e,this.updateCoordsInView()}setColor(e){this.sprite.style.background=`#${e}`}updateCoordsInView(){for(const e in[0,1])this.coordsInView[e]=this.coords[e]+this.game.player.coordsInView[e]-this.game.player.coords[e]}}class Z extends W{constructor(e,t){super(),this.game=e,this.playersData=t}get length(){return this.collection.size}init(){var e;(e=this.playersData)==null||e.forEach(({userId:t,position:s})=>{this.create({userId:t,position:s})}),delete this.playersData}create({userId:e,position:t}){if(!this.collection.has(e)){const s=new R(this.game,{userId:e,position:t});this.set(s),s.update(0)}}update(e){this.init?(this.init(),this.init=null):this.collection.forEach(t=>{t.updateCoordsInView(),t.update(e)})}}class ${constructor({gridState:e,cols:t,rows:s}){this.gridState=e,this.cols=t,this.rows=s}indexToCoords(e){const t=e%this.cols,s=(e-t)/this.rows;return[t,s]}coordsToIndex([e,t]){return this.cols*t+e}checkMove(e,t){let[s,n]=this.indexToCoords(e.position);if(t=="left"&&s!==0)s--;else if(t=="right"&&s!==this.cols-1)s++;else if(t=="up"&&n!==0)n--;else if(t=="down"&&n!==this.rows-1)n++;else return;const o=this.coordsToIndex([s,n]);if(this.isAvailable(o,e))return o}isAvailable(e,t){return t.ownCells.includes(e)||t.allowedCells.includes(e)&&!this.game.players.positions.includes(e)&&!this.gridState[e]}}const H=A(class extends ${constructor(t,{gridState:s,rows:n,cols:o}){super({gridState:s,rows:n,cols:o});l(this,"view",document.getElementById("view"));l(this,"canvas",document.querySelector("canvas"));l(this,"minCellsInView",12);l(this,"startCellsInView",18);l(this,"maxCellsInView",36);l(this,"offScreenCells",2);l(this,"nCellsZoomIncrement",2);l(this,"canvasOffset",[null,null]);l(this,"maxCoordsInView",[null,null]);l(this,"viewSize",[null,null]);l(this,"positionsColor","black");l(this,"allowedColor","#e5e5e5");l(this,"getCoordInView",(t,s)=>t-this.game.player.coords[s]+this.game.player.coordsInView[s]+this.offScreenCells);t.isAdmin&&(this.maxCellsInView=150,this.startCellsInView=150),this.game=t,this.ctx=this.canvas.getContext("2d"),this.domElement=this.canvas}get longestDimensionIndex(){return this.isWidthLarger?0:1}get shortestDimensionIndex(){return this.isWidthLarger?1:0}setViewSize(){this.isWidthLarger=window.innerWidth>=window.innerHeight,document.body.className=this.isWidthLarger?"width-larger":"height-larger",this.viewSize=[this.view.offsetWidth,this.view.offsetHeight]}updateCellsLayout(){var t,s;(t=this.maxCoordsInView)[s=this.longestDimensionIndex]??(t[s]=this.startCellsInView),this.lastCellSize=this.cellSize,this.cellSize=Math.round(this.viewSize[this.longestDimensionIndex]/this.maxCoordsInView[this.longestDimensionIndex]),this.cellPadding=Math.round(this.game.map.cellSize/8),this.maxCoordsInView[this.shortestDimensionIndex]=Math.round(this.viewSize[this.shortestDimensionIndex]/this.cellSize)}updateCanvasOffset(){for(const t in[0,1]){const s=this.viewSize[t]-this.maxCoordsInView[t]*this.cellSize;this.canvasOffset[t]=s*this.game.player.coordsInViewCoef[t]}}updateCanvasLayout(){const{cellSize:t,maxCoordsInView:s,offScreenCells:n}=this;this.canvas.width=t*(s[0]+n*2),this.canvas.height=t*(s[1]+n*2),this.canvas.style.top=this.canvas.style.left=`-${Math.round(n*t)}px`,this.ctx.imageSmoothingEnabled=!1}renderCells(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.game.player.allowedCells.forEach(t=>{this.renderCell(t,this.allowedColor)}),this.filledCells.forEach(({color:t,position:s})=>{this.renderCell(s,t)})}get filledCells(){return this.gridState.map((t,s)=>t&&{color:`#${t}`,position:s}).filter(Boolean)}renderCell(t,s){const n=this.getRelativeCoords(t);if(!this.areCoordsInView(n))return;const[o,a]=n.map(u=>Math.round(this.cellSize*u));s?(this.ctx.fillStyle=s,this.ctx.fillRect(o,a,this.cellSize,this.cellSize)):this.ctx.clearRect(o,a,this.cellSize,this.cellSize)}getRelativeCoords(t){return this.indexToCoords(t).map(this.getCoordInView)}areCoordsInView([t,s]){return t>-this.offScreenCells&&s>-this.offScreenCells&&t-1<=this.maxCoordsInView[0]+this.offScreenCells&&s-1<=this.maxCoordsInView[1]+this.offScreenCells}translate(t){this.transitionDuration=t;const s=[...this.canvasOffset];if(t!==0){const{lastCoords:n,coords:o,lastCoordsInView:a,coordsInView:u}=this.game.player;for(const h in[0,1]){const v=n[h]-o[h]+u[h]-a[h];s[h]+=v*this.cellSize}}this.transform={translation:s}}isZoomable(t){if(t=="in"&&this.maxCoordsInView[this.longestDimensionIndex]>this.minCellsInView||t=="out"&&this.maxCoordsInView[this.longestDimensionIndex]<this.maxCellsInView)return!0}incrementMaxCoordsInView(t){const s=t=="in"?-1:1;this.maxCoordsInView[this.longestDimensionIndex]+=this.nCellsZoomIncrement*s}zoom(t){this.transitionDuration=t;const s=Math.round(1e3*this.cellSize/this.lastCellSize)/1e3,n=(this.lastCellSize-this.cellSize)*this.offScreenCells,o=[...this.canvasOffset];for(const a in[0,1])o[a]+=n,o[a]+=(this.game.player.coordsInView[a]-this.game.player.lastCoordsInView[a])*this.cellSize;this.transform={translation:o,factor:s}}});function q(){this.socket.on("NEW_SELF_POSITION",this.events.NEW_SELF_POSITION.bind(this)),this.socket.on("NEW_POSITION",this.events.NEW_POSITION.bind(this)),this.socket.on("NEW_FILL",this.events.NEW_FILL.bind(this)),this.socket.on("NEW_SELF_ALLOWED_CELLS",this.events.NEW_SELF_ALLOWED_CELLS.bind(this)),this.socket.on("NEW_CONFIRM_FILL",this.events.NEW_CONFIRM_FILL.bind(this)),this.socket.on("alert",i=>{alert(i)}),this.socket.on("reconnect_attempt",()=>{window.location.reload(!0)}),this.socket.on("error",()=>{window.isReloading||window.location.reload(!0)})}const E={colorBtns:document.querySelectorAll(".color"),zoomBtns:{in:document.getElementById("zoomin"),out:document.getElementById("zoomout")},focusColorBtn(i){this.colorBtns.forEach((e,t)=>{t===i?e.className="color selected":e.className="color"})}};function G(){E.colorBtns.forEach((i,e)=>{i.style.background=this.player.palette[e],i.addEventListener("mousedown",()=>{this.emit("SELECT_COLOR",e)}),i.addEventListener("mouseup",()=>{this.flags.isTranslating||this.flags.isZooming||this.emit("FILL_ATTEMPT")}),i.addEventListener("touchstart",t=>{t.preventDefault(),this.emit("SELECT_COLOR",e)}),i.addEventListener("touchend",t=>{t.preventDefault(),!(this.flags.isTranslating||this.flags.isZooming)&&this.emit("FILL_ATTEMPT")})});for(const i in E.zoomBtns){const e=E.zoomBtns[i];e.addEventListener("mousedown",()=>{this.flags.zoomBtnPressed=!0,this.emit("ZOOM_ATTEMPT",i)}),e.addEventListener("touchstart",t=>{t.preventDefault(),this.flags.zoomBtnPressed=!0,this.emit("ZOOM_ATTEMPT",i)}),e.addEventListener("mouseup",()=>{this.flags.zoomBtnPressed=!1}),e.addEventListener("touchend",t=>{t.preventDefault(),this.flags.zoomBtnPressed=!1})}document.addEventListener("click",()=>{document.activeElement.toString()=="[object HTMLButtonElement]"&&document.activeElement.blur()})}let T=!1;function j(){document.addEventListener("keydown",i=>{if(i.code==="MetaLeft"||i.code==="MetaRight"||i.code==="AltLeft"||i.code==="AltRight"||i.code==="ControlLeft"||i.code==="ControlRight"){T=!0;return}this.flags.isTranslating||this.flags.waitingServerConfirmMove||X.call(this,i)}),document.addEventListener("keyup",i=>{if(i.code==="MetaLeft"||i.code==="MetaRight"||i.code==="AltLeft"||i.code==="AltRight"||i.code==="ControlLeft"||i.code==="ControlRight"){T=!1;return}})}function X(i){switch(i.code){case"Space":this.emit("FILL_ATTEMPT");break;case"Enter":this.emit("FILL_ATTEMPT");break;case"ArrowLeft":this.emit("MOVE_ATTEMPT","left");break;case"ArrowRight":this.emit("MOVE_ATTEMPT","right");break;case"ArrowUp":if(T){const e=this.player.palette.length,t=(e+this.player.selectedColorIndex-1)%e;this.emit("SELECT_COLOR",t)}else this.emit("MOVE_ATTEMPT","up");break;case"ArrowDown":if(T){const e=this.player.palette.length,t=(e+this.player.selectedColorIndex+1)%e;this.emit("SELECT_COLOR",t)}else this.emit("MOVE_ATTEMPT","down");break}}function Y(){this.map.view.addEventListener("touchstart",K.bind(this),!1),this.map.view.addEventListener("touchmove",J.bind(this),!1),this.map.view.addEventListener("touchend",U.bind(this),!1)}function K(i){this.flags.isTouching=!0,r.setOrigin(i)}function U(){this.flags.isTouching=!1,r.setLimit(),r.start=[null,null],r.direction=null,r.lastDirection=null}function J(i){if(!r.start[0]||!r.start[1]||(r.getDelta(i),r.getDirection(),r.lastDirection||r.saveDirection(),this.flags.waitingServerConfirmMove||this.flags.isTranslating||r.isTooSmall()))return;this.emit("MOVE_ATTEMPT",r.direction),r.setOrigin(i),r.setLimit(120),r.saveDirection();const e=setInterval(()=>{!this.flags.waitingServerConfirmMove&&!this.flags.isTranslating&&this.flags.isTouching&&r.direction&&this.emit("MOVE_ATTEMPT",r.direction),this.flags.isTouching||clearInterval(e)},20)}const r={start:[null,null],delta:[null,null],direction:null,lastDirection:null,limit:80,setOrigin(i){this.start[0]=i.touches[0].clientX,this.start[1]=i.touches[0].clientY},setLimit(i=50){this.limit=i},getDelta(i){this.delta[0]=this.start[0]-i.touches[0].clientX,this.delta[1]=this.start[1]-i.touches[0].clientY},getDirection(){const[i,e]=this.delta;Math.abs(i)>Math.abs(e)?this.direction=i>0?"left":"right":this.direction=e>0?"up":"down"},saveDirection(){this.lastDirection=this.direction},useLastDir(){this.direction=this.lastDirection},isSameDirection(){return this.lastDirection===this.direction},isTooSmall(){return Math.abs(r.delta[0])<r.limit&&Math.abs(r.delta[1])<r.limit}};function Q(){window.addEventListener("resize",this.render),window.addEventListener("orientationchange",()=>{setTimeout(this.render,500)})}const tt={SELECT_COLOR:function(i){this.player.setColor(i),E.focusColorBtn(i)},FILL_ATTEMPT:function(){!this.flags.waitingServerConfirmFill&&!this.flags.isFilling&&this.emit("FILL_SELF_CELL",this.player.position)},FILL_SELF_CELL:function(i){this.player.ownCells.includes(i)||this.player.ownCells.push(i),this.fillAnimation(i,this.player.selectedColor);const e=this.player.selectedColor.substring(1);this.map.gridState[i]=e,this.socket.emit("FILL",{position:i,color:e}),this.flags.waitingServerConfirmFill=!0,this.player.stampAnimation()},NEW_CONFIRM_FILL:function(){this.flags.waitingServerConfirmFill=!1},NEW_FILL:function({userId:i,position:e,color:t}){const s=this.players.get(i);s&&(s.setColor(t),s.stampAnimation()),this.map.gridState[e]=t,this.map.renderCell(e,`#${t}`)},NEW_SELF_ALLOWED_CELLS:function(i){i.forEach(e=>{this.player.allowedCells.includes(e)||(this.player.allowedCells.push(e),this.map.renderCell(e,this.map.allowedColor))})}},et={MOVE_ATTEMPT:function(i){if(this.flags.waitingServerConfirmMove||this.flags.isTranslating||this.flags.isStamping||this.flags.isFilling||this.flags.isZooming)return;this.socket.emit("MOVE",i);const e=this.map.checkMove(this.player,i);e?this.emit("MOVE_SELF",e):this.player.bumpAnimation(i)},MOVE_SELF:function(i){this.flags.waitingServerConfirmMove=!0,this.flags.isTranslating=!0,this.player.position=i,this.player.updateCoordsInView(),this.map.updateCanvasOffset(),this.map.translate(this.durations.translationAnimation),this.player.translate(this.durations.translationAnimation),this.players.update(this.durations.translationAnimation);const e=()=>{this.map.translate(0),this.map.renderCells(),this.flags.isTranslating=!1};this.animationTimeout(e,this.durations.translationAnimation*1.1)},NEW_SELF_POSITION:function(i){this.flags.waitingServerConfirmMove=!1,i!==this.player.position&&this.emit("MOVE_SELF",i)},NEW_POSITION:function({userId:i,from:e,to:t}){var s;if(t){if(!e)this.players.create({userId:i,position:t});else if(t){if(t===this.player.position&&t===this.player.lastPosition){console.log("Received position we shouldn't have received");return}const n=this.players.get(i);n?(n.position=t,n.update(this.durations.translationAnimation)):this.players.create({userId:i,position:t})}}else{const n=this.get(i);n&&((s=n==null?void 0:n.sprite)==null||s.remove(),this.players.delete(i))}}},it={ZOOM_ATTEMPT:function(i){!this.flags.isZooming&&!this.flags.isTranslating&&this.map.isZoomable(i)&&this.emit("ZOOM",i)},ZOOM:function(i){this.flags.isZooming=!0,this.map.incrementMaxCoordsInView(i),this.map.updateCellsLayout(),this.player.updateCoordsInView(),this.map.updateCanvasOffset(),this.map.zoom(this.durations.zoomAnimation),this.player.translate(this.durations.zoomAnimation),this.player.setSize(),this.players.update(this.durations.zoomAnimation);const e=()=>{this.flags.isZooming=!1,this.map.updateCanvasLayout(),this.map.translate(0),this.map.renderCells(),this.flags.zoomBtnPressed&&this.animationTimeout(()=>{this.emit("ZOOM_ATTEMPT",i)},this.durations.delayBetweenZooms)};this.animationTimeout(e,this.durations.zoomAnimation*1.1)}},f=8;function st(i,e){this.flags.isFilling=!0;const t=this.durations.fillAnimation,s=this.map.cellSize,[n,o]=this.map.getRelativeCoords(i).map(m=>Math.round(m*s)),a=Math.floor(s/f),u=f-s%f,h=this.map.ctx,v=this.flags;V();function V({prevYIndex:m=0,prevLineX:p=0,startDate:g=Date.now()}={}){const C=Date.now()-g,d=C*f/t,c=Math.trunc(d),w=Math.round((d-c)*s);b({yIndex:c,prevYIndex:m,lineX:w,prevLineX:p}),C<t?window.requestAnimationFrame(()=>{V({prevYIndex:c,prevLineX:w,startDate:g})}):v.isFilling=!1}function b({yIndex:m,prevYIndex:p,lineX:g,prevLineX:C}){if(m===p)d(m,{from:C,to:g});else{d(p,{from:C,to:s});for(let c=p+1;c<m;c++)d(c,{from:0,to:s});d(m,{from:0,to:g})}function d(c,{from:w,to:F}){c<u?M({lineWidth:a,lineY:s-a*(c+.5)}):c<f&&M({lineWidth:a+1,lineY:(a+1)*(f-(c+.5))});function M({lineWidth:D,lineY:O}){h.lineWidth=D,h.strokeStyle=e,h.beginPath(),h.moveTo(n+w,o+O),h.lineTo(n+F,o+O),h.stroke()}}}}function nt(i,e,t=Date.now()){Date.now()-t<e?window.requestAnimationFrame(()=>{this.animationTimeout(i,e,t)}):i()}class ot{constructor(e,t){l(this,"durations",{translationAnimation:200,zoomAnimation:200,fillAnimation:300,delayBetweenZooms:30,bumpAnimation:60,stampAnimation:200,delayBetweenBumps:200});l(this,"flags",{waitingServerConfirmMove:!1,waitingServerConfirmFill:!1,isTranslating:!1,isZooming:!1,isTouching:!1,isFilling:!1,isStamping:!1});l(this,"render",()=>{this.map.setViewSize(),this.map.updateCellsLayout(),this.player.updateCoordsInView(),this.map.updateCanvasOffset(),this.map.updateCanvasLayout(),this.map.translate(0),this.map.renderCells(),this.player.translate(0),this.player.setSize(),this.players.update(0)});this.isAdmin=t.isAdmin,this.socket=e,this.map=new H(this,t.map),this.player=new B(this,t.player),this.players=new Z(this,t.players),this.events={...tt,...et,...it},this.fillAnimation=st.bind(this),this.animationTimeout=nt.bind(this)}emit(e,...t){this.events[e].call(this,...t)}init(){G.call(this),j.call(this),Y.call(this),Q.call(this),q.call(this),this.emit("SELECT_COLOR",0),this.render()}}const I=document.getElementById("menu"),z={fill:document.getElementById("help-block-fill"),move:document.getElementById("help-block-move"),zoom:document.getElementById("help-block-zoom")};function L(...i){for(const e of i)z[e].style.display="flex"}function S(...i){for(const e of i)z[e].style.display="none"}function at(i){setTimeout(e,1e3);function e(){L("fill"),i.once("NEW_CONFIRM_FILL",()=>{S("fill"),setTimeout(t,1e3)})}function t(){L("move"),i.once("NEW_SELF_POSITION",()=>{S("move"),setTimeout(s,1e3)})}function s(){I.classList.add("open"),L("zoom"),setTimeout(n,3e3)}function n(){I.classList.remove("open"),S("zoom","move","fill"),x()}}const lt=document.getElementById("help-btn");function x(){lt.addEventListener("click",()=>{I.classList.toggle("open"),I.classList.contains("open")?L("zoom","move","fill"):S("zoom","move","fill")})}const y=N("/game");y.once("INIT_GAME",i=>{new ot(y,i).init(),i.player.ownCells.length===0?at(y):x()});
