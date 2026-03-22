import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Heart, Bookmark, Plus, X, Moon, Sun, LogOut, Upload, ArrowLeft, Compass, Sparkles, Share2, Check, ImageIcon } from "lucide-react";

const GLOBAL_CSS = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.masonry { columns: 5 200px; column-gap: 14px; }
@media(max-width:1400px){ .masonry{ columns:4 200px; } }
@media(max-width:1100px){ .masonry{ columns:3 180px; } }
@media(max-width:700px) { .masonry{ columns:2 150px; } }
@media(max-width:440px) { .masonry{ columns:1; } }
.masonry-item { break-inside:avoid; margin-bottom:14px; display:inline-block; width:100%; }
.lum-card { transition:transform .35s cubic-bezier(.34,1.4,.64,1),box-shadow .35s ease; cursor:pointer; }
.lum-card:hover { transform:translateY(-6px) scale(1.015); }
.lum-card:hover .card-img { transform:scale(1.07); }
.lum-card:hover .card-ov  { opacity:1 !important; }
.card-img { transition:transform .5s cubic-bezier(.25,.46,.45,.94); }
.btn-p { transition:transform .2s ease,box-shadow .2s ease,filter .2s ease; }
.btn-p:hover { transform:translateY(-2px); filter:brightness(1.08); }
.btn-p:active { transform:translateY(0) scale(.97); }
.btn-g { transition:background .2s,color .2s,transform .2s; }
.btn-g:hover { transform:translateY(-1px); }
.fade-up { animation:fadeUp .45s cubic-bezier(.25,.46,.45,.94) both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
.s1{animation-delay:.05s} .s2{animation-delay:.10s} .s3{animation-delay:.15s} .modal-bg { animation:mbgIn .25s ease both; }
@keyframes mbgIn { from{opacity:0} to{opacity:1} }
.modal-box { animation:mboxIn .35s cubic-bezier(.34,1.2,.64,1) both; }
@keyframes mboxIn { from{opacity:0;transform:scale(.9) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
.toast-in { animation:toastIn .4s cubic-bezier(.34,1.4,.64,1) both; }
@keyframes toastIn { from{opacity:0;transform:translateX(120%) scale(.8)} to{opacity:1;transform:translateX(0) scale(1)} }
.like-pop { animation:likePop .4s cubic-bezier(.34,1.56,.64,1); }
@keyframes likePop { 0%{transform:scale(1)} 40%{transform:scale(1.55)} 100%{transform:scale(1)} }
.orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; animation:orbF 10s ease-in-out infinite; }
@keyframes orbF { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-25px,20px) scale(.95)} }
.lum-in { transition:border-color .2s,box-shadow .2s; appearance:none; -webkit-appearance:none; }
.lum-in:focus { outline:none; border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,.18); }
.nav-it { transition:background .2s,color .2s; }
.nav-it:hover { background:rgba(59,130,246,.12) !important; }
.pill { transition:all .2s; }
.pill:hover { transform:translateY(-2px); }
.tab-b { transition:color .2s; position:relative; }
.tab-b::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; border-radius:2px; background:#3b82f6; transform:scaleX(0); transition:transform .2s cubic-bezier(.34,1.2,.64,1); }
.tab-b.on::after { transform:scaleX(1); }
.tag { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; background:rgba(59,130,246,.15); color:#60a5fa; border:1px solid rgba(59,130,246,.25); }
.auth-l { background:linear-gradient(145deg,#071038,#0f2468 40%,#1d4ed8 80%,#3b82f6); position:relative; overflow:hidden; }
.auth-l::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 30% 70%,rgba(96,165,250,.25) 0%,transparent 55%),radial-gradient(circle at 80% 20%,rgba(59,130,246,.2) 0%,transparent 45%); }
.p-cover { background:linear-gradient(135deg,#0a1628 0%,#1230a0 40%,#1d4ed8 70%,#3b82f6 100%); overflow:hidden; }
.s-bar:focus-within { box-shadow:0 0 0 3px rgba(59,130,246,.2); }
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(59,130,246,.35); border-radius:4px; }
::-webkit-scrollbar-thumb:hover { background:rgba(59,130,246,.6); }
`;

const SEED = [{id:1, title:"Floating Glass Tower", desc:"Where transparency meets the sky — architecture at its most daring.", img:"https://picsum.photos/seed/lm01/400/560", author:"Sofia Martins", av:"https://picsum.photos/seed/av01/80/80", likes:1240, cat:"Architecture"},{id:2, title:"Morning Mist Forest", desc:"Ancient pines wrapped in silence. The world before noise.", img:"https://picsum.photos/seed/lm02/400/300", author:"Kai Nakamura", av:"https://picsum.photos/seed/av02/80/80", likes:873, cat:"Nature"},{id:3, title:"Crimson Coastal Dusk", desc:"The hour when sea and sky dissolve into one breathless gradient.", img:"https://picsum.photos/seed/lm03/400/510", author:"Isla Vance", av:"https://picsum.photos/seed/av03/80/80", likes:2104, cat:"Travel"},{id:4, title:"Zen Minimalist Study", desc:"One desk, one lamp, infinite clarity. Distraction is a design choice.", img:"https://picsum.photos/seed/lm04/400/380", author:"Noah Evers", av:"https://picsum.photos/seed/av04/80/80", likes:691, cat:"Interiors"},{id:5, title:"Neon Mural District", desc:"Urban walls that speak louder than galleries ever could.", img:"https://picsum.photos/seed/lm05/400/490", author:"Mia Torres", av:"https://picsum.photos/seed/av05/80/80", likes:1567, cat:"Art"},{id:6, title:"Perfect Ramen Bowl", desc:"Forty-eight hours of broth. One perfect moment of consumption.", img:"https://picsum.photos/seed/lm06/400/310", author:"Yuki Tanaka", av:"https://picsum.photos/seed/av06/80/80", likes:3210, cat:"Food"},{id:7, title:"Sonoran Desert Bloom", desc:"For one week each decade, the desert erupts. Worth the wait.", img:"https://picsum.photos/seed/lm07/400/550", author:"Zara Ahmed", av:"https://picsum.photos/seed/av07/80/80", likes:945, cat:"Nature"},{id:8, title:"Cyberpunk Alley, Tokyo", desc:"Rain on neon. Every frame here is a film poster.", img:"https://picsum.photos/seed/lm08/400/410", author:"Ethan Black", av:"https://picsum.photos/seed/av08/80/80", likes:2876, cat:"Technology"},{id:9, title:"Couture Monochrome Edit", desc:"When every color is stripped away, the silhouette becomes the statement.", img:"https://picsum.photos/seed/lm09/400/600", author:"Luna Park", av:"https://picsum.photos/seed/av09/80/80", likes:1432, cat:"Fashion"},{id:10,title:"Abstract Indigo Study", desc:"Pigment moving through water. Art made by releasing control.", img:"https://picsum.photos/seed/lm10/400/360", author:"Felix Müller", av:"https://picsum.photos/seed/av10/80/80", likes:778, cat:"Art"},{id:11,title:"Above the Clouds, Alps", desc:"The summit where silence has weight. You don't talk — you absorb.", img:"https://picsum.photos/seed/lm11/400/450", author:"Aria Stone", av:"https://picsum.photos/seed/av11/80/80", likes:1893, cat:"Travel"},{id:12,title:"Brutalist Monolith", desc:"Raw concrete is not ugly — it is honest. Every surface tells a story.", img:"https://picsum.photos/seed/lm12/400/530", author:"Marcus Reid", av:"https://picsum.photos/seed/av12/80/80", likes:504, cat:"Architecture"},{id:13,title:"Sakura Tunnel, Kyoto", desc:"Seven days. Then it rains, and it's gone. So you remember.", img:"https://picsum.photos/seed/lm13/400/340", author:"Hana Sato", av:"https://picsum.photos/seed/av13/80/80", likes:4201, cat:"Nature"},{id:14,title:"Velvet Reading Corner", desc:"Every home deserves one. Soft light, shelved walls, nowhere to be.", img:"https://picsum.photos/seed/lm14/400/470", author:"Clara Webb", av:"https://picsum.photos/seed/av14/80/80", likes:2034, cat:"Interiors"},{id:15,title:"Penang Night Market", desc:"Smoke, spice, and laughter — every hawker stall is its own universe.", img:"https://picsum.photos/seed/lm15/400/390", author:"Jin Woo", av:"https://picsum.photos/seed/av15/80/80", likes:1678, cat:"Food"},{id:16,title:"Sacred Geometry Series", desc:"The patterns were always there. Mathematics as a spiritual language.", img:"https://picsum.photos/seed/lm16/400/570", author:"Vera Novak", av:"https://picsum.photos/seed/av16/80/80", likes:1102, cat:"Illustration"},{id:17,title:"Amalfi Coast, Golden Hr", desc:"An entire cliffside turned amber. No filter — this is just Italy.", img:"https://picsum.photos/seed/lm17/400/330", author:"Tom Archer", av:"https://picsum.photos/seed/av17/80/80", likes:3456, cat:"Travel"},{id:18,title:"Dusk Portrait, Havana", desc:"One shutter click. A decade of story living in her eyes.", img:"https://picsum.photos/seed/lm18/400/515", author:"Petra Vogt", av:"https://picsum.photos/seed/av18/80/80", likes:2891, cat:"Photography"},{id:19,title:"Moss Wall Living Room", desc:"Biophilic design is not a trend — it is the correction of a mistake.", img:"https://picsum.photos/seed/lm19/400/495", author:"Dani Reyes", av:"https://picsum.photos/seed/av19/80/80", likes:1345, cat:"Interiors"},{id:20,title:"Circuit Board Macro", desc:"The nervous system of every device you love. It's beautiful up close.", img:"https://picsum.photos/seed/lm20/400/365", author:"Sam Okafor", av:"https://picsum.photos/seed/av20/80/80", likes:987, cat:"Technology"},];
const CATS = ['All','Architecture','Nature','Travel','Art','Food','Fashion','Technology','Interiors','Photography','Illustration'];
const TH = { dark: { bg:'#060b1a', nav:'rgba(6,11,26,.9)', card:'rgba(10,17,42,.95)', surface:'rgba(255,255,255,.04)', surfHov:'rgba(255,255,255,.08)', border:'rgba(255,255,255,.07)', text:'#e8eeff', sub:'#7a87b0', accent:'#3b82f6', aFade:'rgba(59,130,246,.14)', shadow:'0 4px 24px rgba(0,0,0,.4)', modal:'rgba(0,0,0,.78)', }, light: { bg:'#edf2ff', nav:'rgba(237,242,255,.92)', card:'rgba(255,255,255,.97)', surface:'rgba(255,255,255,.65)', surfHov:'rgba(255,255,255,.96)', border:'rgba(0,0,60,.08)', text:'#0c1033', sub:'#5a6590', accent:'#2563eb', aFade:'rgba(37,99,235,.1)', shadow:'0 4px 24px rgba(0,0,80,.1)', modal:'rgba(0,0,30,.6)', }, };
const fmt = n => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

export default function Lumora() {
  const [dm,   setDm]   = useState(true);
  const c = TH[dm ? 'dark' : 'light'];
  const [page,     setPage]     = useState('home');
  const [posts,    setPosts]    = useState(SEED);
  const [liked,    setLiked]    = useState(new Set());
  const [saved,    setSaved]    = useState(new Set());
  const [user,     setUser]     = useState(null);
  const [q,        setQ]        = useState('');
  const [cat,      setCat]      = useState('All');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({name:'',email:'',password:''});
  const [authErr,  setAuthErr]  = useState('');
  const [newPost,  setNewPost]  = useState({title:'',desc:'',img:'',cat:'Architecture'});
  const [modal,    setModal]    = useState(null);
  const [toast,    setToast]    = useState(null);

  const toastRef = useRef(null);
  const showToast = useCallback((msg, type='ok') => {
    clearTimeout(toastRef.current);
    setToast({msg,type});
    toastRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const toggleLike = useCallback((e, id) => {
    e?.stopPropagation();
    setLiked(prev => {
      const n = new Set(prev), was = n.has(id);
      was ? n.delete(id) : n.add(id);
      setPosts(ps => ps.map(p => p.id===id ? {...p,likes:p.likes+(was?-1:1)} : p));
      return n;
    });
  }, []);

  const toggleSave = useCallback((e, id) => {
    e?.stopPropagation();
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? (n.delete(id), showToast('Removed from board')) : (n.add(id), showToast('Saved to your board ✨'));
      return n;
    });
  }, [showToast]);

  const handleAuth = () => {
    setAuthErr('');
    if (!authForm.email.trim() || !authForm.password.trim()) {
      setAuthErr('Please fill in all fields.');
      return;
    }
    if (authMode==='signup' && !authForm.name.trim()) {
      setAuthErr('Name is required.');
      return;
    }
    const u = {
      id:Date.now(),
      name:authMode==='signup'?authForm.name.trim():authForm.email.split('@')[0],
      email:authForm.email.trim(),
      bio:'Visual storyteller on Lumora ✨',
      avatar:`https://picsum.photos/seed/${authForm.email.replace(/\W/g,'')}/80/80`
    };
    setUser(u);
    showToast(authMode==='signup'?`Welcome to Lumora, ${u.name}! 🎉`:`Welcome back, ${u.name}! 👋`);
    setPage('home');
    setAuthForm({name:'',email:'',password:''});
  };

  const handleCreate = () => {
    if (!newPost.title.trim()||!newPost.img.trim()) {
      showToast('Title and image URL required','err');
      return;
    }
    if (!user) {
      showToast('Please sign in first','err');
      setPage('auth');
      return;
    }
    setPosts(ps => [{id:Date.now(),title:newPost.title,desc:newPost.desc,img:newPost.img,author:user.name,av:user.avatar,likes:0,cat:newPost.cat,uid:user.id},...ps]);
    setNewPost({title:'',desc:'',img:'',cat:'Architecture'});
    showToast('Post published! ✨');
    setPage('home');
  };

  const filtered = posts.filter(p => {
    const mc = cat==='All'||p.cat===cat;
    const mq = !q||[p.title,p.author,p.cat,p.desc||''].some(s=>s.toLowerCase().includes(q.toLowerCase()));
    return mc&&mq;
  });

  const go = pg => {
    setPage(pg);
    window.scrollTo(0,0);
  };

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans','Outfit',sans-serif",background:c.bg,color:c.text,minHeight:'100vh',position:'relative',overflowX:'hidden'}}> 
      <style>{GLOBAL_CSS}</style> 
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}> 
        <div className="orb" style={{width:700,height:700,top:-200,right:-150,background:dm?'rgba(29,78,216,.13)':'rgba(29,78,216,.06)'}}/>
        <div className="orb" style={{width:500,height:500,bottom:-100,left:-150,background:dm?'rgba(59,130,246,.09)':'rgba(59,130,246,.04)',animationDelay:'-4s'}}/>
        <div className="orb" style={{width:350,height:350,top:'45%',left:'42%',background:dm?'rgba(96,165,250,.06)':'rgba(96,165,250,.03)',animationDelay:'-8s'}}/>
      </div> 
      <div style={{position:'relative',zIndex:1,paddingTop:68}}> 
        {page==='home' && <HomePage c={c} dm={dm} posts={filtered} liked={liked} saved={saved} toggleLike={toggleLike} toggleSave={toggleSave} cat={cat} setCat={setCat} setModal={setModal} q={q}/>} 
        {page==='auth' && <AuthPage c={c} dm={dm} authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} authErr={authErr} handleAuth={handleAuth} go={go}/>} 
        {page==='profile' && <ProfilePage c={c} dm={dm} user={user} setUser={setUser} posts={posts} saved={saved} liked={liked} toggleLike={toggleLike} toggleSave={toggleSave} setModal={setModal} go={go}/>} 
        {page==='create' && <CreatePage c={c} dm={dm} newPost={newPost} setNewPost={setNewPost} handleCreate={handleCreate} go={go}/>} 
      </div> 
      {modal && <PostModal c={c} post={modal} liked={liked} saved={saved} toggleLike={toggleLike} toggleSave={toggleSave} onClose={()=>setModal(null)}/>} 
      {toast && ( 
        <div className="toast-in" style={{position:'fixed',bottom:28,right:24,zIndex:9999,padding:'13px 20px',borderRadius:14,color:'#fff',fontSize:14,fontWeight:500,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',boxShadow:'0 12px 40px rgba(0,0,0,.35)',background:toast.type==='err'?'rgba(220,38,38,.93)':'rgba(29,78,216,.93)',border:'1px solid rgba(255,255,255,.12)',maxWidth:320}}> 
          {toast.msg} 
        </div> 
      )} 
    </div> 
  ); 
}