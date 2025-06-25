import { type Frames } from "@/components/motion-grid";

// Progressive loading messages that get more encouraging over time
export const loadingMessages = [
  "Fetching content from URL...",
  "Reading through the website...",
  "Extracting the good stuff...",
  "Processing the content...",
  "Almost there, hang tight...",
  "Just a few more seconds...",
  "Making sure everything's perfect...",
  "This is taking longer than usual...",
  "Still working on it, promise...",
  "Thanks for your patience...",
  "Almost done, really this time..."
];

// Animated loading frames for fetching content
export const searchingFrames = [
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [2, 2],
  ],
  [
    [3, 0],
    [2, 1],
    [3, 1],
    [4, 1],
    [3, 2],
  ],
  [
    [3, 1],
    [2, 2],
    [3, 2],
    [4, 2],
    [3, 3],
  ],
  [
    [3, 2],
    [2, 3],
    [3, 3],
    [4, 3],
    [3, 4],
  ],
  [
    [1, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [1, 4],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [],
] as Frames; 