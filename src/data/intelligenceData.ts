import { DiagnosticQuestion, IntelligenceInfo, IntelligenceScoreMap, IntelligenceType } from '../types';

export const INTELLIGENCE_DEFINITIONS: Record<IntelligenceType, IntelligenceInfo> = {
  verbal_linguistic: {
    id: 'verbal_linguistic',
    titleTr: 'Sözel-Dil Zekâsı',
    titleEn: 'Verbal-Linguistic Intelligence',
    description: 'Kelimelerin anlamsal inceliklerini, retorik sanatını ve nüanslı diplomatik dili kavramada yüksek yetkinlik.',
    businessApplication: 'Üst düzey müzakereler, basın bültenleri, yönetim kurulu raporlamaları ve etkili ikna stratejileri.',
    learningApproach: 'Akademik kelime dağarcığı derinleştirmesi, diplomatik ifade karşılaştırmaları ve metin çözümlemeleri.',
    color: '#38bdf8', // Sky
    iconName: 'BookOpen',
  },
  visual_spatial: {
    id: 'visual_spatial',
    titleTr: 'Görsel-Uzamsal Zekâ',
    titleEn: 'Visual-Spatial Intelligence',
    description: 'Cümle mimarisini, söz dizimi şemalarını ve görsel akış diyagramlarını zihinde canlandırma gücü.',
    businessApplication: 'Sunum slaytları tasarımı, süreç haritalandırma, stratejik yol haritası ve yapısal organizasyon.',
    learningApproach: 'Renk kodlu sözdizimi mimarisi, infografik şablonlar ve görsel cümle yapı iskelesi (Syntax Blueprints).',
    color: '#818cf8', // Indigo
    iconName: 'Layout',
  },
  existential: {
    id: 'existential',
    titleTr: 'Varoluşsal Zekâ',
    titleEn: 'Existential Intelligence',
    description: 'Kurumsal amaç, etik liderlik, derin vizyon ve küresel insanlık meselelerini sorgulama eğilimi.',
    businessApplication: 'Şirket misyon/vizyon beyanları, kriz anında etik duruş, sürdürülebilirlik (ESG) liderliği.',
    learningApproach: 'Felsefi iş liderliği ikilemleri, etik karar alma simülasyonları ve amaç odaklı hitabet.',
    color: '#c084fc', // Purple
    iconName: 'Compass',
  },
  musical_rhythmic: {
    id: 'musical_rhythmic',
    titleTr: 'Müziksel-Ritmik Zekâ',
    titleEn: 'Musical-Rhythmic Intelligence',
    description: 'İngilizcenin vurgu, melodi, tonlama (intonation) ve akustik ritim kalıplarına karşı yüksek duyarlılık.',
    businessApplication: 'Yatırımcı sunumlarında akıcı tonlama, sahnede duraksama (pause) ve vurgu yönetimi, ikna edici vokal ritim.',
    learningApproach: 'Cümle melodisi dalga boyları (pitch contours), hece vurgu metronomu ve ses tanıma ile ritim kalibrasyonu.',
    color: '#f472b6', // Pink
    iconName: 'Music',
  },
  logical_mathematical: {
    id: 'logical_mathematical',
    titleTr: 'Mantıksal-Matematiksel Zekâ',
    titleEn: 'Logical-Mathematical Intelligence',
    description: 'Dilbilgisini cebirsel kurallar, mantıksal doğruluk tabloları ve sebep-sonuç matrisleri olarak kodlama becerisi.',
    businessApplication: 'Sözleşme şartnameleri analizi, finansal denetim açıklamaları, algoritma ve risk modelleri savunması.',
    learningApproach: 'Grammer formülleri (Inversion Algoritması, Zaman Çizelgesi Eksenleri), dönüşüm fonksiyonları.',
    color: '#34d399', // Emerald
    iconName: 'Binary',
  },
  bodily_kinesthetic: {
    id: 'bodily_kinesthetic',
    titleTr: 'Bedensel-Kinestetik Zekâ',
    titleEn: 'Bodily-Kinesthetic Intelligence',
    description: 'Fiziksel telaffuz artikülasyonu, jest/mimik koordinasyonu ve interaktif dokunsal manipülasyon.',
    businessApplication: 'Beden diliyle güven aşılama, sahne varlığı (executive presence), dinamik beden-ses senkronu.',
    learningApproach: 'Kelime bloklarını sürükleyip inşa etme, ağız-dil artikülasyonu kas hafızası ve aktif konuşma egzersizleri.',
    color: '#fbbf24', // Amber
    iconName: 'Activity',
  },
  interpersonal: {
    id: 'interpersonal',
    titleTr: 'Sosyal Zekâ',
    titleEn: 'Interpersonal Intelligence',
    description: 'Muhatabın niyetini, duygusal durumunu okuma, empati kurma ve çatışmaları diplomatik biçimde yönetme gücü.',
    businessApplication: 'Yüksek riskli M&A müzakereleri, ekip motivasyonu, kriz yönetimi basın toplantıları, paydaş diplomasisi.',
    learningApproach: 'Etkileşimli yönetim kurulu simülatörü (Boardroom Simulator), rol yapma ve canlı diyalog turn-taking.',
    color: '#60a5fa', // Blue
    iconName: 'Users',
  },
  intrapersonal: {
    id: 'intrapersonal',
    titleTr: 'İçsel Zekâ',
    titleEn: 'Intrapersonal Intelligence',
    description: 'Kendi öğrenme hızını, zayıf/güçlü yönlerini ve vokal özgüvenini bağımsız olarak tahlil etme kabiliyeti.',
    businessApplication: 'Bireysel liderlik gelişimi, öz eleştiri, stres altında soğukkanlı iletişim ve hedef takibi.',
    learningApproach: 'Kendi konuşmasını dinleyip değerlendirme, kişiselleştirilmiş hata analizi, sessiz odaklanma seansları.',
    color: '#2dd4bf', // Teal
    iconName: 'Shield',
  },
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    scenario: 'Profesyonel bir toplantıda veya sunumda yeni bir kavram öğrenirken:',
    prompt: 'Kelimelerin etimolojisini, nüanslarını ve alternatif retorik ifadeleri incelemek beni daha çok cezbeder.',
    category: 'verbal_linguistic',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 2,
    scenario: 'Yeni bir İngilizce dilbilgisi kuralını (örneğin devrik cümleler) kavrarken:',
    prompt: 'Görsel bir şema, akış diyagramı veya renk kodlu cümle blokları gördüğümde çok daha hızlı anlarım.',
    category: 'visual_spatial',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 3,
    scenario: 'Şirketimin geleceği ve küresel iş dünyası üzerine düşünürken:',
    prompt: 'Öğrendiğim dilin şirketimin etik değerlerine, kurumsal amacına ve insanlığa olan etkisine odaklanırım.',
    category: 'existential',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 4,
    scenario: 'Yabancı dilde konuşan bir CEO veya lideri dinlerken:',
    prompt: 'Cümlelerin yükselip alçalan melodisine (tonlama), duraklamalara ve konuşma ritmine hemen dikkat kesilirim.',
    category: 'musical_rhythmic',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 5,
    scenario: 'Karmaşık bir dil kuralı ile karşılaştığımda:',
    prompt: 'Bunu matematiksel bir denklem veya sebep-sonuç algoritması gibi adım adım formüle etmeyi tercih ederim.',
    category: 'logical_mathematical',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 6,
    scenario: 'Yeni telaffuzları ve cümle yapılarını pekiştirirken:',
    prompt: 'Kelime bloklarını ellerimle dizmek, mimiklerimi çalıştırmak ve yüksek sesle pratik yapmak bana enerji verir.',
    category: 'bodily_kinesthetic',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 7,
    scenario: 'İş İngilizcemi geliştirmenin en tatmin edici yolu:',
    prompt: 'Gerçek bir yönetim kurulu simülasyonunda veya müzakere ortamında bir muhataba karşı argüman savunmaktır.',
    category: 'interpersonal',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 8,
    scenario: 'Öğrenme sürecimin sonunda kendimi en verimli hissettiğim an:',
    prompt: 'Kendi kayıtlarımı dinleyip nerede takıldığımı objektif olarak not aldığım ve sessizce odaklandığım anlardır.',
    category: 'intrapersonal',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 9,
    scenario: 'İş sözleşmelerini veya yönetim kurulu tutanaklarını incelerken:',
    prompt: '"Notwithstanding" veya "Inasmuch as" gibi incelikli bağlaçların yarattığı yasal ton beni büyüler.',
    category: 'verbal_linguistic',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 10,
    scenario: 'Stratejik bir iş planı veya gramer şablonu hazırlarken:',
    prompt: 'Gözlerimi kapattığımda cümlenin ana bileşenlerini ve yan cümleciklerini zihinsel bir haritada yerleştiririm.',
    category: 'visual_spatial',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 11,
    scenario: 'Uluslararası bir kriz anında iletişim kurarken:',
    prompt: 'Sadece kârlılığı değil, aldığımız kararın kurumsal vicdan ve gelecek nesiller açısından anlamını dile getirmek isterim.',
    category: 'existential',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 12,
    scenario: 'İngilizce bir sunum provası yaparken:',
    prompt: 'Cümledeki anahtar kelimelerin hece vuruşlarını adeta bir müzikal tempo gibi hissetmek akıcılığımı katlar.',
    category: 'musical_rhythmic',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 13,
    scenario: 'Devrik cümle (Inversion) veya etken/edilgen yapıları dönüştürürken:',
    prompt: 'Hangi ögenin başa geçtiğinde fiil-özne yer değiştirdiğini kural tablosu üzerinden sistematik çözümlerim.',
    category: 'logical_mathematical',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 14,
    scenario: 'Kritik bir sunum öncesinde prova yaparken:',
    prompt: 'Ayakta durarak, ellerimi kullanarak ve telaffuzdaki ağız hareketlerimin kas hafızasına odaklanarak hazırlanırım.',
    category: 'bodily_kinesthetic',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 15,
    scenario: 'Zorlu bir müzakere ortağının itirazlarını karşılarken:',
    prompt: 'Karşı tarafın ses tonundaki gizli endişeyi sezip, diplomatik modal fiillerle güven tazelemekte ustayımdır.',
    category: 'interpersonal',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
  {
    id: 16,
    scenario: 'Kişisel gelişim planımı oluştururken:',
    prompt: 'Kendi gelişim grafiğimi, telaffuz doğruluğumu ve zihinsel sınırları kırma hedefimi tek başıma planlarım.',
    category: 'intrapersonal',
    weights: { stronglyAgree: 4, agree: 3, neutral: 2, disagree: 1 },
  },
];

