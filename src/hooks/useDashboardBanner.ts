import { useDashboardSettings } from './useDashboardSettings';
import { useToast } from '@/hooks/use-toast';

export const useDashboardBanner = () => {
  const { settings, updateBannerSelection } = useDashboardSettings();
  const { toast } = useToast();

  const selectedBannerUrl = settings?.selected_banner_url || null;
  const selectedBannerType = settings?.selected_banner_type || null;

  const handleImageUpload = (file: File) => {
    // This would be handled by the banner service to upload and return URL
    console.log('Image uploaded:', file.name);
  };

  const handleVideoUpload = (file: File) => {
    // This would be handled by the banner service to upload and return URL
    console.log('Video uploaded:', file.name);
  };

  const handleAIGenerate = (prompt: string) => {
    // This would be handled by the AI service to generate and return URL
    console.log('AI Generate with prompt:', prompt);
  };

  const handleImageSelect = (imageUrl: string) => {
    updateBannerSelection(imageUrl, 'image');
    toast({
      title: "Banner Updated",
      description: "Your dashboard banner has been updated successfully.",
    });
  };

  return {
    selectedBannerUrl,
    selectedBannerType,
    handleImageUpload,
    handleVideoUpload,
    handleAIGenerate,
    handleImageSelect,
  };
};