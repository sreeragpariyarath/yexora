// Services shown in the Services section and offered in the contact form's dropdown.
// Game development and training/internships for students are intentionally left out.

export interface ServiceWork {
  title: string;
  image: string;
}

export interface Service {
  title: string;
  description: string;
  works: ServiceWork[];
}

/**
 * A project image from public/images/web/: 1280px WebP copies (about 100 KB each) of the
 * owner's PNGs, which aren't kept in the repo (images aren't optimised in the static export).
 * Name = the image's name, lower-case, dashes for spaces.
 */
export const projectImage = (name: string) => `/images/web/${name}.webp`;

export const SERVICES_CONTENT = {
  index: "04",
  label: "Services",
  watermark: "/what we do",
  title: "services",
  items: [
    {
      title: "Virtual Reality & AR",
      description:
        "Interactive virtual environments, digital twins, and enterprise VR training for industrial, medical, and educational teams.",
      works: [
        { title: "Training Simulation", image: projectImage("training-simulation") },
        { title: "Virtual Walkthrough", image: projectImage("virtual-walkthrough") },
      ],
    },
    {
      title: "3D Modeling & Visualization",
      description:
        "3D assets, animation, and real-time WebGL product visualizers for real estate, manufacturing, and retail.",
      works: [
        { title: "Product Visualizer", image: projectImage("product-visualizer") },
        { title: "Architectural Render", image: projectImage("architectural-render") },
      ],
    },
    {
      title: "Web Development",
      description:
        "High-performance, SEO-focused websites and custom web apps — SaaS platforms, admin dashboards, and API integrations built to scale in the cloud.",
      works: [
        { title: "Brand Portal", image: projectImage("brand-portal") },
        { title: "Operations Dashboard", image: projectImage("operations-dashboard") },
      ],
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform iOS and Android apps, from first prototype to store launch and ongoing updates.",
      works: [
        { title: "Field Service App", image: projectImage("field-service-app") },
        { title: "Booking App", image: projectImage("booking-app") },
      ],
    },
    
    {
      title: "UI/UX Design",
      description:
        "Research-led interface and experience design for web, mobile, and immersive products, from wireframes to design systems.",
      works: [
        { title: "Design System", image: projectImage("design-system") },
        { title: "App Redesign", image: projectImage("app-redesign") },
      ],
    },
  ] satisfies Service[],
} as const;

/** Service names, used by the contact form's "What do you need?" dropdown */
export const SERVICES: string[] = SERVICES_CONTENT.items.map((s) => s.title);
