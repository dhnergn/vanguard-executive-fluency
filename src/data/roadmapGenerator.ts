import { GrammarCategoryId, IntelligenceType, PersonalizedRoadmap, RoadmapMilestone } from '../types';
import { CURRICULUM_MODULES } from './curriculumData';
import { INTELLIGENCE_DEFINITIONS } from './intelligenceData';

export function generatePersonalizedRoadmap(
  dominant: IntelligenceType[]
): PersonalizedRoadmap {
  const primaryType: IntelligenceType = dominant[0] || 'verbal_linguistic';
  const secondaryType: IntelligenceType = dominant[1] || 'logical_mathematical';

  const primaryInfo = INTELLIGENCE_DEFINITIONS[primaryType];
  const secondaryInfo = INTELLIGENCE_DEFINITIONS[secondaryType];

  // Algorithmic ordering of the 10 modules based on cognitive profile
  let moduleOrder: GrammarCategoryId[] = [];

  switch (primaryType) {
    case 'logical_mathematical':
      // Logical learners grasp structured formulas and transformation algorithms first
      moduleOrder = [
        'inversions',
        'tenses',
        'relative_clause',
        'connectors',
        'passive_voice',
        'participle_clause',
        'academic_words',
        'modal_verbs',
        'reported_speech',
        'gerund_infinitive',
      ];
      break;

    case 'visual_spatial':
      // Visual learners benefit from architectural clause layouts and sentence geometry
      moduleOrder = [
        'relative_clause',
        'tenses',
        'participle_clause',
        'inversions',
        'connectors',
        'passive_voice',
        'academic_words',
        'gerund_infinitive',
        'reported_speech',
        'modal_verbs',
      ];
      break;

    case 'musical_rhythmic':
      // Cadence and rhythm learners excel with high-stress rhetorical spoken forms
      moduleOrder = [
        'inversions',
        'participle_clause',
        'modal_verbs',
        'connectors',
        'tenses',
        'reported_speech',
        'academic_words',
        'gerund_infinitive',
        'passive_voice',
        'relative_clause',
      ];
      break;

    case 'interpersonal':
      // Social learners thrive in stakeholder negotiation, softening demands, and consensus
      moduleOrder = [
        'modal_verbs',
        'passive_voice',
        'connectors',
        'reported_speech',
        'academic_words',
        'inversions',
        'tenses',
        'gerund_infinitive',
        'participle_clause',
        'relative_clause',
      ];
      break;

    case 'existential':
      // Purpose-driven learners excel at de-escalation, ethical positioning, and overarching vision
      moduleOrder = [
        'passive_voice',
        'modal_verbs',
        'inversions',
        'connectors',
        'participle_clause',
        'academic_words',
        'reported_speech',
        'tenses',
        'gerund_infinitive',
        'relative_clause',
      ];
      break;

    case 'bodily_kinesthetic':
      // Kinesthetic learners thrive on assembling phrase tiles and physical speech articulation
      moduleOrder = [
        'inversions',
        'connectors',
        'tenses',
        'modal_verbs',
        'gerund_infinitive',
        'participle_clause',
        'passive_voice',
        'relative_clause',
        'academic_words',
        'reported_speech',
      ];
      break;

    case 'intrapersonal':
      // Self-reflective learners excel at meticulous precision, vocabulary depth, and reported minutes
      moduleOrder = [
        'academic_words',
        'tenses',
        'reported_speech',
        'connectors',
        'gerund_infinitive',
        'passive_voice',
        'relative_clause',
        'inversions',
        'modal_verbs',
        'participle_clause',
      ];
      break;

    case 'verbal_linguistic':
    default:
      // Linguistic learners master sophisticated connectors, academic rhetoric, and inversions
      moduleOrder = [
        'connectors',
        'academic_words',
        'inversions',
        'modal_verbs',
        'participle_clause',
        'tenses',
        'reported_speech',
        'relative_clause',
        'gerund_infinitive',
        'passive_voice',
      ];
      break;
  }

  // Build the 10 Milestones with custom cognitive directives
  const milestones: RoadmapMilestone[] = moduleOrder.map((catId, index) => {
    const mod = CURRICULUM_MODULES.find((m) => m.id === catId)!;

    let phaseId: 'foundation' | 'core_negotiation' | 'executive_rhetoric' = 'foundation';
    let phaseName = 'Aşama 1: Bilişsel Temel & Hızlı Yetkinlik';

    if (index >= 3 && index < 7) {
      phaseId = 'core_negotiation';
      phaseName = 'Aşama 2: Yönetimsel Müzakere & Stratejik Dil';
    } else if (index >= 7) {
      phaseId = 'executive_rhetoric';
      phaseName = 'Aşama 3: C-Suite Hitabet & Üst Düzey Retorik';
    }

    // Determine tailored modality label based on user's primary/secondary intelligence
    let recommendedModality: RoadmapMilestone['recommendedModality'] = 'visual_first';
    let modalityLabel = 'Görsel Şema ile Başla';
    let cognitiveAdvantage = 'Cümle bileşenlerini mekansal olarak konumlandırarak zihninizde netleştirin.';

    if (primaryType === 'logical_mathematical') {
      recommendedModality = 'logic_first';
      modalityLabel = 'Mantık Matrisi & Formül';
      cognitiveAdvantage = 'Gramer kuralını cebirsel bir dönüşüm denklemi gibi zihninize kodlayın.';
    } else if (primaryType === 'musical_rhythmic') {
      recommendedModality = 'cadence_first';
      modalityLabel = 'Vokal Melodi & Hece Vurgusu';
      cognitiveAdvantage = 'Cümlenin tonlama eğrisini dinleyip ses laboratuvarında ritmi yakalayın.';
    } else if (primaryType === 'interpersonal') {
      recommendedModality = 'dialogue_first';
      modalityLabel = 'Masada Diplomatik Rol Oynama';
      cognitiveAdvantage = 'Doğrudan karşı tarafın duygu ve itirazını yönetme odağıyla pratik yapın.';
    } else if (primaryType === 'existential') {
      recommendedModality = 'ethics_first';
      modalityLabel = 'Etik Liderlik & Vizyon Sorusu';
      cognitiveAdvantage = 'Kurumsal sorumluluk ve insan odaklı amaç perspektifiyle ifadeyi benimseyin.';
    } else if (primaryType === 'bodily_kinesthetic') {
      recommendedModality = 'kinesthetic_builder';
      modalityLabel = 'Kelime Blokları & Ağız Kas Hafızası';
      cognitiveAdvantage = 'Kelimeleri sırayla dizerek ve yüksek sesle mikrofona konuşarak kas hafızasını devreye sokun.';
    } else {
      recommendedModality = 'visual_first';
      modalityLabel = 'Retorik & Kelime Nüansı';
      cognitiveAdvantage = 'C-Suite seviyesindeki ince anlam farklarını kıyaslayarak kelime haznenizi parlatın.';
    }

    return {
      id: `milestone_${catId}`,
      stepNumber: index + 1,
      moduleId: catId,
      title: mod.title,
      phaseId,
      phaseName,
      recommendedModality,
      modalityLabel,
      targetSkill: mod.tagline,
      cognitiveAdvantage,
      scenarioHook: mod.exercises[0]?.scenarioTitle || 'Yönetim Kurulu Senaryosu',
      estimatedMinutes: 12 + (index * 2),
    };
  });

  return {
    strategyTitle: `${primaryInfo.titleTr} Odaklı Bilişsel İlerleme Mimarisi`,
    strategySubtitle: `Baskın zekânız (${primaryInfo.titleTr}) ve destekleyici alanınız (${secondaryInfo.titleTr}) temel alınarak oluşturulan 10 adımlık yönetici müfredatı.`,
    dominantType: primaryType,
    primaryCognitiveLever: primaryInfo.learningApproach,
    pedagogicalDirectives: [
      `Derslerde öncelikle "${primaryInfo.titleTr}" sekmesini inceleyerek bilişsel bariyeri sıfıra indirin.`,
      `Konuşma egzersizlerinde Web Speech API mikrofonunu kullanarak telaffuz ve sözdizimi doğruluğunuzu anlık ölçün.`,
      `Her 3 modülde bir "Boardroom Simulator" arenasında simüle edilen yönetim kurulu üyelerine karşı sesli savunma yapın.`,
      `Öğrendiğiniz yüksek seviyeli kalıpları gerçek dünya iş toplantılarınızda güvenle seslendirin.`,
    ],
    milestones,
  };
}
