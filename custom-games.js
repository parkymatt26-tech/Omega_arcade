/* OMEGA ARCADE custom game manager: local saves + optional shared JSON file. */
'use strict';
const OMEGA_CUSTOM=(()=>{
  const STORAGE='omega-arcade-custom-games-v1', MAX=100;
  const DEFAULT_IMAGE='assets/custom-game.svg';
  const clampText=(v,max=260)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
  // These fields are also HTML-escaped by the homepage renderer.
  function gameLink(raw){
    let s=String(raw??'').trim();
    if(/<iframe\b/i.test(s)){
      const doc=new DOMParser().parseFromString(s,'text/html');
      s=doc.querySelector('iframe')?.getAttribute('src')||'';
    }
    s=s.trim();
    if(!s||s.length>4000)throw Error('Enter a playable game URL or an iframe with a src.');
    if(/^https:\/\//i.test(s)){
      let u;try{u=new URL(s)}catch{throw Error('That game URL is not valid.')}
      if(u.protocol!=='https:'||u.username||u.password)throw Error('Only safe HTTPS game links are supported.');
      return {path:u.href,external:true};
    }
    if(!/^(?!\/)(?!\.)(?!.*\.\.)(?!.*[\?#])[a-z\d_./-]+\.html$/i.test(s)||s.includes('//')){
      throw Error('For your own uploaded game, use a path like games/my-game/index.html or drift-boss-v3/index.html.');
    }
    return {path:s,external:false};
  }
  function imageLink(raw){
    const s=clampText(raw,1300);
    if(!s)return DEFAULT_IMAGE;
    if(/^https:\/\//i.test(s)){try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password?u.href:DEFAULT_IMAGE}catch{return DEFAULT_IMAGE}}
    return /^(?!\/)(?!\.)(?!.*\.\.)(?!.*[\?#])[a-z\d_./-]+\.(png|webp|jpg|jpeg|svg)$/i.test(s)?s:DEFAULT_IMAGE;
  }
  function normalize(obj,kind='local'){
    if(!obj||typeof obj!=='object')return null;
    let result;try{result=gameLink(obj.path||obj.url)}catch{return null}
    const name=clampText(obj.name,60);if(!name)return null;
    const id=String(obj.id||'').match(/^user-[a-z\d-]{4,75}$/i)?.[0]||('user-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));
    const category=['external','roguelite','incremental','action'].includes(obj.category)?obj.category:'external';
    return {id,name,short:name,tag:category.toUpperCase()+' / CUSTOM',category,
      description:clampText(obj.description,260)||'A game added to OMEGA ARCADE.',image:imageLink(obj.image),
      path:result.path,external:result.external,
      controls:clampText(obj.controls,180)||'Click the embedded game and use its on-screen controls.',
      tags:['My games',category==='external'?'Online':category],custom:true,local:kind==='local',published:kind==='published'};
  }
  function rawLocal(){try{const v=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(v)?v.slice(0,MAX):[]}catch{return []}}
  function localGames(){return rawLocal().map(x=>normalize(x,'local')).filter(Boolean)}
  function saveLocal(list){try{localStorage.setItem(STORAGE,JSON.stringify(list.slice(0,MAX)));return true}catch{return false}}
  function remove(id){return saveLocal(rawLocal().filter(g=>g.id!==id))}
  async function fetchPublished(){
    try{const r=await fetch('community-games.json',{cache:'no-store'});if(!r.ok)return[];
      const list=await r.json();if(!Array.isArray(list))return[];
      return list.slice(0,200).map(x=>normalize(x,'published')).filter(Boolean);
    }catch{return []}
  }
  function download(name,body){const blob=new Blob([body],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}
  function init({getGames,onSave}){
    const dialog=document.getElementById('addGameDialog');if(!dialog)return;
    const open=()=>{dialog.showModal();document.getElementById('newGameTitle').focus();document.getElementById('addGameError').hidden=true};
    const close=()=>dialog.close();
    document.getElementById('addGameBtn')?.addEventListener('click',open);
    document.getElementById('openAddBottom')?.addEventListener('click',open);
    document.getElementById('closeAddGame')?.addEventListener('click',close);
    document.getElementById('cancelAddGame')?.addEventListener('click',close);
    dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
    if(new URLSearchParams(location.search).get('add')==='1')open();
    document.getElementById('addGameForm')?.addEventListener('submit',e=>{
      e.preventDefault();const error=document.getElementById('addGameError');error.hidden=true;
      const title=document.getElementById('newGameTitle').value.trim();
      if(!title){error.textContent='Please enter a game title.';error.hidden=false;return}
      if(rawLocal().length>=MAX){error.textContent='Your browser library has reached the 100-game limit.';error.hidden=false;return}
      let result;
      try{result=gameLink(document.getElementById('newGameURL').value)}catch(ex){error.textContent=ex.message;error.hidden=false;return}
      const entry=normalize({id:'user-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),
        name:title,category:document.getElementById('newGameGenre').value,path:result.path,
        description:document.getElementById('newGameDescription').value,
        image:document.getElementById('newGameImage').value,controls:document.getElementById('newGameControls').value});
      if(!entry){error.textContent='Unable to add this game. Check the URL and title.';error.hidden=false;return}
      if(!saveLocal([...rawLocal(),entry])){error.textContent='Your browser blocked saving or ran out of storage.';error.hidden=false;return}
      close();onSave(entry);
    });
    document.getElementById('exportGamesBtn')?.addEventListener('click',()=>{
      const entries=(getGames?getGames():[]).filter(g=>g.published||g.local);
      const unique=new Map(entries.map(g=>[g.id,{id:g.id,name:g.name,description:g.description,path:g.path,image:g.image,category:g.category,controls:g.controls}]));
      download('community-games.json',JSON.stringify([...unique.values()],null,2)+'\n');
    });
    const fileInput=document.getElementById('importGamesFile');
    document.getElementById('importGamesBtn')?.addEventListener('click',()=>fileInput.click());
    fileInput?.addEventListener('change',async()=>{
      const file=fileInput.files?.[0];if(!file)return;
      const error=document.getElementById('addGameError');error.hidden=true;
      try{if(file.size>350000)throw Error('Choose a game list under 350 KB.');
        const data=JSON.parse(await file.text());if(!Array.isArray(data))throw Error('The file must contain a list of games.');
        const old=rawLocal(),byId=new Map(old.map(g=>[g.id,g]));
        for(const candidate of data.slice(0,MAX)){const valid=normalize(candidate,'local');if(valid)byId.set(valid.id,valid)}
        if(!saveLocal([...byId.values()]))throw Error('Could not save the imported games.');
        onSave();
      }catch(ex){error.textContent=ex.message||'Could not import this file.';error.hidden=false}
      finally{fileInput.value=''}
    });
  }
  return {localGames,fetchPublished,init,remove,gameLink,normalize};
})();
