import { useMemo, useState } from 'react';
import styles from './App.module.css';

type Phase = 'between' | 'games' | 'complete';
type Gender = 'M' | 'W';

type Athlete = {
  id: string; name: string; country: string; sport: string; event: string; gender: Gender;
  born: number; overall: number; potential: number; form: number; medals: number; golds: number;
  games: number; retired: boolean; trait: string; rivalId?: string;
};

type Story = { year: number; title: string; text: string; tone: 'gold'|'blue'|'red'|'green' };
type Medal = { gold:number; silver:number; bronze:number };
type StarEvent = {
  id:string; day:number; sport:string; event:string; stars:number; hook:string; watched:boolean;
  contenders:string[]; winnerId?:string; result?:string; record?:boolean; recap?:string;
};

type Save = {
  year:number; phase:Phase; host:string; day:number; athletes:Athlete[]; stories:Story[];
  medals:Record<string, Medal>; starEvents:StarEvent[]; history:{year:number;host:string;memory:string;champion:string}[];
};

const COUNTRIES = ['USA','GBR','FRA','GER','SWE','FIN','ITA','GRE','HUN','AUS','CAN','JPN','CHN','RUS','NED','BEL','DEN','NOR','ESP','BRA','ARG','CUB','MEX','IND','KOR','KEN','ETH','RSA','NZL','JAM','TUR','POL','CZE','SUI','AUT','IRL'];
const COUNTRY_NAMES:Record<string,string> = {USA:'United States',GBR:'Great Britain',FRA:'France',GER:'Germany',SWE:'Sweden',FIN:'Finland',ITA:'Italy',GRE:'Greece',HUN:'Hungary',AUS:'Australia',CAN:'Canada',JPN:'Japan',CHN:'China',RUS:'Russia',NED:'Netherlands',BEL:'Belgium',DEN:'Denmark',NOR:'Norway',ESP:'Spain',BRA:'Brazil',ARG:'Argentina',CUB:'Cuba',MEX:'Mexico',IND:'India',KOR:'South Korea',KEN:'Kenya',ETH:'Ethiopia',RSA:'South Africa',NZL:'New Zealand',JAM:'Jamaica',TUR:'Turkey',POL:'Poland',CZE:'Czechia',SUI:'Switzerland',AUT:'Austria',IRL:'Ireland'};
const NAMES = ['Arthur Collins','James Walker','Henrik Lund','Émile Laurent','Nikos Theodorou','Viktor Szabo','Elias Saarinen','Marco Bellini','Clara Weber','Alice Morgan','Sofia Rossi','Ingrid Dahl','Mei Tanaka','Lucia Herrera','Amara Okafor','Kofi Mensah','Aiko Nakamura','Elena Petrova','Samuel Kiptoo','Grace Njeri','Tomás Alvarez','Marta Kowalska','Anika Meier','Julien Moreau','Noah Williams','Leila Haddad','Mateo Silva','Eva Novak'];
const HOSTS = ['Athens','Paris','St. Louis','London','Stockholm','Antwerp','Amsterdam','Los Angeles','Berlin','Helsinki','Rome','Tokyo','Mexico City','Munich','Montreal','Moscow','Seoul','Barcelona','Atlanta','Sydney'];

const eraFor = (y:number) => y < 1920 ? 'The Founding Era' : y < 1948 ? 'The Interwar Games' : y < 1992 ? 'The Broadcast Age' : y < 2032 ? 'The Global Games' : 'The Unwritten Future';
const activeSports = (y:number) => [
  'Athletics','Cycling','Fencing','Gymnastics','Shooting','Swimming','Tennis','Weightlifting','Wrestling',
  ...(y>=1900?['Rowing']:[]), ...(y>=1904?['Boxing','Diving']:[]), ...(y>=1936?['Basketball']:[]),
  ...(y>=1964?['Judo','Volleyball']:[]), ...(y>=1984?['Rhythmic Gymnastics']:[]), ...(y>=2000?['Taekwondo']:[]),
  ...(y>=2020?['Skateboarding','Sport Climbing','Surfing']:[])
];
const eventsFor = (y:number) => [
  ['Athletics',"Men's 100m"],['Athletics',"Men's Marathon"],['Athletics',"Men's High Jump"],
  ['Swimming',"Men's 100m Freestyle"],['Swimming',"Men's 400m Freestyle"],['Gymnastics',"Men's All-Around"],
  ['Cycling',"Men's Road Race"],['Fencing',"Men's Foil"],['Weightlifting',"Men's Heavyweight"],
  ...(y>=1900?([['Rowing',"Men's Single Sculls"]] as string[][]):[]),
  ...(y>=1904?([['Boxing',"Men's Heavyweight"],['Diving',"Men's Platform"]] as string[][]):[]),
  ...(y>=1928?([['Athletics',"Women's 100m"],['Gymnastics',"Women's All-Around"]] as string[][]):[]),
  ...(y>=1936?([['Basketball',"Men's Tournament"]] as string[][]):[])
];
const age = (a:Athlete,y:number) => y-a.born;
const rand = (n:number) => Math.floor(Math.random()*n);
const pick = <T,>(arr:T[]) => arr[rand(arr.length)];
const medalBlank = () => Object.fromEntries(COUNTRIES.map(c=>[c,{gold:0,silver:0,bronze:0}]));

