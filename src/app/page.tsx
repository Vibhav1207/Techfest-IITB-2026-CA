"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Terminal, Eye, HelpCircle, MemoryStick, Menu, X } from "lucide-react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function TiltCard({ children, className, ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = (mouseY / (height / 2)) * -12;
    const rY = (mouseX / (width / 2)) * 12;
    setRotate({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

function MagneticWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

    if (dist < 100) {
      setPosition({ x: mouseX * 0.35, y: mouseY * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const particleCount = Math.min(75, Math.floor((width * height) / 18000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glowColor: string;
      pulseRate: number;
      pulseState: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const isCyan = Math.random() > 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1.2,
        color: isCyan ? "rgba(0, 243, 255, 0.5)" : "rgba(182, 0, 248, 0.45)",
        glowColor: isCyan ? "rgba(0, 243, 255, 0.15)" : "rgba(182, 0, 248, 0.12)",
        pulseRate: Math.random() * 0.02 + 0.01,
        pulseState: Math.random() * Math.PI,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 243, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const m = mouseRef.current;

      if (m.x > 0 && m.y > 0) {
        ctx.strokeStyle = "rgba(0, 243, 255, 0.02)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 100, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(182, 0, 248, 0.01)";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 200, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(0, 243, 255, 0.04)";
        ctx.beginPath();
        ctx.moveTo(m.x - 15, m.y);
        ctx.lineTo(m.x + 15, m.y);
        ctx.moveTo(m.x, m.y - 15);
        ctx.lineTo(m.x, m.y + 15);
        ctx.stroke();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulseState += p.pulseRate;
        const pulse = Math.sin(p.pulseState) * 0.3 + 0.7;

        if (m.x > 0 && m.y > 0) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const pullForce = (220 - dist) / 220000;
            p.vx += dx * pullForce;
            p.vy += dy * pullForce;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.98;
        p.vy *= 0.98;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.1) {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (3 + pulse * 2), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.07;
            ctx.strokeStyle = p.color.includes("182")
              ? `rgba(182, 0, 248, ${alpha})`
              : `rgba(0, 243, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (m.x > 0 && m.y > 0) {
          const mdx = p.x - m.x;
          const mdy = p.y - m.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 180) {
            const mAlpha = (1 - mDist / 180) * 0.12;
            ctx.strokeStyle = `rgba(0, 243, 255, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
}

const getClipClass = (index: number) => {
  if (index === 0 || index === 5) return "clip-tl";
  if (index === 1 || index === 4) return "clip-tr";
  if (index === 2 || index === 3) return "clip-bl";
  return "";
};

const getGlowClass = (index: number) => {
  if (index === 0 || index === 5) return "border-node-cyan shadow-[0_0_25px_rgba(0,243,255,0.18)]";
  if (index === 1 || index === 4) return "border-node-purple shadow-[0_0_25px_rgba(182,0,248,0.18)]";
  if (index === 2 || index === 3) return "border-node-gold shadow-[0_0_25px_rgba(255,191,0,0.15)]";
  return "";
};

const getRingBorderClass = (index: number) => {
  return "border-white/10 group-hover:border-white/20";
};

const getThemedGlowColor = (index: number) => {
  if (index === 0 || index === 5) return "rgba(0, 243, 255, 0.25)";
  if (index === 1 || index === 4) return "rgba(182, 0, 248, 0.25)";
  if (index === 2 || index === 3) return "rgba(255, 191, 0, 0.2)";
  return "";
};

const partners = [
  {
    name: "SBI",
    category: "BANKING SYSTEMS",
    techStack: "Core Banking Systems / NEFT",
    allianceTier: "ALLIANCE PARTNER",
    status: "SYS_FEED_OK",
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-container" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <path d="M12 2L2 9h20L12 2zM6 10v11M10 10v11M14 10v11M18 10v11" />
      </svg>
    )
  },
  {
    name: "IDFC BANK",
    category: "FINTECH SECURE",
    techStack: "Digital Ledgers / Web3 Pay",
    allianceTier: "ALLIANCE PARTNER",
    status: "SYNC_ACTIVE",
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-secondary-fixed" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    name: "L&T GROUPS",
    category: "INFRASTRUCTURE",
    techStack: "Structural Cyber-Systems",
    allianceTier: "ALLIANCE PARTNER",
    status: "NODE_SECURE",
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-fixed" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4zM4 12h16M12 4v16" />
        <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.1" />
      </svg>
    )
  },
  {
    name: "INDIAN OIL",
    category: "ENERGY MATRIX",
    techStack: "Super-Refined Plasma Fuel",
    allianceTier: "ALLIANCE PARTNER",
    status: "FLOW_STB",
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-secondary-fixed" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M7 12h10" />
        <circle cx="12" cy="12" r="4" fill="currentColor" className="animate-pulse" />
      </svg>
    )
  },
  {
    name: "NPCI",
    category: "PAYMENT SYSTEM",
    techStack: "Unified Payments Interface",
    allianceTier: "ALLIANCE PARTNER",
    status: "CIPHER_OK",
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-container animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 11l2 2 4-4" />
      </svg>
    )
  },
  {
    name: "JIO FINANCE",
    category: "FINANCIAL NODE",
    techStack: "Sub-space Credit Networks",
    allianceTier: "ALLIANCE PARTNER",
    status: "SYS_FEED_OK",
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-fixed" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
        <circle cx="12" cy="12" r="3" strokeDasharray="2 2" />
      </svg>
    )
  }
];

function SponsorCard({ sponsor }: { sponsor: any }) {
  return (
    <div className="sponsor-card sponsor-card-grid w-[280px] sm:w-[320px] h-[150px] sm:h-[160px] p-4 sm:p-5 flex flex-col justify-between overflow-hidden group relative select-none">
      
      <span className="cyber-bracket cyber-bracket-tl" />
      <span className="cyber-bracket cyber-bracket-tr" />
      <span className="cyber-bracket cyber-bracket-bl" />
      <span className="cyber-bracket cyber-bracket-br" />

      <div className="cyber-laser-scanner opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
      <div className="scanline-sweep-effect opacity-10 group-hover:opacity-20 transition-opacity duration-300" />

      <div className="flex justify-between items-center w-full relative z-10">
        <span className="font-code-sm text-[8px] sm:text-[9px] text-secondary-fixed opacity-70 tracking-widest uppercase">
          {sponsor.category}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-container"></span>
          </span>
          <span className="font-code-sm text-[8px] text-primary-container/85 tracking-wider font-semibold">
            {sponsor.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 py-1 sm:py-2 relative z-10">
        <div className="p-2 sm:p-2.5 bg-surface/50 border border-primary/15 rounded-sm group-hover:border-primary/35 group-hover:bg-surface-container-high/65 transition-all duration-300 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 shadow-md">
          {sponsor.logo}
        </div>
        <div className="flex flex-col">
          <h4 className="font-headline-md text-[14px] sm:text-[16px] text-primary uppercase font-bold tracking-wider group-hover:text-glow transition-all duration-300">
            {sponsor.name}
          </h4>
          <span className="font-code-sm text-[8px] sm:text-[9px] text-on-surface-variant/45 tracking-wider">
            {sponsor.allianceTier}
          </span>
        </div>
      </div>

      <div className="w-full border-t border-primary/5 pt-1.5 sm:pt-2 flex justify-between items-center text-[8px] sm:text-[9px] font-code-sm text-on-surface-variant/40 relative z-10 transition-colors duration-300 group-hover:border-primary/20">
        <span className="group-hover:text-primary transition-colors">
          TECH_STACK: <span className="text-on-surface-variant/70 group-hover:text-primary-fixed transition-colors">{sponsor.techStack}</span>
        </span>
        <span className="opacity-0 group-hover:opacity-100 text-primary-container tracking-wider transition-all duration-300 font-bold">
          [CONNECTED]
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingLines, setLoadingLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [hoveringNav, setHoveringNav] = useState(false);
  const [hoveredDiv, setHoveredDiv] = useState<number | null>(null);

  useEffect(() => {
    const steps = [
      "[SYS_INIT] INITIALIZING TECHFEST_26...",
      "[NET_LOAD] LOADING CYBORG NETWORK...",
      "[NODE_CONN] CONNECTING DIVISIONS...",
      "[AUTH_SEC] ACCESS GRANTED."
    ];

    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < steps.length) {
        const currentStep = steps[lineIdx];
        setLoadingLines(prev => [...prev, currentStep]);
        lineIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    const handleMouseCoords = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseCoords);
    return () => window.removeEventListener("mousemove", handleMouseCoords);
  }, []);

  const { scrollYProgress } = useScroll();
  const opacityText = useTransform(scrollYProgress, [0, 0.1], [1, 0.4]);
  const yScrollTranslate = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  const divisions = [
    {
      num: "01",
      name: "Robotics Div",
      events: ["Robowars", "Meshmerize", "Line Follower", "Autonomous Bots", "Drone Challenges"],
      desktopPos: "lg:absolute lg:top-[12%] lg:left-[18%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "02",
      name: "Codex Div",
      events: ["Competitive Programming", "AI/ML Challenges", "Hackathons", "Cybersecurity Events"],
      desktopPos: "lg:absolute lg:top-[5%] lg:left-[50%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "03",
      name: "Engineering Div",
      events: ["Product Design", "Hardware Challenges", "IoT Projects", "Design Competitions"],
      desktopPos: "lg:absolute lg:top-[12%] lg:left-[82%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "04",
      name: "Aerospace Div",
      events: ["UAV Competitions", "Drone Challenges", "Rocketry Events", "Space Challenges"],
      desktopPos: "lg:absolute lg:top-[50%] lg:left-[90%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "05",
      name: "Electronics Div",
      events: ["Circuit Design", "Embedded Programming", "Hardware Integration"],
      desktopPos: "lg:absolute lg:top-[88%] lg:left-[82%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "06",
      name: "Innovation Div",
      events: ["Startup Challenges", "Business Case Comps", "Innovation Pitching"],
      desktopPos: "lg:absolute lg:top-[95%] lg:left-[50%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "07",
      name: "Gaming Div",
      events: ["Valorant", "BGMI", "EA FC", "Esports Tournaments"],
      desktopPos: "lg:absolute lg:top-[88%] lg:left-[18%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
    {
      num: "08",
      name: "Knowledge Div",
      events: ["AI & ML", "Cybersecurity", "Robotics & IoT", "Tech Summits"],
      desktopPos: "lg:absolute lg:top-[50%] lg:left-[10%] lg:-translate-x-1/2 lg:-translate-y-1/2",
    },
  ];

  const orbitNodes = [
    {
      id: 1,
      title: "COMPETITIONS",
      icon: <MemoryStick className="text-primary-fixed w-5 h-5" />,
      desc: "Engage in high-stakes problem solving protocols. Optimal efficiency required.",
      status: "SYS_ACTIVE",
      colorClass: "text-primary-fixed",
      borderClass: "border-primary-fixed/20",
      nodeClass: "node-1",
      glowColor: "rgba(0, 243, 255, 0.4)",
      customClass: "clip-tl border-node-cyan shadow-[0_0_15px_rgba(0,243,255,0.15)]",
      moduleCode: "COMP_SYS_01",
    },
    {
      id: 2,
      title: "HACKATHONS",
      icon: <Terminal className="text-secondary-fixed w-5 h-5" />,
      desc: "Continuous development cycles. Rapid deployment sequences initiated.",
      status: "LIVE_FEED",
      colorClass: "text-secondary-fixed",
      borderClass: "border-secondary-fixed/20",
      nodeClass: "node-2",
      glowColor: "rgba(182, 0, 248, 0.4)",
      customClass: "clip-tr border-node-purple shadow-[0_0_15px_rgba(182,0,248,0.15)]",
      moduleCode: "HACK_SYS_02",
    },
    {
      id: 3,
      title: "WORKSHOPS",
      icon: <ArrowUpRight className="text-primary-fixed w-5 h-5" />,
      desc: "Knowledge transfer nodes. Upgrade neural firmware manually.",
      status: "SLOTS_AVAIL",
      colorClass: "text-primary-fixed",
      borderClass: "border-outline-variant/30",
      nodeClass: "node-3",
      glowColor: "rgba(0, 243, 255, 0.2)",
      customClass: "clip-bl border-node-gold shadow-[0_0_15px_rgba(255,191,0,0.12)]",
      moduleCode: "WORK_SYS_03",
    },
    {
      id: 4,
      title: "ROBOWARS",
      icon: <Eye className="text-error w-5 h-5" />,
      desc: "Physical hardware combat. Kinetic energy transfer expected.",
      status: "COMBAT_RDY",
      colorClass: "text-error",
      borderClass: "border-error/50",
      nodeClass: "node-4",
      glowColor: "rgba(255, 0, 60, 0.4)",
      customClass: "clip-br border-node-red shadow-[0_0_20px_rgba(255,0,60,0.25)]",
      moduleCode: "ROBO_COMBAT_04",
    },
    {
      id: 5,
      title: "CHALLENGES",
      icon: <HelpCircle className="text-primary-fixed w-5 h-5" />,
      desc: "Isolate logical anomalies. Test cognitive processing limits.",
      status: "AWAIT_INPUT",
      colorClass: "text-primary-fixed",
      borderClass: "border-primary-fixed/20",
      nodeClass: "node-5",
      glowColor: "rgba(0, 243, 255, 0.3)",
      customClass: "clip-hexagon-accent border-node-cyan shadow-[0_0_15px_rgba(0,243,255,0.15)]",
      moduleCode: "LOGIC_GRID_05",
    },
    {
      id: 6,
      title: "EXHIBITIONS",
      icon: <Eye className="text-secondary-fixed w-5 h-5" />,
      desc: "Visual data parsing. Observe next-gen tech integrations.",
      status: "OPEN_ACCESS",
      colorClass: "text-secondary-fixed",
      borderClass: "border-secondary-fixed/20",
      nodeClass: "node-6",
      glowColor: "rgba(182, 0, 248, 0.3)",
      customClass: "clip-tl border-node-purple shadow-[0_0_15px_rgba(182,0,248,0.15)]",
      moduleCode: "EXHIBIT_SYS_06",
    },
  ];

  const legends = [
    {
      title: "ROBOWARS",
      stability: "98.4%",
      status: "ARCHIVED",
      img: "/images/robowars.png",
    },
    {
      title: "MESHMERIZE",
      stability: "99.1%",
      status: "ARCHIVED",
      img: "/images/meshmerize.png",
    },
    {
      title: "HACKATHONS",
      stability: "97.8%",
      status: "ARCHIVED",
      img: "/images/hackathons.png",
    },
    {
      title: "DRONE RACING",
      stability: "96.5%",
      status: "ARCHIVED",
      img: "/images/drone-racing.png",
    },
    {
      title: "CODECODE",
      stability: "99.5%",
      status: "ARCHIVED",
      img: "/images/codecode.png",
    },
    {
      title: "BLIXATHON",
      stability: "94.2%",
      status: "ARCHIVED",
      img: "/images/blixathon.png",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center font-code-sm text-primary px-6"
          >
            <div className="relative flex flex-col items-center gap-6 max-w-md w-full">
              <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-25"></div>
                <img
                  alt="TECHFEST_26 Logo"
                  src="/images/tf-logo.png"
                  className="w-28 h-28 rounded-full object-cover relative z-10 animate-pulse-slow filter brightness-110 border border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.15)]"
                />
              </div>
              
              <div className="font-label-caps text-sm tracking-[0.35em] text-glow text-primary-fixed mb-2 font-bold">
                {progress}% COMPLETE
              </div>

              <div className="w-full h-[2px] bg-primary/10 border border-primary/5 rounded-full overflow-hidden mb-6 relative">
                <div
                  className="h-full bg-gradient-to-r from-primary-fixed to-secondary-fixed transition-all duration-100 ease-out"
                  style={{ width: `${progress}%`, boxShadow: "0 0 8px #00f3ff" }}
                ></div>
              </div>

              <div className="w-full bg-[rgba(10,10,10,0.85)] border border-primary/10 rounded-sm p-4 h-40 text-[11px] font-code-sm text-left overflow-y-auto space-y-1 relative shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="scanline"></div>
                {loadingLines.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-secondary-fixed opacity-75">&gt;</span>
                    <span className={line.includes("GRANTED") ? "text-primary font-bold text-glow" : "text-on-surface-variant/80"}>
                      {line}
                    </span>
                  </div>
                ))}
                {loadingLines.length < 4 && (
                  <div className="flex gap-2 items-center">
                    <span className="text-secondary-fixed opacity-75">&gt;</span>
                    <span className="w-2 h-3.5 bg-primary animate-pulse relative top-0.5"></span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NeuralNetworkBackground />

      <div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[100] border border-primary/40 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out hidden md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: `translate(-50%, -50%) scale(${hoveringNav ? 1.5 : 1})`,
          boxShadow: "0 0 15px rgba(0, 243, 255, 0.3)",
          backgroundColor: hoveringNav ? "rgba(0, 243, 255, 0.05)" : "transparent",
        }}
      />

      <div className="fixed top-0 left-1/4 w-[1px] h-full circuit-line-v opacity-25 z-[-1] hidden md:block"></div>
      <div className="fixed top-0 left-3/4 w-[1px] h-full circuit-line-v opacity-25 z-[-1] hidden md:block"></div>
      <div className="fixed top-1/2 left-0 w-full h-[1px] circuit-line-h opacity-25 z-[-1] hidden md:block"></div>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-surface/75 backdrop-blur-xl border-b border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.1)]"
        onMouseEnter={() => setHoveringNav(true)}
        onMouseLeave={() => setHoveringNav(false)}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-container-max mx-auto">
          <div className="font-headline-md text-[24px] text-primary tracking-tighter text-glow flex items-center gap-3 font-bold cursor-pointer hover:scale-102 transition-transform">
            <img
              alt="TECHFEST_26 Logo"
              src="/images/tf-logo.png"
              className="h-8 w-8 rounded-full object-cover animate-pulse-slow filter brightness-110 border border-primary/20"
            />
            <span>TECHFEST 2k26</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-all tracking-[0.25em] hover:bg-primary/5 px-3 py-1.5 rounded-sm border border-transparent hover:border-primary/10"
              href="#"
            >
              Workshops
            </a>
            <a
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-all tracking-[0.25em] hover:bg-primary/5 px-3 py-1.5 rounded-sm border border-transparent hover:border-primary/10"
              href="#"
            >
              Competitions
            </a>
            <a
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-all tracking-[0.25em] hover:bg-primary/5 px-3 py-1.5 rounded-sm border border-transparent hover:border-primary/10"
              href="#"
            >
              Accomodation
            </a>
          </div>
          <MagneticWrapper>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 18px rgba(0,243,255,0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary font-label-caps text-label-caps px-6 py-3 uppercase tracking-widest hidden md:block font-bold border border-primary-container"
            >
              DECRYPT_ACCESS
            </motion.button>
          </MagneticWrapper>
          <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-40 bg-surface-container-lowest/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <button className="absolute top-6 right-6 text-primary" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <a
              className="font-label-caps text-headline-md text-on-surface-variant hover:text-primary tracking-[0.25em]"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              Workshops
            </a>
            <a
              className="font-label-caps text-headline-md text-on-surface-variant hover:text-primary tracking-[0.25em]"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              Competitions
            </a>
            <a
              className="font-label-caps text-headline-md text-on-surface-variant hover:text-primary tracking-[0.25em]"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accomodation
            </a>
            <button className="btn-primary font-label-caps text-label-caps px-8 py-4 uppercase tracking-widest mt-8 font-semibold">
              DECRYPT_ACCESS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-[80px] relative w-full max-w-container-max mx-auto px-6 md:px-12">
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center mt-12 mb-24 overflow-hidden">
          <div className="hidden xl:flex absolute left-4 top-[20%] w-52 flex-col gap-6 text-[10px] font-code-sm text-on-surface-variant/40 text-left border-l border-primary/20 pl-4 py-4 backdrop-blur-sm bg-surface/5 select-none z-10">
            <div>
              <span className="text-secondary-fixed uppercase font-bold block mb-1 tracking-wider">// SYSTEM_CORE</span>
              <span className="block opacity-80">AGENT_ID: TF_V30.0</span>
              <span className="block opacity-80">CIPHER: COMP_AES_256</span>
              <span className="block opacity-80">SECTOR: POWAI_GRID</span>
            </div>
            <div>
              <span className="text-secondary-fixed uppercase font-bold block mb-1 tracking-wider">// SIGNAL_DIAG</span>
              <span className="block opacity-80">STABILITY: 99.98%</span>
              <span className="block opacity-80">BANDWIDTH: 1.4 GBPS</span>
              <span className="block opacity-80">LATENCY: 4.8ms</span>
            </div>
            <div className="flex gap-1 items-end h-4 mt-2">
              <span className="w-1 bg-primary/30 h-2 signal-bar-1"></span>
              <span className="w-1 bg-primary/30 h-4 signal-bar-2"></span>
              <span className="w-1 bg-primary/30 h-3 signal-bar-3"></span>
              <span className="w-1 bg-primary/30 h-1 signal-bar-4"></span>
            </div>
          </div>

          <div className="hidden xl:flex absolute right-4 top-[20%] w-52 flex-col gap-6 text-[10px] font-code-sm text-on-surface-variant/40 text-right border-r border-primary/20 pr-4 py-4 backdrop-blur-sm bg-surface/5 select-none z-10">
            <div>
              <span className="text-secondary-fixed uppercase font-bold block mb-1 tracking-wider">NEURAL_LOAD //</span>
              <span className="block opacity-80">COGNITION: 18.2%</span>
              <span className="block opacity-80">BUFFER: 4.12 TB</span>
              <span className="block opacity-80">THREAD_POOL: 128</span>
            </div>
            <div>
              <span className="text-secondary-fixed uppercase font-bold block mb-1 tracking-wider">GEODETIC_GRID //</span>
              <span className="block opacity-80">IIT BOMBAY</span>
              <span className="block opacity-80">LATITUDE: 19.13 N</span>
              <span className="block opacity-80">LONGITUDE: 72.91 E</span>
            </div>
            <div className="flex gap-1 items-end h-4 mt-2 justify-end">
              <span className="w-1 bg-secondary/30 h-4 signal-bar-3"></span>
              <span className="w-1 bg-secondary/30 h-2 signal-bar-1"></span>
              <span className="w-1 bg-secondary/30 h-3 signal-bar-4"></span>
              <span className="w-1 bg-secondary/30 h-1 signal-bar-2"></span>
            </div>
          </div>

          <motion.div
            style={{ opacity: opacityText, y: yScrollTranslate }}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
          >
            <div className="absolute inset-0 bg-[#050505]/75 backdrop-blur-[2px] z-10" />
            <div className="w-full h-full relative opacity-85">
              <iframe
                src="https://www.youtube.com/embed/_aCQu35NA7M?autoplay=1&mute=1&loop=1&playlist=_aCQu35NA7M&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1"
                className="absolute top-1/2 left-1/2 pointer-events-none border-0"
                style={{
                  width: "100vw",
                  height: "56.25vw",
                  minHeight: "100vh",
                  minWidth: "177.77vh",
                  transform: "translate(-50%, -50%)",
                }}
                allow="autoplay; encrypted-media"
                title="Hero Background Video"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8 mt-24"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-panel px-5 py-2.5 flex items-center gap-3 rounded-sm mb-4 animate-float border border-primary/20 shadow-[0_0_15px_rgba(0,243,255,0.08)]"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_12px_#00f3ff]"></div>
              <span className="font-code-sm text-code-sm text-primary-container uppercase tracking-[0.25em] font-semibold">
                SYSTEM ONLINE // INITIATING SEQUENCE
              </span>
            </motion.div>
            <motion.h1
              initial={{ letterSpacing: "0.02em", opacity: 0 }}
              animate={{ letterSpacing: "0.06em", opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="font-display-lg text-display-lg text-primary uppercase text-glow leading-none font-extrabold select-none hover-glitch"
            >
              TECHFEST 26
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto border-l-2 border-primary-container pl-6 text-left leading-relaxed"
            >
              Thirty years of engineering the future. Asia’s largest science and technology festival returns to IIT Bombay — where intelligence becomes a craft.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.6 } },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12"
            >
              <motion.div
                variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                className="glass-panel p-6 flex flex-col items-start relative overflow-hidden group border border-primary/10 hover:border-primary/35 transition-all duration-300 rounded-sm"
              >
                <div className="scanline-sweep-effect"></div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/5 blur-xl group-hover:bg-primary-container/15 transition-all"></div>
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="font-code-sm text-[10px] text-secondary-fixed opacity-70 tracking-wider">EVOLUTION_INDEX</span>
                  <span className="font-code-sm text-[9px] text-primary/30 uppercase">[SEQ_01]</span>
                </div>
                <span className="font-headline-md text-headline-md text-primary font-bold text-glow">30 YEARS</span>
                <div className="flex justify-between items-center w-full mt-4 text-[9px] font-code-sm text-on-surface-variant/40">
                  <span>SYS_VAL: 0x30A7</span>
                  <span>STATUS: SECURE</span>
                </div>
                <div className="h-[1px] w-12 bg-primary-container mt-3 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
              <motion.div
                variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                className="glass-panel p-6 flex flex-col items-start relative overflow-hidden group border border-primary/20 hover:border-primary/45 transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(0,243,255,0.08)]"
              >
                <div className="scanline-sweep-effect"></div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/5 blur-xl group-hover:bg-primary-container/15 transition-all"></div>
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="font-code-sm text-[10px] text-secondary-fixed opacity-70 tracking-wider">NETWORK_CAPACITY</span>
                  <span className="font-code-sm text-[9px] text-primary/40 uppercase">[CONN_LIVE]</span>
                </div>
                <span className="font-headline-md text-headline-md text-primary font-bold text-glow">500,000+</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant mt-1 tracking-wider font-semibold">PARTICIPANTS</span>
                <div className="flex justify-between items-center w-full mt-3 text-[9px] font-code-sm text-on-surface-variant/40">
                  <span>LATENCY: 8.4ms</span>
                  <span>LOAD: 12%</span>
                </div>
                <div className="h-[1px] w-12 bg-primary-container mt-3 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
              <motion.div
                variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                className="glass-panel p-6 flex flex-col items-start relative overflow-hidden group border border-primary/10 hover:border-primary/35 transition-all duration-300 rounded-sm"
              >
                <div className="scanline-sweep-effect"></div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/5 blur-xl group-hover:bg-primary-container/15 transition-all"></div>
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="font-code-sm text-[10px] text-secondary-fixed opacity-70 tracking-wider">GLOBAL_NODES</span>
                  <span className="font-code-sm text-[9px] text-primary/30 uppercase">[PING_OK]</span>
                </div>
                <span className="font-headline-md text-headline-md text-primary font-bold text-glow">100+</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant mt-1 tracking-wider font-semibold">NATIONS</span>
                <div className="flex justify-between items-center w-full mt-3 text-[9px] font-code-sm text-on-surface-variant/40">
                  <span>PING: 140ms</span>
                  <span>IP: IPv6_ACTIVE</span>
                </div>
                <div className="h-[1px] w-12 bg-primary-container mt-3 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            </motion.div>

          </motion.div>
        </section>

        <section className="relative py-20 mb-20 w-full border-t border-primary/10 overflow-hidden bg-[rgba(5,5,5,0.4)]">
          
          <div className="absolute inset-0 tech-grid-overlay opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
          
          <div className="max-w-container-max mx-auto px-6 md:px-12 relative z-10">
            
            <div className="flex flex-col items-center text-center mb-12 relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
                </span>
                <span className="font-code-sm text-[10px] text-secondary-fixed tracking-[0.3em] uppercase font-bold">
                  ALLIANCE MATRIX // ACTIVE
                </span>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="font-headline-lg text-headline-lg text-primary uppercase tracking-[0.08em] text-glow font-bold"
              >
                OUR PARTNERS
              </motion.h2>
            </div>

            <div className="w-full overflow-hidden py-4 select-none relative">
              
              <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

              <div className="flex w-full overflow-hidden group/track">
                <div className="animate-marquee-left flex gap-6 py-2 group-hover/track:[animation-play-state:paused]">
                  {[...partners, ...partners, ...partners].map((sponsor, index) => (
                    <SponsorCard key={`partner-${index}`} sponsor={sponsor} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 mb-24 w-full border-t border-primary/10">
          <div className="text-center mb-20 relative z-20">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-headline-lg text-headline-lg text-primary uppercase tracking-[0.05em] text-glow mb-4 font-bold"
            >
              Cyborg Division System
            </motion.h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-secondary"></div>
              <p className="font-code-sm text-code-sm text-secondary-fixed opacity-80 uppercase tracking-[0.25em] font-semibold">
                Active Modules // 8 Nodes
              </p>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-secondary"></div>
            </div>
          </div>
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[1050px] lg:min-h-[850px] flex flex-col lg:block items-center gap-8 lg:gap-0 z-10">
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block opacity-50 z-0" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <g fill="none" strokeWidth="1.5">
                <path d="M500,500 L180,120" stroke={hoveredDiv === 0 ? "rgba(0, 243, 255, 0.8)" : "rgba(0, 243, 255, 0.12)"} strokeWidth={hoveredDiv === 0 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L500,50" stroke={hoveredDiv === 1 ? "rgba(182, 0, 248, 0.8)" : "rgba(182, 0, 248, 0.12)"} strokeWidth={hoveredDiv === 1 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L820,120" stroke={hoveredDiv === 2 ? "rgba(0, 243, 255, 0.8)" : "rgba(0, 243, 255, 0.12)"} strokeWidth={hoveredDiv === 2 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L900,500" stroke={hoveredDiv === 3 ? "rgba(182, 0, 248, 0.8)" : "rgba(182, 0, 248, 0.12)"} strokeWidth={hoveredDiv === 3 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L820,880" stroke={hoveredDiv === 4 ? "rgba(0, 243, 255, 0.8)" : "rgba(0, 243, 255, 0.12)"} strokeWidth={hoveredDiv === 4 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L500,950" stroke={hoveredDiv === 5 ? "rgba(182, 0, 248, 0.8)" : "rgba(182, 0, 248, 0.12)"} strokeWidth={hoveredDiv === 5 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L180,880" stroke={hoveredDiv === 6 ? "rgba(0, 243, 255, 0.8)" : "rgba(0, 243, 255, 0.12)"} strokeWidth={hoveredDiv === 6 ? "2.5" : "1.5"} className="transition-all duration-300" />
                <path d="M500,500 L100,500" stroke={hoveredDiv === 7 ? "rgba(182, 0, 248, 0.8)" : "rgba(182, 0, 248, 0.12)"} strokeWidth={hoveredDiv === 7 ? "2.5" : "1.5"} className="transition-all duration-300" />
              </g>
              <g fill="none">
                <path d="M500,500 L180,120" className={`packet-tracer transition-all duration-300 ${hoveredDiv === 0 ? "stroke-primary filter drop-shadow-[0_0_8px_#00f3ff]" : ""}`} strokeWidth={hoveredDiv === 0 ? "2.5" : "1.5"} />
                <path d="M500,500 L500,50" className={`packet-tracer-purple transition-all duration-300 ${hoveredDiv === 1 ? "stroke-secondary-container filter drop-shadow-[0_0_8px_#b600f8]" : ""}`} strokeWidth={hoveredDiv === 1 ? "2.5" : "1.5"} />
                <path d="M500,500 L820,120" className={`packet-tracer transition-all duration-300 ${hoveredDiv === 2 ? "stroke-primary filter drop-shadow-[0_0_8px_#00f3ff]" : ""}`} strokeWidth={hoveredDiv === 2 ? "2.5" : "1.5"} />
                <path d="M500,500 L900,500" className={`packet-tracer-purple transition-all duration-300 ${hoveredDiv === 3 ? "stroke-secondary-container filter drop-shadow-[0_0_8px_#b600f8]" : ""}`} strokeWidth={hoveredDiv === 3 ? "2.5" : "1.5"} />
                <path d="M500,500 L820,880" className={`packet-tracer transition-all duration-300 ${hoveredDiv === 4 ? "stroke-primary filter drop-shadow-[0_0_8px_#00f3ff]" : ""}`} strokeWidth={hoveredDiv === 4 ? "2.5" : "1.5"} />
                <path d="M500,500 L500,950" className={`packet-tracer-purple transition-all duration-300 ${hoveredDiv === 5 ? "stroke-secondary-container filter drop-shadow-[0_0_8px_#b600f8]" : ""}`} strokeWidth={hoveredDiv === 5 ? "2.5" : "1.5"} />
                <path d="M500,500 L180,880" className={`packet-tracer transition-all duration-300 ${hoveredDiv === 6 ? "stroke-primary filter drop-shadow-[0_0_8px_#00f3ff]" : ""}`} strokeWidth={hoveredDiv === 6 ? "2.5" : "1.5"} />
                <path d="M500,500 L100,500" className={`packet-tracer-purple transition-all duration-300 ${hoveredDiv === 7 ? "stroke-secondary-container filter drop-shadow-[0_0_8px_#b600f8]" : ""}`} strokeWidth={hoveredDiv === 7 ? "2.5" : "1.5"} />
              </g>
              <circle r={hoveredDiv === 0 ? "6" : "4"} fill="#00f3ff" filter={hoveredDiv === 0 ? "drop-shadow(0 0 8px #00f3ff)" : "drop-shadow(0 0 3px #00f3ff)"} className="transition-all duration-300">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M500,500 L180,120" />
              </circle>
              <circle r={hoveredDiv === 1 ? "6" : "4"} fill="#b600f8" filter={hoveredDiv === 1 ? "drop-shadow(0 0 8px #b600f8)" : "drop-shadow(0 0 3px #b600f8)"} className="transition-all duration-300">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M500,500 L500,50" />
              </circle>
              <circle r={hoveredDiv === 2 ? "6" : "4"} fill="#00f3ff" filter={hoveredDiv === 2 ? "drop-shadow(0 0 8px #00f3ff)" : "drop-shadow(0 0 3px #00f3ff)"} className="transition-all duration-300">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M500,500 L820,120" />
              </circle>
              <circle r={hoveredDiv === 3 ? "6" : "4"} fill="#b600f8" filter={hoveredDiv === 3 ? "drop-shadow(0 0 8px #b600f8)" : "drop-shadow(0 0 3px #b600f8)"} className="transition-all duration-300">
                <animateMotion dur="4.0s" repeatCount="indefinite" path="M500,500 L900,500" />
              </circle>
              <circle r={hoveredDiv === 4 ? "6" : "4"} fill="#00f3ff" filter={hoveredDiv === 4 ? "drop-shadow(0 0 8px #00f3ff)" : "drop-shadow(0 0 3px #00f3ff)"} className="transition-all duration-300">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M500,500 L820,880" />
              </circle>
              <circle r={hoveredDiv === 5 ? "6" : "4"} fill="#b600f8" filter={hoveredDiv === 5 ? "drop-shadow(0 0 8px #b600f8)" : "drop-shadow(0 0 3px #b600f8)"} className="transition-all duration-300">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M500,500 L500,950" />
              </circle>
              <circle r={hoveredDiv === 6 ? "6" : "4"} fill="#00f3ff" filter={hoveredDiv === 6 ? "drop-shadow(0 0 8px #00f3ff)" : "drop-shadow(0 0 3px #00f3ff)"} className="transition-all duration-300">
                <animateMotion dur="2.9s" repeatCount="indefinite" path="M500,500 L180,880" />
              </circle>
              <circle r={hoveredDiv === 7 ? "6" : "4"} fill="#b600f8" filter={hoveredDiv === 7 ? "drop-shadow(0 0 8px #b600f8)" : "drop-shadow(0 0 3px #b600f8)"} className="transition-all duration-300">
                <animateMotion dur="3.8s" repeatCount="indefinite" path="M500,500 L100,500" />
              </circle>
              <circle cx="500" cy="500" r="400" stroke="rgba(182, 0, 248, 0.12)" strokeWidth="2" strokeDasharray="15 20" className="animate-[spin_160s_linear_infinite]"></circle>
              <circle cx="500" cy="500" r="400" stroke="rgba(0, 243, 255, 0.06)" strokeWidth="1" className="animate-pulse"></circle>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex w-44 h-44 rounded-full border border-primary/40 bg-surface-container/90 backdrop-blur-xl flex-col items-center justify-center shadow-[0_0_40px_rgba(0,243,255,0.25)] overflow-hidden">
              <img
                alt="TF Laurel Centerpiece"
                src="/images/tf-logo.png"
                className="absolute inset-0 w-full h-full object-cover animate-pulse filter brightness-110"
              />
              <div className="absolute inset-0 rounded-full border border-secondary/30 animate-[spin_10s_linear_infinite] z-10"></div>
              <div className="absolute inset-2.5 rounded-full border-2 border-dashed border-primary/30 animate-[spin_18s_linear_infinite_reverse] z-10"></div>
              <div className="absolute inset-5 rounded-full border border-primary-container/20 animate-[spin_8s_linear_infinite] z-10"></div>
              <div className="w-16 h-16 rounded-full bg-primary-container/15 blur-md absolute z-10 pointer-events-none"></div>
            </div>
            {divisions.map((div, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                key={i}
                onMouseEnter={() => setHoveredDiv(i)}
                onMouseLeave={() => setHoveredDiv(null)}
                className={`${div.desktopPos} w-full lg:w-72 bg-surface-container-high/65 backdrop-blur-xl border border-outline-variant/50 p-5 holo-module z-10 hover:border-primary-container/70 group shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="scanline-sweep-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-start gap-3 mb-2 relative z-10">
                  <span className="font-label-caps text-secondary-fixed-dim tracking-widest text-lg font-bold group-hover:text-primary transition-colors text-glow">
                    {div.num}
                  </span>
                  <div className="w-full">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="font-headline-md text-[18px] text-primary uppercase tracking-wider mb-1 font-bold group-hover:text-glow transition-all">
                        {div.name}
                      </h3>
                      <div className="flex gap-0.5 items-end h-3 group-hover:flex hidden">
                        <span className="w-[1.5px] bg-primary-container signal-bar-1 h-1"></span>
                        <span className="w-[1.5px] bg-primary-container signal-bar-2 h-2"></span>
                        <span className="w-[1.5px] bg-primary-container signal-bar-3 h-3"></span>
                        <span className="w-[1.5px] bg-primary-container signal-bar-4 h-4"></span>
                        <span className="font-code-sm text-[8px] text-primary-container uppercase tracking-wider ml-1">
                          [ACTIVE]
                        </span>
                      </div>
                      <span className="font-code-sm text-[8px] text-on-surface-variant/30 uppercase tracking-widest group-hover:hidden">
                        [ONLINE]
                      </span>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-primary/50 to-transparent group-hover:from-primary transition-all"></div>
                  </div>
                </div>
                <div className="module-events overflow-hidden relative z-10">
                  <ul className="font-code-sm text-[13px] text-on-surface-variant space-y-2 pl-8 list-none">
                    {div.events.map((event, j) => (
                      <li
                        key={j}
                        className="relative before:content-['>'] before:absolute before:-left-4 before:text-secondary-fixed font-medium group-hover:text-on-surface transition-colors"
                      >
                        {event}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center w-full mt-4 pt-2 border-t border-primary/5 text-[9px] font-code-sm text-on-surface-variant/30">
                    <span>SECTOR: 0x{div.num}8F</span>
                    <span>BAUD: 9600</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative py-24 mb-24 w-full border-t border-primary/10">
          <div className="w-full max-w-container-max mx-auto">
            <div className="text-center mb-16 relative">
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="font-display-lg text-display-lg text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed to-secondary-fixed mb-4 tracking-tighter font-extrabold"
              >
                EVENTS &amp; COMPETITIONS
              </motion.h1>
              <p className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-[0.25em] font-semibold">
              </p>
            </div>
            <div className="orbit-container">
              <div className="absolute inset-0 orbit-spin-clockwise hidden md:block pointer-events-none">
                <svg className="svg-connections" viewBox="0 0 800 800">
                  <path className="connection-line" d="M400,400 L400,100"></path>
                  <path className="connection-line" d="M400,400 L640,200"></path>
                  <path className="connection-line" d="M400,400 L640,600"></path>
                  <path className="connection-line" d="M400,400 L400,700"></path>
                  <path className="connection-line" d="M400,400 L160,600"></path>
                  <path className="connection-line" d="M400,400 L160,200"></path>
                </svg>
              </div>

              <div className="absolute inset-0 orbit-spin-clockwise hidden md:block">
                {orbitNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`orbit-node ${node.nodeClass} cursor-pointer group`}
                  >
                    <div className="orbit-spin-counter-clockwise">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`bg-[rgba(10,10,10,0.85)] backdrop-blur-xl p-4 transition-all duration-300 border relative overflow-hidden ${node.customClass}`}
                        style={{
                          boxShadow: `0 0 20px rgba(0,0,0,0.6), inset 0 0 10px ${node.glowColor}`,
                        }}
                      >
                        <div className="scanline-sweep-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex justify-between items-center w-full mb-2">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center p-1.5 rounded-sm bg-surface-container-high/60 group-hover:bg-primary-container/10 transition-colors">
                              {node.icon}
                            </span>
                            <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider group-hover:text-primary transition-colors text-glow">
                              {node.title}
                            </h3>
                          </div>
                        </div>
                        <p className="font-code-sm text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-normal">
                          {node.desc}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`font-code-sm text-[9px] ${node.colorClass}-dim bg-[rgba(0,0,0,0.4)] px-2.5 py-1 rounded-sm border ${node.borderClass} animate-pulse-slow font-semibold tracking-wider`}
                          >
                            {node.status}
                          </span>
                          <ArrowUpRight className="text-outline-variant group-hover:text-primary transition-colors w-4 h-4" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:hidden w-full gap-6">
                {orbitNodes.map((node) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={`mobile-${node.id}`}
                    className="w-full cursor-pointer group"
                  >
                    <div
                      className={`bg-[rgba(10,10,10,0.85)] backdrop-blur-xl p-4 transition-all duration-300 border relative overflow-hidden ${node.customClass}`}
                      style={{
                        boxShadow: `0 0 20px rgba(0,0,0,0.6), inset 0 0 10px ${node.glowColor}`,
                      }}
                    >
                      <div className="scanline-sweep-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center p-1.5 rounded-sm bg-surface-container-high/60 group-hover:bg-primary-container/10 transition-colors">
                            {node.icon}
                          </span>
                          <h3 className="font-label-caps text-label-caps text-on-surface font-bold tracking-wider group-hover:text-primary transition-colors">
                            {node.title}
                          </h3>
                        </div>
                      </div>
                      <p className="font-code-sm text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-normal">
                        {node.desc}
                      </p>
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-code-sm text-[9px] ${node.colorClass}-dim bg-[rgba(0,0,0,0.4)] px-2.5 py-1 rounded-sm border ${node.borderClass} animate-pulse-slow font-semibold tracking-wider`}
                        >
                          {node.status}
                        </span>
                        <ArrowUpRight className="text-outline-variant group-hover:text-primary transition-colors w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="core-element hidden lg:block rounded-full overflow-hidden border border-primary-fixed/30 bg-surface-container-lowest pointer-events-none">
                <div className="scanline"></div>
                <img
                  alt="Holographic Intelligence Core"
                  className="w-full h-full object-cover mix-blend-screen opacity-80 animate-pulse-slow"
                  src="/images/cyborg-core.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="relative py-24 mb-24 w-full border-t border-primary/10 bg-surface-container-lowest/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-neural-grid opacity-5 pointer-events-none"></div>
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display-lg text-display-lg text-primary uppercase tracking-[0.05em] text-glow mb-4 font-bold"
            >
              HALL OF LEGENDS
            </motion.h2>
            <p className="font-code-sm text-code-sm text-secondary-fixed opacity-80 uppercase tracking-[0.25em] font-semibold">
            </p>
            <div className="flex justify-center mt-6">
              <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {legends.map((legend, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                key={i}
              >
                <TiltCard className={`group relative flex flex-col items-center justify-center p-8 cursor-pointer overflow-hidden ${getClipClass(i)}`}>
                  <div className={`absolute inset-0 border border-white/5 bg-surface-container-high/30 backdrop-blur-md transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-white/10 ${getClipClass(i)}`}></div>

                  <span className="card-corner card-corner--tl" />
                  <span className="card-corner card-corner--tr" />
                  <span className="card-corner card-corner--bl" />
                  <span className="card-corner card-corner--br" />

                  <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 z-10">
                    <div className={`absolute inset-0 rounded-full border animate-[spin_25s_linear_infinite] ${getRingBorderClass(i)}`}></div>
                    <div className="w-52 h-52 md:w-60 md:h-60 rounded-full overflow-hidden border-2 transition-all duration-500"
                         style={{
                           borderColor: "rgba(229, 226, 225, 0.18)"
                         }}>
                      <img
                        alt={`${legend.title} Core`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={legend.img}
                      />
                    </div>
                  </div>
                  <div className="relative z-10 text-center space-y-2">
                    <h3 className="font-headline-md text-[20px] text-primary uppercase tracking-widest font-bold group-hover:text-glow transition-all">
                      {legend.title}
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <span className="font-code-sm text-[11px] text-on-surface-variant/70 font-medium">
                        STABILITY: {legend.stability}
                      </span>
                      <span className="w-1 h-1 bg-primary/40 rounded-full"></span>
                      <span className="font-code-sm text-[11px] text-secondary-fixed font-bold tracking-wider">
                        STATUS: {legend.status}
                      </span>
                    </div>

                    <div className="pt-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      <button className="know-more-btn font-label-caps text-[11px] tracking-[0.2em] uppercase px-5 py-2">
                        Know More
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          <div className="mt-20 flex flex-col items-center gap-4">
            <div className="font-code-sm text-[12px] text-primary/40 uppercase tracking-[0.35em] font-semibold">End of Vault</div>
            <div className="h-[2px] w-full max-w-sm bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
          </div>
        </div>
      </section>

      <footer className="relative py-16 w-full border-t border-primary/20 bg-[#070707] font-body-md overflow-hidden">
        <div className="max-w-container-max mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="font-headline-md text-[24px] text-primary tracking-tighter text-glow flex items-center gap-2 font-bold">
                  <img
                    alt="TECHFEST_26 Logo"
                    src="/images/tf-logo.png"
                    className="h-8 w-8 rounded-full object-cover filter brightness-110 border border-primary/20"
                  />
                  TECHFEST 2k26
                </div>
                <div className="font-label-caps text-[12px] text-secondary-fixed opacity-70 tracking-[0.3em] font-bold">IIT BOMBAY</div>
              </div>
              <p className="font-body-md text-on-surface-variant/80 max-w-sm leading-relaxed text-[15px]">
                TECHFEST 2k26 — Asia's largest science and technology festival. 30th edition.
              </p>
              <div className="mt-4 p-4 border border-primary/15 bg-primary/5 rounded-sm inline-block self-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#00f3ff]"></div>
                    <span className="font-code-sm text-[11px] text-primary-container uppercase tracking-widest font-bold">
                      SYSTEMS ONLINE
                    </span>
                  </div>
                  <div className="font-code-sm text-[11px] text-on-surface-variant/60 uppercase tracking-wider font-medium">
                    POWAI, MUMBAI // 19.13°N 72.91°E
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-4">
                <h4 className="font-headline-md text-[14px] text-primary uppercase tracking-[0.2em] mb-2 font-bold">FESTIVAL</h4>
                <nav className="flex flex-col gap-2">
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _ABOUT
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _THEME
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _SCHEDULE
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _VENUE
                  </a>
                </nav>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-headline-md text-[14px] text-primary uppercase tracking-[0.2em] mb-2 font-bold">COMPETE</h4>
                <nav className="flex flex-col gap-2">
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _EVENTS
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _WORKSHOPS
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _OLYMPIAD
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _LECTURES
                  </a>
                </nav>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-headline-md text-[14px] text-primary uppercase tracking-[0.2em] mb-2 font-bold">ENGAGE</h4>
                <nav className="flex flex-col gap-2">
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _SPEAKERS
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _SPONSORS
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _MEDIA
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _PRESS
                  </a>
                </nav>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-headline-md text-[14px] text-primary uppercase tracking-[0.2em] mb-2 font-bold">CONNECT</h4>
                <nav className="flex flex-col gap-2">
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _INSTAGRAM
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _X_TWITTER
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _LINKEDIN
                  </a>
                  <a className="font-code-sm text-[13px] text-on-surface-variant hover:text-primary hover:text-glow transition-all" href="#">
                    _YOUTUBE
                  </a>
                </nav>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-code-sm text-[10px] text-on-surface-variant/40 uppercase tracking-[0.4em] font-medium">
              DEVELOPED BY VIBHAV PATEL
            </div>
            <div className="font-code-sm text-[10px] text-primary/60 uppercase tracking-[0.4em] flex items-center gap-2 font-semibold">
              <span className="">V30.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
              <span className="">BUILD//CYBORG.RENAISSANCE</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-2 opacity-5 pointer-events-none">
          <div className="font-code-sm text-[80px] leading-none select-none">11111101010</div>
        </div>
      </footer>

    </>
  );
}
