/**
 * ============================================================================
 *  بوصلة · Bawsala — قاعدة بيانات التخصصات البينية الكاملة
 *  Complete Interdisciplinary Fields Database
 * ----------------------------------------------------------------------------
 *  Version : 2.0 (rebuilt)
 *  Coverage: 13 groups · 166 interdisciplinary fields
 *  Axes    : maturity · formation pattern · market demand · Arabic relevance
 * ============================================================================
 */

export type Maturity = "institutionalized" | "established" | "emerging" | "frontier";
export type Demand = "high" | "medium" | "low";
export type Relevance = "high" | "medium" | "low";

export interface InterField {
  ar: string;
  en: string;
  /** نضج الحقل مؤسسياً */
  maturity: Maturity;
  /** مستوى الطلب في سوق العمل */
  demand: Demand;
  /** الملاءمة للسياق العربي */
  arabicRelevance: Relevance;
}

export interface InterGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  /** نمط التكوين البيني للمجموعة */
  pattern: string;
  fields: InterField[];
}

export const MATURITY_LABELS: Record<Maturity, { ar: string; color: string }> = {
  institutionalized: { ar: "مؤسسي راسخ", color: "#166534" },
  established:       { ar: "مستقر",      color: "#1D6FAB" },
  emerging:          { ar: "ناشئ",       color: "#B45309" },
  frontier:          { ar: "حدودي",      color: "#9D174D" },
};

