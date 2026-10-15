/**
 * Phase 7: Dedicated Mock Archive Data for Tamil Oral History Collection
 * ======================================================================
 * Independent dataset representing published oral history records across diverse
 * Tamil cultural domains, districts, and categories.
 * 
 * Strict Archival Rules:
 * - Clearly marked with isDemo: true and source: 'phase7_mock'
 * - Fictional community memoirs respecting real Tamil cultural practices
 * - Contains varied records: some with real local audio previews and some explicitly WITHOUT audio
 * - Aligns strictly with canonical public.stories schema
 */

export const CANONICAL_CATEGORIES = [
  { id: 'ALL', en: 'All Categories', ta: 'அனைத்துப் பகுப்புகள்' },
  { id: 'Agriculture', en: 'Agriculture', ta: 'விவசாயம் & உழவு மரபு' },
  { id: 'Traditional Medicine & Practices', en: 'Traditional Medicine & Practices', ta: 'சித்த மருத்துவம் & மூலிகை' },
  { id: 'Folk Songs & Storytelling', en: 'Folk Songs & Storytelling', ta: 'நாட்டுப்புற கலை & வாய்மொழிக் கதை' },
  { id: 'Festivals & Rituals', en: 'Festivals & Rituals', ta: 'திருவிழாக்கள் & வழிபாட்டு மரபு' },
  { id: 'Traditional Crafts', en: 'Traditional Crafts', ta: 'பாரம்பரிய கைவினை & நெசவு' },
  { id: 'Food Traditions', en: 'Food Traditions', ta: 'பாரம்பரிய உணவு முறை' },
  { id: 'Water Conservation', en: 'Water Conservation', ta: 'நீர் மேலாண்மை & கண்மாய்' },
  { id: 'Local History', en: 'Local History', ta: 'ஊர் வரலாறு & தொன்மம்' },
];

export const DISTRICTS = [
  'ALL',
  'Thanjavur (தஞ்சாவூர்)',
  'Madurai (மதுரை)',
  'Tiruvannamalai (திருவண்ணாமலை)',
  'Coimbatore (கோயம்புத்தூர்)',
  'Tirunelveli (திருநெல்வேலி)',
  'Dindigul (திண்டுக்கல்)',
  'Sivagangai (சிவகங்கை)',
  'Salem (சேலம்)',
  'Kanyakumari (கன்னியாகுமரி)',
  'Cuddalore (கடலூர்)',
  'Theni (தேனி)',
];

