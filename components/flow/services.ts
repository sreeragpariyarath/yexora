// Services shown in the Services section and offered in the contact form's dropdown.
// Game development and training/internships for students are intentionally left out.

export interface ServiceWork {
  title: string;
  meta: string;
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
        { title: "Training Simulation", meta: "VR / Concept", image: thumb("vr-1") },
        { title: "Virtual Walkthrough", meta: "AR / Concept", image: thumb("vr-2") },
      ],
    },
    {
      title: "3D Modeling & Visualization",
      description:
        "3D assets, animation, and real-time WebGL product visualizers for real estate, manufacturing, and retail.",
      works: [
        { title: "Product Visualizer", meta: "WebGL / Concept", image: thumb("3d-1") },
        { title: "Architectural Render", meta: "3D / Concept", image: thumb("3d-2") },
      ],
    },
    {
      title: "Website Development",
      description:
        "High-performance, SEO-focused business and enterprise websites with interactive, animated experiences.",
      works: [
        { title: "Brand Portal", meta: "Web / Concept", image: thumb("web-1") },
        { title: "Launch Microsite", meta: "Web / Concept", image: thumb("web-2") },
      ],
    },
    {
      title: "Web Application Development",
      description:
        "Custom web apps, SaaS platforms, admin dashboards, and API integrations built to scale in the cloud.",
      works: [
        { title: "Operations Dashboard", meta: "SaaS / Concept", image: thumb("app-1") },
        { title: "Client Portal", meta: "Web App / Concept", image: thumb("app-2") },
      ],
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform iOS and Android apps, from first prototype to store launch and ongoing updates.",
      works: [
        { title: "Field Service App", meta: "Mobile / Concept", image: thumb("mobile-1") },
        { title: "Booking App", meta: "iOS & Android / Concept", image: thumb("mobile-2") },
      ],
    },
    {
      title: "AI & Data Solutions",
      description:
        "Machine learning, computer vision, data analytics, and automation that turn your data into decisions.",
      works: [
        { title: "Vision Inspection", meta: "AI / Concept", image: thumb("ai-1") },
        { title: "Insights Dashboard", meta: "Data / Concept", image: thumb("ai-2") },
      ],
    },
    {
      title: "Cloud, DevOps & Security",
      description:
        "Cloud architecture, CI/CD pipelines, monitoring, and cybersecurity that keep your products fast and safe.",
      works: [
        { title: "Cloud Migration", meta: "Cloud / Concept", image: thumb("cloud-1") },
        { title: "Release Pipeline", meta: "DevOps / Concept", image: thumb("cloud-2") },
      ],
    },
    {
      title: "UI/UX Design",
      description:
        "Research-led interface and experience design for web, mobile, and immersive products, from wireframes to design systems.",
      works: [
        { title: "Design System", meta: "UI / Concept", image: thumb("ux-1") },
        { title: "App Redesign", meta: "UX / Concept", image: thumb("ux-2") },
      ],
    },
  ] satisfies Service[],
} as const;

/** Service names, used by the contact form's "What do you need?" dropdown */
export const SERVICES: string[] = SERVICES_CONTENT.items.map((s) => s.title);
