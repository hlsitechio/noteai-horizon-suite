import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Search, Filter, Download, Star, Eye, Heart, Check } from 'lucide-react';

interface BannerGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage?: (imageUrl: string) => void;
}

const BannerGalleryModal: React.FC<BannerGalleryModalProps> = ({
  open,
  onOpenChange,
  onSelectImage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All', count: 120 },
    { id: 'landscapes', name: 'Landscapes', count: 45 },
    { id: 'abstract', name: 'Abstract', count: 32 },
    { id: 'business', name: 'Business', count: 28 },
    { id: 'tech', name: 'Technology', count: 15 }
  ];

  // Mock gallery images - in real app these would come from API
  const galleryImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      title: 'Mountain Landscape',
      category: 'landscapes',
      tags: ['nature', 'mountains', 'sunset'],
      downloads: 1200,
      likes: 89,
      featured: true
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      title: 'Abstract Gradient',
      category: 'abstract',
      tags: ['gradient', 'colorful', 'modern'],
      downloads: 850,
      likes: 67,
      featured: false
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      title: 'Space Technology',
      category: 'tech',
      tags: ['space', 'tech', 'futuristic'],
      downloads: 920,
      likes: 124,
      featured: true
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
      title: 'Modern Office',
      category: 'business',
      tags: ['office', 'modern', 'professional'],
      downloads: 1100,
      likes: 95,
      featured: false
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
      title: 'Forest Path',
      category: 'landscapes',
      tags: ['forest', 'nature', 'peaceful'],
      downloads: 750,
      likes: 56,
      featured: false
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
      title: 'Digital Abstract',
      category: 'abstract',
      tags: ['digital', 'abstract', 'blue'],
      downloads: 680,
      likes: 78,
      featured: true
    }
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredImages = galleryImages.filter(image => image.featured);

  const handleSelectImage = (image: any) => {
    setSelectedImage(image.id);
    onSelectImage?.(image.url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Banner Gallery
          </DialogTitle>
          <DialogDescription>
            Choose from our curated collection of high-quality banner images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* Featured Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {featuredImages.map((image) => (
                    <Card
                      key={image.id}
                      className="cursor-pointer group hover:shadow-lg transition-all overflow-hidden"
                      onClick={() => handleSelectImage(image)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Check className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="absolute top-2 right-2 bg-yellow-500">
                            Featured
                          </Badge>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm truncate">{image.title}</h4>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {image.downloads}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {image.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Images */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">All Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <Card
                      key={image.id}
                      className="cursor-pointer group hover:shadow-lg transition-all overflow-hidden"
                      onClick={() => handleSelectImage(image)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Check className="h-6 w-6 text-white" />
                          </div>
                          {image.featured && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500 text-xs">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-xs truncate">{image.title}</h4>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {image.downloads}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {image.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Category-specific tabs would be similar */}
            {categories.slice(1).map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages
                    .filter(img => img.category === category.id)
                    .map((image) => (
                      <Card
                        key={image.id}
                        className="cursor-pointer group hover:shadow-lg transition-all overflow-hidden"
                        onClick={() => handleSelectImage(image)}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={image.url}
                              alt={image.title}
                              className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Check className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium text-xs truncate">{image.title}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerGalleryModal;