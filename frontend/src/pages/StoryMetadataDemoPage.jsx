import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Info,
} from 'lucide-react';
import StoryMetadataGenerator from '../components/StoryMetadataGenerator';

// Authentic Tamil oral-history transcript test samples
const TEST_SAMPLES = [
  {
    id: 'agriculture',
    title: 'விவசாய & உழவு மரபு',
    transcript:
      'எங்க தாத்தா காலத்துல இருந்தே நாங்க தஞ்சாவூர் பக்கத்துல காவிரி பாசனத்துல விவசாயம் பார்க்கிறோம். ' +
      'சீரக சம்பா, மாப்பிள்ளை சம்பா போன்ற பாரம்பரிய நெல் விதைகளை வீட்டு மச்சான்ல சாம்பல் தடவி பத்திரப்படுத்தி ' +
      'வைப்போம். பூச்சி தாக்குதல் வந்தா வேப்பெண்ணெய் கரைசலும் பஞ்சகவ்யமும் தெளிப்போம். மண் வளம் கெடாம இருக்க ' +
      'பசுந்தாள் உரம் போடுவோம். இந்த பாரம்பரிய உழவு முறை நம்ம உடலுக்கும் மண்ணுக்கும் நல்லது.',
  },
  {
    id: 'medicine',
    title: 'சித்த மருத்துவ முறை',
    transcript:
      'எங்க கிராமத்துல சின்ன வயசுல சளி, காய்ச்சல் வந்தா உடனே சித்த மருத்துவர் கிட்ட தான் போவோம். ' +
      'வீட்டு கொல்லைப்புறத்துல இருக்கிற ஆடாதோடை, தூதுவளை, துளசி இலைகளை பறிச்சு கசாயம் போட்டு தருவாங்க. ' +
      'எந்தவித பக்கவிளைவும் இல்லாம ஒரே நாள்ல சளி இறங்கிடும். இந்த மூலிகை மருத்துவ அறிவை நாம அடுத்த தலைமுறைக்கு சொல்லணும்.',
  },
  {
    id: 'folk',
    title: 'நாட்டுப்புற கலை & பாடல்',
    transcript:
      'நாங்க வயல்ல நாத்து நடும் போதும், களை எடுக்கும் போதும் வாய்மொழியா நாட்டுப்புறப் பாட்டு பாடுவோம். ' +
      'ஏலேலோ ஐலசா என்று பாடினால் வேலை அலுப்பு தெரியாது. எங்க பாட்டி நிறைய கிராமிய தொன்மக் கதைகளையும் ' +
      'பாட்டுகளையும் சொல்லிக் கொடுத்தாங்க.',
  },
  {
    id: 'water',
    title: 'நீர் மேலாண்மை மரபு',
    transcript:
      'எங்க ஊர்ல மூணு பெரிய ஏரிகளும் இருபது கண்மாய்களும் இருந்துச்சு. மழைக்காலத்துல வரத்துக் கால்வாய் வழியா ' +
      'நீர் வந்து ஏரி நிரம்பும். கிராம மக்கள் ஒன்னா சேர்ந்து குடிமராமத்து செய்து ஏரியையும் மடைகளையும் தூர்வாருவோம்.',
  },
];

