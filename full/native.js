/* Trace native screens. Progress, hobby pages, Trace Skills, Trace Vault, Trace Tailor, portfolio and transcript.
   Real state (saved in this browser), real file uploads, real XP, levels, streaks, badges and sharing. */
(function(){
'use strict';
const IMG = '../app/img/';
const $ = (q,el=document)=>el.querySelector(q);
const $$ = (q,el=document)=>[...el.querySelectorAll(q)];
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = n => Number(n).toLocaleString('en-SG');
const sleep = ms => new Promise(r=>setTimeout(r,ms));

/* ---------------- icons ---------------- */
const P = {
  palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6h1.9A5.6 5.6 0 0 0 22 11c0-5-4.5-9-10-9z"/>',
  cube:'<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  piano:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 5v8M10 5v8M14 5v8M18 5v8M6 13v6M10 13v6M14 13v6M18 13v6"/>',
  note:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  ball:'<circle cx="12" cy="12" r="10"/><path d="M4.9 4.9c3.9 3.9 3.9 10.3 0 14.2M19.1 4.9c-3.9 3.9-3.9 10.3 0 14.2M2 12h20M12 2v20"/>',
  camera:'<path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5z"/><circle cx="12" cy="13" r="3.5"/>',
  film:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 8h5M2 16h5M17 8h5M17 16h5"/>',
  brush:'<path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
  pot:'<path d="M7 4h10M8 4c0 3-3 4-3 9a7 7 0 0 0 14 0c0-5-3-6-3-9"/><path d="M6 14h12"/>',
  guitar:'<path d="M20 4l-4.5 4.5M17 2l5 5"/><path d="M14 9.5a4 4 0 0 0-5.6 0L7 11a4 4 0 0 1-2.6 1.1A3 3 0 0 0 3 17l4 4a3 3 0 0 0 4.9-1.4A4 4 0 0 1 13 17l1.5-1.4a4 4 0 0 0 0-5.6z"/><circle cx="9.5" cy="14.5" r="1.5"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M21 5h-4"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  chev:'<path d="M9 18l6-6-6-6"/>',
  chevd:'<path d="M6 9l6 6 6-6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.5 1.5 2.8 2.5 2.8z"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0z"/>',
  star:'<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9L17 22l-5-3-5 3 1.5-9.1"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  sprout:'<path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  dots:'<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
  audio:'<path d="M3 14h3l5 4V6L6 10H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  play:'<polygon points="6 4 20 12 6 20 6 4"/>',
  send:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  pen:'<path d="M12 19l7-7 3 3-7 7z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  metro:'<path d="M12 11.4l7.5-7.5M7 20l3-16h4l3 16zM8.3 13.5h7.4"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  zap:'<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
};
const ic = (n, cls='', sw=2) => `<svg class="${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const BACK = '<img src="../assets/back_lg.svg" alt="">';
const IG = '<svg viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#e1306c"/></svg>';
const PIN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#e60023"/><path fill="#fff" d="M12.3 5C8.4 5 6.5 7.8 6.5 10.1c0 1.4.5 2.7 1.7 3.1.2.1.4 0 .4-.2l.2-.7c.1-.2 0-.3-.1-.5-.3-.4-.6-.9-.6-1.7 0-2.2 1.6-4.1 4.3-4.1 2.3 0 3.6 1.4 3.6 3.3 0 2.5-1.1 4.6-2.7 4.6-.9 0-1.6-.7-1.4-1.7.3-1.1.8-2.3.8-3.1 0-.7-.4-1.3-1.2-1.3-.9 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4l-1.1 4.7c-.3 1.4 0 3.1 0 3.3 0 .1.1.1.2 0 .1-.1 1.1-1.4 1.5-2.7l.6-2.3c.3.6 1.2 1.1 2.1 1.1 2.8 0 4.7-2.6 4.7-6C18 7.4 15.8 5 12.3 5z"/></svg>';
const MARK = '<img src="../assets/mark_lg.svg" alt="">';

/* ---------------- seed data ---------------- */
const TODAY = '17 Sep 2026';   // Thu, two days before the free Saturday (Sat 19 Sep)
const HOBBY_SEED = () => ({
  art: { key:'art', name:'Digital Art', cat:'ARTS', icon:'palette', hdr:'hdr_art.jpg', unit:'xp', xp:1240, pending:120,
    levels:[{n:'1',t:'Level 1',s:'1 workshop',at:0},{n:'2',t:'Level 2',s:'3 workshops',at:1000},{n:'3',t:'Level 3',s:'6 workshops',at:1500},{n:'4',t:'Level 4',s:'9 workshops',at:2000},{n:'5',t:'Level 5',s:'Virtuoso',at:2600}],
    titles:['','Starter','Explorer','Practitioner','Creator','Virtuoso'], badgePrefix:'L', hours:67, wsCount:8,
    detect:{ icon:'image', title:'Vault upload detected', desc:'New artwork uploaded today from your ArtHaus workshop last Saturday. Confirm it so the XP counts.', btn:'Confirm artwork', done:'Your artwork is logged under Digital Art and saved in your Vault.' },
    manual:{ kinds:[['Workshop',80],['Practice at home',40],['Finished a piece',120]] },
    streak:{ title:'Creative streak', done:6, of:8, unit:'uploads', tag:'2 weeks left', next:'Your next beginner workshop is on Sat 26 Sep.', week:3, weeks:4 },
    badges:[ {n:'First Stroke',s:'Upload your first piece',i:'pen',rule:'art1'},{n:'Regular',s:'3 workshops attended',i:'palette',rule:'ws3'},{n:'Virtuoso',s:'Complete 10 pieces',i:'trophy',rule:'art10'},{n:'Streak Keeper',s:'8-week creative streak',i:'flame',rule:'streak'} ],
    milestones:[ {t:'City Lights series',s:'6 Vault works, a milestone',i:'star',d:'A six-piece series of night scenes, started after your second ArtHaus workshop. Trace grouped them because they share a theme and were uploaded within three weeks.'},{t:'ArtHaus beginner course',s:'3 workshops, workshop verified',i:'award',d:'ArtHaus Studio confirmed your attendance at all three beginner workshops. This counts as verified evidence in your Skills Transcript.'} ],
    skills:[ {n:'Composition',ev:4,cat:'creative',src:'ArtHaus workshop series',dims:{Creativity:1}}, {n:'Digital brush control',ev:3,cat:'knowledge',src:'3 workshops, 2 months',dims:{Mastery:1}}, {n:'Colour theory',ev:1,cat:'knowledge',src:'1 workshop',dims:{Creativity:.5,Mastery:.5}}, {n:'Creative confidence',ev:6,cat:'mastery',src:'6 Vault works shared',dims:{Discipline:.5,Creativity:.5}} ],
    radar:{Creativity:.82,Discipline:.66,Communication:.55,Teamwork:.42,Leadership:.38,Mastery:.7},
    workshops:[ {id:'w1',t:'Beginner digital-art workshop',s:'ArtHaus Studio, Sat 12 Sep, 2pm to 5pm',detected:true},{id:'w2',t:'Watercolour taster',s:'Community Arts Hub, Sun 13 Sep, 11am to 12:30pm'},{id:'w3',t:'Life drawing',s:'Telok Kurau Studios, Sat 5 Sep, 4:30pm'} ],
    endorse:[ {id:'meiling',n:'Ms Mei Ling',r:'Instructor, ArtHaus Studio, 2026',a:'a_meiling.jpg',st:'none',q:'Sarah asks good questions and turns feedback into her next piece within a week.'}, {id:'ryan',n:'Ryan Koh',r:'Workshop partner, 2026',a:'a_ryan.jpg',st:'none',q:'Generous in group critiques and always shares her brush settings.'}, {id:'priya',n:'Priya, workshop instructor',r:'ArtHaus Studio',a:'a_priya.jpg',st:'received',q:'Picks up new techniques fast and always finishes what she starts.'}, {id:'marcus',n:'Marcus, Digital Art Circle',r:'Peer reviewer',a:'a_marcus.jpg',st:'received',q:'Gives thoughtful feedback in every group critique.'} ]
  },
  piano: { key:'piano', name:'Piano', cat:'MUSIC', icon:'piano', hdr:'hdr_piano.jpg', unit:'xp', xp:2150, pending:80,
    levels:[{n:'1',t:'Grade 1',s:'2023',at:0},{n:'2',t:'Grade 2',s:'2024',at:1200},{n:'3',t:'Grade 3',s:'Aug 2026',at:1800},{n:'4',t:'Grade 4',s:'Feb 2027',at:2400},{n:'5',t:'Grade 5',s:'Diploma',at:3000}],
    titles:['','','','merit','',''], badgePrefix:'G', subFixed:'ABRSM Grade 3, merit', hours:48, wsCount:12,
    detect:{ icon:'pin', title:'Practice check-in detected', desc:'Check-in at NAFA Keys, Bras Basah, today 6:00 to 7:00pm.', btn:'Confirm practice', done:'Your practice is logged under Piano and counts towards your streak.' },
    manual:{ kinds:[['Lesson',80],['Practice',40],['Performance',150]] },
    streak:{ title:'Practice streak', done:9, of:12, unit:'practices', tag:'18 days left', next:'Two are booked with NAFA Keys this week.', week:3, weeks:4 },
    badges:[ {n:'First Note',s:'Log your first practice',i:'note',rule:'on'},{n:'Grade Setter',s:'Reach Grade 3',i:'award',rule:'on'},{n:'Virtuoso',s:'Record 10 pieces',i:'trophy',rule:'rec10'},{n:'Metronome',s:'12-week streak',i:'metro',rule:'streak'} ],
    milestones:[ {t:'Grade 3, merit',s:'ABRSM, Aug 2026, verified',i:'award',d:'ABRSM result linked through your exam number. Verified, so it shows a tick on your transcript.'},{t:'First recital',s:'NAFA Keys, Dec 2025',i:'star',d:'You played two pieces at the NAFA Keys winter recital. The recording is in your Vault.'} ],
    skills:[ {n:'Practice discipline',ev:7,cat:'mastery',src:'9 practices this month',dims:{Discipline:1}}, {n:'Sight reading',ev:4,cat:'knowledge',src:'Piano, Grade 3',dims:{Mastery:1}}, {n:'Performance',ev:3,cat:'creative',src:'First recital',dims:{Creativity:.6,Communication:.4}}, {n:'Ensemble playing',ev:2,cat:'interpersonal',src:'Recital accompanist',dims:{Teamwork:1}} ],
    radar:{Creativity:.6,Discipline:.9,Communication:.5,Teamwork:.45,Leadership:.35,Mastery:.78},
    workshops:[ {id:'p1',t:'Practice at NAFA Keys',s:'Bras Basah, today 6:00 to 7:00pm',detected:true},{id:'p2',t:'Lesson with Ms Priya Nair',s:'Tue 15 Sep, 5pm'} ],
    endorse:[ {id:'nair',n:'Ms Priya Nair',r:'Piano teacher, 2018 to 2026',a:'a_priyanair.jpg',st:'none',q:'Eight years of steady, careful practice. Sarah prepares for every lesson.'}, {id:'chloe',n:'Chloe Sim',r:'Recital accompanist, 2025',a:'a_chloe.jpg',st:'none',q:'Listens closely and adjusts her tempo to the group.'} ]
  },
  bball: { key:'bball', name:'Basketball', cat:'SPORTS', icon:'ball', hdr:'hdr_bball.jpg', unit:'hours', xp:34, pending:2,
    levels:[{n:'3',t:'Level 3',s:'30 hours',at:30},{n:'4',t:'Level 4',s:'40 hours',at:40},{n:'5',t:'Level 5',s:'50 hours',at:50},{n:'6',t:'Level 6',s:'60 hours',at:60},{n:'7',t:'Level 7',s:'MVP',at:70}],
    titles:['','','','welcome back','','','',''], badgePrefix:'L', hours:34, wsCount:6,
    detect:{ icon:'camera', title:'Check in at Blk 412 Court', desc:'Your Trace Match pickup game, Fri 7:00pm. Snap a team photo to log it.', btn:'Snap attendance photo', photo:true, done:'Your game is logged and the team photo is saved in your Vault.' },
    manual:{ kinds:[['Pickup game',2],['Training',1.5],['Match',2]] },
    streak:{ title:'Hooping September', done:3, of:4, unit:'sessions', tag:'Welcome back', next:'Aim for one game a week this month.', week:3, weeks:4 },
    badges:[ {n:'Welcome Back',s:'Return after 3+ years',i:'ball',rule:'on'},{n:'Team Player',s:'Log 10 team sessions',i:'users',rule:'team10'},{n:'Baller',s:'100 hours played',i:'trophy',rule:'h100'},{n:'MVP',s:'Earn a coach endorsement',i:'star',rule:'coach'} ],
    milestones:[ {t:'Primary school CCA member',s:'2016, Singpass-verified',i:'award',d:'Pulled from your MOE CCA records through Singpass. Verified.'},{t:'Secondary school CCA point guard',s:'2020, Singpass-verified',i:'award',d:'Point guard for the B Division team. Verified through Singpass.'} ],
    skills:[ {n:'Teamwork',ev:4,cat:'interpersonal',src:'Basketball, Blk 412 Regulars',dims:{Teamwork:1}}, {n:'Court leadership',ev:2,cat:'interpersonal',src:'CCA point guard',dims:{Leadership:1}}, {n:'Fitness routine',ev:5,cat:'mastery',src:'34 hours logged',dims:{Discipline:1}}, {n:'Game reading',ev:3,cat:'knowledge',src:'6 coached sessions',dims:{Mastery:1}} ],
    radar:{Creativity:.35,Discipline:.7,Communication:.6,Teamwork:.85,Leadership:.58,Mastery:.5},
    workshops:[ {id:'b1',t:'Trace Match pickup game',s:'Blk 412 Court, Fri 7:00pm',detected:true} ],
    endorse:[ {id:'tong',n:'Mr Tong',r:'Basketball coach, 2014 to 2016',a:'a_tong.jpg',st:'received',q:'A point guard who makes everyone around her better.'}, {id:'chloe2',n:'Chloe Sim',r:'CCA teacher in charge, 2017 to 2020',a:'a_chloe.jpg',st:'received',q:'Reliable, on time and the first to help set up.'} ]
  },
  motion: { key:'motion', name:'3D / Motion', cat:'ARTS', icon:'cube', isNew:true },
  guitar: { key:'guitar', name:'Guitar', cat:'MUSIC', icon:'note', isNew:true }
});
const FILE_SEED = () => [
  ['art','Sketch01.jpg','image','c_sketch.jpg',1,1,1],['art','Workshop.jpg','image','c_workshop.jpg',1,0,0],['art','Process.mp4','video','u_process.jpg',1,0,0],
  ['art','Certificate.pdf','pdf','u_cert.jpg',1,0,0],['art','Watercolour.jpg','image','c_watercolour.jpg',1,0,0],['art','Portrait.png','image','c_portrait.jpg',0,1,1],
  ['art','Desk_study.jpg','image','p_desk.jpg',0,1,1],['art','Palette_study.jpg','image','p_palette.jpg',0,1,1],
  ['piano','Recital.mp4','video','u_recital.jpg',1,0,1],['piano','ABRSM_cert.pdf','pdf','u_cert.jpg',0,1,0],['piano','Sheet_music.pdf','pdf','u_sheet.jpg',0,0,0],['piano','Practice_log.pdf','pdf','c_practicelog.jpg',0,0,0],['piano','Recording.mp3','audio','c_recording.jpg',1,0,0],
  ['bball','TeamPhoto_P6.jpg','image','u_team.jpg',0,1,0],['bball','MVP_2022.jpg','image','u_mvp.jpg',0,1,0],['bball','Highlights.mp4','video','u_highlights.jpg',1,0,0],['bball','CCA_Cert.pdf','pdf','u_cert.jpg',0,1,0],['bball','Nationals.jpg','image','u_nationals.jpg',0,0,0]
].map((f,i)=>({ id:'f'+i, hobby:f[0], name:f[1], kind:f[2], src:IMG+f[3], isNew:!!f[4], pub:!!f[5], port:!!f[6],
  ws: f[0]==='art' && f[4] ? 'w1' : null, date: f[4] ? '12 Sep 2026' : 'Aug 2026' }));

const KEY = 'trace-native-v1';
let S = load();
function fresh(){
  const h = HOBBY_SEED();
  return { hobbies:h, order:['art','motion','piano','guitar','bball'], files:FILE_SEED(), logs:{art:false,piano:false,bball:false},
    seg:{}, sugg:false, posts:[], frame:'glo', radarOff:{}, pf:{ hobbies:{art:true,piano:true,bball:false}, sec:{matrix:true,endorse:true,work:true,miles:true,xp:false}, access:'view', purpose:null, endorse:true },
    tailor:{ msgs:[], stage:0 }, nextId:100, autoNet:true, seedLiked:{} };
}
const IMGMAP = {team:'u_team',mvp:'u_mvp',highlights:'u_highlights',ccacert:'u_cert',cert:'u_cert',nationals:'u_nationals',sheet:'u_sheet',recital:'u_recital',process:'u_process',sketch:'c_sketch',workshop:'c_workshop',watercolour:'c_watercolour',portrait:'c_portrait',practicelog:'c_practicelog',recording:'c_recording'};
function load(){ try{ const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.hobbies && s.files){
  s.files.forEach(f=>{ const m = typeof f.src==='string' && f.src.match(/v_(\w+)\.jpg$/); if (m && IMGMAP[m[1]]) f.src = f.src.replace(/v_\w+\.jpg$/, IMGMAP[m[1]]+'.jpg'); });
  return s; } }catch(e){} return fresh(); }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){ /* storage full or blocked: keep working in memory */ } }

/* ---------------- derived values ---------------- */
const H = k => S.hobbies[k];
const real = () => S.order.filter(k=>!H(k).isNew && !H(k).sugg);
function lvlIndex(h){ let i=0; h.levels.forEach((l,j)=>{ if (h.xp >= l.at) i=j; }); return i; }
function levelInfo(h){
  if (h.isNew) return { cur:null, next:null, pct:0, label:'New' };
  const i = lvlIndex(h), cur = h.levels[i], next = h.levels[i+1];
  const pct = next ? Math.max(0, Math.min(1, (h.xp - cur.at) / (next.at - cur.at))) : 1;
  return { i, cur, next, pct, label: h.badgePrefix + cur.n };
}
function subtitle(h){
  if (h.isNew) return 'New';
  if (h.subFixed && lvlIndex(h)===2) return h.subFixed;
  const { cur } = levelInfo(h); const t = h.titles[+cur.n] || '';
  return cur.t + (t ? ', ' + t : '');
}
const filesOf = k => S.files.filter(f=>f.hobby===k && f.state!=='fail');
const artCount = () => S.files.filter(f=>f.hobby==='art' && f.kind==='image').length;
function evidence(h, sk){ // live evidence: seed plus confirmed work since
  return sk.ev + (sk.extra||0);
}
const RATE = n => n>=6 ? 'Strong' : n>=3 ? 'Building' : 'Emerging';
const BARS = n => n>=6 ? 3 : n>=3 ? 2 : 1;
const FRAMES = { glo:{ label:'SMU GLO', creative:'Creative skills', knowledge:'Knowledge', mastery:'Personal mastery', interpersonal:'Interpersonal' },
                 plain:{ label:'Plain words', creative:'Making things', knowledge:'Know-how', mastery:'Self-management', interpersonal:'People skills' } };
const DIMS = ['Creativity','Discipline','Communication','Teamwork','Leadership','Mastery'];
function radarOf(keys){
  const out = {}; DIMS.forEach(d=>out[d]=0); if (!keys.length) return out;
  keys.forEach(k=>{ const h = H(k); DIMS.forEach(d=>{ let v = h.radar[d];
    h.skills.forEach(sk=>{ if (sk.dims[d]) v += (sk.extra||0) * .03 * sk.dims[d]; }); out[d] += Math.min(.98, v); }); });
  DIMS.forEach(d=>out[d] /= keys.length); return out;
}
function badgeOn(h, b){
  switch (b.rule){
    case 'on': return true;
    case 'art1': return artCount() >= 1;
    case 'ws3': return true;
    case 'art10': return artCount() >= 10;
    case 'streak': return h.streak.done >= h.streak.of;
    case 'rec10': return filesOf('piano').filter(f=>f.kind==='audio'||f.kind==='video').length >= 10;
    case 'team10': return (h.teamLogs||6) >= 10;
    case 'h100': return h.xp >= 100;
    case 'coach': return h.endorse.some(e=>e.id==='tong' && e.st==='received');
  }
  return false;
}
function badgeProgress(h, b){
  switch (b.rule){
    case 'art10': return [artCount(), 10, 'pieces'];
    case 'streak': return [h.streak.done, h.streak.of, h.streak.unit];
    case 'rec10': return [filesOf('piano').filter(f=>f.kind==='audio'||f.kind==='video').length, 10, 'recordings'];
    case 'team10': return [h.teamLogs||6, 10, 'team sessions'];
    case 'h100': return [h.xp, 100, 'hours'];
  }
  return null;
}

/* ---------------- shared UI helpers ---------------- */
const t = (n)=>window.TRACE;
const go = id => t().go(id);
function refresh(){ const y = t().getY(); t().render(t().state.cur); t().setY(y); }
function toast(msg, icon='check', action){
  let host = $('#ntoast'); if (!host) return;
  host.innerHTML = `<div class="${action?'act':''}">${ic(icon)}<span>${msg}</span>${action?`<button class="tbtn">${esc(action.label)}</button>`:''}</div>`;
  if (action) host.querySelector('.tbtn').addEventListener('click', ()=>{ host.innerHTML=''; action.fn(); });
  clearTimeout(toast.tm); toast.tm = setTimeout(()=>host.innerHTML='', action ? 5200 : 2700);
}
function ring(pct, size, color='#6ea862', track='#e1ecdb'){
  return `--p:${pct.toFixed(3)};--rc:${color};--rt:${track}`;
}
function hobbyIcon(h){ return ic(h.icon||'spark'); }
function thumb(f){
  if (f.src) return `style="background-image:url('${f.src}')"`;
  return '';
}
function kindIcon(k){ return k==='pdf' ? 'file' : k==='audio' ? 'audio' : k==='video' ? 'film' : 'image'; }

/* sheets */
function sheet(html, opts={}){
  const host = $('#nsheet'); host.innerHTML = '';
  host.className = 'open';
  host.innerHTML = `<div class="scrim"></div><div class="wrap"><div class="sh" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
  $('.scrim', host).addEventListener('click', ()=>{ if (!opts.locked) closeSheet(); });
  if (opts.confetti) confetti($('.sh', host));
  return $('.sh', host);
}
function closeSheet(){ const host = $('#nsheet'); if (host){ host.className=''; host.innerHTML=''; } }
function confetti(el){
  const c = document.createElement('div'); c.className = 'nx-confetti';
  const cols = ['#6ea862','#3a6ea5','#f4c84a','#d23e1b','#9ed08b','#e4eef8'];
  for (let i=0;i<40;i++){ const p = document.createElement('i'); p.style.left = Math.random()*100+'%'; p.style.background = cols[i%cols.length];
    p.style.animationDelay = (Math.random()*.6)+'s'; p.style.transform = `rotate(${Math.random()*180}deg)`; c.appendChild(p); }
  el.style.position='relative'; el.appendChild(c); setTimeout(()=>c.remove(), 2600);
}
function countUp(el, from, to, ms=900){
  if (!el) return; const t0 = performance.now();
  const step = now => { const p = Math.min(1,(now-t0)/ms), e = 1-Math.pow(1-p,3); el.textContent = fmt(Math.round(from+(to-from)*e)); if (p<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function pickFiles(accept, multiple, capture){
  return new Promise(res=>{
    const inp = document.createElement('input'); inp.type='file'; inp.accept=accept; inp.multiple=!!multiple;
    if (capture) inp.setAttribute('capture', capture);
    inp.style.display='none'; document.body.appendChild(inp);
    inp.addEventListener('change', ()=>{ res([...inp.files]); inp.remove(); });
    inp.click();
  });
}
/* small, persistable preview of an uploaded file */
function makeThumb(file){
  return new Promise(res=>{
    const done = v => res(v||null);
    if (file.type.startsWith('image/')){
      const url = URL.createObjectURL(file); const img = new Image();
      img.onload = ()=>{ const m = 360, r = Math.min(1, m/Math.max(img.width,img.height)); const c = document.createElement('canvas');
        c.width = Math.round(img.width*r); c.height = Math.round(img.height*r); c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        URL.revokeObjectURL(url); done(c.toDataURL('image/jpeg',.78)); };
      img.onerror = ()=>done(null); img.src = url; return;
    }
    if (file.type.startsWith('video/')){
      const url = URL.createObjectURL(file); const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload='auto';
      const grab = ()=>{ try{ const c=document.createElement('canvas'); const r=Math.min(1,360/Math.max(v.videoWidth,v.videoHeight)); c.width=v.videoWidth*r; c.height=v.videoHeight*r;
        c.getContext('2d').drawImage(v,0,0,c.width,c.height); done(c.toDataURL('image/jpeg',.75)); }catch(e){ done(null); } };
      v.addEventListener('loadeddata', ()=>{ try{ v.currentTime = Math.min(1, (v.duration||2)/3); }catch(e){ grab(); } });
      v.addEventListener('seeked', grab); v.addEventListener('error', ()=>done(null)); v.src = url; setTimeout(()=>done(null), 4000); return;
    }
    done(null);
  });
}
const kindOf = f => f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : f.type.startsWith('audio/') ? 'audio' : 'pdf';
const BLOBS = {};   // full-size object URLs for this session (videos and images play back at full quality)


/* moving decoration: the icon tiles cut from the sky art bob in their own places (the art underneath was cleaned) */
const TILESETS = {"std":[{"f":"std-guitar.png","x":262.5,"y":0.0,"w":23.0,"h":21.5,"big":false},{"f":"std-brush.png","x":245.5,"y":17.5,"w":23.0,"h":23.0,"big":false},{"f":"std-ctrl.png","x":227.5,"y":32.5,"w":23.0,"h":23.0,"big":false},{"f":"std-ball.png","x":314.5,"y":15.5,"w":23.0,"h":23.0,"big":false},{"f":"std-marker.png","x":357.5,"y":0.0,"w":23.0,"h":21.5,"big":false},{"f":"std-runner.png","x":377.5,"y":25.5,"w":23.0,"h":23.0,"big":false}],"sky":[{"f":"sky-guitar.png","x":262.5,"y":0.0,"w":23.0,"h":21.5,"big":false},{"f":"sky-brush.png","x":245.5,"y":17.5,"w":23.0,"h":23.0,"big":false},{"f":"sky-ctrl.png","x":227.5,"y":32.5,"w":23.0,"h":23.0,"big":false},{"f":"sky-ball.png","x":314.5,"y":15.5,"w":23.0,"h":23.0,"big":false},{"f":"sky-marker.png","x":357.5,"y":0.0,"w":23.0,"h":21.5,"big":false},{"f":"sky-runner.png","x":377.5,"y":25.5,"w":23.0,"h":23.0,"big":false},{"f":"sky-music.png","x":280.5,"y":37.5,"w":23.0,"h":23.0,"big":false},{"f":"sky-camera.png","x":344.5,"y":44.5,"w":23.0,"h":23.0,"big":false}],"hdr_art":[{"f":"hdr_art-big1.png","x":268.0,"y":40.0,"w":46.0,"h":46.0,"big":true},{"f":"hdr_art-big2.png","x":319.5,"y":64.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_art-big3.png","x":264.0,"y":95.0,"w":46.0,"h":46.0,"big":true},{"f":"hdr_art-guitar.png","x":262.5,"y":9.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_art-brush.png","x":245.5,"y":28.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_art-ctrl.png","x":227.5,"y":43.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_art-ball.png","x":314.5,"y":26.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_art-marker.png","x":357.5,"y":9.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_art-runner.png","x":377.5,"y":36.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_art-pal.png","x":363.5,"y":91.5,"w":23.0,"h":23.0,"big":false}],"hdr_piano":[{"f":"hdr_piano-big1.png","x":263.5,"y":40.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_piano-big2.png","x":319.5,"y":67.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_piano-big3.png","x":260.0,"y":95.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_piano-guitar.png","x":262.5,"y":9.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_piano-brush.png","x":245.5,"y":28.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_piano-ctrl.png","x":227.5,"y":43.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_piano-ball.png","x":314.5,"y":26.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_piano-marker.png","x":357.5,"y":9.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_piano-runner.png","x":377.5,"y":36.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_piano-pal.png","x":363.5,"y":91.5,"w":23.0,"h":23.0,"big":false}],"hdr_bball":[{"f":"hdr_bball-big1.png","x":268.0,"y":39.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_bball-big2.png","x":321.5,"y":65.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_bball-big3.png","x":260.0,"y":94.5,"w":46.0,"h":46.0,"big":true},{"f":"hdr_bball-guitar.png","x":262.5,"y":9.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_bball-brush.png","x":245.5,"y":28.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_bball-ctrl.png","x":227.5,"y":43.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_bball-ball.png","x":314.5,"y":26.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_bball-marker.png","x":357.5,"y":9.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_bball-runner.png","x":377.5,"y":36.5,"w":23.0,"h":23.0,"big":false},{"f":"hdr_bball-pal.png","x":363.5,"y":91.5,"w":23.0,"h":23.0,"big":false}],"home":[{"f":"home-guitar.png","x":263.5,"y":26.5,"w":23.0,"h":23.0,"big":false},{"f":"home-brush.png","x":245.5,"y":43.5,"w":23.0,"h":23.0,"big":false},{"f":"home-ctrl.png","x":227.5,"y":60.5,"w":23.0,"h":23.0,"big":false},{"f":"home-marker.png","x":363.5,"y":25.5,"w":23.0,"h":23.0,"big":false},{"f":"home-runner.png","x":382.5,"y":54.5,"w":19.5,"h":23.0,"big":false},{"f":"home-bigmusic.png","x":292.0,"y":48.0,"w":44.0,"h":44.0,"big":true},{"f":"home-bigpen.png","x":334.0,"y":85.0,"w":44.0,"h":44.0,"big":true}]};
function clouds(){ return `<span class="nx-cloud c1"></span><span class="nx-cloud c2"></span><span class="nx-cloud c3"></span>`; }
function sparkles(list){ return list.map(([x,y,d])=>`<span class="nx-twinkle" style="left:${x}px;top:${y}px;animation-delay:${d}s"></span>`).join(''); }
function tilesHTML(key){
  return (TILESETS[key]||[]).map((t,i)=>{ const dur = t.big ? 4.6 + (i%3)*.5 : 3.4 + (i*.37)%1.6, del = -((i*1.13)%dur);
    return `<img class="nx-ft ${t.big?'big':''}" src="tiles/${t.f}" alt="" style="left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px;animation-duration:${dur.toFixed(2)}s;animation-delay:${del.toFixed(2)}s">`; }).join('');
}
function skyDeco(){ return `<div class="nx-deco">${clouds()}${tilesHTML('sky')}${sparkles([[178,14,0],[262,62,1.3],[110,40,2.1],[318,4,.7]])}</div>`; }
function headDeco(h){
  const key = TILESETS['hdr_'+h.key] ? 'hdr_'+h.key : null;
  return `<div class="nx-deco">${clouds()}${key?tilesHTML(key):tilesHTML('sky').replace(/top:([\d.]+)px/g,(m,y)=>'top:'+(+y+11)+'px')}${sparkles([[214,22,0],[236,70,1.1],[200,92,2],[386,140,.6]])}</div>`;
}

/* ---------------- shared blocks ---------------- */
const SEG = cur => `<div class="nx-seg" role="tablist">${[['p/hobbies','Hobbies'],['p/skills','Trace Skills'],['p/vault','Trace Vault']]
  .map(([r,l])=>`<button class="nx-pill ${cur===r?'on':''}" role="tab" aria-selected="${cur===r}" data-go="${r}" data-replace="1">${l}</button>`).join('')}</div>`;
const TOP = () => `<div class="nx-sky"></div>${skyDeco()}<div class="nx-wrap"><div class="nx-top"></div><div class="nx-hrow"><span class="nx-logo">${MARK}<span>trace</span></span></div>`;
const BACKROW = (label, to, where) => `<div class="nx-sky"></div>${skyDeco()}<div class="nx-wrap"><div class="nx-top"></div><div class="nx-hrow"><button class="nx-back" data-act="back" data-to="${to||''}">${BACK}${esc(label)}</button>${where?`<span class="nx-where">${esc(where)}</span>`:''}</div>`;
const AFTER = [];   // run after the view is in the page (animations)
let ANIM = null;    // { k, from } for the XP count-up

function radarSVG(vals, prev){
  const W = 330, Hh = 236, cx = 165, cy = 114, R = 64;
  const ang = [-90,-30,30,90,150,210].map(a=>a*Math.PI/180);
  const pt = (i, r) => [cx + Math.cos(ang[i])*r, cy + Math.sin(ang[i])*r];
  const poly = r => ang.map((_,i)=>pt(i,r).map(n=>n.toFixed(1)).join(',')).join(' ');
  const lab = [['Creativity',0,-22,'middle'],['Discipline',18,0,'start'],['Communication',18,4,'start'],['Teamwork',0,26,'middle'],['Leadership',-18,4,'end'],['Mastery',-18,0,'end']];
  const v = prev || vals;
  const data = DIMS.map((d,i)=>pt(i, R*v[d]).map(n=>n.toFixed(1)).join(',')).join(' ');
  return `<svg class="nx-radar" style="overflow:visible" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Skills radar">
    ${[1,.66,.33].map(r=>`<polygon points="${poly(R*r)}" fill="${r===1?'#f3f6f9':'none'}" stroke="#dfe5ec" stroke-width="1"/>`).join('')}
    ${ang.map((_,i)=>{ const [x,y]=pt(i,R); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e3e9ef"/>`; }).join('')}
    <polygon class="rd" points="${data}" fill="rgba(110,168,98,.28)" stroke="#417f4c" stroke-width="2.5" stroke-linejoin="round"/>
    ${DIMS.map((d,i)=>{ const [x,y]=pt(i,R*v[d]); return `<circle class="rp" data-i="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#fff" stroke="#417f4c" stroke-width="2.5"/>`; }).join('')}
    ${lab.map(([n,dx,dy,an],i)=>{ const [x,y]=pt(i,R+22); return `<text x="${(x+dx*.6).toFixed(1)}" y="${(y+dy*.4+4).toFixed(1)}" text-anchor="${an}">${n}</text>`; }).join('')}
  </svg>`;
}
function animateRadar(svg, from, to){
  if (!svg || !from) return;
  const R = 64, cx = 165, cy = 114, ang = [-90,-30,30,90,150,210].map(a=>a*Math.PI/180), t0 = performance.now();
  const step = now => { const p = Math.min(1,(now-t0)/600), e = 1-Math.pow(1-p,3);
    const pts = DIMS.map((d,i)=>{ const r = R*(from[d]+(to[d]-from[d])*e); return [cx+Math.cos(ang[i])*r, cy+Math.sin(ang[i])*r]; });
    const pg = svg.querySelector('.rd'); if (!pg) return;
    pg.setAttribute('points', pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' '));
    svg.querySelectorAll('.rp').forEach((c,i)=>{ c.setAttribute('cx',pts[i][0].toFixed(1)); c.setAttribute('cy',pts[i][1].toFixed(1)); });
    if (p<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
let RPREV = null;
function skillRows(list, frame, limit){
  const F = FRAMES[frame];
  return list.slice(0, limit||list.length).map(({h, sk})=>{ const n = evidence(h, sk), lv = BARS(n);
    const ev = [sk.src].concat(Array.from({length:sk.extra||0},(_,i)=>`Logged in Trace, ${TODAY}`));
    return `<button class="nx-skill" data-act="toggleSkill" aria-expanded="false">
      <div class="r1"><span class="nm">${esc(sk.n)}</span><span class="nx-bars">${[1,2,3].map(i=>`<i class="${i<=lv?'on':''}"></i>`).join('')}<span>${RATE(n)}</span></span></div>
      <div class="r2"><span class="nx-muted">${esc(h.key==='art'||h.key==='piano'||h.key==='bball' ? sk.src : '')}</span><span class="nx-tag">${esc(F[sk.cat])}</span></div>
      <div class="nx-ev"><div class="nx-b" style="color:#152331">${n} pieces of evidence, ${esc(h.name)}</div>${ev.map(x=>`<div>${esc(x)}</div>`).join('')}</div>
    </button>`; }).join('');
}
function endorseRows(list, withBtn){
  return list.map(({h,e})=>{ settle(e);
    const right = !withBtn ? '' : e.st==='received' ? `<span class="nx-tag green">${ic('check')}Endorsed</span>`
      : e.st==='requested' ? `<span class="nx-mini done">${ic('clock')}Requested</span>` : `<button class="nx-mini" data-act="reqEndorse" data-h="${h.key}" data-e="${e.id}">Request</button>`;
    return `<div class="nx-li"><img class="nx-ava" src="${IMG+e.a}" alt=""><div class="nx-sp"><div class="t">${esc(e.n)}</div><div class="s">${e.st==='received'&&!withBtn ? esc(e.q) : esc(e.r)}</div>${e.st==='received'&&withBtn?`<div class="s" style="font-style:italic;color:#2f5b33;margin-top:4px">“${esc(e.q)}”</div>`:''}</div>${right}</div>`; }).join('');
}
function settle(e){ if (e.st==='requested' && e.reqAt && Date.now()-e.reqAt > 6000){ e.st='received'; save(); } }

/* ================= PROGRESS: HOBBIES ================= */
const SUGG = { pottery:{name:'Pottery',icon:'pot',cat:'ARTS',why:'Pottery is slow, hands-on and forgiving. It builds the patience and observation your radar is already strong on, and adds a new making skill.',session:'3071:1083',sname:'Wheel-throwing taster, Clay Collective'},
  film:{name:'Film photo',icon:'camera',cat:'ARTS',why:'Film photography trains you to look before you shoot. It pairs well with your composition work in Digital Art.',session:'3071:1079',sname:'See beginner sessions'},
  callig:{name:'Calligraphy',icon:'brush',cat:'ARTS',why:'Calligraphy is about control and rhythm, the same skills as your digital brush work, on paper.',session:'3071:1079',sname:'See beginner sessions'} };
function hobTile(k){
  const h = H(k);
  if (h.sugg) return `<button class="nx-hob" data-act="sugg" data-k="${k}"><span class="nx-ring sug"><span class="in" style="background:#fff3ef;color:#c4512e">${ic(h.icon)}</span></span><b>${esc(h.name)}</b><small class="sugg">✦ Suggested</small></button>`;
  if (h.isNew) return `<button class="nx-hob" data-act="newHobby" data-k="${k}"><span class="nx-ring"><span class="in">${ic(h.icon)}</span></span><b>${esc(h.name)}</b><small>New</small></button>`;
  const L = levelInfo(h);
  return `<button class="nx-hob" data-go="h/${k}"><span class="nx-ring cg" style="${ring(L.pct)}"><span class="in">${ic(h.icon)}</span><span class="lv">${L.label}</span></span><b>${esc(h.name)}</b><small>${esc(k==='piano'?'Grade '+L.cur.n+(lvlIndex(h)===2?', merit':''):k==='bball'?L.cur.t:L.cur.t)}</small></button>`;
}
function pHobbies(v){
  let html = TOP() + `<h1 class="nx-h1">Progress</h1>` + SEG('p/hobbies') + `<div class="nx-card">`;
  ['ARTS','MUSIC','SPORTS'].forEach(c=>{
    const keys = S.order.filter(k=>H(k).cat===c && !H(k).sugg);
    html += `<div class="nx-cat">${c}</div><div class="nx-hgrid">${keys.map(hobTile).join('')}
      <button class="nx-hob" data-act="addHobby" data-cat="${c}"><span class="nx-ring add"><span class="in">${ic('plus')}</span></span><b style="font-weight:600;color:#3f5570">Add hobby</b></button></div>`;
  });
  const sug = S.order.filter(k=>H(k).sugg);
  if (sug.length) html += `<div class="nx-cat" style="color:#2b5a87">SUGGESTED FOR YOU</div><div class="nx-hgrid">${sug.map(hobTile).join('')}</div>`;
  html += `</div><div class="nx-gap"></div>
  <div class="nx-ai"><div><div class="nx-row"><span class="nx-mark">${MARK}</span><div><div style="font-family:Outfit;font-weight:600;font-size:18px">Try something new</div><div class="kick">TRACE AI SUGGESTION</div></div></div>
    <p style="font-size:15px;color:#3f5570;line-height:1.45;margin:12px 0 14px">Your skills radar is strong on <b style="color:#152331">observation</b> and <b style="color:#152331">patience</b>. A hands-on craft would stretch them.</p>
    <div class="nx-btns" style="margin:0"><button class="nx-btn sm" data-go="3071:1085">Go to Trace Match</button>
    ${S.sugg ? `<button class="nx-btn sm ghost" style="background:#e5f1df;border-color:#cfe3c6;color:#2f6239" data-act="unsugg">${ic('spark')}${sug.length} added above</button>` : `<button class="nx-btn sm ghost" data-act="suggest">${ic('spark')}Suggest for me</button>`}</div></div></div></div>`;
  v.innerHTML = html;
}

/* ================= TRACE SKILLS ================= */
let SHOWALL = false;
function pSkills(v){
  const keys = real().filter(k=>!S.radarOff[k]);
  const vals = radarOf(keys);
  const list = []; keys.forEach(k=>H(k).skills.forEach(sk=>list.push({h:H(k), sk})));
  list.sort((a,b)=>evidence(b.h,b.sk)-evidence(a.h,a.sk));
  const low = DIMS.slice().sort((a,b)=>vals[a]-vals[b])[0];
  v.innerHTML = TOP() + `<h1 class="nx-h1">Progress</h1>` + SEG('p/skills') + `
  <div class="nx-card"><div class="nx-row" style="justify-content:space-between"><span class="nx-label" style="margin:0">Across ${keys.length} hobb${keys.length===1?'y':'ies'}</span><span class="nx-link" data-act="rateSheet">${ic('info')}How skills are rated</span></div>
    ${radarSVG(vals, RPREV)}
    <div class="nx-hchips">${real().map(k=>`<button class="nx-hchip ${S.radarOff[k]?'off':''}" data-act="radarToggle" data-k="${k}" aria-pressed="${!S.radarOff[k]}">${ic(H(k).icon)}${esc(H(k).name)}</button>`).join('')}</div></div>
  <div class="nx-row" style="justify-content:space-between;margin:22px 0 10px"><span class="nx-label" style="margin:0">Skill matrix</span>
    <select class="nx-sel" data-act="frame" aria-label="Skill framework">${Object.entries(FRAMES).map(([k,f])=>`<option value="${k}" ${S.frame===k?'selected':''}>${f.label}</option>`).join('')}</select></div>
  <div class="nx-list">${list.length ? skillRows(list, S.frame, SHOWALL?0:4) : '<div class="nx-li"><span class="nx-muted">Turn on a hobby above to see its skills.</span></div>'}
    ${list.length>4 ? `<button class="nx-li" data-act="showAll" style="justify-content:center;color:#2b5a87;font-weight:600">${SHOWALL?'Show fewer':'Show all '+list.length+' skills'}</button>`:''}</div>
  <div class="nx-gap"></div>
  <div class="nx-card nx-row"><span class="nx-ico">${ic('spark')}</span><div class="nx-sp"><div style="font-weight:700;font-size:16px">Grow ${low.toLowerCase()} next</div><div class="nx-muted">${low==='Leadership'?'Host a Trace Match session to build it':low==='Teamwork'?'Join a group session to build it':'Book a session that stretches it'}</div></div><button class="nx-mini" data-go="3071:1085">Find a session</button></div>`;
  const svg = $('.nx-radar', v); const zero = {}; DIMS.forEach(d=>zero[d]=.05);
  const from = v.classList.contains('in') ? zero : RPREV; RPREV = vals;
  if (from) AFTER.push(()=>animateRadar(svg, from, vals));
}

/* ================= TRACE VAULT ================= */
let VFILTER = 'all', VEXP = false;
function latestUp(){ const f = S.files.find(x=>x.mine); return f ? f.id : null; }
function tile(f, opts={}){
  const ico = f.src ? (f.kind==='video' ? `<span class="menu" style="left:50%;top:50%;transform:translate(-50%,-50%);width:38px;height:38px">${ic('play')}</span>` : '')
                    : ic(kindIcon(f.kind),'big',1.6);
  return `<button class="nx-tile" data-act="file" data-f="${f.id}"><div class="th" ${thumb(f)}>${ico}${opts.check?`<span class="ok">${ic('check','',3)}</span>`:''}${opts.menu?`<span class="menu" data-act="tileMenu" data-f="${f.id}">${ic('dots')}</span>`:''}${opts.newdot&&f.mine&&f.id===latestUp()?'<span class="newdot">NEW</span>':''}</div><div class="nm">${esc(f.name)}</div></button>`;
}
function pVault(v){
  const all = S.files.filter(f=>!H(f.hobby).isNew);
  const counts = {}; all.forEach(f=>counts[f.hobby]=(counts[f.hobby]||0)+1);
  const list = VFILTER==='all' ? all : all.filter(f=>f.hobby===VFILTER);
  const shown = VEXP || list.length<=6 ? list : list.slice(0,5);
  const ends = []; real().forEach(k=>{ if (VFILTER==='all'||VFILTER===k) H(k).endorse.forEach(e=>{ settle(e); if (e.st==='received') ends.push({h:H(k),e}); }); });
  v.innerHTML = TOP() + `<h1 class="nx-h1">Progress</h1>` + SEG('p/vault') + `
  <div class="nx-chips">${[['all','All, '+all.length]].concat(real().map(k=>[k, H(k).name+', '+(counts[k]||0)])).map(([k,l])=>`<button class="nx-pill sm ${VFILTER===k?'on':''}" data-act="vfilter" data-k="${k}">${esc(l)}</button>`).join('')}</div>
  <div class="nx-grid">${shown.map(f=>tile(f,{newdot:true})).join('')}
    ${shown.length<list.length ? `<button class="nx-more" data-act="vexp"><b>+${list.length-5}</b><small>more files</small></button>` : `<button class="nx-more" data-act="vaultUpload">${ic('upload')}<small>Upload</small></button>`}</div>
  ${ends.length ? `<div class="nx-label">Endorsements</div><div class="nx-list">${endorseRows(ends,false)}</div>` : ''}
  <div class="nx-gap"></div><div class="nx-gap"></div>
  <button class="nx-btn" data-go="p/portfolio">${ic('upload')}Customise and export portfolio</button>`;
}

/* ================= HOBBY PAGE ================= */
function hobbyHead(h, backTo){
  const L = levelInfo(h);
  return `<div class="nx-hhead ${h.hdr?'':'plain'}" style="${h.hdr?`background-image:url('${IMG+h.hdr}')`:''}">${headDeco(h)}
    <button class="nx-back back" data-act="back" data-to="${backTo||'p/hobbies'}">${BACK}${backTo&&backTo!=='p/hobbies'?'Back':'Back to Progress'}</button>
    <div class="ring cg" style="${ring(L.pct,66,'#6ea862','rgba(255,255,255,.75)')}"><span class="in">${hobbyIcon(h)}</span><span class="lv">${L.label}</span></div>
    <div class="ttl"><b>${esc(h.name)}</b><span>${esc(subtitle(h))}</span></div></div>`;
}
const HTABS = (k, cur) => `<div class="nx-wrap"><div class="nx-tabs" role="tablist">${[['','Progress'],['/skills','Skills'],['/vault','Vault']]
  .map(([s,l])=>`<button class="${cur===s?'on':''}" role="tab" aria-selected="${cur===s}" data-go="h/${k}${s}" data-replace="1">${l}</button>`).join('')}</div>`;
const unitXP = h => h.unit==='hours' ? 'hours' : 'XP';
const plusXP = (h, n) => h.unit==='hours' ? `+${n} hour${n===1?'':'s'}` : `+${fmt(n)} XP`;

function journeySVG(h){
  const L = levelInfo(h), cur = L.i;
  const xs = [26,104,174,246,312], ys = [112,52,112,52,112];
  let seg = '';
  for (let i=0;i<4;i++){
    const x1=xs[i], y1=ys[i], x2=xs[i+1], y2=ys[i+1], mx=(x1+x2)/2;
    const d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
    seg += i < cur ? `<path class="done" pathLength="100" d="${d}" fill="none" stroke="#6ea862" stroke-width="5" stroke-linecap="round"/>`
                   : `<path class="flow" d="${d}" fill="none" stroke="#c9d3dd" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 9"/>`;
  }
  const nodes = h.levels.map((l,i)=>{
    const x = xs[i], y = ys[i], up = y < 80;
    const ly = up ? y-34 : y+30, sy = ly+12;
    let node;
    if (i < cur) node = `<circle cx="${x}" cy="${y}" r="13" fill="#417f4c"/><path d="M${x-5} ${y} l3.5 3.5 l6.5-7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    else if (i === cur) node = `<circle class="pulse" cx="${x}" cy="${y}" r="20" fill="none" stroke="#6ea862" stroke-width="3"/><circle cx="${x}" cy="${y}" r="20" fill="#fff" stroke="#417f4c" stroke-width="3"/><clipPath id="av${h.key}"><circle cx="${x}" cy="${y}" r="16"/></clipPath><image href="${IMG}a_sarah.jpg" x="${x-16}" y="${y-16}" width="32" height="32" clip-path="url(#av${h.key})" preserveAspectRatio="xMidYMid slice"/>`;
    else node = `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="#c9d3dd" stroke-width="2"/>` + (i===4 ? `<path d="M${x-4} ${y+6} v-12 h8 l-2 3 l2 3 h-8" fill="none" stroke="#7d8a97" stroke-width="1.8" stroke-linejoin="round"/>` : `<text x="${x}" y="${y+4}" text-anchor="middle" class="f" style="font-weight:700">${esc(l.n)}</text>`);
    const f = i > cur ? ' f' : '';
    return node + `<text x="${x}" y="${(i===cur&&!up)?ly+6:ly}" text-anchor="middle" class="${f}">${esc(l.t)}</text><text x="${x}" y="${(i===cur&&!up)?sy+6:sy}" text-anchor="middle" class="s${f}">${esc(l.s)}</text>`;
  }).join('');
  return `<svg class="nx-journey" width="338" height="172" viewBox="0 -4 338 172" role="img" aria-label="Your journey: ${esc(L.cur.t)}">${seg}${nodes}</svg>`;
}
function hProgress(v, k){
  const h = H(k), L = levelInfo(h), logged = S.logs[k], mode = S.seg[k]||'det', pend = logged ? 0 : h.pending;
  const D = h.detect;
  const entering = v.classList.contains('in') && !(ANIM && ANIM.k===k);
  if (entering) ANIM = { k, from: Math.round(h.xp*0.6), enter:true };
  const fromXp = ANIM && ANIM.k===k ? ANIM.from : h.xp;
  const span = L.next ? (L.next.at - L.cur.at) : 1;
  const pctTo = L.pct, pctFrom = ANIM && ANIM.k===k ? (ANIM.enter ? 0 : Math.max(0, Math.min(1, (fromXp - L.cur.at)/span))) : pctTo;
  const pendW = L.next ? Math.min(1-pctTo, pend/span) : 0;
  let log;
  if (mode==='man'){
    const kinds = h.manual.kinds, sel = S.manKind && S.manKind[k] != null ? S.manKind[k] : 0;
    log = `<div class="nx-flabel" style="margin-top:4px">What did you do?</div><div class="nx-opts">${kinds.map(([n],i)=>`<button class="nx-pill sm ${i===sel?'on':''}" data-act="manKind" data-i="${i}">${esc(n)}</button>`).join('')}</div>
      <div class="nx-flabel">When</div><input class="nx-field" type="date" id="manDate" value="2026-10-28" aria-label="Date">
      <div class="nx-flabel">Note (optional)</div><input class="nx-field" id="manNote" placeholder="${k==='art'?'Tried the new watercolour brush':k==='piano'?'Worked on the Grade 4 scales':'Full-court game, 5 on 5'}" aria-label="Note">
      <div class="nx-flabel">Photo (optional)</div>${MANPH[k] ? `<div class="nx-manph"><span class="th" style="background-image:url('${MANPH[k].th}')"></span><div class="nx-sp"><b>Photo attached</b><small>Saved to your Vault when you log</small></div><button class="nx-mini" data-act="manSnap">Retake</button><button class="nx-mini" data-act="manPhX" aria-label="Remove photo">${ic('x')}</button></div>` : `<button class="nx-snap" data-act="manSnap">${ic('camera')}<span>Snap a photo</span></button>`}
      <div style="margin-top:14px"><button class="nx-btn" data-act="manLog">${ic('check')}Log session, ${plusXP(h, kinds[sel][1])}</button></div>`;
  } else if (logged){
    log = `<div class="nx-alert green">${ic('check')}<div><b>${plusXP(h, h.lastAdd||h.pending)} added.</b> ${esc(D.done)}</div></div>
      <div style="margin-top:12px"><button class="nx-btn ghost sm" data-go="h/${k}/vault" data-replace="1">View in Vault</button></div>`;
  } else {
    log = `<div class="nx-row" style="align-items:flex-start"><span class="nx-ico">${ic(D.icon)}</span><div class="nx-sp"><div style="font-weight:700;font-size:16.5px">${esc(D.title)}</div><div class="nx-muted" style="font-size:14px">${esc(D.desc)}</div></div></div>
      <div style="margin-top:14px"><button class="nx-btn" data-act="confirmLog">${ic(D.photo?'camera':'check')}${esc(D.btn)}, ${plusXP(h, h.pending)}</button></div>`;
  }
  const st = h.streak, left = Math.max(0, st.of - st.done);
  v.innerHTML = hobbyHead(h) + HTABS(k,'') + `
  <div class="nx-card"><div class="nx-row" style="justify-content:space-between"><span class="nx-label" style="margin:0">Log session</span>
    ${logged&&mode==='det' ? `<span class="nx-tag green">${ic('check')}Logged</span>` : pend&&mode==='det' ? `<span class="nx-tag amber">${ic('clock')}${plusXP(h,pend)} pending</span>` : ''}</div>
    <div class="nx-seg2" role="tablist"><button class="${mode==='det'?'on':''}" data-act="logMode" data-m="det">Trace detected</button><button class="${mode==='man'?'on':''}" data-act="logMode" data-m="man">Add manually</button></div>
    ${log}</div>
  <div class="nx-card"><div class="nx-label" style="margin:0 0 6px">Your journey</div>
    <div class="nx-row" style="justify-content:space-between;align-items:flex-end"><div class="nx-xp"><b class="nx-count" id="xpNum">${fmt(fromXp)}</b> <small>/ ${L.next?fmt(L.next.at):fmt(h.xp)} ${unitXP(h)}</small></div><span class="nx-link" data-act="xpSheet">${ic('info')}How ${h.unit==='hours'?'levels':'XP'} work${h.unit==='hours'?'':'s'}</span></div>
    ${journeySVG(h)}
    <div class="nx-wave"><i id="wFill" style="width:${(pctFrom*100).toFixed(1)}%" data-to="${(pctTo*100).toFixed(1)}"></i><b id="wPend" style="left:${(pctTo*100).toFixed(1)}%;width:${(pendW*100).toFixed(1)}%"></b><em id="wKnob" style="left:${Math.max(4,pctFrom*100).toFixed(1)}%" data-to="${Math.max(4,pctTo*100).toFixed(1)}">${ic('sprout')}</em></div>
    <div class="nx-row" style="justify-content:space-between;margin-top:12px;font-size:14px"><span>${esc(L.cur.t)}</span>
      ${pend ? `<b style="color:#8a5a00;font-weight:600">${plusXP(h,pend)} pending</b>` : L.next ? `<b style="color:#347241;font-weight:600">${fmt(L.next.at-h.xp)} ${unitXP(h)} to ${esc(L.next.t)}</b>` : `<b style="color:#347241">Top level reached</b>`}</div></div>
  <div class="nx-card"><div class="nx-row" style="justify-content:space-between"><div class="nx-row" style="gap:8px">${ic('flame','',2).replace('<svg','<svg style="width:20px;height:20px;color:#417f4c"')}<b style="font-family:Outfit;font-size:18px;font-weight:600">${esc(st.title)}</b></div><span class="nx-tag">${esc(st.tag)}</span></div>
    <div class="nx-streak"><div class="nx-donut cg" style="${ring(st.done/st.of)}"><div><b>${st.done}</b><small>of ${st.of}</small></div></div>
    <div class="nx-sp"><div style="font-family:Outfit;font-weight:600;font-size:19px">${left ? `${left} ${left===1?st.unit.replace(/s$/,''):st.unit} to go` : 'Streak complete!'}</div><div class="nx-muted" style="font-size:14px">${esc(left?st.next:'Bonus added. Keep the habit going next month.')}</div>
      <div class="nx-weeks">${Array.from({length:st.weeks},(_,i)=>`<i class="${i<st.week?'on':''}"></i>`).join('')}</div><div class="nx-muted">Week ${st.week} of ${st.weeks}</div></div></div></div>
  <div class="nx-wrap" style="padding:0"><div class="nx-label">Reward badges</div>
  <div class="nx-card nx-badges">${h.badges.map((b,i)=>{ const on = badgeOn(h,b); return `<button class="nx-badge ${on?'':'lock'} ${S.justBadge===h.key+i?'pop':''}" data-act="badge" data-i="${i}"><span class="bi">${ic(b.i)}</span><b>${esc(b.n)}</b><small>${esc(b.s)}</small></button>`; }).join('')}</div>
  <div class="nx-label">Milestones</div>
  <div class="nx-list">${h.milestones.map((m,i)=>`<button class="nx-li" data-act="mile" data-i="${i}"><span class="nx-ico green">${ic(m.i)}</span><div class="nx-sp"><div class="t">${esc(m.t)}</div><div class="s">${esc(m.s)}</div></div>${ic('chev','nx-chev')}</button>`).join('')}</div></div></div>`;
  S.justBadge = null;
  if (ANIM && ANIM.k===k){ const a = ANIM; ANIM = null;
    AFTER.push(()=>{ countUp($('#xpNum',v), a.from, h.xp, 2200); setTimeout(()=>requestAnimationFrame(()=>{ const f=$('#wFill',v), kn=$('#wKnob',v); if(f) f.style.width=f.dataset.to+'%'; if(kn) kn.style.left=kn.dataset.to+'%'; }), a.enter?250:0); }); }
}
function hSkills(v, k){
  const h = H(k), vals = radarOf([k]);
  const list = h.skills.map(sk=>({h, sk})).sort((a,b)=>evidence(b.h,b.sk)-evidence(a.h,a.sk));
  const byCat = {}; list.forEach(({sk})=>byCat[sk.cat]=(byCat[sk.cat]||0)+evidence(h,sk));
  const weak = Object.keys(FRAMES.glo).filter(c=>c!=='label').sort((a,b)=>(byCat[a]||0)-(byCat[b]||0))[0];
  const tip = { interpersonal:'Interpersonal skills have the least evidence. Group critiques would add to them.', knowledge:'Knowledge has the least evidence. A structured course or exam would add to it.',
    creative:'Creative skills have the least evidence. Try a piece in a new style.', mastery:'Personal mastery has the least evidence. Keep your streak going.' }[weak];
  if (v.classList.contains('in')){ const z = Object.fromEntries(DIMS.map(d=>[d,.05])); AFTER.push(()=>animateRadar($('.nx-radar',v), z, vals)); }
  v.innerHTML = hobbyHead(h) + HTABS(k,'/skills') + `
  <div class="nx-card"><div class="nx-row" style="justify-content:space-between"><span class="nx-label" style="margin:0">Skill radar</span><span class="nx-link" data-act="rateSheet">${ic('info')}How skills are rated</span></div>
    ${radarSVG(vals, v.classList.contains('in') ? Object.fromEntries(DIMS.map(d=>[d,.05])) : null)}<div class="nx-insight">${ic('spark')}<span>${esc(tip)}</span></div></div>
  <div class="nx-row" style="justify-content:space-between;margin:22px 0 10px"><span class="nx-label" style="margin:0">Skill matrix</span>
    <span class="nx-row" style="gap:10px"><button class="nx-link" data-act="rateSheet" aria-label="How skills are rated">${ic('info')}</button><select class="nx-sel" data-act="frame" aria-label="Skill framework">${Object.entries(FRAMES).map(([key,f])=>`<option value="${key}" ${S.frame===key?'selected':''}>${f.label}</option>`).join('')}</select></span></div>
  <div class="nx-list">${skillRows(list, S.frame)}</div></div>`;
}

/* upload batches live in memory while they run */
const U = {};
function hVault(v, k){
  const h = H(k), b = U[k];
  let top = '';
  if (b && !b.done){
    const n = b.items.length, d = b.items.filter(i=>i.state==='done').length, fails = b.items.filter(i=>i.state==='fail');
    top = `<div class="nx-card nx-upcard"><div class="nx-row" style="justify-content:space-between"><b style="font-family:Outfit;font-size:18px;font-weight:600">Uploading ${n} file${n===1?'':'s'}</b><span class="nx-muted" id="upCount">${d} of ${n} done</span></div>
      <div class="bar"><i id="upBar" style="width:${(d/n*100).toFixed(0)}%"></i></div>
      ${fails.map(f=>`<div class="nx-alert red" style="margin-top:6px">${ic('info')}<span><b>1 file failed.</b> ${esc(f.name)} ${esc(f.err)}</span><button class="u" data-act="retry" data-u="${f.id}">Retry</button></div>`).join('')}</div>
      <div class="nx-gap"></div><div class="nx-grid">${b.items.map(upTile).join('')}</div><div class="nx-gap"></div>
      <button class="nx-btn ghost" data-act="cancelUp">Cancel upload, keep the ${d} done file${d===1?'':'s'}</button>`;
    v.innerHTML = hobbyHead(h) + HTABS(k,'/vault') + top + '</div>';
    return;
  }
  if (b && b.done){
    const ok = b.items.filter(i=>i.state==='done');
    top = `<div class="nx-alert green">${ic('check')}<span><b>${ok.length===b.items.length?'All ':''}${ok.length} file${ok.length===1?'':'s'} uploaded</b> to ${esc(h.name)}. Nothing is posted until you review it.</span></div><div class="nx-gap"></div>
      <div class="nx-grid">${ok.map(i=>{ const f = S.files.find(x=>x.id===i.id); return f ? tile(f,{check:true,menu:true}) : ''; }).join('')}</div>
      <div class="nx-btns" style="margin-top:16px"><button class="nx-btn ghost" data-act="upDone">Done</button><button class="nx-btn" data-go="h/${k}/share">Review and share</button></div>`;
    v.innerHTML = hobbyHead(h) + HTABS(k,'/vault') + top + '</div>';
    return;
  }
  const list = filesOf(k), exp = S.vexp && S.vexp[k];
  const shown = exp || list.length<=6 ? list : list.slice(0,5);
  const nNew = list.filter(f=>f.isNew).length;
  v.innerHTML = hobbyHead(h) + HTABS(k,'/vault') + `
  <div class="nx-grid">${shown.map(f=>tile(f,{newdot:true, menu:true})).join('')}
    ${shown.length<list.length ? `<button class="nx-more" data-act="hvexp"><b>+${list.length-5}</b><small>more files</small></button>` : `<button class="nx-more" data-act="upload">${ic('upload')}<small>Upload</small></button>`}</div>
  <div class="nx-act2"><button data-go="h/${k}/share"><span class="nx-ico">${ic('link')}</span><div class="nx-sp"><div class="t">Review and share</div><div class="s">${nNew?nNew+' new file'+(nNew===1?'':'s'):'Nothing new'}</div></div>${ic('chev','nx-chev')}</button>
    <button data-act="upload"><span class="nx-ico">${ic('upload')}</span><div class="nx-sp"><div class="t">Upload</div><div class="s">Photos, videos</div></div>${ic('chev','nx-chev')}</button></div>
  <div class="nx-label">Endorsements</div><div class="nx-list">${endorseRows(h.endorse.map(e=>({h,e})), true)}</div></div>`;
}
function upTile(i){
  const bg = i.thumb ? `style="background-image:url('${i.thumb}')"` : '';
  const inner = i.state==='done' ? `<span class="ok">${ic('check','',3)}</span>`
    : i.state==='fail' ? `<span class="x">${ic('x','',3)}</span>`
    : i.state==='wait' ? `<span style="display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:#52606f">${ic('clock','big',1.6)}waiting</span>`
    : `<span class="pct" data-pct="${i.id}">${Math.round(i.pct)}%</span><span class="pg"><i data-pg="${i.id}" style="width:${i.pct}%"></i></span>`;
  const icon = !i.thumb && i.state!=='wait' ? ic(i.kind==='pdf'?'file':i.kind==='audio'?'audio':i.kind==='video'?'film':'image','big',1.6) : '';
  return `<div class="nx-tile ${i.state==='fail'?'fail':''}"><div class="th" ${bg}>${icon}${inner}</div><div class="nm">${esc(i.name)}</div></div>`;
}
async function startUpload(k, files){
  if (!files.length) return;
  const h = H(k), b = U[k] = { items:[], done:false };
  files.forEach(f=>b.items.push({ id:'u'+(S.nextId++), name:f.name, size:f.size, kind:kindOf(f), pct:0, state:'wait', file:f }));
  save(); go('h/'+k+'/vault');
  await Promise.all(b.items.map(async it=>{ it.thumb = await makeThumb(it.file); BLOBS[it.id] = URL.createObjectURL(it.file); }));
  if (U[k]!==b) return;
  onVault(k) && refresh();
  const run = async it => {
    it.state = 'up'; onVault(k) && refresh();
    const total = Math.max(900, Math.min(4200, 700 + it.size/ (2.5*1024*1024) * 1000));
    const fail = it.size > 200*1024*1024;
    const t0 = performance.now();
    while (true){
      await sleep(70); if (U[k]!==b || it.state==='cancel') return;
      it.pct = Math.min(100, (performance.now()-t0)/total*100);
      if (fail && it.pct > 40){ it.state='fail'; it.err='is over 200 MB.'; onVault(k) && refresh(); return; }
      const pe = document.querySelector(`[data-pg="${it.id}"]`), pt = document.querySelector(`[data-pct="${it.id}"]`);
      if (pe) pe.style.width = it.pct+'%'; if (pt) pt.textContent = Math.round(it.pct)+'%';
      if (it.pct >= 100) break;
    }
    it.state = 'done';
    const ws = (h.workshops.find(w=>w.detected)||{}).id || null;
    S.files.unshift({ id:it.id, hobby:k, name:it.name, kind:it.kind, src:it.thumb, isNew:true, pub:false, port:false, ws, date:TODAY, mine:true });
    save(); onVault(k) && refresh();
  };
  const queue = b.items.slice(); const workers = [0,1].map(async()=>{ while (queue.length){ const it = queue.shift(); if (it.state==='wait') await run(it); } });
  await Promise.all(workers);
  if (U[k]!==b) return;
  finishUpload(k);
}
function finishUpload(k){
  const b = U[k]; if (!b) return;
  if (b.items.some(i=>i.state==='up'||i.state==='wait')) return;
  if (b.items.some(i=>i.state==='fail')) { onVault(k) && refresh(); return; }
  b.done = true;
  const ok = b.items.filter(i=>i.state==='done');
  if (ok.length){ incStreak(k, true); if (k==='art' && ok.some(i=>i.kind==='image')) { S.logs.art = false; H('art').pending = 120; S.seg.art='det'; } }
  save(); onVault(k) && refresh();
  const np = netPost(k, ok.map(i=>i.id));
  if (!np) toast(`${ok.length} file${ok.length===1?'':'s'} saved to ${H(k).name}. Private until you share.`);
}
const onVault = k => t().state.cur === 'h/'+k+'/vault';

/* ================= UPLOAD ONE ARTWORK ================= */
let DRAFT = null;
function newDraft(){ return { img: IMG+'v_paintbig.jpg', title:'My first digital painting', desc:'Orange arches over green and blue brushstrokes.', ws:'w1' }; }
function hUpload(v, k){
  const h = H(k); if (!DRAFT) DRAFT = newDraft();
  const w = h.workshops.find(x=>x.id===DRAFT.ws);
  v.innerHTML = BACKROW('Back to Vault', 'h/'+k+'/vault', 'Upload') + `
  <h1 class="nx-h1">Upload artwork</h1><div class="nx-sub">Save your creation to your ${esc(h.name)} vault.</div>
  <div class="nx-card" style="padding:0;overflow:hidden"><div style="height:180px;background:#dfe7ef url('${DRAFT.img}') center/cover"></div>
    <button class="nx-li" data-act="draftImg" style="justify-content:center;font-weight:600;font-size:16px">${ic('image')}Change image</button></div>
  <div class="nx-flabel">Artwork title</div><input class="nx-field" id="dTitle" value="${esc(DRAFT.title)}" aria-label="Artwork title">
  <div class="nx-flabel">Image description</div><input class="nx-field" id="dDesc" value="${esc(DRAFT.desc)}" aria-label="Image description">
  <div class="nx-muted" style="font-size:12px;margin-top:6px">Describe your artwork for people using screen readers.</div>
  <div class="nx-flabel">Workshop</div>
  <button class="nx-field nx-row" data-act="draftWs" style="text-align:left">${ic(h.icon)}<span class="nx-sp">${w?esc(w.t.replace(' workshop','')+', '+(w.s.match(/\d+ \w{3}/)||[''])[0]):'No workshop'}</span>${ic('chev','nx-chev')}</button>
  <div style="margin-top:14px">${w&&w.detected ? `<div class="nx-alert green">${ic('check')}<span><b>Workshop attendance confirmed.</b> Recorded for this session, so the XP counts.</span></div>`
    : `<div class="nx-alert blue">${ic('info')}<span>${w?'Trace will check this workshop with the organiser.':'Not linked to a workshop. It still counts towards your streak.'}</span></div>`}</div>
  <div style="margin-top:16px"><button class="nx-btn" data-act="draftSave">Save to Vault</button></div></div>`;
}

/* ================= REVIEW BEFORE SHARING ================= */
const SHARE = {};
function shareState(k){
  const s = SHARE[k] || (SHARE[k] = { sel:null, dest:{feed:true, ig:false, pin:false}, cap: k==='art'?'My first digital-art workshop. I finally started drawing again.':k==='piano'?'Grade 3 done. On to the recital pieces.':'First game back at Blk 412 in years. Still got it.' });
  const fresh = filesOf(k).filter(f=>f.isNew);
  if (!s.sel) s.sel = fresh.map(f=>f.id);
  s.sel = s.sel.filter(id=>fresh.some(f=>f.id===id));
  return { s, fresh };
}
function hShare(v, k){
  const h = H(k), { s, fresh } = shareState(k);
  if (!fresh.length){
    v.innerHTML = hobbyHead(h, 'h/'+k+'/vault') + `<div class="nx-wrap"><h1 class="nx-h1">Review before sharing</h1>
      <div class="nx-card" style="text-align:center;padding:28px 18px"><span class="nx-ico green" style="margin:0 auto 10px;width:52px;height:52px">${ic('check')}</span>
      <div style="font-weight:700;font-size:17px">Nothing new to share</div><div class="nx-muted" style="margin:6px 0 16px">Everything in your ${esc(h.name)} vault has been reviewed.</div>
      <button class="nx-btn sm" data-act="upload">${ic('upload')}Upload something new</button></div></div>`;
    return;
  }
  const first = fresh.find(f=>s.sel.includes(f.id)) || fresh[0];
  const w = h.workshops.find(x=>x.id===first.ws);
  const onNet = s.sel.length && fresh.filter(f=>s.sel.includes(f.id)).every(f=>f.netPost && S.posts.some(p=>p.id===f.netPost));
  if (onNet && !s.netInit){ s.dest.feed = false; s.netInit = true; }
  const n = Object.values(s.dest).filter(Boolean).length;
  const label = !s.sel.length ? 'Pick at least one file' : !n ? 'Choose where to post' : n===1 ? `Post to ${s.dest.feed?'Trace feed':s.dest.ig?'Instagram':'Pinterest'}` : `Post to ${n} places`;
  const dest = (key, logo, name, sub) => `<div class="nx-dest"><span class="lg">${logo}</span><div class="nx-sp"><div style="font-weight:600;font-size:16px">${name}</div><div class="nx-muted">${key==='feed'&&onNet?'Already posted automatically':sub}</div></div>${key==='feed'&&onNet?`<span class="nx-tag green">${ic('check')}Posted</span>`:`<button class="nx-tog ${s.dest[key]?'on':''}" role="switch" aria-checked="${s.dest[key]}" aria-label="${name}" data-act="dest" data-d="${key}"><i></i></button>`}</div>`;
  v.innerHTML = hobbyHead(h, 'h/'+k+'/vault') + `<div class="nx-wrap"><h1 class="nx-h1" style="margin-top:6px">Review before sharing</h1>
  <div class="nx-sub">Your uploads stay private in Vault until you choose where to share them.</div>
  <div class="nx-card"><div class="nx-row" style="justify-content:space-between"><b style="font-size:16.5px">${s.sel.length} of ${fresh.length} new file${fresh.length===1?'':'s'}${w?', '+esc(w.s.split(',')[0]):''}</b><span class="nx-tag">Private</span></div>
    <div class="nx-thumbs">${fresh.slice(0,5).map(f=>`<button class="${s.sel.includes(f.id)?'on':''}" style="${f.src?`background-image:url('${f.src}')`:''}" data-act="pick" data-f="${f.id}" aria-pressed="${s.sel.includes(f.id)}" aria-label="${esc(f.name)}">${f.src?'':ic(kindIcon(f.kind))}<i>${ic('check','',3)}</i></button>`).join('')}${fresh.length>5?`<span class="nx-muted" style="align-self:center">+${fresh.length-5}</span>`:''}</div>
    <div class="nx-row" style="background:#f1f5f9;border-radius:14px;padding:12px">${ic('link').replace('<svg','<svg style="width:18px;height:18px;color:#3f5570;flex:none"')}<div class="nx-sp"><div style="font-weight:700;font-size:14px">${w?esc(w.t)+', '+esc((w.s.split(', ')[1]||'')):'Not linked to a workshop'}</div><div class="nx-muted">${w&&w.detected?'Found from your booking':'You chose this'}</div></div><button class="nx-mini" style="background:#fff;border-color:#d9dde3;box-shadow:none;color:#152331" data-act="shareWs">Change</button></div>
    <div style="margin-top:6px">${dest('feed', `<img src="../assets/mark_lg.svg" alt="">`, 'Trace feed', 'People who follow you')}${dest('ig', IG, 'Instagram', 'Story on @sarah.draws')}${dest('pin', PIN, 'Pinterest', 'Your '+esc(h.name)+' board')}</div></div>
  <div class="nx-flabel">Caption</div><textarea class="nx-field" id="cap" rows="2" aria-label="Caption">${esc(s.cap)}</textarea>
  <div class="nx-muted" style="margin-top:8px">${s.dest.ig||s.dest.pin ? 'Only the places you turned on get this post.' : 'Instagram and Pinterest stay off unless you turn them on.'}</div>
  <div style="margin-top:16px"><button class="nx-btn" data-act="post" ${(!s.sel.length||!n)?'disabled':''}>${label}</button></div>
  <div style="margin-top:12px"><button class="nx-btn ghost" data-act="keepPrivate" ${!s.sel.length?'disabled':''}>Save to Vault only</button></div></div>`;
}

/* ================= TRACE FEED POST ================= */
function nPost(v, id){
  const p = S.posts.find(x=>x.id===id);
  if (!p){ v.innerHTML = BACKROW('Back','p/vault') + '<h1 class="nx-h1">Post removed</h1><div class="nx-sub">This post was undone.</div></div>'; return; }
  const fs = p.files.map(fid=>S.files.find(f=>f.id===fid)).filter(Boolean), h = H(p.hobby);
  const where = [p.dest.feed&&'Trace feed', p.dest.ig&&'Instagram', p.dest.pin&&'Pinterest'].filter(Boolean).join(', ');
  v.innerHTML = BACKROW('Back', 'n/feed', 'Trace Network') + `<h1 class="nx-h1">Your post</h1><div class="nx-sub">Shared to ${esc(where)}.</div>
  <div class="nx-card" style="padding:0;overflow:hidden"><div class="nx-row" style="padding:14px 16px"><img class="nx-ava" src="${IMG}a_sarah.jpg" alt=""><div class="nx-sp"><div style="font-weight:700">Sarah Tan</div><div class="nx-muted">${esc(h.name)}, ${esc(p.ws||'From Vault')}, just now</div></div>${ic('dots').replace('<svg','<svg style="width:20px;height:20px;color:#8b98a6"')}</div>
    <div style="display:grid;grid-template-columns:${fs.length>1?'1fr 1fr':'1fr'};gap:2px">${fs.slice(0,4).map(f=>`<div style="aspect-ratio:1;background:#dfe7ef ${f.src?`url('${f.src}')`:''} center/cover;display:flex;align-items:center;justify-content:center;color:#3f5570">${f.src?'':ic(kindIcon(f.kind),'',1.6).replace('<svg','<svg style="width:40px;height:40px"')}</div>`).join('')}</div>
    <div style="padding:14px 16px"><p style="font-size:15px;line-height:1.45">${esc(p.cap)}</p>
    <div class="nx-row" style="margin-top:12px;gap:18px;color:#3f5570;font-weight:600;font-size:14px"><button class="nx-row" style="gap:6px;${p.liked?'color:#d23e1b':''}" data-act="like" data-p="${p.id}">${ic('heart').replace('<svg','<svg style="width:20px;height:20px'+(p.liked?';fill:#d23e1b':'')+'"')}${p.likes+(p.liked?1:0)}</button><span class="nx-row" style="gap:6px">${ic('chat').replace('<svg','<svg style="width:20px;height:20px"')}${p.comments}</span></div></div></div>
  <div class="nx-gap"></div><div class="nx-alert blue">${ic('info')}<span>Shared from your Vault. ${p.dest.ig||p.dest.pin?'':'Nothing was sent anywhere else.'}</span></div></div>`;
}

/* ================= TRACE TAILOR (chat) ================= */
const PURPOSE = { dsa:{label:'DSA application', chip:'DSA application', why:'Got it. For a DSA panel I\'ll lead with your strongest pieces and verified results, then the skills behind them.'},
  uni:{label:'university application', chip:'Uni application', why:'Got it. I\'ll pull the work and skills that show initiative and follow-through, then draft the transcript for a university application.'},
  work:{label:'work interview', chip:'Work interview', why:'Got it. For an interviewer I\'ll focus on teamwork, reliability and how you learn, with one or two pieces as proof.'} };
function picksFor(p){
  const art = S.files.filter(f=>f.hobby==='art' && f.kind==='image');
  const best = art.filter(f=>f.port).concat(art.filter(f=>!f.port));
  const cert = S.files.find(f=>f.hobby==='piano'&&f.kind==='pdf'&&/cert/i.test(f.name)) || S.files.find(f=>f.kind==='pdf');
  if (p==='work') return [S.files.find(f=>f.hobby==='bball'&&f.kind==='image'), best[0], S.files.find(f=>/Practice_log/.test(f.name))].filter(Boolean).map(f=>f.id);
  if (p==='dsa') return [best[0], best[1], cert].filter(Boolean).map(f=>f.id);
  return [best[0], best[1], cert].filter(Boolean).map(f=>f.id);
}
const T = () => S.tailor;
function botSay(html, chips, extra){ T().msgs.push({ who:'bot', html, chips:chips||null, extra:extra||null }); }
function meSay(text){ T().msgs.forEach(m=>m.chips=null); T().msgs.push({ who:'me', html:esc(text) }); }
let TYPING = false;
async function botTurn(fn, ms=900){ TYPING = true; save(); refreshTailor(); await sleep(ms); TYPING = false; fn(); save(); refreshTailor(); }
function refreshTailor(){ if (t().state.cur==='p/tailor'){ refresh(); requestAnimationFrame(()=>t().setY(99999)); } }
function tailorStart(){ S.tailor = { msgs:[], stage:0 }; botSay('Who is this skills transcript for? I\'ll pick the work and skills that matter to them.', ['DSA application','Uni application','Work interview']); }
function tailorInput(text){
  const s = T(), q = text.trim(); if (!q) return;
  const low = q.toLowerCase();
  if (/start over|restart|again|reset/.test(low)){ meSay(q); tailorStart(); save(); refreshTailor(); return; }
  if (s.stage===0 || /dsa|uni|college|nus|smu|ntu|poly|work|job|intern|interview/.test(low) && s.stage!==1){
    const p = /dsa/.test(low) ? 'dsa' : /uni|college|nus|smu|ntu|poly|school/.test(low) ? 'uni' : /work|job|intern|interview/.test(low) ? 'work' : null;
    meSay(q);
    if (!p){ botTurn(()=>botSay('I can shape it for a DSA application, a university application or a work interview. Which one is it for?', ['DSA application','Uni application','Work interview'])); return; }
    s.purpose = p; s.picks = picksFor(p); s.stage = 1;
    botTurn(()=>{ botSay(esc(PURPOSE[p].why)); }, 900).then(()=>botTurn(()=>{
      const names = s.picks.map(id=>S.files.find(f=>f.id===id)).filter(Boolean).map(f=>`<b>${esc(f.name)}</b>`);
      const list = names.length>1 ? names.slice(0,-1).join(', ')+' and '+names[names.length-1] : names.join('');
      botSay(`From your Vault, ${list} look like the strongest fit. Want to include your endorsements too?`, ['Yes, include them','Skip endorsements']);
    }, 1200));
    return;
  }
  if (s.stage===1){
    const yes = /yes|include|sure|ok|yep/.test(low), no = /skip|no|without/.test(low);
    meSay(q);
    if (!yes && !no){ botTurn(()=>botSay('Should I add your endorsements?', ['Yes, include them','Skip endorsements'])); return; }
    s.endorse = yes; s.stage = 2;
    const ends = []; real().forEach(k=>H(k).endorse.forEach(e=>{ settle(e); if (e.st==='received') ends.push(e); }));
    s.ends = yes ? ends.slice(0,2).map(e=>e.n.split(',')[0]) : [];
    S.pf.purpose = s.purpose; S.pf.picks = s.picks; S.pf.endorse = yes; S.pf.sec.endorse = yes;
    botTurn(()=>{
      botSay(yes ? `Added ${s.ends.map(n=>esc(n)+'\'s').join(' and ')} endorsements. Your Skills Transcript is ready to preview.` : 'Okay, no endorsements. Your Skills Transcript is ready to preview.', null, 'summary');
    }, 1100);
    return;
  }
  meSay(q);
  botTurn(()=>botSay('Your transcript is ready. Open it below, or say "start over" to tailor it for someone else.', ['Start over']));
}
function pTailor(v){
  if (!T().msgs.length) tailorStart();
  if (T().auto){ const a = T().auto; T().auto = null; setTimeout(()=>tailorInput(PURPOSE[a].chip), 250); }
  const s = T(), lvl = levelInfo(H('art'));
  const msgs = s.msgs.map((m,i)=>{
    if (m.who==='me') return `<div class="nx-msg me"><div class="bub">${m.html}</div></div>`;
    let out = `<div class="nx-msg"><span class="nx-mark">${MARK}</span><div class="bub">${m.html}</div></div>`;
    if (m.chips && i===s.msgs.length-1 && !TYPING) out += `<div class="nx-qr">${m.chips.map(c=>`<button data-act="chip" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>`;
    if (m.extra==='summary') out += `<div class="nx-card" style="animation:msgin .3s both"><div class="nx-row" style="gap:8px;margin-bottom:8px">${ic('file').replace('<svg','<svg style="width:20px;height:20px;color:#417f4c"')}<b style="font-family:Outfit;font-weight:600;font-size:17px">Skills Transcript: preview</b></div>
      <div class="nx-check">${ic('check','',3)}${(s.picks||[]).length} works: Digital Art, ${esc(lvl.cur.t)}</div><div class="nx-check">${ic('check','',3)}${s.endorse?(s.ends||[]).length+' endorsements attached':'No endorsements'}</div><div class="nx-check">${ic('check','',3)}Ready to export as PDF</div></div>
      <div style="margin-top:12px"><button class="nx-btn" data-go="p/portfolio">View my Skills Transcript</button></div>`;
    return out;
  }).join('');
  v.innerHTML = BACKROW('Back to Trace Vault', 'p/vault', 'Trace Tailor') + `<div class="nx-chat">${msgs}${TYPING?`<div class="nx-msg"><span class="nx-mark">${MARK}</span><div class="bub"><span class="nx-typing"><i></i><i></i><i></i></span></div></div>`:''}</div>
  <form class="nx-compose" data-act="send"><input id="tIn" placeholder="Message Trace Tailor" autocomplete="off" aria-label="Message Trace Tailor"><button type="submit" aria-label="Send">${ic('send')}</button></form></div>`;
  const f = $('form.nx-compose', v); f.addEventListener('submit', e=>{ e.preventDefault(); const i=$('#tIn',v); const val=i.value; i.value=''; tailorInput(val); });
}

/* ================= PORTFOLIO ================= */
function pfData(){
  const inc = real().filter(k=>S.pf.hobbies[k]);
  const focus = inc[0] || 'art', fh = H(focus);
  const hours = inc.reduce((a,k)=>a+(H(k).unit==='hours'?H(k).xp:H(k).hours),0);
  const ws = inc.reduce((a,k)=>a+(H(k).wsCount||0),0);
  const strong = []; const catsStrong = new Set();
  inc.forEach(k=>H(k).skills.forEach(sk=>{ if (evidence(H(k),sk)>=6){ strong.push(sk.n); catsStrong.add(sk.cat); } }));
  const arts = S.files.filter(f=>f.hobby==='art'&&f.kind==='image').length;
  const picks = (S.pf.purpose && S.pf.picks ? S.pf.picks : S.files.filter(f=>f.port).map(f=>f.id)).map(id=>S.files.find(f=>f.id===id)).filter(f=>f && inc.includes(f.hobby));
  const ends = []; inc.forEach(k=>H(k).endorse.forEach(e=>{ settle(e); if (e.st==='received') ends.push({h:H(k),e}); }));
  const F = FRAMES.glo; const strongIn = [...catsStrong].map(c=>({creative:'Intellectual and Creative Skills',mastery:'Personal Mastery',knowledge:'Disciplinary Knowledge',interpersonal:'Interpersonal Skills'})[c]);
  return { inc, focus, fh, hours, ws, strong, strongIn, arts, picks, ends };
}
function pPortfolio(v){
  const d = pfData(), p = S.pf.purpose, L = levelInfo(d.fh);
  const tg = (on, act, key) => `<button class="nx-tog ${on?'on':''}" role="switch" aria-checked="${on}" data-act="${act}" data-k="${key}"><i></i></button>`;
  const hsub = { art:`${L.cur?levelInfo(H('art')).cur.t:''}, ${d.arts} artworks`, piano:'ABRSM Grade 3, merit', bball:`CCA point guard, ${H('bball').xp} hours` };
  const secs = [['matrix','Skill Matrix','Mapped to SMU Graduate Learning Outcomes'],['endorse','Endorsements',`${d.ends.length} from instructors and coaches`],['work','Best work',`${d.picks.length} Vault files you picked`],['miles','Milestones and certificates','Singpass-verified records'],['xp','XP and levels','Trace progress numbers']];
  const acc = {only:'Only you',view:'Anyone with the link can view',req:'Anyone with the link can view and request',invite:'Only people you invite'}[S.pf.access];
  v.innerHTML = `<div class="nx-sky"></div>${skyDeco()}<div class="nx-wrap"><div class="nx-top"></div><div class="nx-hrow"><button class="nx-back" data-act="back" data-to="p/vault">${BACK}Back</button>${p?`<span class="nx-where">Tailored</span>`:''}</div>
  <h1 class="nx-h1">${p ? 'Tailored '+esc(d.fh.name)+' Portfolio' : 'Customise portfolio'}</h1>
  ${p ? `<div class="nx-sub">A ${esc(PURPOSE[p].label)} portfolio shaped from Sarah's workshops, Vault uploads, skills and milestones.</div>` : ''}
  ${pfCard(d, L)}
  <div class="nx-gap"></div>
  <div class="nx-ai"><div><div class="nx-row"><span class="nx-mark">${MARK}</span><div><div style="font-family:Outfit;font-weight:600;font-size:17px">Trace Tailor</div><div class="kick">SKILLS TRANSCRIPT</div></div></div>
    <p class="nx-muted" style="font-size:14.5px;margin:10px 0 12px">${p?`Tailored for a ${esc(PURPOSE[p].label)}. Pick another to re-tailor.`:'Who is this transcript for? I\'ll pick the work and skills that matter to them.'}</p>
    <div class="nx-opts">${Object.entries(PURPOSE).map(([k,x])=>`<button class="nx-pill sm ${p===k?'on':''}" data-act="tailorFor" data-p="${k}">${k==='uni'?'University':esc(x.chip)}</button>`).join('')}</div></div></div>
  ${S.pf.sec.work ? `<div class="nx-row" style="justify-content:space-between"><span class="nx-label">Best work</span><button class="nx-link" data-act="editWork">${ic('edit')}Edit</button></div>
    <div class="nx-works">${d.picks.map(f=>`<button data-act="file" data-f="${f.id}" style="${f.src?`background-image:url('${f.src}')`:''}" aria-label="${esc(f.name)}"></button>`).join('')}<button class="add" data-act="editWork">${ic('plus')}Add</button></div>` : ''}
  <div class="nx-label">Hobbies to include</div>
  <div class="nx-list">${real().map(k=>`<div class="nx-li"><div class="nx-sp"><div class="t">${esc(H(k).name)}</div><div class="s">${esc(hsub[k]||subtitle(H(k)))}</div></div>${tg(S.pf.hobbies[k],'pfHobby',k)}</div>`).join('')}</div>
  <div class="nx-label">Sections</div>
  <div class="nx-list">${secs.map(([k,n,s])=>`<div class="nx-li"><div class="nx-sp"><div class="t">${n}</div><div class="s">${esc(s)}</div></div>${tg(S.pf.sec[k],'pfSec',k)}</div>`).join('')}</div>
  <div style="margin-top:18px"><button class="nx-btn" data-act="export" ${d.inc.length?'':'disabled'}>${ic('download')}Export PDF</button></div>
  <div class="nx-label">Share your vault</div>
  <div class="nx-card" style="padding:12px 14px"><button class="nx-row" style="width:100%;text-align:left" data-act="access"><span class="nx-ico green">${ic(S.pf.access==='only'?'lock':'link')}</span><div class="nx-sp"><div style="font-weight:600;font-size:15.5px">${esc(acc)}</div><div class="nx-muted">${S.pf.access==='only'?'The link is switched off':'Only files you mark public are shown'}</div></div>${ic('chev','nx-chev')}</button>
    <div class="nx-linkbox"><span>trace.sg/v/sarah-tan</span><button class="nx-link" data-act="copyLink" id="copyBtn">Copy link</button></div></div>
  ${p?`<div class="nx-muted" style="margin-top:12px">The portfolio link updates whenever Sarah adds new artwork to Trace Vault.</div>`:''}</div>`;
  if (!PFSEEN){ PFSEEN = true; $$('.pf-card [data-count]', v).forEach(el=>countUp(el, 0, +el.dataset.count, 1400)); } else v.querySelector('.pf-card').classList.add('seen');
}
let PFSEEN = false;
/* ---------- portfolio summary card and transcript (29 Oct) ---------- */
const HCOL = { art:'#3a6ea5', piano:'#417f4c', bball:'#d9822b', motion:'#7a5bb5', guitar:'#b0466a' };
const HMETA = {
  art:  { org:'ArtHaus Studio', role:'Workshop participant', period:'Jul 2026 to now', start:19 },
  piano:{ org:'NAFA Keys, ABRSM', role:'Student and recital performer', period:'2018 to now', start:0 },
  bball:{ org:'Blk 412 Regulars, school CCA', role:'Point guard', period:'2014 to 2020, back since Jul 2026', start:18 }
};
function srand(seed){ let s = seed; return ()=>(s = (s*9301+49297)%233280)/233280; }
const DAY0 = Date.UTC(2026,6,1), SPAN = 123, TODAYD = 78; // 1 Jul to 31 Oct, today is 17 Sep
function journeyEvents(k){
  const h = H(k), m = HMETA[k] || { start:10 }, r = srand(k.length*977 + (h.wsCount||3)*31);
  const ev = [], n = Math.min(6, h.wsCount||4), a = m.start;
  for (let i=0;i<n;i++) ev.push({ d: a + (TODAYD-2-a)*(i+.5)/n + (r()-.5)*3, t:'ws' });
  const ups = S.files.filter(f=>f.hobby===k).length;
  for (let i=0;i<Math.min(4,ups);i++) ev.push({ d: a+6 + (TODAYD-a-8)*(i+.3)/4 + (r()-.5)*2, t:'up' });
  if (k==='art') ev.push({ d:33, t:'ms', n:'ArtHaus course' }, { d:44, t:'ms', n:'City Lights series' });
  if (k==='bball') ev.push({ d:18, t:'ms', n:'Back on court' });
  if (k==='piano') ev.push({ d:51, t:'ms', n:'Grade 4 prep' });
  [8, 22, 39].forEach((o,i)=>{ if (TODAYD+o < SPAN-2) ev.push({ d:TODAYD+o + i*3, t:'next' }); });
  if (k==='piano') ev.push({ d:115, t:'nextms', n:'NAFA Keys recital' });
  return ev.map(e=>({ ...e, d: Math.max(1, Math.min(SPAN-1, e.d)) }));
}
function weekBars(k){ const h = H(k), r = srand(h.name.length*131 + 7), hrs = h.unit==='hours' ? h.xp : h.hours; const w = 8; const raw = Array.from({length:w},(_,i)=>.35+r()*.65 + i*.04); const s = raw.reduce((a,b)=>a+b,0); return raw.map(x=>x/s*hrs*.45); }
function pfCard(d, L){
  const inc = d.inc;
  const lanes = inc.map((k,li)=>{ const ev = journeyEvents(k), c = HCOL[k]||'#3a6ea5';
    return `<div class="jr-lane"><span class="jr-nm">${esc(H(k).name)}</span><div class="jr-track">${ev.map((e,i)=>{ const x = (e.d/SPAN*100).toFixed(2);
      const del = (.25 + li*.12 + e.d/SPAN*.9).toFixed(2);
      if (e.t==='ms' || e.t==='nextms') return `<i class="jr-ms ${e.t==='nextms'?'fut':''}" style="left:${x}%;--c:${c};animation-delay:${del}s" title="${esc(e.n)}">${ic('star','',2.4)}</i>`;
      return `<i class="jr-${e.t}" style="left:${x}%;--c:${c};animation-delay:${del}s"></i>`; }).join('')}</div></div>`; }).join('');
  const months = ['Jul','Aug','Sep','Oct'];
  const bars = (()=>{ const sums = Array(8).fill(0); inc.forEach(k=>weekBars(k).forEach((v,i)=>sums[i]+=v)); const mx = Math.max(...sums,1); return sums.map((v,i)=>`<i style="height:${(18+v/mx*82).toFixed(0)}%;animation-delay:${(.5+i*.06).toFixed(2)}s"></i>`).join(''); })();
  const works = S.files.filter(f=>inc.includes(f.hobby) && f.src && (f.kind==='image'||f.kind==='video'));
  const mos = works.slice(0,4).map(f=>`<span style="background-image:url('${f.src}')"></span>`).join('');
  const places = [...new Set(inc.flatMap(k=>(H(k).workshops||[]).map(w=>w.s.split(',')[0].replace(/^(Practice at |Lesson with )/,''))))].filter(p=>!/today|Tue|Sat|Sun|Fri/.test(p)).slice(0,3);
  const skillRows = []; inc.forEach(k=>H(k).skills.forEach(sk=>skillRows.push({ k, sk, ev:evidence(H(k),sk) }))); skillRows.sort((a,b)=>b.ev-a.ev);
  const ends = d.ends;
  const chips = inc.map(k=>{ const h = H(k), li = levelInfo(h); return `<span class="pf-hob" style="--c:${HCOL[k]||'#3a6ea5'}"><span class="cg mini" style="${ring(li.pct,26,HCOL[k]||'#3a6ea5','#e7edf3')}"><span class="in">${hobbyIcon(h)}</span></span><span><b>${esc(h.name)}</b><small>${esc(li.cur.t)}, ${fmt(h.xp)} ${unitXP(h)}</small></span></span>`; }).join('');
  return `<div class="nx-card pf-card">
    <div class="pf-head"><span class="pf-av"><img src="${IMG}a_sarah.jpg" alt=""></span><div class="nx-sp"><div class="pf-name">Sarah Tan</div><div class="nx-muted">${inc.length ? inc.map(k=>esc(H(k).name)).join(' and ').replace(/ and (?=.* and )/g,', ') : 'No hobbies picked'}, Jul to Oct 2026</div></div><span class="pf-ver">${ic('check','',3)}Verified</span></div>
    ${inc.length ? `<div class="jr" aria-label="Activity timeline from July to October">
      <div class="jr-months">${months.map(m=>`<span>${m}</span>`).join('')}</div>
      <div class="jr-body"><span class="jr-today" style="left:calc(64px + (100% - 64px) * ${(TODAYD/SPAN).toFixed(4)})"></span>${lanes}</div>
      <div class="jr-key"><span><i class="jr-ws k"></i>Sessions</span><span><i class="jr-up k"></i>Uploads</span><span><i class="jr-ms k">${ic('star','',2.4)}</i>Milestones</span><span><i class="jr-next k"></i>Booked</span><span><i class="jr-tk"></i>Today</span></div></div>` : ''}
    <div class="pf-bento">
      <div class="pf-t hrs"><div class="v"><b data-count="${d.hours}">${d.hours}</b> hours</div><div class="pf-bars">${bars}</div><small>Logged across ${inc.length} hobb${inc.length===1?'y':'ies'}, last 8 weeks</small></div>
      <div class="pf-t wk">${works.length?`<div class="pf-mos">${mos}${works.length>4?`<span class="more">+${works.length-4}</span>`:''}</div>`:''}<div class="v"><b data-count="${works.length}">${works.length}</b> pieces of work</div></div>
      <div class="pf-t ws"><div class="v"><b data-count="${d.ws}">${d.ws}</b> sessions</div><small>${places.length?'At '+esc(places.join(', ')):'Workshops and lessons'}</small></div>
      <div class="pf-t sk"><div class="v"><b data-count="${d.strong.length}">${d.strong.length}</b> strong skills</div>${skillRows.slice(0,3).map((r,i)=>`<div class="pf-meter"><span>${esc(r.sk.n)}</span><i><u style="width:${Math.min(100,r.ev/8*100).toFixed(0)}%;background:${HCOL[r.k]};animation-delay:${(.7+i*.12).toFixed(2)}s"></u></i></div>`).join('')}</div>
    </div>
    ${chips ? `<div class="pf-hobs">${chips}</div>` : ''}
    <div class="pf-foot"><div class="nx-sp">${ends.length ? `<div class="pf-ends"><span class="stack">${ends.slice(0,3).map(({e})=>`<img src="${IMG}${e.a}" alt="">`).join('')}</span><span>Endorsed by <b>${esc(ends[0].e.n)}</b>${ends.length>1?` and ${ends.length-1} other${ends.length>2?'s':''}`:''}</span></div>` : `<div class="pf-ends"><span class="nx-muted">No endorsements yet.</span> <button class="nx-link" data-go="h/${d.focus}/vault">Ask an instructor</button></div>`}
      <div class="pf-glo">${d.strongIn.length ? d.strongIn.map(s=>`<span>${esc(s)}</span>`).join('') : '<span class="none">Keep logging to build strong skills</span>'}</div></div>
      <button class="nx-ico" style="border-radius:50%;flex:none" data-act="rateSheet" aria-label="How skills are rated">${ic('info')}</button></div>
  </div>`;
}

/* transcript: a formal record in the style of a school co-curricular transcript */
function attain(d){
  const hrs = d.hours, ms = d.inc.reduce((a,k)=>a+H(k).milestones.length,0);
  const lead = d.inc.includes('bball') ? 3 : d.inc.includes('piano') ? 2 : 1;
  const serv = Math.min(4, 1 + d.ends.length + (S.posts.length?1:0));
  const lv = [ ['Participation', hrs>=140?4:hrs>=90?3:hrs>=40?2:1, `${hrs} hours over ${d.inc.length} activit${d.inc.length===1?'y':'ies'}`],
    ['Achievement', Math.min(4, 1+ms), `${ms} verified milestone${ms===1?'':'s'} and certificate${ms===1?'':'s'}`],
    ['Leadership', lead, lead>=3?'Point guard, school CCA team':lead===2?'Recital accompanist, piano ensemble':'No leadership role recorded yet'],
    ['Service', serv, d.ends.length ? `${d.ends.length} peer and instructor endorsement${d.ends.length===1?'':'s'}` : 'Shares work and settings with workshop peers'] ];
  const score = lv.reduce((a,x)=>a+x[1],0);
  return { lv, overall: score>=12?'Excellent':score>=8?'Good':'Fair' };
}
function docHTML(){
  const d = pfData(), p = S.pf.purpose, sec = S.pf.sec, F = FRAMES.glo;
  const rows = []; d.inc.forEach(k=>H(k).skills.forEach(sk=>rows.push({h:H(k),k,sk,ev:evidence(H(k),sk)})));
  rows.sort((a,b)=>b.ev-a.ev);
  const A = attain(d), pips = (n,of=4)=>`<span class="tx-pips">${Array.from({length:of},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
  const docNo = 'TRC-26-' + String(1040 + d.hours).padStart(4,'0') + '-ST';
  const lead = d.inc.length ? `Sarah is a ${d.inc.map(k=>H(k).name.toLowerCase()).join(' and ').replace(/ and (?=.* and )/g,', ')} learner with ${d.hours} logged hours and ${d.ws} instructor-led sessions since July 2026.${d.strong.length?` Her strongest evidence is in ${esc(d.strong.slice(0,2).join(' and ').toLowerCase())}.`:''}${p?` This record is arranged for a ${esc(PURPOSE[p].label)}.`:''}` : 'No activities are included in this transcript yet.';
  const pfor = p ? esc(PURPOSE[p].label).replace(/^./,c=>c.toUpperCase()) : 'General use';
  return `<div class="nx-doc tx">
    <div class="tx-band"><div class="tx-brand"><img src="../assets/mark_lg.svg" alt=""><span>trace</span></div><div class="tx-docno">Record no. ${docNo}</div></div>
    <div class="tx-title"><div><h2>Skills and Co-Curricular Transcript</h2><div class="tx-sub">Issued ${TODAY}. Activities from 1 Jul 2026 to ${TODAY}.</div></div>
      <svg class="tx-seal" viewBox="0 0 80 80" aria-label="Verified seal"><defs><path id="sealp" d="M40,40 m-29,0 a29,29 0 1,1 58,0 a29,29 0 1,1 -58,0"/></defs><circle cx="40" cy="40" r="37" fill="none" stroke="#1f4e79" stroke-width="1.5"/><circle cx="40" cy="40" r="22" fill="#1f4e79"/><text font-size="7.6" letter-spacing="1.6" fill="#1f4e79" font-family="DM Sans" font-weight="700"><textPath href="#sealp">VERIFIED BY TRACE WITH SINGPASS</textPath></text><path d="M31 40.5l6 6 12-13" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div class="tx-part">
      <div><span>Name</span><b>Sarah Tan</b></div><div><span>Trace ID</span><b>ST-0417-26</b></div>
      <div><span>Prepared for</span><b>${pfor}</b></div><div><span>Identity</span><b>Singpass verified</b></div>
    </div>
    <div class="tx-sum"><img src="${IMG}a_sarah.jpg" alt=""><p>${lead}</p></div>

    <h3>Co-curricular attainment</h3>
    <div class="tx-att"><div class="tx-overall"><small>Overall attainment</small><b>${A.overall}</b><small>Based on four domains</small></div>
      <div class="tx-dom">${A.lv.map(([n,l,b])=>`<div><div class="r"><b>${n}</b>${pips(l)}<em>Level ${l}</em></div><small>${esc(b)}</small></div>`).join('')}</div></div>

    <h3>Activity record</h3>
    <div class="tx-acts">${d.inc.map(k=>{ const h = H(k), m = HMETA[k] || {org:'Trace',role:'Member',period:'2026'}, li = levelInfo(h); const hrs = h.unit==='hours'?h.xp:h.hours;
      return `<div class="tx-act"><div class="a1"><b>${esc(h.name)}</b><span>${esc(m.org)}</span></div><div class="a2"><span>${esc(m.role)}</span><span>${esc(m.period)}</span></div><div class="a3"><b>${hrs}</b><small>hours</small></div><div class="a3"><b>${esc(li.cur.t.replace('Level ','L').replace('Grade ','G'))}</b><small>${esc(h.titles && h.titles[+li.cur.n] ? h.titles[+li.cur.n] : 'level')}</small></div></div>`; }).join('')}</div>

    ${sec.matrix?`<h3>Skills, mapped to SMU Graduate Learning Outcomes</h3>
    <table class="tx-sk"><tr><th>Skill</th><th>Outcome</th><th>Rating</th><th class="n">Evidence</th></tr>${rows.map(({h,sk,ev})=>`<tr><td><b>${esc(sk.n)}</b><small>${esc(sk.src)}</small></td><td>${esc(F[sk.cat])}</td><td>${pips(ev>=6?3:ev>=3?2:1,3)}<small>${RATE(ev)}</small></td><td class="n">${ev}</td></tr>`).join('')}</table>`:''}

    ${sec.miles?`<h3>Achievements and certificates</h3>
    <div class="tx-ach">${d.inc.flatMap(k=>H(k).milestones.map(m=>({k,m}))).map(({k,m})=>`<div><i class="${/verified/i.test(m.s)?'v':''}">${/verified/i.test(m.s)?ic('check','',3):ic('star','',2.4)}</i><div><b>${esc(m.t)}</b><small>${esc(H(k).name)}, ${esc(m.s)}</small></div></div>`).join('')}</div>`:''}

    ${sec.endorse&&d.ends.length?`<h3>Referees</h3><div class="tx-ref">${d.ends.map(({e})=>`<div><q>${esc(e.q)}</q><div class="who"><img src="${IMG}${e.a}" alt=""><span><b>${esc(e.n)}</b><small>${esc(e.r)}</small></span></div></div>`).join('')}</div>`:''}

    ${sec.work&&d.picks.length?`<h3>Selected work</h3><div class="tx-work">${d.picks.slice(0,4).map(f=>`<figure><div style="${f.src?`background-image:url('${f.src}')`:''}"></div><figcaption>${esc(f.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' '))}</figcaption></figure>`).join('')}</div>`:''}

    ${sec.xp?`<h3>Trace levels</h3><div class="tx-xp">${d.inc.map(k=>`<div><b>${esc(H(k).name)}</b><span>${fmt(H(k).xp)} ${unitXP(H(k))}, ${esc(levelInfo(H(k)).cur.t)}</span></div>`).join('')}</div>`:''}

    <div class="tx-sign"><div><svg viewBox="0 0 140 34" class="sig"><path d="M4 24c10-14 18-20 22-12s-6 14 2 10 12-16 18-12-2 14 6 12 10-10 16-8 4 8 12 6 14-10 22-10 14 6 26 2" fill="none" stroke="#1f4e79" stroke-width="1.6" stroke-linecap="round"/></svg><span>Trace Records</span><small>Issuing office</small></div>
      <div class="tx-qr" aria-hidden="true">${Array.from({length:49},(_,i)=>`<i class="${[0,1,2,7,9,14,15,16,4,5,6,11,13,18,19,20,28,29,30,35,37,42,43,44,24,10,22,26,32,38,46,40].includes(i)?'on':''}"></i>`).join('')}</div></div>
    <div class="foot"><span>Check this record at trace.sg/v/sarah-tan using no. ${docNo}</span><span>Page 1 of 1</span></div></div>`;
}

function fitTx(){ const fr = $('.nview .tx-frame'), pg = fr && fr.firstElementChild; if (!pg) return;
  const z = fr.classList.contains('zoom') ? 1 : fr.clientWidth / 600; pg.style.transform = `scale(${z})`; fr.style.height = Math.ceil(pg.offsetHeight*z) + 'px'; }
function pTranscript(v){
  v.innerHTML = BACKROW('Back to portfolio', 'p/portfolio', 'PDF preview') + `<h1 class="nx-h1">Your Skills Transcript</h1><div class="nx-sub">Check it, then save it as a PDF or share the link.</div>
  <div class="tx-tools"><span class="nx-muted">A4 preview</span><button class="nx-mini" data-act="txZoom" id="txZoomBtn">${ic('search')}Zoom in</button></div>
  <div class="tx-frame"><div class="tx-page">${docHTML()}</div></div><div class="nx-gap"></div>
  <button class="nx-btn" data-act="print">${ic('download')}Download PDF</button>
  <div style="margin-top:12px"><button class="nx-btn ghost" data-act="copyLink">${ic('link')}Copy share link</button></div>
  <div class="nx-muted" style="margin-top:10px;text-align:center">Download opens your browser's print window. Choose "Save as PDF".</div></div>`;
  requestAnimationFrame(fitTx); setTimeout(fitTx, 500);
  $$('.tx-page img', v).forEach(im=>im.addEventListener('load', fitTx, { once:true }));
}


/* ================= TRACE NETWORK: Vault uploads post automatically ================= */
function netPost(k, ids, cap){
  if (!S.autoNet || !ids.length) return null;
  const h = H(k), files = ids.map(id=>S.files.find(f=>f.id===id)).filter(Boolean); if (!files.length) return null;
  const w = h.workshops && h.workshops.find(x=>x.id===files[0].ws);
  const p = { id:'p'+(S.nextId++), hobby:k, files:files.map(f=>f.id), cap: cap || defaultCap(k, files, w), dest:{feed:true, ig:false, pin:false}, auto:true,
    ws: w ? w.s.split(',')[0] : null, likes:0, comments:0, prevPub:{}, at:Date.now() };
  files.forEach(f=>{ p.prevPub[f.id] = f.pub; f.pub = true; f.netPost = p.id; });
  S.posts.unshift(p); save();
  [[2200,2,0],[5200,3,1],[9000,4,2]].forEach(([ms,l,c])=>setTimeout(()=>{ const q = S.posts.find(x=>x.id===p.id); if (!q) return; q.likes = l + (q.likes>l?q.likes-l:0); q.comments = Math.max(q.comments,c); save(); if (/^n\//.test(t().state.cur)) refresh(); }, ms));
  setTimeout(()=>toast(`Posted to Trace Network`, 'users', { label:'Undo', fn:()=>{ unpost(p.id); toast('Removed from Trace Network', 'refresh'); } }), 700);
  return p;
}
function defaultCap(k, files, w){
  const n = files.length, h = H(k);
  if (k==='bball') return 'Back on court at Blk 412 tonight.';
  if (n===1) return `New in ${h.name}: ${files[0].name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ')}.`;
  return `${n} new ${h.name} pieces${w?' from the '+w.t.toLowerCase():''}.`;
}
function unpost(id){
  const p = S.posts.find(x=>x.id===id); if (!p) return;
  p.files.forEach(fid=>{ const f = S.files.find(x=>x.id===fid); if (f){ f.pub = p.prevPub[fid] || false; if (f.netPost===id) f.netPost = null; } });
  S.posts = S.posts.filter(x=>x.id!==id); save(); refresh();
}
const SEEDFEED = [
  { id:'s1', who:'Sarah Tan', av:'a_sarah.jpg', sub:'Instagram, 2 min ago', subIc:'ig', img:'c_sketch.jpg', text:'My first digital-art workshop: I finally started drawing again.', likes:18, comments:4 },
  { id:'s2', who:'Pinterest', logo:'pin', sub:'Digital Art collection', img:'v_paintbig.jpg', text:"Trace added the artwork and process notes to Sarah's collection.", ok:'Shared, with your OK' },
  { id:'s3', who:'Emma', initial:'E', sub:'Instagram Story, via Trace', subIc:'ig', img:'c_portrait.jpg', text:'Look at my DRAWWINGGGG', likes:9, comments:1, story:true } ];
function postCard(p){
  const fs = p.files.map(fid=>S.files.find(f=>f.id===fid)).filter(Boolean), h = H(p.hobby);
  const where = [p.dest.feed&&'Trace Network', p.dest.ig&&'Instagram', p.dest.pin&&'Pinterest'].filter(Boolean).join(' + ');
  const ago = p.at ? Math.max(0, Math.round((Date.now()-p.at)/60000)) : 0;
  return `<div class="nx-card nx-post" style="padding:0;overflow:hidden">
    <div class="nx-row" style="padding:14px 16px"><img class="nx-ava" src="${IMG}a_sarah.jpg" alt=""><div class="nx-sp"><div style="font-weight:700">Sarah Tan</div>
      <div class="nx-muted nx-row" style="gap:5px"><img src="../assets/mark_lg.svg" alt="" style="width:15px;height:13px">${esc(where)}, ${ago?ago+' min ago':'just now'}</div></div>
      <button class="nx-link" data-act="postMenu" data-p="${p.id}" aria-label="Post options">${ic('dots')}</button></div>
    <button data-go="n/post/${p.id}" style="display:grid;width:100%;grid-template-columns:${fs.length>1?'1fr 1fr':'1fr'};gap:2px">${fs.slice(0,4).map(f=>`<div style="aspect-ratio:${fs.length>1?'1':'16/10'};background:#dfe7ef ${f.src?`url('${f.src}')`:''} center/cover;display:flex;align-items:center;justify-content:center;color:#3f5570">${f.src?'':ic(kindIcon(f.kind),'',1.6).replace('<svg','<svg style="width:40px;height:40px"')}</div>`).join('')}</button>
    <div style="padding:12px 16px 14px"><p style="font-size:15px;line-height:1.45">${esc(p.cap)}</p>
      <div class="nx-row" style="margin-top:10px;gap:16px;color:#3f5570;font-size:14px"><button class="nx-row" style="gap:6px;${p.liked?'color:#d23e1b':''}" data-act="like" data-p="${p.id}">${ic('heart').replace('<svg','<svg style="width:20px;height:20px'+(p.liked?';fill:#d23e1b':'')+'"')}</button>
      <span class="nx-row" style="gap:6px">${ic('chat').replace('<svg','<svg style="width:19px;height:19px"')}</span><span>${p.likes+(p.liked?1:0)} likes, ${p.comments} comments</span></div>
      ${p.auto?`<div class="nx-row" style="gap:6px;margin-top:10px;color:#347241;font-size:13px;font-weight:600">${ic('check','',2.6).replace('<svg','<svg style="width:15px;height:15px"')}Shared from your ${esc(h.name)} Vault</div>`:''}</div></div>`;
}
function seedCard(p){
  const liked = S.seedLiked[p.id];
  const head = p.logo==='pin' ? `<span class="nx-mark" style="width:40px;height:40px">${PIN.replace('<svg','<svg style="width:26px;height:26px"')}</span>`
    : p.initial ? `<span class="nx-mark" style="width:40px;height:40px;background:#e9eff5;font-weight:700;color:#3f5570">${p.initial}</span>` : `<img class="nx-ava" src="${IMG+p.av}" alt="">`;
  const img = `<div style="margin:0 16px;border-radius:14px;aspect-ratio:${p.story?'16/9':'16/9'};background:#dfe7ef url('${IMG+p.img}') center/cover"></div>`;
  return `<div class="nx-card nx-post" style="padding:0;overflow:hidden"><div class="nx-row" style="padding:14px 16px">${head}<div class="nx-sp"><div style="font-weight:700">${esc(p.who)}</div><div class="nx-muted nx-row" style="gap:5px">${p.subIc==='ig'?IG.replace('<svg','<svg style="width:13px;height:13px"'):''}${esc(p.sub)}</div></div>${ic('dots').replace('<svg','<svg style="width:18px;height:18px;color:#8b98a6"')}</div>
    ${p.story?'':img}<div style="padding:12px 16px 14px"><p style="font-size:15px;line-height:1.45">${esc(p.text)}</p>
    ${p.ok?`<div class="nx-row" style="gap:8px;margin-top:10px;color:#347241;font-weight:600;font-size:14px">${ic('check','',2.4).replace('<svg','<svg style="width:16px;height:16px"')}${esc(p.ok)}</div>`
      :`<div class="nx-row" style="margin-top:10px;gap:16px;color:#3f5570;font-size:14px"><button style="${liked?'color:#d23e1b':''}" data-act="seedLike" data-p="${p.id}">${ic('heart').replace('<svg','<svg style="width:20px;height:20px'+(liked?';fill:#d23e1b':'')+'"')}</button>${ic('chat').replace('<svg','<svg style="width:19px;height:19px"')}<span>${p.story?'View story':(p.likes+(liked?1:0))+' likes, '+p.comments+' comments'}</span></div>`}</div>${p.story?`<div style="padding:0 0 16px">${img}</div>`:''}</div>`;
}
function nFeed(v){
  v.innerHTML = TOP() + netTabs('n/feed') + `
    <div class="nx-card nx-row"><span class="nx-row" style="gap:2px">${PIN.replace('<svg','<svg style="width:22px;height:22px"')}${IG.replace('<svg','<svg style="width:22px;height:22px"')}</span><div class="nx-sp"><div style="font-weight:700">Pinterest + Instagram</div><div class="nx-muted">Ask before each share</div></div><span class="nx-tag green">${ic('check')}6 connected</span></div>
    <div class="nx-card nx-row"><span class="nx-ico green">${ic('users')}</span><div class="nx-sp"><div style="font-weight:700">Auto-share Vault uploads</div><div class="nx-muted">New uploads post to Trace Network only. Instagram and Pinterest still ask.</div></div><button class="nx-tog ${S.autoNet?'on':''}" role="switch" aria-checked="${S.autoNet}" aria-label="Auto-share Vault uploads" data-act="autoNet"><i></i></button></div>
    <div class="nx-gap"></div>
    ${S.posts.map(postCard).join('<div class="nx-gap"></div>')}${S.posts.length?'<div class="nx-gap"></div>':''}
    ${SEEDFEED.map(seedCard).join('<div class="nx-gap"></div>')}</div>`;
}

/* ================= SHEETS ================= */
function rateSheet(){
  sheet(`<h3>How skills are rated</h3><div class="nx-muted" style="font-size:15px">Each skill gets a label from the evidence in your Vault. You review it before you share.</div>
  <div class="nx-list" style="border:1.5px solid #e3e9ef;box-shadow:none;margin-top:14px">
    <div class="nx-li"><span class="nx-tag">Emerging</span><span>1 to 2 pieces of evidence</span></div>
    <div class="nx-li"><span class="nx-tag" style="background:#d5e3f1">Building</span><span>3 to 5 pieces of evidence</span></div>
    <div class="nx-li"><span class="nx-tag dark">Strong</span><span>6 or more pieces, or an endorsement</span></div></div>
  <div style="background:#f1f5f9;border-radius:14px;padding:12px 14px;margin-top:14px"><div class="nx-label" style="margin:0 0 4px">Example</div><b>Personal Mastery: Strong</b><div class="nx-muted">8 workshops, 12 artworks and 2 endorsements in your Vault.</div></div>
  <div style="margin-top:18px"><button class="nx-btn" data-close>Got it</button></div>`);
}
function xpSheet(k){
  const h = H(k), L = levelInfo(h);
  const rows = h.unit==='hours' ? [['Check in at a game','Snap a team photo at the court','+2 h'],['Log a training session','Add it manually','+1.5 h'],['Coach endorsement','Unlocks the MVP badge','Badge']]
   : [[k==='art'?'Confirm an artwork':'Confirm a practice', 'Trace detects it, you confirm it', plusXP(h,h.pending||120)],['Attend a booked '+(k==='art'?'workshop':'lesson'),'Counted when you check in','+80 XP'],['Keep a weekly streak','One '+(k==='art'?'upload or workshop':'practice')+' a week for 4 weeks','+100 XP']];
  sheet(`<h3>How ${h.unit==='hours'?'levels':'XP'} work${h.unit==='hours'?'':'s'}</h3><div class="nx-muted" style="font-size:15px">${h.unit==='hours'?'Levels follow the hours you play. ':'XP shows what you have done in '+esc(h.name)+'. It never goes down. '}Trace Credits are what you spend.</div>
  <div class="nx-list" style="border:1.5px solid #e3e9ef;box-shadow:none;margin-top:14px">${rows.map(r=>`<div class="nx-li"><div class="nx-sp"><div class="t" style="font-size:15.5px">${esc(r[0])}</div><div class="s">${esc(r[1])}</div></div><span class="nx-tag green">${esc(r[2])}</span></div>`).join('')}</div>
  <div class="nx-label">Levels</div><div class="nx-opts">${h.levels.slice(L.i, L.i+3).map((l,i)=>`<span class="nx-pill sm ${i===0?'on':''}">${esc(l.t)}${i===0?' now':' at '+fmt(l.at)+' '+unitXP(h)}</span>`).join('')}</div>
  <div style="margin-top:18px"><button class="nx-btn" data-close>Got it</button></div>`);
}
function wsSheet(k, current, onSave, removable=true){
  const h = H(k); let sel = current;
  const draw = () => { const el = sheet(`<h3>Which ${k==='art'?'workshop':'session'} is this from?</h3><div class="nx-muted" style="font-size:15px">Trace linked these files to the ${k==='art'?'workshop':'session'} you attended. Change it if that is wrong.</div>
    ${h.workshops.concat([{id:null,t:'No '+(k==='art'?'workshop':'session'),s:'Keep these files in '+h.name+' only'}]).map(w=>`<button class="nx-radio ${sel===w.id?'on':''}" data-w="${w.id}"><span class="dot"></span><div class="nx-sp"><div class="t">${esc(w.t)}</div><div class="s">${esc(w.s)}</div></div>${w.detected?'<span class="nx-tag green">Detected</span>':''}</button>`).join('')}
    <div style="margin-top:16px"><button class="nx-btn" data-save>Save</button></div>${removable?`<div style="margin-top:10px"><button class="nx-btn ghost" style="color:#b3261e;border-color:#f0c4bf" data-rm>Remove link</button></div>`:''}`);
    $$('.nx-radio', el).forEach(b=>b.addEventListener('click', ()=>{ sel = b.dataset.w==='null'?null:b.dataset.w; draw(); }));
    $('[data-save]', el).addEventListener('click', ()=>{ closeSheet(); onSave(sel); });
    const rm = $('[data-rm]', el); if (rm) rm.addEventListener('click', ()=>{ closeSheet(); onSave(null); });
  };
  draw();
}
function fileSheet(id){
  const f = S.files.find(x=>x.id===id); if (!f) return;
  const h = H(f.hobby), w = h.workshops && h.workshops.find(x=>x.id===f.ws);
  const blob = BLOBS[f.id];
  const big = f.kind==='video' && blob ? `<div class="nx-big"><video src="${blob}" controls playsinline></video></div>`
    : f.kind==='image' && blob ? `<div class="nx-big" style="background-image:url('${blob}')"></div>`
    : f.src ? `<div class="nx-big" style="background-image:url('${f.src}')">${f.kind==='video'||f.kind==='audio'?`<span class="nx-ico" style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.92)">${ic('play')}</span>`:''}</div>`
    : `<div class="nx-big">${ic(kindIcon(f.kind),'',1.4)}</div>`;
  let confirmRm = false;
  const draw = () => { const el = sheet(`${big}<h3 style="word-break:break-all">${esc(f.name)}</h3><div class="nx-muted" style="font-size:14px">${esc(h.name)}, ${w?esc(w.t):'No workshop linked'}, ${esc(f.date)}</div>
    <div class="nx-list" style="border:1.5px solid #e3e9ef;box-shadow:none;margin-top:14px">
      <div class="nx-li"><div class="nx-sp"><div class="t" style="font-size:15.5px">Show on my public link</div><div class="s">Off means only you can see it</div></div><button class="nx-tog ${f.pub?'on':''}" data-t="pub" role="switch" aria-checked="${f.pub}"><i></i></button></div>
      <div class="nx-li"><div class="nx-sp"><div class="t" style="font-size:15.5px">Use in portfolio</div><div class="s">Shows under Best work</div></div><button class="nx-tog ${f.port?'on':''}" data-t="port" role="switch" aria-checked="${f.port}"><i></i></button></div>
      ${h.workshops?`<button class="nx-li" data-ws><div class="nx-sp"><div class="t" style="font-size:15.5px">Linked ${f.hobby==='art'?'workshop':'session'}</div><div class="s">${w?esc(w.t):'None'}</div></div>${ic('chev','nx-chev')}</button>`:''}</div>
    <div style="margin-top:16px"><button class="nx-btn ghost" style="color:#b3261e;border-color:#f0c4bf" data-rm>${ic('trash')}${confirmRm?'Tap again to remove':'Remove from Vault'}</button></div>`);
    $$('[data-t]', el).forEach(b=>b.addEventListener('click', ()=>{ f[b.dataset.t] = !f[b.dataset.t]; if (b.dataset.t==='port' && S.pf.picks){ S.pf.picks = f.port ? S.pf.picks.concat(f.id) : S.pf.picks.filter(x=>x!==f.id); } save(); draw(); refresh(); }));
    const wsb = $('[data-ws]', el); if (wsb) wsb.addEventListener('click', ()=>wsSheet(f.hobby, f.ws, v=>{ f.ws = v; save(); refresh(); fileSheet(id); }, false));
    $('[data-rm]', el).addEventListener('click', ()=>{ if (!confirmRm){ confirmRm = true; draw(); return; } removeFile(f.id); closeSheet(); toast(`${f.name} removed`, 'trash'); });
  };
  draw();
}
function removeFile(id){
  S.files = S.files.filter(x=>x.id!==id);
  Object.values(U).forEach(b=>{ if (b) b.items = b.items.filter(i=>i.id!==id); });
  if (S.pf.picks) S.pf.picks = S.pf.picks.filter(x=>x!==id);
  save(); refresh();
}
function badgeSheet(k, i){
  const h = H(k), b = h.badges[i], on = badgeOn(h,b), pr = badgeProgress(h,b);
  sheet(`<div class="nx-celebrate"><div class="medal" style="${on?'':'background:#eef1f4;color:#8b98a6;box-shadow:none'}">${ic(b.i).replace('<svg','<svg style="width:44px;height:44px"')}</div>
    <h3>${esc(b.n)}</h3><div class="nx-muted" style="font-size:15px">${esc(b.s)}</div>
    ${on ? `<div style="margin-top:12px"><span class="nx-tag green">${ic('check')}Unlocked</span></div>` : pr ? `<div style="margin:16px 0 4px" class="nx-upcard"><div class="bar"><i style="width:${Math.min(100,pr[0]/pr[1]*100)}%"></i></div></div><div class="nx-muted">${fmt(Math.min(pr[0],pr[1]))} of ${fmt(pr[1])} ${esc(pr[2])}</div>` : ''}</div>
    <div style="margin-top:18px"><button class="nx-btn" data-close>${on?'Nice':'Got it'}</button></div>`);
}
function levelUpSheet(k){
  const h = H(k), L = levelInfo(h);
  sheet(`<div class="nx-celebrate"><div class="medal">${esc(L.label)}</div><h3>${esc(L.cur.t)} unlocked</h3>
    <div class="nx-muted" style="font-size:15px">You reached ${esc(h.name)} ${esc(L.cur.t)}${h.titles[+L.cur.n]?', '+esc(h.titles[+L.cur.n]):''}. ${L.next?`Next stop: ${esc(L.next.t)} at ${fmt(L.next.at)} ${unitXP(h)}.`:'That is the top level.'}</div></div>
    <div style="margin-top:18px"><button class="nx-btn green" data-close>Keep going</button></div>`, { confetti:true });
}
function reqSheet(k, eid){
  const h = H(k), e = h.endorse.find(x=>x.id===eid);
  const first = e.n.replace(/^(Ms|Mr|Mrs|Dr) /,'');
  const el = sheet(`<div class="nx-row"><img class="nx-ava" src="${IMG+e.a}" alt=""><div><h3 style="margin:0">Ask ${esc(e.n)}</h3><div class="nx-muted">${esc(e.r)}</div></div></div>
    <div class="nx-flabel">Message</div><textarea class="nx-field" rows="4" id="reqMsg">Hi ${esc(e.n)}, could you endorse my ${esc(h.name)} progress? It would really help my portfolio. Thank you! Sarah</textarea>
    <div class="nx-muted" style="margin-top:8px">${esc(first)} sees your ${esc(h.name)} level and the files you made public.</div>
    <div style="margin-top:16px"><button class="nx-btn" data-send>Send request</button></div>`);
  $('[data-send]', el).addEventListener('click', ()=>{ e.st='requested'; e.reqAt = Date.now(); save(); closeSheet(); refresh(); toast(`Request sent to ${e.n}`);
    setTimeout(()=>{ settle(e); refresh(); toast(`${e.n} endorsed you: “${e.q.slice(0,46)}…”`, 'star'); }, 6200); });
}
function accessSheet(){
  let sel = S.pf.access;
  const opts = [['only','Only you','The link does not work for anyone else'],['view','Anyone with the link can view','Public files, skills and endorsements'],['req','Anyone with the link can view and request','They can also ask you for an endorsement'],['invite','Only people you invite','Enter emails, for example a DSA panel']];
  const draw = () => { const el = sheet(`<h3>Link access</h3><div class="nx-muted" style="font-size:15px">Choose who can open trace.sg/v/sarah-tan.</div>
    ${opts.map(([k,t,s])=>`<button class="nx-radio ${sel===k?'on':''}" data-k="${k}"><span class="dot"></span><div class="nx-sp"><div class="t">${t}</div><div class="s">${s}</div></div></button>`).join('')}
    ${sel==='invite'?`<input class="nx-field" style="margin-top:10px" placeholder="panel@school.edu.sg" aria-label="Invite by email">`:''}
    <div style="margin-top:16px"><button class="nx-btn" data-done>Done</button></div>`);
    $$('.nx-radio', el).forEach(b=>b.addEventListener('click', ()=>{ sel=b.dataset.k; draw(); }));
    $('[data-done]', el).addEventListener('click', ()=>{ S.pf.access = sel; save(); closeSheet(); refresh(); toast('Link access updated'); }); };
  draw();
}
function workPicker(){
  const inc = pfData().inc; const imgs = S.files.filter(f=>inc.includes(f.hobby) && f.src);
  let sel = new Set(pfData().picks.map(f=>f.id));
  const draw = () => { const el = sheet(`<h3>Pick your best work</h3><div class="nx-muted" style="font-size:15px">${sel.size} picked. These show in your portfolio and transcript.</div>
    <div class="nx-grid" style="margin-top:14px">${imgs.map(f=>`<button class="nx-tile" data-f="${f.id}" style="${sel.has(f.id)?'outline:3px solid #152331;outline-offset:-3px':''}"><div class="th" style="background-image:url('${f.src}')">${sel.has(f.id)?`<span class="ok">${ic('check','',3)}</span>`:''}</div><div class="nm">${esc(f.name)}</div></button>`).join('')}</div>
    <div style="margin-top:16px"><button class="nx-btn" data-done>Use ${sel.size} file${sel.size===1?'':'s'}</button></div>`);
    $$('[data-f]', el).forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.f; sel.has(id)?sel.delete(id):sel.add(id); const y=el.scrollTop; draw(); $('#nsheet .sh').scrollTop=y; }));
    $('[data-done]', el).addEventListener('click', ()=>{ S.pf.picks = [...sel]; S.files.forEach(f=>{ if (inc.includes(f.hobby) && f.src) f.port = sel.has(f.id); }); save(); closeSheet(); refresh(); }); };
  draw();
}
function postedSheet(p){
  const k = p.hobby;
  const row = (on, logo, n) => `<div class="nx-li"><span class="lg" style="width:40px;height:40px;border:1px solid #e3e9ef;border-radius:12px;display:flex;align-items:center;justify-content:center">${logo}</span><div class="nx-sp t" style="font-size:15.5px">${n}</div>${on?`<span class="nx-tag green">${ic('check')}Posted</span>`:`<span class="nx-tag grey">Not shared</span>`}</div>`;
  const others = !p.dest.ig && !p.dest.pin;
  const el = sheet(`<div class="nx-row"><span class="nx-ico" style="width:46px;height:46px;border-radius:50%;background:#417f4c;color:#fff">${ic('check','',3)}</span><div><h3 style="margin:0">Posted to ${p.dest.feed?'Trace feed':p.dest.ig?'Instagram':'Pinterest'}${(p.dest.feed+p.dest.ig+p.dest.pin)>1?' and more':''}</h3><div class="nx-muted">Shared from your Vault</div></div></div>
    <div class="nx-label">Where it went</div><div class="nx-list" style="border:1.5px solid #e3e9ef;box-shadow:none">
    ${row(p.dest.feed,'<img src="../assets/mark_lg.svg" alt="" style="width:22px;height:19px">','Trace feed')}${row(p.dest.ig,IG.replace('<svg','<svg style="width:22px;height:22px"'),'Instagram')}${row(p.dest.pin,PIN.replace('<svg','<svg style="width:22px;height:22px"'),'Pinterest')}</div>
    <div class="nx-alert blue" style="margin-top:14px">${ic('info')}<span>${others?'Nothing was sent anywhere else.':'Only the places marked Posted got it.'}</span><button class="u" data-undo>Undo</button></div>
    <div class="nx-btns" style="margin-top:16px"><button class="nx-btn ghost" data-done>Done</button><button class="nx-btn" data-view>View post</button></div>`, { locked:true });
  $('[data-undo]', el).addEventListener('click', ()=>{ S.posts = S.posts.filter(x=>x.id!==p.id); p.files.forEach(id=>{ const f=S.files.find(x=>x.id===id); if(f){ f.isNew=true; f.pub=p.prevPub[id]; } }); SHARE[k]=null; save(); closeSheet(); refresh(); toast('Post removed. Files are private again.', 'refresh'); });
  $('[data-done]', el).addEventListener('click', ()=>{ closeSheet(); go('h/'+k+'/vault'); });
  $('[data-view]', el).addEventListener('click', ()=>{ closeSheet(); go('n/post/'+p.id); });
}
const ADDABLE = { ARTS:[['pottery','Pottery','pot'],['film','Film photo','camera'],['callig','Calligraphy','brush'],['motion','3D / Motion','cube']],
  MUSIC:[['guitar','Guitar','guitar'],['ukulele','Ukulele','note'],['drums','Drums','target'],['choir','Choir','users']],
  SPORTS:[['climb','Climbing','zap'],['run','Running','flame'],['badminton','Badminton','target'],['swim','Swimming','globe']] };
function addHobbySheet(cat){
  const free = ADDABLE[cat].filter(([k])=>!S.hobbies[k] || S.hobbies[k].sugg);
  const el = sheet(`<h3>Add a ${cat.toLowerCase()} hobby</h3><div class="nx-muted" style="font-size:15px">Trace starts tracking once you log your first session.</div>
    <div class="nx-list" style="border:1.5px solid #e3e9ef;box-shadow:none;margin-top:14px">${free.length?free.map(([k,n,i])=>`<button class="nx-li" data-k="${k}" data-n="${n}" data-i="${i}"><span class="nx-ico">${ic(i)}</span><div class="nx-sp t">${n}</div>${ic('plus','nx-chev')}</button>`).join(''):'<div class="nx-li nx-muted">You have added them all.</div>'}</div>`);
  $$('[data-k]', el).forEach(b=>b.addEventListener('click', ()=>{ const k=b.dataset.k;
    S.hobbies[k] = { key:k, name:b.dataset.n, cat, icon:b.dataset.i, isNew:true };
    if (!S.order.includes(k)) S.order.push(k);
    save(); closeSheet(); refresh(); toast(`${b.dataset.n} added to your hobbies`); }));
}
function newHobbySheet(k){
  const h = H(k);
  const el = sheet(`<div class="nx-row"><span class="nx-ico" style="width:52px;height:52px;border-radius:50%">${ic(h.icon)}</span><div><h3 style="margin:0">${esc(h.name)}</h3><div class="nx-muted">New hobby</div></div></div>
    <p class="nx-muted" style="font-size:15px;margin:14px 0">Trace starts your ${esc(h.name)} journey after your first session. Book a beginner session, or log one you already did.</p>
    <button class="nx-btn" data-find>Find a beginner session</button>
    <div style="margin-top:10px"><button class="nx-btn ghost" style="color:#b3261e;border-color:#f0c4bf" data-rm>Remove from my hobbies</button></div>`);
  $('[data-find]', el).addEventListener('click', ()=>{ closeSheet(); go('3071:1079'); });
  $('[data-rm]', el).addEventListener('click', ()=>{ S.order = S.order.filter(x=>x!==k); delete S.hobbies[k]; save(); closeSheet(); refresh(); toast(`${h.name} removed`, 'trash'); });
}
function suggSheet(k){
  const s = SUGG[k];
  const el = sheet(`<div class="nx-row"><span class="nx-ico" style="width:52px;height:52px;border-radius:50%;background:#fff3ef;color:#c4512e">${ic(s.icon)}</span><div><h3 style="margin:0">${esc(s.name)}</h3><div class="nx-muted">Suggested by Trace</div></div></div>
    <p style="font-size:15px;line-height:1.45;color:#3f5570;margin:14px 0">${esc(s.why)}</p>
    <button class="nx-btn" data-view>${k==='pottery'?'View the Wheel-throwing taster':'See beginner sessions'}</button>
    <div style="margin-top:10px"><button class="nx-btn ghost" data-add>Add to my hobbies</button></div>`);
  $('[data-view]', el).addEventListener('click', ()=>{ closeSheet(); go(s.session); });
  $('[data-add]', el).addEventListener('click', ()=>{ H(k).sugg=false; H(k).isNew=true; save(); closeSheet(); refresh(); toast(`${s.name} added to your hobbies`); });
}

/* ================= LOGIC ================= */
function bumpSkills(k, n=1){
  const h = H(k); const which = { art:['Composition','Creative confidence'], piano:['Practice discipline'], bball:['Teamwork','Fitness routine'] }[k] || [];
  h.skills.forEach(sk=>{ if (which.includes(sk.n)) sk.extra = (sk.extra||0) + n; });
}
function addXP(k, amt){
  const h = H(k), before = lvlIndex(h), badgesBefore = h.badges.map(b=>badgeOn(h,b));
  ANIM = { k, from:h.xp }; h.xp = Math.round((h.xp + amt)*10)/10; h.lastAdd = amt; S.gained = (S.gained||0) + (h.unit==='hours' ? amt*20 : amt);
  if (h.unit!=='hours') h.hours = (h.hours||0) + (amt>=80?3:1);
  const up = lvlIndex(h) > before;
  h.badges.forEach((b,i)=>{ if (!badgesBefore[i] && badgeOn(h,b)) S.justBadge = k+i; });
  return up;
}
function incStreak(k, silent){
  const h = H(k); if (!h.streak) return;
  const st = h.streak; if (st.done >= st.of) return;
  st.done++;
  if (st.done >= st.of && !st.bonus){ st.bonus = true;
    if (h.unit!=='hours'){ h.xp += 100; S.gained = (S.gained||0) + 100; if (!silent) setTimeout(()=>toast(`${st.title} complete! +100 XP bonus`, 'flame'), 900); }
    else if (!silent) setTimeout(()=>toast(`${st.title} complete!`, 'flame'), 900); }
}
async function confirmLog(k){
  const h = H(k);
  if (h.detect.photo){
    const files = await pickFiles('image/*', false, 'environment');
    if (files.length){ const th = await makeThumb(files[0]); const id = 'u'+(S.nextId++); BLOBS[id] = URL.createObjectURL(files[0]);
      S.files.unshift({ id, hobby:k, name:'Blk412_team_'+TODAY.split(' ').slice(0,2).join('')+'.jpg', kind:'image', src:th, isNew:true, pub:false, port:false, ws:'b1', date:TODAY, mine:true }); setTimeout(()=>netPost(k, [id]), 2400); }
    else { toast('No photo taken. Try again when you are at the court.', 'camera'); return; }
  }
  const amt = h.pending; S.logs[k] = true; h.teamLogs = (h.teamLogs||6)+1;
  const before = lvlIndex(h); addXP(k, amt); incStreak(k); bumpSkills(k); const up = lvlIndex(h) > before; save(); refresh();
  toast(`${plusXP(h, amt)} added to ${h.name}`);
  if (up) setTimeout(()=>levelUpSheet(k), 1000);
}
const MANPH = {};
async function manSnap(k){
  const files = await pickFiles('image/*', false, 'environment'); if (!files.length) return;
  const th = await makeThumb(files[0]); if (!th){ toast('That photo could not be read. Try again.', 'camera'); return; }
  MANPH[k] = { th, blob: URL.createObjectURL(files[0]) }; refresh();
}
function manualLog(k){
  const h = H(k), sel = (S.manKind && S.manKind[k]) || 0, [kind, amt] = h.manual.kinds[sel];
  const ph = MANPH[k]; if (ph){ const id = 'u'+(S.nextId++); BLOBS[id] = ph.blob; const d = TODAY.split(' ');
    S.files.unshift({ id, hobby:k, name:kind.replace(/\s+/g,'_')+'_'+d[0]+d[1]+'.jpg', kind:'image', src:ph.th, isNew:true, pub:false, port:false, ws:null, date:TODAY, mine:true });
    MANPH[k] = null; setTimeout(()=>netPost(k, [id]), 2400); }
  const before = lvlIndex(h); addXP(k, amt); incStreak(k); bumpSkills(k); const up = lvlIndex(h) > before; S.seg[k] = 'det'; save(); refresh();
  toast(`${kind} logged. ${plusXP(h, amt)} added`);
  if (up) setTimeout(()=>levelUpSheet(k), 1000);
}
function doPost(k){
  const { s, fresh } = shareState(k); const cap = $('#cap'); if (cap) s.cap = cap.value;
  const files = fresh.filter(f=>s.sel.includes(f.id)), h = H(k);
  const ex = !s.dest.feed && files.every(f=>f.netPost) ? S.posts.find(p=>p.id===files[0].netPost) : null;
  if (ex){ ex.dest.ig = ex.dest.ig || s.dest.ig; ex.dest.pin = ex.dest.pin || s.dest.pin; if (s.cap) ex.cap = s.cap; files.forEach(f=>f.isNew=false); SHARE[k]=null; save(); refresh(); postedSheet(ex); return; }
  const w = h.workshops.find(x=>x.id===files[0].ws);
  const p = { id:'p'+(S.nextId++), hobby:k, files:files.map(f=>f.id), cap:s.cap, dest:{...s.dest}, ws: w ? w.s.split(',')[0] : null, likes: 3, comments: 0, prevPub:{} };
  files.forEach(f=>{ p.prevPub[f.id] = f.pub; f.isNew = false; if (s.dest.feed) f.pub = true; });
  S.posts.unshift(p); SHARE[k] = null; save(); refresh(); postedSheet(p);
  setTimeout(()=>{ const pp = S.posts.find(x=>x.id===p.id); if (pp){ pp.likes += 4; pp.comments = 2; save(); if (t().state.cur==='n/post/'+p.id) refresh(); } }, 5000);
}

/* ================= EVENTS ================= */
function cur(){ return t().state.cur; }
function hobbyOf(){ const m = cur().match(/^h\/(\w+)/); return m ? m[1] : null; }
const ACT = {
  back(el){ const to = el.dataset.to; if (history.state && history.state.d > 0) history.back(); else go(to||'p/hobbies'); },
  addHobby(el){ addHobbySheet(el.dataset.cat); }, newHobby(el){ newHobbySheet(el.dataset.k); }, sugg(el){ suggSheet(el.dataset.k); },
  suggest(){ S.sugg = true; Object.entries(SUGG).forEach(([k,s])=>{ if (!S.hobbies[k]){ S.hobbies[k] = { key:k, name:s.name, cat:s.cat, icon:s.icon, sugg:true }; S.order.push(k); } }); save(); refresh(); toast('3 hobbies suggested from your skills radar', 'spark'); },
  unsugg(){ S.order = S.order.filter(k=>!H(k).sugg); Object.keys(SUGG).forEach(k=>{ if (S.hobbies[k] && S.hobbies[k].sugg) delete S.hobbies[k]; }); S.sugg = false; save(); refresh(); },
  rateSheet(){ rateSheet(); }, xpSheet(){ xpSheet(hobbyOf()); },
  radarToggle(el){ const k = el.dataset.k; S.radarOff[k] = !S.radarOff[k]; save(); refresh(); },
  toggleSkill(el){ el.classList.toggle('open'); el.setAttribute('aria-expanded', el.classList.contains('open')); },
  showAll(){ SHOWALL = !SHOWALL; refresh(); },
  vfilter(el){ VFILTER = el.dataset.k; VEXP = false; refresh(); }, vexp(){ VEXP = true; refresh(); },
  hvexp(){ S.vexp = S.vexp||{}; S.vexp[hobbyOf()] = true; refresh(); },
  file(el, e){ if (e.target.closest('[data-act="tileMenu"]')) return; fileSheet(el.dataset.f); },
  tileMenu(el, e){ e.stopPropagation(); const id = el.dataset.f; $$('.nx-pop').forEach(p=>p.remove());
    const pop = document.createElement('div'); pop.className = 'nx-pop';
    pop.innerHTML = `<button data-m="ws">${ic('link')}Change workshop</button><button data-m="view">${ic('info')}View details</button><button class="red" data-m="rm">${ic('x')}Remove</button>`;
    el.closest('.nx-tile').appendChild(pop);
    pop.addEventListener('click', ev=>{ ev.stopPropagation(); const m = ev.target.closest('[data-m]'); if (!m) return; pop.remove(); const f = S.files.find(x=>x.id===id); if (!f) return;
      if (m.dataset.m==='ws') wsSheet(f.hobby, f.ws, v=>{ f.ws = v; save(); refresh(); toast(v?'Workshop link updated':'Workshop link removed','link'); });
      if (m.dataset.m==='view') fileSheet(id);
      if (m.dataset.m==='rm'){ removeFile(id); toast(`${f.name} removed`,'trash'); } });
    setTimeout(()=>document.addEventListener('click', function off(){ pop.remove(); document.removeEventListener('click', off, true); }, true), 0); },
  vaultUpload(){ const keys = real(); const el = sheet(`<h3>Upload to which hobby?</h3>${keys.map(k=>`<button class="nx-radio" data-k="${k}"><span class="nx-ico">${ic(H(k).icon)}</span><div class="nx-sp"><div class="t">${esc(H(k).name)}</div><div class="s">${filesOf(k).length} files</div></div></button>`).join('')}`);
    $$('[data-k]', el).forEach(b=>b.addEventListener('click', ()=>{ closeSheet(); go('h/'+b.dataset.k+'/vault'); setTimeout(()=>ACT.upload(), 350); })); },
  upload(){ const k = hobbyOf(); const opts = k==='art' ? [['one','Upload one artwork','Add a title and link it to a workshop','image'],['many','Add several files','Photos, videos and PDFs at once','upload'],['cam','Take a photo','Use your camera','camera']]
      : [['many','Add files','Photos, videos, audio and PDFs','upload'],['cam','Take a photo','Use your camera','camera']];
    const el = sheet(`<h3>Upload to ${esc(H(k).name)}</h3><div class="nx-muted" style="font-size:15px">Uploads stay private until you review and share them.</div>${opts.map(([m,t,s,i])=>`<button class="nx-radio" data-m="${m}"><span class="nx-ico">${ic(i)}</span><div class="nx-sp"><div class="t">${t}</div><div class="s">${s}</div></div></button>`).join('')}`);
    $$('[data-m]', el).forEach(b=>b.addEventListener('click', async ()=>{ const m = b.dataset.m; closeSheet();
      if (m==='one'){ DRAFT = null; go('h/'+k+'/upload'); return; }
      const files = await pickFiles(m==='cam'?'image/*':'image/*,video/*,audio/*,application/pdf', m!=='cam', m==='cam'?'environment':null);
      startUpload(k, files); })); },
  retry(el){ const k = hobbyOf(), b = U[k]; const it = b && b.items.find(i=>i.id===el.dataset.u); if (!it) return;
    toast(`${it.name} is still over 200 MB. Trim it and upload again.`, 'info'); b.items = b.items.filter(i=>i!==it); finishUpload(k); refresh(); },
  cancelUp(){ const k = hobbyOf(), b = U[k]; if (!b) return; b.items.forEach(i=>{ if (i.state!=='done') i.state='cancel'; }); b.items = b.items.filter(i=>i.state==='done');
    const n = b.items.length; if (!n){ U[k] = null; refresh(); toast('Upload cancelled'); return; } b.done = true; save(); refresh(); toast(`Upload cancelled. ${n} file${n===1?'':'s'} kept.`); },
  upDone(){ U[hobbyOf()] = null; refresh(); },
  reqEndorse(el){ reqSheet(el.dataset.h, el.dataset.e); },
  logMode(el){ S.seg[hobbyOf()] = el.dataset.m; save(); refresh(); },
  manKind(el){ S.manKind = S.manKind||{}; S.manKind[hobbyOf()] = +el.dataset.i; refresh(); },
  manLog(){ manualLog(hobbyOf()); },
  manSnap(){ manSnap(hobbyOf()); },
  manPhX(){ MANPH[hobbyOf()] = null; refresh(); },
  confirmLog(){ confirmLog(hobbyOf()); },
  badge(el){ badgeSheet(hobbyOf(), +el.dataset.i); },
  mile(el){ const m = H(hobbyOf()).milestones[+el.dataset.i]; sheet(`<div class="nx-row"><span class="nx-ico green" style="width:52px;height:52px">${ic(m.i)}</span><div><h3 style="margin:0">${esc(m.t)}</h3><div class="nx-muted">${esc(m.s)}</div></div></div><p style="font-size:15px;line-height:1.5;color:#3f5570;margin:16px 0">${esc(m.d)}</p><span class="nx-tag green">${ic('check')}Included in your transcript</span><div style="margin-top:18px"><button class="nx-btn" data-close>Done</button></div>`); },
  draftImg: async ()=>{ const f = await pickFiles('image/*', false); if (!f.length) return; DRAFT.title = f[0].name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' '); DRAFT.img = await makeThumbBig(f[0]); DRAFT.blob = URL.createObjectURL(f[0]); refresh(); },
  draftWs(){ const k = hobbyOf(); keepDraft(); wsSheet(k, DRAFT.ws, v=>{ DRAFT.ws = v; refresh(); }, false); },
  draftSave(){ const k = hobbyOf(); keepDraft(); const id = 'u'+(S.nextId++);
    S.files.unshift({ id, hobby:k, name:(DRAFT.title||'Untitled')+'.jpg', kind:'image', src:DRAFT.img, desc:DRAFT.desc, isNew:true, pub:false, port:false, ws:DRAFT.ws, date:TODAY, mine:true });
    if (DRAFT.blob) BLOBS[id] = DRAFT.blob;
    S.logs[k] = false; H(k).pending = DRAFT.ws ? 120 : 60; S.seg[k] = 'det'; incStreak(k, true); const cap = DRAFT.title; DRAFT = null; save();
    go('h/'+k); setTimeout(()=>toast('Saved to Vault. Confirm it below so the XP counts.'), 300); setTimeout(()=>netPost(k, [id], 'New in '+H(k).name+': '+cap+'.'), 2600); },
  pick(el){ const k = hobbyOf(), { s } = shareState(k); keepCap(k); const id = el.dataset.f; s.sel = s.sel.includes(id) ? s.sel.filter(x=>x!==id) : s.sel.concat(id); refresh(); },
  dest(el){ const k = hobbyOf(), { s } = shareState(k); keepCap(k); s.dest[el.dataset.d] = !s.dest[el.dataset.d]; refresh(); },
  shareWs(){ const k = hobbyOf(), { s, fresh } = shareState(k); keepCap(k); const first = fresh.find(f=>s.sel.includes(f.id)) || fresh[0];
    wsSheet(k, first.ws, v=>{ fresh.filter(f=>s.sel.includes(f.id)).forEach(f=>f.ws=v); save(); refresh(); }); },
  post(){ doPost(hobbyOf()); },
  keepPrivate(){ const k = hobbyOf(), { s, fresh } = shareState(k); fresh.filter(f=>s.sel.includes(f.id)).forEach(f=>f.isNew=false); SHARE[k]=null; save(); toast('Kept private in your Vault', 'lock'); go('h/'+k+'/vault'); },
  like(el){ const p = S.posts.find(x=>x.id===el.dataset.p); if (p){ p.liked = !p.liked; save(); refresh(); } },
  seedLike(el){ S.seedLiked[el.dataset.p] = !S.seedLiked[el.dataset.p]; save(); refresh(); },
  autoNet(){ S.autoNet = !S.autoNet; save(); refresh(); toast(S.autoNet?'New Vault uploads will post to Trace Network':'New Vault uploads stay private', S.autoNet?'users':'lock'); },
  postMenu(el, e){ e.stopPropagation(); const id = el.dataset.p, p = S.posts.find(x=>x.id===id); if (!p) return;
    const sh = sheet(`<h3>Post options</h3><button class="nx-radio" data-m="vault"><span class="nx-ico">${ic('image')}</span><div class="nx-sp"><div class="t">Open in ${esc(H(p.hobby).name)} Vault</div></div></button>
      <button class="nx-radio" data-m="share"><span class="nx-ico">${ic('link')}</span><div class="nx-sp"><div class="t">Also share to Instagram or Pinterest</div><div class="s">You choose on the next screen</div></div></button>
      <button class="nx-radio" data-m="rm" style="color:#b3261e"><span class="nx-ico" style="background:#fbe9e7;color:#b3261e">${ic('trash')}</span><div class="nx-sp"><div class="t">Remove from Trace Network</div><div class="s">The files stay in your Vault, private</div></div></button>`);
    $$('[data-m]', sh).forEach(b=>b.addEventListener('click', ()=>{ closeSheet(); const m = b.dataset.m;
      if (m==='vault') go('h/'+p.hobby+'/vault');
      if (m==='share'){ p.files.forEach(fid=>{ const f=S.files.find(x=>x.id===fid); if (f) f.isNew = true; }); SHARE[p.hobby] = null; save(); go('h/'+p.hobby+'/share'); }
      if (m==='rm'){ unpost(id); toast('Removed from Trace Network', 'trash'); } })); },
  chip(el){ tailorInput(el.dataset.c); },
  tailorFor(el){ S.tailor = { msgs:[], stage:0, auto: el.dataset.p }; tailorStart(); S.tailor.auto = el.dataset.p; save(); go('p/tailor'); },
  pfHobby(el){ const k = el.dataset.k; S.pf.hobbies[k] = !S.pf.hobbies[k]; save(); refresh(); },
  pfSec(el){ const k = el.dataset.k; S.pf.sec[k] = !S.pf.sec[k]; save(); refresh(); },
  editWork(){ workPicker(); }, access(){ accessSheet(); },
  copyLink(el){ const url = 'https://trace.sg/v/sarah-tan'; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(()=>{});
    if (S.pf.access==='only'){ toast('Your link is set to Only you. Change Link access to share it.', 'lock'); return; }
    toast('Link copied: trace.sg/v/sarah-tan', 'link'); if (el.id==='copyBtn'){ el.textContent = 'Copied'; setTimeout(()=>{ el.textContent='Copy link'; }, 1800); } },
  export: async (el)=>{ el.innerHTML = '<span class="nx-spin"></span>Building your PDF'; el.setAttribute('disabled',''); await sleep(1300); go('p/transcript'); },
  txZoom(){ const fr = $('.nview .tx-frame'); if (!fr) return; fr.classList.toggle('zoom'); fitTx(); const b = $('#txZoomBtn'); if (b) b.innerHTML = ic('search') + (fr.classList.contains('zoom') ? 'Fit to screen' : 'Zoom in'); },
  print(){ let pd = $('#printdoc'); if (!pd){ pd = document.createElement('div'); pd.id = 'printdoc'; document.body.appendChild(pd); }
    pd.innerHTML = docHTML(); setTimeout(()=>window.print(), 300); },
  frame(el){ S.frame = el.value; save(); refresh(); },
  allActs(){ S.dq=''; save(); refresh(); toast('Showing all Saturday activities', 'spark'); },
  msgOrg(el){ toast('Opens Telegram to message '+SX(el.dataset.s).org, 'chat'); },
  useCp(el){ S.useCp = S.useCp||{}; const id = el.dataset.s; S.useCp[id] = S.useCp[id] === false; save(); refresh(); },
  confirmBook(el){ confirmBook(el.dataset.s); }
};
function keepDraft(){ const a = $('#dTitle'), b = $('#dDesc'); if (DRAFT){ if (a) DRAFT.title = a.value; if (b) DRAFT.desc = b.value; } }
function keepCap(k){ const c = $('#cap'); if (c && SHARE[k]) SHARE[k].cap = c.value; }
function makeThumbBig(file){ return new Promise(res=>{ const url = URL.createObjectURL(file), img = new Image();
  img.onload = ()=>{ const r = Math.min(1, 900/Math.max(img.width,img.height)), c = document.createElement('canvas'); c.width = img.width*r; c.height = img.height*r;
    c.getContext('2d').drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg',.82)); };
  img.onerror = ()=>res(IMG+'v_paintbig.jpg'); img.src = url; }); }

function bind(v){
  v.addEventListener('click', e=>{
    const g = e.target.closest('[data-go]');
    const a = e.target.closest('[data-act]');
    if (a && (!g || g.contains(a))){ const fn = ACT[a.dataset.act]; if (fn && a.tagName!=='SELECT' && a.tagName!=='FORM'){ e.stopPropagation(); fn(a, e); return; } }
    if (g){ e.stopPropagation(); t().go(g.dataset.go, !!g.dataset.replace); }
  });
  v.addEventListener('change', e=>{ const a = e.target.closest('select[data-act]'); if (a && ACT[a.dataset.act]) ACT[a.dataset.act](a, e); });
}
document.addEventListener('click', e=>{ if (e.target.closest('#nsheet [data-close]')) closeSheet(); });



/* ================= DISCOVER + SESSIONS + BOOKING ================= */
const SESS = [
  { id:'pencil', name:'Pencil drawing for beginners', org:'The Sketch Room', tg:'@thesketchroom', img:'s_pencil.jpg', start:'2:00pm', end:'5:00pm', short:'2:00 to 5:00pm', hours:3, price:32, cp:true, walk:'12 min walk from you', tags:['Traditional','Beginner'],
    inc:[['Pencils and paper provided','Everything is set out for you'],['Line, shading and form','Guided step by step'],['One-off drop-in','No membership or course']] },
  { id:'sketch', name:'Sketching studio', org:'Line & Form Studio', tg:'@lineandform', img:'s_sketch.jpg', start:'2:00pm', end:'5:00pm', short:'2:00 to 5:00pm', hours:3, price:28, cp:false, walk:'10 min walk from you', tags:['Traditional','Some experience'],
    inc:[['Pencils, charcoal and paper provided','Bring your own sketchbook if you like'],['Open studio','Draw at your own pace'],['For people who already draw','Not a beginner class']] },
  { id:'wheel', name:'Wheel-throwing taster', org:'Clay Collective', tg:'@claycollective_sg', img:'s_wheel.jpg', start:'3:00pm', end:'5:00pm', short:'3:00 to 5:00pm', hours:2, price:35, cp:true, walk:'15 min walk from you', tags:['Pottery','Beginner'],
    inc:[['Clay and tools','Everything you need at the wheel'],['Firing included','Collect your bowl in two weeks'],['Beginner friendly','No experience needed']] },
  { id:'digital', name:'Beginner Digital Art', org:'ArtHaus Studio', tg:'@arthaus_studio', img:'s_digital.jpg', start:'2:00pm', end:'5:00pm', short:'2:00 to 5:00pm', hours:3, price:30, cp:true, walk:'8 min walk from you', tags:['Digital','Beginner'],
    inc:[['Tablet and stylus provided','On loan for the session'],['Digital drawing basics','Layers, brushes and line work'],['One-off drop-in','No membership or course']] },
  { id:'callig', name:'Modern calligraphy taster', org:'Ink & Quill', tg:'@inkandquill', img:'s_callig.jpg', start:'2:00pm', end:'5:00pm', short:'2:00 to 5:00pm', hours:3, price:26, cp:true, walk:'10 min walk from you', tags:['Lettering','Beginner'],
    inc:[['Brush pens and paper provided','Take your practice sheets home'],['Letterforms and strokes','Guided drills, then your own words'],['Beginner friendly','No experience needed']] } ];
const SX = id => SESS.find(x=>x.id===id);
const CP = '<img src="../assets/logo_culturepass.png" alt="" style="width:20px;height:20px;border-radius:50%">';
function timeBar(x){ const s = x.start==='3:00pm' ? 33.3 : 0; return `<div class="nx-tbar"><i style="left:${s}%;width:${100-s}%"></i></div><div class="nx-row" style="justify-content:space-between;font-size:11px;color:#6a7683;margin-top:3px"><span>2pm</span><span>5pm</span></div>`; }
function sessCard(x){
  const booked = (S.bookings||{})[x.id];
  return `<div class="nx-scard" data-s="${x.id}" data-go="s/${x.id}" role="button" tabindex="0" aria-label="${esc(x.name)}">
    <div class="ph" style="background-image:url('${IMG+x.img}')">${x.cp?`<span class="cpb">${CP}<span><b>Culture Pass</b><small>eligible</small></span></span>`:''}<b class="nm">${esc(x.name)}</b>${booked?'<span class="bk">Booked</span>':''}</div>
    <div class="bd"><div class="nx-muted nx-row" style="gap:5px">${ic('pin').replace('<svg','<svg style="width:13px;height:13px"')}${esc(x.org)}</div>
      <div class="nx-row" style="justify-content:space-between;margin-top:4px"><span class="nx-row" style="gap:8px"><b style="font-size:16px">Sat ${esc(x.short)}</b><span class="nx-tag" style="padding:2px 8px">${x.hours} h</span></span>
      ${x.cp?`<span><s style="color:#8b98a6;font-size:13px">$${x.price}</s> <b style="color:#2b5a87;font-size:14px">$0 with credits</b></span>`:`<b>$${x.price}</b>`}</div>
      ${timeBar(x)}</div></div>`;
}
function dDiscover(v){
  const head = `<div class="nx-tabs" style="margin-top:10px"><button class="on">Discover</button><button data-go="3071:1085">Trace Match</button></div>
    <div class="nx-row" style="gap:8px"><label class="nx-search">${ic('search')}<input id="dq" placeholder="Search Saturday activities" value="${esc(S.dq||'')}" aria-label="Search activities"></label><button class="nx-filt" data-act="filters">Filters <span>2</span></button></div>
    <div class="nx-row" style="gap:8px;margin:12px 0"><button class="nx-pill sm on">For you</button><button class="nx-pill sm" data-act="allActs">All activities</button><span class="nx-sp"></span><button class="nx-link" data-act="filters">Edit interests</button></div>
    <div class="nx-free"><span class="dot"></span><b>Sat 19 Sep, 2 to 5pm free</b><span class="nx-sp"></span><button class="nx-mini" style="background:#fff;border-color:#d9e6d4;box-shadow:none;color:#2f6239" data-act="changeTime">${ic('clock')}Change time</button></div>`;
  const q = (S.dq||'').toLowerCase().trim();
  const list = SESS.filter(x=>!q || (x.name+' '+x.org+' '+x.tags.join(' ')).toLowerCase().includes(q));
  const body = list.length ? list.map(x=>sessCard(x)).join('') : `<div class="nx-card" style="text-align:center" ><b>No sessions match "${esc(q)}"</b><div class="nx-muted">Try another word, or clear the search.</div></div>`;
  v.innerHTML = TOP() + head + `<div class="nx-gap"></div>` + body + `</div>`;
  const inp = $('#dq', v); if (inp) inp.addEventListener('input', ()=>{ S.dq = inp.value; save(); const pos = inp.selectionStart; refresh(); const n2 = $('#dq'); if (n2){ n2.focus(); n2.setSelectionRange(pos,pos); } });
}
function sTop(x, back, where){ return BACKROW(back||'Back to Discover', 'd/discover', where||'Trace Start'); }
function sDetail(v, id){
  const x = SX(id), booked = (S.bookings||{})[id];
  v.innerHTML = sTop(x) + `<div class="nx-label" style="margin:16px 0 2px">${esc(x.org.toUpperCase())}</div><h1 class="nx-h1" style="margin-top:0">${esc(x.name)}</h1>
  <div class="nx-card" style="padding:0;overflow:hidden"><div style="height:150px;background:#dfe7ef url('${IMG+x.img}') center/cover"></div>
    <div class="nx-li"><span class="nx-ico">${ic('clock')}</span><div class="nx-sp"><div class="t">Sat 19 Sep, ${esc(x.start)} to ${esc(x.end)}</div><div class="s">${x.hours} hours, ends ${esc(x.end)}</div></div></div>
    <div class="nx-li"><span class="nx-ico">${ic('pin')}</span><div class="nx-sp"><div class="t">${esc(x.org)}</div><div class="s">${esc(x.walk)}</div></div></div></div>
  <div class="nx-label">What's included</div>
  <div class="nx-list">${x.inc.map(([t,s])=>`<div class="nx-li"><span class="nx-ico">${ic('check')}</span><div class="nx-sp"><div class="t">${esc(t)}</div><div class="s">${esc(s)}</div></div></div>`).join('')}</div>
  <div class="nx-gap"></div>
  <div class="nx-card"><div style="font-weight:600;font-size:16px">Ask ${esc(x.org)}</div><div class="nx-muted" style="margin:4px 0 12px">Telegram ${esc(x.tg)}</div>
    <div class="nx-row" style="gap:8px"><button class="nx-mini" style="background:#fff;border:1.5px solid #152331;box-shadow:none;color:#152331" data-act="msgOrg" data-s="${id}">${ic('chat')}Message organiser</button><button class="nx-mini" style="background:#152331;border-color:#152331;box-shadow:none;color:#fff" data-act="askTrace">${ic('spark')}Ask Trace</button></div></div>
  <div class="nx-gap"></div>
  <div class="nx-card nx-row" style="background:#e4eef8">${x.cp?CP:ic('info')}<div class="nx-sp"><div class="nx-label" style="margin:0;color:#2b5a87">${x.cp?'Price with Culture Pass':'Price'}</div><div class="nx-muted">${x.cp?'Your credit covers the full fee':'Pay at the studio. Not covered by credit.'}</div></div>
    <div style="text-align:right">${x.cp?`<s class="nx-muted">$${x.price}</s><div style="font-family:Outfit;font-weight:700;font-size:28px">$0</div>`:`<div style="font-family:Outfit;font-weight:700;font-size:28px">$${x.price}</div>`}</div></div>
  <div style="margin-top:16px">${booked?`<button class="nx-btn green" data-go="3071:1076">${ic('check')}Booked, view in Schedule</button>`:`<button class="nx-btn" data-go="s/${id}/review">Review booking, Sat ${esc(x.short)}</button>`}</div></div>`;
}
function steps(n){ const L=['Select activity','Review details','Apply credits','Confirm booking'];
  return `<div class="nx-steps">${L.map((l,i)=>`<div class="st ${i<n-1?'done':i===n-1?'cur':''}"><span>${i<n-1?ic('check','',3):i+1}</span><small>${l}</small></div>`).join('<i></i>')}</div>`; }
function sReview(v, id){
  const x = SX(id);
  v.innerHTML = BACKROW('Back to details', 's/'+id, 'Booking') + steps(2) + `<div class="nx-label" style="margin:14px 0 2px">Step 2 of 4</div><h1 class="nx-h1" style="margin-top:0;font-size:26px">Review your booking</h1>
  <div class="nx-sub">Nothing is charged and nothing is added to your calendar yet.</div>
  <div class="nx-list">${[[`<span class="nx-ava" style="border-radius:10px;background:url('${IMG+x.img}') center/cover"></span>`,'Activity',x.name,x.org],[`<span class="nx-ico">${ic('calendar')}</span>`,'Date and time',`Sat 19 Sep, ${x.start} to ${x.end}`,`${x.hours} hours`],[`<span class="nx-ico">${ic('pin')}</span>`,'Location',x.org,x.walk],[`<span class="nx-ico">${ic('check')}</span>`,'Included',x.inc[0][0],'No membership, no materials to buy'],[x.cp?CP.replace('20px','34px').replace('20px','34px'):`<span class="nx-ico">${ic('info')}</span>`,'Price','$'+x.price,x.cp?'SG Culture Pass credit can cover it. You choose on the next step.':'Pay at the studio. Not covered by Culture Pass credit.']]
    .map(([ico,l,t,s])=>`<div class="nx-li">${ico}<div class="nx-sp"><div class="nx-muted" style="font-size:12px">${l}</div><div class="t">${esc(t)}</div><div class="s">${esc(s)}</div></div></div>`).join('')}</div>
  <div class="nx-alert blue" style="margin-top:14px">${ic('info')}<span><b>Cancellation</b><br>Cancel free up to 4 hours before. Google Calendar is updated after you confirm.</span></div>
  <div style="margin-top:16px"><button class="nx-btn" data-go="s/${id}/credits">Continue to credits</button></div>
  <div style="margin-top:10px"><button class="nx-btn ghost" data-act="back" data-to="s/${id}">Back to edit</button></div></div>`;
}
function sCredits(v, id){
  const x = SX(id); S.useCp = S.useCp||{}; const use = x.cp && S.useCp[id] !== false;
  const due = use ? 0 : x.price;
  v.innerHTML = BACKROW('Back to review', 's/'+id+'/review', 'Booking') + steps(3) + `<div class="nx-label" style="margin:14px 0 2px">Step 3 of 4</div><h1 class="nx-h1" style="margin-top:0;font-size:26px">Apply credits</h1>
  <div class="nx-sub">Choose how to pay. Nothing is charged until you confirm.</div>
  ${x.cp?`<div class="nx-card nx-row">${CP.replace(/20px/g,'34px')}<div class="nx-sp"><div style="font-weight:700">Use my SG Culture Pass credit</div><div class="nx-muted">Balance $100</div></div><button class="nx-tog ${use?'on':''}" role="switch" aria-checked="${use}" data-act="useCp" data-s="${id}"><i></i></button></div>`
    :`<div class="nx-alert blue">${ic('info')}<span>This studio does not take Culture Pass credit. You pay at the door.</span></div>`}
  <div class="nx-gap"></div><div class="nx-card"><div class="nx-row" style="justify-content:space-between"><span>Session price</span><span>$${x.price}</span></div>
    ${use?`<div class="nx-row" style="justify-content:space-between;margin-top:8px;color:#347241"><span>SG Culture Pass credit</span><span>-$${x.price}</span></div>`:''}
    <div style="border-top:1px solid #edf1f5;margin:12px 0"></div><div class="nx-row" style="justify-content:space-between"><b>Amount due today</b><b class="nx-xp" style="font-size:24px">$${due}</b></div></div>
  <div class="nx-muted" style="margin:12px 2px">${use?`$${100-x.price} of credit stays for your next booking. `:''}Cancel free up to 4 hours before.</div>
  <button class="nx-btn" data-act="confirmBook" data-s="${id}">Confirm booking${due?`, pay $${due} there`:''}</button>
  <div style="margin-top:10px"><button class="nx-btn ghost" data-act="back" data-to="s/${id}/review">Back to edit</button></div></div>`;
}
function confirmBook(id){
  const x = SX(id);
  if (x.end==='5:00pm' && !(S.tightOk||{})[id]){
    const el = sheet(`<div style="text-align:center"><span class="nx-ico" style="margin:0 auto 10px;width:52px;height:52px;border-radius:50%;background:#fff4d6;color:#8a5a00">${ic('info')}</span><h3>Heads up: tight timing</h3>
      <div class="nx-muted" style="font-size:15px">This session ends at 5:00pm. Your CS2040 tutorial starts at 5:00pm and the venue is a ${esc(x.walk.split(' walk')[0])} walk away, so you would have no time to travel.</div>
      <div class="nx-row" style="justify-content:center;gap:8px;margin:14px 0"><span class="nx-tag">Session 2:00 to 5:00pm</span><span class="nx-tag amber">CS2040 5:00pm</span></div></div>
      <button class="nx-btn" data-other>See other times</button><div style="margin-top:10px"><button class="nx-btn ghost" data-any>Book anyway</button></div>`);
    $('[data-other]', el).addEventListener('click', ()=>{ closeSheet(); go('d/discover'); toast('Showing sessions that end before 4:30pm', 'clock'); });
    $('[data-any]', el).addEventListener('click', ()=>{ S.tightOk = S.tightOk||{}; S.tightOk[id] = true; closeSheet(); confirmBook(id); });
    return;
  }
  S.bookings = S.bookings||{}; S.bookings[id] = { at:Date.now(), cp: x.cp && (S.useCp||{})[id] !== false }; S.gained = (S.gained||0) + 120; save();
  const el = sheet(steps(5) + `<div class="nx-row" style="margin-top:12px"><span class="nx-ico" style="width:46px;height:46px;border-radius:50%;background:#417f4c;color:#fff">${ic('check','',3)}</span><div><h3 style="margin:0">You're booked</h3><div class="nx-muted">${esc(x.name)}, ${esc(x.org)}</div></div></div>
    <div class="nx-list" style="border:1.5px solid #e3e9ef;box-shadow:none;margin-top:14px"><div class="nx-li"><span class="nx-ico">${ic('clock')}</span><div class="nx-sp"><div class="t">Sat 19 Sep, ${esc(x.start)} to ${esc(x.end)}</div><div class="s">${esc(x.walk)}</div></div></div>
      <div class="nx-li"><span class="nx-ico">${ic('award')}</span><div class="nx-sp"><div class="t">Paid $${S.bookings[id].cp?0:x.price}</div><div class="s">${S.bookings[id].cp?`$${x.price} of SG Culture Pass credit used`:'Pay at the studio'}</div></div></div></div>
    <div class="nx-alert green" style="margin-top:12px">${ic('calendar')}<span><b>Added to Google Calendar.</b> Nothing else in your calendar was changed.</span><button class="u" data-undo>Undo</button></div>
    <div class="nx-btns" style="margin-top:16px"><button class="nx-btn ghost" data-done>Done</button><button class="nx-btn" data-sched>View in Schedule</button></div>`, { locked:true, confetti:true });
  $('[data-undo]', el).addEventListener('click', ()=>{ delete S.bookings[id]; S.gained -= 120; save(); closeSheet(); go('s/'+id); toast('Booking cancelled and removed from your calendar', 'refresh'); });
  $('[data-done]', el).addEventListener('click', ()=>{ closeSheet(); go('3071:1070'); });
  $('[data-sched]', el).addEventListener('click', ()=>{ closeSheet(); go('3071:1076'); });
}

/* keep the bobbing tiles clear of the hobby title panel */
function clearHead(view){
  const head = view.querySelector('.nx-hhead'), ttl = head && head.querySelector('.ttl'); if (!ttl) return;
  const z = head.getBoundingClientRect().width / 402 || 1, hb = head.getBoundingClientRect(), tb = ttl.getBoundingClientRect();
  const right = (tb.right - hb.left) / z, top = (tb.top - hb.top) / z, bottom = (tb.bottom - hb.top) / z;
  head.querySelectorAll('.nx-ft').forEach(t=>{
    const x = parseFloat(t.dataset.x || t.style.left), y = parseFloat(t.dataset.y || t.style.top), w = parseFloat(t.style.width), h = parseFloat(t.style.height);
    t.dataset.x = x; t.dataset.y = y;
    const hits = x < right + 6 && x + w > 92 && y < bottom + 4 && y + h > top - 4;
    if (hits){ t.style.left = Math.min(right + 10, 402 - w - 6) + 'px'; t.style.top = (t.classList.contains('big') ? 124 : y) + 'px'; }
    else { t.style.left = x + 'px'; t.style.top = y + 'px'; }
  });
}

/* ================= HOME, TRACE ME, REWARDS, SCHEDULE, TRACE MATCH, PLATFORMS, GROUPS (3 Nov: coded, were Figma images) ================= */
const LOGO = n => `<img src="${IMG}${n}.jpg" alt="">`;
const CPLOGO = '<img src="../assets/logo_culturepass.png" alt="">';
const REWARDS = [
  { id:'lifesg', n:'LifeSG', s:'$1 voucher', cost:100, logo:LOGO('l_lifesg') },
  { id:'h365', n:'Healthy 365', s:'50 Healthpoints', cost:100, logo:LOGO('l_healthy365') },
  { id:'activesg', n:'ActiveSG', s:'$5 of ActiveSG credits', cost:220, logo:LOGO('l_activesg') },
  { id:'cp', n:'SG Culture Pass', s:'$10 top-up', cost:900, logo:CPLOGO } ];
function credits(){ const spent = Object.keys(S.claimed||{}).reduce((a,k)=>a+((REWARDS.find(r=>r.id===k)||{}).cost||0),0); return 820 + Math.round((S.gained||0)/4) - spent; }
function cpBalance(){ return 100 - Object.entries(S.bookings||{}).filter(([,b])=>b.cp).reduce((a,[id])=>a+(SX(id)?SX(id).price:0),0); }
function satBooking(){ const id = Object.keys(S.bookings||{}).find(SX); return id ? SX(id) : null; }
const lg = x => `<span class="nx-lg">${x}</span>`;
const acRow = ([logo,n,s,on,key]) => `<div class="nx-li">${lg(logo)}<div class="nx-sp"><div class="t">${n}</div><div class="s">${s}</div></div>${on?`<span class="nx-tag green">${ic('check')}Connected</span>`:`<button class="nx-mini" data-act="connect" data-k="${key}">Connect</button>`}</div>`;
const accounts = sub => { const st = !!(S.conn||{}).strava; return [[IG,'Instagram','18 posts, 2019 to 2026',true],[PIN,'Pinterest','31 pieces across 2 boards',true],[LOGO('l_linkedin'),'LinkedIn','Skills and endorsements synced',true],[LOGO('l_strava'),'Strava',st?'Runs and rides are logged as sessions':sub,st,'strava']]; };

function hHome(v){
  const b = satBooking();
  v.innerHTML = TOP() + `
  <button class="nx-card nx-row nx-hello" data-go="home/me"><img class="nx-ava big" src="${IMG}a_sarah.jpg" alt=""><span class="nx-sp"><span class="nx-h2">Hey Sarah</span><span class="nx-muted">${b?`You're booked for Saturday at ${esc(b.org)}.`:'Your Saturday afternoon is open.'}</span></span>${ic('chev')}</button>
  <div class="nx-label">Your credits</div>
  <div class="nx-card nx-creds">${[[CPLOGO,'Culture Pass','$'+cpBalance()],[LOGO('l_activesg'),'ActiveSG','$100'],[LOGO('l_lifesg'),'LifeSG','$50']].map(([l,n,a])=>`<div>${lg(l)}<span><small>${n}</small><b>${a}</b></span></div>`).join('')}</div>
  <div class="nx-label">This weekend</div>
  <div class="nx-card">
    <div class="nx-row" style="justify-content:space-between"><span class="nx-h2" style="font-size:19px">Saturday 19 Sep</span><span class="nx-freet">${ic('clock')}${b?'booked 2 to 5pm':'free 2 to 5pm'}</span></div>
    <div class="nx-agenda">${b?`<div><span>2pm</span><i class="on"></i><b>${esc(b.name)}</b></div>`:''}<div><span>5pm</span><i></i><b>CS2040 tutorial</b></div><div><span>6pm</span><i></i><b>Dinner, hall</b></div><div><span>7pm</span><i class="free"></i><em>Open: no events</em></div></div>
    <button class="nx-rowbtn" data-go="home/schedule"><span class="nx-ico">${ic('calendar')}${b?'<sup>+1</sup>':''}</span><b>Open schedule</b>${ic('chev')}</button></div>
  <div class="nx-label">Your XP</div><div id="hxpslot"></div>
  <div class="nx-card" style="margin-top:14px"><div class="nx-h2" style="font-size:18px;margin-bottom:4px">Trace Credits History</div>
    ${[['calendar','Attend a booked session','+120'],['upload','Upload artwork to your Vault','+40'],['award','Reach a new level in a hobby','+250']].map(([i,tt,p])=>`<div class="nx-row" style="padding:7px 0"><span class="nx-ico">${ic(i)}</span><span class="nx-sp" style="font-size:15px">${tt}</span><span class="nx-tag green">${p}</span></div>`).join('')}</div>
  <div style="margin-top:14px"><button class="nx-btn" data-go="home/rewards">${ic('gift')}Rewards</button></div></div>`;
  $('#hxpslot', v).appendChild(homeXPCard(true));
}

function hMe(v){
  const sh = S.share||{};
  v.innerHTML = BACKROW('Back to Home','home','Trace Me') + `
  <div class="nx-card nx-row nx-hello"><img class="nx-ava big" src="${IMG}a_sarah.jpg" alt=""><span class="nx-sp"><span class="nx-h2">Sarah Tan</span><span class="nx-muted">Member since 2026, Level 4 Regular</span></span></div>
  <div class="nx-card" style="margin-top:14px">${S.sp
    ? `<div class="nx-row"><span class="nx-ico green">${ic('check')}</span><div class="nx-sp"><div style="font-weight:700">Singpass linked</div><div class="nx-muted">Your credits, certificates and CCA records sync each week.</div></div></div>`
    : `<div style="font-weight:700;font-size:16px">Link your Singpass</div><div class="nx-muted" style="margin:2px 0 12px">Sync your credits, certificates and CCA records</div><button class="nx-btn ghost" data-act="singpass">Continue with <span class="nx-spw">singpass</span></button>`}</div>
  <div class="nx-label">Linked accounts</div>
  <div class="nx-list">${accounts('Not connected').map(acRow).join('')}</div>
  <div class="nx-label">Settings</div>
  <div class="nx-list">${[[lg(LOGO('l_gcal')),'Calendar access','Google Calendar, read and add events','home/schedule'],[`<span class="nx-ico">${ic('clock')}</span>`,'Notifications','One session suggestion at a time',''],[`<span class="nx-ico">${ic('link')}</span>`,'Sharing settings',sh.preview===false?'Posts go out without a preview':'Nothing is posted without a preview','n/platforms'],[`<span class="nx-ico">${ic('file')}</span>`,'Data and downloads','Export or delete your record','p/transcript']]
    .map(([i,tt,s,to])=>`<button class="nx-li" ${to?`data-go="${to}"`:'data-act="notif"'}>${i}<div class="nx-sp"><div class="t">${tt}</div><div class="s">${s}</div></div>${ic('chev')}</button>`).join('')}</div>
  <div style="margin-top:16px"><button class="nx-btn ghost" data-act="signOut">Sign out</button></div></div>`;
}

function hRewards(v){
  const c = credits(), cp = REWARDS[3], toCp = Math.max(0, cp.cost - c), cl = S.claimed||{};
  const recent = [...Object.keys(cl).map(k=>{ const r = REWARDS.find(x=>x.id===k); return ['award',`Claimed ${r.n}`,'Today',`-${r.cost} TC`]; }),
    ...(S.gained ? [['calendar','Booked a session','Today',`+${Math.round(S.gained/4)} TC`]] : []),
    ['check','Attended a session','12 Sep, ArtHaus Studio','+120 TC'],['award','Claimed LifeSG voucher','10 Sep','-100 TC'],['upload','Uploaded artwork to Vault','8 Sep','+40 TC']];
  v.innerHTML = BACKROW('Back to Home','home','Rewards') + `
  <div class="nx-card nx-row" style="gap:16px"><span class="nx-ring" style="${ring(Math.min(1,c/cp.cost),0,'#3a6ea5','#dfe8f2')}"><span><b data-count="${c}">${fmt(c)}</b><small>TC</small></span></span>
    <div class="nx-sp"><div class="nx-label" style="margin:0 0 4px">Trace credits</div><div class="nx-h2" style="font-size:18px">${toCp?`${fmt(toCp)} TC to your SG Culture Pass top-up`:'You have enough for an SG Culture Pass top-up'}</div><span class="nx-tag" style="margin-top:8px">${ic('flame')}+160 this month</span></div></div>
  <div class="nx-label">Ways to earn</div>
  <div class="nx-grid">${[['check','+120','Attend a session'],['upload','+40','Upload to Vault'],['flame','+60','Keep a weekly streak']].map(([i,p,tt])=>`<div class="nx-card nx-earn"><span class="nx-ico round">${ic(i)}</span><b>${p}</b><small>${tt}</small></div>`).join('')}</div>
  <div class="nx-label">Rewards for you</div>
  <div class="nx-rgrid">${REWARDS.map(r=>{ const done = !!cl[r.id], can = c >= r.cost;
    return `<div class="nx-card nx-rw"><div class="nx-row" style="justify-content:space-between;align-items:flex-start">${lg(r.logo)}<span class="nx-tag grey">${r.cost} TC</span></div><b>${r.n}</b><small>${r.s}</small>
      ${done ? `<button class="nx-mini done" disabled>${ic('check')}Claimed</button>` : can ? `<button class="nx-mini" data-act="claim" data-id="${r.id}">Claim</button>`
        : `<div class="nx-tbar"><i style="left:0;width:${(c/r.cost*100).toFixed(0)}%;background:#6ea862"></i></div><small style="margin-top:6px">${fmt(r.cost-c)} TC to go</small>`}</div>`; }).join('')}</div>
  <div class="nx-label">Recent</div>
  <div class="nx-list">${recent.map(([i,tt,s,p])=>`<div class="nx-li"><span class="nx-ico">${ic(i)}</span><div class="nx-sp"><div class="t">${tt}</div><div class="s">${s}</div></div><span class="nx-tag">${p}</span></div>`).join('')}</div></div>`;
}

let SCHV = 'day';
function analyser(){
  const bars = [['M',1,'busy'],['T',2],['W',.5,'busy'],['T',3],['F',2],['S',4,'top'],['S',3]];
  const sat = [['1pm',''],['2pm','top'],['3pm','top'],['4pm','top'],['5pm','busy'],['6pm','busy']];
  return `<div class="nx-card nx-an"><div class="nx-row" style="align-items:flex-start">${lg(LOGO('l_gcal'))}<div class="nx-sp"><div class="nx-h2" style="font-size:18px">Schedule analyser</div><div class="nx-muted">Free afternoon hours, last 4 weeks</div></div><span class="nx-tag green">Live</span></div>
    <div class="an-bars">${bars.map(([d,h,k])=>`<div><i class="${k||''}" style="height:${(14+h*14)}px"></i><b>${d}</b><small>${h===.5?'&frac12;':h}h</small></div>`).join('')}</div>
    <div class="nx-label" style="margin:16px 0 8px">Saturday afternoons</div>
    <div class="an-sat">${sat.map(([tt,k])=>`<div><i class="${k}"></i><small>${tt}</small></div>`).join('')}</div>
    <div class="an-key"><span><i class="top"></i>Usually free</span><span><i></i>Sometimes free</span><span><i class="busy"></i>Likely busy</span></div>
    <p class="nx-muted" style="font-size:14px;margin-top:10px"><b style="color:#347241">Sat 2 to 5pm is usually free</b> (3 of the last 4). <b style="color:#152331">Wed 5 to 7pm is likely busy</b> with CS2040. Trace re-checks each morning.</p></div>`;
}
function hSchedule(v){
  const b = satBooking();
  const tabs = `<div class="nx-tabs" style="margin-top:14px">${['day','week','month'].map(k=>`<button class="${SCHV===k?'on':''}" data-act="schv" data-v="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div>`;
  let body;
  if (SCHV==='day'){
    const rows = [['1pm','Family Time','Home'], b ? ['2pm',b.name,`${b.org}, ${b.short}`,'trace'] : ['2pm','Free 2 to 5pm','Nothing booked yet','free'], ['5pm','CS2040 tutorial','SoC TR3'], ['6pm','Dinner, hall','']];
    body = `<div class="nx-label" style="margin-top:4px">Saturday 19 Sep</div><div class="sc-list">${rows.map(([tt,n,s,k])=>`<div class="sc-r"><span>${tt}</span><div class="sc-ev ${k||''} ${k==='trace'?'tall':''}">${k==='trace'?'<span class="nx-tag green">Added by Trace</span>':''}<b>${esc(n)}</b>${s?`<small>${esc(s)}</small>`:''}${k==='free'?`<button class="nx-link" data-go="d/discover" style="margin-top:6px">Find something to do${ic('chev')}</button>`:''}</div></div>`).join('')}</div>`;
  } else if (SCHV==='week'){
    const rows = [['Mon 14','Piano practice, NAFA Keys: 6pm'],['Tue 15','Piano lesson, Ms Priya Nair: 5pm'],['Wed 16','CS2040 tutorial: 5pm'],['Thu 17','Free 7 to 9pm','free','Today'],['Fri 18','Nothing booked','free'],['Sat 19', b?`${b.name}: 2pm`:'Free 2 to 5pm', b?'trace':'free'],['Sun 20','Piano recital practice: 4pm']];
    body = `<div class="nx-label" style="margin-top:4px">14 to 20 September</div><div class="sc-list wk">${rows.map(([d,n,k,tag])=>`<div class="sc-r"><span>${d}</span><div class="sc-ev ${k||''}"><b>${esc(n)}</b>${tag?`<span class="nx-tag dark">${tag}</span>`:''}</div></div>`).join('')}</div>`;
  } else {
    const practice = [1,3,5,8,10,12,14,15], first = new Date(Date.UTC(2026,8,1)).getUTCDay();
    const cells = [...Array(first).fill(0), ...Array.from({length:30},(_,i)=>i+1)];
    body = `<div class="nx-label" style="margin-top:4px">September 2026</div><div class="nx-card sc-month"><div class="sc-dow">${['S','M','T','W','T','F','S'].map(d=>`<span>${d}</span>`).join('')}</div>
      <div class="sc-days">${cells.map(d=>!d?'<span></span>':`<span class="${d===19?(b?'sel':'free'):''} ${d===17?'today':''}">${d}${practice.includes(d)?'<i></i>':d===19&&b?'<i class="bk"></i>':''}</span>`).join('')}</div>
      <div class="an-key" style="justify-content:center"><span><i class="dotg"></i>Practice logged</span><span><i class="dotb"></i>Session booked</span></div></div>
      <div class="nx-muted" style="margin:10px 2px 0;font-size:14px">${practice.length} practices logged in September, ${b?'1 session':'no sessions'} booked.</div>`;
  }
  v.innerHTML = BACKROW('Back to Home','home','Schedule') + tabs + body + `<div class="nx-gap"></div>` + analyser() + '</div>';
}

/* ---------- Trace Match ---------- */
const LOBBY = [
  { id:'bb', n:'Basketball pickup', host:'Blk 412 Regulars', i:'ball', cat:'Sports', act:'Basketball', when:'Fri 6:30pm', km:.8, lvl:'All levels', have:5, cap:8 },
  { id:'pb', n:'Pickleball doubles', host:'Toa Payoh Picklers', i:'users', cat:'Sports', act:'Pickleball', when:'Sun 9:00am', km:1.2, lvl:'Beginner friendly', have:6, cap:12 },
  { id:'ld', n:'Life drawing jam', host:'Telok Kurau Sketchers', i:'pen', cat:'Arts', act:'Life drawing', when:'Sat 4:30pm', km:2.8, lvl:'All levels', have:10, cap:12 } ];
const MINE = { id:'mine', n:'Basketball pickup', host:'you', i:'ball', cat:'Sports', act:'Basketball', when:'Fri 25 Sep, 6:30pm', km:.8, lvl:'All levels', have:1, cap:8 };
const TMGROUPS = { Sports:['Basketball','Pickleball','Badminton','Running','Football'], Arts:['Digital art','Life drawing','Pottery','Photography'], Music:['Piano','Guitar','Ukulele'] };
const TMF0 = () => ({ act:['Basketball','Pickleball','Life drawing'], km:'3 km', when:'This week', lvl:'All' });
let TMCAT = 'All', TMF = null;
function lobbies(f){
  f = f || TMF || TMF0(); const max = { '1 km':1, '3 km':3, '5 km':5 }[f.km] || 99;
  return [...(S.hosted?[MINE]:[]), ...LOBBY].filter(l => l.id==='mine' || ((TMCAT==='All'||l.cat===TMCAT) && (!f.act.length || f.act.includes(l.act)) && (S.loc===false || l.km <= max)));
}
function lobbyCard(l){
  const j = !!(S.joined||{})[l.id] || l.id==='mine', n = l.have + ((S.joined||{})[l.id] ? 1 : 0), left = l.cap - n;
  const [tc, tt] = l.id==='mine' ? ['dark','Your lobby'] : left<=2 ? ['amber', left?`${left} spot${left>1?'s':''} left`:'Full'] : n/l.cap>=.6 ? ['amber','Filling fast'] : ['green','Open'];
  return `<div class="nx-card tm-l"><div class="nx-row" style="align-items:flex-start"><span class="nx-ico">${ic(l.i)}</span><div class="nx-sp"><div class="nx-h2" style="font-size:18px">${esc(l.n)}</div><div class="nx-muted" style="font-size:14px">Hosted by ${esc(l.host)}</div></div><span class="nx-tag ${tc}">${tt}</span></div>
    <div class="nx-row" style="gap:6px;margin:12px 0;flex-wrap:wrap">${[l.when, l.km+' km', l.lvl].map(x=>`<span class="nx-tag grey">${esc(x)}</span>`).join('')}</div>
    <div class="nx-row"><b>${n}/${l.cap}</b><span class="tm-dots">${Array.from({length:l.cap},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</span><span class="nx-sp"></span>${l.id==='mine'?'':`<button class="tm-join ${j?'done':''}" data-act="tmJoin" data-id="${l.id}">${j?ic('check')+'Joined':'Join'}</button>`}</div></div>`;
}
function dMatch(v){
  const list = lobbies(), f = TMF || TMF0(), loc = S.loc !== false;
  v.innerHTML = TOP() + `<div class="nx-tabs" style="margin-top:10px"><button data-go="d/discover">Discover</button><button class="on">Trace Match</button></div>
  <div class="nx-card nx-row"><span class="nx-ico">${ic('pin')}</span><div class="nx-sp"><div style="font-weight:700">Location ${loc?'on':'off'}</div><div class="nx-muted">${loc?`Sessions within ${f.km==='Any'?'any distance':f.km} of Toa Payoh`:'Showing lobbies anywhere in Singapore'}</div></div><button class="nx-tog ${loc?'on':''}" role="switch" aria-checked="${loc}" aria-label="Use my location" data-act="tmLoc"><i></i></button></div>
  <div class="nx-row" style="gap:8px;margin-top:12px"><label class="nx-search">${ic('search')}<input placeholder="Search 120+ activities" aria-label="Search activities"></label><button class="nx-filt" data-act="tmFilters">Filters <span>${f.act.length}</span></button></div>
  <div class="nx-chips" style="margin-top:12px">${['All','Sports','Arts','Music','Outdoors'].map(c=>`<button class="nx-pill sm ${TMCAT===c?'on':''}" data-act="tmCat" data-c="${c}">${c}</button>`).join('')}</div>
  <div class="nx-row" style="justify-content:space-between;margin:4px 0 10px"><span class="nx-label" style="margin:0">Open lobbies near you</span><b style="color:#347241;font-size:14px">${list.length} open now</b></div>
  ${list.length ? list.map(lobbyCard).join('<div class="nx-gap"></div>') : `<div class="nx-card" style="text-align:center"><b>No open lobbies${TMCAT==='All'?'':' in '+TMCAT} right now</b><div class="nx-muted">Change your filters, or host one yourself.</div></div>`}
  <div style="margin-top:14px"><button class="nx-btn" data-act="host">${ic('users')}Host a session</button></div></div>`;
}
function tmFilterSheet(d){
  d = d || JSON.parse(JSON.stringify(TMF || TMF0()));
  const chip = (g, x, on) => `<button class="nx-pill sm ${on?'on':''}" data-g="${g}" data-x="${x}">${x}</button>`;
  const el = sheet(`<div class="nx-row" style="justify-content:space-between"><h3 style="margin:0">Filters</h3><button class="nx-link" data-clear>Clear all</button></div>
    ${Object.entries(TMGROUPS).map(([g,xs])=>`<div class="nx-label" style="margin:14px 0 8px">${g}</div><div class="nx-opts">${xs.map(x=>chip('act',x,d.act.includes(x))).join('')}</div>`).join('')}
    ${[['Distance','km',['1 km','3 km','5 km','Any']],['When','when',['Today','This week','Weekend']],['Level','lvl',['Beginner','All','Advanced']]].map(([l,k,xs])=>`<div class="nx-label" style="margin:14px 0 8px">${l}</div><div class="nx-opts">${xs.map(x=>chip(k,x,d[k]===x)).join('')}</div>`).join('')}
    <div class="nx-btns" style="margin-top:18px"><button class="nx-btn ghost" data-clear>Clear</button><button class="nx-btn" data-apply>Show ${lobbies(d).length} lobb${lobbies(d).length===1?'y':'ies'}</button></div>`);
  el.addEventListener('click', e=>{
    const c = e.target.closest('[data-g]');
    if (c){ const g = c.dataset.g, x = c.dataset.x; if (g==='act') d.act = d.act.includes(x) ? d.act.filter(y=>y!==x) : [...d.act, x]; else d[g] = x; tmFilterSheet(d); return; }
    if (e.target.closest('[data-clear]')){ tmFilterSheet({ act:[], km:'Any', when:'This week', lvl:'All' }); return; }
    if (e.target.closest('[data-apply]')){ TMF = d; closeSheet(); refresh(); }
  });
}
function hostSheet(){
  const el = sheet(`<h3>Host a session</h3><div class="nx-muted" style="font-size:15px">Trace fills in your free slot. You can change anything before you open the lobby.</div>
    <div style="margin-top:12px">${[['ball','Activity','Basketball pickup'],['clock','When','Fri 25 Sep, 6:30 to 8:00pm, free in your calendar'],['pin','Where','Blk 412 Court, Toa Payoh'],['users','Players','Up to 8, all levels']].map(([i,l,s],k)=>`<div class="nx-radio ${k===0?'on':''}" style="cursor:default"><span class="nx-ico">${ic(i)}</span><div class="nx-sp"><div class="t">${l}</div><div class="s">${s}</div></div></div>`).join('')}</div>
    <div class="nx-btns" style="margin-top:16px"><button class="nx-btn ghost" data-close>Cancel</button><button class="nx-btn" data-open>Open lobby</button></div>`);
  $('[data-open]', el).addEventListener('click', ()=>{ S.hosted = true; save(); closeSheet(); TMCAT = 'All'; refresh(); toast('Your lobby is open. Nearby players can join now.', 'users'); });
}

/* ---------- Discover sheets: filters, change time, Ask Trace ---------- */
function dFilterSheet(d){
  d = d || { show:'you', cat:'Digital art', when:'Saturday', km:'3 km' };
  const chip = (g, x) => `<button class="nx-pill sm ${d[g]===x?'on':''}" data-g="${g}" data-x="${x}">${x}</button>`;
  const el = sheet(`<div class="nx-row" style="justify-content:space-between"><h3 style="margin:0">Filters</h3><button class="nx-link" data-clear>Clear all</button></div>
    <div class="nx-label" style="margin:14px 0 8px">Show</div>
    ${[['you','For you','Based on your interests: Digital art'],['all','All activities','Everything near you, any hobby']].map(([k,tt,s])=>`<button class="nx-radio ${d.show===k?'on':''}" data-g="show" data-x="${k}"><span class="dot"></span><div class="nx-sp"><div class="t">${tt}</div><div class="s">${s}</div></div></button>`).join('')}
    ${[['Category','cat',['All','Digital art','Drawing','Photography','Pottery','Music','Sports','Outdoors']],['When','when',['Today','Saturday','Sunday','This week']],['Distance','km',['1 km','3 km','5 km','Any']]].map(([l,k,xs])=>`<div class="nx-label" style="margin:14px 0 8px">${l}</div><div class="nx-opts">${xs.map(x=>chip(k,x)).join('')}</div>`).join('')}
    <div class="nx-btns" style="margin-top:18px"><button class="nx-btn ghost" data-clear>Clear all</button><button class="nx-btn" data-apply>Show ${SESS.length} activities</button></div>`);
  el.addEventListener('click', e=>{
    const c = e.target.closest('[data-g]'); if (c){ d[c.dataset.g] = c.dataset.x; dFilterSheet(d); return; }
    if (e.target.closest('[data-clear]')){ dFilterSheet({ show:'all', cat:'All', when:'Saturday', km:'Any' }); return; }
    if (e.target.closest('[data-apply]')){ closeSheet(); if (d.show==='all') ACT.allActs(); else toast(`Showing ${d.cat==='All'?'activities':d.cat.toLowerCase()+' sessions'} for you, ${d.when}`, 'spark'); }
  });
}
function changeTimeSheet(sel){
  sel = sel || 0;
  const opts = [['Sat 19 Sep, 2:00 to 5:00pm','Recommended. Fits your free time.','green'],['Sat 19 Sep, 5:30 to 8:30pm','Clashes with CS2040 tutorial at 5:00pm','amber'],['Sun 20 Sep, 11:00am to 2:00pm','Free in your calendar',''],['Sat 26 Sep, 2:00 to 5:00pm','Free in your calendar','']];
  const el = sheet(`<h3>Change time</h3><div class="nx-muted" style="font-size:15px">Other times for Beginner Digital Art, checked against your Google Calendar.</div>
    <div style="margin-top:12px">${opts.map(([tt,s,k],i)=>`<button class="nx-radio ${sel===i?'on':''}" data-i="${i}"><span class="dot"></span><div class="nx-sp"><div class="t">${tt}</div><div class="s" style="${k==='green'?'color:#347241;font-weight:600':k==='amber'?'color:#8a5a00;font-weight:600':''}">${s}</div></div></button>`).join('')}</div>
    <button class="nx-link" style="margin-top:12px" data-avail>${ic('clock')}Edit availability${ic('chev')}</button>
    <div style="margin-top:14px"><button class="nx-btn" data-use>Use this time</button></div><div style="margin-top:10px"><button class="nx-btn ghost" data-close>Keep suggested time</button></div>`);
  el.addEventListener('click', e=>{
    const r = e.target.closest('[data-i]'); if (r){ changeTimeSheet(+r.dataset.i); return; }
    if (e.target.closest('[data-avail]')){ closeSheet(); go('home/schedule'); return; }
    if (e.target.closest('[data-use]')){ closeSheet(); toast(sel===1 ? 'Heads up: that time clashes with your CS2040 tutorial' : sel===0 ? 'Keeping Sat 19 Sep, 2:00 to 5:00pm' : `Looking for sessions on ${opts[sel][0]}`, sel===1?'info':'clock'); }
  });
}
function askSheet(sid){
  const x = SX(sid) || SX('digital'), msgs = [['ai','Ask me anything about this session, or pick a question.']];
  const ans = { bring:`Just a water bottle. ${x.inc[0][0]}, ${x.inc[0][1].toLowerCase()}.`, dress:'There is no dress code. Wear something comfortable.', contact:`${x.org} replies on Telegram at ${x.tg}, usually within a day.` };
  const qs = [['bring','What should I bring?'],['dress','Is there a dress code?'],['contact','Contact the organiser']];
  const draw = () => {
    const el = sheet(`<div class="nx-row" style="justify-content:space-between"><div><h3 style="margin:0">Ask Trace</h3><div class="nx-muted">About ${esc(x.name)} at ${esc(x.org)}</div></div><span class="nx-tag dark">AI</span></div>
      <div class="nx-chat" style="max-height:360px;overflow-y:auto">${msgs.map(([w,tt,act])=>w==='me'?`<div class="nx-msg me"><div class="bub">${esc(tt)}</div></div>`:`<div class="nx-msg"><span class="nx-lg sm">${MARK}</span><div><div class="bub" style="background:#f1f4f7;box-shadow:none">${esc(tt)}</div>${act?`<button class="nx-mini" style="margin-top:8px" data-msg>${ic('chat')}Message organiser</button>`:''}</div></div>`).join('')}
        <div class="nx-opts" style="padding-left:50px">${qs.filter(([k])=>!msgs.some(m=>m[3]===k)).map(([k,q])=>`<button class="nx-pill sm" data-q="${k}">${q}</button>`).join('')}</div></div>
      <form class="nx-row" style="gap:8px;margin-top:12px" data-form><label class="nx-search" style="background:#f1f4f7;box-shadow:none"><input placeholder="Ask a question" aria-label="Ask a question"></label><button class="nx-send" aria-label="Send">${ic('send')}</button></form>`);
    const chat = $('.nx-chat', el); chat.scrollTop = chat.scrollHeight;
    el.addEventListener('click', e=>{
      const q = e.target.closest('[data-q]'); if (q){ const k = q.dataset.q; msgs.push(['me', qs.find(z=>z[0]===k)[1], 0, k], ['ai', ans[k], k==='contact']); draw(); return; }
      if (e.target.closest('[data-msg]')) ACT.msgOrg({ dataset:{ s:x.id } });
    });
    $('[data-form]', el).addEventListener('submit', e=>{ e.preventDefault(); const i = $('input', el), q = i.value.trim(); if (!q) return;
      msgs.push(['me', q], ['ai', `I don't have that answer yet, so I've passed your question to ${x.org}. They usually reply within a day.`]); draw(); });
  };
  draw();
}

/* ---------- Network: platforms and groups ---------- */
const netTabs = on => `<div class="nx-utabs">${[['n/feed','Feed'],['n/platforms','Platforms'],['n/groups','Groups']].map(([r,n])=>`<button class="${on===r?'on':''}" ${on===r?'aria-current="page"':`data-go="${r}"`}>${n}</button>`).join('')}</div>`;
function nPlatforms(v){
  const sh = Object.assign({ ig:false, pin:false, preview:true, confirm:true }, S.share||{});
  const rows = [['ig','Share to Instagram by default','On, every share includes Instagram','Off, you pick each time'],['pin','Share to Pinterest by default','On, every share includes Pinterest','Off, you pick each time'],['preview','Show a preview first','See the post before it goes out','Posts go out without a preview'],['confirm','Confirm each destination','Trace asks before each share','Trace shares to your defaults']];
  v.innerHTML = TOP() + netTabs('n/platforms') + `
  <div class="nx-label">Linked platforms</div><div class="nx-list">${accounts('Runs and rides become logged sessions').map(acRow).join('')}</div>
  <div class="nx-label">Sharing settings</div><div class="nx-list">${rows.map(([k,tt,on,off])=>`<div class="nx-li"><div class="nx-sp"><div class="t">${tt}</div><div class="s">${sh[k]?on:off}</div></div><button class="nx-tog ${sh[k]?'on':''}" role="switch" aria-checked="${sh[k]}" aria-label="${tt}" data-act="shareTog" data-k="${k}"><i></i></button></div>`).join('')}</div>
  <div class="nx-label">Your Pinterest boards</div><div class="nx-list">${[['b_digitalart','Digital Art inspiration','24 pins, public'],['b_lifedrawing','Life drawing studies','12 pins, private']].map(([i,tt,s])=>`<div class="nx-li">${lg(LOGO(i))}<div class="nx-sp"><div class="t">${tt}</div><div class="s">${s}</div></div></div>`).join('')}</div></div>`;
}
const GROUPS = [
  { id:'dac', n:'Digital Art Circle', s:'Art', m:86, img:'g_digitalart', cat:'Art', mine:true },
  { id:'ws', n:'Weekend Sketchers', s:'Art', m:52, img:'g_sketchers', cat:'Art', mine:true },
  { id:'cc', n:'Code and Coffee SG', s:'Tech, Bugis', m:164, img:'g_codecoffee', cat:'Tech' },
  { id:'im', n:'Indie Music Collective', s:'Music, online', m:210, img:'g_indie', cat:'Music' },
  { id:'wf', n:'Weekend Futsal Crew', s:'Sports, Bishan', m:76, img:'g_futsal', cat:'Sports' } ];
let GRCAT = 'All';
function nGroups(v){
  const fol = S.follow||{}, row = g => { const on = g.mine || fol[g.id];
    return `<div class="nx-li">${lg(LOGO(g.img))}<div class="nx-sp"><div class="t">${g.n}</div><div class="s">${g.s}, ${g.m + (fol[g.id]?1:0)} members</div></div>${g.mine?`<span class="nx-tag green">${ic('check')}Joined</span>`:`<button class="nx-mini ${on?'done':''}" data-act="follow" data-id="${g.id}">${on?ic('check')+'Following':'Follow'}</button>`}</div>`; };
  const disc = GROUPS.filter(g=>!g.mine && (GRCAT==='All' || g.cat===GRCAT));
  v.innerHTML = TOP() + netTabs('n/groups') + `
  <div class="nx-label">Your groups</div><div class="nx-list">${GROUPS.filter(g=>g.mine).map(row).join('')}</div>
  <div class="nx-alert blue" style="margin-top:14px">${ic('info')}<span>Groups you join feed sessions into Trace Match. Your profile is visible to groups you follow.</span></div>
  <div class="nx-label">Discover groups</div>
  <div class="nx-chips">${['All','Art','Music','Tech','Sports'].map(c=>`<button class="nx-pill sm ${GRCAT===c?'on':''}" data-act="grCat" data-c="${c}">${c}</button>`).join('')}</div>
  ${disc.length ? `<div class="nx-list">${disc.map(row).join('')}</div>` : `<div class="nx-card" style="text-align:center"><b>You're already in the ${GRCAT.toLowerCase()} groups near you</b><div class="nx-muted">Try another category.</div></div>`}</div>`;
}

Object.assign(ACT, {
  schv(el){ SCHV = el.dataset.v; refresh(); },
  singpass(){ S.sp = true; save(); refresh(); toast('Singpass linked. Your CCA records are syncing.', 'check'); },
  connect(el){ S.conn = Object.assign({}, S.conn, { [el.dataset.k]: true }); save(); refresh(); toast('Strava connected. Runs and rides now count as sessions.', 'check'); },
  notif(){ toast('Trace sends one session suggestion at a time', 'clock'); },
  signOut(){ toast('This is a demo account, so you stay signed in', 'info'); },
  claim(el){ const r = REWARDS.find(x=>x.id===el.dataset.id); if (!r || credits() < r.cost) return; S.claimed = Object.assign({}, S.claimed, { [r.id]: TODAY }); save(); refresh(); toast(`${r.n} claimed. ${r.cost} TC used.`, 'gift'); },
  tmCat(el){ TMCAT = el.dataset.c; refresh(); },
  tmLoc(){ S.loc = S.loc === false; save(); refresh(); },
  tmFilters(){ tmFilterSheet(); },
  tmJoin(el){ const id = el.dataset.id, l = LOBBY.find(x=>x.id===id); S.joined = Object.assign({}, S.joined); if (S.joined[id]) { delete S.joined[id]; toast(`You left ${l.n}`, 'refresh'); } else { S.joined[id] = true; toast(`You joined ${l.n}. The host has been told.`, 'users'); } save(); refresh(); },
  host(){ hostSheet(); },
  shareTog(el){ const k = el.dataset.k, sh = Object.assign({ ig:false, pin:false, preview:true, confirm:true }, S.share); sh[k] = !sh[k]; S.share = sh; save(); refresh(); },
  grCat(el){ GRCAT = el.dataset.c; refresh(); },
  follow(el){ const id = el.dataset.id, g = GROUPS.find(x=>x.id===id); S.follow = Object.assign({}, S.follow); if (S.follow[id]) delete S.follow[id]; else { S.follow[id] = true; toast(`Following ${g.n}. Their sessions will show in Trace Match.`, 'users'); } save(); refresh(); },
  filters(){ dFilterSheet(); }, changeTime(){ changeTimeSheet(); }, askTrace(el){ askSheet(el && el.dataset.s); }
});
const XR = { 'home':[hHome,'Home','h'], 'home/me':[hMe,'Trace Me','h'], 'home/rewards':[hRewards,'Rewards','h'], 'home/schedule':[hSchedule,'Schedule','h'],
  'd/match':[dMatch,'Trace Match','d'], 'n/platforms':[nPlatforms,'Platforms','w'], 'n/groups':[nGroups,'Groups','w'] };


/* ================= ROUTES ================= */
const ALIAS = { '3071:1070':'home', '3071:1072':'home/me', '3071:1074':'home/rewards', '3071:1076':'home/schedule', '3071:1085':'d/match', '3071:1116':'n/platforms', '3071:1118':'n/groups', '3071:1079':'d/discover', '3071:1081':'s/digital', '3071:1087':'s/digital/review', '3071:1089':'s/digital/credits', '3071:1083':'s/wheel', '3071:1114':'n/feed', '3071:1121':'p/hobbies', '3071:1123':'p/skills', '3071:1125':'p/vault', '3071:1127':'p/tailor', '3071:1129':'p/portfolio',
  '3071:1137':'h/art', '3071:1138':'h/art/skills', '3071:1140':'h/art/vault', '3091:1925':'h/art/share', '3096:2010':'h/art/upload',
  '3071:1160':'h/piano', '3071:1162':'h/piano/skills', '3071:1164':'h/piano/vault', '3091:1961':'h/piano/share',
  '3071:1167':'h/bball', '3071:1169':'h/bball/skills', '3071:1171':'h/bball/vault', '3091:1997':'h/bball/share' };
const LIST = [['home','Home (app)'],['home/me','Trace Me (app)'],['home/rewards','Rewards (app)'],['home/schedule','Schedule (app)'],['d/match','Trace Match (app)'],['n/platforms','Network: Platforms (app)'],['n/groups','Network: Groups (app)'],['d/discover','Discover (app)'],['s/digital','Session: Beginner Digital Art (app)'],['n/feed','Network: Feed (app)'],['p/hobbies','Progress: Hobbies (app)'],['p/skills','Progress: Trace Skills (app)'],['p/vault','Progress: Trace Vault (app)'],['p/tailor','Trace Tailor (app)'],['p/portfolio','Portfolio (app)'],['p/transcript','Skills Transcript (app)'],
  ['h/art','Digital Art (app)'],['h/art/skills','Digital Art: Skills (app)'],['h/art/vault','Digital Art: Vault (app)'],['h/art/share','Digital Art: Review and share (app)'],['h/art/upload','Digital Art: Upload artwork (app)'],
  ['h/piano','Piano (app)'],['h/piano/vault','Piano: Vault (app)'],['h/bball','Basketball (app)'],['h/bball/vault','Basketball: Vault (app)']];
function resolve(id){
  if (!id) return null; id = String(id);
  if (ALIAS[id]) return ALIAS[id];
  if (XR[id] || /^p\/(hobbies|skills|vault|tailor|portfolio|transcript)$/.test(id)) return id;
  const m = id.match(/^h\/(\w+)(?:\/(skills|vault|share|upload))?$/); if (m && S.hobbies[m[1]] && !S.hobbies[m[1]].isNew && !S.hobbies[m[1]].sugg) return id;
  if (/^n\/post\/\w+$/.test(id) || id==='n/feed' || id==='d/discover') return id;
  const sm = id.match(/^s\/(\w+)(?:\/(review|credits))?$/); if (sm && SX(sm[1])) return id;
  return null;
}
let LAST = null;
function render(id, view){
  closeSheet(); $$('.nx-pop').forEach(p=>p.remove());
  const lv = LAST && LAST.match(/^h\/(\w+)\/vault$/); if (lv && LAST!==id && U[lv[1]] && U[lv[1]].done) U[lv[1]] = null; LAST = id;
  bind(view); AFTER.length = 0;
  let m, title = 'Progress', nav = 'p';
  const X = XR[id];
  if (X){ X[0](view); title = X[1]; nav = X[2]; }
  else if (id==='p/hobbies') pHobbies(view);
  else if (id==='p/skills'){ pSkills(view); title='Trace Skills'; }
  else if (id==='p/vault'){ pVault(view); title='Trace Vault'; }
  else if (id==='p/tailor'){ pTailor(view); title='Trace Tailor'; }
  else if (id==='p/portfolio'){ pPortfolio(view); title='Portfolio'; }
  else if (id==='p/transcript'){ pTranscript(view); title='Skills Transcript'; }
  else if ((m = id.match(/^h\/(\w+)(?:\/(\w+))?$/))){ const k = m[1], tab = m[2]||''; title = H(k).name;
    if (tab==='skills') hSkills(view,k); else if (tab==='vault') hVault(view,k); else if (tab==='share') hShare(view,k); else if (tab==='upload') hUpload(view,k); else hProgress(view,k); }
  else if ((m = id.match(/^n\/post\/(\w+)$/))){ nPost(view, m[1]); title='Trace feed'; nav='w'; }
  else if (id==='n/feed'){ nFeed(view); title='Network'; nav='w'; }
  else if (id==='d/discover'){ dDiscover(view); title='Discover'; nav='d'; }
  else if ((m = id.match(/^s\/(\w+)(?:\/(review|credits))?$/))){ nav='d'; title = SX(m[1]).name; if (m[2]==='review') sReview(view,m[1]); else if (m[2]==='credits') sCredits(view,m[1]); else sDetail(view,m[1]); }
  if (view.classList.contains('in')){
    $$('.nx-card,.nx-list,.nx-ai,.nx-act2,.nx-tabs,.nx-seg,.nx-chips,.nx-grid,.nx-works,.nx-doc,.nx-alert,.nx-hgrid,.nx-msg,.nx-qr,.nx-label', view).forEach((el,i)=>{ el.classList.add('rise'); el.style.setProperty('--d', Math.min(i,12)*55+'ms'); });
    if (id==='p/portfolio') AFTER.push(()=>$$('.nx-stats b', view).forEach(b=>{ const n = +b.textContent; if (n) countUp(b, 0, n, 900); }));
  }
  if (view.querySelector('.nx-hhead')) AFTER.push(()=>{ const go = ()=>clearHead(view); go(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); });
  requestAnimationFrame(()=>{ AFTER.splice(0).forEach(fn=>fn()); });
  return { nav, title };
}
function reset(){ try{ localStorage.removeItem(KEY); }catch(e){} S = fresh(); Object.keys(U).forEach(k=>U[k]=null); Object.keys(SHARE).forEach(k=>SHARE[k]=null); DRAFT=null; RPREV=null; HOMESEEN=null; VFILTER='all'; VEXP=false; SHOWALL=false; SCHV='day'; TMCAT='All'; TMF=null; GRCAT='All'; closeSheet(); }


/* ================= HOME: live, animated XP card over the screen image ================= */
const HOMELV = [{n:4,t:'Regular',at:2000},{n:5,t:'Devoted',at:3000},{n:6,t:'Champion',at:4200}];
let HOMESEEN = null;
const STDIMG = /(3071-10(74|79|81|85|87|90|91|92|93)|3071-111[68]|3096-200[567])\.jpg/;
function decorate(id, view, anim){
  const base = view.querySelector('img.base'); const src = base ? base.getAttribute('src') : '';
  const set = /3071-1070\.jpg/.test(src) ? 'home' : STDIMG.test(src) ? 'std' : null;
  if (set){ const d = document.createElement('div'); d.className = 'nx-deco img'; d.style.height = set==='home' ? '150px' : '100px';
    const pc = set==='home' ? [['c1',59,15,50,0],['c2',151,59,35,-6],['c3',216,24,64,-11]].map(([k,x,y,w,dl])=>`<img class="nx-pcloud ${k}" src="tiles/home-cloud-${k}.png" alt="" style="left:${x}px;top:${y}px;width:${w}px;animation-delay:${dl}s">`).join('') : '';
    d.innerHTML = '<span class="nx-cloud c1" style="top:24px"></span><span class="nx-cloud c3"></span>' + pc + tilesHTML(set) + sparkles(set==='home' ? [[180,18,0],[262,40,1.2],[140,96,2],[384,140,.6]] : [[180,12,0],[300,30,1.2],[214,58,2]]); view.appendChild(d); }
  if (id !== '3071:1070') return;
  view.appendChild(homeXPCard());
}
function homeXPCard(flow){
  const total = 2480 + Math.round(S.gained||0);
  let i = 0; HOMELV.forEach((l,j)=>{ if (total >= l.at) i = j; });
  const cur = HOMELV[i], next = HOMELV[i+1];
  const pct = next ? (total-cur.at)/(next.at-cur.at) : 1;
  const cr = credits();
  const from = HOMESEEN == null ? Math.round(total*0.7) : HOMESEEN;
  const fromPct = HOMESEEN == null ? 0 : Math.max(0, Math.min(1, (HOMESEEN-cur.at)/(next?next.at-cur.at:1)));
  const card = document.createElement('div');
  card.className = 'nx-homexp' + (flow ? ' flow' : '');
  card.innerHTML = `<div class="nx-row" style="justify-content:space-between"><span class="kick">LEVEL ${cur.n}: ${cur.t.toUpperCase()}</span><span class="cred">${ic('award','',2)}<b>${fmt(cr)}</b> credits</span></div>
    <div class="nx-xp" style="font-size:30px;margin-top:2px"><b id="hxp">${fmt(from)}</b> XP</div>
    <div class="nx-wave slow" style="margin-top:16px"><i id="hFill" style="width:${(fromPct*100).toFixed(1)}%"></i><em id="hKnob" style="left:${Math.max(4,fromPct*100).toFixed(1)}%">${ic('sprout')}</em><span class="flag">${ic('flag','',2.2)}</span></div>
    <div class="nx-row" style="justify-content:space-between;margin-top:12px;font-size:13.5px"><span>Lv ${cur.n}</span><b style="color:#347241;font-weight:600">${next ? fmt(next.at-total)+' XP to Lv '+next.n : 'Top level'}</b></div>`;
  card.addEventListener('click', e=>{ e.stopPropagation(); t().go('p/hobbies'); });
  HOMESEEN = total;
  setTimeout(()=>{ countUp(card.querySelector('#hxp'), from, total, 2200);
    const f = card.querySelector('#hFill'), k = card.querySelector('#hKnob');
    f.style.width = (pct*100).toFixed(1)+'%'; k.style.left = Math.max(4,pct*100).toFixed(1)+'%'; }, 350);
  return card;
}

/* containers for sheets and toasts, inside the phone frame */
function mount(){
  const screen = document.getElementById('screen') || document.body;
  if (!$('#nsheet')){ const s = document.createElement('div'); s.id = 'nsheet'; screen.appendChild(s); }
  if (!$('#ntoast')){ const tt = document.createElement('div'); tt.id = 'ntoast'; tt.setAttribute('role','status'); tt.setAttribute('aria-live','polite'); screen.appendChild(tt); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
if (typeof TABS !== 'undefined'){ TABS.h = 'home'; TABS.p = 'p/hobbies'; TABS.w = 'n/feed'; TABS.d = 'd/discover'; }
window.NATIVE = { resolve, render, reset, decorate, list: LIST, get state(){ return S; } };
})();
