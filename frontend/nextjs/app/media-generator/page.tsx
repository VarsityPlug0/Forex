'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

type MediaType = 'image' | 'video';
type UseCase = 'course' | 'blog' | 'marketing' | 'custom';
type ImageModel = 'gemini-image' | 'flux' | 'flux-schnell' | 'dalle';

interface GeneratedMedia {
  url: string;
  prompt: string;
  model: string;
  type: MediaType;
}

const IMAGE_SIZES = ['1024x1024', '1792x1024', '1024x1792'];
const IMAGE_STYLES = ['', 'photorealistic', 'flat design', 'illustration', 'dark and professional', '3D render'];

export default function MediaGeneratorPage() {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [useCase, setUseCase] = useState<UseCase>('course');
  const [topic, setTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageModel, setImageModel] = useState<ImageModel>('gemini-image');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedMedia | null>(null);
  const [history, setHistory] = useState<GeneratedMedia[]>([]);

  async function generate() {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let url: string;
      let body: Record<string, unknown>;

      if (useCase === 'custom') {
        url = `${API_BASE}/media/${mediaType}`;
        body = { prompt: customPrompt, model: imageModel, size, style };
      } else {
        url = `${API_BASE}/media/image`;
        const promptTemplates: Record<string, string> = {
          course: `Professional thumbnail for a forex trading course about "${topic}", financial education, clean design, charts and trading symbols`,
          blog: `Eye-catching blog illustration about "${topic}" in forex trading, modern flat design, financial markets`,
          marketing: `Marketing visual for forex platform featuring "${topic}", premium feel, gold and dark blue colors, professional`,
        };
        body = {
          prompt: promptTemplates[useCase],
          model: imageModel,
          size,
          style,
        };
        if (mediaType === 'video') {
          url = `${API_BASE}/media/video`;
          body = { prompt: promptTemplates[useCase] };
        }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      const media: GeneratedMedia = {
        url: data.url,
        prompt: data.revised_prompt || data.prompt || '',
        model: data.model,
        type: mediaType,
      };
      setResult(media);
      setHistory((prev) => [media, ...prev].slice(0, 12));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">AI Media Generator</h1>
          <p className="text-gray-400 mt-1">Generate images and videos for your forex platform using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {/* Media type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Media Type</label>
              <div className="flex gap-2">
                {(['image', 'video'] as MediaType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setMediaType(t)}
                    className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${
                      mediaType === t
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {t === 'image' ? '🖼 Image' : '🎬 Video'}
                  </button>
                ))}
              </div>
            </div>

            {/* Use case */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Use Case</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'course', label: '📚 Course Thumbnail' },
                  { key: 'blog', label: '📝 Blog Illustration' },
                  { key: 'marketing', label: '📣 Marketing Visual' },
                  { key: 'custom', label: '✏️ Custom Prompt' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setUseCase(key as UseCase)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
                      useCase === key
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic or custom prompt */}
            {useCase === 'custom' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe exactly what you want to generate..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic / Subject</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    useCase === 'course'
                      ? 'e.g. Price Action, Risk Management, EUR/USD...'
                      : useCase === 'blog'
                      ? 'e.g. Understanding Forex Spreads, Trading Psychology...'
                      : 'e.g. Copy Trading, 10x Your Returns, Join Our PAMM...'
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>
            )}

            {/* Image-only options */}
            {mediaType === 'image' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <select
                      value={imageModel}
                      onChange={(e) => setImageModel(e.target.value as ImageModel)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="gemini-image">Gemini Flash Image (Default)</option>
                      <option value="flux">Flux 1.1 Pro</option>
                      <option value="flux-schnell">Flux Schnell (Fast)</option>
                      <option value="dalle">DALL-E 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    >
                      {IMAGE_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  >
                    {IMAGE_STYLES.map((s) => (
                      <option key={s} value={s}>{s || 'Default'}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading || (!topic && useCase !== 'custom') || (!customPrompt && useCase === 'custom')}
              className="w-full py-3 rounded-lg font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating {mediaType}...
                </span>
              ) : (
                `Generate ${mediaType === 'image' ? 'Image' : 'Video'}`
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              {loading && (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-3">✨</div>
                  <p>Generating your {mediaType}...</p>
                  <p className="text-xs mt-1 text-gray-600">This may take 10–30 seconds</p>
                </div>
              )}
              {!loading && !result && (
                <div className="text-center text-gray-600">
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-sm">Your generated media will appear here</p>
                </div>
              )}
              {!loading && result && result.type === 'image' && result.url && (
                <img
                  src={result.url}
                  alt={result.prompt}
                  className="w-full h-full object-contain"
                />
              )}
              {!loading && result && result.type === 'video' && result.url && (
                <video
                  src={result.url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {result && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 line-clamp-2">{result.prompt}</p>
                <div className="flex gap-2">
                  <a
                    href={result.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.url)}
                    className="flex-1 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Recent Generations</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setResult(item)}
                  className="aspect-square rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-400 transition-colors"
                >
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" muted />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
