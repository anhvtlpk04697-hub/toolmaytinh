const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const logBox=$("#logs"), toast=$("#toast");
function notify(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
function addLog(msg){const d=new Date(); logBox.insertAdjacentHTML("afterbegin",`<div class="log"><time>${d.toLocaleTimeString("vi-VN")}</time><span>${msg}</span></div>`)}
function showPage(id){
  $$(".page").forEach(x=>x.classList.toggle("active",x.id===id));
  $$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===id));
  const active=document.querySelector(`.nav[data-page="${id}"] span`);
  $("#pageTitle").textContent=active?active.textContent:"HOÀNG IT CENTER";
  $("#sidebar").classList.remove("open"); window.scrollTo(0,0);
}
$$(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$$("[data-jump]").forEach(b=>b.onclick=()=>showPage(b.dataset.jump));
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light"); addLog("Đã thay đổi giao diện sáng/tối")};
setInterval(()=>$("#clock").textContent=new Date().toLocaleString("vi-VN"),1000);

function browserInfo(){
  const cores=navigator.hardwareConcurrency||"Không được cung cấp";
  const mem=navigator.deviceMemory?navigator.deviceMemory+" GB":"Không được cung cấp";
  const online=navigator.onLine;
  $("#cores").textContent=cores; $("#memory").textContent=mem;
  $("#networkStatus").textContent=online?"Online":"Offline";
  $("#networkBar").style.width=online?"100%":"8%";
  $("#cpuBar").style.width=Math.min(100,(Number(cores)||4)*7)+"%";
  $("#ramBar").style.width=navigator.deviceMemory?Math.min(100,navigator.deviceMemory*8)+"%":"35%";
  $("#cpuText").textContent=cores+" logical cores";
  $("#ramText").textContent=mem;
  $("#netText").textContent=online?"Internet Connected":"Offline";
  $("#netBadge").textContent=online?"Online":"Offline";
  $("#osText").textContent=navigator.platform||"Browser Environment";
}
function hardware(){
 const data=[
  ["Hệ điều hành / Platform",navigator.platform||"Không xác định"],
  ["CPU logical cores",navigator.hardwareConcurrency||"Không được cung cấp"],
  ["Device memory",navigator.deviceMemory?navigator.deviceMemory+" GB":"Không được cung cấp"],
  ["Ngôn ngữ",navigator.language],
  ["Online",navigator.onLine?"Có":"Không"],
  ["Cookies",navigator.cookieEnabled?"Cho phép":"Tắt"],
  ["Độ phân giải",`${screen.width} × ${screen.height}`],
  ["Color depth",screen.colorDepth+" bit"],
  ["Secure context",window.isSecureContext?"Có":"Không"]
 ];
 $("#hardwareCards").innerHTML=data.map(x=>`<div class="info-card"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");
 $("#ua").textContent=navigator.userAgent;
 $("#secureContext").textContent=window.isSecureContext?"Trang đang chạy trong secure context.":"Trang hiện không chạy trong secure context.";
}
function connection(){
 const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 $("#onlineStatus").textContent=navigator.onLine?"● ONLINE":"● OFFLINE";
 $("#onlineStatus").style.color=navigator.onLine?"var(--good)":"var(--danger)";
 $("#connectionDetails").innerHTML=c?`Loại kết nối: <b>${c.effectiveType||"—"}</b><br>Downlink ước lượng: <b>${c.downlink||"—"} Mbps</b><br>RTT ước lượng: <b>${c.rtt||"—"} ms</b><br>Data saver: <b>${c.saveData?"Bật":"Tắt"}</b>`:"Trình duyệt này không cung cấp Network Information API.";
}
browserInfo();hardware();connection();
window.addEventListener("online",()=>{browserInfo();connection();addLog("Internet đã kết nối lại")});
window.addEventListener("offline",()=>{browserInfo();connection();addLog("Mất kết nối Internet")});
$("#refreshPerf").onclick=()=>{browserInfo();notify("Đã làm mới dữ liệu");addLog("Làm mới thông tin hiệu năng")};
$("#hardwareScan").onclick=()=>{hardware();notify("Đã quét lại thông tin trình duyệt");addLog("Quét cấu hình thiết bị")};
$("#scanAll").onclick=()=>{
  addLog("Bắt đầu quét hệ thống");
  let n=0; const el=$("#score"); el.querySelector("span").textContent="...";
  const t=setInterval(()=>{n+=8;if(n>=96){clearInterval(t);el.querySelector("span").textContent="96";browserInfo();hardware();connection();notify("Quét hoàn tất — hệ thống sẵn sàng");addLog("Hoàn tất quét hệ thống")}else el.querySelector("span").textContent=n},70);
};
$("#clearLog").onclick=()=>{logBox.innerHTML="";notify("Đã xóa nhật ký trên giao diện")};

$("#pingBtn").onclick=async()=>{
 const out=$("#pingResult"); out.textContent="Testing...";
 if(!navigator.onLine){out.textContent="OFFLINE";return}
 const start=performance.now();
 try{
   await fetch(location.href.split("#")[0]+(location.href.includes("?")?"&":"?")+"ping="+Date.now(),{method:"HEAD",cache:"no-store"});
   const ms=Math.round(performance.now()-start); out.textContent=ms+" ms"; addLog("HTTP latency test: "+ms+" ms");
 }catch(e){
   const ms=Math.round(performance.now()-start); out.textContent=ms+" ms*"; addLog("Latency test hoàn tất với giới hạn môi trường");
 }
};

const startup=[
 ["IDMan","HKCU / Run",true],["Adobe CCXProcess","HKCU / Run",false],["LocalSend","HKCU / Run",true],["Cloud Sync","User Startup",false]
];
function renderStartup(){
 $("#startupRows").innerHTML=startup.map((x,i)=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td><button class="switch ${x[2]?"on":"off"}" data-toggle="${i}">${x[2]?"Enable":"Disabled"}</button></td><td><button class="ghost" data-remove="${i}">Xóa</button></td></tr>`).join("");
 $$("[data-toggle]").forEach(b=>b.onclick=()=>{let i=+b.dataset.toggle;startup[i][2]=!startup[i][2];renderStartup();addLog(`Đổi trạng thái demo: ${startup[i][0]}`)});
 $$("[data-remove]").forEach(b=>b.onclick=()=>{startup.splice(+b.dataset.remove,1);renderStartup();notify("Đã xóa khỏi danh sách demo")});
}
renderStartup();
$("#addStartup").onclick=()=>{const name=prompt("Tên ứng dụng demo:");if(name){startup.push([name,"User Startup",true]);renderStartup();addLog("Thêm startup demo: "+name)}};

const apps=[["Visual Studio Code","Microsoft","Current"],["Google Chrome","Google","Current"],["LocalSend","LocalSend","Current"],["7-Zip","Igor Pavlov","Current"],["Node.js","OpenJS Foundation","Current"]];
$("#softwareRows").innerHTML=apps.map((a,i)=>`<tr><td>${i+1}</td><td><b>${a[0]}</b></td><td>${a[1]}</td><td>${a[2]}</td><td><button class="ghost demo-action">Chi tiết</button></td></tr>`).join("");
$$(".demo-action").forEach(b=>b.onclick=()=>notify("Đây là chức năng giao diện demo"));

let timerInt=null,remain=1800;
function paintTimer(){let h=Math.floor(remain/3600),m=Math.floor(remain%3600/60),s=remain%60;$("#timer").textContent=[h,m,s].map(v=>String(v).padStart(2,"0")).join(":")}
$$("[data-min]").forEach(b=>b.onclick=()=>{$("#minutes").value=b.dataset.min;remain=+b.dataset.min*60;paintTimer()});
$("#minutes").oninput=e=>{remain=Math.max(1,+e.target.value||1)*60;paintTimer()};
$("#startTimer").onclick=()=>{clearInterval(timerInt);remain=Math.max(1,+$("#minutes").value||1)*60;paintTimer();addLog("Bắt đầu bộ đếm "+$("#minutes").value+" phút");timerInt=setInterval(()=>{remain--;paintTimer();if(remain<=0){clearInterval(timerInt);notify("Hết giờ! Bản web không tự tắt máy.");addLog("Bộ đếm đã kết thúc")}},1000)};
$("#cancelTimer").onclick=()=>{clearInterval(timerInt);notify("Đã hủy bộ đếm");addLog("Hủy Auto Shutdown demo")};
addLog("HOÀNG IT CENTER đã khởi động");
