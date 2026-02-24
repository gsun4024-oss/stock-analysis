/**
 * 股识 StockWise — 经济学理论与投资大师智慧库
 * 融合国内外著名经济学家的投资理论
 */

export interface Theory {
  id: string;
  title: string;
  category: "technical" | "fundamental" | "behavioral" | "macro";
  author: string;
  authorEn: string;
  era: string;
  summary: string;
  keyPoints: string[];
  quote: string;
  quoteSource: string;
  application: string;
  icon: string;
}

export interface Investor {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  years: string;
  philosophy: string;
  keyPrinciples: string[];
  famousQuote: string;
  books: string[];
  avatar: string; // emoji
}

export const THEORIES: Theory[] = [
  {
    id: "dow",
    title: "道氏理论",
    category: "technical",
    author: "查尔斯·道",
    authorEn: "Charles Dow",
    era: "1900年代",
    summary: "股票市场技术分析的奠基理论，认为市场价格反映一切信息，趋势一旦形成便会持续，直到出现明确反转信号。",
    keyPoints: [
      "市场有三种趋势：主要趋势（一年以上）、次要趋势（数周至数月）、日常波动",
      "主要趋势分为牛市三阶段：积累期、公众参与期、过度投机期",
      "成交量应与趋势方向一致，量价背离是趋势反转的预警信号",
      "趋势在被明确反转之前应被视为仍在持续",
    ],
    quote: "市场价格反映了所有已知信息，价格的运动遵循可识别的趋势。",
    quoteSource: "《股市晴雨表》",
    application: "通过识别市场所处的趋势阶段，判断当前是积累、上涨还是派发阶段，从而做出相应的投资决策。",
    icon: "📈",
  },
  {
    id: "elliott",
    title: "艾略特波浪理论",
    category: "technical",
    author: "拉尔夫·纳尔逊·艾略特",
    authorEn: "Ralph Nelson Elliott",
    era: "1930年代",
    summary: "市场价格以波浪形式运动，由5浪上升和3浪下降构成一个完整周期，反映了人类集体心理的周期性变化。",
    keyPoints: [
      "上升趋势由5个浪组成（1、2、3、4、5浪），下降趋势由3个浪组成（A、B、C浪）",
      "第3浪通常是最强劲的上升浪，不能是最短的推动浪",
      "波浪遵循斐波那契数列比例关系（0.618、1.618等）",
      "波浪理论可应用于任何时间周期，具有分形特征",
    ],
    quote: "人类的活动遵循着一种可以辨认的模式，这种模式由波浪组成，并且可以被预测。",
    quoteSource: "《波浪原理》",
    application: "识别当前价格处于哪个波浪阶段，预判下一步走势方向和幅度，结合斐波那契回调位确定支撑阻力。",
    icon: "🌊",
  },
  {
    id: "graham",
    title: "价值投资理论",
    category: "fundamental",
    author: "本杰明·格雷厄姆",
    authorEn: "Benjamin Graham",
    era: "1930-1970年代",
    summary: "价值投资之父，主张以低于内在价值的价格购买股票，通过安全边际保护投资者免受判断错误的损失。",
    keyPoints: [
      "内在价值：基于公司基本面计算的真实价值，独立于市场价格",
      "安全边际：以内在价值的折扣价购买，通常要求30%以上的安全边际",
      "市场先生：将市场比作情绪化的合伙人，利用其非理性报价",
      "区分投资与投机：投资需要深入分析、本金安全和满意回报",
    ],
    quote: "投资艺术有一个特点不为大众所知：外行人不需要什么特殊才能或知识，只要具备一种能力——控制自己情绪的能力。",
    quoteSource: "《聪明的投资者》",
    application: "通过分析市盈率、市净率、股息率等基本面指标，寻找被市场低估的优质股票，以安全边际为核心原则。",
    icon: "💎",
  },
  {
    id: "buffett",
    title: "护城河投资理论",
    category: "fundamental",
    author: "沃伦·巴菲特",
    authorEn: "Warren Buffett",
    era: "1960年代至今",
    summary: "在格雷厄姆价值投资基础上发展而来，强调以合理价格购买具有持久竞争优势（护城河）的优质企业，长期持有。",
    keyPoints: [
      "经济护城河：品牌、专利、网络效应、成本优势、转换成本等持久竞争优势",
      "能力圈：只投资自己真正理解的业务领域",
      "集中投资：将资金集中于少数真正了解的优质公司",
      "长期持有：好公司的最佳持有期是永远",
    ],
    quote: "以合理的价格购买一家优秀的公司，远好于以优惠的价格购买一家普通的公司。",
    quoteSource: "伯克希尔·哈撒韦股东信",
    application: "分析企业的竞争壁垒、ROE（净资产收益率）、自由现金流等指标，寻找具有持久竞争优势且估值合理的企业。",
    icon: "🏰",
  },
  {
    id: "lynch",
    title: "成长股投资理论",
    category: "fundamental",
    author: "彼得·林奇",
    authorEn: "Peter Lynch",
    era: "1970-1990年代",
    summary: "麦哲伦基金传奇经理，主张普通投资者可以通过日常生活发现十倍股，强调PEG比率和行业研究的重要性。",
    keyPoints: [
      "PEG比率：市盈率/盈利增长率，PEG < 1 通常被认为低估",
      "十倍股特征：快速成长的细分行业龙头，产品简单易懂，有复制扩张能力",
      "了解你所投资的公司：能用三句话解释为什么买这只股票",
      "分散但有限：持有多只股票但每只都经过深入研究",
    ],
    quote: "在股票市场上，关键不在于你有多聪明，而在于你有多自律。",
    quoteSource: "《彼得·林奇的成功投资》",
    application: "利用PEG指标筛选成长股，关注消费、零售等日常生活领域，寻找高增长但估值合理的公司。",
    icon: "🚀",
  },
  {
    id: "soros",
    title: "反身性理论",
    category: "behavioral",
    author: "乔治·索罗斯",
    authorEn: "George Soros",
    era: "1980年代至今",
    summary: "市场参与者的认知与市场现实之间存在双向互动关系，投资者的预期会影响市场走势，市场走势反过来又影响投资者预期。",
    keyPoints: [
      "反身性：市场参与者的偏见会影响基本面，而非仅仅反映基本面",
      "繁荣-萧条周期：市场存在自我强化的上升和下降螺旋",
      "错误认知的利用：识别市场的主流偏见，在趋势确立后跟随，在极端时反向",
      "风险管理优先：生存是第一位的，保留在市场中的能力比任何单次交易更重要",
    ],
    quote: "我比大多数人更能认识到自己的错误，这就是我成功的秘密。",
    quoteSource: "《金融炼金术》",
    application: "识别市场中的主流叙事和偏见，判断繁荣-萧条周期所处阶段，在趋势初期介入，在极端情绪时保持警惕。",
    icon: "♻️",
  },
  {
    id: "simons",
    title: "量化投资理论",
    category: "technical",
    author: "詹姆斯·西蒙斯",
    authorEn: "James Simons",
    era: "1980年代至今",
    summary: "文艺复兴科技公司创始人，通过数学模型和统计分析发现市场中的规律性模式，实现超额收益。",
    keyPoints: [
      "数据驱动：基于大量历史数据挖掘统计规律，而非主观判断",
      "多因子模型：综合价格、成交量、宏观经济等多维度因子",
      "高频交易：利用短期价格异常获取微小但持续的超额收益",
      "严格风控：通过分散化和止损机制控制单一头寸风险",
    ],
    quote: "我们不雇用经济学家，我们雇用物理学家、数学家和统计学家。",
    quoteSource: "《征服市场的人》",
    application: "通过技术指标的量化组合，建立多因子评分体系，以数据而非情绪驱动投资决策。",
    icon: "🔢",
  },
  {
    id: "keynes",
    title: "选美理论",
    category: "behavioral",
    author: "约翰·梅纳德·凯恩斯",
    authorEn: "John Maynard Keynes",
    era: "1930年代",
    summary: "股票市场如同选美比赛，成功的投资者不是选择自己认为最美的，而是预测其他参与者会选择谁。",
    keyPoints: [
      "市场是短期投票机、长期称重机：短期由情绪驱动，长期由价值决定",
      "预期的预期：投资者需要预测其他投资者的行为，而非仅分析基本面",
      "动物精神：市场受到非理性的乐观或悲观情绪驱动",
      "流动性偏好：投资者倾向于持有流动性好的资产，影响资产定价",
    ],
    quote: "市场可以保持非理性的时间，比你保持偿债能力的时间更长。",
    quoteSource: "《就业、利息和货币通论》",
    application: "在市场情绪极端时保持理性，理解市场短期波动受情绪驱动，长期回归价值，避免追涨杀跌。",
    icon: "🎭",
  },
  {
    id: "fama",
    title: "有效市场假说",
    category: "macro",
    author: "尤金·法玛",
    authorEn: "Eugene Fama",
    era: "1960年代",
    summary: "2013年诺贝尔经济学奖得主，认为市场价格已充分反映所有可用信息，长期跑赢市场极为困难。",
    keyPoints: [
      "弱式有效：价格已反映所有历史价格信息，技术分析无法持续获利",
      "半强式有效：价格已反映所有公开信息，基本面分析无法持续获利",
      "强式有效：价格已反映所有信息（包括内幕），无人能持续跑赢市场",
      "因子投资：价值、规模、动量等因子可解释超额收益",
    ],
    quote: "在一个有效市场中，竞争会使得基于公开信息的超额利润趋近于零。",
    quoteSource: "《有效资本市场》",
    application: "理解市场有效性的局限，在市场非理性时寻找机会，通过指数化投资降低主动管理成本。",
    icon: "⚖️",
  },
  {
    id: "dalio",
    title: "全天候投资组合",
    category: "macro",
    author: "瑞·达利欧",
    authorEn: "Ray Dalio",
    era: "1990年代至今",
    summary: "桥水基金创始人，通过分散配置不同经济环境下表现良好的资产类别，实现风险平衡。",
    keyPoints: [
      "经济机器：经济运行如同机器，由信贷周期、债务周期和生产率驱动",
      "四个象限：经济增长/衰退 × 通胀/通缩，不同环境下不同资产表现各异",
      "风险平价：按风险而非资金比例分配投资组合",
      "原则驱动：建立系统化决策框架，减少情绪干扰",
    ],
    quote: "痛苦加反思等于进步。",
    quoteSource: "《原则》",
    application: "在不同宏观经济环境下，合理配置股票、债券、黄金、大宗商品等资产，实现风险分散。",
    icon: "🌐",
  },
];

