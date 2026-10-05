import React from 'react';
import { Brain, RotateCcw, Award, CheckCircle2, ChevronRight, Sparkles, BookOpen, Layout, Compass, Music, Binary, Activity, Users, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INTELLIGENCE_DEFINITIONS } from '../data/intelligenceData';
import { IntelligenceType } from '../types';

interface IntelligenceProfileViewProps {
  onOpenDiagnostic: () => void;
  onSelectGrammarCategory: (catId: any) => void;
}

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  BookOpen,
  Layout,
  Compass,
  Music,
  Binary,
  Activity,
  Users,
  Shield,
};

export const IntelligenceProfileView: React.FC<IntelligenceProfileViewProps> = ({
  onOpenDiagnostic,
  onSelectGrammarCategory,
}) => {
  const { stats } = useGame();
  const scores = stats.intelligenceScores || {
    verbal_linguistic: 85,
    visual_spatial: 70,
    existential: 65,
    musical_rhythmic: 60,
    logical_mathematical: 80,
    bodily_kinesthetic: 55,
    interpersonal: 90,
    intrapersonal: 75,
  };

  const keys: IntelligenceType[] = [
    'verbal_linguistic',
    'visual_spatial',
    'existential',
    'musical_rhythmic',
    'logical_mathematical',
    'bodily_kinesthetic',
    'interpersonal',
    'intrapersonal',
  ];

  // Helper for Radar chart coordinates
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const totalAxes = keys.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = keys
    .map((k, idx) => {
      const val = scores[k] || 50;
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Brain className="h-4 w-4" />
            <span>Howard Gardner Çoklu Zekâ Kuramı & Bilişsel Profil</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bilişsel Zekâ Dağılımınız & İletişim Stratejiniz
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Her profesyonel dili farklı bir bilişsel kanaldan öğrenir. Vanguard, iş İngilizcesi dilbilgisi kurallarını ve konuşma pratiğini 8 farklı zekâ alanına özel pedagojik formatlarda sunar.
          </p>
        </div>

        <button
          onClick={onOpenDiagnostic}
          className="flex items-center gap-2 self-start md:self-auto rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-amber-400/50 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
          <span>{stats.hasCompletedDiagnostic ? 'Testi Tekrar Yap' : 'Zekâ Testini Başlat'}</span>
        </button>
      </div>

      {/* Main Grid: Radar Chart + Dominant Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Radar Chart Section */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              8 Boyutlu Bilişsel Radar
            </span>
          </div>

          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
              {/* Concentric Grid Circles */}
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <circle
                  key={scale}
                  cx={center}
                  cy={center}
                  r={radius * scale}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={scale === 1 ? 'none' : '3 3'}
                  opacity={0.6}
                />
              ))}

              {/* Axis lines */}
              {keys.map((_, idx) => {
                const { x, y } = getCoordinates(idx, 100);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    opacity={0.4}
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {keys.map((k, idx) => {
                const val = scores[k] || 50;
                const { x, y } = getCoordinates(idx, val);
                return (
                  <circle
                    key={k}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#fbbf24"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Bilişsel Güç Alanlarınız (%0 - %100)
            </span>
          </div>
        </div>

        {/* Executive Learning Architecture Summary */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Kişiselleştirilmiş Öğrenme Mimarisi</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">
              Yetişkin Profesyoneller İçin Zekâ Odaklı Metodoloji
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Geleneksel eğitim modelleri yetişkin profesyonelleri ezbere zorlar. Vanguard mimarisinde ise:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Sözel & Mantıksal Kanatlar</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Devrik cümleler (Inversions) ve zaman kipleri (Tenses) mantıksal bir algoritma ve sözleşme hukuku hassasiyetiyle aktarılır.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 mb-1">
                  <Music className="h-3.5 w-3.5" />
                  <span>Müziksel & Ritmik Vurgu</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  İngilizce hece vurgusu ve cümle melodisi (pitch contours) akustik ses laboratuvarında konuşma tanıma ile senkronize edilir.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Sosyal & Varoluşsal Vizyon</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Diplomatik modal fiiller ve pasif çatılar, gerçek M&A müzakere masasında ve etik liderlik krizlerinde test edilir.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Bedensel-Kinestetik Pratik</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kelime bloklarını sürükleyip inşa etme ve mikrofon karşısında fiziksel artikülasyon kas hafızasını pekiştirir.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Durum: <strong className="text-slate-200">{stats.hasCompletedDiagnostic ? 'Doğrulanmış Profil' : 'Varsayılan Ölçüm'}</strong>
            </span>
            <button
              onClick={() => onSelectGrammarCategory('inversions')}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Örnek Modüle Geç (Inversions)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8 Detailed Cards */}
      <div className="mb-4">
        <h2 className="font-serif text-2xl font-bold text-white mb-2">
          8 Çoklu Zekâ Alanının Detaylı İncelemesi
        </h2>
        <p className="text-xs text-slate-400">
          Her zekâ alanının iş dünyasındaki karşılığı ve Vanguard'daki öğrenme desteği
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keys.map((k, idx) => {
          const info = INTELLIGENCE_DEFINITIONS[k];
          const score = scores[k] || 0;
          const isDominant = stats.dominantIntelligences.includes(k);
          const IconComponent = ICON_COMPONENTS[info.iconName] || Brain;

          return (
            <div
              key={k}
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isDominant
                  ? 'border-amber-500/40 bg-slate-900 shadow-md shadow-amber-500/5'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${info.color}15`, color: info.color }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isDominant && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        Baskın
                      </span>
                    )}
                    <span className="font-mono text-sm font-bold text-slate-200">%{score}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono mb-0.5">0{idx + 1}. Boyut</div>
                <h3 className="font-bold text-slate-100 text-base mb-1">{info.titleTr}</h3>
                <div className="text-xs text-slate-400 mb-3 font-medium">{info.titleEn}</div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {info.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/70 text-xs">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  İş Dünyası Uygulaması:
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-3">
                  {info.businessApplication}
                </p>

                <div className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider mb-1">
                  Vanguard Metodu:
                </div>
                <p className="text-slate-300 text-xs line-clamp-2">
                  {info.learningApproach}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
