/**
 * ============================================================================
 *  بوصلة · Bawsala — قاعدة بيانات الاختصارات والدرجات الأكاديمية
 *  Academic Degrees & Abbreviations Database
 * ----------------------------------------------------------------------------
 *  Version : 2.0 (rebuilt)
 *  Coverage: 18 groups · 131 abbreviations · 36 pathways · degree pathways (BBA→MBA→DBA)
 * ============================================================================
 */

export type DegreeLevel =
  | "diploma"
  | "bachelor"
  | "master"
  | "doctorate"
  | "professional_cert"
  | "fellowship"
  | "license";

export interface DegreeAbbreviation {
  abbr: string;
  en: string;
  ar: string;
  level: DegreeLevel;
}

export interface AbbreviationGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  /** المسارات الترقّوية النموذجية داخل المجموعة */
  pathways: string[];
  items: DegreeAbbreviation[];
}

export const ABBREVIATION_GROUPS: AbbreviationGroup[] = [
  {
    id: "business", nameAr: "إدارة الأعمال", nameEn: "Business & Management", icon: "💼",
    pathways: ["BBA → MBA → DBA", "BCom → MCom → PhD"],
    items: [
      { abbr: "BBA", en: "Bachelor of Business Administration", ar: "بكالوريوس إدارة الأعمال", level: "bachelor" },
      { abbr: "BCom", en: "Bachelor of Commerce", ar: "بكالوريوس التجارة", level: "bachelor" },
      { abbr: "MBA", en: "Master of Business Administration", ar: "ماجستير إدارة الأعمال", level: "master" },
      { abbr: "EMBA", en: "Executive MBA", ar: "ماجستير إدارة الأعمال التنفيذي", level: "master" },
      { abbr: "MCom", en: "Master of Commerce", ar: "ماجستير التجارة", level: "master" },
      { abbr: "MIM", en: "Master in Management", ar: "ماجستير في الإدارة", level: "master" },
      { abbr: "DBA", en: "Doctor of Business Administration", ar: "دكتوراه إدارة الأعمال (مهنية)", level: "doctorate" },
      { abbr: "MSc Mgmt", en: "Master of Science in Management", ar: "ماجستير العلوم في الإدارة", level: "master" },
      { abbr: "PMP", en: "Project Management Professional", ar: "محترف إدارة المشروعات", level: "professional_cert" },
    ],
  },
  {
    id: "finance_accounting", nameAr: "المحاسبة والتمويل (مهنية)", nameEn: "Accounting & Finance (Professional)", icon: "🧾",
    pathways: ["BCom/BSc → CPA/ACCA → شريك مراجعة", "BSc Finance → CFA I→II→III"],
    items: [
      { abbr: "CPA", en: "Certified Public Accountant", ar: "محاسب قانوني معتمد", level: "professional_cert" },
      { abbr: "ACCA", en: "Association of Chartered Certified Accountants", ar: "زمالة المحاسبين القانونيين المعتمدين (بريطانيا)", level: "fellowship" },
      { abbr: "CMA", en: "Certified Management Accountant", ar: "محاسب إداري معتمد", level: "professional_cert" },
      { abbr: "CFA", en: "Chartered Financial Analyst", ar: "محلل مالي معتمد", level: "professional_cert" },
      { abbr: "CIA", en: "Certified Internal Auditor", ar: "مراجع داخلي معتمد", level: "professional_cert" },
      { abbr: "FRM", en: "Financial Risk Manager", ar: "مدير مخاطر مالية معتمد", level: "professional_cert" },
      { abbr: "CFP", en: "Certified Financial Planner", ar: "مخطط مالي معتمد", level: "professional_cert" },
      { abbr: "CAMS", en: "Certified Anti-Money Laundering Specialist", ar: "أخصائي مكافحة غسل الأموال المعتمد", level: "professional_cert" },
      { abbr: "CSAA", en: "Certified Shariah Adviser & Auditor (AAOIFI)", ar: "مراقب ومدقق شرعي معتمد — أيوفي", level: "professional_cert" },
    ],
  },
  {
    id: "medicine", nameAr: "الطب البشري", nameEn: "Medicine", icon: "⚕️",
    pathways: ["MBBCh → MSc → MD/PhD", "MBBS → MRCP/FRCS → استشاري"],
    items: [
      { abbr: "MBBCh", en: "Bachelor of Medicine & Surgery", ar: "بكالوريوس الطب والجراحة (النظام المصري)", level: "bachelor" },
      { abbr: "MBBS", en: "Bachelor of Medicine, Bachelor of Surgery", ar: "بكالوريوس الطب والجراحة (النظام البريطاني)", level: "bachelor" },
      { abbr: "MD", en: "Doctor of Medicine", ar: "دكتوراه الطب / درجة الطب الأمريكية", level: "doctorate" },
      { abbr: "DO", en: "Doctor of Osteopathic Medicine", ar: "دكتور الطب العظمي (أمريكا)", level: "doctorate" },
      { abbr: "MSc (Med)", en: "Master of Science in Medicine", ar: "ماجستير العلوم الطبية", level: "master" },
      { abbr: "MCh", en: "Master of Surgery", ar: "ماجستير الجراحة", level: "master" },
      { abbr: "MRCP", en: "Membership of the Royal College of Physicians", ar: "عضوية الكلية الملكية للأطباء", level: "fellowship" },
      { abbr: "FRCS", en: "Fellowship of the Royal College of Surgeons", ar: "زمالة الكلية الملكية للجراحين", level: "fellowship" },
      { abbr: "دبلوم طبي", en: "Medical Specialty Diploma", ar: "دبلوم التخصص الطبي", level: "diploma" },
      { abbr: "FACS", en: "Fellow of the American College of Surgeons", ar: "زمالة الكلية الأمريكية للجراحين", level: "fellowship" },
    ],
  },
  {
    id: "dentistry_pharmacy", nameAr: "الأسنان والصيدلة", nameEn: "Dentistry & Pharmacy", icon: "🦷",
    pathways: ["BDS → MDS → PhD", "PharmD → Board Certification (BCPS)"],
    items: [
      { abbr: "BDS", en: "Bachelor of Dental Surgery", ar: "بكالوريوس طب وجراحة الفم والأسنان", level: "bachelor" },
      { abbr: "DDS", en: "Doctor of Dental Surgery", ar: "دكتور جراحة الأسنان (أمريكا)", level: "doctorate" },
      { abbr: "DMD", en: "Doctor of Dental Medicine", ar: "دكتور طب الأسنان (أمريكا)", level: "doctorate" },
      { abbr: "MDS", en: "Master of Dental Surgery", ar: "ماجستير جراحة الأسنان", level: "master" },
      { abbr: "BPharm", en: "Bachelor of Pharmacy", ar: "بكالوريوس الصيدلة", level: "bachelor" },
      { abbr: "PharmD", en: "Doctor of Pharmacy", ar: "دكتور الصيدلة (الصيدلة الإكلينيكية)", level: "doctorate" },
      { abbr: "MPharm", en: "Master of Pharmacy", ar: "ماجستير الصيدلة", level: "master" },
      { abbr: "BCPS", en: "Board Certified Pharmacotherapy Specialist", ar: "أخصائي علاج دوائي معتمد", level: "professional_cert" },
    ],
  },
  {
    id: "nursing_allied", nameAr: "التمريض والمهن الصحية", nameEn: "Nursing & Allied Health", icon: "🩺",
    pathways: ["BSN → MSN → DNP", "BSc PT → DPT"],
    items: [
      { abbr: "BSN", en: "Bachelor of Science in Nursing", ar: "بكالوريوس علوم التمريض", level: "bachelor" },
      { abbr: "MSN", en: "Master of Science in Nursing", ar: "ماجستير علوم التمريض", level: "master" },
      { abbr: "DNP", en: "Doctor of Nursing Practice", ar: "دكتوراه ممارسة التمريض", level: "doctorate" },
      { abbr: "DPT", en: "Doctor of Physical Therapy", ar: "دكتور العلاج الطبيعي", level: "doctorate" },
      { abbr: "OD", en: "Doctor of Optometry", ar: "دكتور البصريات", level: "doctorate" },
      { abbr: "PA-C", en: "Physician Assistant – Certified", ar: "مساعد طبيب معتمد", level: "professional_cert" },
      { abbr: "MPH", en: "Master of Public Health", ar: "ماجستير الصحة العامة", level: "master" },
      { abbr: "DrPH", en: "Doctor of Public Health", ar: "دكتوراه الصحة العامة", level: "doctorate" },
      { abbr: "MHA", en: "Master of Health Administration", ar: "ماجستير الإدارة الصحية", level: "master" },
    ],
  },
  {
    id: "engineering", nameAr: "الهندسة", nameEn: "Engineering", icon: "⚙️",
    pathways: ["BEng/BSc → MEng/MSc → PhD", "BSc → FE → PE (مزاولة المهنة)"],
    items: [
      { abbr: "BEng", en: "Bachelor of Engineering", ar: "بكالوريوس الهندسة", level: "bachelor" },
      { abbr: "BSc Eng", en: "Bachelor of Science in Engineering", ar: "بكالوريوس العلوم الهندسية", level: "bachelor" },
      { abbr: "MEng", en: "Master of Engineering", ar: "ماجستير الهندسة (مهني)", level: "master" },
      { abbr: "MSc Eng", en: "Master of Science in Engineering", ar: "ماجستير العلوم الهندسية (بحثي)", level: "master" },
      { abbr: "PhD Eng", en: "Doctor of Philosophy in Engineering", ar: "دكتوراه الفلسفة في الهندسة", level: "doctorate" },
      { abbr: "PE", en: "Professional Engineer", ar: "مهندس محترف (رخصة مزاولة)", level: "license" },
      { abbr: "PgDip Eng", en: "Postgraduate Diploma in Engineering", ar: "دبلوم الدراسات العليا الهندسية", level: "diploma" },
      { abbr: "CEng", en: "Chartered Engineer", ar: "مهندس معتمد (بريطانيا)", level: "license" },
    ],
  },
  {
    id: "computing_it", nameAr: "الحوسبة وتقنية المعلومات", nameEn: "Computing & IT", icon: "💻",
    pathways: ["BSc CS → MSc → PhD", "BSc → CCNA → CCNP → CCIE", "Security: Security+ → CEH → OSCP → CISSP"],
    items: [
      { abbr: "BSc CS", en: "Bachelor of Science in Computer Science", ar: "بكالوريوس علوم الحاسب", level: "bachelor" },
      { abbr: "MSc CS", en: "Master of Science in Computer Science", ar: "ماجستير علوم الحاسب", level: "master" },
      { abbr: "MCS", en: "Master of Computer Science (professional)", ar: "ماجستير الحاسبات (مهني)", level: "master" },
      { abbr: "CCNA", en: "Cisco Certified Network Associate", ar: "شهادة سيسكو للشبكات — مشارك", level: "professional_cert" },
      { abbr: "CCIE", en: "Cisco Certified Internetwork Expert", ar: "شهادة سيسكو — خبير", level: "professional_cert" },
      { abbr: "CISSP", en: "Certified Information Systems Security Professional", ar: "محترف أمن نظم المعلومات المعتمد", level: "professional_cert" },
      { abbr: "CEH", en: "Certified Ethical Hacker", ar: "مخترق أخلاقي معتمد", level: "professional_cert" },
      { abbr: "OSCP", en: "Offensive Security Certified Professional", ar: "محترف الأمن الهجومي المعتمد", level: "professional_cert" },
      { abbr: "Security+", en: "CompTIA Security+", ar: "شهادة كومبتيا لأمن المعلومات — تأسيسية", level: "professional_cert" },
      { abbr: "AWS SAA", en: "AWS Solutions Architect Associate", ar: "مهندس حلول أمازون السحابية — مشارك", level: "professional_cert" },
    ],
  },
  {
    id: "law", nameAr: "القانون", nameEn: "Law", icon: "⚖️",
    pathways: ["LLB → LLM → SJD/PhD", "JD → Bar → LLM (تخصص)"],
    items: [
      { abbr: "LLB", en: "Bachelor of Laws", ar: "ليسانس الحقوق", level: "bachelor" },
      { abbr: "JD", en: "Juris Doctor", ar: "دكتور في القانون (الدرجة المهنية الأمريكية)", level: "doctorate" },
      { abbr: "LLM", en: "Master of Laws", ar: "ماجستير القانون", level: "master" },
      { abbr: "SJD/JSD", en: "Doctor of Juridical Science", ar: "دكتوراه العلوم القانونية", level: "doctorate" },
      { abbr: "BCL", en: "Bachelor of Civil Law (Oxford, graduate)", ar: "بكالوريوس القانون المدني (أكسفورد — دراسات عليا)", level: "master" },
      { abbr: "Dip. Law", en: "Postgraduate Diploma in Law", ar: "دبلوم الدراسات العليا في القانون", level: "diploma" },
    ],
  },
  {
    id: "education", nameAr: "التربية والتعليم", nameEn: "Education", icon: "🎓",
    pathways: ["BEd → MEd → EdD/PhD", "BA/BSc → PGCE/الدبلوم التربوي → ترخيص التدريس"],
    items: [
      { abbr: "BEd", en: "Bachelor of Education", ar: "بكالوريوس/ليسانس التربية", level: "bachelor" },
      { abbr: "PGCE", en: "Postgraduate Certificate in Education", ar: "الدبلوم التربوي (بعد الجامعة)", level: "diploma" },
      { abbr: "MEd", en: "Master of Education", ar: "ماجستير التربية", level: "master" },
      { abbr: "MAT", en: "Master of Arts in Teaching", ar: "ماجستير الآداب في التدريس", level: "master" },
      { abbr: "EdD", en: "Doctor of Education", ar: "دكتوراه التربية (مهنية)", level: "doctorate" },
      { abbr: "PhD Ed", en: "Doctor of Philosophy in Education", ar: "دكتوراه الفلسفة في التربية (بحثية)", level: "doctorate" },
    ],
  },
  {
    id: "arts_humanities", nameAr: "الآداب والإنسانيات", nameEn: "Arts & Humanities", icon: "📖",
    pathways: ["BA → MA → MPhil → PhD", "BA → MFA (المسار الإبداعي النهائي)"],
    items: [
      { abbr: "BA", en: "Bachelor of Arts", ar: "ليسانس/بكالوريوس الآداب", level: "bachelor" },
      { abbr: "MA", en: "Master of Arts", ar: "ماجستير الآداب", level: "master" },
      { abbr: "MPhil", en: "Master of Philosophy", ar: "ماجستير الفلسفة (بحثي تمهيدي)", level: "master" },
      { abbr: "MFA", en: "Master of Fine Arts", ar: "ماجستير الفنون الجميلة (درجة نهائية إبداعية)", level: "master" },
      { abbr: "PhD", en: "Doctor of Philosophy", ar: "دكتوراه الفلسفة", level: "doctorate" },
      { abbr: "DLitt", en: "Doctor of Letters", ar: "دكتوراه الآداب (فخرية/عليا)", level: "doctorate" },
    ],
  },
  {
    id: "sciences", nameAr: "العلوم الطبيعية", nameEn: "Natural Sciences", icon: "🔬",
    pathways: ["BSc → MSc/MRes → PhD → PostDoc", "BSc → DSc (درجة عليا بالإنتاج العلمي)"],
    items: [
      { abbr: "BSc", en: "Bachelor of Science", ar: "بكالوريوس العلوم", level: "bachelor" },
      { abbr: "MSc", en: "Master of Science", ar: "ماجستير العلوم", level: "master" },
      { abbr: "MRes", en: "Master of Research", ar: "ماجستير البحث", level: "master" },
      { abbr: "PhD Sc", en: "Doctor of Philosophy in Science", ar: "دكتوراه الفلسفة في العلوم", level: "doctorate" },
      { abbr: "PGDip Sc", en: "Postgraduate Diploma in Science", ar: "دبلوم الدراسات العليا في العلوم", level: "diploma" },
      { abbr: "DSc", en: "Doctor of Science", ar: "دكتوراه العلوم (درجة عليا)", level: "doctorate" },
    ],
  },
  {
    id: "social_sciences", nameAr: "العلوم الاجتماعية والسياسات", nameEn: "Social Sciences & Policy", icon: "👥",
    pathways: ["BSW → MSW → DSW", "BA → MPP/MPA → PhD"],
    items: [
      { abbr: "BSW", en: "Bachelor of Social Work", ar: "بكالوريوس الخدمة الاجتماعية", level: "bachelor" },
      { abbr: "MSW", en: "Master of Social Work", ar: "ماجستير الخدمة الاجتماعية", level: "master" },
      { abbr: "DSW", en: "Doctor of Social Work", ar: "دكتوراه الخدمة الاجتماعية", level: "doctorate" },
      { abbr: "MPA", en: "Master of Public Administration", ar: "ماجستير الإدارة العامة", level: "master" },
      { abbr: "MPP", en: "Master of Public Policy", ar: "ماجستير السياسات العامة", level: "master" },
      { abbr: "MIR", en: "Master of International Relations", ar: "ماجستير العلاقات الدولية", level: "master" },
      { abbr: "MDS (Dev)", en: "Master of Development Studies", ar: "ماجستير دراسات التنمية", level: "master" },
      { abbr: "PsyD", en: "Doctor of Psychology", ar: "دكتوراه علم النفس (إكلينيكية مهنية)", level: "doctorate" },
    ],
  },
  {
    id: "architecture_design", nameAr: "العمارة والتصميم", nameEn: "Architecture & Design", icon: "🏗️",
    pathways: ["BArch → MArch → ترخيص المعماري", "BSc → MUP/MLA"],
    items: [
      { abbr: "BArch", en: "Bachelor of Architecture", ar: "بكالوريوس العمارة", level: "bachelor" },
      { abbr: "MArch", en: "Master of Architecture", ar: "ماجستير العمارة", level: "master" },
      { abbr: "MUP", en: "Master of Urban Planning", ar: "ماجستير التخطيط العمراني", level: "master" },
      { abbr: "MLA", en: "Master of Landscape Architecture", ar: "ماجستير عمارة البيئة", level: "master" },
      { abbr: "MID", en: "Master of Interior Design", ar: "ماجستير التصميم الداخلي", level: "master" },
      { abbr: "RA", en: "Registered Architect", ar: "معماري مسجَّل (رخصة مزاولة)", level: "license" },
    ],
  },
  {
    id: "islamic_sharia", nameAr: "العلوم الشرعية (النظام الأزهري والعربي)", nameEn: "Islamic & Shariah Studies", icon: "🕌",
    pathways: ["الليسانس → التخصص (الماجستير/العالمية) → العالمية مع درجة أستاذ (الدكتوراه)", "إجازة التجويد → إجازة القراءات العشر"],
    items: [
      { abbr: "ليسانس", en: "Licence (BA) in Shariah/Usul al-Din", ar: "الليسانس في الشريعة أو أصول الدين", level: "bachelor" },
      { abbr: "العالِمية", en: "Al-Alimiyyah (Azhar Master-level degree)", ar: "العالِمية — درجة التخصص الأزهرية (تعادل الماجستير)", level: "master" },
      { abbr: "العالمية مع الأستاذية", en: "Al-Alimiyyah with Professorship (Doctorate)", ar: "العالمية مع درجة أستاذ (تعادل الدكتوراه)", level: "doctorate" },
      { abbr: "إجازة قراءات", en: "Ijazah in Qira'at (chain-certified)", ar: "إجازة القراءات بالسند المتصل", level: "license" },
      { abbr: "دبلوم شرعي", en: "Postgraduate Diploma in Islamic Studies", ar: "دبلوم الدراسات العليا الشرعية", level: "diploma" },
      { abbr: "BIS", en: "Bachelor of Islamic Studies", ar: "بكالوريوس الدراسات الإسلامية", level: "bachelor" },
      { abbr: "تمهيدي ماجستير", en: "Pre-Masters Year", ar: "السنة التمهيدية للماجستير", level: "diploma" },
      { abbr: "MIS", en: "Master of Islamic Studies", ar: "ماجستير الدراسات الإسلامية", level: "master" },
    ],
  },
  {
    id: "theology_religion", nameAr: "اللاهوت والدراسات الدينية (الغربية)", nameEn: "Theology & Divinity (Western)", icon: "⛪",
    pathways: ["BD → MDiv → ThM → ThD/PhD"],
    items: [
      { abbr: "BD", en: "Bachelor of Divinity", ar: "بكالوريوس اللاهوت", level: "bachelor" },
      { abbr: "MDiv", en: "Master of Divinity", ar: "ماجستير اللاهوت (مهني)", level: "master" },
      { abbr: "ThM", en: "Master of Theology", ar: "ماجستير علم اللاهوت (متقدم)", level: "master" },
      { abbr: "ThD", en: "Doctor of Theology", ar: "دكتوراه اللاهوت", level: "doctorate" },
      { abbr: "DD", en: "Doctor of Divinity (honorary)", ar: "دكتوراه اللاهوت الفخرية", level: "doctorate" },
    ],
  },
  {
    id: "music_performing", nameAr: "الموسيقى والفنون الأدائية", nameEn: "Music & Performing Arts", icon: "🎭",
    pathways: ["BMus → MMus → DMA", "BFA → MFA"],
    items: [
      { abbr: "BMus", en: "Bachelor of Music", ar: "بكالوريوس الموسيقى", level: "bachelor" },
      { abbr: "MMus", en: "Master of Music", ar: "ماجستير الموسيقى", level: "master" },
      { abbr: "DMA", en: "Doctor of Musical Arts", ar: "دكتوراه الفنون الموسيقية", level: "doctorate" },
      { abbr: "BFA", en: "Bachelor of Fine Arts", ar: "بكالوريوس الفنون الجميلة", level: "bachelor" },
      { abbr: "BPA", en: "Bachelor of Performing Arts", ar: "بكالوريوس الفنون الأدائية", level: "bachelor" },
    ],
  },
  {
    id: "veterinary_agriculture", nameAr: "البيطرة والزراعة", nameEn: "Veterinary & Agriculture", icon: "🌾",
    pathways: ["BVSc/DVM → MVSc → PhD", "BSc Agr → MSc → PhD"],
    items: [
      { abbr: "BVSc", en: "Bachelor of Veterinary Science", ar: "بكالوريوس العلوم البيطرية", level: "bachelor" },
      { abbr: "DVM", en: "Doctor of Veterinary Medicine", ar: "دكتور الطب البيطري", level: "doctorate" },
      { abbr: "MVSc", en: "Master of Veterinary Science", ar: "ماجستير العلوم البيطرية", level: "master" },
      { abbr: "BSc Agr", en: "Bachelor of Agricultural Sciences", ar: "بكالوريوس العلوم الزراعية", level: "bachelor" },
      { abbr: "MSc Food", en: "Master of Food Science", ar: "ماجستير علوم الأغذية", level: "master" },
    ],
  },
  {
    id: "aviation_maritime", nameAr: "الطيران والملاحة", nameEn: "Aviation & Maritime", icon: "✈️",
    pathways: ["PPL → CPL → ATPL (مسار الطيار)", "ضابط ثالث → ثانٍ → أول → ربان (المسار البحري)"],
    items: [
      { abbr: "PPL", en: "Private Pilot Licence", ar: "رخصة طيار خاص", level: "license" },
      { abbr: "CPL", en: "Commercial Pilot Licence", ar: "رخصة طيار تجاري", level: "license" },
      { abbr: "ATPL", en: "Airline Transport Pilot Licence", ar: "رخصة طيار نقل جوي", level: "license" },
      { abbr: "BSc ATM", en: "BSc Air Traffic Management", ar: "بكالوريوس إدارة الحركة الجوية", level: "bachelor" },
      { abbr: "OOW", en: "Officer of the Watch (STCW)", ar: "ضابط نوبة بحري (اتفاقية STCW)", level: "license" },
      { abbr: "MEng Marine", en: "Marine Engineer Officer (Chief Engineer track)", ar: "مهندس بحري (مسار كبير المهندسين)", level: "license" },
      { abbr: "Master Mariner", en: "Master Mariner (Captain)", ar: "ربان أعالي البحار", level: "license" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const LEVEL_LABELS: Record<DegreeLevel, { ar: string; en: string; color: string }> = {
  diploma:           { ar: "دبلوم",        en: "Diploma",           color: "#0E7490" },
  bachelor:          { ar: "بكالوريوس",    en: "Bachelor",          color: "#166534" },
  master:            { ar: "ماجستير",      en: "Master",            color: "#1D6FAB" },
  doctorate:         { ar: "دكتوراه",      en: "Doctorate",         color: "#6D28D9" },
  professional_cert: { ar: "شهادة مهنية",  en: "Professional Cert", color: "#B45309" },
  fellowship:        { ar: "زمالة/عضوية",  en: "Fellowship",        color: "#9D174D" },
  license:           { ar: "رخصة مزاولة",  en: "License",           color: "#374151" },
};

export function getAbbreviationStats() {
  return {
    groups: ABBREVIATION_GROUPS.length,
    abbreviations: ABBREVIATION_GROUPS.reduce((n, g) => n + g.items.length, 0),
    pathways: ABBREVIATION_GROUPS.reduce((n, g) => n + g.pathways.length, 0),
  };
}

export function searchAbbreviations(query: string): { group: AbbreviationGroup; item: DegreeAbbreviation }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: { group: AbbreviationGroup; item: DegreeAbbreviation }[] = [];
  for (const g of ABBREVIATION_GROUPS)
    for (const item of g.items)
      if (item.abbr.toLowerCase().includes(q) || item.en.toLowerCase().includes(q) || item.ar.includes(query))
        out.push({ group: g, item });
  return out;
}

export default ABBREVIATION_GROUPS;
