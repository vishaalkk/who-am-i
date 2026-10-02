
export type Project = {
  title: string;
  description: string;
  link: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Books of Disquiet",
    description: "My personal book collection.",
    link: "https://booksofdisquiet.com",
    image: "/og/booksofdisquiet.png"
  },
  {
    title: "Where is Vishal?",
    description: "A real-time experiment in presence and digital footprint.",
    link: "https://whereisvishal.com",
    image: "/og/whereisvishal.png"
  },
  {
    title: "Hold My Guinness",
    description: "A lighthearted pursuit of the perfect pint and Irish culture.",
    link: "https://holdmyguinness.com"
  },
  {
    title: "Qavvali",
    description: "An exploration of the history, poetry, and soul of Qawwali music.",
    link: "https://qavvali.com"
  },
  {
    title: "Columbia Urdu Poetry Group",
    description: "An archive of our weekly poetry readings.",
    link: "https://www.columbiaurdupoetrygroup.com/v2/"
  },
  {
    title: "Bahr",
    description: "An interactive guide and scansion tool for Urdu poetry meter (bahr).",
    link: "https://urdubahr.com/",
    image: "/og/urdubahr.png"
  }
];
