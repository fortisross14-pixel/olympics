import { useEffect, useMemo, useState } from 'react';
import styles from './App.module.css';
import Flag from './components/Flag/Flag';
import SportIcon from './components/SportIcon/SportIcon';
import { randomAthleteName } from './data/chronicleNames';

type Gender = 'M' | 'W';
type Phase = 'between' | 'games' | 'complete';
type View = 'chronicle' | 'qualification' | 'games' | 'athletes' | 'almanac';
type GamesTab = 'daily' | 'all' | 'medals';
type AlmanacTab = 'athletes' | 'countries' | 'records' | 'trends';
type Medal = 'gold' | 'silver' | 'bronze';
type Format =
  | 'race'
  | 'field'
  | 'vertical'
  | 'judged'
  | 'fencing'
  | 'weightlifting'
  | 'shootingPrecision'
  | 'shootingClay'
  | 'archery'
  | 'combat'
  | 'team'
  | 'golf'
  | 'sailing';

type Athlete = {
  id: string;
  name: string;
  country: string;
  gender: Gender;
  sport: string;
  event: string;
  born: number;
  overall: number;
  potential: number;
  form: number;
  trait: string;
  gold: number;
  silver: number;
  bronze: number;
  retired: boolean;
};

type Result = {
  athleteId?: string;
  name: string;
  country: string;
  mark: string;
  value: number;
  medal: Medal;
  record?: 'WR' | 'OR' | 'IR';
};

type FinalEvent = {
  id: string;
  day: number;
  sport: string;
  name: string;
  gender: Gender;
  format: Format;
  star: boolean;
  stars: number;
  hook: string;
  contenders: string[];
  resolved: boolean;
  results: Result[];
  headline?: string;
};

type Qualification = {
  total: number;
  closed: number;
  counts: Record<string, number>;
  news: string[];
};

type Archive = { year: number; host: string; champion: string; memory: string };
type Appearance = { year:number; athleteId:string; name:string; country:string; sport:string; event:string };
type LedgerResult = {
  year: number;
  host: string;
  sport: string;
  event: string;
  gender: Gender;
  athleteId?: string;
  name: string;
  country: string;
  medal: Medal;
  mark: string;
  value: number;
};
type RecordEntry = {
  key: string;
  sport: string;
  event: string;
  gender: Gender;
  year: number;
  host: string;
  athleteId?: string;
  name: string;
  country: string;
  mark: string;
  value: number;
  lowerBetter: boolean;
};

type Save = {
  version: 6;
  year: number;
  olympicYear: number;
  host: string;
  pendingHost: boolean;
  phase: Phase;
  day: number;
  athletes: Athlete[];
  events: FinalEvent[];
  medals: Record<string, { gold: number; silver: number; bronze: number }>;
  qualification: Qualification;
  history: Archive[];
  ledger: LedgerResult[];
  appearances: Appearance[];
  records: Record<string, RecordEntry>;
  annualNews: string[];
};

type Template = {
  sport: string;
  name: string;
  gender: Gender;
  format: Format;
  from: number;
  recordable?: boolean;
};

type WatchPayload =
  | { type: 'race'; checkpoints: { label: string; values: number[]; finished: boolean }[] }
  | { type: 'field'; attempts: (number | null)[][]; unit: string }
  | { type: 'vertical'; heights: number[]; attempts: ('O' | 'X' | '—')[][] }
  | { type: 'judged'; rounds: number[][] }
  | { type: 'fencing'; bouts: { stage: string; left: number; right: number; leftId: string; rightId: string; winnerId: string }[] }
  | { type: 'weightlifting'; lifts: { phase: string; weight: number; success: boolean }[][] }
  | { type: 'shooting'; rounds: number[][]; cumulative: boolean; unit: string }
  | { type: 'combat'; rounds: number[][]; labels: string[] }
  | { type: 'team'; periods: number[][]; labels: string[] }
  | { type: 'golf'; rounds: number[][] }
  | { type: 'sailing'; races: number[][] };

type ResolvedPackage = { event: FinalEvent; watch: WatchPayload };

const COUNTRIES = ['USA','GBR','FRA','GER','SWE','FIN','ITA','GRE','HUN','AUS','CAN','JPN','CHN','RUS','NED','BEL','DEN','NOR','ESP','BRA','ARG','CUB','MEX','IND','KOR','KEN','ETH','RSA','NZL','JAM','TUR','POL','CZE','SUI','AUT','IRL'];
const NAMES: Record<string, string> = {USA:'United States',GBR:'Great Britain',FRA:'France',GER:'Germany',SWE:'Sweden',FIN:'Finland',ITA:'Italy',GRE:'Greece',HUN:'Hungary',AUS:'Australia',CAN:'Canada',JPN:'Japan',CHN:'China',RUS:'Russia',NED:'Netherlands',BEL:'Belgium',DEN:'Denmark',NOR:'Norway',ESP:'Spain',BRA:'Brazil',ARG:'Argentina',CUB:'Cuba',MEX:'Mexico',IND:'India',KOR:'South Korea',KEN:'Kenya',ETH:'Ethiopia',RSA:'South Africa',NZL:'New Zealand',JAM:'Jamaica',TUR:'Turkey',POL:'Poland',CZE:'Czechia',SUI:'Switzerland',AUT:'Austria',IRL:'Ireland'};
const HOSTS = ['Paris','St. Louis','London','Stockholm','Antwerp','Amsterdam','Los Angeles','Berlin','Helsinki','Rome','Tokyo','Mexico City','Munich','Montreal','Moscow','Seoul','Barcelona','Atlanta','Sydney','Athens','Beijing','London','Rio de Janeiro','Tokyo','Paris','Los Angeles','Brisbane'];
const HOST_COUNTRY: Record<string,string> = {Paris:'FRA','St. Louis':'USA',London:'GBR',Stockholm:'SWE',Antwerp:'BEL',Amsterdam:'NED','Los Angeles':'USA',Berlin:'GER',Helsinki:'FIN',Rome:'ITA',Tokyo:'JPN','Mexico City':'MEX',Munich:'GER',Montreal:'CAN',Moscow:'RUS',Seoul:'KOR',Barcelona:'ESP',Atlanta:'USA',Sydney:'AUS',Athens:'GRE',Beijing:'CHN','Rio de Janeiro':'BRA',Brisbane:'AUS'};
const TRAITS = ['Fearless finisher','Technical perfectionist','Slow starter','Big-stage performer','Relentless veteran','Explosive prodigy','Calm under pressure','Late-race closer'];
const rand = (n:number) => Math.floor(Math.random()*n);
const pick = <T,>(a:T[]) => a[rand(a.length)];
const QUALIFIER_POOL = ['USA','USA','USA','GBR','GBR','FRA','FRA','GER','GER','SWE','FIN','ITA','GRE','HUN','AUS','CAN','JPN','CHN','RUS','NED','BEL','DEN','NOR','ESP','BRA','ARG','CUB','MEX','IND','KOR','KEN','ETH','RSA','NZL','JAM','TUR','POL','CZE','SUI','AUT','IRL'];
const qualifierCountry = (y:number) => pick(QUALIFIER_POOL.filter(c=>countryPool(y).includes(c)));
const qualificationSlots = (t:Template) => t.format==='team'?2:t.sport==='Sailing'||t.sport==='Rowing'?5:6;
const clamp = (n:number,min:number,max:number) => Math.max(min,Math.min(max,n));
const age = (a:Athlete,y:number) => y-a.born;
const countryPool = (y:number) => COUNTRIES.slice(0,y<1900?14:y<1920?22:y<1960?29:COUNTRIES.length);
const blankMedals = () => Object.fromEntries(COUNTRIES.map(c=>[c,{gold:0,silver:0,bronze:0}]));
const lowerBetter = (format:Format) => ['race','golf','sailing'].includes(format);
const recordKey = (e:Pick<FinalEvent,'sport'|'name'|'gender'>) => `${e.sport}|${e.name}|${e.gender}`;

const E = (sport:string,name:string,format:Format,from=1896,gender:Gender='M',recordable=true):Template => ({sport,name:`${gender==='M'?"Men's":"Women's"} ${name}`,gender,format,from,recordable});
const A = (name:string,format:Format='race',from=1896,gender:Gender='M') => E('Athletics',name,format,from,gender,true);

