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

/** Temporary placeholder photo (picsum.photos, stable per seed). Swap for real project images. */
export const thumb = (seed: string, w = 800, h = 560) => `https://picsum.photos/seed/yexora-${seed}/${w}/${h}`;

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
        { title: "Training Simulation", image: thumb("vr-1") },
        { title: "Virtual Walkthrough", image: thumb("vr-2") },
      ],
    },
    {
      title: "3D Modeling & Visualization",
      description:
        "3D assets, animation, and real-time WebGL product visualizers for real estate, manufacturing, and retail.",
      works: [
        { title: "Product Visualizer", image: thumb("3d-1") },
        { title: "Architectural Render", image: thumb("3d-2") },
      ],
    },
    {
      title: "Web Development",
      description:
        "High-performance, SEO-focused websites and custom web apps — SaaS platforms, admin dashboards, and API integrations built to scale in the cloud.",
      works: [
        { title: "Brand Portal", image: thumb("web-1") },
        { title: "Operations Dashboard", image: thumb("app-1") },
      ],
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform iOS and Android apps, from first prototype to store launch and ongoing updates.",
      works: [
        { title: "Field Service App", image: thumb("mobile-1") },
        { title: "Booking App", image: thumb("mobile-2") },
      ],
    },
    {
      title: "AI & Data Solutions",
      description:
        "Machine learning, computer vision, data analytics, and automation that turn your data into decisions.",
      works: [
        { title: "Vision Inspection", image: thumb("ai-1") },
        { title: "Insights Dashboard", image: thumb("ai-2") },
      ],
    },
    {
      title: "Cloud, DevOps & Security",
      description:
        "Cloud architecture, CI/CD pipelines, monitoring, and cybersecurity that keep your products fast and safe.",
      works: [
        { title: "Cloud Migration", image: thumb("cloud-1") },
        { title: "Release Pipeline", image: thumb("cloud-2") },
      ],
    },
    {
      title: "UI/UX Design",
      description:
        "Research-led interface and experience design for web, mobile, and immersive products, from wireframes to design systems.",
      works: [
        { title: "Design System", image: thumb("ux-1") },
        { title: "App Redesign", image: thumb("ux-2") },
      ],
    },
  ] satisfies Service[],
} as const;

/** Service names, used by the contact form's "What do you need?" dropdown */
export const SERVICES: string[] = SERVICES_CONTENT.items.map((s) => s.title);
