import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send, 
  TrendingUp,
  Clock,
  MapPin,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const { toast } = useToast();

  const communityPosts = [
    {
      id: 1,
      title: "Broken streetlight on Main St",
      description: "The streetlight has been out for 3 days, creating safety concerns for pedestrians walking at night.",
      author: "Sarah M.",
      authorInitials: "SM",
      location: "Main St & 5th Ave",
      category: "Street Lighting",
      timeAgo: "2 hours ago",
      upvotes: 15,
      downvotes: 1,
      comments: [
        {
          id: 1,
          author: "Mike R.",
          authorInitials: "MR",
          content: "I've noticed this too. It's especially dangerous near the crosswalk.",
          timeAgo: "1 hour ago",
          upvotes: 3
        },
        {
          id: 2,
          author: "City Worker",
          authorInitials: "CW",
          content: "Thank you for reporting this. We have logged this issue and will have it fixed within 48 hours.",
          timeAgo: "30 minutes ago",
          upvotes: 8,
          isOfficial: true
        }
      ],
      status: "In Progress",
      trending: true
    },
    {
      id: 2,
      title: "New bike lane proposal for Oak Avenue",
      description: "The city is considering adding bike lanes to Oak Avenue. What are your thoughts on this initiative?",
      author: "Lisa K.",
      authorInitials: "LK",
      location: "Oak Avenue",
      category: "Transportation",
      timeAgo: "4 hours ago",
      upvotes: 32,
      downvotes: 8,
      comments: [
        {
          id: 3,
          author: "John D.",
          authorInitials: "JD",
          content: "This would be great for reducing traffic congestion and promoting eco-friendly transport.",
          timeAgo: "3 hours ago",
          upvotes: 12
        },
        {
          id: 4,
          author: "Emma S.",
          authorInitials: "ES",
          content: "I'm concerned about reduced parking spaces. Has this been considered?",
          timeAgo: "2 hours ago",
          upvotes: 5
        }
      ],
      status: "Discussion",
      trending: true
    },
    {
      id: 3,
      title: "Community cleanup event this Saturday",
      description: "Join us for our monthly community cleanup event at Central Park. Volunteers needed!",
      author: "Parks Department",
      authorInitials: "PD",
      location: "Central Park",
      category: "Community Event",
      timeAgo: "6 hours ago",
      upvotes: 28,
      downvotes: 0,
      comments: [
        {
          id: 5,
          author: "Maria L.",
          authorInitials: "ML",
          content: "Count me in! What time does it start?",
          timeAgo: "5 hours ago",
          upvotes: 2
        }
      ],
      status: "Event",
      isOfficial: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-government-blue text-white";
      case "Discussion": return "bg-government-accent text-white";
      case "Event": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleVote = (postId: number, type: 'up' | 'down') => {
    toast({
      title: "Vote recorded",
      description: `Your ${type}vote has been recorded for this post.`,
    });
  };

  const handleComment = (postId: number) => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion.",
    });
    setNewComment("");
    setSelectedPost(null);
  };

  const toggleComments = (postId: number) => {
    setSelectedPost(selectedPost === postId ? null : postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-government-navy">Community Feed</h1>
          <p className="text-muted-foreground">Engage with your neighbors and local issues</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          2.4K active members
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-government-blue mb-2" />
            <div className="text-2xl font-bold text-government-navy">47</div>
            <p className="text-sm text-muted-foreground">Active Discussions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ThumbsUp className="h-8 w-8 mx-auto text-success mb-2" />
            <div className="text-2xl font-bold text-government-navy">892</div>
            <p className="text-sm text-muted-foreground">Total Votes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-8 w-8 mx-auto text-government-accent mb-2" />
            <div className="text-2xl font-bold text-government-navy">234</div>
            <p className="text-sm text-muted-foreground">Comments Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto text-warning mb-2" />
            <div className="text-2xl font-bold text-government-navy">2.4K</div>
            <p className="text-sm text-muted-foreground">Community Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Community Posts */}
      <div className="space-y-6">
        {communityPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar>
                    <AvatarFallback className={post.isOfficial ? "bg-government-blue text-white" : "bg-accent"}>
                      {post.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      {post.trending && (
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{post.description}</CardDescription>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>{post.author}</span>
                        {post.isOfficial && (
                          <Badge variant="outline" className="text-xs bg-government-light">
                            Official
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {post.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.timeAgo}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Voting and Comments */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(post.id, 'up')}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {post.upvotes}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVote(post.id, 'down')}
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      {post.downvotes}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {post.comments.length} Comments
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {selectedPost === post.id && (
                <div className="space-y-4 pt-4 border-t">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={comment.isOfficial ? "bg-government-blue text-white text-xs" : "bg-accent text-xs"}>
                          {comment.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          {comment.isOfficial && (
                            <Badge variant="outline" className="text-xs bg-government-light">
                              Official
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs flex items-center gap-1"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {comment.upvotes}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Comment */}
                  <div className="flex gap-3 pt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-xs">You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleComment(post.id)}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;