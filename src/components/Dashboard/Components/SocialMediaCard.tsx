import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  TrendingUp
} from 'lucide-react';

interface SocialMediaCardProps {
  variant?: 'twitter' | 'instagram' | 'linkedin';
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ variant = 'twitter' }) => {
  const socialData = {
    twitter: {
      platform: 'Twitter',
      username: '@yourcompany',
      followers: '12.4K',
      engagement: '+8.2%',
      posts: [
        {
          id: 1,
          content: 'Just launched our new dashboard feature! 🚀',
          likes: 47,
          comments: 12,
          shares: 8,
          time: '2h'
        },
        {
          id: 2,
          content: 'Working on some exciting updates...',
          likes: 23,
          comments: 5,
          shares: 3,
          time: '6h'
        }
      ]
    },
    instagram: {
      platform: 'Instagram',
      username: '@yourcompany',
      followers: '8.9K',
      engagement: '+15.7%',
      posts: [
        {
          id: 1,
          content: 'Behind the scenes of our latest project',
          likes: 156,
          comments: 24,
          shares: 12,
          time: '4h'
        }
      ]
    },
    linkedin: {
      platform: 'LinkedIn',
      username: 'Your Company',
      followers: '2.1K',
      engagement: '+5.4%',
      posts: [
        {
          id: 1,
          content: 'Thoughts on the future of dashboard design',
          likes: 89,
          comments: 15,
          shares: 21,
          time: '1d'
        }
      ]
    }
  };

  const data = socialData[variant];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {data.platform.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{data.platform}</CardTitle>
              <p className="text-xs text-muted-foreground">{data.username}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex justify-between text-sm">
          <div>
            <div className="font-semibold">{data.followers}</div>
            <div className="text-muted-foreground">Followers</div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">{data.engagement}</span>
            </div>
            <div className="text-muted-foreground">Engagement</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Posts
          </h4>
          {data.posts.map((post) => (
            <div key={post.id} className="space-y-2 p-2 rounded-lg bg-muted/30">
              <p className="text-xs">{post.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.comments}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Share2 className="h-3 w-3" />
                    <span>{post.shares}</span>
                  </span>
                </div>
                <span>{post.time}</span>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
};