const TEMPLATES:Template[] = [
  A('100m'),A('200m'),A('400m'),A('800m'),A('1500m'),A('Marathon'),A('110m Hurdles'),A('High Jump','vertical'),A('Pole Vault','vertical'),A('Long Jump','field'),A('Triple Jump','field'),A('Shot Put','field'),A('Discus','field'),A('Javelin','field',1908),A('5000m','race',1900),A('10000m','race',1900),A('3000m Steeplechase','race',1900),A('Hammer Throw','field',1900),
  E('Swimming','100m Freestyle','race'),E('Swimming','200m Freestyle','race',1900),E('Swimming','400m Freestyle','race'),E('Swimming','1500m Freestyle','race'),E('Swimming','100m Backstroke','race',1904),E('Swimming','200m Backstroke','race',1900),E('Swimming','200m Breaststroke','race',1904),
  E('Cycling','Track Sprint','race'),E('Cycling','10km Track','race'),E('Cycling','Road Race','race'),
  E('Gymnastics','All-Around','judged'),E('Gymnastics','Vault','judged'),E('Gymnastics','Parallel Bars','judged'),E('Gymnastics','Horizontal Bar','judged'),E('Gymnastics','Rings','judged'),
  E('Fencing','Foil','fencing'),E('Fencing','Sabre','fencing'),E('Fencing','Épée','fencing',1900),
  E('Weightlifting','Lightweight Total','weightlifting'),E('Weightlifting','Heavyweight Total','weightlifting'),
  E('Wrestling','Greco-Roman','combat'),
  E('Shooting','50m Rifle','shootingPrecision'),E('Shooting','25m Pistol','shootingPrecision'),E('Shooting','Trap','shootingClay',1900),
  E('Tennis','Singles','team',1896,'M',false),
  E('Rowing','Single Sculls','race',1900),E('Rowing','Coxed Pairs','race',1900),E('Rowing','Coxed Fours','race',1900),E('Rowing','Eights','race',1900),
  E('Sailing','Small Boat Class','sailing',1900),E('Sailing','Open Class','sailing',1900),
  E('Archery','Individual Target','archery',1900),
  E('Equestrian','Individual Jumping','judged',1900),E('Equestrian','High Jump','vertical',1900),
  E('Golf','Individual Stroke Play','golf',1900),E('Golf','Individual Stroke Play','golf',1900,'W'),
  E('Football','Tournament Final','team',1900,'M',false),E('Rugby Union','Tournament Final','team',1900,'M',false),E('Water Polo','Tournament Final','team',1900,'M',false),E('Polo','Tournament Final','team',1900,'M',false),
  E('Boxing','Flyweight','combat',1904),E('Boxing','Lightweight','combat',1904),E('Boxing','Middleweight','combat',1904),E('Boxing','Heavyweight','combat',1904),E('Diving','Platform','judged',1904),
  A('100m','race',1928,'W'),A('200m','race',1948,'W'),A('400m','race',1964,'W'),A('800m','race',1928,'W'),A('1500m','race',1972,'W'),A('Marathon','race',1984,'W'),A('100m Hurdles','race',1932,'W'),A('High Jump','vertical',1928,'W'),A('Pole Vault','vertical',2000,'W'),A('Long Jump','field',1948,'W'),A('Triple Jump','field',1996,'W'),A('Javelin','field',1932,'W'),A('Shot Put','field',1948,'W'),A('Discus','field',1928,'W'),
  E('Swimming','100m Freestyle','race',1912,'W'),E('Swimming','200m Freestyle','race',1968,'W'),E('Swimming','400m Freestyle','race',1924,'W'),E('Swimming','100m Backstroke','race',1924,'W'),E('Swimming','200m Breaststroke','race',1924,'W'),
  E('Gymnastics','All-Around','judged',1928,'W'),E('Gymnastics','Vault','judged',1952,'W'),E('Gymnastics','Uneven Bars','judged',1952,'W'),E('Gymnastics','Balance Beam','judged',1952,'W'),E('Diving','Platform','judged',1912,'W'),E('Fencing','Foil','fencing',1924,'W'),E('Tennis','Singles','team',1900,'W',false),
  E('Basketball','Tournament Final','team',1936,'M',false),E('Basketball','Tournament Final','team',1976,'W',false),E('Volleyball','Tournament Final','team',1964,'M',false),E('Volleyball','Tournament Final','team',1964,'W',false),E('Judo','Middleweight','combat',1964),E('Judo','Middleweight','combat',1992,'W')
];

const templatesFor = (y:number) => TEMPLATES.filter(x=>x.from<=y);

function makeAthlete(year:number,t:Template,i:number):Athlete {
  const country=pick(countryPool(year));
  return {id:`a-${year}-${t.name}-${i}-${Math.random()}`,name:randomAthleteName(country,t.gender),country,gender:t.gender,sport:t.sport,event:t.name,born:year-(18+rand(15)),overall:67+rand(28),potential:78+rand(21),form:68+rand(29),trait:pick(TRAITS),gold:0,silver:0,bronze:0,retired:false};
}
function createAthletes(y:number){return templatesFor(y).flatMap(t=>Array.from({length:6},(_,i)=>makeAthlete(y,t,i)))}
function score(a:Athlete,y:number){const ageFactor=age(a,y)<22?-2:age(a,y)>34?-3:0;return a.overall*.7+a.form*.3+ageFactor+(Math.random()*12-6)}
function field(t:Template,athletes:Athlete[],y:number){const found=athletes.filter(a=>!a.retired&&a.event===t.name&&a.gender===t.gender);return [...found].sort((a,b)=>score(b,y)-score(a,y)).slice(0,t.format==='team'?2:6)}
function narrative(f:Athlete[],y:number){const top=[...f].sort((a,b)=>b.overall-a.overall);if(top.length<2)return 'A new Olympic champion will be crowned.';const gap=top[0].overall-top[2]?.overall;if(top[0].gold>=4)return `History can be made. ${top[0].name} will attempt to claim a fifth Olympic gold.`;if(age(top[0],y)<=21)return `Can the young promise start with gold? At only ${age(top[0],y)}, ${top[0].name} is chasing a first Olympic title.`;if(age(top[0],y)>=34)return `${top[0].name} enters what may be a final Olympic appearance with one last chance at glory.`;if(gap<4)return `An extremely competitive final is expected: ${top.slice(0,3).map(a=>a.name).join(', ')} are separated by almost nothing.`;return `${top[0].name} enters as the favorite, but Olympic finals have a habit of rewriting expectations.`}
function makeEvents(y:number,athletes:Athlete[]){const items=templatesFor(y).map((t,i)=>{const f=field(t,athletes,y);const gap=(f[0]?.overall||0)-(f[1]?.overall||0);const drama=(gap<3?5:0)+(f.some(a=>a.gold>1)?4:0)+(f.some(a=>age(a,y)>33)?3:0)+Math.random()*4;return{t,i,f,drama}});const target=Math.min(12,Math.max(8,Math.round(items.length*.15)));const star=new Set([...items].sort((a,b)=>b.drama-a.drama).slice(0,target).map(x=>x.i));return items.map(({t,i,f,drama})=>({id:`e-${y}-${i}`,day:1+(i%12),sport:t.sport,name:t.name,gender:t.gender,format:t.format,star:star.has(i),stars:star.has(i)?Math.min(6,3+Math.floor(drama/3)):1,hook:narrative(f,y),contenders:f.map(a=>a.id),resolved:false,results:[]} as FinalEvent))}

