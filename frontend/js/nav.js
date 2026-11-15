/**
 * NASA FIRE-X Universal Client-Side Controller & Complete Bilingual Engine (v5.0)
 * Seamlessly translates 100% of all 6 platform pages between English and Azerbaijani.
 */
(function() {
  'use strict';

  // --- COMPREHENSIVE AZERBAIJANI TRANSLATIONS ---
  const TRANSLATIONS_AZ = {
    // === COMMON NAVBAR ===
    nav: {
      brandSub: 'MİKROYERÇƏKİM YANMA İNTELLEKTİ',
      home: 'Ana Səhifə',
      analytics: 'Analitika Mərkəzi',
      explorer: 'Məlumat Kəşfiyyatı',
      simulator: 'Missiya Simulyatoru',
      ai: 'AI Köməkçi',
      about: 'Haqqında',
      live: 'CANLI',
      aiBtn: 'AI Köməkçi'
    },

    // === COMMON FOOTER ===
    footer: {
      desc: 'SI-Powered (Super Intelligence / AI) Mikroyerçəkim Yanma Datalarından Yanğın Təhlükəsizliyi İntellekti. NASA Space Apps Challenge 2026.',
      colPlatform: 'Platforma',
      colData: 'Məlumat Mənbələri',
      analytics: 'Analitika Mərkəzi',
      explorer: 'Məlumat Kəşfiyyatı',
      simulator: 'Missiya Simulyatoru',
      ai: 'AI Köməkçi',
      about: 'Sənədləşmə & Haqqında',
      copyright: '© 2026 NASA FIRE-X · NASA Space Apps Challenge üçün hazırlanıb',
      dataCount: 'Məlumat: NASA Physical Science Informatics (PSI) · 569 qeyd (407-si PSI-təsdiqli)'
    },

    // === 1. HOME PAGE (index.html) ===
    home: {
      badge: 'NASA SPACE APPS CHALLENGE 2026 \u00a0·\u00a0 KOSMOSDA YANĞIN TƏHLÜKƏSİZLİYİ',
      title: 'ALOV SƏRBƏST DÜŞMƏDƏ',
      subtitle: 'SI-Powered: Mikroyerçəkim Yanma Datalarından Yanğın Təhlükəsizliyi İntellekti',
      desc: 'AI və SQL-RAG tərəfindən təhlil edilən 569 mikroyerçəkim yanma qeydi (407-si rəsmi NASA PSI cədvəllərindən, 162-si açıq etiketlənmiş illüstrativ) — Kosmik Gəmi, BKS, Ay Bazası, Mars Bazası, Təzyiqli Rover və EVA Skafandrında yanğın təhlükəsizliyini təmin edir.',
      btnExplore: 'Məlumatları Kəşf Et',
      btnSimulator: 'Simulyatoru Başlat',
      clockLabel: 'MİSSİYA VAXTI (UTC):',
      scroll: 'Aşağı',
      statExp: 'Kanonik Eksperimentlər',
      statFam: 'PSI Tədqiqat Ailələri',
      statScen: 'Missiya Mühitləri',
      statInt: 'Məlumat Dəqiqliyi',

      aboutEyebrow: 'Layihə Haqqında',
      aboutTitle: 'Orbitdə <span class="text-gradient">Yanğın Təhlükəsizliyi Elmi</span>',
      aboutDesc: 'FIRE-X NASA-nın ən əhatəli mikroyerçəkim yanma məlumat bazasını toplayır və təhlil edir. Qravitasiya olmadan alov tamamilə fərqli davranır — alov kürəvi forma alır, soyuq alovlar davam edir və ənənəvi yanğın təhlükəsizliyi qaydaları artıq tətbiq olunmur.',
      feat1Title: '569 Qeyd · 407-si PSI-Təsdiqli',
      feat1Desc: 'FLEX damcı alovlarından (He/CO₂) və ACME CFI-G (85% O₂) sınaqlarından SAFFIRE-I/II/III və DAFT Ay tozu/tüstü təcrübələrinə qədər.',
      feat2Title: 'AI + Canlı SQLite SQL-RAG',
      feat2Desc: 'Hallüsinasiyasız elmi cavablar üçün canlı SQLite NASA PSI sorğuları ilə inteqrasiya edilmiş OpenAI GPT-4o-mini.',
      feat3Title: 'SI Tədqiqat Reytinqi & Simulyator',
      feat3Desc: 'BKS, Ay Bazası (0.16g), Mars Bazası (0.38g), Təzyiqli Rover və EVA Skafandrında 0g–1g sərhədli yanğın risklərini modelləşdirin.',
      issBadgeTitle: 'Beynəlxalq Kosmik Stansiya',
      issBadgeSub: 'Orbit: 408 km | Sürət: 27,600 km/s',

      famEyebrow: 'Uçuş Tədqiqatları',
      famTitle: '18 <span class="text-gradient">PSI Tədqiqat Ailəsi</span>',
      famViewAll: 'Bütün Datalara Bax →',

      envEyebrow: 'Planetar Yanğın Riski',
      envTitle: 'Missiya <span class="text-gradient">Mühitləri</span>',
      envDesc: 'Alov hər bir kosmik gəmi atmosferində fərqli davranır. Oksigen faizi və kabin təzyiqi hər şeyi müəyyən edir.',

      modEyebrow: 'Platforma Modulları',
      modTitle: 'Platformanı <span class="text-gradient">Kəşf Edin</span>'
    },

    // === 2. ANALYTICS PAGE (analytics.html) ===
    analytics: {
      heroTag: 'ORBİTAL MAYE VƏ YANMA TELEMETRİYASI MƏRKƏZİ',
      pageTitle: 'Mikroyerçəkim Yanma Analitikası Mühərriki',
      pageDesc: '569 NASA PSI uçuş testindən real-vaxt 3D telemetriya, sönmə hədləri analizi və məcburi hava axını dinamikası',
      
      stat1Label: 'Kanonik Eksperimentlər',
      stat1Sub: 'NASA PSI təsdiqlənmiş uçuş qeydləri',
      stat2Label: 'Orta Sönmə Diametri (de)',
      stat2Sub: 'Mikroyerçəkimdə sönmə həddi',
      stat3Label: 'Orta O₂ Mol Hissəsi',
      stat3Sub: 'Sınaq diapazonu: 12.0% – 85.0% (CFI-G)',
      stat4Label: 'Uçuş Tədqiqatları',
      stat4Val: '18 Ailə',
      stat4Sub: 'FLEX · BASS · SAFFIRE · ACME · SPICE · DAFT',

      holoTitle: 'İnteraktiv 3D/4D Yanma Holo-Laboratoriyası',
      holoSub: 'WebGL 3D Telemetriya Simulyasiyası // Fırlatmaq üçün çəkin, Miqyası dəyişmək üçün sürüşdürün',
      tabScatter: '4D Saçılma Kubu',
      tabDroplet: '3D Kürəvi Damcı Alovu',
      tabAirflow: '3D Məcburi Hava Axını Kanalı',

      hudTitle: 'SEÇİLMİŞ EKSPERİMENT',
      hudActive: 'AKTİV',
      hudKeyId: 'Telemetriya ID:',
      hudKeyFam: 'Uçuş Tədqiqatı:',
      hudKeyFuel: 'Yanacaq / Material:',
      hudKeyO2: 'Oksigen Mol Hissəsi:',
      hudKeyPress: 'Kamera Təzyiqi:',
      hudKeyDe: 'Sönmə Diametri (de):',
      hudKeyOutcome: 'Sönmə Nəticəsi:',
      hudInspect: 'Bazada İncələ →',
      hudAskAi: 'AI-ya Soruş',
      hudHint: '[3D İDARƏETMƏ] Sol Düymə: 3D Fırlat · Çarx: Yaxınlaşdır · Üzərinə gətir: Məlumatı oxu',

      mod1Badge: 'SÖNMƏ HƏDDİ // NASA-STD-6001',
      mod1Title: 'Alov Sönmə Diametri vs. Oksigen Qatılığı',
      mod1Desc: 'O₂ mol hissəsindən asılı olaraq damcı və yanacaq nümunələrinin kritik sönmə sərhədlərini qiymətləndirir. Oksidləşdirici artdıqca sönmə diametrinin eksponensial azalmasını göstərir.',
      mod1Btn: 'Sönmə Dinamikasını Təhlil Et',

      mod2Badge: 'HİDROAERODİNAMİKA // CIR & MSG KANALI TELEMETRİYASI',
      mod2Title: 'Yanma Müddəti vs. Məcburi Konvektiv Hava Axını',
      mod2Desc: 'Aşağı axında (<2 sm/s) radiativ soyuma ilə yüksək axında (>18 sm/s) konvektiv üfürmə arasındakı keçidi təhlil edir. Mikroyerçəkimdə optimal yanma sabitliyi dəhlizini müəyyən edir.',
      mod2Btn: 'Üfürmə Sürətini Qiymətləndir',

      mod3Badge: 'MATERİALŞÜNASLIQ // KİMYƏVİ TƏSNİFAT',
      mod3Title: 'Yanacaq Alovlanma Matrisi və Nümunə Bölgüsü',
      mod3Desc: '569 sınağın material kateqoriyası və kimyəvi tərkibinə görə ətraflı bölgüsü. Maye karbohidrogenlər, spirtlər, bərk termoplastlar, parçalar və qaz yanacaqlarını müqayisə edir.',
      mod3Btn: 'Material Riskini Sorğula',

      mod4Badge: 'SINAQ REJİMLƏRİ // NƏTİCƏ TAKSONOMİYASI',
      mod4Title: 'Sönmə Nəticələrinin Tezlikləri',
      mod4Desc: 'BKS-də həyata keçirilən orbital sınaq kampaniyalarında müşahidə olunan sönmə rejimlərinin təsnifatı. Radiativ itki, konvektiv üfürmə və tam yanacaq tükənməsini kəmiyyətcə müəyyən edir.',
      mod4Btn: 'Sönmə Fizikasını İzah Et',

      outcomeRad: 'Radiativ Sönmə (Soyuma > İstilik Ayrılması)',
      outcomeBlow: 'Konvektiv Üfürmə / Hava Axını ilə Qopma',
      outcomeDep: 'Yanacağın Tam Tükənməsi (Bitmə)',
      outcomeSus: 'Davamlı Sabit Mikroyerçəkim Yanması',

      lawsBadge: 'NASA GLENN TƏDQİQAT MƏRKƏZİ // ELMİ NƏTİCƏLƏR ARXİVİ',
      lawsTitle: 'Mikroyerçəkimdə Üç Əsas Yanma Qanunu',
      law1Num: 'QANUN 01 // DİFFUZİYA ÜSTÜNLÜYÜ',
      law1Title: 'Təbii Konveksiyanın Olmaması',
      law1Desc: 'Yerdə qaldırıcı qüvvə isti qazları yuxarı qaldıraraq təzə oksigeni içəri çəkir. 10⁻⁴ g mikroyerçəkimdə isə oksigen daşınması sırf molekulyar diffuziyadır. Alovlar tam kürəvi forma alır və daha aşağı temperaturda yanır (Yerdəki 2200 K qarşılığında 1400–1650 K).',
      law2Num: 'QANUN 02 // SOYUQ ALOVUN DAVAMLILIĞI',
      law2Title: 'Aşağı Temperaturlu Kimyəvi Kinetika',
      law2Desc: 'NASA FLEX təcrübələri aşkar etdi ki, görünən isti alov söndükdən sonra belə damcılar 600–800 K-də soyuq alov kinetikası ilə görünməz şəkildə yanmağa davam edir. Standart kosmik gəmi yanğın detektorları bu gizli rejimi hiss edə bilmir.',
      law3Num: 'QANUN 03 // VENTİLYASİYA ALOVLANMA PARADOKSU',
      law3Title: 'Məcburi Konveksiya Paradoksu',
      law3Desc: 'Kabin ventilyasiyasını söndürərək yanğını yatırtmaq kiçik hava axını rejimlərində (2–6 sm/s) alovlanmanı daha da pisləşdirə bilər, çünki bu zəif axın radiativ sönmə baş verənə qədər oksigen təchizatını gücləndirir.'
    },

    // === 3. EXPLORER PAGE (explorer.html) ===
    explorer: {
      subBadge: 'NASA FİZİKİ ELMLƏR İNFORMATİKASI // ORBİTAL UÇUŞ REPOZİTORİYASI',
      pageTitle: 'Orbital Telemetriya Məlumat Kəşfiyyatı',
      btnExport: 'Telemetriyanı İxrac Et (.CSV)',
      btnAnalytics: '3D Analitika Görünüşü',

      sidebarTitle: 'FİLTRLƏR VƏ AXTARIŞ',
      btnReset: 'Hamısını Sıfırla',
      searchLabel: 'Sürətli Axtarış',
      searchPlaceholder: 'ID, yanacaq, qurğu (CIR/MSG) və ya nəticə...',
      familyLabel: 'PSI Tədqiqat Ailəsi (Cəmi 18)',
      familyDefault: 'Bütün Uçuş Tədqiqatları (569)',
      fuelLabel: 'Yanacaq / Material (112 Növ)',
      fuelDefault: 'Bütün Materiallar və Yanacaqlar',
      outcomeLabel: 'Sönmə Nəticəsi',
      outcomeDefault: 'Bütün Sönmə Nəticələri',
      o2MinLabel: 'Minimum O₂ Mol %',
      btnAskAiDataset: 'Dataset Haqqında AI-dan Soruş',

      showingPrefix: 'CƏMİ',
      showingMid: 'UÇUŞ SINAĞINDAN',
      showingSuffix: 'GÖSTƏRİLİR',
      pageSize: 'SƏHİFƏ ÖLÇÜSÜ:',

      thId: 'Kanonik ID ⬍',
      thFamily: 'Tədqiqat / Ailə ⬍',
      thFuel: 'Yanacaq / Material ⬍',
      thO2: 'O₂ Mol % ⬍',
      thPressure: 'Təzyiq (kPa) ⬍',
      thBurnTime: 'Yanma Müddəti (s) ⬍',
      thDe: 'Sönmə d_e (mm) ⬍',
      thOutcome: 'Nəticə ⬍',
      thActions: 'Əməliyyatlar',

      btnInspect: 'İncələ',
      btnCompare: '+ Müqayisə et',
      btnCompareAdded: '✓ Əlavə edildi',
      btnPrev: '← Əvvəlki',
      btnNext: 'Növbəti →',
      pageIndicator: (cur, total) => `SƏHİFƏ ${cur} / ${total}`,

      cmpSelected: (n) => `4 EKSPERİMENTDƏN ${n} SEÇİLDİ`,
      btnRunCompare: 'Yan-yana Müqayisə Et',
      btnClearCompare: 'Təmizlə',

      drawerSub: 'TELEMETRİYA MÜFƏTTİŞİ // KANONİK QEYD',
      btnCloseDrawer: '✕ Bağla',
      drawerNotesTitle: 'NASA ELMİ MÜŞAHİDƏ QEYDLƏRİ',
      btnAskAiExp: 'Bu Eksperiment Haqqında AI-dan Soruş'
    },

    // === 4. SIMULATOR PAGE (simulator.html) ===
    simulator: {
      subBadge: 'UÇUŞ RİSKİNİN PROQNOZLAŞDIRILMASI VƏ SÖNDÜRMƏ MODELİ',
      pageTitle: 'Planetar Missiya Yanğın Riski Simulyatoru',
      pageDesc: 'NASA-STD-6001 həssaslıq metrikləri əsasında müxtəlif kosmik kabin mühitlərində alovlanma potensialını, sönmə diametrlərini və SI Tədqiqat Uyğunluq Reytinqlərini hesablayır.',

      scenIssTitle: 'BKS Standart Atmosferi',
      scenIssSub: '21.0% O₂ · 101.3 kPa · 14.7 psi · 0g Mikroyerçəkim',
      scenLunarTitle: 'Artemis Ay Yaşayış Bazası (0.16g)',
      scenLunarSub: '34.0% O₂ · 56.5 kPa · 8.2 psi · 0g–1g Sərhədlənmiş',
      scenHypoxicTitle: 'Dərin Kosmos Hipoqsik Sığınacaq',
      scenHypoxicSub: '15.0% O₂ · 70.3 kPa · Yanğın Boğma Rejimi',
      scenCustomTitle: 'Fərdi Atmosfer Laboratoriyası',
      scenCustomSub: 'Parametrik Oksidləşdirici (10–100% O₂) və Təzyiq Sınağı',

      sliderO2: 'Oksigen Qatılığı (O₂ %)',
      sliderPressure: 'Ümumi Təzyiq (kPa)',
      btnAskAiSim: 'Yaşayış Təhlükəsizliyini AI ilə Qiymətləndir',

      fhiLabel: 'FHI / 10.0',
      
      metO2Title: 'O₂ Qatılığı',
      metO2Sub: 'Kabin həcm payı',
      metPressTitle: 'Ümumi Təzyiq',
      metPressSub: '1.0 atm ekvivalenti',
      metPo2Title: 'O₂ Parsial Təzyiqi',
      metPo2Sub: 'Metabolik norma: 21.3 kPa',
      metDeTitle: 'Sönmə Diametri (de)',
      metDeSub: 'Kritik sönmə damcı ölçüsü',
      metMultTitle: 'Alov Sürəti Əmsalı',
      metMultSub: '21% O₂-yə görə normallaşdırılıb',
      metPurgeTitle: 'Tələb Olunan Söndürücü',
      metPurgeSub: 'N₂/CO₂/He qaz doldurma qatılığı',

      advisoryHeader: 'AVTOMATLAŞDIRILMIŞ NASA EKİPAJ TƏHLÜKƏSİZLİYİ MƏSLƏHƏTİ',

      matrixTitle: 'Ssenari Müqayisə Matrisi',
      matThScen: 'SSENARİ',
      matThO2: 'O₂ %',
      matThPress: 'TƏZYİQ',
      matThFhi: 'FHI XALI',
      matThRisk: 'RİSK SƏVİYYƏSİ',
      matThSupp: 'SÖNDÜRMƏ'
    },

    // === 5. AI ASSISTANT (ai.html) ===
    ai: {
      heading: 'TÖVSİYƏ OLUNAN ELMİ SUALLAR',
      welcomeTitle: 'FIRE-X Elmi Tədqiqat Köməkçisi Onlayndır',
      welcomeDesc: 'NASA Mikroyerçəkim Yanma İntellekt Konsoluna xoş gəlmisiniz. <strong>OpenAI GPT-4o-mini + Canlı SQLite SQL-RAG</strong> ilə təchiz olunub və 18 PSI tədqiqat ailəsi üzrə <strong>569 qeydə (407 NASA PSI ölçməsi + 162 açıq etiketlənmiş illüstrativ dəyər)</strong> əsaslanır.<br><br>SI Tədqiqat Uyğunluq Reytinqi (Kosmik Gəmi, BKS, Ay Bazası, Mars Bazası, Rover, EVA Skafandrı), 0g–1g Qismən Qravitasiya Sərhədləməsi (ACME E-FIELD / LUCI &amp; FM2), FLEX He/CO₂ qazları, ACME CFI-G (85% O₂) və ya 3 Səviyyəli Yanğın Təhlükəsizliyi Avadanlığı haqqında ətraflı suallar verə bilərsiniz.',
      typingText: 'OpenAI gpt-4o-mini və Canlı SQLite NASA PSI Telemetriyası sorğulanır...',
      placeholder: 'Mikroyerçəkimdə yanma, alov dinamikası və ya eksperiment ID-ləri haqqında soruşun...',
      btnSend: 'Sorğunu Göndər',
      btnClear: 'Sessiyanı Təmizlə',
      securityNote: 'MƏXFİ UÇUŞ DATALARI TƏHLÜKƏSİZ SERVER VASİTƏSİLƏ TƏHLİL OLUNUR',
      enterNote: 'GÖNDƏRMƏK ÜÇÜN ENTER BASIN'
    },

    // === 6. ABOUT PAGE (about.html) ===
    about: {
      eyebrow: 'Sənədləşmə & Mənbələr',
      pageTitle: 'FIRE-X <span class="text-gradient">Haqqında</span>',
      pageDesc: 'NASA Space Apps Challenge 2026 — Flame in Freefall: Mikroyerçəkim Yanma Datalarından AI Yanğın Təhlükəsizliyi İntellekti',
      sec1Eyebrow: 'Layihə İcmalı',
      sec1Title: 'FIRE-X Layihəsinin <span class="text-gradient">Elmi Əsasları</span>',
      card1Title: 'Niyə Mikroyerçəkim?',
      card1Desc: 'Mikroyerçəkimdə qravitasiya qaldırma qüvvəsi (buoyancy) yoxdur. Alovlar kürəvi forma alır. Soyuq alovlar davam edir. Standart yanğın təhlükəsizliyi modelləri işləmir. FIRE-X kosmik yaşayış modulları üçün yeni təhlükəsizlik modelləri hazırlamaq məqsədilə NASA-nın ən əhatəli mikroyerçəkim yanma bazasını təhlil edir.',
      card2Title: 'Məlumat Bazası',
      card2Desc: 'NASA Physical Science Informatics (PSI) repozitoriyasından 18 tədqiqat alt-ailəsi (6 əsas proqram) üzrə 569 kanonik qeyd (407-si rəsmi PSI cədvəllərindən): FLEX, FLEX-2 & CFI (damcı yanması + He/CO₂), BASS & BASS-II (MSG bərk materiallar), SAFFIRE-I, -II & -III (Cygnus gəmi yanğınları), ACME (BRE, CFI, CFI-G 85% O₂, E-FIELD, CLD, s-Flame), SPICE & SLICE və SAME, SAME-R, DAFT & DAFT-2.',
      card3Title: 'Süni İntellekt İnteqrasiyası & Standartlar',
      card3Desc: 'Platforma OpenAI GPT-4o-mini + FIRE-X komandasının öz texniki arxitekturası olan Citation-Locked SQL-RAG mühərrikindən istifadə edir (bu, NASA standartı deyil). NASA standartlarında isə NASA-STD-6001 materialların alışma, qaz buraxma və uyğunluq sınaqlarını, NASA-STD-3001 isə insan təhlükəsizliyi, astronavtların sağlamlığı və human-system tələblərini tənzimləyir.',
      card4Title: 'Missiya Simulyatoru & SI Reytinqi',
      card4Desc: 'Yanğın Təhlükəsi İndeksi (FHI) və SI Tədqiqat Uyğunluq Reytinqi mühərriki bütün NASA PSI tədqiqatlarını Kosmik Gəmi, BKS, Ay Bazası (0.16g), Mars Bazası (0.38g), Təzyiqli Rover (≥30% O₂, ≤10.2 psi) və EVA Skafandrı (85–100% O₂, 4.3 psi) üçün 0g–1g sərhədləməsi ilə qiymətləndirir.',
      sec2Eyebrow: 'Məlumat Mənbələri',
      sec2Title: 'NASA <span class="text-gradient">Məlumat Mənbəyi</span>'
    }
  };

  /**
   * Applies translations to the entire page DOM based on active language
   */

  // --- EXACT-PHRASE DICTIONARY (EN → AZ) ---
  // Covers text the selector-based translator above does not reach: long paragraphs,
  // fragments split by <strong>/<em>, table cells, <option>s, title/placeholder
  // attributes and content rendered later by page scripts (MutationObserver).
  const PHRASES_AZ = {
    "MISSION TIME (UTC):": "MİSSİYA VAXTI (UTC):",
    "Intl. Space Station": "Beynəlxalq Kosmik Stansiya",
    "Orbit: 408 km | Speed: 27,600 km/h": "Orbit: 408 km | Sürət: 27 600 km/saat",
    "PSI-69 / PSI-70 · ISS CIR (MDCA) · 284 TESTS": "PSI-69 / PSI-70 · ISS CIR (MDCA) · 284 TEST",
    "Spherical droplet combustion, cool-flame kinetics, and He (up to 45%) / CO₂ (up to 70%) inert gas suppression.": "Sferik damcı yanması, soyuq alov kinetikası və He (45%-ə qədər) / CO₂ (70%-ə qədər) inert qazla söndürmə.",
    "PSI-25 · ISS MSG · 137 TESTS": "PSI-25 · ISS MSG · 137 TEST",
    "Burning and Suppression of Solids (fabrics & plastics) inside the ISS Microgravity Science Glovebox (MSG) under forced airflow.": "BKS Mikroyerçəkim Elmi Qutusunda (MSG) məcburi hava axını altında bərk materialların (parça və plastik) yanması və söndürülməsi.",
    "PSI-98 · CYGNUS · 11 BURNS": "PSI-98 · CYGNUS · 11 YANMA",
    "Spacecraft Fire Safety Demonstration: large-scale solid material fire propagation & oxygen limit tests aboard autonomous Cygnus vehicles.": "Kosmik Gəmi Yanğın Təhlükəsizliyi Nümayişi: avtonom Cygnus gəmilərində iri miqyaslı bərk material yanğınının yayılması və oksigen həddi sınaqları.",
    "PSI-112 · ISS CIR · 72 TESTS": "PSI-112 · ISS CIR · 72 TEST",
    "6 gaseous-fuel CIR investigations: solid flammability simulation (BRE), electric-field partial-g mimic (E-FIELD), and inside-out flames up to 85% O₂ (CFI-G).": "6 qaz yanacaqlı CIR tədqiqatı: bərk materialın alışqanlıq simulyasiyası (BRE), elektrik sahəsi ilə qismən-g imitasiyası (E-FIELD) və 85% O₂-yə qədər “içdən-çölə” alovlar (CFI-G).",
    "ISS MSG · 11 TESTS": "ISS MSG · 11 TEST",
    "Smoke Point In Co-flow (SPICE) and Structure & Liftoff In Combustion (SLICE) using the modular fan-driven flow duct in the ISS MSG.": "BKS MSG-dəki modul ventilyatorlu axın kanalında Paralel Axında Tüstü Nöqtəsi (SPICE) və Yanmada Struktur və Ayrılma (SLICE) tədqiqatları.",
    "ISS MSG · 4 EXPERIMENTS": "ISS MSG · 4 EKSPERİMENT",
    "Smoke Aerosol Measurement (SAME/SAME-R) & Dust and Aerosol Feasibility (DAFT/DAFT-2) in ISS MSG to prevent false alarms on the Moon and Mars.": "Ayda və Marsda yalançı həyəcanların qarşısını almaq üçün BKS MSG-də Tüstü Aerozolu Ölçümü (SAME/SAME-R) və Toz və Aerozol Tədqiqatı (DAFT/DAFT-2).",
    "Fire Hazard Index": "Yanğın Təhlükə İndeksi",
    "LIVE // GPT-4O-MINI + SQL-RAG": "CANLI // GPT-4O-MINI + SQL-RAG",
    "AI ENGINE: OpenAI + Live SQLite SQL-RAG": "AI MÜHƏRRİKİ: OpenAI + Canlı SQLite SQL-RAG",
    "CORE MODEL: gpt-4o-mini": "ƏSAS MODEL: gpt-4o-mini",
    "Canonical Flight Tests (": "Kanonik Uçuş Testləri (",
    "LATENCY: Real-time SQL Grounded": "GECİKMƏ: Real vaxt, SQL əsaslı",
    "STANDARDS & ARCHITECTURE NOTE:": "STANDARTLAR VƏ ARXİTEKTURA QEYDİ:",
    "Citation-Locked SQL-RAG": "Mənbəyə Bağlı SQL-RAG",
    "is FIRE-X's own technical retrieval architecture (not a NASA standard).": "FIRE-X-in öz texniki axtarış arxitekturasıdır (NASA standartı deyil).",
    "governs material flammability, offgassing & compatibility evaluation, while": "materialların alışqanlığını, qaz ayırmasını və uyğunluğunu tənzimləyir,",
    "covers human-system crew health & safety context.": "isə ekipajın sağlamlığı və təhlükəsizliyi kontekstini əhatə edir.",
    "FIRE-X DECISION SUPPORT SYSTEM:": "FIRE-X QƏRAR DƏSTƏK SİSTEMİ:",
    "Empirical Analytics & Reference Tool (Non-Autonomic). Grounded directly in NASA Physical Sciences Informatics (PSI-69, PSI-25, PSI-98). Not an autonomic flight controller.": "Empirik analitika və istinad aləti (avtonom deyil). Birbaşa NASA Fiziki Elmlər İnformatikası (PSI-69, PSI-25, PSI-98) məlumatlarına əsaslanır. Avtonom uçuş idarəetmə sistemi deyil.",
    "FLEX (Droplet)": "FLEX (Damcı)",
    "Radiative Quench": "Radiasiya ilə Sönmə",
    "Empirical Formula: de = 2.85·e^(-0.038·O₂)": "Empirik Düstur: de = 2.85·e^(-0.038·O₂)",
    "Low-Flow Limit: 1.8 cm/s": "Aşağı Axın Həddi: 1.8 sm/s",
    "Blowoff Threshold: 18.5 cm/s": "Üfürülüb-Sönmə Həddi: 18.5 sm/s",
    "Primary: n-Heptane (96)": "Əsas: n-Heptan (96)",
    "Polymers: PMMA, Delrin (78)": "Polimerlər: PMMA, Delrin (78)",
    "Primary Extinguishment Mode: Radiative": "Əsas Sönmə Rejimi: Radiasiya",
    "Sample Count: N=569": "Nümunə Sayı: N=569",
    "CROSS-INVESTIGATION HARDWARE MATRIX // CIR vs MSG vs CYGNUS vs WSTF 1g BOUND": "TƏDQİQATLARARASI AVADANLIQ MATRİSİ // CIR vs MSG vs CYGNUS vs WSTF 1g HƏDDİ",
    "Open SI Investigation Ranking Engine →": "SI Tədqiqat Reytinq Mühərrikini Aç →",
    "Facility Hardware, Diagnostic Sensors & 3-Tier Fire Safety Equipment Impact": "Qurğu Avadanlığı, Diaqnostik Sensorlar və 3 Səviyyəli Yanğın Təhlükəsizliyi Avadanlığına Təsir",
    "FACILITY 01 // ISS CIR (MDCA / ACME)": "QURĞU 01 // ISS CIR (MDCA / ACME)",
    "Droplets, Porous Burners & 85% O₂ Inside-Out Flames": "Damcılar, Məsaməli Ocaqlar və 85% O₂ “İçdən-Çölə” Alovlar",
    "(MDCA) tested spherical droplets with up to": "(MDCA) sferik damcıları",
    "70% CO₂ and 45% He": "70% CO₂ və 45% He-yə qədər",
    "inert suppressants.": "inert söndürücülərlə sınadı.",
    "(6 gaseous-fuel CIR investigations: BRE, CFI,": "(6 qaz yanacaqlı CIR tədqiqatı: BRE, CFI,",
    "CFI-G up to 85% O₂ inside-out flames": "85% O₂-yə qədər “içdən-çölə” alovlu CFI-G",
    ", CLD, s-Flame, and": ", CLD, s-Flame və",
    "E-FIELD electric partial-g mimic": "E-FIELD (elektrik sahəsi ilə qismən-g imitasiyası)",
    ") used intensified CCD, OH*/CH* chemiluminescence, and IR radiometers.": ") gücləndirilmiş CCD, OH*/CH* xemilüminessensiya və İQ radiometrlərdən istifadə etdi.",
    "FACILITY 02 // ISS MSG (SPICE DUCT & SAME/DAFT)": "QURĞU 02 // ISS MSG (SPICE KANALI & SAME/DAFT)",
    "Forced-Flow Solids & Lunar Dust Discrimination": "Məcburi Axında Bərk Materiallar və Ay Tozunun Fərqləndirilməsi",
    "SPICE, SLICE, BASS-I, and BASS-II": "SPICE, SLICE, BASS-I və BASS-II",
    "shared the fan-driven flow duct (0–55 cm/s) inside the Microgravity Science Glovebox (MSG).": "Mikroyerçəkim Elmi Qutusunun (MSG) içindəki ventilyatorlu axın kanalından (0–55 sm/s) birgə istifadə etdi.",
    "SAME, SAME-R, and DAFT / DAFT-2": "SAME, SAME-R və DAFT / DAFT-2",
    "used MSG aerosol monitors to distinguish resuspended Lunar/Martian regolith dust (>1 µm) from sub-micron fire smoke (<0.5 µm).": "MSG aerozol monitorları ilə havaya qalxmış Ay/Mars regolit tozunu (>1 µm) mikrondan kiçik yanğın tüstüsündən (<0.5 µm) fərqləndirdi.",
    "IMPACT // PREVENTION · DETECTION · SUPPRESSION": "TƏSİR // QARŞISININ ALINMASI · AŞKARLAMA · SÖNDÜRMƏ",
    "Spacecraft Equipment & Earth Spin-Offs": "Kosmik Gəmi Avadanlığı və Yer Tətbiqləri",
    "0g forced-flow + 1g WSTF Test 1 bounding (pending": "0g məcburi axın + 1g WSTF Test 1 sərhədləndirməsi (gözlənilən",
    ") & PBI/Nomex firefighter gear.": ") və PBI/Nomex yanğınsöndürən geyimi.",
    "DAFT dust-immune multi-wavelength smoke detectors for Lunar Rovers & mines.": "Ay roverləri və mədənlər üçün tozdan təsirlənməyən çoxdalğalı DAFT tüstü detektorları.",
    "He/CO₂ thermal-diffusivity quenching & Fine Water Mist extinguishers for ISS and Earth server rooms.": "BKS və Yerdəki server otaqları üçün He/CO₂ istilik-diffuziya söndürməsi və İncə Su Dumanı söndürücüləri.",
    "Toggle Confidence Band": "Etibarlılıq Zolağını Aç/Bağla",
    "Ask AI About Quenching": "Sönmə barədə AI-dan soruş",
    "Highlight Regimes": "Rejimləri Vurğula",
    "Ask AI About Airflow Limits": "Hava axını hədləri barədə AI-dan soruş",
    "Filter by Fuel": "Yanacağa görə süz",
    "Ask AI About Material Fire Safety": "Materialların yanğın təhlükəsizliyi barədə AI-dan soruş",
    "Simulate Risk": "Riski Simulyasiya Et",
    "Ask AI About Quench Taxonomy": "Sönmə növləri barədə AI-dan soruş",
    "NASA Space Apps Challenge 2026 · Data: NASA PSI · 569 Flight Tests": "NASA Space Apps Challenge 2026 · Məlumat: NASA PSI · 569 Uçuş Testi",
    "SPACE HABITAT FLAMMABILITY MODELING // NASA-STD-6001 COMPLIANCE": "KOSMİK YAŞAYIŞ MƏKANINDA ALIŞQANLIQ MODELLƏŞDİRMƏSİ // NASA-STD-6001 UYĞUNLUĞU",
    "ISS / Space Station (0g)": "BKS / Kosmik Stansiya (0g)",
    "21.0% O₂ · 101.3 kPa (14.7 psi) · Orbital Norm": "21.0% O₂ · 101.3 kPa (14.7 psi) · Orbital Norma",
    "Orion / Crew Spacecraft (0g)": "Orion / Ekipaj Gəmisi (0g)",
    "26.5% O₂ · 70.3 kPa (10.2 psi) · Transit Cabin": "26.5% O₂ · 70.3 kPa (10.2 psi) · Tranzit Kabinəsi",
    "Artemis Lunar Base (0.16g)": "Artemis Ay Bazası (0.16g)",
    "34.0% O₂ · 56.5 kPa (8.2 psi) · Lunar Surface": "34.0% O₂ · 56.5 kPa (8.2 psi) · Ay Səthi",
    "Martian Surface Base (0.38g)": "Mars Səthi Bazası (0.38g)",
    "34.0% O₂ · 56.5 kPa (8.2 psi) · Mars Gravity": "34.0% O₂ · 56.5 kPa (8.2 psi) · Mars Cazibəsi",
    "Pressurized Rover (≥30% O₂, ≤10.2 psi)": "Hermetik Rover (≥30% O₂, ≤10.2 psi)",
    "32.0% O₂ · 70.3 kPa (10.2 psi) · Dust/EVA": "32.0% O₂ · 70.3 kPa (10.2 psi) · Toz/EVA",
    "EVA Spacesuit (85–100% O₂, 4.3 psi)": "EVA Skafandrı (85–100% O₂, 4.3 psi)",
    "85.0% O₂ · 29.6 kPa (4.3 psi) · ACME CFI-G Bound": "85.0% O₂ · 29.6 kPa (4.3 psi) · ACME CFI-G Həddi",
    "Custom Atmosphere Lab": "Fərdi Atmosfer Laboratoriyası",
    "Parametric Oxidizer (10–100% O₂) & Pressure Sweep": "Parametrik Oksidləşdirici (10–100% O₂) və Təzyiq Taraması",
    "USER SWEEP": "İSTİFADƏÇİ TARAMASI",
    "FIRE-X FHI FORMULA — SCIENTIFIC BASIS": "FIRE-X FHI DÜSTURU — ELMİ ƏSAS",
    "FIRE HAZARD INDEX": "YANĞIN TƏHLÜKƏ İNDEKSİ",
    "OEF — Oxygen Enhancement": "OEF — Oksigen Artımı",
    "Combustion kinetics: flame speed ∝ [O₂]": "Yanma kinetikası: alov sürəti ∝ [O₂]",
    "PF — Pressure Factor": "PF — Təzyiq Faktoru",
    "SAFFIRE pressure sensitivity exponent": "SAFFIRE təzyiq həssaslığı üstü",
    "— Material Index": "— Material İndeksi",
    "NASA-STD-6001 material screening class": "NASA-STD-6001 material yoxlama sinfi",
    "SI-POWERED INVESTIGATION RANKING ENGINE // 0g vs 1g PARTIAL-GRAVITY BOUNDING": "SI ƏSASLI TƏDQİQAT REYTİNQ MÜHƏRRİKİ // 0g vs 1g QİSMƏN-CAZİBƏ SƏRHƏDLƏNDİRMƏSİ",
    "NASA PSI Investigation Relevance Ranking & Partial-Gravity Bounds": "NASA PSI Tədqiqatlarının Uyğunluq Reytinqi və Qismən-Cazibə Hədləri",
    "Automatically ranks all NASA PSI microgravity and 1.0g WSTF screening investigations by scientific applicability to the selected spacecraft, space station, lunar/Martian habitat, rover, or EVA suit environment.": "Bütün NASA PSI mikroyerçəkim və 1.0g WSTF yoxlama tədqiqatlarını seçilmiş kosmik gəmi, kosmik stansiya, Ay/Mars yaşayış modulu, rover və ya EVA skafandrı mühitinə elmi uyğunluğuna görə avtomatik sıralayır.",
    "⚖️ Partial-Gravity Bounding Model (0g ISS PSI + ACME E-FIELD ↔ 1.0g NASA-STD-6001 — Pre-LUCI & FM2)": "⚖️ Qismən-Cazibə Sərhəd Modeli (0g ISS PSI + ACME E-FIELD ↔ 1.0g NASA-STD-6001 — LUCI və FM2-dən əvvəl)",
    "Microgravity (~0g) · u_buoyancy ≈ 0 cm/s": "Mikroyerçəkim (~0g) · u_üzmə ≈ 0 sm/s",
    "0g STAGNANT BOUND (ISS)": "0g DURĞUN HƏDD (ISS)",
    "Radiative self-quenching limit": "Radiasiya ilə öz-özünə sönmə həddi",
    "0g FORCED-FLOW (BASS & BASS-II)": "0g MƏCBURİ AXIN (BASS & BASS-II)",
    "5–15 cm/s ventilation minimum MOC": "5–15 sm/s ventilyasiyada minimum MOC",
    "PARTIAL-g BOUNDED MOC (LUCI/FM2)": "QİSMƏN-g HƏDLİ MOC (LUCI/FM2)",
    "0.16g Moon (~12.2 cm/s buoyant flow)": "0.16g Ay (~12.2 sm/s konvektiv axın)",
    "1.0g UPPER BOUND (NASA-STD-6001)": "1.0g YUXARI HƏDD (NASA-STD-6001)",
    "WSTF Test 1 upward screening": "WSTF Test 1 yuxarı istiqamətli yoxlama",
    "NASA Investigation": "NASA Tədqiqatı",
    "Relevance Score": "Uyğunluq Balı",
    "Facility & Hardware": "Qurğu və Avadanlıq",
    "Fuel Geometry & Diagnostics": "Yanacaq Həndəsəsi və Diaqnostika",
    "Mission Ranking Rationale": "Missiya Reytinqinin Əsaslandırılması",
    "ISS MSG (Microgravity Science Glovebox — SPICE Flow Duct)": "ISS MSG (Mikroyerçəkim Elmi Qutusu — SPICE Axın Kanalı)",
    "Flat fabrics (SIBAL), PMMA slabs, rods, and spheres under forced flow (0–55 cm/s)": "Məcburi axın altında (0–55 sm/s) yastı parçalar (SIBAL), PMMA lövhələr, çubuqlar və kürələr",
    "Hot-wire anemometer, radiometer, still/video cameras, exhaust gas analysis": "İsti-məftilli anemometr, radiometr, foto/video kameralar, çıxış qazı analizi",
    "ISS CIR (MDCA Multi-user Droplet Combustion Apparatus)": "ISS CIR (MDCA Çoxistifadəçili Damcı Yanma Qurğusu)",
    "Isolated spherical liquid droplets (1.5–5.0 mm: n-Heptane, Methanol, Ethanol, Decane)": "Təcrid olunmuş sferik maye damcıları (1.5–5.0 mm: n-Heptan, Metanol, Etanol, Dekan)",
    "Backlit strobe microscopy, UV/IR radiometers, LLUV low-light cameras, O2/CO2/He gas manifold": "Arxadan işıqlandırılan strob mikroskopiya, UB/İQ radiometrlər, LLUV zəif işıq kameraları, O2/CO2/He qaz kollektoru",
    "Cygnus Autonomous Spacecraft (Large-Scale Flow Duct)": "Cygnus Avtonom Kosmik Gəmisi (İri Miqyaslı Axın Kanalı)",
    "Large-scale 0.4×0.94 m SIBAL cotton-fiberglass & PMMA samples (9 samples in SAFFIRE-II)": "İri ölçülü 0.4×0.94 m SIBAL pambıq-şüşəlif və PMMA nümunələr (SAFFIRE-II-də 9 nümunə)",
    "Thermocouple arrays, radiometers, O2/CO2/CO cabin sensors, high-res video": "Termocüt massivləri, radiometrlər, O2/CO2/CO kabin sensorları, yüksək keyfiyyətli video",
    "ISS MSG (Microgravity Science Glovebox — Enclosed Aerosol Chamber)": "ISS MSG (Mikroyerçəkim Elmi Qutusu — Qapalı Aerozol Kamerası)",
    "Overheated wire insulation (Kapton, Teflon, Silicone, Cellulose) + Lunar/Martian dust simulants": "Həddən artıq qızmış kabel izolyasiyası (Kapton, Teflon, Silikon, Sellüloza) + Ay/Mars tozu simulyantları",
    "3-channel PAMS aerosol monitor, ionization & photoelectric ISS smoke detectors, thermal precipitator TEM": "3 kanallı PAMS aerozol monitoru, ionlaşma və fotoelektrik BKS tüstü detektorları, termal çökdürücü TEM",
    "ISS CIR (ACME Modular Gas Burner Hardware)": "ISS CIR (ACME Modul Qaz Ocağı Avadanlığı)",
    "Porous flat plug (BRE), spherical porous burner (CFI-G up to 85% O2), coflow nozzle (E-FIELD/CLD)": "Məsaməli yastı tıxac (BRE), sferik məsaməli ocaq (CFI-G, 85% O2-yə qədər), paralel axın soplosu (E-FIELD/CLD)",
    "OH*/CH* chemiluminescence, intensified CCD, +5 kV electric field mesh, radiometers, thermophoretic soot samplers": "OH*/CH* xemilüminessensiya, gücləndirilmiş CCD, +5 kV elektrik sahəsi toru, radiometrlər, termoforetik his nümunəgötürənləri",
    "Circular nozzles (1.6–4.0 mm) issuing laminar gas jets (CH4, C2H4, C3H8) in co-flowing air": "Paralel axan havada laminar qaz şırnaqları (CH4, C2H4, C3H8) verən dairəvi soplolar (1.6–4.0 mm)",
    "Color still/video cameras, radiometers, thermocouple rakes, hot-wire anemometer": "Rəngli foto/video kameralar, radiometrlər, termocüt darağı, isti-məftilli anemometr",
    "© 2026 NASA FIRE-X · NASA Space Apps Challenge 2026 · Data: NASA PSI · 569 Canonical Tests": "© 2026 NASA FIRE-X · NASA Space Apps Challenge 2026 · Məlumat: NASA PSI · 569 Kanonik Test",
    "FLEX (ISS CIR/MDCA Droplets + CO₂/He - 274)": "FLEX (ISS CIR/MDCA Damcılar + CO₂/He - 274)",
    "FLEX-2 (ISS CIR Cool Flame Droplets - 10)": "FLEX-2 (ISS CIR Soyuq Alovlu Damcılar - 10)",
    "BASS-II (ISS MSG Forced Flow - 129)": "BASS-II (ISS MSG Məcburi Axın - 129)",
    "BASS-I (ISS MSG Solid Fuel Baseline - 8)": "BASS-I (ISS MSG Bərk Yanacaq Bazası - 8)",
    "SAFFIRE-I, -II & -III (Cygnus Large-Scale Burns - 11)": "SAFFIRE-I, -II & -III (Cygnus İri Miqyaslı Yanmalar - 11)",
    "ACME Suite (BRE / CFI / CLD / E-FIELD - 68)": "ACME Dəsti (BRE / CFI / CLD / E-FIELD - 68)",
    "ACME CFI-G (Up to 85% O₂ Inside-Out Flames - 4)": "ACME CFI-G (85% O₂-yə qədər İçdən-Çölə Alovlar - 4)",
    "SLICE (ISS MSG Co-flow Jet Flames - 8)": "SLICE (ISS MSG Paralel Axınlı Şırnaq Alovları - 8)",
    "SPICE (ISS MSG Smoke-Point Co-flow - 3)": "SPICE (ISS MSG Paralel Axında Tüstü Nöqtəsi - 3)",
    "SAME (ISS MSG Smoke Aerosol Detector - 50)": "SAME (ISS MSG Tüstü Aerozol Detektoru - 50)",
    "SAME-R (ISS MSG Smoke Aging Reflight - 2)": "SAME-R (ISS MSG Tüstünün Yaşlanması, Təkrar Uçuş - 2)",
    "DAFT / DAFT-2 (ISS MSG Lunar/Mars Dust vs Smoke - 2)": "DAFT / DAFT-2 (ISS MSG Ay/Mars Tozu və Tüstü - 2)",
    "n-Heptane / n-Octane": "n-Heptan / n-Oktan",
    "Methanol / Ethanol": "Metanol / Etanol",
    "n-Butane / Methane (CFI-G)": "n-Butan / Metan (CFI-G)",
    "Ethylene / Propane (SPICE/SLICE/ACME)": "Etilen / Propan (SPICE/SLICE/ACME)",
    "PMMA (Cast Acrylic)": "PMMA (Tökmə Akril)",
    "Nomex Fabric (Aramid)": "Nomex Parça (Aramid)",
    "Kapton / Polyimide Wire": "Kapton / Poliimid Kabel",
    "Cotton / SIBAL Fabric": "Pambıq / SIBAL Parça",
    "Silicone Rubber / Cable": "Silikon Rezin / Kabel",
    "Lunar / Martian Dust Simulant (DAFT)": "Ay / Mars Tozu Simulyantı (DAFT)",
    "Radiative Quenching / Extinction": "Radiasiya ilə Sönmə / Söndürülmə",
    "Cool Flame Transition / Quenching": "Soyuq Alova Keçid / Sönmə",
    "Convective Blowoff": "Konvektiv Üfürülmə",
    "Smoke / Dust Aerosol Discriminated": "Tüstü / Toz Aerozolu Fərqləndirildi",
    "Sustained / Steady State Flame": "Davamlı / Stabil Alov",
    "Complete Consumption": "Tam Yanma",
    "Minimum O₂ Mol %": "Minimum O₂ (mol %)",
    "CANONICAL EXPERIMENTS": "KANONİK EKSPERİMENTLƏR",
    "PAGE SIZE:": "SƏHİFƏ ÖLÇÜSÜ:",
    "OF 4 EXPERIMENTS SELECTED": "/ 4 EKSPERİMENT SEÇİLİB",
    "TELEMETRY INSPECTION // CANONICAL RECORD": "TELEMETRİYA BAXIŞI // KANONİK QEYD",
    "NASA SCIENTIFIC OBSERVATION NOTES": "NASA ELMİ MÜŞAHİDƏ QEYDLƏRİ",
    "Analyze with GPT-4o-mini + SQL-RAG": "GPT-4o-mini + SQL-RAG ilə Təhlil Et",
    "✕ Close": "✕ Bağla",
    "FLEX, FLEX-2 & CFI Droplets (CO₂/He & Cool Flames)": "FLEX, FLEX-2 & CFI Damcıları (CO₂/He və Soyuq Alovlar)",
    "BASS & BASS-II Solid Fuel Forced Flow": "BASS & BASS-II: Məcburi Axında Bərk Yanacaq",
    "ACME Suite (BRE, CFI, CFI-G 85% O₂, CLD, E-FIELD, s-Flame)": "ACME Dəsti (BRE, CFI, CFI-G 85% O₂, CLD, E-FIELD, s-Flame)",
    "ISS CIR (ACME Modular Hardware)": "ISS CIR (ACME Modul Avadanlığı)",
    "SAME, SAME-R, DAFT & DAFT-2 (Smoke & Dust Detection)": "SAME, SAME-R, DAFT & DAFT-2 (Tüstü və Toz Aşkarlanması)",
    "ISS MSG (Aerosol Chamber)": "ISS MSG (Aerozol Kamerası)",
    "SAFFIRE-I, -II & -III Large-Scale Spacecraft Burns": "SAFFIRE-I, -II & -III: İri Miqyaslı Kosmik Gəmi Yanğınları",
    "Cygnus Autonomous Vehicle · PSI-98": "Cygnus Avtonom Gəmisi · PSI-98",
    "SPICE & SLICE Co-Flow Laminar Gas Jet Flames": "SPICE & SLICE: Paralel Axınlı Laminar Qaz Şırnağı Alovları",
    "ISS MSG (SPICE Flow Duct)": "ISS MSG (SPICE Axın Kanalı)",
    "ESP32 + MQ-2 Telemetry": "ESP32 + MQ-2 Telemetriyası",
    "Cross-Investigation Comparison": "Tədqiqatlararası Müqayisə",
    "Facility Hardware (": "Qurğu Avadanlığı (",
    ") & Diagnostic Sensor Matrix": ") və Diaqnostik Sensor Matrisi",
    "Comparison of how NASA microgravity combustion investigations share orbital rack hardware, vary fuel geometries and ambient diluents, and deploy specialized optical, radiometric, and aerosol diagnostics.": "NASA mikroyerçəkim yanma tədqiqatlarının orbital rack avadanlığını necə bölüşdüyünün, yanacaq həndəsəsini və mühit qarışıqlarını necə dəyişdiyinin və xüsusi optik, radiometrik və aerozol diaqnostikasından necə istifadə etdiyinin müqayisəsi.",
    "Orbital Facility & Insert": "Orbital Qurğu və Modul",
    "Fuel Geometry & Phase": "Yanacaq Həndəsəsi və Fazası",
    "Controlled vs Varied Parameters": "Sabit və Dəyişən Parametrlər",
    "Diagnostic Sensors & Instruments": "Diaqnostik Sensorlar və Cihazlar",
    "ISS CIR + ACME Insert": "ISS CIR + ACME Modulu",
    "Combustion Integrated Rack": "İnteqrasiya Olunmuş Yanma Rack-ı",
    "Gaseous fuels (CH₄, C₂H₄, C₃H₈, n-C₄H₁₀) on flat porous plug (BRE),": "Yastı məsaməli tıxacda (BRE) qaz yanacaqları (CH₄, C₂H₄, C₃H₈, n-C₄H₁₀),",
    "6.4 mm spherical porous burner (CFI/CFI-G)": "6.4 mm sferik məsaməli ocaq (CFI/CFI-G)",
    ", or coflow nozzle": " və ya paralel axın soplosu",
    "O₂ from 15% up to": "O₂ 15%-dən",
    "85% O₂ (CFI-G inside-out flame)": "85% O₂-yə qədər (CFI-G içdən-çölə alov)",
    "; CO₂/N₂/He dilution; electric field up to": "; CO₂/N₂/He ilə durulaşdırma; elektrik sahəsi",
    "+5 kV (E-FIELD partial-g mimic)": "+5 kV-a qədər (E-FIELD qismən-g imitasiyası)",
    "Intensified CCD cameras, OH*/CH* chemiluminescence, IR/UV radiometers, planar laser-induced fluorescence, thermophoretic soot probes": "Gücləndirilmiş CCD kameralar, OH*/CH* xemilüminessensiya, İQ/UB radiometrlər, müstəvi lazer-induksiyalı flüoressensiya, termoforetik his zondları",
    "Multi-user Droplet Combustion Apparatus": "Çoxistifadəçili Damcı Yanma Qurğusu",
    "FLEX, FLEX-2, CFI (Droplets)": "FLEX, FLEX-2, CFI (Damcılar)",
    "Isolated spherical liquid droplets (1.5–5.0 mm: n-Heptane, Decane, Alcohols)": "Təcrid olunmuş sferik maye damcıları (1.5–5.0 mm: n-Heptan, Dekan, Spirtlər)",
    "O₂ (14–40%), Pressure (50–150 kPa),": "O₂ (14–40%), Təzyiq (50–150 kPa),",
    "CO₂ (0–70% mole fraction) & He (0–45% mole fraction)": "CO₂ (0–70% mol payı) və He (0–45% mol payı)",
    "inert suppressants": "inert söndürücülər",
    "Backlit strobe microscopy (droplet d(t) regression), narrow/wide-band IR radiometers, LLUV low-light cameras, gas mixing manifold": "Arxadan işıqlandırılan strob mikroskopiya (damcı d(t) reqressiyası), dar/geniş zolaqlı İQ radiometrlər, LLUV zəif işıq kameraları, qaz qarışdırma kollektoru",
    "ISS MSG + SPICE Flow Duct": "ISS MSG + SPICE Axın Kanalı",
    "Microgravity Science Glovebox": "Mikroyerçəkim Elmi Qutusu",
    "Laminar co-flow gas jets (SPICE/SLICE) & solid polymer slabs, rods, and SIBAL cotton-fiberglass strips (BASS/BASS-II)": "Paralel axınlı laminar qaz şırnaqları (SPICE/SLICE) və bərk polimer lövhələr, çubuqlar və SIBAL pambıq-şüşəlif zolaqları (BASS/BASS-II)",
    "Forced convective fan velocity (": "Məcburi konvektiv ventilyator sürəti (",
    "), O₂ concentration (15–30%), sample thickness & nozzle diameter": "), O₂ qatılığı (15–30%), nümunə qalınlığı və soplo diametri",
    "Hot-wire anemometer (flow velocity), color still & high-speed video cameras, radiometers, thermocouple rakes": "İsti-məftilli anemometr (axın sürəti), rəngli foto və yüksək sürətli video kameralar, radiometrlər, termocüt darağı",
    "ISS MSG + Aerosol Chamber": "ISS MSG + Aerozol Kamerası",
    "Overheated wire insulation pyrolysis (Kapton, Teflon, Silicone, Cellulose) +": "Həddən artıq qızmış kabel izolyasiyasının pirolizi (Kapton, Teflon, Silikon, Sellüloza) +",
    "Lunar/Martian regolith dust simulants (DAFT/DAFT-2)": "Ay/Mars regolit tozu simulyantları (DAFT/DAFT-2)",
    "Pyrolysis heating power, aerosol aging/coagulation residence time, dust vs sub-micron smoke particle size distribution": "Piroliz qızdırma gücü, aerozolun yaşlanma/koaqulyasiya müddəti, toz və mikrondan kiçik tüstü hissəciklərinin ölçü paylanması",
    "3-channel PAMS laser aerosol monitor (M0/M1/M2 moments), ISS photoelectric & ionization smoke detectors, thermal precipitator TEM": "3 kanallı PAMS lazer aerozol monitoru (M0/M1/M2 momentləri), BKS fotoelektrik və ionlaşma tüstü detektorları, termal çökdürücü TEM",
    "Cygnus Autonomous Vehicle": "Cygnus Avtonom Gəmisi",
    "Post-ISS Undocking Orbital Flight": "BKS-dən ayrıldıqdan sonrakı orbital uçuş",
    "Large-scale SIBAL cotton-fiberglass cloth & PMMA sheets (including 9 samples in SAFFIRE-II)": "İri ölçülü SIBAL pambıq-şüşəlif parça və PMMA təbəqələr (SAFFIRE-II-dəki 9 nümunə daxil olmaqla)",
    "21% O₂ (101.3 kPa); forced flow 3–30 cm/s in finite spacecraft volume": "21% O₂ (101.3 kPa); məhdud gəmi həcmində 3–30 sm/s məcburi axın",
    "Thermocouple arrays, radiometers, cabin O₂/CO₂/CO gas sensors, cabin pressure transducers, dual-view video": "Termocüt massivləri, radiometrlər, kabin O₂/CO₂/CO qaz sensorları, kabin təzyiq vericiləri, iki bucaqlı video",
    "Spaceflight & Terrestrial Impact": "Kosmik Uçuşa və Yerə Təsir",
    "3-Tier Fire Safety Equipment Impact &": "3 Səviyyəli Yanğın Təhlükəsizliyi Avadanlığına Təsir və",
    "Earth Spin-Offs": "Yer Tətbiqləri",
    "TIER 1 // FIRE PREVENTION": "SƏVİYYƏ 1 // YANĞININ QARŞISININ ALINMASI",
    "Material Screening & Firefighter Gear": "Material Yoxlaması və Yanğınsöndürən Geyimi",
    "show how low forced airflow (5–15 cm/s) and elevated O₂ alter solid flammability limits, informing material screening for Artemis Lunar Bases and Pressurized Rovers.": "zəif məcburi hava axınının (5–15 sm/s) və yüksək O₂-nin bərk materialların alışma hədlərini necə dəyişdiyini göstərir; bu, Artemis Ay bazaları və hermetik roverlər üçün material seçiminə istiqamət verir.",
    "Project FIRES (1982, NASA Marshall + FEMA)": "FIRES Layihəsi (1982, NASA Marshall + FEMA)",
    "transferred Apollo spacesuit thermal protection materials to firefighter attire;": "Apollo skafandrlarının istilikdən qoruyucu materiallarını yanğınsöndürən geyiminə tətbiq etdi;",
    "fiberglass-wrapped aluminum air tanks (13 lb lighter than conventional tanks).": "şüşəliflə örtülmüş alüminium hava balonları (adi balonlardan 13 funt yüngül).",
    "TIER 2 // FIRE DETECTION": "SƏVİYYƏ 2 // YANĞININ AŞKARLANMASI",
    "Smoke Aging & Dust Discrimination": "Tüstünün Yaşlanması və Tozun Fərqləndirilməsi",
    "measured microgravity smoke particle nucleation and agglomeration, while": "mikroyerçəkimdə tüstü hissəciklərinin yaranmasını və birləşməsini ölçdü,",
    "used the same hardware to detect dust.": "isə eyni avadanlıqla tozu aşkarladı.",
    "The Space Shuttle avionics": "Space Shuttle avionikasından yaranan",
    "Brunswick Incipient Fire Detector": "Brunswick Erkən Yanğın Detektoru",
    "discriminates combustion particles from background dust, cutting nuisance alarms in industrial facilities and underground mines.": "yanma hissəciklərini fon tozundan fərqləndirir və sənaye obyektlərində, yeraltı mədənlərdə yalançı həyəcanları azaldır.",
    "TIER 3 // FIRE SUPPRESSION": "SƏVİYYƏ 3 // YANĞININ SÖNDÜRÜLMƏSİ",
    "He / CO₂ Diluents & Fine Water Mist": "He / CO₂ Qarışıqları və İncə Su Dumanı",
    ") quantified droplet extinction limits across": ") damcı sönmə hədlərini",
    "diluents, alongside ISS Portable Fine Water Mist (PFWM) extinguishers.": "qarışıqlarında ölçdü; BKS-dəki Portativ İncə Su Dumanı (PFWM) söndürücüləri ilə birlikdə.",
    "Historical Lessons (": "Tarixi Dərslər (",
    "Apollo 13 Oxygen Tank No. 2 ruptured at ~56h after 65V DC ground-test switch welding (1,000°F); Mir's 1997": "Apollo 13-ün 2 nömrəli oksigen çəni yerüstü sınaqda 65V DC açarının qaynaq olunmasından (1000°F) sonra ~56-cı saatda partladı; Mir stansiyasında 1997-ci ildə",
    "oxygen-candle fire forced 36 hours of mask use.": "oksigen şamı yanğını ekipajı 36 saat maska taxmağa məcbur etdi.",
    "Official Verified NASA Data & Resource Links": "Rəsmi Təsdiqlənmiş NASA Məlumat və Resurs Linkləri",
    "PSI Combustion Repository ↗": "PSI Yanma Arxivi ↗",
    "Apollo 1 Investigation ↗": "Apollo 1 Araşdırması ↗",
    "Apollo 13 Lessons Learned ↗": "Apollo 13-dən Alınan Dərslər ↗",
    "Mir 1997 Fire History ↗": "Mir 1997 Yanğın Tarixçəsi ↗",
    "Spinoff: Air Tanks (9582) ↗": "Tətbiq: Hava Balonları (9582) ↗",
    "Spinoff: Fire Detector (9407) ↗": "Tətbiq: Yanğın Detektoru (9407) ↗",
    "Spinoff: Fire Attire (9918) ↗": "Tətbiq: Yanğınsöndürən Geyimi (9918) ↗"
  };

  function translatePhrasesIn(root) {
    if (!root) return;
    const norm = t => t.replace(/\s+/g, ' ').trim();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentElement && n.parentElement.closest('script, style, pre, code'))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const az = PHRASES_AZ[norm(n.nodeValue)];
      if (az) {
        const lead = /^\s/.test(n.nodeValue) ? ' ' : '';
        const trail = /\s$/.test(n.nodeValue) ? ' ' : '';
        n.nodeValue = lead + az + trail;
      }
    });
    const els = root.querySelectorAll ? root.querySelectorAll('[title],[placeholder]') : [];
    els.forEach(el => ['title', 'placeholder'].forEach(a => {
      const v = el.getAttribute(a);
      if (v && PHRASES_AZ[norm(v)]) el.setAttribute(a, PHRASES_AZ[norm(v)]);
    }));
  }

  function startPhraseTranslation() {
    translatePhrasesIn(document.body);
    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; translatePhrasesIn(document.body); });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function applyLanguage(lang) {
    const isAz = (lang === 'az');

    // 1. Navbar Translation
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') link.textContent = isAz ? TRANSLATIONS_AZ.nav.home : 'Home';
      else if (href === '/analytics') link.textContent = isAz ? TRANSLATIONS_AZ.nav.analytics : 'Analytics';
      else if (href === '/explorer') link.textContent = isAz ? TRANSLATIONS_AZ.nav.explorer : 'Data Explorer';
      else if (href === '/simulator') link.textContent = isAz ? TRANSLATIONS_AZ.nav.simulator : 'Simulator';
      else if (href === '/hardware') link.textContent = isAz ? 'Hardware' : 'Hardware';
      else if (href === '/ai') link.textContent = isAz ? TRANSLATIONS_AZ.nav.ai : 'AI Assistant';
      else if (href === '/about') link.textContent = isAz ? TRANSLATIONS_AZ.nav.about : 'About';
    });

    const brandSub = document.querySelector('.nav-brand-sub');
    if (brandSub) brandSub.textContent = isAz ? TRANSLATIONS_AZ.nav.brandSub : 'MICROGRAVITY COMBUSTION INTEL';

    const liveBadge = document.querySelector('.nav-actions div');
    if (liveBadge && (liveBadge.textContent.includes('LIVE') || liveBadge.textContent.includes('CANLI'))) {
      const dot = liveBadge.querySelector('.nav-status-dot');
      if (dot) {
        liveBadge.innerHTML = '';
        liveBadge.appendChild(dot);
        liveBadge.appendChild(document.createTextNode(isAz ? ' CANLI' : ' LIVE'));
      }
    }

    const navAiBtn = document.querySelector('.nav-ai-btn');
    if (navAiBtn) {
      const svg = navAiBtn.querySelector('svg');
      if (svg) {
        navAiBtn.innerHTML = '';
        navAiBtn.appendChild(svg);
        navAiBtn.appendChild(document.createTextNode(isAz ? ' AI Köməkçi' : ' AI Assistant'));
      }
    }

    // 2. Language Switcher Button Text
    const langBtn = document.getElementById('nav-lang-btn') || document.getElementById('lang-btn-ai');
    if (langBtn) langBtn.textContent = lang.toUpperCase();

    // 3. Footer Translation
    const footerTagline = document.getElementById('footer-tagline');
    if (footerTagline) footerTagline.textContent = isAz ? TRANSLATIONS_AZ.footer.desc : 'AI-Powered Fire Safety Insights from Microgravity Combustion Data. NASA Space Apps Challenge 2026.';

    const footerColPlatform = document.getElementById('footer-col-platform');
    if (footerColPlatform) footerColPlatform.textContent = isAz ? TRANSLATIONS_AZ.footer.colPlatform : 'Platform';

    const footerColData = document.getElementById('footer-col-data');
    if (footerColData) footerColData.textContent = isAz ? TRANSLATIONS_AZ.footer.colData : 'Data';

    const linkAnalytics = document.getElementById('footer-link-analytics');
    if (linkAnalytics) linkAnalytics.textContent = isAz ? TRANSLATIONS_AZ.footer.analytics : 'Analytics Hub';

    const linkExplorer = document.getElementById('footer-link-explorer');
    if (linkExplorer) linkExplorer.textContent = isAz ? TRANSLATIONS_AZ.footer.explorer : 'Data Explorer';

    const linkSimulator = document.getElementById('footer-link-simulator');
    if (linkSimulator) linkSimulator.textContent = isAz ? TRANSLATIONS_AZ.footer.simulator : 'Mission Simulator';

    const linkAi = document.getElementById('footer-link-ai');
    if (linkAi) linkAi.textContent = isAz ? TRANSLATIONS_AZ.footer.ai : 'AI Assistant';

    const linkAbout = document.getElementById('footer-link-about');
    if (linkAbout) linkAbout.textContent = isAz ? TRANSLATIONS_AZ.footer.about : 'Documentation';

    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright) footerCopyright.textContent = isAz ? TRANSLATIONS_AZ.footer.copyright : '© 2026 NASA FIRE-X · Built for NASA Space Apps Challenge';

    const footerDataCount = document.getElementById('footer-data-count');
    if (footerDataCount) footerDataCount.textContent = isAz ? TRANSLATIONS_AZ.footer.dataCount : 'Data: NASA Physical Science Informatics (PSI) · 569 records (407 PSI-verified)';

    // 4. Page-Specific Deep Translations
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

    // ==========================================
    // PAGE 1: HOME (/)
    // ==========================================
    if (pathname === '/') {
      if (isAz) {
        const badge = document.querySelector('.hero-badge');
        if (badge) {
          const dot = badge.querySelector('.hero-badge-dot');
          badge.innerHTML = '';
          if (dot) badge.appendChild(dot);
          badge.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.home.badge));
        }

        const heroTitleSpan = document.querySelector('.hero-title span');
        if (heroTitleSpan) heroTitleSpan.textContent = TRANSLATIONS_AZ.home.title;

        const heroSub = document.querySelector('.hero-subtitle-line');
        if (heroSub) heroSub.textContent = TRANSLATIONS_AZ.home.subtitle;

        const heroDesc = document.querySelector('.hero-desc');
        if (heroDesc) heroDesc.textContent = TRANSLATIONS_AZ.home.desc;

        const heroActions = document.querySelectorAll('.hero-actions a');
        if (heroActions.length >= 2) {
          const svg1 = heroActions[0].querySelector('svg');
          heroActions[0].innerHTML = '';
          if (svg1) heroActions[0].appendChild(svg1);
          heroActions[0].appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.home.btnExplore));

          const svg2 = heroActions[1].querySelector('svg');
          heroActions[1].innerHTML = '';
          if (svg2) heroActions[1].appendChild(svg2);
          heroActions[1].appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.home.btnSimulator));
        }

        const statLabels = document.querySelectorAll('.stat-item .stat-label');
        if (statLabels.length >= 4) {
          statLabels[0].textContent = TRANSLATIONS_AZ.home.statExp;
          statLabels[1].textContent = TRANSLATIONS_AZ.home.statFam;
          statLabels[2].textContent = TRANSLATIONS_AZ.home.statScen;
          statLabels[3].textContent = TRANSLATIONS_AZ.home.statInt;
        }

        // About Section
        const aboutEyebrow = document.querySelector('.about-grid .section-eyebrow');
        if (aboutEyebrow) aboutEyebrow.textContent = TRANSLATIONS_AZ.home.aboutEyebrow;

        const aboutTitle = document.querySelector('.about-grid .section-title-xl');
        if (aboutTitle) aboutTitle.innerHTML = TRANSLATIONS_AZ.home.aboutTitle;

        const aboutP = document.querySelector('.about-grid p');
        if (aboutP) aboutP.textContent = TRANSLATIONS_AZ.home.aboutDesc;

        const featureTitles = document.querySelectorAll('.feature-title');
        const featureDescs = document.querySelectorAll('.feature-desc');
        if (featureTitles.length >= 3) {
          featureTitles[0].textContent = TRANSLATIONS_AZ.home.feat1Title;
          featureDescs[0].textContent = TRANSLATIONS_AZ.home.feat1Desc;
          featureTitles[1].textContent = TRANSLATIONS_AZ.home.feat2Title;
          featureDescs[1].textContent = TRANSLATIONS_AZ.home.feat2Desc;
          featureTitles[2].textContent = TRANSLATIONS_AZ.home.feat3Title;
          featureDescs[2].textContent = TRANSLATIONS_AZ.home.feat3Desc;
        }

        // Flight Families
        const famSection = document.querySelectorAll('.section')[1];
        if (famSection) {
          const eye = famSection.querySelector('.section-eyebrow');
          if (eye) eye.textContent = TRANSLATIONS_AZ.home.famEyebrow;
          const tit = famSection.querySelector('.section-title-xl');
          if (tit) tit.innerHTML = TRANSLATIONS_AZ.home.famTitle;
          const va = famSection.querySelector('.btn-sm');
          if (va) va.textContent = TRANSLATIONS_AZ.home.famViewAll;
        }

        // Mission Environments
        const envSection = document.querySelectorAll('.section')[2];
        if (envSection) {
          const eye = envSection.querySelector('.section-eyebrow');
          if (eye) eye.textContent = TRANSLATIONS_AZ.home.envEyebrow;
          const tit = envSection.querySelector('.section-title-xl');
          if (tit) tit.innerHTML = TRANSLATIONS_AZ.home.envTitle;
          const desc = envSection.querySelector('.section-desc');
          if (desc) desc.textContent = TRANSLATIONS_AZ.home.envDesc;
        }

        // Platform modules
        
        // Mission Environments cards
        const envCards = document.querySelectorAll('.env-card');
        if (envCards.length >= 3) {
          envCards[0].querySelector('.env-label').textContent = 'Standart';
          envCards[0].querySelector('.env-name').textContent = 'BKS Atmosferi';
          envCards[0].querySelectorAll('.env-param-label')[0].textContent = 'Oksigen';
          const b1 = envCards[0].querySelector('.badge');
          if (b1) b1.textContent = 'NOMİNAL RİSK';

          envCards[1].querySelector('.env-label').textContent = 'Artemis Proqramı';
          envCards[1].querySelector('.env-name').textContent = 'Ay Yaşayış Modulu';
          envCards[1].querySelectorAll('.env-param-label')[0].textContent = 'Oksigen';
          const b2 = envCards[1].querySelector('.badge');
          if (b2) b2.textContent = 'YÜKSƏK TƏHLÜKƏ';

          envCards[2].querySelector('.env-label').textContent = 'EVA & Səth Hərəkətliliyi';
          envCards[2].querySelector('.env-name').textContent = 'Təzyiqli Rover və Skafandr';
          envCards[2].querySelectorAll('.env-param-label')[0].textContent = 'Oksigen';
          const b3 = envCards[2].querySelector('.badge');
          if (b3) b3.textContent = 'YÜKSƏK O₂ EVA SƏRHƏDİ';
        }

        // Platform Navigation Cards
        const navCards = document.querySelectorAll('.nav-card');
        if (navCards.length >= 4) {
          navCards[0].querySelector('.nav-card-title').textContent = 'Analitika Mərkəzi';
          navCards[0].querySelector('.nav-card-desc').textContent = 'İnteraktiv 3D qrafiklər — sönmə paylanması, hava axını korrelyasiyası, yanacaq bölgüsü və nəticə analizi.';

          navCards[1].querySelector('.nav-card-title').textContent = 'Məlumat Kəşfiyyatı';
          navCards[1].querySelector('.nav-card-desc').textContent = 'Bütün 569 mikroyerçəkim yanma qeydini (407-si rəsmi NASA PSI cədvəllərindən) mənbə nişanları və tam telemetriya baxışı ilə araşdırın, filtrləyin və müqayisə edin.';

          navCards[2].querySelector('.nav-card-title').textContent = 'Missiya Simulyatoru';
          navCards[2].querySelector('.nav-card-desc').textContent = 'BKS, Ay Bazası, Mars Bazası, Rover və EVA Skafandrında yanğın təhlükəsi indeksini və SI Tədqiqat Reytinqini simulyasiya edin.';

          navCards[3].querySelector('.nav-card-title').textContent = 'AI Tədqiqat Köməkçisi';
          navCards[3].querySelector('.nav-card-desc').textContent = 'GPT-4o-mini + Canlı SQLite SQL-RAG modelinə kontekstə uyğun elmi cavablar almaq üçün xüsusi NASA yanma sualları verin.';
        }

        const modSection = document.querySelectorAll('.section')[3];
        if (modSection) {
          const eye = modSection.querySelector('.section-eyebrow');
          if (eye) eye.textContent = TRANSLATIONS_AZ.home.modEyebrow;
          const tit = modSection.querySelector('.section-title-xl');
          if (tit) tit.innerHTML = TRANSLATIONS_AZ.home.modTitle;
        }
      }
    }

    // ==========================================
    // PAGE 2: ANALYTICS (/analytics)
    // ==========================================
    else if (pathname === '/analytics') {
      if (isAz) {
        // Tag & Hero
        const holoTag = document.querySelector('.holo-tag');
        if (holoTag) {
          const dot = holoTag.querySelector('.holo-tag-dot');
          holoTag.innerHTML = '';
          if (dot) holoTag.appendChild(dot);
          holoTag.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.analytics.heroTag));
        }

        const heroH1 = document.querySelector('header h1');
        if (heroH1) {
          heroH1.innerHTML = 'Mikroyerçəkim Yanma <span style="background:linear-gradient(135deg,#00F5FF,#2979FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Analitikası Mühərriki</span>';
        }

        const heroDesc = document.querySelector('header p');
        if (heroDesc) heroDesc.textContent = TRANSLATIONS_AZ.analytics.pageDesc;

        // HUD Stat boxes
        const statBoxes = document.querySelectorAll('.hud-stat-box');
        if (statBoxes.length >= 4) {
          statBoxes[0].querySelector('.hud-stat-label').textContent = TRANSLATIONS_AZ.analytics.stat1Label;
          statBoxes[0].querySelector('.hud-stat-sub').textContent = TRANSLATIONS_AZ.analytics.stat1Sub;

          statBoxes[1].querySelector('.hud-stat-label').textContent = TRANSLATIONS_AZ.analytics.stat2Label;
          statBoxes[1].querySelector('.hud-stat-sub').textContent = TRANSLATIONS_AZ.analytics.stat2Sub;

          statBoxes[2].querySelector('.hud-stat-label').textContent = TRANSLATIONS_AZ.analytics.stat3Label;
          statBoxes[2].querySelector('.hud-stat-sub').textContent = TRANSLATIONS_AZ.analytics.stat3Sub;

          statBoxes[3].querySelector('.hud-stat-label').textContent = TRANSLATIONS_AZ.analytics.stat4Label;
          statBoxes[3].querySelector('.hud-stat-value').textContent = TRANSLATIONS_AZ.analytics.stat4Val;
          statBoxes[3].querySelector('.hud-stat-sub').textContent = TRANSLATIONS_AZ.analytics.stat4Sub;
        }

        // Holo toolbar title & subtitle
        const holoHeaderTitle = document.querySelector('.holo-toolbar > div > div:first-child');
        if (holoHeaderTitle) {
          const svg = holoHeaderTitle.querySelector('svg');
          holoHeaderTitle.innerHTML = '';
          if (svg) holoHeaderTitle.appendChild(svg);
          holoHeaderTitle.appendChild(document.createTextNode(' ' + (TRANSLATIONS_AZ.analytics.holoTitle || 'İnteraktiv 3D/4D Yanma Holo-Laboratoriyası')));
        }
        const holoHeaderSub = document.querySelector('.holo-toolbar > div > div:last-child');
        if (holoHeaderSub) {
          holoHeaderSub.textContent = TRANSLATIONS_AZ.analytics.holoSub || 'WebGL 3D Telemetriya Simulyasiya Mühərriki // Fırlatmaq üçün çəkin, yaxınlaşdırmaq üçün fırladın';
        }

        const tabScatter = document.getElementById('tab-3d-scatter');
        if (tabScatter) {
          const svg = tabScatter.querySelector('svg');
          tabScatter.innerHTML = '';
          if (svg) tabScatter.appendChild(svg);
          tabScatter.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.analytics.tabScatter));
        }

        const tabDroplet = document.getElementById('tab-3d-droplet');
        if (tabDroplet) {
          const svg = tabDroplet.querySelector('svg');
          tabDroplet.innerHTML = '';
          if (svg) tabDroplet.appendChild(svg);
          tabDroplet.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.analytics.tabDroplet));
        }

        const tabAirflow = document.getElementById('tab-3d-airflow');
        if (tabAirflow) {
          const svg = tabAirflow.querySelector('svg');
          tabAirflow.innerHTML = '';
          if (svg) tabAirflow.appendChild(svg);
          tabAirflow.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.analytics.tabAirflow));
        }

        // HUD overlay title & actions
        const hudTitleSpan = document.querySelector('.hud-overlay-title span:first-child');
        if (hudTitleSpan) hudTitleSpan.textContent = TRANSLATIONS_AZ.analytics.hudTitle || 'SEÇİLMİŞ EKSPERİMENT';
        const hudActiveSpan = document.querySelector('.hud-overlay-title span:last-child');
        if (hudActiveSpan) hudActiveSpan.textContent = TRANSLATIONS_AZ.analytics.hudActive || 'AKTİV';
        const hudInspectBtn = document.querySelector('.hud-telemetry-overlay .ask-ai-chip:first-child');
        if (hudInspectBtn) hudInspectBtn.textContent = TRANSLATIONS_AZ.analytics.hudInspect || 'Bazada İncələ →';
        const hudAskAiBtn = document.querySelector('.hud-telemetry-overlay .ask-ai-chip:last-child');
        if (hudAskAiBtn) hudAskAiBtn.textContent = TRANSLATIONS_AZ.analytics.hudAskAi || 'AI-dan Soruş';

        // HUD readout keys
        const hudKeys = document.querySelectorAll('.hud-telemetry-overlay .hud-key');
        if (hudKeys.length >= 7) {
          hudKeys[0].textContent = TRANSLATIONS_AZ.analytics.hudKeyId;
          hudKeys[1].textContent = TRANSLATIONS_AZ.analytics.hudKeyFam;
          hudKeys[2].textContent = TRANSLATIONS_AZ.analytics.hudKeyFuel;
          hudKeys[3].textContent = TRANSLATIONS_AZ.analytics.hudKeyO2;
          hudKeys[4].textContent = TRANSLATIONS_AZ.analytics.hudKeyPress;
          hudKeys[5].textContent = TRANSLATIONS_AZ.analytics.hudKeyDe;
          hudKeys[6].textContent = TRANSLATIONS_AZ.analytics.hudKeyOutcome;
        }

        const hudHint = document.querySelector('.hud-controls-hint');
        if (hudHint) hudHint.innerHTML = '<span style="color:var(--hud-cyan);">[3D İDARƏETMƏ]</span> Sol Düymə: 3D Fırlat · Çarx: Yaxınlaşdır · Üzərinə gətir: Məlumatı oxu';

        // 4 Modules
        const modCards = document.querySelectorAll('.module-card');
        if (modCards.length >= 4) {
          // Module 1
          modCards[0].querySelector('.module-badge').textContent = TRANSLATIONS_AZ.analytics.mod1Badge;
          modCards[0].querySelector('.module-title').textContent = TRANSLATIONS_AZ.analytics.mod1Title;
          modCards[0].querySelector('.module-desc').textContent = TRANSLATIONS_AZ.analytics.mod1Desc;
          const a1 = modCards[0].querySelector('.ask-ai-chip');
          if (a1) a1.textContent = ' ' + TRANSLATIONS_AZ.analytics.mod1Btn;

          // Module 2
          modCards[1].querySelector('.module-badge').textContent = TRANSLATIONS_AZ.analytics.mod2Badge;
          modCards[1].querySelector('.module-title').textContent = TRANSLATIONS_AZ.analytics.mod2Title;
          modCards[1].querySelector('.module-desc').textContent = TRANSLATIONS_AZ.analytics.mod2Desc;
          const a2 = modCards[1].querySelector('.ask-ai-chip');
          if (a2) a2.textContent = ' ' + TRANSLATIONS_AZ.analytics.mod2Btn;

          // Module 3
          modCards[2].querySelector('.module-badge').textContent = TRANSLATIONS_AZ.analytics.mod3Badge;
          modCards[2].querySelector('.module-title').textContent = TRANSLATIONS_AZ.analytics.mod3Title;
          modCards[2].querySelector('.module-desc').textContent = TRANSLATIONS_AZ.analytics.mod3Desc;
          const a3 = modCards[2].querySelector('.ask-ai-chip');
          if (a3) a3.textContent = ' ' + TRANSLATIONS_AZ.analytics.mod3Btn;

          // Module 4
          modCards[3].querySelector('.module-badge').textContent = TRANSLATIONS_AZ.analytics.mod4Badge;
          modCards[3].querySelector('.module-title').textContent = TRANSLATIONS_AZ.analytics.mod4Title;
          modCards[3].querySelector('.module-desc').textContent = TRANSLATIONS_AZ.analytics.mod4Desc;
          const a4 = modCards[3].querySelector('.ask-ai-chip');
          if (a4) a4.textContent = ' ' + TRANSLATIONS_AZ.analytics.mod4Btn;

          const outcomeLabels = modCards[3].querySelectorAll('.outcome-label-row span:first-child');
          if (outcomeLabels.length >= 4) {
            outcomeLabels[0].textContent = TRANSLATIONS_AZ.analytics.outcomeRad;
            outcomeLabels[1].textContent = TRANSLATIONS_AZ.analytics.outcomeBlow;
            outcomeLabels[2].textContent = TRANSLATIONS_AZ.analytics.outcomeDep;
            outcomeLabels[3].textContent = TRANSLATIONS_AZ.analytics.outcomeSus;
          }
        }

        // Insights / Laws
        const insightsBanner = document.querySelector('.insights-banner');
        if (insightsBanner) {
          const bannerTag = insightsBanner.querySelector('.holo-tag');
          if (bannerTag) bannerTag.textContent = TRANSLATIONS_AZ.analytics.lawsBadge;

          const bannerTitle = insightsBanner.querySelector('h3');
          if (bannerTitle) bannerTitle.textContent = TRANSLATIONS_AZ.analytics.lawsTitle;

          const insightCards = insightsBanner.querySelectorAll('.insight-card');
          if (insightCards.length >= 3) {
            insightCards[0].querySelector('.insight-num').textContent = TRANSLATIONS_AZ.analytics.law1Num;
            insightCards[0].querySelector('h4').textContent = TRANSLATIONS_AZ.analytics.law1Title;
            insightCards[0].querySelector('p').textContent = TRANSLATIONS_AZ.analytics.law1Desc;

            insightCards[1].querySelector('.insight-num').textContent = TRANSLATIONS_AZ.analytics.law2Num;
            insightCards[1].querySelector('h4').textContent = TRANSLATIONS_AZ.analytics.law2Title;
            insightCards[1].querySelector('p').textContent = TRANSLATIONS_AZ.analytics.law2Desc;

            insightCards[2].querySelector('.insight-num').textContent = TRANSLATIONS_AZ.analytics.law3Num;
            insightCards[2].querySelector('h4').textContent = TRANSLATIONS_AZ.analytics.law3Title;
            insightCards[2].querySelector('p').textContent = TRANSLATIONS_AZ.analytics.law3Desc;
          }
        }
      }
    }

    // ==========================================
    // PAGE 3: EXPLORER (/explorer)
    // ==========================================
    else if (pathname === '/explorer') {
      if (isAz) {
        // Header
        const headerSub = document.querySelector('.explorer-header div > div:first-child > div:first-child');
        if (headerSub) headerSub.textContent = TRANSLATIONS_AZ.explorer.subBadge;

        const headerH1 = document.querySelector('.explorer-header h1');
        if (headerH1) headerH1.innerHTML = 'Orbital Telemetriya <span class="text-gradient">Məlumat Kəşfiyyatı</span>';

        const exportBtn = document.querySelector('.explorer-header .btn-ghost');
        if (exportBtn) {
          const svg = exportBtn.querySelector('svg');
          exportBtn.innerHTML = '';
          if (svg) exportBtn.appendChild(svg);
          exportBtn.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.explorer.btnExport));
        }

        const analyticsBtn = document.querySelector('.explorer-header .btn-neon');
        if (analyticsBtn) {
          const svg = analyticsBtn.querySelector('svg');
          analyticsBtn.innerHTML = '';
          if (svg) analyticsBtn.appendChild(svg);
          analyticsBtn.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.explorer.btnAnalytics));
        }

        // Sidebar
        const filterTitle = document.querySelector('.filter-console-title span');
        if (filterTitle) filterTitle.textContent = TRANSLATIONS_AZ.explorer.sidebarTitle;

        const resetBtn = document.querySelector('.filter-console-title button');
        if (resetBtn) resetBtn.textContent = TRANSLATIONS_AZ.explorer.btnReset;

        const filterLabels = document.querySelectorAll('.filter-console .filter-label');
        if (filterLabels.length >= 4) {
          filterLabels[0].textContent = TRANSLATIONS_AZ.explorer.searchLabel;
          filterLabels[1].textContent = TRANSLATIONS_AZ.explorer.familyLabel;
          filterLabels[2].textContent = TRANSLATIONS_AZ.explorer.fuelLabel;
          filterLabels[3].textContent = TRANSLATIONS_AZ.explorer.outcomeLabel;
          if (filterLabels.length >= 5) filterLabels[4].textContent = TRANSLATIONS_AZ.explorer.o2MinLabel;
        }

        const searchInp = document.getElementById('filter-search');
        if (searchInp) searchInp.setAttribute('placeholder', TRANSLATIONS_AZ.explorer.searchPlaceholder);

        const famSel = document.getElementById('filter-family');
        if (famSel && famSel.options.length > 0) famSel.options[0].textContent = TRANSLATIONS_AZ.explorer.familyDefault;

        const fuelSel = document.getElementById('filter-fuel');
        if (fuelSel && fuelSel.options.length > 0) fuelSel.options[0].textContent = TRANSLATIONS_AZ.explorer.fuelDefault;

        const outSel = document.getElementById('filter-outcome');
        if (outSel && outSel.options.length > 0) outSel.options[0].textContent = TRANSLATIONS_AZ.explorer.outcomeDefault;

        const askAiSideBtn = document.querySelector('.filter-console a.btn-neon');
        if (askAiSideBtn) {
          const svg = askAiSideBtn.querySelector('svg');
          askAiSideBtn.innerHTML = '';
          if (svg) askAiSideBtn.appendChild(svg);
          askAiSideBtn.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.explorer.btnAskAiDataset));
        }

        // Table headers
        const ths = document.querySelectorAll('.orbital-table th');
        if (ths.length >= 9) {
          ths[0].textContent = TRANSLATIONS_AZ.explorer.thId;
          ths[1].textContent = TRANSLATIONS_AZ.explorer.thFamily;
          ths[2].textContent = TRANSLATIONS_AZ.explorer.thFuel;
          ths[3].textContent = TRANSLATIONS_AZ.explorer.thO2;
          ths[4].textContent = TRANSLATIONS_AZ.explorer.thPressure;
          ths[5].textContent = TRANSLATIONS_AZ.explorer.thBurnTime;
          ths[6].textContent = TRANSLATIONS_AZ.explorer.thDe;
          ths[7].textContent = TRANSLATIONS_AZ.explorer.thOutcome;
          ths[8].textContent = TRANSLATIONS_AZ.explorer.thActions;
        }

        // Pagination buttons
        const prevBtn = document.getElementById('btn-prev-page');
        if (prevBtn) prevBtn.textContent = TRANSLATIONS_AZ.explorer.btnPrev;

        const nextBtn = document.getElementById('btn-next-page');
        if (nextBtn) nextBtn.textContent = TRANSLATIONS_AZ.explorer.btnNext;

        // Compare dock
        const runCmpBtn = document.querySelector('.compare-dock .btn-solid-cyan');
        if (runCmpBtn) runCmpBtn.textContent = TRANSLATIONS_AZ.explorer.btnRunCompare;

        const clearCmpBtn = document.querySelector('.compare-dock .btn-ghost');
        if (clearCmpBtn) clearCmpBtn.textContent = TRANSLATIONS_AZ.explorer.btnClearCompare;
      }
    }

    // ==========================================
    // PAGE 4: SIMULATOR (/simulator)
    // ==========================================
    else if (pathname === '/simulator') {
      if (isAz) {
        // Header
        const subBadge = document.querySelector('.sim-header div > div > div:first-child');
        if (subBadge) subBadge.textContent = TRANSLATIONS_AZ.simulator.subBadge;

        const simH1 = document.querySelector('.sim-header h1');
        if (simH1) simH1.textContent = TRANSLATIONS_AZ.simulator.pageTitle;

        const simP = document.querySelector('.sim-header p');
        if (simP) simP.textContent = TRANSLATIONS_AZ.simulator.pageDesc;

        // Custom sliders headers
        const sliderHeaders = document.querySelectorAll('.slider-header span:first-child');
        if (sliderHeaders.length >= 2) {
          sliderHeaders[0].textContent = TRANSLATIONS_AZ.simulator.sliderO2;
          sliderHeaders[1].textContent = TRANSLATIONS_AZ.simulator.sliderPressure;
        }

        // Ask AI Button
        const askAiBtn = document.querySelector('.sim-controls-panel .btn-neon');
        if (askAiBtn) {
          const svg = askAiBtn.querySelector('svg');
          askAiBtn.innerHTML = '';
          if (svg) askAiBtn.appendChild(svg);
          askAiBtn.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.simulator.btnAskAiSim));
        }

        // 6 Metrics Cards
        const metricCards = document.querySelectorAll('.sim-metric-card');
        if (metricCards.length >= 6) {
          metricCards[0].querySelector('.metric-card-label').textContent = TRANSLATIONS_AZ.simulator.metO2Title;
          metricCards[0].querySelector('.metric-card-sub').textContent = TRANSLATIONS_AZ.simulator.metO2Sub;

          metricCards[1].querySelector('.metric-card-label').textContent = TRANSLATIONS_AZ.simulator.metPressTitle;
          metricCards[1].querySelector('.metric-card-sub').textContent = TRANSLATIONS_AZ.simulator.metPressSub;

          metricCards[2].querySelector('.metric-card-label').textContent = TRANSLATIONS_AZ.simulator.metPo2Title;
          metricCards[2].querySelector('.metric-card-sub').textContent = TRANSLATIONS_AZ.simulator.metPo2Sub;

          metricCards[3].querySelector('.metric-card-label').textContent = TRANSLATIONS_AZ.simulator.metDeTitle;
          metricCards[3].querySelector('.metric-card-sub').textContent = TRANSLATIONS_AZ.simulator.metDeSub;

          metricCards[4].querySelector('.metric-card-label').textContent = TRANSLATIONS_AZ.simulator.metMultTitle;
          metricCards[4].querySelector('.metric-card-sub').textContent = TRANSLATIONS_AZ.simulator.metMultSub;

          metricCards[5].querySelector('.metric-card-label').textContent = TRANSLATIONS_AZ.simulator.metPurgeTitle;
          metricCards[5].querySelector('.metric-card-sub').textContent = TRANSLATIONS_AZ.simulator.metPurgeSub;
        }

        // Habitat and custom headers
        const habitatHeader = document.querySelector('.sim-controls-panel > div:first-child');
        if (habitatHeader) habitatHeader.textContent = '1. Kosmik Gəmi Mühitini Seçin';

        const customHeader = document.querySelector('#custom-sliders-box > div:first-child');
        if (customHeader) customHeader.textContent = 'Xüsusi Atmosfer Parametrlərini Tənzimləyin';

        const fhiScoreLbl = document.querySelector('.fhi-score-label');
        if (fhiScoreLbl) fhiScoreLbl.textContent = 'FHI XALI / 10.0';

        // Advisory Header
        const advHeader = document.querySelector('.advisory-header');
        if (advHeader) {
          const svg = advHeader.querySelector('svg');
          advHeader.innerHTML = '';
          if (svg) advHeader.appendChild(svg);
          advHeader.appendChild(document.createTextNode(' ' + TRANSLATIONS_AZ.simulator.advisoryHeader));
        }
      }
    }

    // ==========================================
    // PAGE 5: AI ASSISTANT (/ai)
    // ==========================================
    else if (pathname === '/ai') {
      const isAz = (lang === 'az');

      const headEl = document.getElementById('ai-sidebar-heading') || document.querySelector('.sidebar-heading');
      if (headEl) headEl.textContent = isAz ? TRANSLATIONS_AZ.ai.heading : 'RECOMMENDED SCIENTIFIC INQUIRIES';

      const welcomeBubble = document.querySelector('.message-row.assistant .msg-bubble');
      if (welcomeBubble) {
        welcomeBubble.innerHTML = isAz ? `
          <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--neon-cyan);margin-bottom:8px;">
            ${TRANSLATIONS_AZ.ai.welcomeTitle}
          </div>
          ${TRANSLATIONS_AZ.ai.welcomeDesc}
          <div class="msg-meta-bar">
            <span>NASA FİZİKİ ELMLƏR İNFORMATİKASI // CANLI SQL-RAG GROUND TRUTH</span>
            <span>SİSTEM HAZIRDIR</span>
          </div>
        ` : `
          <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--neon-cyan);margin-bottom:8px;">
            FIRE-X Scientific Research Assistant Online
          </div>
          Welcome to the NASA Microgravity Combustion Intelligence Console. Powered by <strong>OpenAI GPT-4o-mini + Live SQLite SQL-RAG</strong> and grounded in <strong>569 canonical records (407 row-level NASA PSI measurements + 162 clearly labelled illustrative values)</strong> across 18 investigation suites (ISS CIR, ISS MSG, Cygnus).
          <br><br>
          Ask about SI Investigation Relevance Rankings (Spacecraft, ISS, Lunar Base, Martian Base, Rover, EVA Suit), 0g–1g Partial-Gravity Bounding (ACME E-FIELD / pre-LUCI &amp; FM2), FLEX He/CO₂ diluents, ACME CFI-G 85% O₂ flames, Artemis II smoke alarm lessons, or 3-Tier Fire Safety Equipment (Prevention, Detection, Suppression).
          <div class="msg-meta-bar">
            <span>NASA PHYSICAL SCIENCE INFORMATICS // LIVE SQL-RAG GROUND TRUTH</span>
            <span>SYSTEM READY</span>
          </div>
        `;
      }

      const inputEl = document.getElementById('user-input');
      if (inputEl) inputEl.setAttribute('placeholder', isAz ? TRANSLATIONS_AZ.ai.placeholder : 'Ask about microgravity combustion, flame dynamics, or experiment IDs...');

      const sendBtnText = document.getElementById('send-btn-text');
      if (sendBtnText) sendBtnText.textContent = isAz ? TRANSLATIONS_AZ.ai.btnSend : 'Send Query';

      const clearBtn = document.getElementById('btn-clear-chat');
      if (clearBtn) clearBtn.textContent = isAz ? TRANSLATIONS_AZ.ai.btnClear : 'Clear Session';

      const secNote = document.getElementById('ai-security-note');
      if (secNote) secNote.textContent = isAz ? TRANSLATIONS_AZ.ai.securityNote : 'CONFIDENTIAL FLIGHT DATA ANALYZED THROUGH SECURE BACKEND PROXY';

      const enterNote = document.getElementById('ai-enter-note');
      if (enterNote) enterNote.textContent = isAz ? TRANSLATIONS_AZ.ai.enterNote : 'PRESS ENTER TO SEND';

      const typingSpan = document.querySelector('#typing-indicator span');
      if (typingSpan) typingSpan.textContent = isAz ? TRANSLATIONS_AZ.ai.typingText : 'Querying OpenAI gpt-4o-mini & Live SQLite NASA PSI Telemetry...';

      if (typeof syncAiPageLanguage === 'function') {
        syncAiPageLanguage(lang);
      }
    }

    // ==========================================
    // PAGE 6: ABOUT (/about)
    // ==========================================
    else if (pathname === '/about') {
      if (isAz) {
        const pEye = document.querySelector('.page-header .section-eyebrow');
        if (pEye) pEye.textContent = TRANSLATIONS_AZ.about.eyebrow;

        const pTit = document.querySelector('.page-header .section-title-xl');
        if (pTit) pTit.innerHTML = TRANSLATIONS_AZ.about.pageTitle;

        const pDesc = document.querySelector('.page-header .section-desc');
        if (pDesc) pDesc.textContent = TRANSLATIONS_AZ.about.pageDesc;

        const sec1Eye = document.querySelector('.about-section .two-col > div:first-child .section-eyebrow');
        if (sec1Eye) sec1Eye.textContent = TRANSLATIONS_AZ.about.sec1Eyebrow;

        const sec1Tit = document.querySelector('.about-section .two-col > div:first-child .section-title-xl');
        if (sec1Tit) sec1Tit.innerHTML = TRANSLATIONS_AZ.about.sec1Title;

        const infoCards = document.querySelectorAll('.info-card');
        if (infoCards.length >= 4) {
          infoCards[0].querySelector('h3').textContent = TRANSLATIONS_AZ.about.card1Title;
          infoCards[0].querySelector('p').textContent = TRANSLATIONS_AZ.about.card1Desc;

          infoCards[1].querySelector('h3').textContent = TRANSLATIONS_AZ.about.card2Title;
          infoCards[1].querySelector('p').textContent = TRANSLATIONS_AZ.about.card2Desc;

          infoCards[2].querySelector('h3').textContent = TRANSLATIONS_AZ.about.card3Title;
          infoCards[2].querySelector('p').textContent = TRANSLATIONS_AZ.about.card3Desc;

          infoCards[3].querySelector('h3').textContent = TRANSLATIONS_AZ.about.card4Title;
          infoCards[3].querySelector('p').textContent = TRANSLATIONS_AZ.about.card4Desc;
        }

        const sec2Eye = document.querySelector('.about-section .two-col > div:last-child .section-eyebrow');
        if (sec2Eye) sec2Eye.textContent = TRANSLATIONS_AZ.about.sec2Eyebrow;

        const sec2Tit = document.querySelector('.about-section .two-col > div:last-child .section-title-xl');
        if (sec2Tit) sec2Tit.innerHTML = TRANSLATIONS_AZ.about.sec2Title;

        // Additional About cards
        const sec2Cards = document.querySelectorAll('.about-section .two-col > div:last-child > div');
        if (sec2Cards.length >= 3) {
          const techHead = sec2Cards[1].querySelector('div:first-child');
          if (techHead) techHead.textContent = 'Texnologiya Arxitekturası';
          const chalHead = sec2Cards[2].querySelector('div:first-child');
          if (chalHead) chalHead.textContent = 'NASA Beynəlxalq Çağırışı';
        }
        const srcThs = document.querySelectorAll('.sources-table th');
        if (srcThs.length >= 3) {
          srcThs[0].textContent = 'Verilənlər Bazası';
          srcThs[1].textContent = 'PSI Kodu';
          srcThs[2].textContent = 'Yazılar Sayı';
        }
      }
    }
  }

  // --- CONTROLLER INITIALIZATION ---
  function initNav() {
    // 1. Progress Bar
    const progressBar = document.getElementById('nav-progress');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const total = document.body.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        progressBar.style.width = pct + '%';
      });
    }

    // 2. Navbar shrink on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      });
    }

    // 3. Active Link detection
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '/' && href === '/') || (href !== '/' && path.startsWith(href))) {
        link.classList.add('active');
      }
    });

    // 4. Smooth page transition (ignore anchor jumps, new-tab links, and file downloads)
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (
          href &&
          !href.startsWith('#') &&
          !link.target &&
          !link.hasAttribute('download') &&
          !/\.(ino|pdf|csv|zip|png|jpg|jpeg)$/i.test(href)
        ) {
          e.preventDefault();
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.2s ease';
          setTimeout(() => { window.location.href = href; }, 200);
        }
      });
    });

    // 5. Fade in & bfcache restore
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.35s ease';
      document.body.style.opacity = '1';
    });
    window.addEventListener('pageshow', () => {
      document.body.style.opacity = '1';
    });

    // 6. Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links-list');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    }

    // 7. Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 8. Language Toggle Handler
    const currentLang = localStorage.getItem('firex_lang') || 'en';
    applyLanguage(currentLang);
    if (currentLang === 'az') startPhraseTranslation();

    const langBtn = document.getElementById('nav-lang-btn') || document.getElementById('lang-btn-ai');
    if (langBtn) {
      langBtn.textContent = currentLang.toUpperCase();
      langBtn.addEventListener('click', () => {
        const cur = localStorage.getItem('firex_lang') || 'en';
        const next = (cur === 'az') ? 'en' : 'az';
        localStorage.setItem('firex_lang', next);
        langBtn.textContent = next.toUpperCase();
        applyLanguage(next);
        window.location.reload();
      });
    }
  }

  // Ensure execution regardless of load state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

