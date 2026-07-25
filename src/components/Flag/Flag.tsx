import { useState } from 'react';

interface Props { code:string; size?:number; className?:string }

const ISO2:Record<string,string>={
  USA:'us',GBR:'gb',FRA:'fr',GER:'de',SWE:'se',FIN:'fi',ITA:'it',GRE:'gr',HUN:'hu',AUS:'au',CAN:'ca',JPN:'jp',CHN:'cn',RUS:'ru',NED:'nl',BEL:'be',DEN:'dk',NOR:'no',ESP:'es',BRA:'br',ARG:'ar',CUB:'cu',MEX:'mx',IND:'in',KOR:'kr',KEN:'ke',ETH:'et',RSA:'za',NZL:'nz',JAM:'jm',TUR:'tr',POL:'pl',CZE:'cz',SUI:'ch',AUT:'at',IRL:'ie'
};

export default function Flag({code,size=24,className}:Props){
  const [failed,setFailed]=useState(false);
  const iso=ISO2[code];
  const height=Math.round(size*2/3);
  if(!iso||failed){
    return <span className={className} style={{display:'inline-grid',placeItems:'center',width:size,height,background:'#eef1f3',border:'1px solid #c8ced3',borderRadius:2,fontSize:Math.max(8,size*.3),fontWeight:700,color:'#33404a',verticalAlign:'middle'}}>{code}</span>;
  }
  return <img
    className={className}
    src={`https://flagcdn.com/w80/${iso}.png`}
    srcSet={`https://flagcdn.com/w160/${iso}.png 2x`}
    width={size}
    height={height}
    alt={`${code} flag`}
    loading="lazy"
    referrerPolicy="no-referrer"
    onError={()=>setFailed(true)}
    style={{display:'inline-block',objectFit:'cover',borderRadius:2,boxShadow:'0 0 0 1px rgba(0,0,0,.16)',verticalAlign:'middle'}}
  />;
}