function eraFactor(y:number){return clamp((y-1896)/140,0,1)}
function raceBase(name:string,y:number){const e=eraFactor(y);if(name.includes('100m'))return 12.2-2.35*e;if(name.includes('200m'))return 25.0-5.6*e;if(name.includes('400m'))return 56-12.5*e;if(name.includes('800m'))return 132-31*e;if(name.includes('1500m'))return 270-55*e;if(name.includes('5000m'))return 980-220*e;if(name.includes('10000m'))return 2100-500*e;if(name.includes('Marathon'))return 10800-3300*e;if(name.includes('Hurdles'))return 18.0-5.2*e;if(name.includes('Freestyle'))return name.includes('1500m')?1500-650*e:name.includes('400m')?380-170*e:name.includes('200m')?180-80*e:82-35*e;if(name.includes('Backstroke'))return name.includes('200m')?210-90*e:100-44*e;if(name.includes('Breaststroke'))return 220-95*e;if(name.includes('Road Race'))return 9000-1200*e;if(name.includes('Track Sprint'))return 17-7*e;if(name.includes('10km'))return 1200-300*e;if(name.includes('Sculls'))return 510-110*e;if(name.includes('Pairs'))return 500-100*e;if(name.includes('Fours'))return 450-95*e;if(name.includes('Eights'))return 420-90*e;return 100-20*e}
function formatTime(seconds:number){if(seconds>=3600){const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=(seconds%60).toFixed(1).padStart(4,'0');return `${h}:${String(m).padStart(2,'0')}:${s}`}if(seconds>=60){const m=Math.floor(seconds/60),s=(seconds%60).toFixed(2).padStart(5,'0');return `${m}:${s}`}return `${seconds.toFixed(2)}s`}
function resultMark(e:FinalEvent,a:Athlete,y:number,rank:number){const quality=(a.overall+a.form)/2;const eF=eraFactor(y);switch(e.format){case'race':{const base=raceBase(e.name,y);const value=base*(1-(quality-80)/330)+rank*(base*.004)+Math.random()*base*.004;return{value,mark:formatTime(value)}}case'field':{let base=e.name.includes('Long Jump')?6.15+2.8*eF:e.name.includes('Triple')?13+5*eF:e.name.includes('Shot')?13+10*eF:e.name.includes('Discus')?38+35*eF:e.name.includes('Hammer')?42+40*eF:44+50*eF;const value=base+(quality-80)*.08-rank*.18+Math.random()*.12;return{value,mark:`${value.toFixed(2)}m`}}case'vertical':{const pole=e.name.includes('Pole');const base=pole?3.1+3.1*eF:1.72+.75*eF;const value=base+(quality-80)*(pole?.025:.009)-rank*(pole?.04:.02);return{value,mark:`${value.toFixed(2)}m`}}case'judged':{const value=clamp(70+(quality-70)*.85-rank*.8+Math.random(),50,99.9);return{value,mark:value.toFixed(2)}}case'fencing':return{value:15-rank,mark:rank===0?'15 touches':'Finalist'};case'weightlifting':{const base=e.name.includes('Heavy')?260:205;const value=base+(quality-75)*3.1-rank*5+Math.random()*2;return{value,mark:`${Math.round(value)}kg total`}}case'shootingPrecision':{const value=clamp(585+(quality-75)*1.35-rank*1.1+Math.random(),500,654);return{value,mark:value.toFixed(y>=1988?1:0)}}case'shootingClay':{const value=clamp(Math.round(42+(quality-70)*.5-rank),25,50);return{value,mark:`${value}/50`}}case'archery':{const value=clamp(600+(quality-70)*2.1-rank*3+Math.random()*2,450,720);return{value,mark:`${Math.round(value)} pts`}}case'combat':return{value:10-rank,mark:rank===0?'Final victory':'Medalist'};case'team':return{value:100-rank,mark:rank===0?'Champions':'Finalists'};case'golf':{const value=Math.round(292-(quality-75)*.7+rank*2);return{value,mark:`${value} strokes`}}case'sailing':{const value=8+rank*5+rand(3);return{value,mark:`${value} pts`}}}}

function generateWatch(e:FinalEvent,ordered:Athlete[],results:Result[]):WatchPayload {
  if(e.format==='race'){
    const finishValues=ordered.map(a=>results.find(r=>r.athleteId===a.id)?.value||100);
    const count=e.name.includes('100m')?10:e.name.includes('200m')?8:6;
    const checkpoints=Array.from({length:count},(_,step)=>{const p=(step+1)/count;const vals=ordered.map((a,i)=>clamp(100*p+(a.trait==='Slow starter'?(p<.45?-5:3):0)+(a.trait==='Late-race closer'?(p<.65?-3:4):0)+(Math.random()*5-2.5)-i*.25,0,100));if(step===count-1)vals.forEach((_,i)=>vals[i]=i===0?100:clamp(100-(finishValues[i]-finishValues[0])*3,88,99.8));return{label:e.name.includes('100m')?`${step+1}.0s`:`${Math.round(p*100)}%`,values:vals,finished:step===count-1}});return{type:'race',checkpoints};
  }
  if(e.format==='field'){
    const winning=results[0]?.value||50;
    const targets=ordered.map((a,i)=>results.find(r=>r.athleteId===a.id)?.value??Math.max(0,winning-(i*.45+.25+Math.random()*.35)));
    const attempts=targets.map((target,i)=>Array.from({length:6},(_,k)=>{
      if(Math.random()<.09)return null;
      const build=(k/5)*.75;
      return Math.max(0,target-(1.25-build)+Math.random()*.45-i*.015);
    }));
    attempts.forEach((row,i)=>{row[4+rand(2)]=targets[i]});
    return{type:'field',attempts,unit:'m'};
  }
  if(e.format==='vertical'){
    const winning=results[0]?.value||(e.name.includes('Pole')?4:2);
    const step=e.name.includes('Pole')?.1:.03;
    const targets=ordered.map((a,i)=>results.find(r=>r.athleteId===a.id)?.value??Math.max(step,winning-step*(i+1)));
    const heights=Array.from({length:6},(_,i)=>winning-step*(4-i));
    const attempts=targets.map(target=>heights.map(h=>h<=target?(Math.random()<.82?'O':'X'):'X') as ('O'|'X'|'—')[]);
    return{type:'vertical',heights,attempts};
  }
  if(e.format==='judged'){
    const count=e.sport==='Gymnastics'&&e.name.includes('All-Around')?6:4;
    const winning=results[0]?.value||85;
    const totals=ordered.map((a,i)=>results.find(r=>r.athleteId===a.id)?.value??Math.max(45,winning-(i*1.4+1)));
    const rounds=Array.from({length:count},(_,ri)=>ordered.map((a,i)=>clamp(totals[i]/count+(Math.random()*.65-.325)+(ri===count-1&&i===0?.15:0),6,16)));
    return{type:'judged',rounds};
  }
  if(e.format==='fencing'){
    const [a,b,c,d]=ordered;const semi1={stage:'Semifinal 1',left:15,right:9+rand(6),leftId:a.id,rightId:d.id,winnerId:a.id};const semi2Winner=Math.random()<.65?b:c;const semi2Loser=semi2Winner.id===b.id?c:b;const semi2={stage:'Semifinal 2',left:15,right:10+rand(5),leftId:semi2Winner.id,rightId:semi2Loser.id,winnerId:semi2Winner.id};const finalWinner=ordered[0];const other=finalWinner.id===a.id?semi2Winner:a;return{type:'fencing',bouts:[semi1,semi2,{stage:'Gold-medal bout',left:15,right:10+rand(5),leftId:finalWinner.id,rightId:other.id,winnerId:finalWinner.id}]};
  }
  if(e.format==='weightlifting'){
    const winning=results[0]?.value||250;
    const totals=ordered.map((a,i)=>results.find(r=>r.athleteId===a.id)?.value??Math.max(80,winning-(i*7+5+rand(5))));
    const lifts=totals.map((total,i)=>{const snatch=Math.round(total*.45);const cj=Math.round(total-snatch);return[
      {phase:'Snatch 1',weight:snatch-8,success:Math.random()>.05},
      {phase:'Snatch 2',weight:snatch-3,success:Math.random()>.16},
      {phase:'Snatch 3',weight:snatch,success:i<3?Math.random()>.12:Math.random()>.38},
      {phase:'C&J 1',weight:cj-10,success:Math.random()>.06},
      {phase:'C&J 2',weight:cj-4,success:Math.random()>.18},
      {phase:'C&J 3',weight:cj,success:i===0?true:i<3?Math.random()>.28:Math.random()>.52}
    ]});
    return{type:'weightlifting',lifts};
  }
  if(e.format==='shootingPrecision'||e.format==='shootingClay'||e.format==='archery'){
    const clay=e.format==='shootingClay';const arch=e.format==='archery';const rounds=Array.from({length:5},()=>ordered.map((_,i)=>clay?clamp(8+rand(3)-Math.floor(i/3),5,10):arch?clamp(52+rand(8)-i,35,60):clamp(100+Math.random()*9.5-i*.3,85,109.9)));return{type:'shooting',rounds,cumulative:true,unit:clay?'hits':arch?'points':'points'};
  }
  if(e.format==='combat'){
    const labels=e.sport==='Boxing'?['Round 1','Round 2','Round 3']:['Opening','Mid-bout','Final'];const rounds=labels.map((_,r)=>ordered.map((_,i)=>Math.max(0,Math.round((r+1)*(4+Math.random()*4)-i*1.2))));return{type:'combat',rounds,labels};
  }
  if(e.format==='team'){
    const basketball=e.sport==='Basketball';const labels=basketball?['Q1','Half','Q3','Final']:e.sport==='Tennis'?['Set 1','Set 2','Set 3']:['Early','Mid-game','Final'];let a=0,b=0;const periods=labels.map((_,i)=>{a+=basketball?18+rand(10):1+rand(3);b+=basketball?18+rand(10):1+rand(3);if(i===labels.length-1&&a===b)a++;return[a,b]});if(periods.at(-1)![0]<periods.at(-1)![1])periods.forEach(p=>{const x=p[0];p[0]=p[1];p[1]=x});return{type:'team',periods,labels};
  }
  if(e.format==='golf'){
    const rounds=Array.from({length:4},()=>ordered.map((_,i)=>67+rand(8)+i));return{type:'golf',rounds};
  }
  const races=Array.from({length:6},()=>ordered.map((_,i)=>1+i+rand(4)));return{type:'sailing',races};
}