export default function StoryMetadataDemoPage() {
  const [selectedSample, setSelectedSample] = useState(TEST_SAMPLES[0].id);
  const [transcriptText, setTranscriptText] = useState(TEST_SAMPLES[0].transcript);
  const [appliedMetadata, setAppliedMetadata] = useState(null);

  const handleSelectSample = (sampleId) => {
    setSelectedSample(sampleId);
    const found = TEST_SAMPLES.find((s) => s.id === sampleId);
    if (found) {
      setTranscriptText(found.transcript);
    }
  };

  const handleMetadataApplied = (metadata) => {
    setAppliedMetadata(metadata);
  };

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="bg-forest-900 text-ivory-50 p-6 md:p-8 rounded-3xl shadow-sm border border-forest-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-forest-800 text-gold-300 border border-forest-700">
              தொழில்நுட்ப மாதிரி வடிவம்
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-tamil tracking-tight text-ivory-50">
            தமிழ் வாய்மொழி வரலாற்று மெட்டாடேட்டா உருவாக்கம்
          </h1>
          <p className="text-sm text-forest-200 mt-2 font-tamil max-w-2xl leading-relaxed">
            ஆய்வு செய்யப்பட்ட தமிழ் வாய்மொழி உரையை AI கொண்டு ஆராய்ந்து தலைப்பு, சுருக்கம், பகுப்பு மற்றும் குறிச்சொற்களை
            உருவாக்கும் சுதந்திரமான சோதனை தளம்.
          </p>
        </div>

        {/* Test Samples Selector & Transcript Input */}
        <div className="bg-white border border-ivory-300 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-forest-950 font-tamil flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-forest-800" />
                <span>மாதிரி வாய்மொழி உரை</span>
              </h2>
              <p className="text-xs text-charcoal-500 font-tamil">
                கீழே உள்ள மாதிரிகளில் ஒன்றைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் சொந்த தமிழ் உரையை உள்ளிடவும்.
              </p>
            </div>

            {/* Quick Sample Selector */}
            <div className="flex flex-wrap gap-1.5">
              {TEST_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-tamil transition-all ${
                    selectedSample === sample.id
                      ? 'bg-forest-800 text-ivory-50 font-semibold shadow-sm'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200 border border-ivory-300'
                  }`}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={4}
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="ஆய்வு செய்யப்பட்ட தமிழ் வாய்மொழி உரையை இங்கே உள்ளிடவும்..."
            className="w-full p-4 text-sm font-tamil bg-ivory-50/50 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900 leading-relaxed resize-y shadow-inner"
          />

          <div className="flex justify-between items-center text-xs text-charcoal-500 font-tamil">
            <span>எழுத்துக்களின் எண்ணிக்கை: {transcriptText.length} எழுத்துக்கள்</span>
            <span>மொழி: தமிழ் (ta)</span>
          </div>
        </div>

        {/* Phase 5 Core Component */}
        <StoryMetadataGenerator
          transcript={transcriptText}
          onApplyMetadata={handleMetadataApplied}
        />

        {/* Phase 4 Integration Receiver Preview */}
        {appliedMetadata && (
          <div className="bg-white border-2 border-forest-600/30 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-forest-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold font-tamil">
                கதைப் படிவத்தில் பெறப்பட்ட தரவு
              </h3>
            </div>
            <p className="text-xs text-charcoal-600 font-tamil">
              கதை சேமிக்கும் போது, இந்த மெட்டாடேட்டா தானாகவே படிவத்தின்
              புலங்களை (தலைப்பு, சுருக்கம், பகுப்பு, குறிச்சொற்கள்) நிரப்ப பயன்படுத்தப்படும்.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200">
                <span className="font-bold text-charcoal-700 block mb-1">தலைப்பு:</span>
                <p className="font-tamil text-forest-950 font-medium text-sm">{appliedMetadata.title}</p>
              </div>

              <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200">
                <span className="font-bold text-charcoal-700 block mb-1">பகுப்பு:</span>
                <p className="font-tamil text-forest-950 font-medium">{appliedMetadata.category}</p>
              </div>

              <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 md:col-span-2">
                <span className="font-bold text-charcoal-700 block mb-1">சுருக்கம்:</span>
                <p className="font-tamil text-charcoal-800 leading-relaxed">{appliedMetadata.summary}</p>
              </div>

              {appliedMetadata.englishSummary && (
                <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 md:col-span-2">
                  <span className="font-bold text-charcoal-700 block mb-1">ஆங்கில சுருக்கம்:</span>
                  <p className="text-charcoal-800 leading-relaxed">{appliedMetadata.englishSummary}</p>
                </div>
              )}

              <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 md:col-span-2">
                <span className="font-bold text-charcoal-700 block mb-1">குறிச்சொற்கள்:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {appliedMetadata.tags?.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-gold-100 text-gold-900 border border-gold-300 text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* JSON Schema Representation */}
            <details className="text-xs text-charcoal-600">
              <summary className="cursor-pointer font-semibold hover:text-forest-800 select-none">
                Phase 4 சேமிப்பிற்கான JSON தரவு (Click to inspect payload)
              </summary>
              <pre className="mt-2 p-3 bg-charcoal-900 text-emerald-400 rounded-xl overflow-x-auto text-[11px] font-mono">
                {JSON.stringify(appliedMetadata, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Architecture & Integration Note */}
        <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 text-xs flex items-start gap-3">
          <Info className="h-4 w-4 text-forest-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Phase 4 மற்றும் Phase 5 இணைக்கும் நெறிமுறை (Integration Protocol):</p>
            <p className="mt-1 leading-relaxed text-forest-800">
              இக்கூறு முற்றிலும் தனித்துவமானது. Phase 4 நிறைவு பெற்றதும், <code>PreserveStoryPage.jsx</code> இல்
              Step 2 (Reviewed Transcript) அல்லது Step 3 (Story Details) இடையே{' '}
              <code>&lt;StoryMetadataGenerator transcript=&#123;editedTranscript&#125; onApplyMetadata=&#123;handleApplyMetadata&#125; /&gt;</code>{' '}
              என்று இணைத்தால் போதுமானது.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
