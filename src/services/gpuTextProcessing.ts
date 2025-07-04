
import { pipeline } from '@huggingface/transformers';

type DeviceType = 'webgpu' | 'wasm';

export class GPUTextProcessingService {
  private embeddingPipeline: any = null;
  private classificationPipeline: any = null;
  private device: DeviceType;

  constructor(device: 'webgpu' | 'webgl' | 'cpu' = 'cpu') {
    // Map our device types to Hugging Face device types
    // HuggingFace transformers only supports 'webgpu' and 'wasm', not 'cpu'
    this.device = device === 'webgpu' ? 'webgpu' : 'wasm';
  }

  async initializeEmbeddings() {
    if (this.embeddingPipeline) return this.embeddingPipeline;

    try {
      console.log(`Initializing embedding pipeline with device: ${this.device}`);
      
      // Use a lightweight embedding model for better performance
      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { 
          device: this.device,
          dtype: 'fp32'
        }
      );
      
      console.log('Embedding pipeline initialized successfully');
      return this.embeddingPipeline;
    } catch (error) {
      console.error('Failed to initialize embedding pipeline:', error);
      // Fallback to WASM if WebGPU fails
      if (this.device !== 'wasm') {
        console.log('Falling back to WASM for embeddings');
        this.device = 'wasm';
        return this.initializeEmbeddings();
      }
      throw error;
    }
  }

  async initializeClassification() {
    if (this.classificationPipeline) return this.classificationPipeline;

    try {
      console.log(`Initializing classification pipeline with device: ${this.device}`);
      
      this.classificationPipeline = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { 
          device: this.device,
          dtype: 'fp32'
        }
      );
      
      console.log('Classification pipeline initialized successfully');
      return this.classificationPipeline;
    } catch (error) {
      console.error('Failed to initialize classification pipeline:', error);
      // Fallback to WASM if WebGPU fails
      if (this.device !== 'wasm') {
        console.log('Falling back to WASM for classification');
        this.device = 'wasm';
        return this.initializeClassification();
      }
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]) {
    const pipeline = await this.initializeEmbeddings();
    
    try {
      console.log(`Generating embeddings for ${texts.length} texts using ${this.device}`);
      const embeddings = await pipeline(texts, { 
        pooling: 'mean', 
        normalize: true 
      });
      
      return embeddings.tolist();
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  async classifyText(text: string) {
    const pipeline = await this.initializeClassification();
    
    try {
      console.log(`Classifying text using ${this.device}`);
      const result = await pipeline(text);
      return result;
    } catch (error) {
      console.error('Error classifying text:', error);
      throw error;
    }
  }

  getDevice() {
    return this.device;
  }
}
