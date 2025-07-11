import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOAnalysis } from './components/SEOAnalysis';
import { KeywordTracker } from './components/KeywordTracker';
import { TechnicalSEO } from './components/TechnicalSEO';
import { ContentOptimization } from './components/ContentOptimization';
import { BacklinkAnalysis } from './components/BacklinkAnalysis';
import { AdvancedSEOAssistant } from './components/AdvancedSEOAssistant';
import { AdvancedSEOAuditor } from './components/AdvancedSEOAuditor';
import { SEOHeader } from './components/SEOHeader';

const SEODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <SEOHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">SEO Analysis</TabsTrigger>
            <TabsTrigger value="ai-assistant">🧠 AI Assistant</TabsTrigger>
            <TabsTrigger value="auditor">🔍 SEO Auditor</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="technical">Technical SEO</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SEOAnalysis />
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <AdvancedSEOAssistant />
          </TabsContent>

          <TabsContent value="auditor" className="space-y-6">
            <AdvancedSEOAuditor />
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <KeywordTracker />
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <TechnicalSEO />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentOptimization />
          </TabsContent>

          <TabsContent value="backlinks" className="space-y-6">
            <BacklinkAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SEODashboard;