function makeAthletes(year:number, count=72):Athlete[]{
  const evs = eventsFor(year);
  return Array.from({length:count},(_,i)=>{
    const [sport,event]=pick(evs); const born=year-(18+rand(15));
    return {id:`a${year}-${i}-${Math.random()}`,name:`${pick(NAMES)}${i>27?` ${Math.floor(i/28)+1}`:''}`,country:pick(COUNTRIES.slice(0,year<1920?18:COUNTRIES.length)),sport,event,gender:event.includes("Women's")?'W':'M',born,overall:64+rand(29),potential:72+rand(27),form:70+rand(26),medals:0,golds:0,games:0,retired:false,trait:pick(['Fearless finisher','Technical perfectionist','Slow starter','Big-stage performer','Relentless veteran','Explosive prodigy'])};
  });
}

function makeStories(year:number, athletes:Athlete[]):Story[]{
  const prospects=athletes.filter(a=>!a.retired).sort((a,b)=>b.potential-a.potential).slice(0,3);
  const unlock = year===1900?'Rowing and new swimming events join the program.':year===1904?'Boxing and diving enter the Olympic movement.':year===1928?"Women's athletics changes the Games forever.":year===1936?'Basketball debuts on the Olympic stage.':year===1964?'Judo and volleyball join a rapidly expanding program.':year===1984?"The women's marathon finally arrives.":year===2020?'A new urban generation brings skateboarding, climbing and surfing.':'';
  return [
    ...(unlock?[{year,title:'The program evolves',text:unlock,tone:'gold' as const}]:[]),
    {year,title:'A name to remember',text:`${prospects[0]?.name} of ${COUNTRY_NAMES[prospects[0]?.country] ?? prospects[0]?.country} is being described as a generational ${prospects[0]?.sport.toLowerCase()} talent.`,tone:'blue'},
    {year,title:'National program rising',text:`${COUNTRY_NAMES[pick(COUNTRIES)]} increases investment ahead of the next Games. Coaches expect a breakthrough.`,tone:'green'},
    {year,title:'The old guard feels pressure',text:`Several established champions face younger challengers as qualification approaches.`,tone:'red'}
  ];
}

function scoreEvent(e:StarEvent, athletes:Athlete[], year:number){
  const field=e.contenders.map(id=>athletes.find(a=>a.id===id)!).filter(Boolean);
  const ranked=field.map(a=>({a,s:a.overall+a.form*.18+Math.random()*18-(Math.max(0,age(a,year)-32)*1.3)})).sort((x,y)=>y.s-x.s);
  return ranked;
}

