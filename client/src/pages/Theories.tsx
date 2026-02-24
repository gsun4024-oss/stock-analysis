/**
 * 股识 StockWise — 投资理论页面
 * 设计风格：樱花渐变轻盈风
 * 展示国内外著名经济学家的投资理论与智慧
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { THEORIES, INVESTORS, type Theory } from "@/lib/theories";
import Navbar from "@/components/Navbar";

const CATEGORY_LABELS: Record<Theory["category"], string> = {
  technical: "技术分析",
  fundamental: "基本面分析",
  behavioral: "行为金融",
  macro: "宏观经济",
};

const CATEGORY_COLORS: Record<Theory["category"], { bg: string; text: string; border: string }> = {
  technical: { bg: "rgba(232,114,138,0.08)", text: "#C85A7A", border: "rgba(232,114,138,0.2)" },
  fundamental: { bg: "rgba(155,127,212,0.08)", text: "#7B5FC4", border: "rgba(155,127,212,0.2)" },
  behavioral: { bg: "rgba(244,149,106,0.08)", text: "#C4723A", border: "rgba(244,149,106,0.2)" },
  macro: { bg: "rgba(82,196,160,0.08)", text: "#2A9870", border: "rgba(82,196,160,0.2)" },
};

function TheoryCard({ theory }: { theory: Theory }) {
  const [expanded, setExpanded] = useState(false);
  const colors = CATEGORY_COLORS[theory.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-3xl flex-shrink-0 mt-0.5">{theory.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-base" style={{ fontFamily: "'Noto Serif SC', serif", color: "#2D2D3A" }}>
                  {theory.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                  {CATEGORY_LABELS[theory.category]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "#9B9BB8" }}>
                <span>{theory.author}</span>
                <span>·</span>
                <span>{theory.era}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#5A5A7A" }}>{theory.summary}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl flex-shrink-0 transition-all"
            style={{ background: "rgba(155,127,212,0.08)", color: "#9B7FD4" }}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(155,127,212,0.1)" }}>
                {/* 核心要点 */}
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: "#9B7FD4" }}>核心要点</p>
                  <ul className="space-y-1.5">
                    {theory.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                          style={{ background: colors.bg, color: colors.text }}>
                          {i + 1}
                        </span>
                        <span style={{ color: "#5A5A7A" }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 名言 */}
                <blockquote className="p-4 rounded-2xl mb-4" style={{ background: "rgba(232,114,138,0.05)", borderLeft: "3px solid #E8728A" }}>
                  <p className="text-sm italic leading-relaxed" style={{ color: "#5A5A7A", fontFamily: "'Noto Serif SC', serif" }}>
                    「{theory.quote}」
                  </p>
                  <p className="text-xs mt-2" style={{ color: "#9B9BB8" }}>— {theory.quoteSource}</p>
                </blockquote>

                {/* 实战应用 */}
                <div className="p-3 rounded-xl" style={{ background: "rgba(155,127,212,0.05)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#9B7FD4" }}>📌 实战应用</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#5A5A7A" }}>{theory.application}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function InvestorCard({ investor }: { investor: typeof INVESTORS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(232,114,138,0.1), rgba(155,127,212,0.1))" }}>
            {investor.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: "#2D2D3A" }}>
              {investor.name}
            </h3>
            <p className="text-xs" style={{ color: "#9B7FD4" }}>{investor.nameEn}</p>
            <p className="text-xs mt-0.5" style={{ color: "#9B9BB8" }}>{investor.title}</p>
            <p className="text-xs mt-0.5" style={{ color: "#BBBBCC" }}>{investor.years}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl flex-shrink-0"
            style={{ background: "rgba(155,127,212,0.08)", color: "#9B7FD4" }}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-sm mt-3 leading-relaxed" style={{ color: "#5A5A7A" }}>{investor.philosophy}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid rgba(155,127,212,0.1)" }}>
                {/* 核心原则 */}
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#9B7FD4" }}>核心投资原则</p>
                  <ul className="space-y-1.5">
                    {investor.keyPrinciples.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E8728A" }} />
                        <span style={{ color: "#5A5A7A" }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 名言 */}
                <blockquote className="p-4 rounded-2xl" style={{ background: "rgba(232,114,138,0.05)", borderLeft: "3px solid #E8728A" }}>
                  <p className="text-sm italic" style={{ color: "#5A5A7A", fontFamily: "'Noto Serif SC', serif" }}>
                    「{investor.famousQuote}」
                  </p>
                </blockquote>

                {/* 代表作 */}
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#9B7FD4" }}>代表著作</p>
                  <div className="flex flex-wrap gap-2">
                    {investor.books.map((book) => (
                      <span key={book} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(155,127,212,0.08)", color: "#7B5FC4", border: "1px solid rgba(155,127,212,0.15)" }}>
                        📖 {book}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Theories() {
  const [activeTab, setActiveTab] = useState<"theories" | "investors">("theories");
  const [activeCategory, setActiveCategory] = useState<Theory["category"] | "all">("all");

  const filteredTheories = activeCategory === "all"
    ? THEORIES
    : THEORIES.filter((t) => t.category === activeCategory);

  const categories: Array<{ key: Theory["category"] | "all"; label: string }> = [
    { key: "all", label: "全部" },
    { key: "technical", label: "技术分析" },
    { key: "fundamental", label: "基本面" },
    { key: "behavioral", label: "行为金融" },
    { key: "macro", label: "宏观经济" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FFF5F7 0%, #FAF0FF 50%, #F0F5FF 100%)" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm"
              style={{ background: "rgba(155,127,212,0.1)", color: "#9B7FD4" }}>
              <BookOpen className="w-4 h-4" />
              投资智慧库
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Noto Serif SC', serif", color: "#2D2D3A" }}>
              大师的智慧
            </h1>
            <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#7A7A9A" }}>
              汇集国内外著名经济学家与投资大师的核心理论，
              将百年金融智慧融入现代股票分析实践。
            </p>
          </motion.div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("theories")}
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeTab === "theories" ? "linear-gradient(135deg, #E8728A, #9B7FD4)" : "rgba(255,255,255,0.8)",
              color: activeTab === "theories" ? "white" : "#5A5A7A",
              boxShadow: activeTab === "theories" ? "0 4px 15px rgba(232,114,138,0.3)" : "none",
            }}
          >
            📚 投资理论 ({THEORIES.length})
          </button>
          <button
            onClick={() => setActiveTab("investors")}
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: activeTab === "investors" ? "linear-gradient(135deg, #9B7FD4, #E8728A)" : "rgba(255,255,255,0.8)",
              color: activeTab === "investors" ? "white" : "#5A5A7A",
              boxShadow: activeTab === "investors" ? "0 4px 15px rgba(155,127,212,0.3)" : "none",
            }}
          >
            🏆 投资大师 ({INVESTORS.length})
          </button>
        </div>

        {/* 理论分类筛选 */}
        {activeTab === "theories" && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Filter className="w-4 h-4" style={{ color: "#9B9BB8" }} />
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat.key ? "rgba(155,127,212,0.15)" : "rgba(255,255,255,0.7)",
                  color: activeCategory === cat.key ? "#9B7FD4" : "#7A7A9A",
                  border: activeCategory === cat.key ? "1px solid rgba(155,127,212,0.3)" : "1px solid transparent",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* 内容列表 */}
        <div className="space-y-4">
          {activeTab === "theories" && filteredTheories.map((theory) => (
            <TheoryCard key={theory.id} theory={theory} />
          ))}
          {activeTab === "investors" && INVESTORS.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-10 text-center">
          <div className="gradient-divider mb-6" />
          <p className="text-xs" style={{ color: "#BBBBCC" }}>
            以上理论仅供学习参考，投资有风险，入市需谨慎
          </p>
        </div>
      </div>
    </div>
  );
}
