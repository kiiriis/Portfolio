/**
 * Seeds the portfolio with Krish Makadia's real content (faithful to his résumé).
 * Idempotent: uses deterministic ids so re-running updates rather than duplicates.
 * Content only — run `npm run embeddings:rebuild` afterward (with OPENAI_API_KEY set)
 * to (re)generate the RAG index.
 */
import { config } from "dotenv";
config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PROFILE = {
  id: "singleton",
  name: "Krish Makadia",
  headline:
    "MS CS @ Stony Brook · AI/ML, Distributed Systems & Full-Stack Engineer",
  heroTagline:
    "I build AI/ML that actually ships, distributed systems that survive failure, and full-stack apps people enjoy using — including the slightly over-confident chatbot in the bottom-right corner.",
  aboutMd: `I'm a freshly-minted MS in Computer Science from **Stony Brook University** (Class of 2026), happiest at the intersection of *"is this fast?"* and *"is this actually smart?"* — which usually means **AI/ML** and **distributed systems** showing up in the same sentence.

On the **AI/ML** side: I trained **U-Net** models on **1.2 TB/day** of satellite imagery at **ISRO**, ship LLM-powered tools, and have built enough **RAG** pipelines that standing up a chatbot is now an afternoon's work. Exhibit A is floating in the bottom-right of this page — go ahead, grill it about me. It knows my projects better than I do at 3 a.m.

On the **systems** side: my research rebuilt replication for **Mako**, a geo-replicated key-value store, in **C++ Raft** and pushed it to **526K committed transactions/second** (I celebrated every 10K like a personal record). And as a full-stack engineer at Stony Brook's Web Dev department I've shipped 50+ production apps — React/Next.js up front, Node/Go/Python behind, and the unglamorous glue (auth, CI/CD, observability) that keeps things alive past 2 a.m.

Basically, I like building things end to end — from a consensus protocol to a button that feels good to click. If it involves **AI/ML, distributed systems, or a tasteful amount of over-engineering**, count me in.`,
  location: "New York, NY",
  email: "makadiakrish@gmail.com",
  githubUrl: "https://github.com/kiiriis",
  linkedinUrl: "https://linkedin.com/in/kmakadia",
  resumeUrl:
    "https://drive.google.com/file/d/1vNK1T5dmjgD74nR042U1O4oMtACBr3sp/view?usp=drive_link",
};

type ExpDef = {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  techTags: string[];
  sortOrder: number;
  bullets: string[];
};