function makeStarEvents(year:number, athletes:Athlete[]):StarEvent[]{
  const evs=eventsFor(year);
  const candidates=evs.map(([sport,event],i)=>{
    let pool=athletes.filter(a=>!a.retired&&a.sport===sport&&a.event===event).sort((a,b)=>(b.overall+b.form/5)-(a.overall+a.form/5));
    while(pool.length<5){ const n=makeAthletes(year,1)[0]; n.sport=sport;n.event=event;athletes.push(n);pool.push(n); }
    const top=pool.slice(0,5); const veteran=top.find(a=>age(a,year)>=32); const close=top.length>1&&top[0].overall-top[1].overall<=3;
    const stars=Math.min(6,2+(close?2:0)+(veteran?1:0)+(top.some(a=>a.golds>=2)?1:0));
    const hook=veteran?`${veteran.name} may be competing in a final Olympic Games.`:close?`Two elite contenders enter separated by almost nothing.`:top[0].golds>=2?`${top[0].name} is chasing another place in history.`:`A new champion is ready to emerge.`;
    return {id:`${year}-${i}`,day:1+(i%12),sport,event,stars,hook,watched:false,contenders:top.map(a=>a.id)};
  });
  return candidates.sort((a,b)=>b.stars-a.stars).slice(0,Math.min(10,candidates.length)).map((e,i)=>({...e,day:1+Math.floor(i*12/Math.min(10,candidates.length))}));
}

function initialSave():Save{
  const athletes=makeAthletes(1896);
  return {year:1896,phase:'between',host:'Athens',day:0,athletes,stories:makeStories(1896,athletes),medals:medalBlank(),starEvents:[],history:[]};
}

