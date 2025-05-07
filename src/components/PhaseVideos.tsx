
import { VideoPlayer } from "@/components/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

interface PhaseVideo {
  title: string;
  description: string;
  src: string;
}

const phaseVideos: Record<Phase, PhaseVideo[]> = {
  menstruation: [
    {
      title: "Understanding Your Menstruation Phase",
      description: "Learn about the biological processes and best self-care practices during your period.",
      src: "https://player.vimeo.com/external/454631640.sd.mp4?s=ac81ffbe0ee0a8f55adeae491929eb9055daa45d&profile_id=164&oauth2_token_id=57447761"
    },
    {
      title: "Nutrition Tips During Menstruation",
      description: "Foods that can help with cramps, bloating, and energy levels.",
      src: "https://player.vimeo.com/external/499295354.sd.mp4?s=464e8e3d5cd8317bfc4c7537696d7732fb90b0e7&profile_id=164&oauth2_token_id=57447761"
    }
  ],
  follicular: [
    {
      title: "Follicular Phase Explained",
      description: "Understanding the hormonal changes and energy boost of your follicular phase.",
      src: "https://player.vimeo.com/external/487100789.sd.mp4?s=da20787802b01b41319b3047e72e89aeb079baba&profile_id=164&oauth2_token_id=57447761"
    },
    {
      title: "Exercise Recommendations for Follicular Phase",
      description: "Best workouts to align with your body's energy levels during this phase.",
      src: "https://player.vimeo.com/external/463452753.sd.mp4?s=0651d3d35c17225d8fa467a89059013be48f515f&profile_id=164&oauth2_token_id=57447761"
    }
  ],
  ovulatory: [
    {
      title: "Maximize Your Ovulatory Phase",
      description: "How to leverage your peak energy and confidence during ovulation.",
      src: "https://player.vimeo.com/external/446766811.sd.mp4?s=94f76ef3a62772554231c4c6096f8b9416e9ee58&profile_id=164&oauth2_token_id=57447761"
    },
    {
      title: "Social Connection During Ovulation",
      description: "Why you may feel more social during this phase and how to use it to your advantage.",
      src: "https://player.vimeo.com/external/475517975.sd.mp4?s=3d2b5eac2228e27c80b46c47d226b3bd8d19e420&profile_id=164&oauth2_token_id=57447761"
    }
  ],
  luteal: [
    {
      title: "Navigating Your Luteal Phase",
      description: "Understanding the shifts in mood and energy as progesterone rises.",
      src: "https://player.vimeo.com/external/456465570.sd.mp4?s=a9fdcb24064ec10c16e5ff84c58941eb2f0885ad&profile_id=164&oauth2_token_id=57447761"
    },
    {
      title: "Self-Care Practices for PMS",
      description: "Techniques to manage PMS symptoms and practice self-compassion.",
      src: "https://player.vimeo.com/external/495254135.sd.mp4?s=1eb70a9d7ab9de8644abe9798c15988f02eb4872&profile_id=164&oauth2_token_id=57447761"
    }
  ]
};

export const PhaseVideos = ({ phase = "menstruation" }: { phase?: Phase }) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Educational Videos</h2>
      
      <Tabs defaultValue={phase}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="menstruation" className="text-xs sm:text-sm">Menstruation</TabsTrigger>
          <TabsTrigger value="follicular" className="text-xs sm:text-sm">Follicular</TabsTrigger>
          <TabsTrigger value="ovulatory" className="text-xs sm:text-sm">Ovulatory</TabsTrigger>
          <TabsTrigger value="luteal" className="text-xs sm:text-sm">Luteal</TabsTrigger>
        </TabsList>
        
        {Object.entries(phaseVideos).map(([phaseKey, videos]) => (
          <TabsContent key={phaseKey} value={phaseKey} className="space-y-6">
            {videos.map((video, index) => (
              <VideoPlayer
                key={index}
                src={video.src}
                title={video.title}
                description={video.description}
                controls={true}
                className="shadow-md"
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