const EXPERIENCES: ExpDef[] = [
  {
    id: "exp-webdev",
    role: "Full-Stack Software Engineering Intern",
    organization: "Stony Brook University — Web Dev Department",
    location: "Stony Brook, NY",
    startDate: "Jan 2026",
    endDate: null,
    summary:
      "Building production web solutions for university departments end to end.",
    techTags: ["React", "Node.js", "TypeScript", "REST APIs"],
    sortOrder: 0,
    bullets: [
      "Delivered 50+ production web solutions for university departments, turning stakeholder requests into reusable React components, Node.js workflows, API integrations, and release-ready deployments.",
      "Built shared component libraries, responsive layouts, form handlers, validation flows, and integration endpoints, reducing repeat implementation time by 35% across recurring launch patterns.",
      "Standardized accessibility, SEO, analytics instrumentation, release checklists, and stakeholder QA notes, cutting review cycles by 30% for high-visibility communications.",
    ],
  },
  {
    id: "exp-dsl",
    role: "Graduate Research Assistant — Distributed Systems",
    organization: "Stony Brook University — Distributed Systems Lab",
    location: "Stony Brook, NY",
    startDate: "Jan 2025",
    endDate: "May 2026",
    summary:
      "High-performance Raft replication research for the Mako geo-replicated key-value store.",
    techTags: ["C++", "Raft", "gRPC", "Distributed Systems"],
    sortOrder: 1,
    bullets: [
      "Replaced Paxos replication in a geo-replicated key-value store with a C++ Raft backend, reaching 510K committed transactions/s versus 472K for Paxos in 11-worker benchmarks.",
      "Separated commit from replay in a shared-log Raft design, ingesting all 11 worker lanes at 526K transactions/s while keeping follower replay within 5% of leader throughput.",
      "Built parallel follower replay workers that raised throughput from 143K to 499K transactions/s and validated the design under a simulated Cloud-SSD model near 340K transactions/s.",
    ],
  },
  {
    id: "exp-isro",
    role: "Software Engineering Intern — Data Infrastructure / Remote-Sensing ML",
    organization: "Indian Space Research Organisation (ISRO)",
    location: "Ahmedabad, India",
    startDate: "Dec 2023",
    endDate: "May 2024",
    summary:
      "Large-scale satellite-imagery pipelines and deep-learning models for vegetation monitoring.",
    techTags: ["Python", "U-Net", "Docker", "CI/CD", "MLOps"],
    sortOrder: 2,
    bullets: [
      "Engineered a parallel Python pipeline to process 1.2 TB/day of satellite imagery, cutting per-image runtime by 66% through chunked processing, reusable stages, and optimized batch execution.",
      "Trained and evaluated a U-Net model for NDVI reconstruction on 1.2 TB of Sentinel-2 imagery, outperforming the Prithvi-100m baseline by 25% for vegetation and agricultural monitoring.",
      "Packaged and deployed containerized batch inference with Docker and CI/CD, adding output validation and run-level monitoring to reach a 99.5% successful batch completion rate.",
    ],
  },
  {
    id: "exp-matrix",
    role: "Internship Trainee",
    organization: "Matrix Comsec",
    location: "Vadodara, India",
    startDate: "May 2023",
    endDate: "Aug 2023",
    summary:
      "End-to-end face authentication system — from model training to low-latency serving.",
    techTags: ["PyTorch", "Python", "Computer Vision", "REST APIs", "Docker", "Linux"],
    sortOrder: 3,
    bullets: [
      "Built an end-to-end face authentication system using PyTorch for model training and backend microservices for real-time enrollment, verification, and inference serving.",
      "Developed REST API services to connect the trained authentication model with production backend systems, enabling low-latency request handling at 100+ requests/sec with sub-40 ms latency.",
      "Designed a synthetic data generation and training pipeline with 10,000+ augmented face images, reducing manual labeling effort by 80% and improving model robustness.",
      "Optimized the model serving path across preprocessing, inference, caching, and API layers, improving recognition accuracy by 23% while maintaining reliable service availability.",
    ],
  },
];

const EDUCATION = [
  {
    id: "edu-sbu",
    degree: "M.S. in Computer Science",
    institution: "Stony Brook University",
    location: "Stony Brook, NY",
    gpa: "3.83 / 4.0",
    startDate: "Aug 2024",
    endDate: "May 2026",
    details:
      "Focus on distributed systems and high-performance computing. Master's thesis: High-Performance Raft Replication for Mako.",
    sortOrder: 0,
  },
  {
    id: "edu-ddu",
    degree: "B.Tech in Computer Engineering",
    institution: "Dharmsinh Desai University",
    location: "Nadiad, India",
    gpa: "8.99 / 10 (Top 5%)",
    startDate: "Oct 2020",
    endDate: "May 2024",
    details: null as string | null,
    sortOrder: 1,
  },
];

type ProjDef = {
  title: string;
  tagline: string;
  description: string;
  techTags: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  featured: boolean;
  sortOrder: number;
};