function resolveEvent(e:FinalEvent,athletes:Athlete[],y:number,records:Record<string,RecordEntry>):ResolvedPackage {
  const f=e.contenders.map(id=>athletes.find(a=>a.id===id)!).filter(Boolean);
  const ordered=[...f].sort((a,b)=>score(b,y)-score(a,y));
  const results:Result[]=ordered.slice(0,3).map((a,i)=>{const p=resultMark(e,a,y,i);return{athleteId:a.id,name:a.name,country:a.country,mark:p.mark,value:p.value,medal:'bronze'}})
    .sort((a,b)=>lowerBetter(e.format)?a.value-b.value:b.value-a.value)
    .map((r,i)=>({...r,medal:(['gold','silver','bronze'][i] as Medal)}));
  const medalIds=new Set(results.map(r=>r.athleteId));
  const competitionOrder=[...results.map(r=>ordered.find(a=>a.id===r.athleteId)!).filter(Boolean),...ordered.filter(a=>!medalIds.has(a.id))];
  const template=TEMPLATES.find(t=>t.name===e.name&&t.gender===e.gender&&t.sport===e.sport);
  if(template?.recordable&&results[0]){
    const key=recordKey(e),previous=records[key],isBetter=!previous||(lowerBetter(e.format)?results[0].value<previous.value:results[0].value>previous.value);
    if(isBetter)results[0].record=previous?'WR':'IR';
  }
  const favorite=ordered[0],winner=ordered.find(a=>a.id===results[0]?.athleteId),favPos=results.findIndex(r=>r.athleteId===favorite?.id);
  let headline=winner?.id!==favorite?.id?`Big upset! ${winner.name} defeats favorite ${favorite.name}, who finishes ${favPos===1?'with silver':favPos===2?'with bronze':'outside the medals'}.`:`${winner.name} confirms the favorite's status and becomes Olympic champion.`;
  if(results[0]?.record==='WR')headline=`NEW WORLD RECORD! ${winner.name} wins with ${results[0].mark}, improving the previous global standard.`;
  if(winner?.gold>=4)headline=`History made: ${winner.name} claims a fifth Olympic gold.`;
  const out={...e,resolved:true,results,headline};
  return{event:out,watch:generateWatch(out,competitionOrder,results)};
}

function initial():Save {const athletes=createAthletes(1896);return{version:6,year:1896,olympicYear:1896,host:'Athens',pendingHost:false,phase:'between',day:1,athletes,events:[],medals:blankMedals(),qualification:{total:templatesFor(1896).length,closed:templatesFor(1896).length,counts:{},news:['The first modern Olympic field gathers in Athens.']},history:[],ledger:[],appearances:[],records:{},annualNews:['The modern Olympic movement prepares its inaugural Games in Athens.','Athletes travel as amateurs, often with limited formal qualification.','Nine sports will define the first chapter of Olympic history.']}}
function hostOptions(year:number){const idx=Math.max(0,Math.floor((year-1900)/4));return[HOSTS[idx%HOSTS.length],HOSTS[(idx+5)%HOSTS.length],HOSTS[(idx+11)%HOSTS.length]]}

