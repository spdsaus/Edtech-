import {
  Learner,
  ParentContact,
  ClassGroup,
  LessonPlan,
  MessageTemplate,
  MessageLog,
  TeacherTask,
  TimetablePeriod,
  TeacherSettings,
  LanguageInfo,
} from '../types';

export const OFFICIAL_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa', nativeName: 'isiXhosa' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
];

export const INITIAL_CLASSES: ClassGroup[] = [];

export const INITIAL_LEARNERS: Learner[] = [];

export const INITIAL_PARENTS: ParentContact[] = [];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tmpl-01',
    title: 'Homework & Term Test Prep Reminder',
    category: 'Homework',
    translations: {
      en: {
        subject: '{SchoolName}: Homework & Test Prep Reminder for {LearnerName}',
        body: 'Sawubona {GuardianName},\n\nThis is Ms. Dlamini from {SchoolName} School. Please be reminded that {LearnerName} has an important Natural Sciences assignment due on Friday. We also have our Term 2 Control Test next week.\n\nPlease encourage {LearnerName} to spend 30 minutes revising chapters 4 and 5 in the textbook.\n\nWarm regards,\nMs. N. Dlamini\n{SchoolName} School',
      },
      zu: {
        subject: '{SchoolName}: Isikhumbuzo Somsebenzi Wasekhaya ne-Test ka-{LearnerName}',
        body: 'Sawubona {GuardianName},\n\nYimi uNkkz Dlamini wase-{SchoolName} School. Ngiyakukhumbuza ukuthi u-{LearnerName} unomsebenzi obalulekile we-Natural Sciences okumele uwulethe ngoLwesihlanu. Sinokuhlolwa kweThemu 2 ngeviki elizayo.\n\nSicela usize ngokukhuthaza u-{LearnerName} ukuthi abuyekeze izahluko 4 no-5 encwadini yakhe okungenani imizuzu engu-30 namhlanje.\n\nOzithobayo,\nUNkkz N. Dlamini\n{SchoolName} School',
      },
      xh: {
        subject: '{SchoolName}: Isikhumbuzo Somsebenzi Wasekhaya ka-{LearnerName}',
        body: 'Molo {GuardianName},\n\nNdinguNkskz Dlamini wase-{SchoolName} School. Ndicela ukunikhumbuza ukuba u-{LearnerName} unomsebenzi obalulekileyo we-Natural Sciences omakangeniswe ngoLwesihlanu. Kwakhona sinovavanyo lweKota 2 kwiveki ezayo.\n\nNceda ukhuthaze u-{LearnerName} ukuba ahlaziye izahluko 4 no-5 kwincwadi yakhe yemigangatho.\n\nOzithobileyo,\nUNkskz N. Dlamini\n{SchoolName} School',
      },
      af: {
        subject: 'Thandeka Sekondêr: Huiswerk en Toets Herinnering vir {LearnerName}',
        body: 'Goeiedag {GuardianName},\n\nDit is Me. Dlamini van {SchoolName}. Let asseblief daarop dat {LearnerName} \'n belangrike Natuurwetenskappe-opdrag het wat Vrydag ingehandig moet word. Ons skryf ook volgende week ons Kwartaal 2-toets.\n\nMoedig {LearnerName} asseblief aan om minstens 30 minute te bestee aan hersiening van hoofstukke 4 en 5.\n\nVriendelike groete,\nMe. N. Dlamini\n{SchoolName}',
      },
      st: {
        subject: '{SchoolName}: Kgopotso ya Mosebetsi wa Lapeng wa {LearnerName}',
        body: 'Dumela {GuardianName},\n\nKe Mofumahatsana Dlamini ho tswa {SchoolName} School. Re rata ho le hopotsa hore {LearnerName} o na le mosebetsi wa bohlokwa wa Natural Sciences o tlamehang ho fanoa ka Labohlano. Re boetse re na le Teko ya Kotara ya 2 bekeng e tlang.\n\nRe kopa le kgothatse {LearnerName} ho bala kgaolo 4 le 5 ka bukeng bonyane metsotso e 30 kajeno.\n\nKa boikokobetso,\nMofumahatsana N. Dlamini\n{SchoolName} School',
      },
    },
  },
  {
    id: 'tmpl-02',
    title: 'Positive Praise & Academic Excellence',
    category: 'Praise',
    translations: {
      en: {
        subject: 'Praise & Commendation: Outstanding Effort by {LearnerName}',
        body: 'Sawubona {GuardianName},\n\nI am delighted to share that {LearnerName} demonstrated exemplary effort and leadership in Science class today. Their focus during the practical investigation and positive attitude was truly inspiring.\n\nThank you for your ongoing support at home!\n\nWarm regards,\nMs. N. Dlamini\n{SchoolName} School',
      },
      zu: {
        subject: 'Ukubonga Nokuhalalisela: Umsebenzi Omuhle Kakhulu ka-{LearnerName}',
        body: 'Sawubona {GuardianName},\n\nNgijabula kakhulu ukukwazisa ukuthi u-{LearnerName} ubonise ukuzikhandla nobuholi obuncomekayo ekilasini leSayensi namhlanje. Indlela abambe ngayo iqhaza kwi-practical investigation ibe yinhle kakhulu.\n\nSiyabonga kakhulu ngokumeseka kwakho njalo ekhaya!\n\nOzithobayo,\nUNkkz N. Dlamini\n{SchoolName} School',
      },
      xh: {
        subject: 'Ukuvuyisana: Umgudu Obalaseleyo ka-{LearnerName}',
        body: 'Molo {GuardianName},\n\nNdiyavuya kakhulu ukunazisa ukuba u-{LearnerName} ubonakalise inkuthalo nobunkokeli obuncomekayo kwigumbi leSayensi namhlanje. Ukuzinikela kwakhe kwiprojekthi yezandla kubethelele wonke umntu.\n\nEnkosi kakhulu ngenkxaso yenu ekhaya!\n\nOzithobileyo,\nUNkskz N. Dlamini\n{SchoolName} School',
      },
      af: {
        subject: 'Komplimente en Lof: Uitstekende Poging deur {LearnerName}',
        body: 'Goeiedag {GuardianName},\n\nDit is vir my \'n groot vreugde om te deel dat {LearnerName} vandag uitmuntende toewyding en leierskap in die Wetenskapklas getoon het. Die fokus tydens die praktiese ondersoek was werklik prysenswaardig.\n\nBaie dankie vir u deurlopende ondersteuning tuis!\n\nVriendelike groete,\nMe. N. Dlamini\n{SchoolName}',
      },
      st: {
        subject: 'Thoko le Liteboho: Boikitlaetso bo Babatsehang ba {LearnerName}',
        body: 'Dumela {GuardianName},\n\nKe thabela ho le tsebisa hore {LearnerName} o bontshitse boikitlaetso le boetapele bo hlomphehang sehlopheng sa Saense kajeno. Tsela eo a nkileng karolo ka yona ho dipatlisiso tsa laboratori e ne e kgothatsa haholo.\n\nRe leboha tshehetso ya lona e sa kgaotseng lapeng!\n\nKa boikokobetso,\nMofumahatsana N. Dlamini\n{SchoolName} School',
      },
    },
  },
  {
    id: 'tmpl-03',
    title: 'Upcoming Parent-Teacher Consultation Meeting',
    category: 'Meeting',
    translations: {
      en: {
        subject: '{SchoolName}: Parent-Teacher Consultation Evening Invitation',
        body: 'Dear {GuardianName},\n\nYou are cordially invited to our Term 2 Parent-Teacher Academic Consultation Evening on Thursday, 28 May 2026, from 16:30 to 18:30 in the School Hall.\n\nThis will be an opportunity to review {LearnerName}\'s term marks, workbook progress, and discuss intervention strategies ahead of the mid-year examinations.\n\nPlease confirm your attendance by replying to this notice.\n\nKind regards,\nMs. N. Dlamini (Science Department)\n{SchoolName} School',
      },
      zu: {
        subject: '{SchoolName}: Isimemo Somhlangano Wabazali Nothisha',
        body: 'Mzali Obekekile {GuardianName},\n\nUyamenywa ngokuzithoba eMhlanganweni Wabazali Nothisha weThemu 2 ngoLwesine, mhla zingama-28 kuMeyi 2026, kusukela ngo-16:30 kuya ku-18:30 eHholo Lesikole.\n\nLeli yithuba lokubheka imiphumela ka-{LearnerName}, amabhuku akhe okufunda, kanye nokuhlela izindlela zokumeseka ngaphambi kokuhlolwa kukaNhlangulana.\n\nSicela uqinisekise ukuthi uzofika ngokuphendula lo mlayezo.\n\nOzithobayo,\nUNkkz N. Dlamini\n{SchoolName} School',
      },
      xh: {
        subject: '{SchoolName}: Isimemo Sentlanganiso Yabazali Nootitshala',
        body: 'Mzali Obekekileyo {GuardianName},\n\nUyamenywa ngembeko kwiNtlanganiso Yabazali Nootitshala yeKota 2 ngoLwesine, umhla wama-28 kuCanzibe 2026, ukususela ngo-16:30 ukuya ku-18:30 kwiHolo yeSikolo.\n\nEli lithuba lokuphonononga amanqaku ka-{LearnerName}, imisebenzi yakhe yaseklasini, kunye nokuxoxa ngamaphulo okumnceda ngaphambi kweemviwo zaphakathi enyakeni.\n\nNceda uqinisekise ubukho bakho ngokuphendula lo myalezo.\n\nOzithobileyo,\nUNkskz N. Dlamini\n{SchoolName} School',
      },
      af: {
        subject: 'Thandeka Sekondêr: Ouer-Onderwyser Konsultasie Aand Uitnodiging',
        body: 'Geagte {GuardianName},\n\nU word vriendelik uitgenooi na ons Kwartaal 2 Ouer-Onderwyser Aand op Donderdag, 28 Mei 2026, vanaf 16:30 tot 18:30 in die Skoolsaal.\n\nDit bied \'n gulde geleentheid om {LearnerName} se vordering, werksboeke en doelwitte voor die middeljaareksamen te bespreek.\n\nBevestig asseblief u bywoning deur op hierdie kennisgewing te antwoord.\n\nVriendelike groete,\nMe. N. Dlamini\n{SchoolName}',
      },
      st: {
        subject: '{SchoolName}: Memo ya Kopano ya Batswadi le Matitjhere',
        body: 'Motswadi ya Hlomphehang {GuardianName},\n\nLe mengwa ka tlhompho Kopanong ya Batswadi le Matitjhere ya Kotara ya 2 ka Labone, 28 Motsheanong 2026, ho tloha ka 16:30 ho fihlela 18:30 ka Holong ya Sekolo.\n\nLena ke monyetla wa ho hlahloba tswelopele ya {LearnerName}, dibuka tsa hae tsa mosebetsi, le ho buisana ka ditsela tsa ho mo tshehetsa pele ho dihlahlobo tsa mahareng a selemo.\n\nRe kopa le tiise haeba le tla be le le teng ka ho araba molaetsa ona.\n\nKa boikokobetso,\nMofumahatsana N. Dlamini\n{SchoolName} School',
      },
    },
  },
];

export const INITIAL_MESSAGE_LOGS: MessageLog[] = [];

export const INITIAL_TASKS: TeacherTask[] = [];

export const TODAY_TIMETABLE: TimetablePeriod[] = [];

export const INITIAL_SETTINGS: TeacherSettings = {
  teacherName: '',
  teacherTitle: '',
  staffId: '',
  email: '',
  phone: '',
  schoolName: '',
  schoolDistrict: '',
  schoolCircuit: '',
  province: 'South Africa',
  curriculum: 'CAPS (Curriculum and Assessment Policy Statement)',
  subjectsTaught: [],
  gradesTaught: [],
  textbooks: [],
  defaultLanguage: 'en',
  defaultChannel: 'WhatsApp',
  quietHoursStart: '18:00',
  quietHoursEnd: '06:30',
  enforceQuietHours: true,
  enableMorningBrief: true,
  enablePeriodReminders: true,
  enableEndOfDayWrap: true,
  isOnlineMode: true,
  lastSyncedAt: 'Local device storage only — no cloud sync',
  pendingSyncCount: 0,
};