const PROJECTS: ProjDef[] = [
  {
    title: "Mako — High-Performance Raft Replication",
    tagline:
      "Master's thesis: a C++ Raft backend hitting 526K committed transactions/second.",
    description: `My Master's thesis at Stony Brook's Distributed Systems Lab. I redesigned replication for **Mako**, a geo-replicated key-value store, replacing its Paxos layer with a custom **C++ Raft** implementation.

Key results:
- **526K committed transactions/s** via a shared-log design that separates commit from replay.
- Outperformed the original Paxos path (**510K vs 472K** txns/s) in 11-worker benchmarks.
- Parallel follower-replay workers raised throughput from **143K to 499K** txns/s while keeping followers within 5% of leader throughput.
- Validated under a simulated Cloud-SSD model at ~340K txns/s.`,
    techTags: ["C++", "Raft", "gRPC", "Shared Log", "Distributed Systems"],
    category: "Research",
    liveUrl: "https://tinyurl.com/KrishMakadiaThesis",
    featured: true,
    sortOrder: 0,
  },
  {
    title: "Kite",
    tagline:
      "Production-grade Rust node agent that runs containerized jobs over gRPC.",
    description: `A Linux **node agent written in Rust** that accepts containerized job requests over gRPC, executes them in Docker, captures stdout/stderr, persists task state in PostgreSQL, and exposes Prometheus metrics — modeling a real infrastructure component for distributed job execution.

- gRPC \`EnqueueJob\` / \`GetTaskStatus\` RPCs with a full task state machine (QUEUED → RUNNING → RETRYING → SUCCEEDED/FAILED/TIMED_OUT).
- Concurrent execution with configurable max concurrency, full log capture, and task-event persistence.
- Load tested at 500 jobs with **p95 status reads under 24 ms**; Prometheus metrics for queue depth and latency.`,
    techTags: ["Rust", "gRPC", "Docker", "PostgreSQL", "Tokio", "Prometheus"],
    category: "Distributed Systems",
    githubUrl: "https://github.com/kiiriis",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "JobFlow",
    tagline:
      "AI-powered job scanner that scores roles and auto-tailors your résumé.",
    description: `Automated job aggregation and scoring system that scans LinkedIn, Lever, Greenhouse, Ashby, and GitHub **hourly** via GitHub Actions, then ranks each role 0–100% against your tech stack with a multi-signal scoring engine.

- 8-source aggregation with keyword, synergy, level, experience-fit, and H1B-sponsorship signals.
- **Claude-powered résumé tailoring** that rewrites a LaTeX résumé per job description.
- Real-time dark-mode dashboard; kept alive on Render's free tier via scheduled GitHub Actions pings.`,
    techTags: ["Python", "Flask", "Claude API", "GitHub Actions", "PostgreSQL"],
    category: "AI / Automation",
    liveUrl: "https://jobflow.onrender.com",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "FinalShowdown",
    tagline:
      "A collaborative job-search tracker with a live leaderboard for a group of friends.",
    description: `A shared job-application dashboard where a group tracks applications together: shared openings, per-person status pills, a real-time leaderboard, referral-request flagging, and a 90-day KPI timeline.

- Built on **Next.js 15 + React 19 + Prisma + Neon Postgres**, with NextAuth (Google) invite-only auth.
- Recharts visualizations, Framer Motion animations, keyboard shortcuts, and idempotent CSV import from the original spreadsheet.
- Deployed on Render.`,
    techTags: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
    ],
    category: "Web App",
    featured: true,
    sortOrder: 3,
  },
  {
    title: "Harbor",
    tagline: "A fault-tolerant background job queue deployed on AWS ECS.",
    description: `A reliable background job queue with retries, idempotency keys, dead-letter handling, and worker heartbeats — processing **1K+ jobs/min with p95 enqueue latency under 80 ms**.

Deployed on AWS ECS with Terraform, health checks, and queue-depth metrics; kept workers healthy through 99.5% of load-test intervals.`,
    techTags: ["Go", "Redis", "PostgreSQL", "Docker", "AWS ECS", "Terraform"],
    category: "Distributed Systems",
    featured: false,
    sortOrder: 4,
  },
  {
    title: "Flare",
    tagline: "A feature-flag control plane with rollouts, targeting, and audit logs.",
    description: `A feature-flag service with environment-based rollouts, targeting rules, audit logs, and rollback APIs — serving **1K+ concurrent requests at p95 ~100 ms**.

A React dashboard plus a Redis-backed evaluation cache cut repeated database reads by 40% and enabled rollbacks in under 5 minutes.`,
    techTags: ["React", "Node.js", "PostgreSQL", "Redis", "REST APIs"],
    category: "Web App",
    featured: false,
    sortOrder: 5,
  },
  {
    title: "AgenticEval",
    tagline: "A multi-agent framework for evaluating LLM prompts and models.",
    description: `A multi-agent evaluation framework with planner, executor, and judge agents for testing prompts and models across reasoning, factuality, and safety.

Trace persistence, scoring dashboards, regression suites, and failure-cluster reports for **1K+ test cases per run**, cutting prompt-iteration time by 30–40%.`,
    techTags: ["Python", "LangGraph", "FastAPI", "OpenAI API", "PostgreSQL"],
    category: "AI / ML",
    featured: false,
    sortOrder: 6,
  },
  {
    title: "Planscape",
    tagline: "Turns plain-English project plans into editable dependency graphs.",
    description: `An AI planning workspace that converts plain-English plans into editable dependency graphs using LLM tool actions, React Flow, and dagre auto-layout.

Redis-backed MCP memory, graph-diff validation, and ok/warning/error annotations reduced repeated dependency mistakes by 35% across sample planning checks.`,
    techTags: ["React", "React Flow", "Claude API", "Redis", "Docker", "MCP"],
    category: "AI / ML",
    featured: false,
    sortOrder: 7,
  },
  {
    title: "CareConsole",
    tagline: "A patient-centered health dashboard with statistical flare detection.",
    description: `A health dashboard with baseline setup, daily symptom logging, trend charts, and disease-specific seed data.

Implements **Z-score, EWMA, and composite-score** flare detection plus LLM-generated health reports that surface driver symptoms — reducing manual report drafting by 40% in test workflows.`,
    techTags: ["React", "Node.js", "OpenAI API", "Qdrant", "Recharts"],
    category: "AI / ML",
    featured: false,
    sortOrder: 8,
  },
  {
    title: "CampusBites",
    tagline:
      "A MERN food-ordering app that kills the campus canteen queue — order from your table, get pinged when it's ready.",
    description: `A full-stack **MERN** application built to solve real-life chaos in college canteens: students order directly from their table and get real-time notifications the moment an order is ready, cutting crowding and boosting vendor throughput.

- Real-time menu with item availability and estimated prep times.
- Order status tracking (**Preparing → Ready**) with instant notifications.
- Admin panel for menu management and sales analytics.
- JWT-based auth, multiple payment options, and a mobile-first responsive UI.`,
    techTags: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "REST APIs"],
    category: "Web App",
    githubUrl: "https://github.com/kiiriis/CampusBites",
    featured: false,
    sortOrder: 9,
  },
  {
    title: "The 43rd Street",
    tagline:
      "A Spring Boot + MVC e-commerce platform for kitchen, garden, and office products.",
    description: `A full-stack **e-commerce platform** for kitchen, garden, and office products, built with **Java + Spring Boot** on a clean **MVC** architecture with separate customer and admin portals.

- Dual-portal design: a customer storefront plus an admin product/order management console.
- Full cart → checkout → billing workflow with careful state management.
- Email integration via **JavaMailSender** for order confirmations and registration verification.
- Out-of-stock handling, input validation, exception handling, and paginated order history.`,
    techTags: ["Java", "Spring Boot", "MySQL", "JSP", "Maven", "MVC"],
    category: "Web App",
    githubUrl: "https://github.com/kiiriis/The-43rd-Street",
    featured: false,
    sortOrder: 10,
  },
];

