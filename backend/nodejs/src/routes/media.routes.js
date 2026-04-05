const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

// Models that use /images/generations endpoint
const IMAGES_API_MODELS = {
  flux: 'black-forest-labs/flux-1.1-pro',
  'flux-schnell': 'black-forest-labs/flux-schnell',
  dalle: 'openai/dall-e-3',
};

// Models that use /chat/completions endpoint and return images in content
const CHAT_IMAGE_MODELS = {
  gemini: 'google/gemini-flash-1.5-8b',
  'gemini-image': 'google/gemini-3.1-flash-image-preview',
};

const IMAGE_MODELS = { ...IMAGES_API_MODELS, ...CHAT_IMAGE_MODELS };
const VIDEO_MODEL = 'minimax/video-01';

function openRouterHeaders() {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
    'X-Title': 'Forex Trading Platform',
  };
}

// GET /api/v1/media/models — list available models
router.get('/models', (req, res) => {
  res.json({
    images: Object.entries(IMAGE_MODELS).map(([key, id]) => ({ key, id })),
    video: { key: 'minimax', id: VIDEO_MODEL },
  });
});

// POST /api/v1/media/image
// Body: { prompt, model?, size?, style? }
router.post('/image', async (req, res) => {
  const { prompt, model = 'gemini-image', size = '1024x1024', style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const modelId = IMAGE_MODELS[model] || CHAT_IMAGE_MODELS['gemini-image'];
  const fullPrompt = style
    ? `${prompt}, ${style} style, professional forex trading visual`
    : `${prompt}, professional forex trading visual`;

  try {
    let imageUrl, revisedPrompt;

    if (CHAT_IMAGE_MODELS[model]) {
      // Gemini and other chat-based image models
      const response = await axios.post(
        `${OPENROUTER_BASE}/chat/completions`,
        {
          model: modelId,
          messages: [{ role: 'user', content: fullPrompt }],
        },
        { headers: openRouterHeaders() }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      const message = response.data?.choices?.[0]?.message;

      // Gemini returns images in message.images array as base64 data URLs
      if (Array.isArray(message?.images) && message.images.length > 0) {
        imageUrl = message.images[0]?.image_url?.url || message.images[0]?.url;
      } else if (Array.isArray(content)) {
        const imgPart = content.find((c) => c.type === 'image_url');
        imageUrl = imgPart?.image_url?.url;
      } else if (typeof content === 'string') {
        imageUrl = content;
      }
      revisedPrompt = fullPrompt;
    } else {
      // Flux, DALL-E — standard images/generations endpoint
      const response = await axios.post(
        `${OPENROUTER_BASE}/images/generations`,
        { model: modelId, prompt: fullPrompt, n: 1, size },
        { headers: openRouterHeaders() }
      );
      const image = response.data?.data?.[0];
      imageUrl = image?.url;
      revisedPrompt = image?.revised_prompt || fullPrompt;
    }

    res.json({ url: imageUrl, revised_prompt: revisedPrompt, model: modelId });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message;
    console.error('Image generation error:', err.response?.data || err.message);
    res.status(status).json({ error: message });
  }
});

// POST /api/v1/media/video
// Body: { prompt, duration? }
router.post('/video', async (req, res) => {
  const { prompt, duration = 5 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const fullPrompt = `${prompt}, cinematic forex trading educational video, professional`;

  try {
    const response = await axios.post(
      `${OPENROUTER_BASE}/chat/completions`,
      {
        model: VIDEO_MODEL,
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 100,
      },
      { headers: openRouterHeaders() }
    );

    // MiniMax video-01 returns a video URL in the response
    const content = response.data?.choices?.[0]?.message?.content;
    const videoUrl = response.data?.choices?.[0]?.message?.video_url || content;

    res.json({
      url: videoUrl,
      prompt: fullPrompt,
      model: VIDEO_MODEL,
      raw: response.data,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message;
    res.status(status).json({ error: message });
  }
});

// POST /api/v1/media/generate-for
// Convenience: auto-generate prompt based on type and topic
// Body: { type: 'course'|'blog'|'marketing', topic, style? }
router.post('/generate-for', async (req, res) => {
  const { type, topic, style, mediaType = 'image' } = req.body;

  if (!type || !topic) {
    return res.status(400).json({ error: 'type and topic are required' });
  }

  const promptTemplates = {
    course: `Professional thumbnail for a forex trading course about "${topic}", financial education, clean design, charts and trading symbols`,
    blog: `Eye-catching blog post illustration about "${topic}" in forex trading, modern flat design, financial markets`,
    marketing: `Marketing visual for forex trading platform featuring "${topic}", premium feel, gold and dark blue color scheme, professional`,
  };

  const prompt = promptTemplates[type] || `${topic} forex trading visual`;
  const endpoint = mediaType === 'video' ? '/video' : '/image';

  // Forward to the appropriate internal handler
  req.body = { prompt, style, model: req.body.model };
  res.redirect(307, endpoint);
});

module.exports = router;
