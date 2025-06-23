
// WebGPU type definitions
declare global {
  interface Navigator {
    gpu?: GPU;
  }

  interface GPU {
    requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  }

  interface GPUAdapter {
    requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
    features: GPUSupportedFeatures;
    limits: GPUSupportedLimits;
  }

  interface GPURequestAdapterOptions {
    powerPreference?: 'low-power' | 'high-performance';
    forceFallbackAdapter?: boolean;
  }

  interface GPUDeviceDescriptor {
    label?: string;
    requiredFeatures?: GPUFeatureName[];
    requiredLimits?: Record<string, number>;
  }

  interface GPUDevice {
    // Basic WebGPU device interface
    label: string;
    features: GPUSupportedFeatures;
    limits: GPUSupportedLimits;
  }

  interface GPUSupportedFeatures {
    has(feature: string): boolean;
  }

  interface GPUSupportedLimits {
    maxTextureDimension2D: number;
  }

  type GPUFeatureName = string;
}

export {};