export function calculateIntelligenceProfile(
  answers: Record<number, number>
): { scores: IntelligenceScoreMap; dominant: IntelligenceType[] } {
  const scores: IntelligenceScoreMap = {
    verbal_linguistic: 0,
    visual_spatial: 0,
    existential: 0,
    musical_rhythmic: 0,
    logical_mathematical: 0,
    bodily_kinesthetic: 0,
    interpersonal: 0,
    intrapersonal: 0,
  };

  const maxPossiblePerCategory = 8; // 2 questions * 4 max weight

  DIAGNOSTIC_QUESTIONS.forEach((q) => {
    const rawVal = answers[q.id] || 2; // Default to neutral if not answered
    scores[q.category] += rawVal;
  });

  // Convert to 0-100 percentage
  const percentageScores: IntelligenceScoreMap = { ...scores };
  (Object.keys(percentageScores) as IntelligenceType[]).forEach((key) => {
    percentageScores[key] = Math.round((scores[key] / maxPossiblePerCategory) * 100);
  });

  // Sort and pick top 2 or 3 dominant intelligences
  const sorted = (Object.keys(percentageScores) as IntelligenceType[]).sort(
    (a, b) => percentageScores[b] - percentageScores[a]
  );

  const dominant = sorted.slice(0, 3);

  return {
    scores: percentageScores,
    dominant,
  };
}