export const INVESTORS: Investor[] = [
  {
    id: "buffett",
    name: "沃伦·巴菲特",
    nameEn: "Warren Buffett",
    title: "奥马哈先知 · 股神",
    years: "1930 - 至今",
    philosophy: "以合理价格购买优质企业，长期持有，让复利发挥魔力。",
    keyPrinciples: [
      "永远不要亏损本金",
      "只投资自己能理解的业务",
      "市场短期是投票机，长期是称重机",
      "别人贪婪时我恐惧，别人恐惧时我贪婪",
    ],
    famousQuote: "如果你不愿意持有一只股票十年，那就不要持有它十分钟。",
    books: ["《巴菲特致股东信》", "《滚雪球》"],
    avatar: "🧓",
  },
  {
    id: "graham",
    name: "本杰明·格雷厄姆",
    nameEn: "Benjamin Graham",
    title: "价值投资之父",
    years: "1894 - 1976",
    philosophy: "以低于内在价值的价格购买股票，安全边际是投资的核心原则。",
    keyPrinciples: [
      "区分投资与投机",
      "安全边际是成功投资的基石",
      "把市场波动视为机会而非风险",
      "分散投资降低单一风险",
    ],
    famousQuote: "股票市场短期是投票机，长期是称重机。",
    books: ["《证券分析》", "《聪明的投资者》"],
    avatar: "👨‍🏫",
  },
  {
    id: "lynch",
    name: "彼得·林奇",
    nameEn: "Peter Lynch",
    title: "传奇基金经理 · 十倍股猎手",
    years: "1944 - 至今",
    philosophy: "普通投资者拥有机构投资者不具备的优势——日常生活中发现投资机会。",
    keyPrinciples: [
      "投资你了解的公司",
      "PEG < 1 是价值洼地",
      "故事要简单，产品要看得见",
      "持续跟踪，及时调整",
    ],
    famousQuote: "在股票市场上，关键不在于你有多聪明，而在于你有多自律。",
    books: ["《彼得·林奇的成功投资》", "《战胜华尔街》"],
    avatar: "💼",
  },
  {
    id: "soros",
    name: "乔治·索罗斯",
    nameEn: "George Soros",
    title: "量子基金创始人 · 打败英格兰银行的男人",
    years: "1930 - 至今",
    philosophy: "市场总是错的，通过识别市场偏见并在趋势反转时获利。",
    keyPrinciples: [
      "市场参与者的认知影响市场",
      "识别繁荣-萧条周期",
      "生存第一，盈利第二",
      "在不确定中寻找确定性",
    ],
    famousQuote: "我比大多数人更能认识到自己的错误，这就是我成功的秘密。",
    books: ["《金融炼金术》", "《索罗斯谈索罗斯》"],
    avatar: "🎯",
  },
  {
    id: "munger",
    name: "查理·芒格",
    nameEn: "Charlie Munger",
    title: "巴菲特的黄金搭档 · 多元思维模型大师",
    years: "1924 - 2023",
    philosophy: "建立多学科思维模型，从不同角度分析问题，避免心理偏误。",
    keyPrinciples: [
      "多元思维模型：跨学科思考",
      "反向思维：想清楚如何失败",
      "能力圈：知道自己不知道什么",
      "耐心等待好机会",
    ],
    famousQuote: "告诉我我会死在哪里，我就永远不去那个地方。",
    books: ["《穷查理宝典》", "《查理·芒格的智慧》"],
    avatar: "🧠",
  },
  {
    id: "dalio",
    name: "瑞·达利欧",
    nameEn: "Ray Dalio",
    title: "桥水基金创始人 · 宏观对冲之王",
    years: "1949 - 至今",
    philosophy: "理解经济机器的运转规律，通过原则化决策和风险平价实现稳健回报。",
    keyPrinciples: [
      "极度透明和极度诚实",
      "理解经济周期和债务周期",
      "风险平价：按风险分配资产",
      "痛苦+反思=进步",
    ],
    famousQuote: "我最大的成功来自于我从失败中学到的东西。",
    books: ["《原则》", "《债务危机》"],
    avatar: "🌊",
  },
];

