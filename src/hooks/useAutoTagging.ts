
import { useWorkerAIIntegration } from './useWorkerAIIntegration';

export const useAutoTagging = () => {
  const { generateTags: workerGenerateTags, isLoading: isGeneratingTags } = useWorkerAIIntegration();

  const generateTags = async (title: string, content: string): Promise<string[]> => {
    return await workerGenerateTags(title, content);
  };

  return {
    generateTags,
    isGeneratingTags
  };
};