/**
 * FIRE-X Live Hazard Alarm (all pages)
 * When the physical ESP32 reports a hazard, the whole site flashes red and shows a
 * banner. Visual only — the sound comes from the ESP32 buzzer, not the computer.
 * Test without a real hazard: window.dispatchEvent(new CustomEvent('firex-siren-test'))
 */
(function () {
  'use strict';
  const POLL_MS = 2000;
  const isAz = () => (localStorage.getItem('firex_lang') || 'en') === 'az';
  const T = (az, en) => (isAz() ? az : en);
  let liveHazard = false, testUntil = 0, lastData = null;

  // ── visuals ──
  const style = document.createElement('style');
  style.textContent = `
    @keyframes firexAlarmFlash { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
    @keyframes firexAlarmPulse { 0%,100% { transform: translateX(-50%) scale(1) } 50% { transform: translateX(-50%) scale(1.03) } }
    #firex-alarm-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 2000; display: none;
      box-shadow: inset 0 0 140px 40px rgba(255,23,68,0.85); background: rgba(255,23,68,0.10);
      animation: firexAlarmFlash 0.75s ease-in-out infinite; }
    #firex-alarm-banner { position: fixed; top: 76px; left: 50%; transform: translateX(-50%); z-index: 2001; display: none;
      align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: calc(100vw - 32px);
      padding: 12px 18px; border-radius: 12px; background: #1a0006; border: 2px solid #FF1744; color: #fff;
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 700;
      box-shadow: 0 0 30px rgba(255,23,68,0.6); animation: firexAlarmPulse 0.75s ease-in-out infinite; }
    #firex-alarm-banner a, #firex-alarm-banner button { font: inherit; font-size: 0.75rem; padding: 6px 10px; border-radius: 6px;
      cursor: pointer; text-decoration: none; border: 1px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.08); color: #fff; }
    @media (prefers-reduced-motion: reduce) { #firex-alarm-overlay, #firex-alarm-banner { animation: none } }
  `;
  const overlay = document.createElement('div');
  overlay.id = 'firex-alarm-overlay';
  const banner = document.createElement('div');
  banner.id = 'firex-alarm-banner';
  banner.setAttribute('role', 'alert');

  function mount() {
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    document.body.appendChild(banner);
  }

  function reasonText(d) {
    if (!d) return '';
    const parts = [];
    if (d.ir_flame_detected) parts.push(T('🔥 ALOV aşkarlandı', '🔥 FLAME detected'));
    if ((d.raw_smoke_adc || 0) > 1000) parts.push(`MQ-2 ${d.raw_smoke_adc}`);
    if ((d.mq4_adc || 0) > 2500) parts.push(`MQ-4 ${d.mq4_adc}`);
    return parts.join(' · ');
  }

  function renderBanner() {
    const testing = Date.now() < testUntil && !liveHazard;
    const reason = testing ? T('Sınaq siqnalı', 'Test signal') : reasonText(lastData);
    banner.innerHTML = `
      <span>🚨 ${T('TƏHLÜKƏ — FİZİKİ SENSOR', 'HAZARD — PHYSICAL SENSOR')}${reason ? ' · ' + reason : ''}</span>
      ${location.pathname !== '/hardware' ? `<a href="/hardware">${T('Hardware-ə bax →', 'Open Hardware →')}</a>` : ''}`;
  }

  // ── state ──
  function update() {
    const active = liveHazard || Date.now() < testUntil;
    overlay.style.display = active ? 'block' : 'none';
    banner.style.display = active ? 'flex' : 'none';
    if (active) renderBanner();
  }

  async function poll() {
    if (document.hidden) return;
    try {
      const res = await fetch('/api/sensor-live', { cache: 'no-store' });
      if (!res.ok) return;
      const d = (await res.json()).data || {};
      lastData = d;
      const hazard = !!(d.connected && (d.status === 'HAZARD_ALERT' || d.ir_flame_detected ||
        d.hazard_level === 'ELEVATED' || d.hazard_level === 'CRITICAL'));
      if (hazard !== liveHazard) { liveHazard = hazard; update(); }
      else if (hazard) renderBanner();
    } catch (_) {}
  }

  window.addEventListener('firex-siren-test', e => {
    const ms = (e.detail && e.detail.ms) || 3000;
    testUntil = Date.now() + ms;
    update();
    setTimeout(update, ms + 50);
  });

  function isLocalNetworkHost() {
    const h = window.location.hostname || '';
    return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(h);
  }

  function init() {
    mount();
    // Only poll physical ESP32 sensor state automatically on local LAN/localhost to avoid serverless quota drain on cloud deployments
    if (isLocalNetworkHost() || location.pathname.startsWith('/hardware')) {
      poll();
      setInterval(poll, POLL_MS);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
