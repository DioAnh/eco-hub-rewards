import { useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CyberFooter = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = {
    product: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Eco-Score", href: "/eco-score" },
      { label: "Green Avatar", href: "/avatar" },
      { label: "Staking Vault", href: "/staking" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Whitepaper", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Smart Contracts", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    legal: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  };

  const socialLinks = [
    { 
      name: "Twitter", 
      href: "https://twitter.com/ecoshop_sui",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    { 
      name: "Discord", 
      href: "https://discord.gg/ecoshop",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    { 
      name: "Telegram", 
      href: "https://t.me/ecoshop_community",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ];

  const FooterLink = ({ href, label, isInternal = false }: { href: string; label: string; isInternal?: boolean }) => {
    const isHovered = hoveredLink === label;
    
    const content = (
      <span className="relative inline-block">
        <span
          className={`font-mono text-xs transition-colors duration-200 ${
            isHovered ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {label}
        </span>
        {/* Blinking cursor underline */}
        {isHovered && (
          <motion.span
            className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="absolute right-0 top-0 w-1.5 h-2 bg-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.span>
        )}
      </span>
    );

    if (isInternal) {
      return (
        <Link
          to={href}
          className="block py-1"
          onMouseEnter={() => setHoveredLink(label)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className="block py-1"
        onMouseEnter={() => setHoveredLink(label)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {content}
      </a>
    );
  };

  return (
    <footer 
      className="relative py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(0 0% 0%) 0%, hsl(180 10% 3%) 100%)',
        borderTop: '1px solid hsl(120 100% 50% / 0.2)',
      }}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(120 100% 50% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(120 100% 50% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div 
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
                style={{
                  background: 'hsl(120 100% 50% / 0.1)',
                  border: '1px solid hsl(120 100% 50% / 0.5)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  boxShadow: '0 0 20px hsl(120 100% 50% / 0.2)',
                }}
              >
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono text-lg text-primary neon-text">EcoShop</span>
            </Link>
            <p className="font-mono text-xs text-muted-foreground mb-4 leading-relaxed">
              {"// "} Circular Economy Hub on Sui Network. Monetizing carbon reduction behavior.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'hsl(0 0% 0%)',
                    border: '1px solid hsl(120 100% 50% / 0.3)',
                  }}
                  aria-label={social.name}
                >
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {social.icon}
                  </span>
                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: '0 0 15px hsl(120 100% 50% / 0.4), inset 0 0 10px hsl(120 100% 50% / 0.1)',
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 
              className="font-mono text-xs uppercase tracking-wider mb-4"
              style={{ color: 'hsl(120 100% 50%)' }}
            >
              {"<"} Product {"/>"}
            </h4>
            <ul className="space-y-1">
              {links.product.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} isInternal />
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 
              className="font-mono text-xs uppercase tracking-wider mb-4"
              style={{ color: 'hsl(180 100% 50%)' }}
            >
              {"<"} Resources {"/>"}
            </h4>
            <ul className="space-y-1">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 
              className="font-mono text-xs uppercase tracking-wider mb-4"
              style={{ color: 'hsl(280 100% 60%)' }}
            >
              {"<"} Company {"/>"}
            </h4>
            <ul className="space-y-1">
              {links.company.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 
              className="font-mono text-xs uppercase tracking-wider mb-4"
              style={{ color: 'hsl(45 100% 50%)' }}
            >
              {"<"} Legal {"/>"}
            </h4>
            <ul className="space-y-1">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid hsl(120 100% 50% / 0.15)' }}
        >
          <p className="font-mono text-xs text-muted-foreground">
            {"// "} © 2024 EcoShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-muted-foreground">Powered by</span>
            <div className="flex items-center gap-2">
              <span 
                className="px-2 py-0.5"
                style={{
                  background: 'hsl(210 100% 50% / 0.1)',
                  border: '1px solid hsl(210 100% 50% / 0.3)',
                  color: 'hsl(210 100% 60%)',
                }}
              >
                SUI
              </span>
              <Zap className="w-3 h-3 text-primary" />
              <span 
                className="px-2 py-0.5"
                style={{
                  background: 'hsl(120 100% 50% / 0.1)',
                  border: '1px solid hsl(120 100% 50% / 0.3)',
                  color: 'hsl(120 100% 50%)',
                }}
              >
                MOVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, hsl(120 100% 50% / 0.05) 0%, transparent 70%)',
        }}
      />
    </footer>
  );
};

export default CyberFooter;