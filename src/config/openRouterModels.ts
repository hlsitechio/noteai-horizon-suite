
export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  parameters: string;
  contextWindow: string;
  tokensAvailable: string;
  pricing: {
    input: string;
    output: string;
  };
  strengths: string[];
  bestFor: string[];
  description: string;
}

export const FREE_OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: 'deepseek/r1-distill-qwen-14b',
    name: 'DeepSeek R1 Distill Qwen 14B',
    provider: 'DeepSeek',
    parameters: '14B',
    contextWindow: '64K',
    tokensAvailable: '3.91M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'State-of-the-art dense model performance',
      'Outperforms OpenAI o1-mini',
      'Excellent at math (93.9% MATH-500)',
      'Strong coding abilities (1481 CodeForces)',
      'Distilled from advanced reasoning model'
    ],
    bestFor: [
      'Advanced reasoning tasks',
      'Mathematical problem solving',
      'Code generation and analysis',
      'Complex logical tasks'
    ],
    description: 'High-performance distilled model excelling at reasoning and math. Perfect for complex analysis tasks in our ambient intelligence system.'
  },
  {
    id: 'reka/reka-flash-3',
    name: 'Reka Flash 3',
    provider: 'Reka AI',
    parameters: '21B',
    contextWindow: '33K',
    tokensAvailable: '18.7M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'General chat',
      'Coding tasks', 
      'Instruction-following',
      'Function calling',
      'Low-latency deployment',
      'Explicit reasoning with <reasoning> tags'
    ],
    bestFor: [
      'Real-time context analysis',
      'Code assistance',
      'Quick reasoning tasks',
      'Local deployment scenarios'
    ],
    description: 'Compact 21B model optimized for efficiency with reasoning capabilities. Perfect for ambient intelligence due to low latency and reasoning transparency.'
  },
  {
    id: 'google/gemma-3-4b',
    name: 'Gemma 3 4B',
    provider: 'Google',
    parameters: '4B',
    contextWindow: '96K',
    tokensAvailable: '16.2M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'Multimodal (vision + text)',
      'Large context window (96K)',
      '140+ languages',
      'Math and reasoning',
      'Function calling'
    ],
    bestFor: [
      'Image analysis',
      'Large document processing',
      'Multilingual tasks',
      'Structured outputs'
    ],
    description: 'Multimodal model with exceptional context window. Ideal for processing large documents and images in our ambient system.'
  },
  {
    id: 'sarvamai/sarvam-m',
    name: 'Sarvam-M',
    provider: 'Sarvam AI',
    parameters: '24B',
    contextWindow: '33K',
    tokensAvailable: '18.7M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'Multilingual (English + 11 Indic languages)',
      'Dual-mode interface (think/non-think)',
      'Math and coding',
      'Chain-of-thought reasoning'
    ],
    bestFor: [
      'Multilingual content analysis',
      'Complex reasoning tasks',
      'Math problem solving',
      'Code generation with thinking'
    ],
    description: 'Multilingual model with optional thinking mode for complex reasoning. Excellent for diverse content analysis in our ambient system.'
  },
  {
    id: 'mistralai/mistral-small-3',
    name: 'Mistral Small 3',
    provider: 'Mistral AI',
    parameters: '24B',
    contextWindow: '33K',
    tokensAvailable: '16.8M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'Low-latency performance',
      'High accuracy (81% MMLU)',
      '3x faster than larger models',
      'Efficient local deployment'
    ],
    bestFor: [
      'Real-time suggestions',
      'Quick analysis tasks',
      'Performance-critical features',
      'Ambient background processing'
    ],
    description: 'Optimized for speed and efficiency while maintaining high accuracy. Perfect for real-time ambient intelligence features.'
  },
  {
    id: 'moonshotai/kimi-vl-a3b-thinking',
    name: 'Kimi VL A3B Thinking',
    provider: 'Moonshot AI',
    parameters: '2.8B (active)',
    contextWindow: '131K',
    tokensAvailable: '7.28M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'Vision-language capabilities',
      'Chain-of-thought reasoning',
      'Math and visual reasoning',
      'High-resolution input',
      'Mixture-of-Experts efficiency'
    ],
    bestFor: [
      'Visual content analysis',
      'Math problem solving',
      'Image-text understanding',
      'Complex reasoning tasks'
    ],
    description: 'Efficient vision-language model with thinking capabilities. Excellent for analyzing visual content and mathematical reasoning.'
  },
  {
    id: 'featherless/qwerky-72b',
    name: 'Qwerky 72B',
    provider: 'Featherless',
    parameters: '72B',
    contextWindow: '33K',
    tokensAvailable: '7.23M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'Linear attention (RWKV)',
      '1000x+ speedup potential',
      'Large parameter count',
      'Multilingual (30 languages)',
      'Efficient inference'
    ],
    bestFor: [
      'Large-scale processing',
      'High-performance tasks',
      'Multilingual content',
      'Complex analysis'
    ],
    description: 'Large model optimized for speed through linear attention. Great for complex tasks requiring high capability with efficient processing.'
  },
  {
    id: 'arliai/qwq-32b-rpr-v1',
    name: 'QwQ 32B RpR v1',
    provider: 'ArliAI',
    parameters: '32B',
    contextWindow: '33K',
    tokensAvailable: '16.8M',
    pricing: {
      input: '$0/M',
      output: '$0/M'
    },
    strengths: [
      'Long multi-turn conversations',
      'Creative writing',
      'Roleplay scenarios',
      'Coherence across long contexts',
      'Explicit reasoning steps'
    ],
    bestFor: [
      'Extended writing sessions',
      'Creative content generation',
      'Long-form analysis',
      'Maintaining context over time'
    ],
    description: 'Specialized for maintaining coherence in long conversations with explicit reasoning. Great for extended writing assistance.'
  }
];