export const INTERDISCIPLINARY_GROUPS: InterGroup[] = [
  {
    id: "bio_x", nameAr: "الحقول الحيوية Bio-X", nameEn: "Bio-X Fields", icon: "🧬",
    pattern: "علم أساسي + علوم الحياة",
    fields: [
      { ar: "المعلوماتية الحيوية", en: "Bioinformatics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الفيزياء الحيوية", en: "Biophysics", maturity: "institutionalized", demand: "medium", arabicRelevance: "medium" },
      { ar: "الإحصاء الحيوي", en: "Biostatistics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الهندسة الحيوية", en: "Bioengineering", maturity: "institutionalized", demand: "high", arabicRelevance: "medium" },
      { ar: "البيولوجيا الحاسوبية", en: "Computational Biology", maturity: "established", demand: "high", arabicRelevance: "medium" },
      { ar: "بيولوجيا النظم", en: "Systems Biology", maturity: "established", demand: "medium", arabicRelevance: "low" },
      { ar: "البيولوجيا التركيبية", en: "Synthetic Biology", maturity: "emerging", demand: "medium", arabicRelevance: "low" },
      { ar: "المواد الحيوية", en: "Biomaterials", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "الميكانيكا الحيوية", en: "Biomechanics", maturity: "institutionalized", demand: "medium", arabicRelevance: "medium" },
      { ar: "الأحياء الفلكية", en: "Astrobiology", maturity: "emerging", demand: "low", arabicRelevance: "low" },
      { ar: "الجغرافيا الحيوية", en: "Biogeography", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "الآثار الحيوية", en: "Bioarchaeology", maturity: "established", demand: "low", arabicRelevance: "high" },
      { ar: "الأخلاقيات الحيوية", en: "Bioethics", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "اللسانيات الحيوية", en: "Biolinguistics", maturity: "emerging", demand: "low", arabicRelevance: "low" },
      { ar: "البيونيات (المحاكاة الحيوية)", en: "Bionics / Biomimetics", maturity: "emerging", demand: "medium", arabicRelevance: "low" },
      { ar: "علم الأحياء الزمني", en: "Chronobiology", maturity: "established", demand: "low", arabicRelevance: "low" },
    ],
  },
  {
    id: "neuro_x", nameAr: "الحقول العصبية Neuro-X", nameEn: "Neuro-X Fields", icon: "🧠",
    pattern: "علم الأعصاب + مجال آخر",
    fields: [
      { ar: "علم الأعصاب المعرفي", en: "Cognitive Neuroscience", maturity: "institutionalized", demand: "medium", arabicRelevance: "medium" },
      { ar: "علم الأعصاب الحاسوبي", en: "Computational Neuroscience", maturity: "established", demand: "medium", arabicRelevance: "low" },
      { ar: "الاقتصاد العصبي", en: "Neuroeconomics", maturity: "emerging", demand: "low", arabicRelevance: "low" },
      { ar: "التسويق العصبي", en: "Neuromarketing", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "هندسة الأعصاب", en: "Neuroengineering", maturity: "emerging", demand: "medium", arabicRelevance: "low" },
      { ar: "اللسانيات العصبية", en: "Neurolinguistics", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "علم النفس العصبي", en: "Neuropsychology", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "التربية العصبية", en: "Neuroeducation / Educational Neuroscience", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "أخلاقيات الأعصاب", en: "Neuroethics", maturity: "emerging", demand: "low", arabicRelevance: "medium" },
      { ar: "القانون العصبي", en: "Neurolaw", maturity: "frontier", demand: "low", arabicRelevance: "low" },
      { ar: "علم الأعصاب الاجتماعي", en: "Social Neuroscience", maturity: "emerging", demand: "low", arabicRelevance: "low" },
      { ar: "واجهات الدماغ والحاسوب", en: "Brain-Computer Interfaces", maturity: "frontier", demand: "medium", arabicRelevance: "low" },
    ],
  },
  {
    id: "geo_x", nameAr: "الحقول الجيولوجية والمكانية Geo-X", nameEn: "Geo-X Fields", icon: "🌍",
    pattern: "علوم الأرض/المكان + مجال آخر",
    fields: [
      { ar: "الجيوماتكس (المعلوماتية المكانية)", en: "Geomatics / Geoinformatics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الإحصاء المكاني", en: "Geostatistics", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "الجيوكيمياء", en: "Geochemistry", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "الجيوفيزياء", en: "Geophysics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الآثار الجيولوجية", en: "Geoarchaeology", maturity: "established", demand: "low", arabicRelevance: "high" },
      { ar: "الجيوبوليتيك", en: "Geopolitics", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "الجيواقتصاد", en: "Geoeconomics", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "الجغرافيا الطبية والصحية", en: "Medical / Health Geography", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "الهندسة الجيولوجية للمناخ", en: "Geoengineering (Climate)", maturity: "frontier", demand: "low", arabicRelevance: "low" },
      { ar: "السياحة الجيولوجية", en: "Geotourism", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "جيولوجيا الكواكب", en: "Planetary Geology", maturity: "established", demand: "low", arabicRelevance: "low" },
      { ar: "الميكروبيولوجيا الجيولوجية", en: "Geomicrobiology", maturity: "emerging", demand: "low", arabicRelevance: "low" },
    ],
  },
  {
    id: "eco_env_x", nameAr: "الحقول البيئية والاستدامة", nameEn: "Environmental & Sustainability Fields", icon: "🌱",
    pattern: "البيئة + علم اجتماعي/تطبيقي",
    fields: [
      { ar: "الاقتصاد البيئي", en: "Environmental Economics", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "القانون البيئي", en: "Environmental Law", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "الهندسة البيئية", en: "Environmental Engineering", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "علم النفس البيئي", en: "Environmental Psychology", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "الصحة البيئية", en: "Environmental Health", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "علم السموم البيئية", en: "Ecotoxicology", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "الإيكولوجيا الصناعية", en: "Industrial Ecology", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "الإيكولوجيا السياسية", en: "Political Ecology", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "الإيكولوجيا الحضرية", en: "Urban Ecology", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "علوم الاستدامة", en: "Sustainability Science", maturity: "emerging", demand: "high", arabicRelevance: "high" },
      { ar: "علوم المناخ", en: "Climate Science", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الزراعة الإيكولوجية", en: "Agroecology", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "الكيمياء الخضراء", en: "Green Chemistry", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "الهيدرولوجيا البيئية", en: "Ecohydrology", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "علوم الحفاظ على التنوع", en: "Conservation Science", maturity: "established", demand: "medium", arabicRelevance: "medium" },
    ],
  },
  {
    id: "computational_x", nameAr: "الحقول الحاسوبية Computational-X", nameEn: "Computational-X Fields", icon: "💻",
    pattern: "الحوسبة + مجال معرفي",
    fields: [
      { ar: "اللسانيات الحاسوبية ومعالجة العربية", en: "Computational Linguistics & Arabic NLP", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الكيمياء الحاسوبية", en: "Computational Chemistry", maturity: "established", demand: "medium", arabicRelevance: "low" },
      { ar: "الفيزياء الحاسوبية", en: "Computational Physics", maturity: "established", demand: "medium", arabicRelevance: "low" },
      { ar: "العلوم الاجتماعية الحاسوبية", en: "Computational Social Science", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "التمويل الحاسوبي", en: "Computational Finance", maturity: "established", demand: "high", arabicRelevance: "medium" },
      { ar: "المعلوماتية الصحية", en: "Health Informatics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "المعلوماتية الكيميائية", en: "Cheminformatics", maturity: "established", demand: "medium", arabicRelevance: "low" },
      { ar: "الآثار الحاسوبية", en: "Computational Archaeology", maturity: "emerging", demand: "low", arabicRelevance: "high" },
      { ar: "علم الموسيقى الحاسوبي", en: "Computational Musicology", maturity: "frontier", demand: "low", arabicRelevance: "low" },
      { ar: "الحوسبة الكمومية", en: "Quantum Computing", maturity: "frontier", demand: "medium", arabicRelevance: "low" },
      { ar: "التفاعل بين الإنسان والحاسب", en: "Human-Computer Interaction (HCI)", maturity: "institutionalized", demand: "high", arabicRelevance: "medium" },
      { ar: "صحافة البيانات", en: "Data Journalism", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "التنقيب في البيانات التعليمية", en: "Educational Data Mining", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "الروبوتات الاجتماعية", en: "Social Robotics", maturity: "frontier", demand: "low", arabicRelevance: "low" },
      { ar: "الرؤية الحاسوبية الطبية", en: "Medical Computer Vision", maturity: "emerging", demand: "high", arabicRelevance: "medium" },
      { ar: "القانون الحاسوبي والتقنية القانونية", en: "Computational Law / LegalTech", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
    ],
  },
  {
    id: "socio_x", nameAr: "الحقول الاجتماعية البينية Socio-X", nameEn: "Socio-X Fields", icon: "👥",
    pattern: "علم الاجتماع + مجال آخر",
    fields: [
      { ar: "اللسانيات الاجتماعية", en: "Sociolinguistics", maturity: "institutionalized", demand: "low", arabicRelevance: "high" },
      { ar: "الاقتصاد الاجتماعي", en: "Socioeconomics", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "الوبائيات الاجتماعية", en: "Social Epidemiology", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "المعلوماتية الاجتماعية", en: "Social Informatics", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "الدراسات الاجتماعية القانونية", en: "Socio-Legal Studies", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات العلم والتقنية والمجتمع STS", en: "Science, Technology & Society", maturity: "institutionalized", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات الهجرة واللاجئين", en: "Migration & Refugee Studies", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "دراسات التنمية", en: "Development Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "دراسات السلام والصراع", en: "Peace & Conflict Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "الدراسات الحضرية", en: "Urban Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "الدراسات الثقافية", en: "Cultural Studies", maturity: "institutionalized", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات الأسرة والطفولة", en: "Family & Childhood Studies", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "علم الشيخوخة الاجتماعي", en: "Social Gerontology", maturity: "established", demand: "medium", arabicRelevance: "medium" },
    ],
  },
  {
    id: "psycho_x", nameAr: "الحقول النفسية البينية Psycho-X", nameEn: "Psycho-X Fields", icon: "🧩",
    pattern: "علم النفس + مجال آخر",
    fields: [
      { ar: "اللسانيات النفسية", en: "Psycholinguistics", maturity: "institutionalized", demand: "low", arabicRelevance: "medium" },
      { ar: "الفيزياء النفسية", en: "Psychophysics", maturity: "established", demand: "low", arabicRelevance: "low" },
      { ar: "علم النفس الحيوي", en: "Psychobiology / Biopsychology", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "علم نفس الصحة", en: "Health Psychology", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "علم النفس السياسي", en: "Political Psychology", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "الاقتصاد السلوكي", en: "Behavioral Economics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "القياس النفسي", en: "Psychometrics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "علم النفس السيبراني", en: "Cyberpsychology", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "علم النفس التطوري", en: "Evolutionary Psychology", maturity: "established", demand: "low", arabicRelevance: "low" },
      { ar: "علم نفس المستهلك", en: "Consumer Psychology", maturity: "established", demand: "high", arabicRelevance: "high" },
    ],
  },
  {
    id: "health_x", nameAr: "الحقول الصحية البينية Health-X", nameEn: "Health-X Fields", icon: "⚕️",
    pattern: "الصحة + علم اجتماعي/تقني",
    fields: [
      { ar: "الصحة العالمية", en: "Global Health", maturity: "institutionalized", demand: "medium", arabicRelevance: "medium" },
      { ar: "الصحة الواحدة", en: "One Health", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "الأنثروبولوجيا الطبية", en: "Medical Anthropology", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "علم الاجتماع الطبي", en: "Medical Sociology", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "اقتصاديات الصحة", en: "Health Economics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "الإنسانيات الطبية", en: "Medical Humanities", maturity: "emerging", demand: "low", arabicRelevance: "low" },
      { ar: "الصحة الرقمية والطب عن بعد", en: "Digital Health & Telemedicine", maturity: "emerging", demand: "high", arabicRelevance: "high" },
      { ar: "علم الأدوية الجينومي", en: "Pharmacogenomics", maturity: "emerging", demand: "medium", arabicRelevance: "low" },
      { ar: "التغذية الجينومية", en: "Nutrigenomics", maturity: "frontier", demand: "low", arabicRelevance: "low" },
      { ar: "طب الرياضة", en: "Sports Medicine", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "أخلاقيات الطب", en: "Medical Ethics", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "الفقه الطبي (النوازل الطبية)", en: "Islamic Medical Jurisprudence", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "معلوماتية التمريض", en: "Nursing Informatics", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
    ],
  },
  {
    id: "techno_x", nameAr: "الحقول التقنية والهندسية البينية", nameEn: "Techno-Engineering Fields", icon: "⚙️",
    pattern: "هندسة + هندسة/علم آخر",
    fields: [
      { ar: "الميكاترونيات", en: "Mechatronics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "تقنية النانو", en: "Nanotechnology", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "علوم وهندسة المواد", en: "Materials Science & Engineering", maturity: "institutionalized", demand: "high", arabicRelevance: "medium" },
      { ar: "الفوتونيات", en: "Photonics", maturity: "established", demand: "medium", arabicRelevance: "low" },
      { ar: "الهندسة الكمومية", en: "Quantum Engineering", maturity: "frontier", demand: "medium", arabicRelevance: "low" },
      { ar: "هندسة النظم", en: "Systems Engineering", maturity: "institutionalized", demand: "high", arabicRelevance: "medium" },
      { ar: "نظم الطاقة الذكية", en: "Smart Energy Systems", maturity: "emerging", demand: "high", arabicRelevance: "high" },
      { ar: "التصنيع الإضافي (الطباعة ثلاثية الأبعاد)", en: "Additive Manufacturing", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "النظم ذاتية القيادة", en: "Autonomous Systems", maturity: "emerging", demand: "medium", arabicRelevance: "low" },
      { ar: "التقنيات القابلة للارتداء", en: "Wearable Technology", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "إنترنت الأشياء الصناعي", en: "Industrial IoT", maturity: "emerging", demand: "high", arabicRelevance: "medium" },
    ],
  },
  {
    id: "econ_business_x", nameAr: "الحقول الاقتصادية والأعمال البينية", nameEn: "Econ-Business Fields", icon: "📈",
    pattern: "اقتصاد/أعمال + تقنية/علم آخر",
    fields: [
      { ar: "التقنية المالية FinTech", en: "Financial Technology (FinTech)", maturity: "emerging", demand: "high", arabicRelevance: "high" },
      { ar: "التمويل السلوكي", en: "Behavioral Finance", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "الفيزياء الاقتصادية", en: "Econophysics", maturity: "frontier", demand: "low", arabicRelevance: "low" },
      { ar: "الاقتصاد الزراعي", en: "Agricultural Economics", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "اقتصاديات الثقافة والإبداع", en: "Cultural & Creative Economics", maturity: "emerging", demand: "low", arabicRelevance: "medium" },
      { ar: "اقتصاديات الرياضة", en: "Sports Economics", maturity: "emerging", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات السياحة", en: "Tourism Studies", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "علوم اللوجستيات وسلاسل الإمداد", en: "Logistics & Supply Chain Science", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "دراسات الابتكار", en: "Innovation Studies", maturity: "established", demand: "medium", arabicRelevance: "medium" },
      { ar: "ريادة الأعمال الاجتماعية", en: "Social Entrepreneurship", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "التقنية التنظيمية RegTech", en: "Regulatory Technology (RegTech)", maturity: "frontier", demand: "medium", arabicRelevance: "medium" },
      { ar: "اقتصاديات المنصات والاقتصاد الرقمي", en: "Platform & Digital Economics", maturity: "emerging", demand: "high", arabicRelevance: "high" },
    ],
  },
  {
    id: "media_culture_x", nameAr: "الحقول الإعلامية والثقافية البينية", nameEn: "Media-Culture Fields", icon: "📰",
    pattern: "إعلام/ثقافة + تقنية/علم آخر",
    fields: [
      { ar: "دراسات الإعلام", en: "Media Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "دراسات الألعاب", en: "Game Studies", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "فنون الوسائط الرقمية", en: "Digital Media Arts", maturity: "established", demand: "high", arabicRelevance: "high" },
      { ar: "الاتصال العلمي", en: "Science Communication", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "الثقافة البصرية", en: "Visual Culture Studies", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات الترجمة", en: "Translation Studies", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "السيميائيات (علم العلامات)", en: "Semiotics", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات الإنترنت", en: "Internet Studies", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "تصميم الاتصال", en: "Communication Design", maturity: "established", demand: "high", arabicRelevance: "high" },
      { ar: "الإنسانيات الرقمية", en: "Digital Humanities", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "رقمنة التراث الثقافي", en: "Digital Cultural Heritage", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
    ],
  },
  {
    id: "law_policy_x", nameAr: "حقول القانون والسياسات والأمن البينية", nameEn: "Law-Policy-Security Fields", icon: "⚖️",
    pattern: "قانون/سياسات + تقنية/مجتمع",
    fields: [
      { ar: "أخلاقيات الذكاء الاصطناعي", en: "AI Ethics", maturity: "emerging", demand: "high", arabicRelevance: "high" },
      { ar: "سياسات التقنية", en: "Technology Policy", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "دراسات حقوق الإنسان", en: "Human Rights Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "العلوم التنظيمية", en: "Regulatory Science", maturity: "emerging", demand: "medium", arabicRelevance: "medium" },
      { ar: "الدراسات الأمنية", en: "Security Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "دراسات الاستخبارات", en: "Intelligence Studies", maturity: "established", demand: "low", arabicRelevance: "medium" },
      { ar: "دراسات الكوارث والأزمات", en: "Disaster & Crisis Studies", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "سياسات الطاقة", en: "Energy Policy", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "سياسات الغذاء والأمن الغذائي", en: "Food Policy & Security", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "حوكمة البيانات والخصوصية", en: "Data Governance & Privacy", maturity: "emerging", demand: "high", arabicRelevance: "high" },
    ],
  },
  {
    id: "islamic_x", nameAr: "الحقول البينية الإسلامية والعربية", nameEn: "Islamic & Arabic Interdisciplinary Fields", icon: "🕌",
    pattern: "علوم شرعية/عربية + مجال معاصر",
    fields: [
      { ar: "الاقتصاد الإسلامي", en: "Islamic Economics", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "التمويل الإسلامي", en: "Islamic Finance", maturity: "institutionalized", demand: "high", arabicRelevance: "high" },
      { ar: "التقنية المالية الإسلامية", en: "Islamic FinTech", maturity: "emerging", demand: "high", arabicRelevance: "high" },
      { ar: "علوم الحلال", en: "Halal Science & Standards", maturity: "established", demand: "high", arabicRelevance: "high" },
      { ar: "الأخلاقيات الحيوية الإسلامية", en: "Islamic Bioethics", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "علم النفس الإسلامي (التأصيل)", en: "Islamic Psychology", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "دراسات الوقف والزكاة", en: "Waqf & Zakat Studies", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "مقاصد الشريعة والسياسات العامة", en: "Maqasid & Public Policy", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "الحوسبة القرآنية والتراثية", en: "Quranic & Heritage Computing", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "معالجة اللغة العربية الطبيعية", en: "Arabic Natural Language Processing", maturity: "established", demand: "high", arabicRelevance: "high" },
      { ar: "الفلك الشرعي (المواقيت والأهلة)", en: "Islamic Astronomy (Timekeeping)", maturity: "established", demand: "low", arabicRelevance: "high" },
      { ar: "العمارة والفنون الإسلامية", en: "Islamic Art & Architecture Studies", maturity: "institutionalized", demand: "medium", arabicRelevance: "high" },
      { ar: "التربية الإسلامية المعاصرة", en: "Contemporary Islamic Education", maturity: "established", demand: "medium", arabicRelevance: "high" },
      { ar: "الإعلام الإسلامي والدعوة الرقمية", en: "Islamic Media & Digital Da'wah", maturity: "emerging", demand: "medium", arabicRelevance: "high" },
      { ar: "السياحة الحلال", en: "Halal Tourism", maturity: "emerging", demand: "high", arabicRelevance: "high" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getInterStats() {
  const all = INTERDISCIPLINARY_GROUPS.flatMap((g) => g.fields);
  return {
    groups: INTERDISCIPLINARY_GROUPS.length,
    fields: all.length,
    byMaturity: {
      institutionalized: all.filter((f) => f.maturity === "institutionalized").length,
      established: all.filter((f) => f.maturity === "established").length,
      emerging: all.filter((f) => f.maturity === "emerging").length,
      frontier: all.filter((f) => f.maturity === "frontier").length,
    },
    highDemand: all.filter((f) => f.demand === "high").length,
    highArabicRelevance: all.filter((f) => f.arabicRelevance === "high").length,
  };
}

export function searchInterFields(query: string): { group: InterGroup; field: InterField }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: { group: InterGroup; field: InterField }[] = [];
  for (const g of INTERDISCIPLINARY_GROUPS)
    for (const f of g.fields)
      if (f.ar.includes(query) || f.en.toLowerCase().includes(q)) out.push({ group: g, field: f });
  return out;
}

export default INTERDISCIPLINARY_GROUPS;