function Game({slotId,initialSave,onExit}:{slotId:number;initialSave:Save;onExit:()=>void}){
  const [save,setSave]=useState<Save>(initialSave);
  const [view,setView]=useState<View>('chronicle');
  const [gamesTab,setGamesTab]=useState<GamesTab>('daily');
  const [preview,setPreview]=useState<string|null>(null);
  const [watch,setWatch]=useState<{event:FinalEvent;payload:WatchPayload}|null>(null);
  const [watchStep,setWatchStep]=useState(0);
  const [result,setResult]=useState<string|null>(null);
  const [almanacTab,setAlmanacTab]=useState<AlmanacTab>('athletes');
  const [sportFilter,setSportFilter]=useState('All');
  const [trendMetric,setTrendMetric]=useState<'medals'|'golds'|'medalsCum'|'goldsCum'>('medalsCum');

  const persist=(s:Save)=>{setSave(s);void writeSlot(slotId,s)};
  const today=save.events.filter(e=>e.day===save.day);
  const event=save.events.find(e=>e.id===preview);
  const resultEvent=save.events.find(e=>e.id===result);
  const active=save.athletes.filter(a=>!a.retired).sort((a,b)=>b.overall-a.overall);
  const medalRows=useMemo(()=>Object.entries(save.medals).sort((a,b)=>b[1].gold-a[1].gold||b[1].silver-a[1].silver||b[1].bronze-a[1].bronze),[save.medals]);
  const sports=useMemo(()=>['All',...Array.from(new Set([...save.ledger.map(r=>r.sport),...save.events.map(e=>e.sport)])).sort()],[save.ledger,save.events]);

  function selectHost(h:string){const oy=save.olympicYear+4;const athletes=save.athletes.map(a=>({...a,retired:a.retired||age(a,oy-4)>39}));persist({...save,year:oy-4,olympicYear:oy,host:h,pendingHost:false,phase:'between',day:1,events:[],athletes,medals:blankMedals(),qualification:{total:templatesFor(oy).length,closed:0,counts:{},news:[`${h} has been selected to host the ${oy} Olympic Games.`]},annualNews:[`${h} wins the right to host the ${oy} Games.`,`Qualification begins across ${templatesFor(oy).length} medal contests.`]});setView('chronicle')}
  function open1896(){persist({...save,phase:'games',events:makeEvents(1896,save.athletes),day:1,medals:blankMedals()});setView('games')}
  function advanceYear(){if(save.year>=save.olympicYear){persist({...save,phase:'games',events:makeEvents(save.olympicYear,save.athletes),day:1,medals:blankMedals()});setView('games');return}const y=save.year+1;let athletes=save.athletes.map(a=>({...a,form:65+rand(31),overall:Math.min(a.potential,a.overall+(Math.random()<.55?rand(2):0)),retired:a.retired||(age(a,y)>36&&Math.random()<.35)}));templatesFor(save.olympicYear).forEach(t=>{if(athletes.filter(a=>!a.retired&&a.event===t.name&&a.gender===t.gender).length<6)athletes.push(...Array.from({length:4},(_,i)=>makeAthlete(y,t,i)))});const q={...save.qualification,counts:{...save.qualification.counts},news:[...save.qualification.news]};const target=Math.min(q.total,Math.round(q.total*((y-(save.olympicYear-4))/4)));while(q.closed<target){const template=templatesFor(save.olympicYear)[q.closed];q.closed++;const used:Record<string,number>={};for(let slot=0;slot<qualificationSlots(template);slot++){let c=qualifierCountry(y);let guard=0;while((used[c]||0)>=(template.format==='team'?1:2)&&guard++<20)c=qualifierCountry(y);used[c]=(used[c]||0)+1;const first=(q.counts[c]||0)===0;q.counts[c]=(q.counts[c]||0)+1;if(first)q.news.unshift(`${NAMES[c]} has placed its first athlete or team into the ${save.olympicYear} Games.`)}}const star=athletes.filter(a=>!a.retired).sort((a,b)=>b.overall-a.overall)[rand(Math.min(8,athletes.length))];if(star)q.news.unshift(`${star.name} (${star.country}) secures qualification in ${star.event}.`);persist({...save,year:y,athletes,qualification:q,annualNews:[q.news[0]||'Qualification continues.',`${q.closed} of ${q.total} Olympic contests now have confirmed qualifiers.`,`${NAMES[pick(countryPool(y))]} announces a major investment in elite coaching.`]})}
  function commitResolved(pkg:ResolvedPackage){const r=pkg.event;let medals={...save.medals};let athletes=[...save.athletes];const ledger=[...save.ledger];const appearances=[...save.appearances];const records={...save.records};
    for(const athleteId of r.contenders){const a=athletes.find(x=>x.id===athleteId);if(a&&!appearances.some(x=>x.year===save.olympicYear&&x.athleteId===a.id&&x.event===r.name))appearances.push({year:save.olympicYear,athleteId:a.id,name:a.name,country:a.country,sport:r.sport,event:r.name})}r.results.forEach(x=>{medals={...medals,[x.country]:{...medals[x.country],[x.medal]:medals[x.country][x.medal]+1}};athletes=athletes.map(a=>a.id===x.athleteId?{...a,[x.medal]:a[x.medal]+1}:a);ledger.push({year:save.olympicYear,host:save.host,sport:r.sport,event:r.name,gender:r.gender,athleteId:x.athleteId,name:x.name,country:x.country,medal:x.medal,mark:x.mark,value:x.value})});const winner=r.results[0];if(winner?.record){const key=recordKey(r);records[key]={key,sport:r.sport,event:r.name,gender:r.gender,year:save.olympicYear,host:save.host,athleteId:winner.athleteId,name:winner.name,country:winner.country,mark:winner.mark,value:winner.value,lowerBetter:lowerBetter(r.format)}}persist({...save,events:save.events.map(e=>e.id===r.id?r:e),medals,athletes,ledger,appearances,records})}
  function simulateEvent(e:FinalEvent,showResult=true){const pkg=resolveEvent(e,save.athletes,save.olympicYear,save.records);commitResolved(pkg);setPreview(null);if(showResult)setResult(e.id)}
  function viewEvent(e:FinalEvent){const pkg=resolveEvent(e,save.athletes,save.olympicYear,save.records);commitResolved(pkg);setPreview(null);setWatch({event:pkg.event,payload:pkg.watch});setWatchStep(0)}
  function nextEvent(){const e=today.find(x=>!x.resolved);if(!e)return;if(e.star)setPreview(e.id);else simulateEvent(e,true)}
  function simulateAllNormal(){let current=save;for(const e of today.filter(x=>!x.resolved&&!x.star)){const pkg=resolveEvent(e,current.athletes,current.olympicYear,current.records);const r=pkg.event;let medals={...current.medals},athletes=[...current.athletes],ledger=[...current.ledger],appearances=[...current.appearances],records={...current.records};for(const athleteId of r.contenders){const a=athletes.find(x=>x.id===athleteId);if(a&&!appearances.some(x=>x.year===current.olympicYear&&x.athleteId===a.id&&x.event===r.name))appearances.push({year:current.olympicYear,athleteId:a.id,name:a.name,country:a.country,sport:r.sport,event:r.name})}for(const x of r.results){medals={...medals,[x.country]:{...medals[x.country],[x.medal]:medals[x.country][x.medal]+1}};athletes=athletes.map(a=>a.id===x.athleteId?{...a,[x.medal]:a[x.medal]+1}:a);ledger.push({year:current.olympicYear,host:current.host,sport:r.sport,event:r.name,gender:r.gender,athleteId:x.athleteId,name:x.name,country:x.country,medal:x.medal,mark:x.mark,value:x.value})}const winner=r.results[0];if(winner?.record){const key=recordKey(r);records[key]={key,sport:r.sport,event:r.name,gender:r.gender,year:current.olympicYear,host:current.host,athleteId:winner.athleteId,name:winner.name,country:winner.country,mark:winner.mark,value:winner.value,lowerBetter:lowerBetter(r.format)}}current={...current,events:current.events.map(x=>x.id===r.id?r:x),medals,athletes,ledger,appearances,records}}persist(current)}
  function moveDay(){if(today.some(e=>!e.resolved))return;if(save.day<12)persist({...save,day:save.day+1});else persist({...save,phase:'complete'})}
  function closeGames(){const champ=medalRows[0]?.[0]||'USA';const memory=save.events.filter(e=>e.star&&e.headline).slice(0,4).map(e=>e.headline).join(' ');persist({...save,phase:'complete',pendingHost:true,history:[...save.history,{year:save.olympicYear,host:save.host,champion:champ,memory}],annualNews:[`${save.host} ${save.olympicYear} enters history. ${NAMES[champ]} led the medal table.`]});setView('chronicle')}

  const opts=hostOptions(save.olympicYear+4);
  return <div className={styles.app}>
    <header className={styles.topbar}><div><span className={styles.kicker}>OLYMPIC</span><strong>CHRONICLES</strong></div><div className={styles.era}>{save.host} {save.olympicYear} · {save.year}</div><button className={styles.reset} onClick={onExit}>Save slots</button></header>
    <nav className={styles.nav}>{(['chronicle','qualification','games','athletes','almanac'] as View[]).map(v=><button key={v} onClick={()=>setView(v)} className={view===v?styles.navActive:''}>{v}</button>)}</nav>
    {save.pendingHost&&<div className={styles.hostOverlay}><div className={styles.hostPanel}><span className={styles.eyebrow}>Host selection · {save.olympicYear+4}</span><h1>Where will the next Olympiad be held?</h1><p>The host is selected immediately after the prior Games. Its nation receives a modest home advantage and shapes the next cycle's identity.</p><div className={styles.hostGrid}>{opts.map((h,i)=><button key={h} onClick={()=>selectHost(h)}><Flag code={HOST_COUNTRY[h]||'GRE'} size={42}/><small>CANDIDATE {i+1}</small><b>{h}</b><span>{i===0?'Established sporting capital':i===1?'Ambitious expanding bid':'A bold new Olympic chapter'}</span></button>)}</div></div></div>}
    {view==='chronicle'&&<main className={styles.layout}><section className={styles.hero}><div><span className={styles.eyebrow}>{save.phase==='games'?'THE GAMES ARE UNDERWAY':save.olympicYear===1896?'THE FIRST MODERN OLYMPIAD':`${save.olympicYear-save.year} YEARS TO ${save.host.toUpperCase()}`}</span><h1>{save.olympicYear===1896?'The Olympic story begins in Athens.':'Champions rise long before the flame is lit.'}</h1><p>Follow qualification, emerging stars, changing national programs and the stories that make the Games the final ecstasy of each four-year cycle.</p></div><div className={styles.yearCard}><small>THE YEAR</small><b>{save.year}</b><span>{templatesFor(save.olympicYear).length} medal contests</span></div></section><section className={styles.section}><span className={styles.eyebrow}>Annual chronicle</span><h2>What changed this year</h2><div className={styles.storyGrid}>{save.annualNews.map((n,i)=><article className={`${styles.story} ${[styles.gold,styles.blue,styles.green][i%3]}`} key={i}><small>{i===0?'LEAD STORY':'FROM THE OLYMPIC WORLD'}</small><h3>{n}</h3></article>)}</div></section><button className={styles.primary} onClick={save.olympicYear===1896&&save.phase==='between'?open1896:save.phase==='games'?()=>setView('games'):advanceYear}>{save.olympicYear===1896&&save.phase==='between'?'Open Athens 1896':save.phase==='games'?'Return to the Games':save.year>=save.olympicYear?'Begin the Olympic Games':'Advance one year'} →</button></main>}
    {view==='qualification'&&<main className={styles.layout}><section className={styles.gamesHero}><div><span className={styles.eyebrow}>ROAD TO {save.host.toUpperCase()} {save.olympicYear}</span><h1>{save.qualification.closed}/{save.qualification.total} contests closed</h1><p>Qualification develops throughout the four-year cycle. Star debuts and first national entries become part of the chronicle.</p></div><div className={styles.yearCard}><small>QUALIFIED ENTRIES</small><b>{Object.values(save.qualification.counts).reduce((a,b)=>a+b,0)}</b><span>{Object.values(save.qualification.counts).filter(Boolean).length} nations represented</span></div></section><section className={styles.split}><div className={styles.panel}><span className={styles.eyebrow}>Qualification standings</span>{Object.entries(save.qualification.counts).sort((a,b)=>b[1]-a[1]).slice(0,18).map(([c,n],i)=><div className={styles.athleteRow} key={c}><b>{i+1}</b><Flag code={c} size={28}/><div><strong>{NAMES[c]}</strong><span>{n} athletes / teams</span></div><em>{n}</em></div>)}</div><div className={styles.panel}><span className={styles.eyebrow}>Qualification news</span>{save.qualification.news.slice(0,12).map((n,i)=><div className={styles.qualNews} key={i}><small>{i+1}</small><p>{n}</p></div>)}</div></section>{save.phase==='between'&&<button className={styles.primary} onClick={advanceYear}>{save.year>=save.olympicYear?'Begin the Games':'Advance qualification year'} →</button>}</main>}
    {view==='games'&&<main className={styles.layout}><section className={styles.gamesHero}><div><span className={styles.eyebrow}>{save.host.toUpperCase()} {save.olympicYear}</span><h1>{save.phase==='complete'?'The Games enter history':`Day ${save.day} of 12`}</h1><p>{save.phase==='complete'?'The medal race is over. The great performances and disappointments are now part of the archive.':'Every final is listed by day. Ordinary finals resolve quickly; Star Events can be watched without spoilers.'}</p></div><div className={styles.rings}>◯ ◯ ◯ ◯ ◯</div></section><div className={styles.subTabs}>{(['daily','all','medals'] as GamesTab[]).map(t=><button className={gamesTab===t?styles.navActive:''} onClick={()=>setGamesTab(t)} key={t}>{t==='daily'?'DAILY RESULTS':t==='all'?'ALL RESULTS':'MEDAL TABLE'}</button>)}</div>{save.phase==='complete'?<section className={styles.memory}><span className={styles.eyebrow}>How history remembers the Games</span><h2>{save.host} {save.olympicYear}</h2><p>{save.events.filter(e=>e.star&&e.headline).slice(0,5).map(e=>e.headline).join(' ')}</p><button className={styles.primary} onClick={closeGames}>Select the next host →</button></section>:gamesTab==='medals'?<Medals rows={medalRows}/>:gamesTab==='all'?<AllResults events={save.events}/>:<><div className={styles.dayNav}>{Array.from({length:12},(_,i)=>i+1).map(d=><button key={d} className={d===save.day?styles.dayActive:''} onClick={()=>persist({...save,day:d})}>DAY {d}</button>)}</div><section className={styles.section}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>Daily program</span><h2>Finals on Day {save.day}</h2></div><span>{today.filter(e=>e.resolved).length}/{today.length} complete</span></div><div className={styles.eventGrid}>{today.map(e=><article key={e.id} className={`${styles.eventCard} ${e.star?styles.starCard:''}`}><div className={styles.eventTop}><span className={styles.sportLabel}><SportIcon id={sportIconId(e.sport)} size={18}/>{e.sport}</span><span>{e.star?'★ STAR EVENT':'FINAL'}</span></div><h3>{e.name}</h3><p>{e.resolved?e.headline:e.hook}</p>{e.resolved?<div className={styles.podiumMini}>{e.results.map(r=><div key={r.medal}><span>{r.medal==='gold'?'🥇':r.medal==='silver'?'🥈':'🥉'}</span><Flag code={r.country} size={22}/><b>{r.name}</b><em>{r.mark}{r.record&&<strong className={styles.recordBadge}>{r.record}</strong>}</em></div>)}</div>:<div className={styles.favorite}><b>{save.athletes.find(a=>a.id===e.contenders[0])?.name}</b><span>{e.star?'Marquee final — preview available':'Qualified field ready'}</span></div>}{!e.resolved&&e.star&&<button onClick={()=>setPreview(e.id)}>Open event preview</button>}</article>)}</div></section><div className={styles.actionRow}><button className={styles.secondary} onClick={nextEvent}>Simulate next event</button><button className={styles.secondary} onClick={simulateAllNormal}>Simulate all normal events</button><button className={styles.primary} disabled={today.some(e=>!e.resolved)} onClick={moveDay}>{save.day===12?'Finish the Games':'Next day'} →</button></div></>}</main>}
    {view==='athletes'&&<main className={styles.layout}><section className={styles.section}><span className={styles.eyebrow}>Living careers</span><h1>Athletes of the age</h1><div className={styles.athleteGrid}>{active.slice(0,60).map(a=><article className={styles.athleteCard} key={a.id}><Flag code={a.country} size={34}/><small>{a.country} · {a.sport}</small><h3>{a.name}</h3><p>{a.event}</p><div className={styles.metrics}><span><b>{a.overall}</b> rating</span><span><b>{age(a,save.year)}</b> age</span><span><b>{a.gold+a.silver+a.bronze}</b> medals</span></div><em>{a.trait}</em></article>)}</div></section></main>}
    {view==='almanac'&&<Almanac save={save} tab={almanacTab} setTab={setAlmanacTab} sport={sportFilter} setSport={setSportFilter} sports={sports} metric={trendMetric} setMetric={setTrendMetric}/>} 
    {event&&<Preview event={event} athletes={save.athletes} year={save.olympicYear} close={()=>setPreview(null)} simulate={()=>simulateEvent(event,true)} view={()=>viewEvent(event)}/>} 
    {watch&&<Watch event={watch.event} athletes={save.athletes} payload={watch.payload} step={watchStep} setStep={setWatchStep} close={()=>{setWatch(null);setResult(watch.event.id)}}/>}
    {resultEvent&&<ResultModal event={resultEvent} close={()=>setResult(null)}/>} 
  </div>
}


type SlotRecord = { id:number; updatedAt:number; save:Save };
const DB_NAME='olympic-chronicles';
const DB_VERSION=1;
const SLOT_STORE='save-slots';

function openSaveDb():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(SLOT_STORE))request.result.createObjectStore(SLOT_STORE,{keyPath:'id'})};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
async function readSlot(id:number):Promise<SlotRecord|undefined>{const db=await openSaveDb();return new Promise((resolve,reject)=>{const tx=db.transaction(SLOT_STORE,'readonly');const req=tx.objectStore(SLOT_STORE).get(id);req.onsuccess=()=>resolve(req.result as SlotRecord|undefined);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close()})}
async function readSlots():Promise<(SlotRecord|undefined)[]>{return Promise.all([1,2,3].map(readSlot))}
async function writeSlot(id:number,save:Save){const db=await openSaveDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(SLOT_STORE,'readwrite');tx.objectStore(SLOT_STORE).put({id,updatedAt:Date.now(),save} satisfies SlotRecord);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function removeSlot(id:number){const db=await openSaveDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(SLOT_STORE,'readwrite');tx.objectStore(SLOT_STORE).delete(id);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}

function sportIconId(sport:string){const key=sport.toLowerCase().replace(/\s+/g,'');const map:Record<string,string>={athletics:'athletics',swimming:'swimming',gymnastics:'gymnastics',cycling:'cycling',fencing:'fencing',weightlifting:'weightlifting',wrestling:'wrestling',shooting:'shooting',tennis:'tennis',rowing:'rowing',sailing:'sailing',archery:'archery',equestrian:'equestrian',golf:'golf',football:'football',rugbyunion:'rugby',waterpolo:'waterpolo',polo:'demo_polo',boxing:'boxing',diving:'diving',basketball:'basketball',volleyball:'volleyball',judo:'judo'};return map[key]||'athletics'}

export default function App(){
  const [slots,setSlots]=useState<(SlotRecord|undefined)[]>([]);
  const [active,setActive]=useState<SlotRecord|null>(null);
  const [loading,setLoading]=useState(true);
  const refresh=async()=>{setLoading(true);try{setSlots(await readSlots())}finally{setLoading(false)}};
  useEffect(()=>{void refresh()},[]);
  async function openSlot(id:number){const found=await readSlot(id);const record=found||{id,updatedAt:Date.now(),save:initial()};if(!found)await writeSlot(id,record.save);setActive(record)}
  async function deleteSlot(id:number){if(!confirm(`Delete Olympic history in Slot ${id}?`))return;await removeSlot(id);await refresh()}
  if(active)return <Game slotId={active.id} initialSave={active.save} onExit={()=>{setActive(null);void refresh()}}/>;
  return <div className={styles.slotHome}><div className={styles.slotHero}><span className={styles.kicker}>OLYMPIC</span><h1>Chronicles</h1><p>Begin in Athens 1896 and build a living history of champions, records and nations across generations.</p></div><section className={styles.slotSection}><span className={styles.eyebrow}>Choose a history</span><h2>Three Olympic timelines</h2>{loading?<p>Loading histories…</p>:<div className={styles.slotGrid}>{[1,2,3].map(id=>{const slot=slots[id-1];return <article className={styles.slotCard} key={id}><small>SAVE SLOT {id}</small>{slot?<><h3>{slot.save.host} {slot.save.olympicYear}</h3><p>{slot.save.year} · {slot.save.history.length} completed Games</p><div className={styles.slotStats}><span><b>{slot.save.ledger.filter(r=>r.medal==='gold').length}</b> champions</span><span><b>{Object.keys(slot.save.records).length}</b> records</span></div><div className={styles.slotActions}><button className={styles.primary} onClick={()=>void openSlot(id)}>Load history</button><button className={styles.danger} onClick={()=>void deleteSlot(id)}>Delete</button></div></>:<><h3>Empty timeline</h3><p>The flame has not yet been lit.</p><button className={styles.primary} onClick={()=>void openSlot(id)}>Start in 1896</button></>}</article>})}</div>}</section></div>
}

function Medals({rows}:{rows:[string,{gold:number;silver:number;bronze:number}][]}){return <section className={styles.section}><h2>Full medal table</h2><div className={styles.dataTable}><div className={styles.tableHead}><span>NATION</span><b>GOLD</b><b>SILVER</b><b>BRONZE</b><b>TOTAL</b></div>{rows.map(([c,m],i)=><div key={c}><span><b>{i+1}</b> <Flag code={c} size={24}/> {NAMES[c]}</span><em>{m.gold}</em><em>{m.silver}</em><em>{m.bronze}</em><em>{m.gold+m.silver+m.bronze}</em></div>)}</div></section>}
function AllResults({events}:{events:FinalEvent[]}){return <section className={styles.section}><h2>All Olympic finals</h2>{Array.from(new Set(events.map(e=>e.sport))).map(s=><div className={styles.allSport} key={s}><h3>{s}</h3>{events.filter(e=>e.sport===s).map(e=><div key={e.id}><b>{e.name}</b><span>{e.resolved?`${e.results[0]?.name} (${e.results[0]?.country}) — ${e.results[0]?.mark}${e.results[0]?.record?' · '+e.results[0].record:''}`:`Day ${e.day} · Pending`}</span></div>)}</div>)}</section>}
function Preview({event,athletes,year,close,simulate,view}:{event:FinalEvent;athletes:Athlete[];year:number;close:()=>void;simulate:()=>void;view:()=>void}){const f=event.contenders.map(id=>athletes.find(a=>a.id===id)!).filter(Boolean);return <div className={styles.modalBackdrop}><div className={styles.modal}><button className={styles.close} onClick={close}>×</button><span className={styles.eyebrow}>STAR EVENT · {event.sport}</span><div className={styles.modalTitle}><SportIcon id={sportIconId(event.sport)} size={42}/><h2>{event.name}</h2></div><p className={styles.previewStory}>{event.hook}</p><div className={styles.liveRows}>{f.map(a=><div key={a.id}><Flag code={a.country} size={28}/><b>{a.name}</b><span>{a.country} · age {age(a,year)} · {a.trait}</span><strong>{a.overall}</strong></div>)}</div><div className={styles.actionRow}><button className={styles.secondary} onClick={simulate}>Simulate</button><button className={styles.primary} onClick={view}>View event →</button></div></div></div>}

function Watch({event,athletes,payload,step,setStep,close}:{event:FinalEvent;athletes:Athlete[];payload:WatchPayload;step:number;setStep:(n:number)=>void;close:()=>void}){
  const f=event.contenders.map(id=>athletes.find(a=>a.id===id)!).filter(Boolean);
  const max=payload.type==='race'?payload.checkpoints.length-1:payload.type==='field'?5:payload.type==='vertical'?payload.heights.length-1:payload.type==='judged'?payload.rounds.length-1:payload.type==='fencing'?payload.bouts.length-1:payload.type==='weightlifting'?5:payload.type==='shooting'?payload.rounds.length-1:payload.type==='combat'?payload.rounds.length-1:payload.type==='team'?payload.periods.length-1:payload.type==='golf'?payload.rounds.length-1:payload.races.length-1;
  const done=step>max;
  return <div className={styles.modalBackdrop}><div className={`${styles.modal} ${styles.watchModal}`}><span className={styles.eyebrow}>LIVE · {event.sport}</span><div className={styles.modalTitle}><SportIcon id={sportIconId(event.sport)} size={42}/><h2>{event.name}</h2></div>{!done&&<WatchBody event={event} athletes={f} payload={payload} step={step}/>} {done?<button className={styles.primary} onClick={close}>See final results →</button>:<button className={styles.primary} onClick={()=>setStep(step+1)}>{step===max?'Reveal result':'Next stage'} →</button>}</div></div>
}
function WatchBody({event,athletes,payload,step}:{event:FinalEvent;athletes:Athlete[];payload:WatchPayload;step:number}){
  if(payload.type==='race'){const c=payload.checkpoints[step];const leader=Math.max(...c.values);return <><div className={styles.liveClock}>{c.label}</div><div className={styles.liveRows}>{athletes.map((a,i)=><div className={c.values[i]===leader?styles.liveLeader:undefined} key={a.id}><Flag code={a.country} size={26}/><b>{a.name}</b><span>{a.country}</span><strong>{c.finished?(event.results.find(r=>r.athleteId===a.id)?.mark||`${c.values[i].toFixed(1)}%`):`${c.values[i].toFixed(1)}%`}</strong><div className={styles.track}><i style={{width:`${c.values[i]}%`}}/></div></div>)}</div></>}
  if(payload.type==='field'){const totals=athletes.map((_,ai)=>Math.max(0,...payload.attempts[ai].slice(0,step+1).filter((v):v is number=>v!==null)));const leader=totals.indexOf(Math.max(...totals));return <AttemptTable athletes={athletes} leaderIndex={leader} headers={Array.from({length:6},(_,i)=>`ATT ${i+1}`)} cells={(ai,ri)=>ri<=step?(payload.attempts[ai]?.[ri]===null?'FOUL':`${(payload.attempts[ai]?.[ri]??0).toFixed(2)}${payload.unit}`):'—'} total={ai=>`${totals[ai].toFixed(2)}${payload.unit}`}/>}
  if(payload.type==='vertical'){const totals=athletes.map((_,ai)=>payload.attempts[ai].slice(0,step+1).reduce((n,v)=>n+(v==='O'?1:0),0));const leader=totals.indexOf(Math.max(...totals));return <AttemptTable athletes={athletes} leaderIndex={leader} headers={payload.heights.map(h=>`${h.toFixed(2)}m`)} cells={(ai,ri)=>ri<=step?payload.attempts[ai]?.[ri]||'—':'—'}/>}
  if(payload.type==='judged'){const totals=athletes.map((_,ai)=>payload.rounds.slice(0,step+1).reduce((sum,r)=>sum+(r[ai]||0),0));const leader=totals.indexOf(Math.max(...totals));return <AttemptTable athletes={athletes} leaderIndex={leader} headers={payload.rounds.map((_,i)=>`RD${i+1}`)} cells={(ai,ri)=>ri<=step?(payload.rounds[ri]?.[ai]??0).toFixed(2):'—'} total={ai=>totals[ai].toFixed(2)}/>}
  if(payload.type==='fencing'){const b=payload.bouts[step],left=athletes.find(a=>a.id===b.leftId),right=athletes.find(a=>a.id===b.rightId);return <div className={styles.bout}><small>{b.stage}</small><div><span><Flag code={left?.country||''} size={38}/><b>{left?.name}</b></span><strong>{b.left}</strong><em>touches</em></div><i>vs</i><div><span><Flag code={right?.country||''} size={38}/><b>{right?.name}</b></span><strong>{b.right}</strong><em>touches</em></div></div>}
  if(payload.type==='weightlifting'){const totals=athletes.map((_,ai)=>{const shown=payload.lifts[ai].slice(0,step+1);const sn=Math.max(0,...shown.filter(x=>x.phase.startsWith('Snatch')&&x.success).map(x=>x.weight));const cj=Math.max(0,...shown.filter(x=>x.phase.startsWith('C&J')&&x.success).map(x=>x.weight));return sn+cj});const leader=totals.indexOf(Math.max(...totals));return <AttemptTable athletes={athletes} leaderIndex={leader} headers={['SN 1','SN 2','SN 3','C&J 1','C&J 2','C&J 3']} cells={(ai,ri)=>ri<=step?(payload.lifts[ai]?.[ri]?`${payload.lifts[ai][ri].weight}kg ${payload.lifts[ai][ri].success?'✓':'✕'}`:'—'):'—'} total={ai=>`${totals[ai]}kg`}/>}
  if(payload.type==='shooting'){const totals=athletes.map((_,ai)=>payload.rounds.slice(0,step+1).reduce((sum,r)=>sum+(r[ai]||0),0));const leader=totals.indexOf(Math.max(...totals));return <AttemptTable athletes={athletes} leaderIndex={leader} headers={payload.rounds.map((_,i)=>`RD${i+1}`)} cells={(ai,ri)=>ri<=step?(payload.rounds[ri]?.[ai]??0).toFixed(payload.unit==='points'&&event.format==='shootingPrecision'?1:0):'—'} total={ai=>totals[ai].toFixed(event.format==='shootingPrecision'?1:0)}/>}
  if(payload.type==='combat')return <AttemptTable athletes={athletes} headers={payload.labels} cells={(ai,ri)=>ri<=step?String(payload.rounds[ri]?.[ai]||0):'—'} total={(ai)=>String(payload.rounds.slice(0,step+1).reduce((s,r)=>s+(r[ai]||0),0))}/>;
  if(payload.type==='team'){const p=payload.periods[step];return <div className={styles.teamWatch}><div><Flag code={athletes[0]?.country} size={42}/><h3>{athletes[0]?.country}</h3><strong>{p[0]}</strong></div><span>{payload.labels[step]}</span><div><Flag code={athletes[1]?.country} size={42}/><h3>{athletes[1]?.country}</h3><strong>{p[1]}</strong></div></div>}
  if(payload.type==='golf')return <AttemptTable athletes={athletes} headers={payload.rounds.map((_,i)=>`RD${i+1}`)} cells={(ai,ri)=>ri<=step?String(payload.rounds[ri]?.[ai]):'—'} total={(ai)=>String(payload.rounds.slice(0,step+1).reduce((s,r)=>s+(r[ai]||0),0))}/>;
  return <AttemptTable athletes={athletes} headers={payload.races.map((_,i)=>`RACE ${i+1}`)} cells={(ai,ri)=>ri<=step?`${payload.races[ri]?.[ai]}th`:'—'} total={(ai)=>String(payload.races.slice(0,step+1).reduce((s,r)=>s+(r[ai]||0),0))}/>;
}
function AttemptTable({athletes,headers,cells,total,leaderIndex}:{athletes:Athlete[];headers:string[];cells:(athlete:number,round:number)=>string;total?:(athlete:number)=>string;leaderIndex?:number}){return <div className={styles.attemptTable}><div className={styles.attemptHead}><span>ATHLETE</span>{headers.map(h=><b key={h}>{h}</b>)}{total&&<b>TOTAL</b>}</div>{athletes.map((a,ai)=><div className={ai===leaderIndex?styles.tableLeader:undefined} key={a.id}><span><Flag code={a.country} size={23}/><b>{a.name}</b></span>{headers.map((_,ri)=><em key={ri}>{cells(ai,ri)}</em>)}{total&&<strong>{total(ai)}</strong>}</div>)}</div>}
function ResultModal({event,close}:{event:FinalEvent;close:()=>void}){return <div className={styles.modalBackdrop}><div className={styles.modal}><button className={styles.close} onClick={close}>×</button><span className={styles.eyebrow}>FINAL RESULT · {event.sport}</span><div className={styles.modalTitle}><SportIcon id={sportIconId(event.sport)} size={42}/><h2>{event.name}</h2></div><div className={styles.reveal}><small>OLYMPIC CHAMPION</small><h3>{event.results[0]?.name}</h3><div className={styles.championFlag}><Flag code={event.results[0]?.country} size={46}/>{NAMES[event.results[0]?.country]}</div><b>{event.results[0]?.mark} {event.results[0]?.record&&<strong className={styles.recordBadge}>{event.results[0].record==='IR'?'INAUGURAL RECORD':'NEW WR!'}</strong>}</b><p>{event.headline}</p><div className={styles.finalPodium}>{event.results.map(r=><div key={r.medal}><span>{r.medal.toUpperCase()}</span><Flag code={r.country} size={24}/><b>{r.name}</b><em>{r.mark}{r.record&&<strong className={styles.recordBadge}>{r.record}</strong>}</em></div>)}</div></div></div></div>}

function Almanac({save,tab,setTab,sport,setSport,sports,metric,setMetric}:{save:Save;tab:AlmanacTab;setTab:(t:AlmanacTab)=>void;sport:string;setSport:(s:string)=>void;sports:string[];metric:'medals'|'golds'|'medalsCum'|'goldsCum';setMetric:(m:'medals'|'golds'|'medalsCum'|'goldsCum')=>void}){
  const filtered=sport==='All'?save.ledger:save.ledger.filter(r=>r.sport===sport);
  const athleteRows=useMemo(()=>{const m=new Map<string,{name:string;country:string;sport:string;years:Set<number>;gold:number;silver:number;bronze:number}>();for(const a of save.appearances.filter(a=>sport==='All'||a.sport===sport)){const x=m.get(a.athleteId)||{name:a.name,country:a.country,sport:a.sport,years:new Set<number>(),gold:0,silver:0,bronze:0};x.years.add(a.year);m.set(a.athleteId,x)}for(const r of filtered){if(!r.athleteId)continue;const x=m.get(r.athleteId)||{name:r.name,country:r.country,sport:r.sport,years:new Set<number>(),gold:0,silver:0,bronze:0};x.years.add(r.year);x[r.medal]++;m.set(r.athleteId,x)}return [...m.values()].sort((a,b)=>b.years.size-a.years.size||(b.gold+b.silver+b.bronze)-(a.gold+a.silver+a.bronze)||b.gold-a.gold)},[filtered,save.appearances,sport]);
  const countryRows=useMemo(()=>{const m=new Map<string,{country:string;years:Set<number>;gold:number;silver:number;bronze:number}>();for(const r of filtered){const x=m.get(r.country)||{country:r.country,years:new Set<number>(),gold:0,silver:0,bronze:0};x.years.add(r.year);x[r.medal]++;m.set(r.country,x)}return [...m.values()].sort((a,b)=>b.gold-a.gold||(b.gold+b.silver+b.bronze)-(a.gold+a.silver+a.bronze))},[filtered]);
  const records=Object.values(save.records).filter(r=>sport==='All'||r.sport===sport).sort((a,b)=>a.sport.localeCompare(b.sport)||a.event.localeCompare(b.event));
  return <main className={styles.layout}><section className={styles.section}><span className={styles.eyebrow}>Historical archive</span><h1>Olympic Almanac</h1><div className={styles.subTabs}>{(['athletes','countries','records','trends'] as AlmanacTab[]).map(t=><button className={tab===t?styles.navActive:''} key={t} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>)}</div><div className={styles.filters}><label>SPORT<select value={sport} onChange={e=>setSport(e.target.value)}>{sports.map(s=><option key={s}>{s}</option>)}</select></label>{tab==='trends'&&<label>METRIC<select value={metric} onChange={e=>setMetric(e.target.value as typeof metric)}><option value="medals">Medals by Games</option><option value="golds">Golds by Games</option><option value="medalsCum">Cumulative medals</option><option value="goldsCum">Cumulative golds</option></select></label>}</div>{tab==='athletes'&&<AlmanacAthletes rows={athleteRows}/>} {tab==='countries'&&<AlmanacCountries rows={countryRows}/>} {tab==='records'&&<RecordsTable records={records}/>} {tab==='trends'&&<TrendChart ledger={filtered} metric={metric}/>}</section></main>
}
function AlmanacAthletes({rows}:{rows:{name:string;country:string;sport:string;years:Set<number>;gold:number;silver:number;bronze:number}[]}){return <div className={styles.dataTable}><div className={styles.tableHead}><span>ATHLETE</span><b>GAMES</b><b>GOLD</b><b>SILVER</b><b>BRONZE</b><b>TOTAL</b></div>{rows.map((r,i)=><div key={`${r.name}-${i}`}><span><Flag code={r.country} size={24}/><span><strong>{r.name}</strong><small>{r.country} · {r.sport}</small></span></span><em>{r.years.size}</em><em>{r.gold}</em><em>{r.silver}</em><em>{r.bronze}</em><em>{r.gold+r.silver+r.bronze}</em></div>)}</div>}
function AlmanacCountries({rows}:{rows:{country:string;years:Set<number>;gold:number;silver:number;bronze:number}[]}){return <div className={styles.dataTable}><div className={styles.tableHead}><span>COUNTRY</span><b>GAMES</b><b>GOLD</b><b>SILVER</b><b>BRONZE</b><b>TOTAL</b></div>{rows.map(r=><div key={r.country}><span><Flag code={r.country} size={24}/><strong>{NAMES[r.country]}</strong></span><em>{r.years.size}</em><em>{r.gold}</em><em>{r.silver}</em><em>{r.bronze}</em><em>{r.gold+r.silver+r.bronze}</em></div>)}</div>}
function RecordsTable({records}:{records:RecordEntry[]}){return <div className={styles.recordsGrid}>{records.map(r=><article key={r.key}><span>{r.sport} · {r.gender==='M'?'MEN':'WOMEN'}</span><h3>{r.event}</h3><b>{r.mark}</b><div><Flag code={r.country} size={25}/><strong>{r.name}</strong></div><small>{r.host} {r.year}</small></article>)}</div>}
function TrendChart({ledger,metric}:{ledger:LedgerResult[];metric:'medals'|'golds'|'medalsCum'|'goldsCum'}){
  const years=[...new Set(ledger.map(r=>r.year))].sort();const totals=new Map<string,number>();for(const r of ledger)totals.set(r.country,(totals.get(r.country)||0)+(metric.includes('gold')?(r.medal==='gold'?1:0):1));const countries=[...totals.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);const series=countries.map(country=>{let cum=0;return{country,values:years.map(year=>{const val=ledger.filter(r=>r.country===country&&r.year===year&&(metric.includes('gold')?r.medal==='gold':true)).length;if(metric.includes('Cum')){cum+=val;return cum}return val})}});const max=Math.max(1,...series.flatMap(s=>s.values));const width=900,height=360,pad=45;return <div className={styles.chartPanel}>{years.length?<><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Olympic medal trend chart"><line x1={pad} y1={height-pad} x2={width-pad} y2={height-pad}/><line x1={pad} y1={pad} x2={pad} y2={height-pad}/>{series.map((s,si)=>{const points=s.values.map((v,i)=>`${pad+(i/(Math.max(1,years.length-1)))*(width-pad*2)},${height-pad-(v/max)*(height-pad*2)}`).join(' ');return <polyline key={s.country} points={points} className={styles[`chartLine${si}`]}/>})}{years.map((y,i)=><text key={y} x={pad+(i/(Math.max(1,years.length-1)))*(width-pad*2)} y={height-15} textAnchor="middle">{y}</text>)}</svg><div className={styles.chartLegend}>{series.map((s,i)=><span key={s.country} className={styles[`chartLegend${i}`]}><Flag code={s.country} size={21}/>{NAMES[s.country]}</span>)}</div></>:<p>No completed results yet. Finish events to populate the historical trend.</p>}</div>}