const SKILL_GROUPS: { category: string; names: string[] }[] = [
  {
    category: "Languages",
    names: [
      "Python",
      "Go",
      "C++",
      "Java",
      "TypeScript",
      "JavaScript",
      "Rust",
      "SQL",
      "Bash",
    ],
  },
  {
    category: "Backend & APIs",
    names: [
      "Node.js",
      "FastAPI",
      "Spring Boot",
      "Django",
      "Express.js",
      "REST APIs",
      "gRPC",
      "GraphQL",
      "WebSockets",
    ],
  },
  {
    category: "Distributed Systems",
    names: [
      "System Design",
      "Microservices",
      "Raft",
      "Paxos",
      "Apache Kafka",
      "Event-Driven Architecture",
      "Caching",
      "Load Balancing",
    ],
  },
  {
    category: "Databases & Storage",
    names: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "DynamoDB",
      "Elasticsearch",
      "pgvector",
      "Qdrant",
    ],
  },
  {
    category: "Machine Learning",
    names: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "Keras",
      "Hugging Face",
      "XGBoost",
      "OpenCV",
      "Computer Vision",
      "NLP",
    ],
  },
  {
    category: "LLM & GenAI",
    names: [
      "OpenAI API",
      "Claude API",
      "LangChain",
      "LangGraph",
      "RAG",
      "Vector Search",
      "FAISS",
      "Fine-tuning",
      "Prompt Engineering",
    ],
  },
  {
    category: "MLOps & Data",
    names: [
      "MLflow",
      "Weights & Biases",
      "DVC",
      "Pandas",
      "NumPy",
      "Model Serving",
      "Experiment Tracking",
      "Data Pipelines",
    ],
  },
  {
    category: "Cloud, DevOps & Observability",
    names: [
      "AWS",
      "GCP",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "CI/CD",
      "Linux",
      "NGINX",
      "Prometheus",
      "Grafana",
    ],
  },
];

