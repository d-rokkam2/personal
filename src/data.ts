// Shared data constants

export const PROJECTS = [
  {
    id: 1,
    name: 'Med2Care',
    description:
      'Led development of a full-stack ML healthcare platform with recommendation and chatbot pipelines, delivering personalized guidance across diverse patient profiles. Built REST APIs and a Dockerized backend with CI/CD for scalable model deployment. Implemented Jest tests and containerized workflows for monitoring and retraining.',
    tech: ['TypeScript', 'Java', 'Firebase', 'ML Ops'],
    github: '#',
    live: '#',
  },
  {
    id: 2,
    name: 'LeStat',
    description:
      'Real-time predictive analytics platform to forecast NBA stats using ESPN API data and custom ML models. Flask and PostgreSQL backend for low-latency, ML-powered insights and interactive dashboards.',
    tech: ['SwiftUI', 'Python', 'Flask', 'PostgreSQL'],
    github: '#',
    live: '#',
  },
] as const

export const SKILL_GROUPS: { title: string; items: string }[] = [
  {
    title: 'Languages',
    items: 'Python, Java, C++, SQL, C#, JavaScript, TypeScript, R',
  },
  {
    title: 'Machine Learning & Data',
    items: 'PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Spark, Databricks, AWS SageMaker',
  },
  {
    title: 'Data Infrastructure',
    items: 'AWS (Lambda, EMR, DynamoDB, S3, API Gateway), Azure, Snowflake, Docker, TravisCI',
  },
  {
    title: 'CS Fundamentals',
    items: 'Algorithms, Distributed Systems, Recommender Systems, Software Design Patterns',
  },
  {
    title: 'Developer Tools',
    items: 'Git, JIRA, JetBrains, VS Code, Xcode, DBeaver',
  },
]

export const EXPERIENCE = [
  {
    id: 1,
    role: 'Incoming Associate Engineer',
    company: 'MathWorks',
    period: 'Aug 2026 —',
    bullets: [
      'Joining the Engineering Development Group to build reliable, user-impactful software in a collaborative product engineering environment.',
      'Continuing to connect applied machine learning with maintainable full-stack systems and thoughtful system design.',
    ],
  },
  {
    id: 2,
    role: 'Software Engineer Co-op',
    company: 'Nara Logics',
    period: 'Jan 2026 – Mar 2026',
    bullets: [
      'Enhanced fuzzy matching and sorting algorithms, improving engine performance by 9% through optimized data structures and system design.',
      'Architected a multi-tiered caching system using Redis and migrated graph processing from NetworkX to RustworkX, significantly improving backend scalability and efficiency.',
      'Reduced codebase complexity and automated development workflows by replacing inefficient libraries (e.g., JSON → orjson, bleach → nh3) and building a tool to detect TODOs and generate prioritized pull requests.',
    ],
  },
  {
    id: 3,
    role: 'Full Stack Software Engineer Intern',
    company: 'PhAST Corp',
    period: 'Nov 2024 – Sep 2025',
    bullets: [
      'Optimized distributed pipelines (+30% throughput, –25% setup time) to accelerate model training and analytics.',
      'Built AWS Lambda, DynamoDB, and API Gateway services, reducing query latency by 40% for 1,000+ users.',
      'Delivered a React web app with integrated ML features, improving accessibility by 15% and demonstrating end-to-end product deployment.',
    ],
  },
  {
    id: 4,
    role: 'Software Engineer Intern (Strategic Tech)',
    company: 'Alnylam Pharmaceuticals',
    period: 'May 2024 – Sep 2024',
    bullets: [
      'Designed complex ETL pipelines on Azure and Databricks, improving cross-team retrieval speed by 25%.',
      'Standardized schemas and pipelines to enable ML workflows at scale, improving reliability of downstream analytics.',
      'Collaborated in Agile sprints with engineers and analysts to scope, prioritize, and implement data-driven ML solutions.',
    ],
  },
  {
    id: 5,
    role: 'Data Science Intern',
    company: 'HCLTech',
    period: 'Apr 2023 – Sep 2023',
    bullets: [
      'Developed and deployed PyTorch and TensorFlow models for time series forecasting, improving accuracy by 15%.',
      'Integrated IoT sensor data with ML forecasting models, enabling adaptive control in AC systems with real-time responses.',
    ],
  },
]