/**
 * 根据趋势获取相关理论推荐
 */
export function getRelevantTheories(trend: string): Theory[] {
  if (trend === "strong_up" || trend === "up") {
    return THEORIES.filter((t) => ["dow", "lynch", "buffett"].includes(t.id));
  }
  if (trend === "strong_down" || trend === "down") {
    return THEORIES.filter((t) => ["graham", "dalio", "keynes"].includes(t.id));
  }
  return THEORIES.filter((t) => ["elliott", "soros", "fama"].includes(t.id));
}

/**
 * 每日一句投资格言
 */
export const DAILY_QUOTES = [
  { quote: "在别人贪婪时恐惧，在别人恐惧时贪婪。", author: "沃伦·巴菲特" },
  { quote: "投资的第一条原则是不要亏损，第二条原则是不要忘记第一条。", author: "沃伦·巴菲特" },
  { quote: "股票市场短期是投票机，长期是称重机。", author: "本杰明·格雷厄姆" },
  { quote: "知道自己不知道什么，比知道很多东西更重要。", author: "查理·芒格" },
  { quote: "市场可以保持非理性的时间，比你保持偿债能力的时间更长。", author: "约翰·凯恩斯" },
  { quote: "不要把所有鸡蛋放在一个篮子里，但也不要放在太多篮子里。", author: "彼得·林奇" },
  { quote: "我比大多数人更能认识到自己的错误，这就是我成功的秘密。", author: "乔治·索罗斯" },
  { quote: "痛苦加反思等于进步。", author: "瑞·达利欧" },
  { quote: "复利是世界第八大奇迹，懂得它的人赚它，不懂的人付出它。", author: "阿尔伯特·爱因斯坦" },
  { quote: "时间是优秀企业的朋友，是平庸企业的敌人。", author: "沃伦·巴菲特" },
];
