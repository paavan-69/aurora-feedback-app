import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL CSS ─────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;font-family:'Plus Jakarta Sans',sans-serif;color:#1e293b}
body{background:#f0f4ff}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-thumb{background:#c7d2fe;border-radius:99px}
input,textarea,select,button{font-family:inherit}
input[type=range]{accent-color:#4f46e5;width:100%;cursor:pointer}

/* Buttons */
.bp{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border:none;border-radius:10px;padding:10px 22px;font-weight:700;font-size:13px;cursor:pointer;transition:all .18s;box-shadow:0 4px 14px rgba(99,102,241,.35)}
.bp:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.45);filter:brightness(1.05)}
.bp:disabled{opacity:.5;cursor:not-allowed;transform:none}
.bs{background:#f1f5f9;color:#475569;border:none;border-radius:10px;padding:10px 22px;font-weight:700;font-size:13px;cursor:pointer;transition:all .18s}
.bs:hover{background:#e2e8f0}
.bd{background:#fee2e2;color:#dc2626;border:none;border-radius:10px;padding:10px 22px;font-weight:700;font-size:13px;cursor:pointer;transition:all .18s}
.bd:hover{background:#fecaca}
.bg{background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.3);border-radius:9px;padding:7px 15px;font-weight:700;font-size:12px;cursor:pointer;transition:all .18s;backdrop-filter:blur(6px)}
.bg:hover{background:rgba(255,255,255,.28)}
.bsm{padding:6px 14px!important;font-size:12px!important}

/* Form */
.fi{width:100%;padding:10px 13px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:13px;outline:none;background:#f8fafc;transition:border-color .2s,box-shadow .2s;color:#1e293b}
.fi:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12);background:#fff}
.fi::placeholder{color:#94a3b8}
label.lbl{display:block;font-size:11px;font-weight:800;color:#64748b;margin-bottom:5px;text-transform:uppercase;letter-spacing:.6px}

/* Cards */
.card{background:#fff;border-radius:16px;box-shadow:0 2px 18px rgba(0,0,0,.06);padding:20px;transition:box-shadow .2s,transform .2s}
.card:hover{box-shadow:0 8px 32px rgba(79,70,229,.13);transform:translateY(-2px)}

/* Tags */
.tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;margin:2px}
.tp{background:#ede9fe;color:#7c3aed}
.tb{background:#dbeafe;color:#1d4ed8}
.tg{background:#d1fae5;color:#065f46}
.ty{background:#fef3c7;color:#92400e}
.tr{background:#fee2e2;color:#dc2626}
.tk{background:#f1f5f9;color:#475569}

/* Tab nav */
.tnav-btn{border:none;background:transparent;font-weight:700;font-size:13px;cursor:pointer;padding:10px 18px;border-bottom:2.5px solid transparent;transition:all .18s;white-space:nowrap;color:#64748b}
.tnav-btn.active{color:#4f46e5;border-bottom-color:#4f46e5}
.tnav-btn:hover:not(.active){color:#1e293b}

/* Modal */
.mo{position:fixed;inset:0;background:rgba(15,23,42,.65);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(5px);overflow-y:auto}
.mb{background:#fff;border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,.28);width:100%;max-width:580px;max-height:92vh;overflow-y:auto;padding:26px}

/* Toast */
.toast{position:fixed;top:18px;right:18px;padding:13px 18px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,.15);animation:tIn .3s ease;display:flex;align-items:center;gap:9px;max-width:360px}
@keyframes tIn{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}

/* Table */
table{width:100%;border-collapse:collapse}
thead tr{background:#f8fafc}
th{padding:9px 14px;text-align:left;font-weight:700;color:#475569;font-size:12px;white-space:nowrap}
td{padding:10px 14px;font-size:13px;border-top:1px solid #f1f5f9}

/* Stat bar */
.sbar{height:7px;border-radius:4px;background:#f1f5f9;overflow:hidden;margin-top:4px}
.sbar-f{height:100%;border-radius:4px;background:linear-gradient(90deg,#2563eb,#7c3aed);transition:width .8s cubic-bezier(.4,0,.2,1)}

/* Section header */
.sec-hd{font-size:17px;font-weight:900;margin-bottom:16px;display:flex;align-items:center;gap:8px}

/* Rating badge */
.rbadge{display:inline-flex;align-items:center;gap:3px;background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;padding:2px 9px;border-radius:20px;font-weight:800;font-size:12px}

@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn .3s ease}
`;

/* ─── UTILS ─────────────────────────────────────────────────── */
const hashPw = async p => { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(p)); return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join(""); };
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const avg = a => a.length ? a.reduce((s,x)=>s+x,0)/a.length : 0;
const clamp = (v,lo,hi) => Math.min(Math.max(v,lo),hi);
const fmt = iso => { try { return new Date(iso).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); } catch { return "—"; }};

/* ─── SEED DATA ─────────────────────────────────────────────── */
const ST = [
  {id:"t1",name:"Dr. Priya Sharma",dept:"Computer Science",email:"priya@aurora.edu",phone:"9876543210",subjects:["Data Structures","Algorithms","Python"],exp:"12 years",qual:"PhD Computer Science",emoji:"👩‍💻",rating:4.6,feedbacks:2,trend:"up",at:"2023-06-01T00:00:00Z"},
  {id:"t2",name:"Prof. Rajesh Kumar",dept:"Mathematics",email:"rajesh@aurora.edu",phone:"9876543211",subjects:["Calculus","Linear Algebra","Statistics"],exp:"8 years",qual:"M.Sc Mathematics, B.Ed",emoji:"👨‍🏫",rating:4.2,feedbacks:1,trend:"same",at:"2023-06-01T00:00:00Z"},
  {id:"t3",name:"Dr. Anitha Reddy",dept:"Physics",email:"anitha@aurora.edu",phone:"9876543212",subjects:["Quantum Mechanics","Thermodynamics","Optics"],exp:"15 years",qual:"PhD Physics, IIT Hyderabad",emoji:"👩‍🔬",rating:4.8,feedbacks:1,trend:"up",at:"2023-06-01T00:00:00Z"},
  {id:"t4",name:"Mr. Vikram Nair",dept:"Electronics",email:"vikram@aurora.edu",phone:"9876543213",subjects:["Circuit Theory","Digital Electronics","Microcontrollers"],exp:"6 years",qual:"M.Tech Electronics",emoji:"👨‍🔬",rating:3.9,feedbacks:1,trend:"up",at:"2023-07-01T00:00:00Z"},
  {id:"t5",name:"Dr. Meena Iyer",dept:"Chemistry",email:"meena@aurora.edu",phone:"9876543214",subjects:["Organic Chemistry","Analytical Chem","Biochemistry"],exp:"10 years",qual:"PhD Chemistry, BITS Pilani",emoji:"🧪",rating:4.4,feedbacks:1,trend:"same",at:"2023-07-15T00:00:00Z"},
  {id:"t6",name:"Prof. Suresh Babu",dept:"Computer Science",email:"suresh@aurora.edu",phone:"9876543215",subjects:["Database Systems","Computer Networks","OS"],exp:"9 years",qual:"M.Tech CS",emoji:"🧑‍💻",rating:4.1,feedbacks:1,trend:"up",at:"2023-08-01T00:00:00Z"},
];
const SF = [
  {id:"f1",tid:"t1",sid:"s0",tc:5,sk:5,ac:4,en:5,pu:4,txt:"Dr. Priya explains complex algorithms with great clarity. Her real-world examples make even difficult topics approachable and easy to understand for all students.",ai:"positive",str:["Excellent clarity","Real-world examples","Strong expertise"],imp:["More practice problems needed"],dt:"2024-10-15T10:00:00Z"},
  {id:"f2",tid:"t1",sid:"s1",tc:4,sk:5,ac:5,en:4,pu:5,txt:"Very knowledgeable professor. Always available for doubt sessions. Course material is well-structured and easy to follow for all levels of students.",ai:"positive",str:["Highly accessible","Well-structured content","Punctual"],imp:["More interactive sessions"],dt:"2024-11-01T10:00:00Z"},
  {id:"f3",tid:"t2",sid:"s0",tc:4,sk:4,ac:4,en:4,pu:5,txt:"Professor Rajesh makes mathematics interesting with practical applications. Explanations are systematic and he never rushes through any concept in class.",ai:"positive",str:["Systematic approach","Practical applications","Never rushes"],imp:["More visual aids"],dt:"2024-10-20T10:00:00Z"},
  {id:"f4",tid:"t3",sid:"s1",tc:5,sk:5,ac:5,en:5,pu:4,txt:"Dr. Anitha is brilliant! Her passion for physics is infectious. She makes quantum mechanics feel intuitive and connects every topic to real phenomena beautifully.",ai:"positive",str:["Deep passion","Intuitive explanations","Theory to practice"],imp:["More exam-focused practice"],dt:"2024-11-10T10:00:00Z"},
  {id:"f5",tid:"t4",sid:"s0",tc:4,sk:4,ac:3,en:4,pu:4,txt:"Mr. Vikram is good at explaining circuit concepts. Lab sessions are very practical and useful. Pace is sometimes fast but overall a great learning experience.",ai:"positive",str:["Practical labs","Good explanation"],imp:["Slow down pace","More office hours"],dt:"2024-11-05T10:00:00Z"},
  {id:"f6",tid:"t5",sid:"s1",tc:4,sk:5,ac:5,en:4,pu:5,txt:"Dr. Meena has exceptional chemistry knowledge. Organic chemistry classes are very well-organized and her notes are comprehensive and clear for exam prep.",ai:"positive",str:["Exceptional knowledge","Well-organized","Comprehensive notes"],imp:["More problem-solving"],dt:"2024-10-28T10:00:00Z"},
  {id:"f7",tid:"t6",sid:"s0",tc:4,sk:4,ac:4,en:3,pu:4,txt:"Prof. Suresh explains database concepts clearly. Practical lab sessions are very helpful. Could make lectures more interactive and engaging for students.",ai:"neutral",str:["Clear DB explanations","Helpful labs"],imp:["More interactive lectures","Better engagement"],dt:"2024-11-12T10:00:00Z"},
];
const SR = [
  {id:"r1",title:"Data Structures QB 2024",sub:"Data Structures",type:"qb",sem:"3rd",stream:"B.Sc CS",year:null,size:"2.4 MB"},
  {id:"r2",title:"Calculus Question Bank",sub:"Calculus",type:"qb",sem:"1st",stream:"B.Sc Maths",year:null,size:"1.8 MB"},
  {id:"r3",title:"Physics Optics & Waves QB",sub:"Physics",type:"qb",sem:"2nd",stream:"B.Sc Physics",year:null,size:"3.1 MB"},
  {id:"r4",title:"Organic Chemistry Reactions",sub:"Organic Chem",type:"qb",sem:"3rd",stream:"B.Sc Chem",year:null,size:"2.7 MB"},
  {id:"r5",title:"Digital Electronics QB 2024",sub:"Digital Elec",type:"qb",sem:"4th",stream:"B.Sc Elec",year:null,size:"1.9 MB"},
  {id:"r6",title:"Database Systems QB",sub:"DBMS",type:"qb",sem:"4th",stream:"B.Sc CS",year:null,size:"2.1 MB"},
  {id:"r7",title:"Algorithms PYQ 2023",sub:"Algorithms",type:"pyq",sem:"4th",stream:"B.Sc CS",year:"2023",size:"1.2 MB"},
  {id:"r8",title:"Thermodynamics Exam 2022",sub:"Thermodynamics",type:"pyq",sem:"3rd",stream:"B.Sc Physics",year:"2022",size:"0.9 MB"},
  {id:"r9",title:"Linear Algebra Final 2023",sub:"Linear Algebra",type:"pyq",sem:"2nd",stream:"B.Sc Maths",year:"2023",size:"1.5 MB"},
  {id:"r10",title:"Circuit Theory End Sem 2022",sub:"Circuit Theory",type:"pyq",sem:"3rd",stream:"B.Sc Elec",year:"2022",size:"1.1 MB"},
  {id:"r11",title:"Organic Chem PYQ 2023",sub:"Organic Chem",type:"pyq",sem:"3rd",stream:"B.Sc Chem",year:"2023",size:"1.3 MB"},
];

/* ─── STORE ─────────────────────────────────────────────────── */
const DB = "aur4_";
const Store = {
  g:(k,d)=>{ try{const v=localStorage.getItem(DB+k);return v!==null?JSON.parse(v):d;}catch{return d;}},
  s:(k,v)=>{ try{localStorage.setItem(DB+k,JSON.stringify(v));}catch{}},
  init(){
    if(!this.g("ok",false)){
      this.s("teachers",ST);this.s("feedbacks",SF);this.s("students",[]);this.s("ok",true);
    }
  }
};

/* ─── CLAUDE API ─────────────────────────────────────────────── */
const callAI = async(r,txt,key)=>{
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`Analyze this college lecturer feedback. Ratings(1-5): Teaching Clarity:${r.tc}, Subject Knowledge:${r.sk}, Accessibility:${r.ac}, Engagement:${r.en}, Punctuality:${r.pu}. Comments:"${txt}". Respond ONLY with JSON: {"sentiment":"positive|neutral|negative","str":["a","b","c"],"imp":["a","b"],"sum":"one sentence"}`}]})
  });
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e?.error?.message||`API ${res.status}`);}
  const d=await res.json();
  return JSON.parse(d.content[0].text.replace(/```json|```/g,"").trim());
};

/* ─── MINI COMPONENTS ──────────────────────────────────────── */
const Stars=({r,sz=14})=>(
  <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(i=><span key={i} style={{fontSize:sz,lineHeight:1,color:i<=Math.floor(r)?"#f59e0b":i===Math.ceil(r)&&r%1>=.5?"#f59e0b":"#d1d5db"}}>{i<=Math.floor(r)?"★":"☆"}</span>)}
  </span>
);
const Tag=({c="tp",children})=><span className={`tag ${c}`}>{children}</span>;
const Trend=({t})=><span style={{fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:700,background:t==="up"?"#d1fae5":t==="down"?"#fee2e2":"#f1f5f9",color:t==="up"?"#059669":t==="down"?"#dc2626":"#64748b"}}>{t==="up"?"↑":t==="down"?"↓":"→"}</span>;
const Bar=({v,max=5})=><div className="sbar"><div className="sbar-f" style={{width:`${(v/max)*100}%`}}/></div>;

const Toast=({msg,type,onClose})=>(
  <div className="toast" style={{background:type==="error"?"#fef2f2":type==="warn"?"#fffbeb":"#f0fdf4",border:`1.5px solid ${type==="error"?"#fca5a5":type==="warn"?"#fcd34d":"#86efac"}`,color:type==="error"?"#dc2626":type==="warn"?"#92400e":"#15803d"}}>
    <span>{type==="error"?"❌":type==="warn"?"⚠️":"✅"}</span>
    <span style={{flex:1}}>{msg}</span>
    <span onClick={onClose} style={{cursor:"pointer",opacity:.5,fontSize:16,flexShrink:0}}>✕</span>
  </div>
);

const FF=({label,children})=>(
  <div style={{marginBottom:13}}>
    <label className="lbl">{label}</label>
    {children}
  </div>
);

const SectionTitle=({icon,title,count,right})=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
    <h2 className="sec-hd" style={{margin:0}}>{icon} {title}{count!==undefined&&<span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>({count})</span>}</h2>
    {right}
  </div>
);

/* ─── MAIN APP ──────────────────────────────────────────────── */
export default function App(){
  /* State */
  const [user,setUser]=useState(null);
  const [view,setView]=useState("login"); // login | home | admin
  const [tab,setTab]=useState("lecturers"); // lecturers | qb | pyq
  const [atab,setAtab]=useState("overview"); // overview | teachers | add | bulk | feedback-log
  const [teachers,setTeachers]=useState([]);
  const [feedbacks,setFeedbacks]=useState([]);
  const [students,setStudents]=useState([]);
  const [apiKey,setApiKey]=useState("");
  const [lmode,setLmode]=useState("student");
  const [isReg,setIsReg]=useState(false);
  const [toast,setToast]=useState(null);
  const [search,setSearch]=useState("");
  const [deptF,setDeptF]=useState("All");
  const [modal,setModal]=useState(null); // null | {type:"teacher"|"feedback"|"delete"|"bulk-preview"|"teacher-detail", data}
  const [editT,setEditT]=useState(null);
  const [submitting,setSubmitting]=useState(false);
  const [bulkTxt,setBulkTxt]=useState("");
  const [bulkPrev,setBulkPrev]=useState(null);
  const tmr=useRef();

  /* Forms */
  const [lf,setLf]=useState({id:"",pw:""});
  const [rf,setRf]=useState({username:"",email:"",roll:"",pw:"",pw2:""});
  const [tf,setTf]=useState({name:"",dept:"",email:"",phone:"",subjects:"",exp:"",qual:"",emoji:"👤"});
  const [ff,setFf]=useState({tid:"",tc:3,sk:3,ac:3,en:3,pu:3,txt:""});

  useEffect(()=>{
    Store.init();
    setTeachers(Store.g("teachers",ST));
    setFeedbacks(Store.g("feedbacks",SF));
    setStudents(Store.g("students",[]));
    setApiKey(localStorage.getItem("aur_ak")||"");
  },[]);

  const notify=(msg,type="ok")=>{
    clearTimeout(tmr.current);
    setToast({msg,type});
    tmr.current=setTimeout(()=>setToast(null),4000);
  };
  const saveT=t=>{setTeachers(t);Store.s("teachers",t);};
  const saveF=f=>{setFeedbacks(f);Store.s("feedbacks",f);};
  const saveS=s=>{setStudents(s);Store.s("students",s);};

  /* ── Auth ── */
  const login=async()=>{
    if(!lf.id||!lf.pw){notify("Fill in all fields","error");return;}
    if(lmode==="admin"){
      if(lf.id==="admin"&&lf.pw==="admin123"){setUser({id:"admin",username:"admin",name:"Administrator",role:"admin"});setView("admin");setAtab("overview");}
      else notify("Invalid admin credentials","error");
      return;
    }
    const s=students.find(s=>s.username===lf.id||s.email===lf.id||s.roll===lf.id);
    if(!s){notify("Student not found — please register","error");return;}
    if(s.hash!==await hashPw(lf.pw)){notify("Incorrect password","error");return;}
    setUser({...s,role:"student"});setView("home");setTab("lecturers");
  };
  const register=async()=>{
    if(!rf.username||!rf.email||!rf.roll||!rf.pw||!rf.pw2){notify("All fields required","error");return;}
    if(!/\S+@\S+\.\S+/.test(rf.email)){notify("Invalid email","error");return;}
    if(rf.pw!==rf.pw2){notify("Passwords don't match","error");return;}
    if(rf.pw.length<6){notify("Password min 6 chars","error");return;}
    if(students.find(s=>s.email===rf.email||s.roll===rf.roll||s.username===rf.username)){notify("Email/roll/username already taken","error");return;}
    const ns={id:uid(),username:rf.username,email:rf.email,roll:rf.roll,hash:await hashPw(rf.pw),at:new Date().toISOString()};
    saveS([...students,ns]);
    notify("Account created! Please login.");
    setIsReg(false);setLf({id:rf.username,pw:""});setRf({username:"",email:"",roll:"",pw:"",pw2:""});
  };
  const logout=()=>{setUser(null);setView("login");setLf({id:"",pw:""});setModal(null);};

  /* ── Teacher helpers ── */
  const tRatings=tid=>{
    const fs=feedbacks.filter(f=>f.tid===tid);
    if(!fs.length)return{tc:0,sk:0,ac:0,en:0,pu:0,overall:0};
    return{tc:avg(fs.map(f=>f.tc)),sk:avg(fs.map(f=>f.sk)),ac:avg(fs.map(f=>f.ac)),en:avg(fs.map(f=>f.en)),pu:avg(fs.map(f=>f.pu)),overall:avg(fs.map(f=>avg([f.tc,f.sk,f.ac,f.en,f.pu])))};
  };
  const recalc=(tid,afs)=>{
    const fs=afs.filter(f=>f.tid===tid);
    if(!fs.length)return{};
    return{rating:Math.round(avg(fs.map(f=>avg([f.tc,f.sk,f.ac,f.en,f.pu])))*10)/10,feedbacks:fs.length,trend:"up"};
  };
  const insights=tid=>{
    const fs=feedbacks.filter(f=>f.tid===tid);
    if(!fs.length)return null;
    return{str:[...new Set(fs.flatMap(f=>f.str||[]))].slice(0,4),imp:[...new Set(fs.flatMap(f=>f.imp||[]))].slice(0,3)};
  };
  const chart=tid=>{
    const fs=feedbacks.filter(f=>f.tid===tid),now=new Date();
    return Array.from({length:6},(_,i)=>{
      const d=new Date(now.getFullYear(),now.getMonth()-(5-i),1);
      const mfs=fs.filter(f=>{const fd=new Date(f.dt);return fd.getFullYear()===d.getFullYear()&&fd.getMonth()===d.getMonth();});
      const v=mfs.length?avg(mfs.map(f=>avg([f.tc,f.sk,f.ac,f.en,f.pu]))):0;
      return{label:d.toLocaleString("en",{month:"short"}),v:Math.round(v*10)/10};
    });
  };

  /* ── CRUD ── */
  const openAddTeacher=()=>{setEditT(null);setTf({name:"",dept:"",email:"",phone:"",subjects:"",exp:"",qual:"",emoji:"👤"});setModal({type:"teacher"});};
  const openEditTeacher=t=>{setEditT(t);setTf({name:t.name,dept:t.dept,email:t.email,phone:t.phone,subjects:Array.isArray(t.subjects)?t.subjects.join(", "):t.subjects,exp:t.exp,qual:t.qual,emoji:t.emoji});setModal({type:"teacher"});};
  const saveTeacher=()=>{
    if(!tf.name.trim()||!tf.dept.trim()||!tf.email.trim()){notify("Name, dept & email required","error");return;}
    if(!/\S+@\S+\.\S+/.test(tf.email)){notify("Invalid email","error");return;}
    const subs=tf.subjects.split(",").map(s=>s.trim()).filter(Boolean);
    if(editT){saveT(teachers.map(t=>t.id===editT.id?{...t,...tf,subjects:subs}:t));notify("Teacher updated!");}
    else{
      if(teachers.find(t=>t.email.toLowerCase()===tf.email.toLowerCase())){notify("Email already exists","error");return;}
      saveT([...teachers,{id:uid(),...tf,subjects:subs,rating:0,feedbacks:0,trend:"same",at:new Date().toISOString()}]);notify("Teacher added!");
    }
    setEditT(null);setModal(null);
  };
  const deleteTeacher=id=>{
    saveT(teachers.filter(t=>t.id!==id));saveF(feedbacks.filter(f=>f.tid!==id));setModal(null);notify("Teacher deleted");
  };

  /* ── Submit feedback ── */
  const submitFb=async()=>{
    if(!ff.tid){notify("Select a lecturer","error");return;}
    if(ff.txt.trim().length<50){notify("Comments need 50+ characters","error");return;}
    if(feedbacks.find(f=>f.tid===ff.tid&&f.sid===user.id)){notify("Already reviewed this lecturer","warn");return;}
    setSubmitting(true);
    let ai={sentiment:"neutral",str:["Good teaching"],imp:["Keep improving"],sum:"Feedback noted."};
    if(apiKey){try{const r=await callAI(ff,ff.txt,apiKey);ai={sentiment:r.sentiment,str:r.str||r.strengths||[],imp:r.imp||r.improvements||[],sum:r.sum||r.summary||""};}catch(e){notify(`AI skipped: ${e.message}`,"warn");}}
    const nf={id:uid(),tid:ff.tid,sid:user.id,tc:ff.tc,sk:ff.sk,ac:ff.ac,en:ff.en,pu:ff.pu,txt:ff.txt.trim(),ai:ai.sentiment,str:ai.str,imp:ai.imp,dt:new Date().toISOString()};
    const afs=[...feedbacks,nf];
    saveF(afs);saveT(teachers.map(t=>t.id===ff.tid?{...t,...recalc(ff.tid,afs)}:t));
    setFf({tid:"",tc:3,sk:3,ac:3,en:3,pu:3,txt:""});setModal(null);setSubmitting(false);
    notify(apiKey?"Feedback submitted with AI analysis! ✨":"Feedback submitted!");
  };

  /* ── Derived ── */
  const depts=["All",...new Set(teachers.map(t=>t.dept))];
  const filtered=teachers.filter(t=>{
    const q=!search||[t.name,t.dept,...(t.subjects||[])].some(s=>s.toLowerCase().includes(search.toLowerCase()));
    const d=deptF==="All"||t.dept===deptF;
    return q&&d;
  });
  const analytics={
    total:teachers.length,fb:feedbacks.length,stu:students.length,
    avg:teachers.filter(t=>t.feedbacks>0).length?avg(teachers.filter(t=>t.feedbacks>0).map(t=>t.rating)):0,
    top:[...teachers].sort((a,b)=>b.rating-a.rating).filter(t=>t.feedbacks>0).slice(0,5),
    depts:[...new Set(teachers.map(t=>t.dept))].map(d=>({d,cnt:teachers.filter(t=>t.dept===d).length,avg:avg(teachers.filter(t=>t.dept===d&&t.feedbacks>0).map(t=>t.rating))})),
  };

  /* ══════════════════════════════════════════════════════════
     MODALS
  ══════════════════════════════════════════════════════════ */
  const TeacherFormModal=()=>{
    const emojis=["👤","👨‍🏫","👩‍🏫","👨‍💻","👩‍💻","👨‍🔬","👩‍🔬","🧑‍🏫","👨‍🎓","👩‍🎓","🧪","📐","🔭","🧬"];
    return(
      <div className="mo" onClick={()=>setModal(null)}>
        <div className="mb" onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:14,borderBottom:"1.5px solid #f1f5f9"}}>
            <h2 style={{fontWeight:900,fontSize:18}}>{editT?"✏️ Edit Teacher":"➕ Add New Teacher"}</h2>
            <button onClick={()=>setModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Full Name *","name","text","Dr. Full Name"],["Department *","dept","text","e.g. Computer Science"],["Email *","email","email","teacher@aurora.edu"],["Phone","phone","tel","9876543210"],["Qualification","qual","text","PhD, M.Tech…"],["Experience","exp","text","e.g. 8 years"]].map(([lb,k,t,ph])=>(
              <FF key={k} label={lb}><input className="fi" type={t} placeholder={ph} value={tf[k]} onChange={e=>setTf(p=>({...p,[k]:e.target.value}))}/></FF>
            ))}
          </div>
          <FF label="Subjects (comma-separated)"><input className="fi" placeholder="Data Structures, Algorithms…" value={tf.subjects} onChange={e=>setTf(p=>({...p,subjects:e.target.value}))}/></FF>
          <FF label="Profile Emoji">
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {emojis.map(em=><button key={em} onClick={()=>setTf(p=>({...p,emoji:em}))} style={{fontSize:20,padding:"5px 9px",borderRadius:9,border:tf.emoji===em?"2.5px solid #4f46e5":"2px solid #e2e8f0",background:tf.emoji===em?"#ede9fe":"#f8fafc",cursor:"pointer"}}>{em}</button>)}
            </div>
          </FF>
          <div style={{display:"flex",gap:10,marginTop:6}}>
            <button className="bp" onClick={saveTeacher}>{editT?"💾 Save Changes":"➕ Add Teacher"}</button>
            <button className="bs" onClick={()=>setModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const FeedbackModal=()=>{
    const cats=[["tc","📖 Teaching Clarity"],["sk","🧠 Subject Knowledge"],["ac","🤝 Accessibility"],["en","⚡ Engagement"],["pu","⏰ Punctuality"]];
    const lbl={1:"Poor",2:"Fair",3:"Good",4:"Very Good",5:"Excellent"};
    return(
      <div className="mo" onClick={()=>setModal(null)}>
        <div className="mb" onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,paddingBottom:14,borderBottom:"1.5px solid #f1f5f9"}}>
            <h2 style={{fontWeight:900,fontSize:18}}>✏️ Submit Feedback</h2>
            <button onClick={()=>setModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15}}>✕</button>
          </div>
          <FF label="Select Lecturer">
            <select className="fi" value={ff.tid} onChange={e=>setFf(p=>({...p,tid:e.target.value}))}>
              <option value="">— Choose a lecturer —</option>
              {teachers.map(t=>{const done=feedbacks.some(f=>f.tid===t.id&&f.sid===user?.id);return<option key={t.id} value={t.id} disabled={done}>{t.name} ({t.dept}){done?" ✅ Reviewed":""}</option>;})}
            </select>
          </FF>
          {cats.map(([k,lb])=>(
            <div key={k} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:700}}>{lb}</span>
                <span style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:800}}>{ff[k]} — {lbl[ff[k]]}</span>
              </div>
              <input type="range" min={1} max={5} step={1} value={ff[k]} onChange={e=>setFf(p=>({...p,[k]:+e.target.value}))}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#94a3b8",marginTop:1}}><span>1 Poor</span><span>5 Excellent</span></div>
            </div>
          ))}
          <FF label={`Comments (${ff.txt.length}/50 min)`}>
            <textarea className="fi" style={{height:90,resize:"vertical",lineHeight:1.6}} placeholder="Describe your experience with this lecturer in detail…" value={ff.txt} onChange={e=>setFf(p=>({...p,txt:e.target.value}))}/>
            <div style={{fontSize:11,marginTop:3,fontWeight:600,color:ff.txt.length>=50?"#059669":"#94a3b8"}}>{ff.txt.length>=50?"✅ Good length":`${50-ff.txt.length} more chars needed`}</div>
          </FF>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button className="bp" onClick={submitFb} disabled={submitting} style={{flex:1}}>{submitting?"⏳ Analyzing…":apiKey?"🚀 Submit + AI Analysis":"🚀 Submit Feedback"}</button>
            <button className="bs" onClick={()=>setModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const TeacherDetailModal=({t})=>{
    const r=tRatings(t.id);
    const ins=insights(t.id);
    const ch=chart(t.id);
    const tfs=feedbacks.filter(f=>f.tid===t.id);
    const done=tfs.some(f=>f.sid===user?.id);
    const mx=Math.max(...ch.map(c=>c.v),5);
    return(
      <div className="mo" onClick={()=>setModal(null)}>
        <div className="mb" style={{maxWidth:640}} onClick={e=>e.stopPropagation()}>
          {/* Header */}
          <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:18,paddingBottom:16,borderBottom:"1.5px solid #f1f5f9"}}>
            <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#ede9fe,#dbeafe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0}}>{t.emoji}</div>
            <div style={{flex:1}}>
              <h2 style={{fontWeight:900,fontSize:20,marginBottom:2}}>{t.name}</h2>
              <p style={{color:"#64748b",fontSize:13,marginBottom:6}}>{t.dept}{t.qual?` · ${t.qual}`:""}</p>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <Stars r={r.overall} sz={16}/><span style={{fontWeight:900,fontSize:18}}>{r.overall>0?r.overall.toFixed(1):"—"}</span>
                <span style={{color:"#94a3b8",fontSize:12}}>({t.feedbacks} reviews)</span><Trend t={t.trend}/>
              </div>
            </div>
            <button onClick={()=>setModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15,flexShrink:0}}>✕</button>
          </div>
          {/* Info row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
            {[["📧",t.email],["📞",t.phone||"—"],["🎓",t.exp||"—"],["📚",t.subjects?.slice(0,2).join(", ")||"—"]].map(([ic,v])=>(
              <div key={ic} style={{padding:"8px 12px",background:"#f8fafc",borderRadius:10}}>
                <span style={{fontSize:11,color:"#94a3b8",fontWeight:700}}>{ic} </span>
                <span style={{fontSize:12,fontWeight:600,color:"#1e293b"}}>{v}</span>
              </div>
            ))}
          </div>
          {/* Rating breakdown */}
          <h4 style={{fontWeight:800,marginBottom:10,fontSize:14}}>Rating Breakdown</h4>
          {[["📖 Teaching Clarity",r.tc],["🧠 Subject Knowledge",r.sk],["🤝 Accessibility",r.ac],["⚡ Engagement",r.en],["⏰ Punctuality",r.pu]].map(([lb,v])=>(
            <div key={lb} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:"#475569",fontWeight:600}}>{lb}</span><span style={{fontSize:12,fontWeight:800,color:"#4f46e5"}}>{v>0?v.toFixed(1):"—"}</span></div>
              <Bar v={v}/>
            </div>
          ))}
          {/* Chart */}
          <h4 style={{fontWeight:800,margin:"16px 0 8px",fontSize:14}}>6-Month Trend</h4>
          <div style={{background:"#f8fafc",borderRadius:12,padding:"10px 10px 4px",display:"flex",alignItems:"flex-end",gap:5,height:70}}>
            {ch.map((c,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                {c.v>0&&<span style={{fontSize:8,color:"#64748b",fontWeight:700}}>{c.v}</span>}
                <div style={{width:"100%",minHeight:4,height:`${clamp((c.v/mx)*44,4,44)}px`,background:"linear-gradient(to top,#2563eb,#7c3aed)",borderRadius:"3px 3px 0 0",transition:"height .6s ease"}}/>
                <span style={{fontSize:8,color:"#94a3b8",fontWeight:600}}>{c.label}</span>
              </div>
            ))}
          </div>
          {/* AI insights */}
          {ins&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"16px 0"}}>
            {ins.str.length>0&&<div style={{background:"#f0fdf4",borderRadius:12,padding:12}}><div style={{fontWeight:800,color:"#059669",fontSize:12,marginBottom:7}}>✅ Strengths</div>{ins.str.map((s,i)=><div key={i} style={{fontSize:11,color:"#166534",marginBottom:4,lineHeight:1.4}}>• {s}</div>)}</div>}
            {ins.imp.length>0&&<div style={{background:"#fff7ed",borderRadius:12,padding:12}}><div style={{fontWeight:800,color:"#ea580c",fontSize:12,marginBottom:7}}>🎯 To Improve</div>{ins.imp.map((s,i)=><div key={i} style={{fontSize:11,color:"#9a3412",marginBottom:4,lineHeight:1.4}}>• {s}</div>)}</div>}
          </div>}
          {/* Recent feedback */}
          {tfs.length>0&&<><h4 style={{fontWeight:800,marginBottom:8,fontSize:14}}>Recent Feedback</h4>
          {[...tfs].reverse().slice(0,2).map(fb=>(
            <div key={fb.id} style={{padding:"9px 12px",background:"#f8fafc",borderRadius:10,marginBottom:7,borderLeft:`3px solid ${fb.ai==="positive"?"#059669":fb.ai==="negative"?"#dc2626":"#94a3b8"}`}}>
              <div style={{fontSize:10,color:"#94a3b8",marginBottom:3,fontWeight:600}}>{fmt(fb.dt)}</div>
              <div style={{fontSize:12,color:"#1e293b",lineHeight:1.5}}>"{fb.txt.length>100?fb.txt.slice(0,100)+"…":fb.txt}"</div>
            </div>
          ))}</>}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            {done
              ?<div style={{padding:"9px 14px",background:"#f0fdf4",borderRadius:10,fontSize:12,color:"#059669",fontWeight:700}}>✅ You've already reviewed this lecturer</div>
              :<button className="bp" onClick={()=>{setFf(p=>({...p,tid:t.id}));setModal({type:"feedback"});}}>✏️ Submit Feedback</button>
            }
            <button className="bs" onClick={()=>setModal(null)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteModal=({id})=>(
    <div className="mo">
      <div style={{background:"#fff",borderRadius:20,padding:30,maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,.28)"}}>
        <div style={{fontSize:48,marginBottom:10}}>⚠️</div>
        <h3 style={{fontWeight:900,marginBottom:7}}>Delete Teacher?</h3>
        <p style={{color:"#64748b",fontSize:13,lineHeight:1.7,marginBottom:18}}>This permanently deletes the teacher and <strong>{feedbacks.filter(f=>f.tid===id).length} feedbacks</strong>. Cannot be undone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="bd" onClick={()=>deleteTeacher(id)}>Yes, Delete</button>
          <button className="bs" onClick={()=>setModal(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const BulkPreviewModal=()=>(
    <div className="mo" onClick={()=>setModal(null)}>
      <div className="mb" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:14,borderBottom:"1.5px solid #f1f5f9"}}>
          <h2 style={{fontWeight:900,fontSize:18}}>📋 Preview Import ({bulkPrev?.length} teachers)</h2>
          <button onClick={()=>setModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        <div style={{maxHeight:300,overflowY:"auto",marginBottom:16}}>
          {bulkPrev?.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:"#f8fafc",borderRadius:8,marginBottom:6}}>
              <span style={{fontSize:20}}>{t.emoji||"👤"}</span>
              <div><div style={{fontWeight:700,fontSize:13}}>{t.name||<span style={{color:"#dc2626"}}>⚠ Missing name</span>}</div><div style={{fontSize:11,color:"#64748b"}}>{t.dept||"—"} · {t.email||"—"}</div></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="bp" onClick={()=>{
            saveT([...teachers,...bulkPrev.map(t=>({id:uid(),name:t.name||"Unknown",dept:t.dept||"General",email:t.email||"",phone:t.phone||"",subjects:Array.isArray(t.subjects)?t.subjects:[],exp:t.exp||"",qual:t.qual||"",emoji:t.emoji||"👤",rating:0,feedbacks:0,trend:"same",at:new Date().toISOString()}))]);
            notify(`${bulkPrev.length} teachers imported!`);setBulkPrev(null);setBulkTxt("");setModal(null);setAtab("teachers");
          }}>✅ Confirm Import</button>
          <button className="bs" onClick={()=>setModal(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     LOGIN SCREEN
  ══════════════════════════════════════════════════════════ */
  if(view==="login") return(
    <>
      <style>{G}</style>
      {toast&&<Toast {...toast} onClose={()=>setToast(null)}/>}
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#2e1065 100%)",padding:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-200,right:-200,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.2),transparent)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-150,left:-150,width:450,height:450,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.15),transparent)",pointerEvents:"none"}}/>
        <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,.99)",borderRadius:22,boxShadow:"0 40px 80px rgba(0,0,0,.5)",overflow:"hidden"}}>
          <div style={{height:5,background:"linear-gradient(90deg,#2563eb,#7c3aed,#db2777)"}}/>
          <div style={{padding:"32px 32px 28px"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:50,marginBottom:8}}>🎓</div>
              <h1 style={{fontWeight:900,fontSize:18,background:"linear-gradient(135deg,#1e40af,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:3}}>Aurora's Degree & PG College</h1>
              <p style={{color:"#94a3b8",fontSize:12}}>Feedback Management System</p>
            </div>
            {/* Toggle */}
            <div style={{display:"flex",background:"#f1f5f9",borderRadius:11,padding:4,marginBottom:20}}>
              {[["student","🎒 Student"],["admin","🔐 Admin"]].map(([m,lb])=>(
                <button key={m} onClick={()=>{setLmode(m);setIsReg(false);setLf({id:"",pw:""});}} style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,transition:"all .2s",background:lmode===m?"linear-gradient(135deg,#2563eb,#4f46e5)":"transparent",color:lmode===m?"#fff":"#64748b"}}>{lb}</button>
              ))}
            </div>
            {isReg?(
              <>
                <h3 style={{fontWeight:800,marginBottom:14,fontSize:15}}>Create Student Account</h3>
                {[["Username","username","text","Choose a username"],["Email","email","email","your@email.com"],["Roll Number","roll","text","e.g. 2024CS001"],["Password","pw","password","Min 6 characters"],["Confirm Password","pw2","password","Re-enter password"]].map(([lb,k,t,ph])=>(
                  <FF key={k} label={lb}><input className="fi" type={t} placeholder={ph} value={rf[k]} onChange={e=>setRf(p=>({...p,[k]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&register()}/></FF>
                ))}
                <button className="bp" style={{width:"100%",padding:"11px 0",marginTop:2}} onClick={register}>Create Account</button>
                <p style={{textAlign:"center",fontSize:12,color:"#64748b",marginTop:14}}>Have an account? <span style={{color:"#4f46e5",cursor:"pointer",fontWeight:700}} onClick={()=>setIsReg(false)}>Login here</span></p>
              </>
            ):(
              <>
                <FF label={lmode==="admin"?"Username":"Username / Email / Roll No."}>
                  <input className="fi" placeholder={lmode==="admin"?"admin":"Enter credentials"} value={lf.id} onChange={e=>setLf(p=>({...p,id:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()}/>
                </FF>
                <FF label="Password">
                  <input className="fi" type="password" placeholder="Enter password" value={lf.pw} onChange={e=>setLf(p=>({...p,pw:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()}/>
                </FF>
                <button className="bp" style={{width:"100%",padding:"11px 0"}} onClick={login}>{lmode==="admin"?"🔐 Login as Admin":"🎒 Student Login"}</button>
                {lmode==="student"&&<p style={{textAlign:"center",fontSize:12,color:"#64748b",marginTop:14}}>New student? <span style={{color:"#4f46e5",cursor:"pointer",fontWeight:700}} onClick={()=>setIsReg(true)}>Register here</span></p>}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );

  /* ══════════════════════════════════════════════════════════
     STUDENT HOME  — full single page
  ══════════════════════════════════════════════════════════ */
  if(view==="home") return(
    <>
      <style>{G}</style>
      {toast&&<Toast {...toast} onClose={()=>setToast(null)}/>}
      {modal?.type==="feedback"&&<FeedbackModal/>}
      {modal?.type==="teacher-detail"&&<TeacherDetailModal t={modal.data}/>}

      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"#f0f4ff"}}>
        {/* ── TOP HEADER ── */}
        <header style={{background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#2e1065 100%)",padding:"0 28px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,boxShadow:"0 4px 20px rgba(79,70,229,.4)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>🎓</span>
            <div>
              <div style={{color:"#fff",fontWeight:900,fontSize:15,letterSpacing:"-.2px"}}>Aurora's Degree & PG College</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>Student Feedback Portal</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{user?.username}</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>Roll: {user?.roll||"—"}</div>
            </div>
            <button className="bg" onClick={()=>setModal({type:"feedback"})}>✏️ Feedback</button>
            {user?.role==="admin"&&<button className="bg" onClick={()=>{setView("admin");setAtab("overview");}}>⚙️ Admin</button>}
            <button className="bg" style={{borderColor:"rgba(239,68,68,.4)",background:"rgba(239,68,68,.15)"}} onClick={logout}>Logout</button>
          </div>
        </header>

        {/* ── HERO STATS STRIP ── */}
        <div style={{background:"linear-gradient(135deg,#1e3a8a,#312e81,#4c1d95)",padding:"16px 28px",display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
          {[["👨‍🏫",teachers.length,"Faculty"],["💬",feedbacks.length,"Reviews"],["⭐",analytics.avg>0?analytics.avg.toFixed(1):"—","Avg Rating"],["🏛️",analytics.depts.length,"Departments"]].map(([ic,v,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:22}}>{ic}</span>
              <div><div style={{color:"#fff",fontWeight:900,fontSize:18,lineHeight:1}}>{v}</div><div style={{color:"rgba(255,255,255,.6)",fontSize:10}}>{lb}</div></div>
              <div style={{width:1,height:30,background:"rgba(255,255,255,.15)",marginLeft:16}}/>
            </div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["lecturers","👨‍🏫 Lecturers"],["qb","📚 Question Banks"],["pyq","📄 PYQ Papers"]].map(([id,lb])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 16px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,transition:"all .18s",background:tab===id?"rgba(255,255,255,.25)":"rgba(255,255,255,.1)",color:"#fff",backdropFilter:"blur(4px)"}}>{lb}</button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <main style={{flex:1,padding:"24px 28px",maxWidth:1300,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>

          {/* LECTURERS */}
          {tab==="lecturers"&&(
            <div className="fade-in">
              <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
                <SectionTitle icon="👨‍🏫" title="Lecturers" count={filtered.length} right={
                  <div style={{display:"flex",gap:8}}>
                    <input className="fi" style={{width:210}} placeholder="🔍 Search name, dept, subject…" value={search} onChange={e=>setSearch(e.target.value)}/>
                    <select className="fi" style={{width:160}} value={deptF} onChange={e=>setDeptF(e.target.value)}>{depts.map(d=><option key={d}>{d}</option>)}</select>
                  </div>
                }/>
              </div>
              {filtered.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px",color:"#94a3b8"}}>
                  <div style={{fontSize:48,marginBottom:10}}>🔍</div>
                  <div style={{fontWeight:700,fontSize:15,color:"#64748b"}}>No lecturers found</div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
                  {filtered.map(t=>{
                    const done=feedbacks.some(f=>f.tid===t.id&&f.sid===user?.id);
                    return(
                      <div key={t.id} className="card" style={{borderLeft:`4px solid ${t.rating>=4.5?"#059669":t.rating>=3.5?"#4f46e5":t.rating>0?"#ea580c":"#e2e8f0"}`,cursor:"pointer"}} onClick={()=>setModal({type:"teacher-detail",data:t})}>
                        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#ede9fe,#dbeafe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{t.emoji}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:800,fontSize:14,marginBottom:1}}>{t.name}</div>
                            <div style={{color:"#64748b",fontSize:12,marginBottom:5}}>{t.dept}</div>
                            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:6}}>
                              <Stars r={t.rating} sz={13}/><span style={{fontWeight:800,fontSize:13}}>{t.rating>0?t.rating.toFixed(1):"—"}</span>
                              <span style={{color:"#94a3b8",fontSize:11}}>({t.feedbacks})</span><Trend t={t.trend}/>
                            </div>
                            <div>{t.subjects?.slice(0,2).map(s=><Tag key={s} c="tp">{s}</Tag>)}{t.subjects?.length>2&&<Tag c="tb">+{t.subjects.length-2}</Tag>}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:10,borderTop:"1px solid #f1f5f9"}}>
                          <span style={{fontSize:11,color:"#94a3b8"}}>{t.exp||"—"} exp</span>
                          {done?<span style={{fontSize:11,color:"#059669",fontWeight:700}}>✅ Reviewed</span>:<span style={{fontSize:11,color:"#4f46e5",fontWeight:700}}>View Profile →</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* QUESTION BANKS */}
          {tab==="qb"&&(
            <div className="fade-in">
              <SectionTitle icon="📚" title="Question Banks" count={SR.filter(r=>r.type==="qb").length}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                {SR.filter(r=>r.type==="qb").map(r=>(
                  <div key={r.id} className="card">
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontSize:32,flexShrink:0}}>📚</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,marginBottom:7,lineHeight:1.4}}>{r.title}</div>
                        <div style={{marginBottom:10}}>
                          <Tag c="tb">{r.sub}</Tag><Tag c="ty">{r.sem} Sem</Tag><Tag c="tg">{r.stream}</Tag>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>📁 {r.size}</span>
                          <button className="bp bsm" onClick={()=>notify("Link actual files to enable downloads","warn")}>⬇️ Download</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIOUS YEAR PAPERS */}
          {tab==="pyq"&&(
            <div className="fade-in">
              <SectionTitle icon="📄" title="Previous Year Papers" count={SR.filter(r=>r.type==="pyq").length}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
                {SR.filter(r=>r.type==="pyq").map(r=>(
                  <div key={r.id} className="card">
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontSize:32,flexShrink:0}}>📄</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,marginBottom:7,lineHeight:1.4}}>{r.title}</div>
                        <div style={{marginBottom:10}}>
                          <Tag c="tb">{r.sub}</Tag><Tag c="ty">{r.sem} Sem</Tag><Tag c="tg">{r.stream}</Tag><Tag c="tr">{r.year}</Tag>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>📁 {r.size}</span>
                          <button className="bp bsm" onClick={()=>notify("Link actual files to enable downloads","warn")}>⬇️ Download</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );

  /* ══════════════════════════════════════════════════════════
     ADMIN PANEL  — full single page
  ══════════════════════════════════════════════════════════ */
  if(view==="admin") return(
    <>
      <style>{G}</style>
      {toast&&<Toast {...toast} onClose={()=>setToast(null)}/>}
      {modal?.type==="teacher"&&<TeacherFormModal/>}
      {modal?.type==="delete"&&<DeleteModal id={modal.data}/>}
      {modal?.type==="bulk-preview"&&<BulkPreviewModal/>}

      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"#f0f4ff"}}>
        {/* ── ADMIN HEADER ── */}
        <header style={{background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#2e1065 100%)",padding:"0 28px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,boxShadow:"0 4px 20px rgba(79,70,229,.4)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>🎓</span>
            <div>
              <div style={{color:"#fff",fontWeight:900,fontSize:15}}>Aurora's Degree & PG College</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>Admin Dashboard</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:13}}>Administrator</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>Full Access</div>
            </div>
            <button className="bg" onClick={()=>setView("home")}>🎒 Student View</button>
            <button className="bg" style={{borderColor:"rgba(239,68,68,.4)",background:"rgba(239,68,68,.15)"}} onClick={logout}>Logout</button>
          </div>
        </header>

        {/* ── ADMIN STATS STRIP + TABS ── */}
        <div style={{background:"linear-gradient(135deg,#1e3a8a,#312e81,#4c1d95)",padding:"14px 28px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          {[["👨‍🏫",teachers.length,"Teachers"],["💬",feedbacks.length,"Feedbacks"],["🎒",students.length,"Students"],["⭐",analytics.avg>0?analytics.avg.toFixed(1):"—","Avg Rating"]].map(([ic,v,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:20}}>{ic}</span>
              <div><div style={{color:"#fff",fontWeight:900,fontSize:16,lineHeight:1}}>{v}</div><div style={{color:"rgba(255,255,255,.55)",fontSize:10}}>{lb}</div></div>
              <div style={{width:1,height:26,background:"rgba(255,255,255,.15)",marginLeft:12}}/>
            </div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap"}}>
            {[["overview","📊 Overview"],["teachers","👨‍🏫 Teachers"],["add","➕ Add Teacher"],["bulk","📤 Bulk Upload"],["fblog","💬 Feedback Log"]].map(([id,lb])=>(
              <button key={id} onClick={()=>{setAtab(id);setSearch("");setDeptF("All");}} style={{padding:"7px 14px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,transition:"all .18s",background:atab===id?"rgba(255,255,255,.25)":"rgba(255,255,255,.1)",color:"#fff",backdropFilter:"blur(4px)"}}>{lb}</button>
            ))}
          </div>
        </div>

        {/* ── ADMIN MAIN ── */}
        <main style={{flex:1,padding:"24px 28px",maxWidth:1300,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>

          {/* OVERVIEW */}
          {atab==="overview"&&(
            <div className="fade-in">
              <SectionTitle icon="📊" title="Analytics Overview"/>
              {/* KPI cards */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:24}}>
                {[["👨‍🏫","Faculty",teachers.length,"#dbeafe","#1d4ed8"],["💬","Feedbacks",feedbacks.length,"#d1fae5","#065f46"],["⭐","Avg Rating",analytics.avg>0?analytics.avg.toFixed(2):"—","#fef3c7","#92400e"],["🎒","Students",students.length,"#ede9fe","#5b21b6"],["🏛️","Departments",analytics.depts.length,"#fce7f3","#9d174d"]].map(([ic,lb,v,bg,col])=>(
                  <div key={lb} className="card" style={{background:bg,border:"none",textAlign:"center",padding:18}}>
                    <div style={{fontSize:32,marginBottom:7}}>{ic}</div>
                    <div style={{fontSize:24,fontWeight:900,color:col,marginBottom:3}}>{v}</div>
                    <div style={{fontSize:11,color:col,opacity:.75,fontWeight:700}}>{lb}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {/* Dept table */}
                <div className="card" style={{cursor:"default"}}>
                  <h3 style={{fontWeight:800,marginBottom:14,fontSize:15}}>Department Breakdown</h3>
                  {analytics.depts.length===0?<div style={{textAlign:"center",padding:30,color:"#94a3b8"}}>No data yet</div>:(
                    <table>
                      <thead><tr><th>Department</th><th>Faculty</th><th>Avg Rating</th></tr></thead>
                      <tbody>{analytics.depts.map(d=>(
                        <tr key={d.d}>
                          <td style={{fontWeight:600}}>{d.d}</td>
                          <td>{d.cnt}</td>
                          <td style={{display:"flex",alignItems:"center",gap:5,paddingTop:10}}><Stars r={d.avg} sz={11}/><span style={{fontWeight:700,fontSize:12}}>{d.avg>0?d.avg.toFixed(1):"—"}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
                {/* Top rated */}
                <div className="card" style={{cursor:"default"}}>
                  <h3 style={{fontWeight:800,marginBottom:14,fontSize:15}}>🏆 Top Rated Faculty</h3>
                  {analytics.top.length===0?<div style={{textAlign:"center",padding:30,color:"#94a3b8"}}>No ratings yet — submit some feedback!</div>:analytics.top.map((t,i)=>(
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                      <div style={{width:22,height:22,borderRadius:6,background:i===0?"#fef3c7":i===1?"#f1f5f9":"#fce7f3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:i===0?"#92400e":i===1?"#475569":"#9d174d",flexShrink:0}}>#{i+1}</div>
                      <span style={{fontSize:22}}>{t.emoji}</span>
                      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div><div style={{fontSize:11,color:"#64748b"}}>{t.dept}</div></div>
                      <span className="rbadge">★ {t.rating.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEACHERS LIST */}
          {atab==="teachers"&&(
            <div className="fade-in">
              <SectionTitle icon="👨‍🏫" title="All Teachers" count={teachers.length} right={
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <input className="fi" style={{width:200}} placeholder="🔍 Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
                  <select className="fi" style={{width:150}} value={deptF} onChange={e=>setDeptF(e.target.value)}>{depts.map(d=><option key={d}>{d}</option>)}</select>
                  <button className="bp" onClick={openAddTeacher}>+ Add Teacher</button>
                </div>
              }/>
              {filtered.length===0?<div style={{textAlign:"center",padding:"60px 20px",color:"#94a3b8"}}><div style={{fontSize:48,marginBottom:10}}>👨‍🏫</div><div style={{fontWeight:700,fontSize:15,color:"#64748b"}}>No teachers found</div></div>:(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
                  {filtered.map(t=>(
                    <div key={t.id} className="card">
                      <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                        <div style={{width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#ede9fe,#dbeafe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{t.emoji}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:800,fontSize:14,marginBottom:1}}>{t.name}</div>
                          <div style={{color:"#64748b",fontSize:12,marginBottom:2}}>{t.dept}</div>
                          <div style={{color:"#94a3b8",fontSize:11,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.email}</div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}><Stars r={t.rating} sz={11}/><span style={{fontWeight:800,fontSize:12,color:"#2563eb"}}>{t.rating>0?t.rating.toFixed(1):"—"}</span><span style={{color:"#94a3b8",fontSize:10}}>({t.feedbacks})</span></div>
                          <div style={{marginTop:5}}>{t.subjects?.slice(0,2).map(s=><Tag key={s} c="tp">{s}</Tag>)}{t.subjects?.length>2&&<Tag c="tb">+{t.subjects.length-2}</Tag>}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:7,paddingTop:10,borderTop:"1px solid #f1f5f9",alignItems:"center"}}>
                        <button className="bs bsm" onClick={()=>openEditTeacher(t)}>✏️ Edit</button>
                        <button className="bd bsm" onClick={()=>setModal({type:"delete",data:t.id})}>🗑️ Delete</button>
                        <span style={{flex:1}}/>
                        <span style={{fontSize:10,color:"#94a3b8"}}>{fmt(t.at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADD / EDIT TEACHER (inline form, no sidebar) */}
          {atab==="add"&&(
            <div className="fade-in" style={{maxWidth:680}}>
              <SectionTitle icon={editT?"✏️":"➕"} title={editT?"Edit Teacher":"Add New Teacher"}/>
              <div className="card" style={{cursor:"default"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {[["Full Name *","name","text","Dr. Full Name"],["Department *","dept","text","e.g. Computer Science"],["Email *","email","email","teacher@aurora.edu"],["Phone","phone","tel","9876543210"],["Qualification","qual","text","PhD, M.Tech…"],["Experience","exp","text","e.g. 8 years"]].map(([lb,k,t,ph])=>(
                    <FF key={k} label={lb}><input className="fi" type={t} placeholder={ph} value={tf[k]} onChange={e=>setTf(p=>({...p,[k]:e.target.value}))}/></FF>
                  ))}
                </div>
                <FF label="Subjects (comma-separated)"><input className="fi" placeholder="Data Structures, Algorithms, Python…" value={tf.subjects} onChange={e=>setTf(p=>({...p,subjects:e.target.value}))}/></FF>
                <FF label="Profile Emoji">
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {["👤","👨‍🏫","👩‍🏫","👨‍💻","👩‍💻","👨‍🔬","👩‍🔬","🧑‍🏫","👨‍🎓","👩‍🎓","🧪","📐","🔭","🧬"].map(em=>(
                      <button key={em} onClick={()=>setTf(p=>({...p,emoji:em}))} style={{fontSize:22,padding:"5px 9px",borderRadius:9,border:tf.emoji===em?"2.5px solid #4f46e5":"2px solid #e2e8f0",background:tf.emoji===em?"#ede9fe":"#f8fafc",cursor:"pointer",transition:"all .15s"}}>{em}</button>
                    ))}
                  </div>
                </FF>
                <div style={{display:"flex",gap:10,marginTop:4}}>
                  <button className="bp" onClick={saveTeacher}>{editT?"💾 Save Changes":"➕ Add Teacher"}</button>
                  <button className="bs" onClick={()=>{setEditT(null);setAtab("teachers");}}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* BULK UPLOAD */}
          {atab==="bulk"&&(
            <div className="fade-in" style={{maxWidth:700}}>
              <SectionTitle icon="📤" title="Bulk Upload Teachers"/>
              <div className="card" style={{cursor:"default"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div><div style={{fontWeight:700,marginBottom:3,fontSize:14}}>Upload via JSON</div><div style={{fontSize:12,color:"#64748b"}}>Paste a JSON array or upload a .json file</div></div>
                  <button className="bs" onClick={()=>{const t=JSON.stringify([{name:"Dr. Example",dept:"Science",email:"ex@aurora.edu",subjects:["Physics"],emoji:"👨‍🔬"}],null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"application/json"}));a.download="template.json";a.click();}}>⬇️ Template</button>
                </div>
                <textarea className="fi" style={{height:180,resize:"vertical",fontFamily:"monospace",fontSize:12,marginBottom:12}} placeholder={'[\n  {\n    "name": "Dr. Example",\n    "dept": "Science",\n    "email": "ex@aurora.edu",\n    "subjects": ["Physics"],\n    "emoji": "👨‍🔬"\n  }\n]'} value={bulkTxt} onChange={e=>{setBulkTxt(e.target.value);setBulkPrev(null);}}/>
                <div style={{display:"flex",gap:10}}>
                  <button className="bp" onClick={()=>{try{const p=JSON.parse(bulkTxt);const a=Array.isArray(p)?p:[p];if(!a.length){notify("Empty array","error");return;}setBulkPrev(a);setModal({type:"bulk-preview"});}catch{notify("Invalid JSON","error");}}}>🔍 Preview Import</button>
                  <label style={{cursor:"pointer"}}>
                    <span className="bs" style={{display:"inline-block",padding:"10px 22px",borderRadius:10,fontWeight:700,fontSize:13}}>📁 Upload File</span>
                    <input type="file" accept=".json" style={{display:"none"}} onChange={e=>{const r=new FileReader();r.onload=ev=>{setBulkTxt(ev.target.result);setBulkPrev(null);};r.readAsText(e.target.files[0]);}}/>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* FEEDBACK LOG */}
          {atab==="fblog"&&(
            <div className="fade-in">
              <SectionTitle icon="💬" title="Feedback Log" count={feedbacks.length}/>
              {feedbacks.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px",color:"#94a3b8"}}><div style={{fontSize:48,marginBottom:10}}>💬</div><div style={{fontWeight:700,fontSize:15,color:"#64748b"}}>No feedback submitted yet</div></div>
              ):(
                <div className="card" style={{cursor:"default",padding:0,overflow:"hidden"}}>
                  <div style={{overflowX:"auto"}}>
                    <table>
                      <thead><tr><th>Teacher</th><th>Date</th><th>Rating</th><th>Clarity</th><th>Knowledge</th><th>Access.</th><th>Engmt.</th><th>Punct.</th><th>Sentiment</th><th style={{minWidth:220}}>Comment</th></tr></thead>
                      <tbody>{[...feedbacks].sort((a,b)=>new Date(b.dt)-new Date(a.dt)).map(fb=>{
                        const t=teachers.find(t=>t.id===fb.tid);
                        const r=avg([fb.tc,fb.sk,fb.ac,fb.en,fb.pu]);
                        return(
                          <tr key={fb.id}>
                            <td style={{fontWeight:600,whiteSpace:"nowrap"}}>{t?.emoji} {t?.name||"—"}</td>
                            <td style={{color:"#64748b",whiteSpace:"nowrap",fontSize:12}}>{fmt(fb.dt)}</td>
                            <td><span className="rbadge">★ {r.toFixed(1)}</span></td>
                            <td style={{textAlign:"center"}}>{fb.tc}</td>
                            <td style={{textAlign:"center"}}>{fb.sk}</td>
                            <td style={{textAlign:"center"}}>{fb.ac}</td>
                            <td style={{textAlign:"center"}}>{fb.en}</td>
                            <td style={{textAlign:"center"}}>{fb.pu}</td>
                            <td><span className={`tag ${fb.ai==="positive"?"tg":fb.ai==="negative"?"tr":"ty"}`}>{fb.ai}</span></td>
                            <td style={{color:"#475569",fontSize:12,maxWidth:220}}>{fb.txt.slice(0,80)}{fb.txt.length>80?"…":""}</td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );

  return null;
}