// Model selection helpers for different use cases - Updated with premium models
export const AI_COPILOT_MODEL_RECOMMENDATIONS = {
  // Real-time ambient analysis (speed + quality)
  realTime: [
    'mistralai/mistral-small-3',        // Fast with high accuracy (81% MMLU)
    'reka/reka-flash-3',                // Low latency with reasoning
    'moonshotai/kimi-vl-a3b-thinking'   // Efficient MoE architecture
  ],
  
  // Complex reasoning tasks - Use the best reasoning models
  reasoning: [
    'deepseek/r1-distill-qwen-14b',     // State-of-the-art reasoning (beats o1-mini)
    'sarvamai/sarvam-m',                // Think mode for complex tasks
    'featherless/qwerky-72b'            // Large scale reasoning with efficiency
  ],
  
  // Large context analysis - Prioritize huge context windows
  largeContext: [
    'moonshotai/kimi-vl-a3b-thinking',  // 131K context + vision
    'google/gemma-3-4b',                // 96K context + multimodal
    'deepseek/r1-distill-qwen-14b'      // 64K context + superior reasoning
  ],
  
  // Multimodal tasks (text + images) - Vision-capable models only
  multimodal: [
    'google/gemma-3-4b',                // Best multimodal with 96K context
    'moonshotai/kimi-vl-a3b-thinking'   // Vision + reasoning + huge context
  ],
  
  // Creative writing assistance - Models optimized for creativity
  creative: [
    'arliai/qwq-32b-rpr-v1',           // Specialized for creative writing
    'featherless/qwerky-72b',          // Large model for complex creativity
    'deepseek/r1-distill-qwen-14b'     // Superior reasoning for creative tasks
  ],
  
  // Code assistance - Best coding performance models
  coding: [
    'deepseek/r1-distill-qwen-14b',    // Excellent coding (1481 CodeForces)
    'reka/reka-flash-3',               // Good coding + function calling
    'sarvamai/sarvam-m'                // Math + coding capabilities
  ],
  
  // Background processing - Efficient but capable models
  background: [
    'mistralai/mistral-small-3',        // 3x faster than larger models
    'moonshotai/kimi-vl-a3b-thinking',  // Efficient MoE architecture
    'reka/reka-flash-3'                 // Optimized for deployment
  ]
};

// Get recommended model for specific use case
export function getRecommendedModel(useCase: keyof typeof AI_COPILOT_MODEL_RECOMMENDATIONS): string {
  const recommendations = AI_COPILOT_MODEL_RECOMMENDATIONS[useCase];
  return recommendations[0]; // Return the top recommendation
}

