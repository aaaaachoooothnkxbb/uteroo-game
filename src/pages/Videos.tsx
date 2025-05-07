
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoCategory {
  title: string;
  videos: {
    title: string;
    description: string;
    src: string;
    thumbnail?: string;
  }[];
}

const videoCategories: VideoCategory[] = [
  {
    title: "Educational",
    videos: [
      {
        title: "Understanding Your Cycle",
        description: "Learn about the four phases of the menstrual cycle and how they affect your body.",
        src: "https://player.vimeo.com/external/517177560.sd.mp4?s=ccc7ecc16eaef12b89a8856fa6e5455c893c371b&profile_id=164&oauth2_token_id=57447761"
      },
      {
        title: "Hormone Health 101",
        description: "Basic introduction to hormones and their role in the menstrual cycle.",
        src: "https://player.vimeo.com/external/377769527.sd.mp4?s=29fe5b1fbb5b6b66845778269f1b034406705286&profile_id=164&oauth2_token_id=57447761"
      }
    ]
  },
  {
    title: "Recipes",
    videos: [
      {
        title: "Menstruation Phase Recipes",
        description: "Simple and nutritious recipes to support your body during menstruation.",
        src: "https://player.vimeo.com/external/487100789.sd.mp4?s=da20787802b01b41319b3047e72e89aeb079baba&profile_id=164&oauth2_token_id=57447761"
      },
      {
        title: "Follicular Phase Nutrition",
        description: "Foods to boost your energy during the follicular phase.",
        src: "https://player.vimeo.com/external/463452753.sd.mp4?s=0651d3d35c17225d8fa467a89059013be48f515f&profile_id=164&oauth2_token_id=57447761"
      }
    ]
  },
  {
    title: "Yoga & Movement",
    videos: [
      {
        title: "Gentle Yoga for Menstruation",
        description: "Soothing yoga poses to ease discomfort during your period.",
        src: "https://player.vimeo.com/external/454631640.sd.mp4?s=ac81ffbe0ee0a8f55adeae491929eb9055daa45d&profile_id=164&oauth2_token_id=57447761"
      },
      {
        title: "Energizing Yoga for Follicular Phase",
        description: "Dynamic yoga practice to match your rising energy.",
        src: "https://player.vimeo.com/external/499295354.sd.mp4?s=464e8e3d5cd8317bfc4c7537696d7732fb90b0e7&profile_id=164&oauth2_token_id=57447761"
      }
    ]
  },
  {
    title: "Self-Care",
    videos: [
      {
        title: "Mindfulness for PMS",
        description: "Meditation and mindfulness practices to manage mood changes.",
        src: "https://player.vimeo.com/external/475517975.sd.mp4?s=3d2b5eac2228e27c80b46c47d226b3bd8d19e420&profile_id=164&oauth2_token_id=57447761"
      },
      {
        title: "Sleep Hygiene Tips",
        description: "Improve your sleep quality throughout your cycle.",
        src: "https://player.vimeo.com/external/456465570.sd.mp4?s=a9fdcb24064ec10c16e5ff84c58941eb2f0885ad&profile_id=164&oauth2_token_id=57447761"
      }
    ]
  }
];

const Videos = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    description: string;
    src: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Educational Videos</h1>
        </div>

        {selectedVideo ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedVideo(null)}
            >
              Back to Videos
            </Button>
            <VideoPlayer
              src={selectedVideo.src}
              title={selectedVideo.title}
              description={selectedVideo.description}
              controls={true}
              width="100%"
              height="auto"
              className="max-w-4xl mx-auto"
            />
          </div>
        ) : (
          <Tabs defaultValue="Educational">
            <TabsList className="mb-8">
              {videoCategories.map((category) => (
                <TabsTrigger key={category.title} value={category.title}>
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {videoCategories.map((category) => (
              <TabsContent key={category.title} value={category.title}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.videos.map((video, index) => (
                    <Card 
                      key={index} 
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                        {/* Video Thumbnail Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">{video.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Videos;
