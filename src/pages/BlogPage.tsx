import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, ArrowRight, Tag } from "lucide-react";
import { MatrixBackground, CyberHeader, CyberMenu } from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

const BlogPage = () => {
  const featuredPost = {
    id: 1,
    title: "EcoShop Launches on Sui Mainnet: A New Era for Green Commerce",
    excerpt: "After months of development and testing, EcoShop is officially live on Sui Network. Learn about our journey and what this means for sustainable commerce.",
    author: "EcoShop Team",
    date: "2024-12-15",
    readTime: "8 min",
    category: "Announcement",
    image: "/placeholder.svg",
  };

  const posts = [
    {
      id: 2,
      title: "Understanding Eco-Score: How We Quantify Environmental Impact",
      excerpt: "Deep dive into our proprietary algorithm that measures and rewards sustainable behavior on the blockchain.",
      author: "Dr. Nguyen Van A",
      date: "2024-12-10",
      readTime: "12 min",
      category: "Technology",
    },
    {
      id: 3,
      title: "Partner Spotlight: GreenLife Store Joins EcoShop Marketplace",
      excerpt: "Meet one of our newest merchant partners and learn how they're revolutionizing eco-friendly retail.",
      author: "Marketing Team",
      date: "2024-12-05",
      readTime: "5 min",
      category: "Partnership",
    },
    {
      id: 4,
      title: "ECO Token Staking: Maximize Your Green Investment",
      excerpt: "A comprehensive guide to staking ECO tokens and earning passive rewards while supporting sustainability.",
      author: "Finance Team",
      date: "2024-11-28",
      readTime: "10 min",
      category: "Guide",
    },
    {
      id: 5,
      title: "The Future of Circular Economy: Web3 and Sustainability",
      excerpt: "Exploring how blockchain technology is reshaping the way we think about sustainable commerce.",
      author: "Research Team",
      date: "2024-11-20",
      readTime: "15 min",
      category: "Research",
    },
    {
      id: 6,
      title: "Community Update: Q4 2024 Roadmap Progress",
      excerpt: "Monthly update on our development progress, upcoming features, and community initiatives.",
      author: "EcoShop Team",
      date: "2024-11-15",
      readTime: "6 min",
      category: "Update",
    },
  ];

  const categories = ["All", "Announcement", "Technology", "Partnership", "Guide", "Research", "Update"];

  return (
    <>
      <Helmet>
        <title>Blog - EcoShop | News & Updates on Sustainable Commerce</title>
        <meta name="description" content="Stay updated with the latest news, guides, and insights from EcoShop - the leading circular economy platform on Sui Network." />
        <link rel="canonical" href="https://ecoshop.sui/blog" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />
        <CyberMenu />

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-mono text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK_TO_MAIN
              </Link>
            </motion.div>

            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                <span className="text-primary neon-text">BLOG</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Latest news, updates, and insights from the EcoShop ecosystem.
              </p>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  className={`px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all ${
                    index === 0
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/30 text-muted-foreground hover:border-primary/60"
                  }`}
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* Featured post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div
                className="grid md:grid-cols-2 gap-6 p-6 bg-black/80 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="aspect-video bg-primary/10 overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-primary/20 text-primary font-mono text-xs uppercase">
                      {featuredPost.category}
                    </span>
                    <span className="text-primary font-mono text-xs">FEATURED</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground font-mono mb-3 hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm mb-4 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="group p-5 bg-black/80 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer"
                  style={{
                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono text-primary uppercase">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-mono mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground font-mono text-xs mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <span className="flex items-center gap-1 text-primary font-mono text-xs group-hover:gap-2 transition-all">
                      READ_MORE <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Load more */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12"
            >
              <button
                className="px-8 py-3 border border-primary/50 hover:border-primary hover:bg-primary/10 font-mono text-sm uppercase tracking-wider text-primary transition-all"
                style={{
                  clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                }}
              >
                LOAD_MORE_POSTS
              </button>
            </motion.div>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default BlogPage;