export const PHASE7_ARCHIVE_MOCK_STORIES = [
  {
    id: 'story-mock-01',
    isDemo: true,
    source: 'phase7_mock',
    title: 'காவிரி பாசன பாரம்பரிய நெல் சாகுபடி மற்றும் விதை பாதுகாப்பு',
    titleEn: 'Cauvery Delta Traditional Paddy Cultivation & Native Seed Preservation',
    contributor: 'இராமசாமி பிள்ளை (Ramasamy Pillai)',
    contributorRole: 'மூத்த உழவர் (Elder Farmer, 74 yrs)',
    uploader: 'காவிரி உழவர் கூட்டமைப்பு',
    villageOrTown: 'திருவையாறு (Thiruvaiyaru)',
    district: 'Thanjavur (தஞ்சாவூர்)',
    region: 'திருவையாறு, தஞ்சாவூர்',
    category: 'Agriculture',
    cropOrTopic: 'சீரக சம்பா & மாப்பிள்ளை சம்பா நெல்',
    date: '2025-10-14',
    summary: 'தஞ்சை டெல்டாவில் பாரம்பரிய ஆனிப்பட்ட உழவு, நாட்டு மாடுகளைப் பயன்படுத்தி நஞ்சை நிலம் உழுதல் மற்றும் நாட்டு நெல் ரகங்களை சாம்பல் தடவி மண்பானையில் பாதுகாக்கும் பாரம்பரிய உழவு முறை.',
    englishSummary: 'Oral testimony on traditional monsoon ploughing in the Cauvery delta, indigenous bullock pairs, and preserving heirloom seeds in ash-treated earthen granaries.',
    transcript: `எங்க தாத்தா காலத்துல இருந்தே நாங்க தஞ்சாவூர் பக்கத்துல காவிரி பாசனத்துல விவசாயம் பார்க்கிறோம். அப்போதெல்லாம் ரசாயன உரம் கிடையாது. ஆனி மாசம் காவிரில புதுத்தண்ணி வரும்போது தான் முதல் உழவு ஆரம்பிப்போம். 

சீரக சம்பா, மாப்பிள்ளை சம்பா, குந்தாவி போன்ற பாரம்பரிய நெல் விதைகளை அறுவடை செய்த உடனே, நல்லா வெயில்ல காய வச்சு, அடுப்பு சாம்பலும் வேப்பிலையும் கலந்து மண்பானையில போட்டு வைப்போம். இப்படி வச்சா மூணு வருஷம் ஆனாலும் வண்டு பூச்சி வராது, முளைப்புத்திறனும் குறையாது.

நாத்து நட்ட 15-வது நாள் வயல்ல தண்ணியை வடிச்சுட்டு, வேப்பெண்ணெய் கரைசலும் பஞ்சகவ்யமும் தெளிப்போம். மண் வளம் கெடாம இருந்தா தான் பூச்சி வராது. இந்த மாதிரி இயற்கை விவசாயம் செஞ்சப்போ அரிசி நல்ல மணமாவும், உடம்புக்கு பலமாவும் இருந்துச்சு. இந்த அனுபவத்தை இளைய தலைமுறை மறக்கக்கூடாது.`,
    tags: ['விதை சேமிப்பு', 'காவிரி டெல்டா', 'பாரம்பரிய நெல்', 'இயற்கை உழவு', 'Organic Farming', 'Thanjavur'],
    keywords: ['பாரம்பரிய நெல்', 'விதை சேமிப்பு', 'காவிரி பாசனம்', 'பஞ்சகவ்யம்'],
    audioDurationSeconds: 194,
    audioDurationFormatted: '03:14',
    audioUrl: '/test_sample_tamil.wav', // Available audio
    hasAudio: true,
    image: '/farmer_ramasamy.jpg',
  },
  {
    id: 'story-mock-02',
    isDemo: true,
    source: 'phase7_mock',
    title: 'ஆலங்கானல்லூர் நாட்டு காளைகள் வளர்ப்பு மற்றும் ஜல்லிக்கட்டு மரபு',
    titleEn: 'Alanganallur Native Bull Rearing & Jallikattu Pastoral Lore',
    contributor: 'முத்துக்கருப்பன் (Muthukaruppan)',
    contributorRole: 'கால்நடை வளர்ப்பாளர் (Native Cattle Breeder, 68 yrs)',
    uploader: 'மதுரை பாரம்பரிய அறக்கட்டளை',
    villageOrTown: 'அலங்காநல்லூர் (Alanganallur)',
    district: 'Madurai (மதுரை)',
    region: 'அலங்காநல்லூர், மதுரை',
    category: 'Festivals & Rituals',
    cropOrTopic: 'புலிகுளம் காளை இனம் (Pulikulam Bulls)',
    date: '2025-09-20',
    summary: 'மதுரை மண்ணின் அடையாளமான புலிகுளம் நாட்டு காளைகளை கண்ணும் கருத்துமாக வளர்த்தல், அவற்றுக்கு உளுந்து பருத்தி களி ஊட்டல் மற்றும் மாட்டுப் பொங்கல் வழிபாட்டு மரபு.',
    englishSummary: 'An elder pastoralist recalls the ancient lineage of Pulikulam bulls in Madurai, special protein feeds, and sacred cattle rituals during Thai Pongal.',
    transcript: `மதுரை சீமையில மாடுங்கிறது வெறும் மிருகம் இல்லீங்க, எங்க குடும்பத்துல ஒரு பிள்ளை மாதிரி. இந்த புலிகுளம் மாட்டோட நடை, திமில் கம்பீரம், அதோட கண் பார்வை தனி அழகு. 

சின்ன கன்றா இருக்கும்போதே அதுக்கு நீச்சல் பழக்குவோம். வைகை ஆத்து மணல்ல ஓட விடுவோம். பச்சைப் புல்லோட சேர்த்து, பனை வெல்லம், ஊற வச்ச உளுந்தங்களி, பருத்திக்கொட்டை தவிடு போட்டு தீனி வைப்போம். காளையோட மூச்சு வாங்கும் சத்தமே அதுக்கு இருக்கிற ஆரோக்கியத்தை சொல்லிடும்.

தை மாசம் மாட்டுப் பொங்கல் அன்னிக்கு கொம்புகளுக்கு வர்ணம் பூசி, சந்தனம் குங்குமம் வச்சு, மணி கட்டி ஊரே கொண்டாடும். ஜல்லிக்கட்டுல காளையை அடக்குறது வீரம்னா, அந்த காளையை எந்த வன்முறையும் இல்லாம நெஞ்சார வளர்க்கிறது எங்க பண்பாடு.`,
    tags: ['ஜல்லிக்கட்டு', 'நாட்டு மாடுகள்', 'புலிகுளம்', 'மதுரை பண்பாடு', 'Alanganallur', 'Native Cattle'],
    keywords: ['புலிகுளம் காளை', 'மாட்டுப் பொங்கல்', 'நாட்டு மாடு வளர்ப்பு'],
    audioDurationSeconds: 242,
    audioDurationFormatted: '04:02',
    audioUrl: null, // Explicitly NO audio to test audio unavailable state!
    hasAudio: false,
    image: '/tamil_farmer_hero.jpg',
  },
  {
    id: 'story-mock-03',
    isDemo: true,
    source: 'phase7_mock',
    title: 'கிராமப்புற சித்த மருத்துவ மூலிகைக் கசாயங்கள் மற்றும் கைவைத்தியம்',
    titleEn: 'Siddha Herbal Decoctions & Indigenous Household Healing Wisdom',
    contributor: 'முத்துலட்சுமி அம்மாள் (Muthulakshmi Ammal)',
    contributorRole: 'நாட்டு மூலிகை வைத்தியர் (Herbal Healer, 71 yrs)',
    uploader: 'தனிஷ் (Dhanish)',
    villageOrTown: 'செங்கம் (Chengam)',
    district: 'Tiruvannamalai (திருவண்ணாமலை)',
    region: 'செங்கம், திருவண்ணாமலை',
    category: 'Traditional Medicine & Practices',
    cropOrTopic: 'ஆடாதோடை & தூதுவளை மூலிகைகள்',
    date: '2025-08-18',
    summary: 'திருவண்ணாமலை மலையடிவார கிராமங்களில் சளி, இருமல் மற்றும் காய்ச்சலுக்கு கொல்லைப்புறத்தில் விளையும் ஆடாதோடை, தூதுவளை, நிலவேம்பு கொண்டு தயாரித்த பாரம்பரிய கசாய முறை.',
    englishSummary: 'Recollections of native Siddha herbalism, home concoctions made from Adhatoda and Thuthuvalai leaves, and treating fevers without synthetic drugs.',
    transcript: `எங்க ஊர்ல நாங்க சின்ன வயசுல டாக்டரையே பார்த்தது இல்ல. யாருக்காவது சளி, நெஞ்சுக்கட்டுன்னா கொல்லைப்புறத்துக்கு ஓடுவோம். தூதுவளை இலையை பறிச்சு முள்ளை நீக்கிட்டு, மிளகு, சீரகம், பூண்டு தட்டி போட்டு நெய்ல வதக்கி ரசம் வச்சு கொடுப்போம். குடிச்ச ஒரே நாள்ல கபம் அத்தனையும் வெளியில வந்துடும்.

குழந்தைகளுக்கு மாந்தம், வயிற்றுப்போக்கு வந்தா வசம்பை சுட்டு உரைச்சு நாக்குல தடவுவாங்க. பெரியவங்களுக்கு காய்ச்சல்னா நிலவேம்பும் சுக்கும் காய்ச்சி கொடுப்போம். 

இந்த மூலிகைகள் எல்லாம் காசு கொடுத்து வாங்க வேண்டியது இல்ல; நம்ம வீட்டு வரப்புகளிலேயே ஆண்டவன் கொடுத்த வரப்பிரசாதமா முளைச்சிருக்கும். இந்த ஞானத்தை நாம பதிவு பண்ணி வைக்கலன்னா வருங்கால சந்ததி வெறும் மாத்திரைகளை மட்டுமே நம்பி வாழ வேண்டியிருக்கும்.`,
    tags: ['சித்த மருத்துவம்', 'மூலிகைகள்', 'தூதுவளை', 'ஆடாதோடை', 'Siddha Medicine', 'Herbal Remedies'],
    keywords: ['சித்த மருத்துவம்', 'நாட்டு மூலிகை', 'கசாயம்', 'கைவைத்தியம்'],
    audioDurationSeconds: 165,
    audioDurationFormatted: '02:45',
    audioUrl: '/test_sample_tamil.wav',
    hasAudio: true,
    image: '/farmer_muthulakshmi.jpg',
  },
  {
    id: 'story-mock-04',
    isDemo: true,
    source: 'phase7_mock',
    title: 'செட்டிநாட்டு பாரம்பரிய காரைப்பூச்சு மற்றும் சுண்ணாம்பு கட்டுமான கலை',
    titleEn: 'Chettinad Traditional Egg-White Lime Plaster & Heritage Architecture',
    contributor: 'மீனாட்சி சுந்தரம் ஆசாரி (Meenakshi Sundaram Asari)',
    contributorRole: 'பாரம்பரிய கட்டடக் கலைஞர் (Master Mason, 76 yrs)',
    uploader: 'காரைக்குடி வரலாற்று சங்கம்',
    villageOrTown: 'கானாடுகாத்தான் (Kanadukathan)',
    district: 'Sivagangai (சிவகங்கை)',
    region: 'கானாடுகாத்தான், சிவகங்கை',
    category: 'Traditional Crafts',
    cropOrTopic: 'முட்டை வெள்ளைக்கரு சுண்ணாம்பு காரை',
    date: '2025-07-12',
    summary: 'செட்டிநாட்டு வீடுகளில் இன்றும் பளிங்கு போல மின்னும் சுவர்களின் ரகசியம்: கடுக்காய், வெல்லம், முட்டை வெள்ளைக்கரு மற்றும் சிப்பி சுண்ணாம்பு கலந்து அரைத்த பாரம்பரிய காரைப்பூச்சு முறை.',
    englishSummary: 'A master craftsman reveals the century-old recipe for Chettinad egg-white lime plaster that gives heritage mansions mirror-finish cooling walls.',
    transcript: `நூறு வருஷம் முன்னாடி கட்டின செட்டிநாட்டு வீடுகள்ல போய் பாருங்க, சுவர்ல முகம் பார்க்கலாம்; அவ்வளவு பளபளப்பா இருக்கும். ஏசி இல்லாமலே கோடை காலத்துலயும் வீடு சில்லுனு இருக்கும். அதுக்கு காரணம் நாங்க பயன்படுத்தின சுண்ணாம்பு காரை தான்.

சிப்பி சுண்ணாம்பை நல்லா ஊற வச்சு, கடுக்காய் தண்ணீர், பனை வெல்ல சாறு சேர்த்து செக்குல போட்டு ஆட்டுவோம். கடைசி பூச்சுக்கு முட்டையோட வெள்ளைக்கருவையும் பசும்பாலையும் கலந்து குழைச்சு பூசுவோம். அதுக்கப்புறம் உருளைக்கல்ல வச்சு சுவரை தேய்ச்சு மெருகேத்துவோம்.

இன்னைக்கு சிமெண்ட் பூசி ஒரு வருஷத்துலயே விரிசல் விழுது. ஆனா எங்க முன்னோர்கள் கண்டுபிடிச்ச இந்த சுண்ணாம்பு பூச்சு மழைக்கும் வெயிலுக்கும் நூறாண்டு காலம் அப்படியே நிக்குது. இது தமிழர்களோட உன்னதமான வேதியியல் அறிவு.`,
    tags: ['செட்டிநாடு', 'சுண்ணாம்பு பூச்சு', 'பாரம்பரிய கட்டடம்', 'கைவினை', 'Chettinad Architecture', 'Masonry'],
    keywords: ['காரைப்பூச்சு', 'செட்டிநாடு அரண்மனை', 'சிப்பி சுண்ணாம்பு', 'பாரம்பரிய கலை'],
    audioDurationSeconds: 280,
    audioDurationFormatted: '04:40',
    audioUrl: null, // No audio
    hasAudio: false,
    image: '/chettinad_terracotta_craft.svg',
  },
  {
    id: 'story-mock-05',
    isDemo: true,
    source: 'phase7_mock',
    title: 'தாமிரபரணி ஆற்றுப் பாசனம் மற்றும் குடவோலை பாசன முறை',
    titleEn: 'Tamirabarani River Traditional Canal Irrigation & Community Water Governance',
    contributor: 'சுப்பிரமணியன் (Subramanian)',
    contributorRole: 'நீர்ப்பாசன மடை பராமரிப்பாளர் (Canal Custodian, 69 yrs)',
    uploader: 'நெல்லை பாசன சங்கம்',
    villageOrTown: 'அம்பாசமுத்திரம் (Ambasamudram)',
    district: 'Tirunelveli (திருநெல்வேலி)',
    region: 'அம்பாசமுத்திரம், திருநெல்வேலி',
    category: 'Water Conservation',
    cropOrTopic: 'மடை & கால்வாய் பராமரிப்பு',
    date: '2025-06-30',
    summary: 'தென்பாண்டி நாட்டின் வற்றாத ஜீவநதியான தாமிரபரணி ஆற்றிலிருந்து வாய்க்கால்கள் வழியாக பாசனத்திற்கு முறை வைத்து நீர் பாய்ச்சும் சமூக நீதி சார்ந்த குடவோலை நீர் மேலாண்மை.',
    englishSummary: 'Oral narrative on equitable canal irrigation from the perennial Tamirabarani river, sluice gate masonry, and community-led water sharing agreements.',
    transcript: `தாமிரபரணி ஆறு எங்க ஊருக்கு தாய்ப்பால் மாதிரி. அகத்தியர் மலையில இருந்து இறங்கி வரும்போது இருக்கிற அதே வேகம் கடைக்கோடி வரைக்கும் குறையாது. எங்க ஊர்ல பதினெட்டு கால்வாய்கள் இருக்கு. 

ஒவ்வொரு கால்வாயிலேயும் தண்ணி பாயும்போது கடைமடை விவசாயிக்கு முதல்ல தண்ணி போகணும்ங்கிறது தான் முன்னோர்கள் போட்ட சட்டம். தலைமடையில இருக்கிறவன் அவனுக்கு வேணும்கிற அளவுக்கு மட்டுமே மட திறந்துக்கணும். 

ஊர் கூடி 'குடிமராமத்து' செய்வோம். ஆத்துல சேரும் மணலை அள்ளி வரப்புகளை பலப்படுத்துவோம். யாராவது அநியாயமா தண்ணியை திருடினா பஞ்சாயத்துல தண்டனை கொடுப்பாங்க. நீர் மேலாண்மையில தமிழர்கள் காட்டிய ஒற்றுமையும் ஒழுக்கமும் தான் பல நூறு ஆண்டுகளா விவசாயத்தை வாழ வச்சது.`,
    tags: ['தாமிரபரணி', 'நீர் மேலாண்மை', 'குடிமராமத்து', 'கால்வாய் பாசனம்', 'Tamirabarani', 'Irrigation'],
    keywords: ['தாமிரபரணி ஆறு', 'குடிமராமத்து', 'மடை பாசனம்', 'நீர் பங்கீடு'],
    audioDurationSeconds: 210,
    audioDurationFormatted: '03:30',
    audioUrl: '/test_sample_tamil.wav',
    hasAudio: true,
    image: '/water_sluice_irrigation.jpg',
  },
  {
    id: 'story-mock-06',
    isDemo: true,
    source: 'phase7_mock',
    title: 'கொங்கு மண்டல நாட்டு வாகை மரச்செக்கு நல்லெண்ணெய் உற்பத்தி',
    titleEn: 'Kongu Traditional Vaagai Wood-Pressed Sesame Oil & Cold Processing',
    contributor: 'பழனிச்சாமி கவுண்டர் (Palanisamy Gounder)',
    contributorRole: 'மரச்செக்கு உற்பத்தியாளர் (Wood-Press Oil Producer, 65 yrs)',
    uploader: 'ஈரோடு உழவர் சங்கம்',
    villageOrTown: 'பெருந்துறை (Perundurai)',
    district: 'Coimbatore (கோயம்புத்தூர்)',
    region: 'பெருந்துறை, கோயம்புத்தூர்',
    category: 'Food Traditions',
    cropOrTopic: 'நாட்டு எள் & மரச்செக்கு',
    date: '2025-05-15',
    summary: 'நாட்டு வாகை மரத்தில் செய்த செக்கில் எள்ளும் கருப்பட்டியும் சேர்த்து மாடுகளை பூட்டி சுழற்றி எண்ணெய் எடுக்கும் பாரம்பரிய மரச்செக்கு உற்பத்தி முறை.',
    englishSummary: 'Insights into indigenous Vaagai timber cold-press extraction of sesame oil layered with palm jaggery, powered by draught cattle.',
    transcript: `இரும்பு மிஷின்ல எண்ணெய் ஆட்டும்போது சூடாகி எண்ணெயோட சத்து எல்லாம் போயிடும். ஆனா எங்க கொங்கு நாட்டுல நாங்க வாகை மரத்துல தான் செக்கு செய்வோம். வாகை மரத்துக்கு உடம்பை குளிர்ச்சி பண்ற குணம் உண்டு.

செக்குல நாட்டு எள்ளைப் போட்டு, கூடவே நல்ல பதமான பனை கருப்பட்டியை போடுவோம். ரெண்டு மாடுகளை பூட்டி நிதானமா சுழற்றும் போது செக்கு சூடேறாது. எண்ணெயோட மணம் ஊரையே கூட்டும்.

இந்த எண்ணெயை வடி கட்டி வெயில்ல வச்சு எடுப்போம். இதுல பலகாரம் சுட்டாலும் சரி, உடம்புக்கு தேய்ச்சு குளிச்சாலும் சரி, எந்த நோயும் வராது. பாரம்பரிய உணவே நமக்கு மருந்துன்னு வாழ்ந்தவங்க நாங்க.`,
    tags: ['மரச்செக்கு', 'நல்லெண்ணெய்', 'கொங்கு நாடு', 'பாரம்பரிய உணவு', 'Cold Pressed Oil', 'Food Heritage'],
    keywords: ['மரச்செக்கு எண்ணெய்', 'வாகை மரம்', 'பனை கருப்பட்டி', 'நாட்டு எள்'],
    audioDurationSeconds: 178,
    audioDurationFormatted: '02:58',
    audioUrl: null, // No audio
    hasAudio: false,
    image: '/traditional_fermented_food.svg',
  },
  {
    id: 'story-mock-07',
    isDemo: true,
    source: 'phase7_mock',
    title: 'கன்னியாகுமரி முக்கடல் கட்டுமரம் மற்றும் விண்மீன் வழிசெலுத்தல்',
    titleEn: 'Kanyakumari Catamaran Lore & Traditional Celestial Navigation at Sea',
    contributor: 'அந்தோணி அடிமை (Anthony Adimai)',
    contributorRole: 'மூத்த மீனவர் (Veteran Fisher, 72 yrs)',
    uploader: 'குமரி கடல்வள சங்கம்',
    villageOrTown: 'முட்டம் (Muttom)',
    district: 'Kanyakumari (கன்னியாகுமரி)',
    region: 'முட்டம், கன்னியாகுமரி',
    category: 'Local History',
    cropOrTopic: 'ஐந்து மர கட்டுமரம் & அம்புலி விண்மீன்',
    date: '2025-04-10',
    summary: 'காம்பஸ் ஜிபிஎஸ் இல்லாத காலத்தில், நடுக்கடலில் அம்புலி மற்றும் அருந்ததி விண்மீன்களைப் பார்த்தும் காற்று மற்றும் அலைகளின் வாடையை வைத்தும் திசை அறிந்து கரை திரும்பிய குமரி கட்டுமர மீனவர்களின் கடல் அறிவு.',
    englishSummary: 'A veteran sea-farer recounts ancient celestial navigation using constellations, ocean currents, and wind scents aboard traditional five-log catamarans.',
    transcript: `நாங்க கடலுக்கு போகும்போது திசை காட்டும் கருவி எல்லாம் கிடையாதுங்க. அஞ்சு அல்பீசியா மரக்கட்டைகளை கயித்துனால இறுகக் கட்டி கட்டுமரம் செஞ்சு கடலுக்கு போவோம். 

ராத்திரி நேரத்துல வானத்துல இருக்கிற அம்புலி நட்சத்திரமும், வெள்ளியும் தான் எங்களுக்கு திசை காட்டும். காத்து எந்த பக்கம் வீசுது, அலை எந்த பக்கம் திரும்புதுன்னு மூக்குனால வாசனை பிடிச்சே சொல்லிடலாம்.

சுறா மீன் எங்க இருக்கு, எந்த ஆழத்துல பாறை இருக்குங்கிறத கடலோட நிறத்தை வச்சு கண்டுபிடிப்போம். கடலன்னை எங்களுக்கு வெறும் தொழில் இல்ல, அவ தான் எங்க வாழ்க்கை. இந்த கடல் அறிவு புத்தகத்துல இல்ல, முன்னோர்கள் வாய்மொழியா சொல்லித் தந்தது.`,
    tags: ['கட்டுமரம்', 'மீனவர் வாழ்வியல்', 'விண்மீன் வழிகாட்டல்', 'குமரி கடல்', 'Catamaran', 'Maritime Lore'],
    keywords: ['கட்டுமரம்', 'விண்மீன் வழிகாட்டல்', 'கடல் அறிவு', 'குமரி மீனவர்'],
    audioDurationSeconds: 225,
    audioDurationFormatted: '03:45',
    audioUrl: '/test_sample_tamil.wav',
    hasAudio: true,
    image: '/kolli_herbal_medicine.svg',
  },
  {
    id: 'story-mock-08',
    isDemo: true,
    source: 'phase7_mock',
    title: 'புவனகிரி பாரம்பரிய பட்டு நெசவு மற்றும் இயற்கை வண்ணக் கலவை',
    titleEn: 'Bhuvanagiri Traditional Handloom Silk Weaving & Natural Vegetable Dyes',
    contributor: 'கணேசன் முதலியார் (Ganesan Mudaliar)',
    contributorRole: 'கைத்தறி நெசவாளர் (Master Handloom Weaver, 67 yrs)',
    uploader: 'கடலூர் கைவினை சங்கம்',
    villageOrTown: 'புவனகிரி (Bhuvanagiri)',
    district: 'Cuddalore (கடலூர்)',
    region: 'புவனகிரி, கடலூர்',
    category: 'Traditional Crafts',
    cropOrTopic: 'தறி நெசவு & மஞ்சள் பட்டை சாயம்',
    date: '2025-03-22',
    summary: 'கடலூர் மாவட்ட புவனகிரி பகுதியில் தலைமுறை தலைமுறையாக கைத்தறியில் பட்டு மற்றும் பருத்தி புடவைகளை நெய்தல், மாமரப் பட்டை மற்றும் மஞ்சள் கொண்டு இயற்கை சாயம் தயாரிக்கும் அரிய தொழில் கலை.',
    englishSummary: 'Master weavers recount the meticulous geometry of traditional pit-loom silk weaving and extracting eco-friendly shades from turmeric and tree barks.',
    transcript: `எங்க ஊர்ல ஒரு காலத்துல எல்லா வீட்டு வாசல்லயும் தறி சத்தம் 'டக் டக்'னு கேட்டுக்கிட்டே இருக்கும். குழித்தறியில உட்கார்ந்து உடம்போட அத்தனை அங்கத்தையும் ஒருமுகப்படுத்தி நெசவு செய்வோம்.

சாயத்துக்கு நாங்க ரசாயனம் போட மாட்டோம். மஞ்சளும் சுண்ணாம்பு கலந்து சிவப்பு வண்ணம் எடுப்போம்; மாமரப் பட்டையை ஊற வச்சு பழுப்பு நிறம் தயாரிப்போம்; அவுரி இலையில இருந்து நீல வண்ணம் எடுப்போம். இந்த புடவைகளை கட்டினா தோலுக்கு எந்த அரிப்பும் வராது.

ஒரு புடவை நெய்ய பத்து நாளாவும். அந்த பார்டர்ல கோபுரம், மயில், அன்னப்பறவை உருவங்களை கையாலயே இழைப்போம். கைத்தறி நெசவுங்கிறது வெறும் துணி இல்ல, அது தமிழனோட உழைப்பும் கலையும் சேர்ந்த கவிதை.`,
    tags: ['கைத்தறி', 'புவனகிரி பட்டு', 'இயற்கை சாயம்', 'நெசவு மரபு', 'Handloom', 'Textile Heritage'],
    keywords: ['குழித்தறி', 'இயற்கை சாயம்', 'புவனகிரி பட்டு', 'கைத்தறி நெசவு'],
    audioDurationSeconds: 198,
    audioDurationFormatted: '03:18',
    audioUrl: null, // No audio
    hasAudio: false,
    image: '/kongu_handloom_weaving.jpg',
  },
  {
    id: 'story-mock-09',
    isDemo: true,
    source: 'phase7_mock',
    title: 'திண்டுக்கல் சிறுமலை மலை வாழை சாகுபடி மற்றும் தேன் சுவை ரகசியம்',
    titleEn: 'Dindigul Sirumalai Hill Banana Organic Farming & Micro-Climate Secret',
    contributor: 'வெள்ளையன் (Vellaiyan)',
    contributorRole: 'மலைத்தோட்ட விவசாயி (Hill Plantation Farmer, 63 yrs)',
    uploader: 'திண்டுக்கல் மலைத்தோட்ட கூட்டமைப்பு',
    villageOrTown: 'சிறுமலை (Sirumalai)',
    district: 'Dindigul (திண்டுக்கல்)',
    region: 'சிறுமலை, திண்டுக்கல்',
    category: 'Agriculture',
    cropOrTopic: 'சிறுமலை வாழை & மலைத்தேன்',
    date: '2025-02-18',
    summary: 'திண்டுக்கல் சிறுமலை குளிர்ந்த தட்பவெப்பத்தில் மட்டுமே விளையும் தனித்துவமான மலை வாழை, நீண்ட நாட்கள் கெட்டுப்போகாத தன்மை மற்றும் அதன் மருத்துவ குணங்கள் குறித்த வாய்மொழி பகிர்வு.',
    englishSummary: 'An indigenous hill farmer shares the rare micro-climate conditions that give Sirumalai bananas their honey-like sweetness and unique medicinal shelf life.',
    transcript: `சிறுமலை வாழைக்கு ஈடு இணையே இந்த உலகத்துல கிடையாதுங்க. இத வேற எந்த ஊர்ல கொண்டு போய் நட்டாலும் இந்த ருசி வராது. ஏன்னா எங்க மலை மண்ணோட வளமும், இங்க வீசும் ஈரக்காத்தும் தான் இந்த பழத்துக்கு தேன் மாதிரியான சுவையை கொடுக்குது.

இந்த பழத்தை பறிச்சு ஒரு மாசம் வச்சிருந்தாலும் தோல் கறுத்து போகுமே தவிர உள்ள பழம் அழுகாது. செரிமானத்துக்கு ரொம்ப நல்லது. 

நாங்க ரசாயன உரமே போடுறது இல்ல. காடுகளிலிருந்து உதிர்ந்து விழும் சருகு தழைகளை மக்க வச்சு போடுவோம். இந்த பாரம்பரிய பழத்தை காப்பாத்த நாங்க வனத்தோட சேர்ந்து வாழ கத்துக்கிட்டோம்.`,
    tags: ['சிறுமலை வாழை', 'மலை விவசாயம்', 'திண்டுக்கல்', 'பழ மரபு', 'Hill Banana', 'Organic Farming'],
    keywords: ['சிறுமலை வாழை', 'இயற்கை உரம்', 'மருத்துவ குணம்'],
    audioDurationSeconds: 154,
    audioDurationFormatted: '02:34',
    audioUrl: '/test_sample_tamil.wav',
    hasAudio: true,
    image: '/heritage_seed_preservation.jpg',
  },
  {
    id: 'story-mock-10',
    isDemo: true,
    source: 'phase7_mock',
    title: 'களத்துமேட்டு அறுவடை நாட்டுப்புறப் பாடல்கள் மற்றும் ஏற்றப்பாட்டு',
    titleEn: 'Delta Threshing Floor Folk Songs & Well-Balancing Errapattu Melodies',
    contributor: 'மாரியம்மாள் (Mariyammal)',
    contributorRole: 'நாட்டுப்புற பாடகி (Folk Song Custodian, 70 yrs)',
    uploader: 'தஞ்சை நாட்டுப்புற ஆய்வகம்',
    villageOrTown: 'பாபநாசம் (Papanasam)',
    district: 'Thanjavur (தஞ்சாவூர்)',
    region: 'பாபநாசம், தஞ்சாவூர்',
    category: 'Folk Songs & Storytelling',
    cropOrTopic: 'ஏற்றப்பாட்டு & அறுவடை பாட்டு',
    date: '2025-01-15',
    summary: 'வயலில் நாற்று நடும் போதும், மாடுகளை வைத்து போரடிக்கும் போதும் களைப்பு தெரியாமல் பாடப்படும் தொன்மையான கிராமிய ஏற்றப்பாட்டு மற்றும் நாட்டுப்புற வாய்மொழி கலை மரபு.',
    englishSummary: 'Vocal preservation of spontaneous work-songs sung rhythmically during manual well irrigation (Errapattu) and grain threshing in rural Thanjavur.',
    transcript: `நாங்க வயலுக்கு போயிட்டா வானமே கூரை, பூமியே மெத்தை. ஏத்தம் இறைக்கும்போது தண்ணி தொட்டிலுக்குள்ள வந்து விழும் தாளத்துக்கு ஏத்த மாதிரி பாடுவோம். 

'ஏலேலோ ஐலசா... ஏலேலோ ஐலசா...'னு குரல் கொடுத்தா பக்கத்து வயல்ல இருக்கிறவங்களும் சேர்ந்து பாடுவாங்க. வேலை செய்ற களைப்பே எங்களுக்கு தெரியாது. 

அறுவடை முடிஞ்சு களத்துல நெல்மணிகளை குவிக்கும்போது குலவை போடுவோம். இந்த பாட்டெல்லாம் எந்த புத்தகத்துலயும் எழுதி வச்சு நாங்க பாடல; எங்க அம்மாக்கள் பாடி நாங்க கேட்டு மனசுல பதிஞ்சது. வாய்மொழியா வந்த கலை இது.`,
    tags: ['நாட்டுப்புறப் பாடல்', 'ஏற்றப்பாட்டு', 'அறுவடை பாட்டு', 'கிராமிய இசை', 'Folk Songs', 'Oral Traditions'],
    keywords: ['ஏற்றப்பாட்டு', 'நாட்டுப்புற பாடல்', 'களைப்பு நீக்கும் கலை', 'வாய்மொழி பாடல்'],
    audioDurationSeconds: 215,
    audioDurationFormatted: '03:35',
    audioUrl: null, // No audio
    hasAudio: false,
    image: '/tirunelveli_villupaattu.svg',
  },
];