async function main() {
  console.log("Seeding portfolio content…");

  // Profile
  await prisma.profile.upsert({
    where: { id: PROFILE.id },
    update: PROFILE,
    create: PROFILE,
  });
  console.log("✓ profile");

  // Experiences + bullets
  for (const exp of EXPERIENCES) {
    const { bullets, ...fields } = exp;
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: fields,
      create: fields,
    });
    await prisma.experienceBullet.deleteMany({ where: { experienceId: exp.id } });
    await prisma.experienceBullet.createMany({
      data: bullets.map((text, i) => ({
        id: `${exp.id}-b${i}`,
        experienceId: exp.id,
        text,
        sortOrder: i,
      })),
    });
  }
  console.log(`✓ ${EXPERIENCES.length} experiences`);

  // Education
  for (const edu of EDUCATION) {
    await prisma.education.upsert({
      where: { id: edu.id },
      update: edu,
      create: edu,
    });
  }
  console.log(`✓ ${EDUCATION.length} education entries`);

  // Projects (keyed by slug)
  for (const p of PROJECTS) {
    const s = slug(p.title);
    const data = {
      slug: s,
      title: p.title,
      tagline: p.tagline,
      description: p.description,
      techTags: p.techTags,
      category: p.category,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      demoVideoUrl: p.demoVideoUrl ?? null,
      featured: p.featured,
      published: true,
      sortOrder: p.sortOrder,
    };
    await prisma.project.upsert({
      where: { slug: s },
      update: data,
      create: data,
    });
  }
  console.log(`✓ ${PROJECTS.length} projects`);

  // Skills
  await prisma.skill.deleteMany({});
  let order = 0;
  for (const group of SKILL_GROUPS) {
    for (let i = 0; i < group.names.length; i++) {
      await prisma.skill.create({
        data: {
          id: `skill-${slug(group.category)}-${slug(group.names[i])}`,
          category: group.category,
          name: group.names[i],
          sortOrder: i,
        },
      });
      order++;
    }
  }
  console.log(`✓ ${order} skills across ${SKILL_GROUPS.length} categories`);

  // Favorites — curated "Off the Clock" picks. Cover art is self-hosted in
  // /public/favorites so it never breaks. Upsert by id, so admin-added picks survive.
  const sp = (q: string) =>
    `https://open.spotify.com/search/${encodeURIComponent(q)}`;
  const FAVORITES = [
    // ---- Music ----
    {
      id: "fav-playlist",
      category: "Music",
      title: "Come back to yourself in whatever way you can",
      subtitle: "My playlist",
      note: "Rap to indie to 20-minute prog — I listen to a bit of everything. Hit play.",
      url: "https://open.spotify.com/playlist/0DOOhkLrqV8zvNh3r8kbfY",
      imageUrl: "/favorites/come-back-to-yourself.jpg",
      sortOrder: 0,
    },
    {
      id: "fav-strokes",
      category: "Music",
      title: "The Strokes",
      subtitle: "The New Abnormal",
      note: "Indie rock I keep coming back to.",
      url: sp("The Strokes"),
      imageUrl: "/favorites/the-strokes.jpg",
      sortOrder: 1,
    },
    {
      id: "fav-radiohead",
      category: "Music",
      title: "Radiohead",
      subtitle: "In Rainbows",
      note: "Endlessly listenable — every album a different mood.",
      url: sp("Radiohead"),
      imageUrl: "/favorites/radiohead.jpg",
      sortOrder: 2,
    },
    {
      id: "fav-pinkfloyd",
      category: "Music",
      title: "Pink Floyd",
      subtitle: "The Dark Side of the Moon",
      note: "Doesn't matter if the song is 20 minutes long.",
      url: sp("Pink Floyd"),
      imageUrl: "/favorites/pink-floyd.jpg",
      sortOrder: 3,
    },
    {
      id: "fav-frank-ocean",
      category: "Music",
      title: "Frank Ocean",
      subtitle: "Blonde",
      note: "A whole mood.",
      url: sp("Frank Ocean"),
      imageUrl: "/favorites/frank-ocean.jpg",
      sortOrder: 4,
    },
    {
      id: "fav-kendrick",
      category: "Music",
      title: "Kendrick Lamar",
      subtitle: "To Pimp a Butterfly",
      note: "Rap at its most ambitious.",
      url: sp("Kendrick Lamar"),
      imageUrl: "/favorites/kendrick-lamar.jpg",
      sortOrder: 5,
    },
    {
      id: "fav-fleetwood",
      category: "Music",
      title: "Fleetwood Mac",
      subtitle: "Rumours",
      note: "Never gets old.",
      url: sp("Fleetwood Mac"),
      imageUrl: "/favorites/fleetwood-mac.jpg",
      sortOrder: 6,
    },
    {
      id: "fav-zeppelin",
      category: "Music",
      title: "Led Zeppelin",
      subtitle: "Led Zeppelin IV",
      note: "Stairway to Heaven, on repeat.",
      url: sp("Led Zeppelin"),
      imageUrl: "/favorites/led-zeppelin.jpg",
      sortOrder: 7,
    },
    {
      id: "fav-eagles",
      category: "Music",
      title: "Eagles",
      subtitle: "Hotel California",
      note: "Such a lovely place.",
      url: sp("Eagles"),
      imageUrl: "/favorites/eagles.jpg",
      sortOrder: 8,
    },

    // ---- Film & TV ----
    {
      id: "fav-kiarostami",
      category: "Film & TV",
      title: "Abbas Kiarostami",
      subtitle: "Director",
      note: "Anything he's ever made — Close-Up, Taste of Cherry, Where Is the Friend's House?",
      url: "https://letterboxd.com/director/abbas-kiarostami/",
      imageUrl: "/favorites/kiarostami.jpg",
      sortOrder: 0,
    },
    {
      id: "fav-ray",
      category: "Film & TV",
      title: "Satyajit Ray",
      subtitle: "Director",
      note: "The Apu Trilogy and beyond — the giant of Indian cinema.",
      url: "https://letterboxd.com/director/satyajit-ray/",
      imageUrl: "/favorites/satyajit-ray.jpg",
      sortOrder: 1,
    },
    {
      id: "fav-scorsese",
      category: "Film & TV",
      title: "Martin Scorsese",
      subtitle: "Director",
      note: "The patron saint of cinema.",
      url: "https://letterboxd.com/director/martin-scorsese/",
      imageUrl: "/favorites/martin-scorsese.jpg",
      sortOrder: 2,
    },
    {
      id: "fav-there-will-be-blood",
      category: "Film & TV",
      title: "There Will Be Blood",
      subtitle: "Paul Thomas Anderson · 2007",
      note: "Day-Lewis at full tilt.",
      url: "https://letterboxd.com/film/there-will-be-blood/",
      imageUrl: "/favorites/there-will-be-blood.jpg",
      sortOrder: 3,
    },
    {
      id: "fav-stalker",
      category: "Film & TV",
      title: "Stalker",
      subtitle: "Andrei Tarkovsky · 1979",
      note: "Tarkovsky at his most hypnotic.",
      url: "https://letterboxd.com/film/stalker/",
      imageUrl: "/favorites/stalker.jpg",
      sortOrder: 4,
    },
    {
      id: "fav-whiplash",
      category: "Film & TV",
      title: "Whiplash",
      subtitle: "Damien Chazelle · 2014",
      note: "Not quite my tempo.",
      url: "https://letterboxd.com/film/whiplash-2014/",
      imageUrl: "/favorites/whiplash.jpg",
      sortOrder: 5,
    },
    {
      id: "fav-birdman",
      category: "Film & TV",
      title: "Birdman",
      subtitle: "Alejandro G. Iñárritu · 2014",
      note: "One unbroken, dizzying take.",
      url: "https://letterboxd.com/film/birdman/",
      imageUrl: "/favorites/birdman.jpg",
      sortOrder: 6,
    },
    {
      id: "fav-memories",
      category: "Film & TV",
      title: "Memories of Murder",
      subtitle: "Bong Joon-ho · 2003",
      note: "Bong before the world caught on.",
      url: "https://letterboxd.com/film/memories-of-murder/",
      imageUrl: "/favorites/memories-of-murder.jpg",
      sortOrder: 7,
    },
    {
      id: "fav-separation",
      category: "Film & TV",
      title: "A Separation",
      subtitle: "Asghar Farhadi · 2011",
      note: "No villains, only people.",
      url: "https://letterboxd.com/film/a-separation/",
      imageUrl: "/favorites/a-separation.jpg",
      sortOrder: 8,
    },
    {
      id: "fav-yiyi",
      category: "Film & TV",
      title: "Yi Yi",
      subtitle: "Edward Yang · 2000",
      note: "A whole life in three hours.",
      url: "https://letterboxd.com/film/yi-yi/",
      imageUrl: "/favorites/yi-yi.jpg",
      sortOrder: 9,
    },
    {
      id: "fav-12angrymen",
      category: "Film & TV",
      title: "12 Angry Men",
      subtitle: "Sidney Lumet · 1957",
      note: "One room, twelve men, perfect tension.",
      url: "https://letterboxd.com/film/12-angry-men/",
      imageUrl: "/favorites/12-angry-men.jpg",
      sortOrder: 10,
    },
    {
      id: "fav-ship",
      category: "Film & TV",
      title: "Ship of Theseus",
      subtitle: "Anand Gandhi · 2012",
      note: "One of the finest of modern Indian cinema.",
      url: "https://letterboxd.com/film/ship-of-theseus/",
      imageUrl: "/favorites/ship-of-theseus.jpg",
      sortOrder: 11,
    },
    {
      id: "fav-darjeeling",
      category: "Film & TV",
      title: "The Darjeeling Limited",
      subtitle: "Wes Anderson · 2007",
      note: "A comfort rewatch.",
      url: "https://letterboxd.com/film/the-darjeeling-limited/",
      imageUrl: "/favorites/darjeeling-limited.jpg",
      sortOrder: 12,
    },
  ];
  for (const f of FAVORITES) {
    const { id, ...data } = f;
    await prisma.favorite.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }
  console.log(`✓ ${FAVORITES.length} favorites`);

  console.log(
    "\nDone. Next: set OPENAI_API_KEY in .env and run `npm run embeddings:rebuild`."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
