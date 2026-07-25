interface Props { code:string; size?:number; className?:string }
const C:Record<string,string[]>={
USA:['#b22234','#fff','#3c3b6e'],GBR:['#012169','#fff','#c8102e'],FRA:['#002395','#fff','#ed2939'],GER:['#000','#dd0000','#ffce00'],SWE:['#006aa7','#fecc00'],FIN:['#fff','#003580'],ITA:['#009246','#fff','#ce2b37'],GRE:['#0d5eaf','#fff'],HUN:['#ce2939','#fff','#477050'],AUS:['#012169','#fff','#e4002b'],CAN:['#d80621','#fff'],JPN:['#fff','#bc002d'],CHN:['#de2910','#ffde00'],RUS:['#fff','#0039a6','#d52b1e'],NED:['#ae1c28','#fff','#21468b'],BEL:['#000','#ffd90c','#ef3340'],DEN:['#c60c30','#fff'],NOR:['#ba0c2f','#fff','#00205b'],ESP:['#aa151b','#f1bf00'],BRA:['#009c3b','#ffdf00','#002776'],ARG:['#74acdf','#fff'],CUB:['#002a8f','#fff','#cf142b'],MEX:['#006847','#fff','#ce1126'],IND:['#ff9933','#fff','#138808'],KOR:['#fff','#cd2e3a','#0047a0'],KEN:['#000','#bb0000','#006600'],ETH:['#078930','#fcd116','#da121a'],RSA:['#007749','#ffb81c','#de3831'],NZL:['#00247d','#cc142b'],JAM:['#009b3a','#fed100','#000'],TUR:['#e30a17','#fff'],POL:['#fff','#dc143c'],CZE:['#fff','#d7141a','#11457e'],SUI:['#d52b1e','#fff'],AUT:['#ed2939','#fff'],IRL:['#169b62','#fff','#ff883e']};
function stripes(code:string,colors:string[]){
 const vertical=['FRA','ITA','BEL','MEX','IRL'].includes(code);
 if(vertical)return colors.slice(0,3).map((c,i)=><rect key={i} x={i*10} width="10" height="20" fill={c}/>);
 const h=20/colors.length;return colors.map((c,i)=><rect key={i} y={i*h} width="30" height={h+.1} fill={c}/>);
}
export default function Flag({code,size=24,className}:Props){const c=C[code]||['#243746','#eee','#b8893b'];return <svg width={size} height={size*2/3} viewBox="0 0 30 20" className={className} style={{display:'inline-block',verticalAlign:'-2px',borderRadius:2,boxShadow:'0 0 0 1px rgba(0,0,0,.14)'}} aria-label={`${code} flag`}>
 {stripes(code,c)}
 {code==='JPN'&&<circle cx="15" cy="10" r="5.2" fill="#bc002d"/>}
 {code==='CHN'&&<text x="7" y="9" fontSize="7" fill="#ffde00">★</text>}
 {code==='CAN'&&<text x="15" y="14" fontSize="10" fill="#d80621" textAnchor="middle">◆</text>}
 {code==='BRA'&&<><path d="M15 2 L28 10 L15 18 L2 10Z" fill="#ffdf00"/><circle cx="15" cy="10" r="4.3" fill="#002776"/></>}
 {code==='SUI'&&<><rect x="12" y="4" width="6" height="12" fill="#fff"/><rect x="9" y="7" width="12" height="6" fill="#fff"/></>}
 {code==='TUR'&&<><circle cx="12" cy="10" r="5" fill="#fff"/><circle cx="14" cy="10" r="4" fill="#e30a17"/><text x="18" y="12" fontSize="6" fill="#fff">★</text></>}
 {code==='JAM'&&<><path d="M0 0L30 20M30 0L0 20" stroke="#fed100" strokeWidth="4"/><path d="M0 0L13 10L0 20Z" fill="#000"/><path d="M30 0L17 10L30 20Z" fill="#000"/></>}
 {code==='USA'&&<rect width="12" height="10.8" fill="#3c3b6e"/>}
 {code==='GRE'&&<><rect x="0" y="0" width="12" height="11" fill="#0d5eaf"/><path d="M6 0v11M0 5.5h12" stroke="#fff" strokeWidth="2"/></>}
 {code==='NOR'&&<><path d="M9 0v20M0 10h30" stroke="#fff" strokeWidth="5"/><path d="M9 0v20M0 10h30" stroke="#00205b" strokeWidth="2.5"/></>}
 {code==='DEN'&&<path d="M10 0v20M0 10h30" stroke="#fff" strokeWidth="3"/>}
 {code==='FIN'&&<path d="M10 0v20M0 10h30" stroke="#003580" strokeWidth="4"/>}
 {code==='SWE'&&<path d="M10 0v20M0 10h30" stroke="#fecc00" strokeWidth="4"/>}
 </svg>}