// Get model details by ID
export function getModelDetails(modelId: string): OpenRouterModel | undefined {
  return FREE_OPENROUTER_MODELS.find(model => model.id === modelId);
}

// Get models suitable for a specific capability
export function getModelsWithCapability(capability: string): OpenRouterModel[] {
  return FREE_OPENROUTER_MODELS.filter(model => 
    model.strengths.some(strength => 
      strength.toLowerCase().includes(capability.toLowerCase())
    ) ||
    model.bestFor.some(useCase => 
      useCase.toLowerCase().includes(capability.toLowerCase())
    )
  );
}

// Enhanced ambient AI configuration with premium models
export const AMBIENT_AI_CONFIG = {
  // Real-time context analysis - Use fast, accurate model
  contextAnalysis: {
    model: 'mistralai/mistral-small-3',
    maxTokens: 1000,
    temperature: 0.3
  },
  
  // Writing suggestions - Use reasoning-capable model
  writingSuggestions: {
    model: 'reka/reka-flash-3',
    maxTokens: 500,
    temperature: 0.5
  },
  
  // Deep analysis - Use the best reasoning model
  deepAnalysis: {
    model: 'deepseek/r1-distill-qwen-14b',
    maxTokens: 2000,
    temperature: 0.2
  },
  
  // Creative assistance - Use large creative model
  creativeAssistance: {
    model: 'arliai/qwq-32b-rpr-v1',
    maxTokens: 1500,
    temperature: 0.7
  },
  
  // Background monitoring - Use efficient model
  backgroundMonitoring: {
    model: 'mistralai/mistral-small-3',
    maxTokens: 300,
    temperature: 0.1
  },
  
  // Multimodal analysis - Use vision-capable model
  multimodalAnalysis: {
    model: 'google/gemma-3-4b',
    maxTokens: 1200,
    temperature: 0.4
  },
  
  // Mathematical reasoning - Use best math model
  mathematicalReasoning: {
    model: 'deepseek/r1-distill-qwen-14b',
    maxTokens: 1500,
    temperature: 0.1
  },
  
  // Code assistance - Use best coding model
  codeAssistance: {
    model: 'deepseek/r1-distill-qwen-14b',
    maxTokens: 2000,
    temperature: 0.2
  }
};

// Dynamic model selection based on task complexity and requirements
export function selectOptimalModel(taskType: string, complexity: 'low' | 'medium' | 'high', requiresVision = false): string {
  if (requiresVision) {
    return complexity === 'high' ? 'google/gemma-3-4b' : 'moonshotai/kimi-vl-a3b-thinking';
  }

  switch (taskType) {
    case 'reasoning':
    case 'math':
    case 'analysis':
      return complexity === 'high' ? 'deepseek/r1-distill-qwen-14b' : 'sarvamai/sarvam-m';
    
    case 'creative':
    case 'writing':
      return complexity === 'high' ? 'arliai/qwq-32b-rpr-v1' : 'featherless/qwerky-72b';
    
    case 'coding':
    case 'technical':
      return 'deepseek/r1-distill-qwen-14b'; // Always use best for code
    
    case 'realtime':
    case 'quick':
      return 'mistralai/mistral-small-3'; // Always prioritize speed
    
    default:
      return complexity === 'high' ? 'deepseek/r1-distill-qwen-14b' : 'reka/reka-flash-3';
  }
}

// Performance tiers for different use cases
export const MODEL_PERFORMANCE_TIERS = {
  premium: [
    'deepseek/r1-distill-qwen-14b',  // Best overall reasoning
    'featherless/qwerky-72b',        // Largest parameter count
    'google/gemma-3-4b'              // Best multimodal
  ],
  
  balanced: [
    'sarvamai/sarvam-m',             // Good reasoning + multilingual
    'arliai/qwq-32b-rpr-v1',        // Creative + reasoning
    'mistralai/mistral-small-3'      // Fast + accurate
  ],
  
  efficient: [
    'reka/reka-flash-3',             // Low latency
    'moonshotai/kimi-vl-a3b-thinking' // Efficient MoE
  ]
};
