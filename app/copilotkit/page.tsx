"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useState } from "react";

// Type definition for image gallery cards
interface ImageGalleryCard {
  id: string;
  title: string;
  images: { url: string; caption: string }[];
}

export default function CopilotKitPage() {


  return (
    <main>
      
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Design Assistant",
          initial: "👋 Hi, there! This a design assistant. You can ask me to generate designs suggestions for your next product."
        }}
      >
        <YourMainContent />
      </CopilotSidebar>
    </main>
  );
}

function YourMainContent() {
  const [proverbs, setProverbs] = useState<string[]>(['Success is the sum of small efforts, repeated day in and day out.']);
  const [imageGalleries, setImageGalleries] = useState<ImageGalleryCard[]>([
    {
      id: "travel-destinations",
      title: "Designs",
      images: [
        {
          url: "https://picsum.photos/400/300?random=1",
          caption: "Serene mountain landscape with crystal clear lakes"
        },
        {
          url: "https://picsum.photos/400/300?random=2", 
          caption: "Tropical beach paradise with white sand"
        },
        {
          url: "https://picsum.photos/400/300?random=3",
          caption: "Ancient city architecture and historic buildings"
        },
        {
          url: "https://picsum.photos/400/300?random=4",
          caption: "Vibrant sunset over rolling hills"
        },
        {
          url: "https://picsum.photos/400/300?random=5",
          caption: "Majestic waterfall in lush forest"
        },
        {
          url: "https://picsum.photos/400/300?random=6",
          caption: "Desert dunes under starlit sky"
        }
      ]
    }
  ]);

  // 🪁 Copilot Suggestions: https://docs.copilotkit.ai/guides/copilot-suggestions
  useCopilotChatSuggestions({
    maxSuggestions: 4,
    minSuggestions: 3,
    instructions: "Give the user 4 options: 'Change theme color' (choose a random hexadecimal color), 'Write a proverb about {topic}' (choose a random topic), 'Generate a gradient card between {color1} and {color2}' (choose random hexadecimal colors), 'Create an image gallery about {topic}' (choose a random interesting topic like travel, food, nature, etc.), or 'Generate random fake images with {theme} theme' (choose themes like abstract, nature, technology, art, etc.)",
  })

  // 🪁 Frontend Readables: https://docs.copilotkit.ai/guides/connect-your-data/frontend
  useCopilotReadable({
    description: "The current list of proverbs",
    value: proverbs,
  })

  useCopilotReadable({
    description: "The current list of image gallery cards",
    value: imageGalleries,
  })

  // 🪁 Frontend Tools: https://docs.copilotkit.ai/guides/frontend-actions
  useCopilotAction({
    name: "addProverb",
    parameters: [{
      name: "proverb",
      description: "The proverb to add. Make it witty, short and concise.",
      required: true,
    }],
    handler: ({ proverb }) => {
      setProverbs([...proverbs, proverb]);
    },
  });

  //🪁 Generative UI: https://docs.copilotkit.ai/guides/generative-ui
  useCopilotAction({
    name: "generateGradientCard",
    description: "Generate a card with a card with a background gradient between two colors.",
    parameters: [
      { name: "color1", type: "string", required: true },
      { name: "color2", type: "string", required: true },
    ],
    render: ({ args }) => {
      return (
        <div 
          style={{ background: `linear-gradient(to right, ${args.color1}, ${args.color2})`}} 
          className="p-10 my-4 rounded-xl flex flex-col justify-between flex-row"
        >
          <p className="text-white/50">{args.color1}</p>
          <p className="text-white/60">{args.color2}</p>
        </div>
      );
    },
  });

  // 🪁 New Image Gallery Action
  useCopilotAction({
    name: "createImageGallery",
    description: "Create an image gallery card with multiple images and captions for each image.",
    parameters: [
      { 
        name: "title", 
        type: "string", 
        description: "The title of the image gallery",
        required: true 
      },
      { 
        name: "images", 
        type: "object[]", 
        description: "Array of image objects with url and caption properties. Use placeholder images from unsplash or similar services.",
        required: true 
      },
    ],
    handler: ({ title, images }) => {
      const newGallery: ImageGalleryCard = {
        id: Date.now().toString(),
        title,
        images: images as { url: string; caption: string }[],
      };
      setImageGalleries([...imageGalleries, newGallery]);
    },
  });

  // 🪁 Generate Random Fake Images Action
  useCopilotAction({
    name: "generateRandomImages",
    description: "Generate a gallery with random fake placeholder images. Great for testing and demonstrations.",
    parameters: [
      { 
        name: "theme", 
        type: "string", 
        description: "Theme for the image gallery (e.g., 'abstract', 'nature', 'technology', 'art')",
        required: true 
      },
      { 
        name: "count", 
        type: "number", 
        description: "Number of images to generate (1-12)",
        required: false 
      },
    ],
    handler: ({ theme, count = 6 }) => {
      const imageCount = Math.min(Math.max(count, 1), 12); // Limit between 1-12
      const randomImages = Array.from({ length: imageCount }, (_, index) => ({
        url: `https://picsum.photos/400/300?random=${Date.now()}-${index}`,
        caption: `${theme} themed image ${index + 1} - Generated placeholder content`
      }));

      const newGallery: ImageGalleryCard = {
        id: Date.now().toString(),
        title: `Random ${theme.charAt(0).toUpperCase() + theme.slice(1)} Gallery`,
        images: randomImages,
      };
      setImageGalleries([...imageGalleries, newGallery]);
    },
  });

  return (
    <div
      className="h-screen w-full flex justify-center items-center flex-col transition-colors duration-300 overflow-y-auto py-8"
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-4xl w-full mx-4">
        <h1 className="text-4xl font-bold text-black mb-2 text-center">Gallery</h1>
        {/* <p className="text-gray-800 text-center italic mb-6">This is a demonstrative page with image galleries and proverbs! 🪁</p> */}
        <hr className="border-white/20 my-6" />
        
        {/* Image Galleries Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-6">
              {imageGalleries.map((gallery) => (
                <div 
                  key={gallery.id} 
                  className="bg-white/15 p-6 rounded-xl text-black relative group hover:bg-white/20 transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{gallery.title}</h3>
                    <button 
                      onClick={() => setImageGalleries(imageGalleries.filter(g => g.id !== gallery.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity 
                        bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.images.map((image, index) => (
                      <div key={index} className="bg-white/10 rounded-lg overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.caption}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            // Fallback for broken images
                            (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x200/6366f1/ffffff?text=${encodeURIComponent(image.caption)}`;
                          }}
                        />
                        <div className="p-3">
                          <p className="text-sm text-black/90">{image.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-white/20 my-6" />
          </div>
        

        {/* Empty state when no content */}
        {imageGalleries.length === 0 && proverbs.length === 0 && (
          <p className="text-center text-black/80 italic my-8">
            No content yet. Ask the assistant to create image galleries or add proverbs!
          </p>
        )}
      </div>
    </div>
  );
}