export default function App(){
  const [save,setSave]=useState<Save>(()=>{try{return JSON.parse(localStorage.getItem('olympic-chronicles-v1')||'null')||initialSave()}catch{return initialSave()}});
  const [view,setView]=useState<'chronicle'|'games'|'athletes'|'almanac'>('chronicle');
  const [watch,setWatch]=useState<StarEvent|null>(null);
  const persist=(next:Save)=>{setSave(next);localStorage.setItem('olympic-chronicles-v1',JSON.stringify(next));};
  const medalRows=useMemo(() => (Object.entries(save.medals) as [string, Medal][]).sort((a,b)=>b[1].gold-a[1].gold||b[1].silver-a[1].silver).slice(0,8),[save.medals]);
  const active=save.athletes.filter(a=>!a.retired).sort((a,b)=>b.overall-a.overall);

  const advanceYear=()=>{
    if(save.year%4===0){
      const updated=save.athletes.map(a=>({...a,overall:Math.min(a.potential,a.overall+(Math.random()<.55?rand(3):0)),form:65+rand(31),retired:age(a,save.year)>35&&Math.random()<.45?a.retired||true:a.retired}));
      const starEvents=makeStarEvents(save.year,updated);
      persist({...save,phase:'games',day:1,athletes:updated,starEvents,medals:medalBlank()}); setView('games'); return;
    }
    const y=save.year+1;
    let athletes=save.athletes.map(a=>({...a,form:66+rand(30),overall:Math.min(a.potential,a.overall+(Math.random()<.4?1:0)),retired:a.retired||(age(a,y)>34&&Math.random()<.28)}));
    athletes=[...athletes,...makeAthletes(y,6).map(a=>({...a,born:y-(16+rand(7)),overall:63+rand(18),potential:82+rand(17)}))];
    persist({...save,year:y,host:HOSTS[Math.floor((y-1896)/4)%HOSTS.length],athletes,stories:makeStories(y,athletes)});
  };

  const watchEvent=(event:StarEvent)=>{
    if(event.watched){setWatch(event);return;}
    const ranked=scoreEvent(event,save.athletes,save.year); const winner=ranked[0].a; const runner=ranked[1].a;
    const record=Math.random()<.22; const margin=Math.max(.01,Math.random()*.38).toFixed(2);
    const result=event.event.includes('100m')?`${(12.4-(save.year-1896)*.0032-winner.overall*.015+Math.random()*.18).toFixed(2)}s`:event.event.includes('Marathon')?`${2+rand(2)}:${String(8+rand(42)).padStart(2,'0')}:${String(rand(60)).padStart(2,'0')}`:event.sport==='Gymnastics'?`${(82+winner.overall*.14+Math.random()*2).toFixed(3)} pts`:`Victory by ${margin}`;
    const recap=`${winner.name} defeated ${runner.name} in one of the defining moments of the ${save.host} Games.${record?' A new Olympic record completed the performance.':''}`;
    const starEvents=save.starEvents.map(e=>e.id===event.id?{...e,watched:true,winnerId:winner.id,result,record,recap}:e);
    const athletes=save.athletes.map(a=>a.id===winner.id?{...a,medals:a.medals+1,golds:a.golds+1,games:a.games+1}:a);
    const medals={...save.medals,[winner.country]:{...save.medals[winner.country],gold:save.medals[winner.country].gold+1},[runner.country]:{...save.medals[runner.country],silver:save.medals[runner.country].silver+1}};
    const done={...starEvents.find(e=>e.id===event.id)!,watched:true,winnerId:winner.id,result,record,recap};
    persist({...save,starEvents,athletes,medals}); setWatch(done);
  };

  const nextDay=()=>{
    if(save.day>=12){persist({...save,phase:'complete'});return;}
    persist({...save,day:save.day+1});
  };

  const nextOlympiad=()=>{
    const champion=medalRows[0]?.[0]||'USA'; const topEvent=save.starEvents.find(e=>e.stars===Math.max(...save.starEvents.map(s=>s.stars)));
    const memory=topEvent?.recap||`${COUNTRY_NAMES[champion]} topped the medal table.`;
    const y=save.year+1;
    persist({...save,year:y,phase:'between',day:0,stories:makeStories(y,save.athletes),history:[...save.history,{year:save.year,host:save.host,memory,champion}],starEvents:[],medals:medalBlank()});setView('chronicle');
  };

  return <div className={`${styles.app} ${save.year<1948?styles.paperEra:save.year<1992?styles.broadcastEra:styles.modernEra}`}>
    <header className={styles.topbar}>
      <div><span className={styles.kicker}>OLYMPIC</span><strong>CHRONICLES</strong></div>
      <div className={styles.era}>{eraFor(save.year)} · {save.year}</div>
      <button className={styles.reset} onClick={()=>{localStorage.removeItem('olympic-chronicles-v1');location.reload()}}>New history</button>
    </header>
    <nav className={styles.nav}>
      {(['chronicle','games','athletes','almanac'] as const).map(v=><button key={v} onClick={()=>setView(v)} className={view===v?styles.navActive:''}>{v}</button>)}
    </nav>

    {view==='chronicle'&&<main className={styles.layout}>
      <section className={styles.hero}>
        <div><span className={styles.eyebrow}>{save.phase==='between'?`${Math.max(0,4-(save.year-1896)%4)} years to the Games`:`${save.host} ${save.year}`}</span><h1>{save.phase==='between'?'The world moves toward the next Olympiad.':'The Games have begun.'}</h1><p>Follow nations rising, champions aging, records falling and new events entering the Olympic story.</p></div>
        <div className={styles.yearCard}><small>THE YEAR</small><b>{save.year}</b><span>{activeSports(save.year).length} active sports</span></div>
      </section>
      <section className={styles.section}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>Annual chronicle</span><h2>What changed this year</h2></div></div>
        <div className={styles.storyGrid}>{save.stories.map((s,i)=><article className={`${styles.story} ${styles[s.tone]}`} key={i}><small>{s.title}</small><h3>{s.text}</h3></article>)}</div>
      </section>
      <section className={styles.split}>
        <div className={styles.panel}><span className={styles.eyebrow}>Athletes to watch</span>{active.slice(0,5).map(a=><div className={styles.athleteRow} key={a.id}><div className={styles.avatar}>{a.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><b>{a.name}</b><span>{COUNTRY_NAMES[a.country]} · {a.sport} · age {age(a,save.year)}</span></div><strong>{a.overall}</strong></div>)}</div>
        <div className={styles.panel}><span className={styles.eyebrow}>Olympic evolution</span><h3>{activeSports(save.year).length} sports now form the program</h3><div className={styles.sportCloud}>{activeSports(save.year).map(s=><span key={s}>{s}</span>)}</div></div>
      </section>
      <button className={styles.primary} onClick={advanceYear}>{save.year%4===0?'Open the Olympic Games':'Advance one year'} <span>→</span></button>
    </main>}

    {view==='games'&&<main className={styles.layout}>
      <section className={styles.gamesHero}><div><span className={styles.eyebrow}>{save.host.toUpperCase()} {save.year}</span><h1>{save.phase==='complete'?'How history remembers these Games':`Day ${save.day} of 12`}</h1><p>{save.phase==='complete'?'The champions are crowned. The stories now belong to history.':'The simulation has selected the events with the strongest human drama—not simply the biggest sports.'}</p></div><div className={styles.rings}>◯ ◯ ◯ ◯ ◯</div></section>
      <section className={styles.medalStrip}>{medalRows.slice(0,5).map(([c,m],i)=><div key={c}><span>{i+1}</span><b>{c}</b><strong>{m.gold}</strong><small>gold</small></div>)}</section>
      {save.phase!=='complete'?<>
        <section className={styles.section}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>Today’s broadcast</span><h2>Star events</h2></div><span>{save.starEvents.filter(e=>e.watched).length}/{save.starEvents.length} complete</span></div>
          <div className={styles.eventGrid}>{save.starEvents.map(e=>{const favorite=save.athletes.find(a=>a.id===e.contenders[0]);const winner=save.athletes.find(a=>a.id===e.winnerId);return <article key={e.id} className={`${styles.eventCard} ${e.day===save.day?styles.today:''}`}><div className={styles.eventTop}><span>DAY {e.day}</span><span>{'★'.repeat(e.stars)}</span></div><small>{e.sport}</small><h3>{e.event}</h3><p>{e.watched?e.recap:e.hook}</p><div className={styles.favorite}>{e.watched?<><b>{winner?.name}</b><span>{e.result}{e.record?' · RECORD':''}</span></>:<><b>{favorite?.name}</b><span>{favorite?.country} · {favorite?.overall} OVR</span></>}</div><button onClick={()=>watchEvent(e)}>{e.watched?'Relive final':e.day<=save.day?'Watch final':'Preview'}</button></article>})}</div>
        </section><button className={styles.primary} onClick={nextDay}>{save.day>=12?'Close the Games':'Complete day and continue'} <span>→</span></button>
      </>:<section className={styles.memory}><span className={styles.eyebrow}>The final chronicle</span><h2>{save.host} {save.year}: The Games of New Legends</h2><p>{save.starEvents.filter(e=>e.recap).slice(0,3).map(e=>e.recap).join(' ')}</p><button className={styles.primary} onClick={nextOlympiad}>Begin the next cycle →</button></section>}
    </main>}

    {view==='athletes'&&<main className={styles.layout}><section className={styles.section}><span className={styles.eyebrow}>Living careers</span><h1>Athletes of the age</h1><div className={styles.athleteGrid}>{active.slice(0,30).map(a=><article className={styles.athleteCard} key={a.id}><div className={styles.avatarLg}>{a.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><small>{a.country} · {a.sport}</small><h3>{a.name}</h3><p>{a.event}</p><div className={styles.metrics}><span><b>{a.overall}</b> rating</span><span><b>{age(a,save.year)}</b> age</span><span><b>{a.golds}</b> gold</span></div><em>{a.trait}</em></article>)}</div></section></main>}

    {view==='almanac'&&<main className={styles.layout}><section className={styles.section}><span className={styles.eyebrow}>The historical archive</span><h1>Olympic Almanac</h1>{save.history.length===0?<div className={styles.empty}>No Games have yet entered the archive. Athens 1896 is waiting.</div>:<div className={styles.historyGrid}>{[...save.history].reverse().map(h=><article className={styles.historyCard} key={h.year}><small>{h.host}</small><h2>{h.year}</h2><b>{COUNTRY_NAMES[h.champion]} led the medal table</b><p>{h.memory}</p></article>)}</div>}</section></main>}

    {watch&&<div className={styles.modalBackdrop} onClick={()=>setWatch(null)}><div className={styles.modal} onClick={e=>e.stopPropagation()}><button className={styles.close} onClick={()=>setWatch(null)}>×</button><span className={styles.eyebrow}>{watch.sport} · {save.host} {save.year}</span><h2>{watch.event}</h2><div className={styles.contenders}>{watch.contenders.map((id,i)=>{const a=save.athletes.find(x=>x.id===id);return a?<div key={id} className={i===0?styles.leader:''}><span>{i+1}</span><div><b>{a.name}</b><small>{a.country} · age {age(a,save.year)} · {a.trait}</small></div><strong>{a.overall}</strong></div>:null})}</div>{watch.watched?<div className={styles.reveal}><small>OLYMPIC CHAMPION</small><h3>{save.athletes.find(a=>a.id===watch.winnerId)?.name}</h3><b>{watch.result}</b>{watch.record&&<span>NEW OLYMPIC RECORD</span>}<p>{watch.recap}</p></div>:<p className={styles.previewText}>{watch.hook}</p>}</div></div>}
  </div>
}
