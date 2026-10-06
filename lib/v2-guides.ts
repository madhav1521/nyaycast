export type GuideLanguage = "en" | "gu";

type GuideCopy = {
  title: string;
  summary: string;
  principle: string;
  context: string;
  practical: string;
  tags: string[];
};

export type LegalGuide = {
  slug: string;
  category: string;
  citation: string;
  court: string;
  year: string;
  sourceUrl: string;
  reviewed: boolean;
  en: GuideCopy;
  gu: GuideCopy;
};

export const legalGuides: LegalGuide[] = [
  {
    slug: "kesavananda-bharati-basic-structure",
    category: "Constitution",
    citation: "Kesavananda Bharati v. State of Kerala, (1973) 4 SCC 225",
    court: "Supreme Court of India",
    year: "1973",
    sourceUrl: "https://digiscr.sci.gov.in/",
    reviewed: false,
    en: {
      title: "The basic structure limit on constitutional amendments",
      summary: "A landmark decision on Parliament’s power to amend the Constitution and the features that give it its essential identity.",
      principle: "The Supreme Court held that Parliament may amend the Constitution under Article 368, but may not damage or destroy its basic structure. The judgment did not provide a closed checklist of every feature; later cases have applied the doctrine to specific constitutional questions.",
      context: "A large bench considered the scope of Parliament’s constituent power after a series of constitutional amendments affecting property and land reform. The decision is commonly known as the basic structure case.",
      practical: "The doctrine is a constitutional review principle. It is not a shortcut for challenging every amendment, and its application depends on the measure and the constitutional feature said to be affected.",
      tags: ["Constitution", "Article 368", "Judicial review"],
    },
    gu: {
      title: "બંધારણના સુધારા પર મૂળભૂત માળખાની મર્યાદા",
      summary: "સંસદની બંધારણમાં સુધારો કરવાની સત્તા અને બંધારણની આવશ્યક ઓળખ જાળવતા લક્ષણો અંગેનો ઐતિહાસિક નિર્ણય.",
      principle: "સર્વોચ્ચ અદાલતે ઠરાવ્યું કે કલમ 368 હેઠળ સંસદ બંધારણમાં સુધારો કરી શકે છે, પરંતુ તેના મૂળભૂત માળખાને નુકસાન પહોંચાડી કે નષ્ટ કરી શકતી નથી. દરેક લક્ષણની સંપૂર્ણ યાદી ચુકાદામાં બંધ કરવામાં આવી નથી; પછીના કેસોમાં આ સિદ્ધાંત ચોક્કસ બંધારણીય પ્રશ્નો પર લાગુ થયો છે.",
      context: "જમીન સુધારા અને મિલકતને અસર કરતા બંધારણીય સુધારાઓ પછી સંસદની બંધારણ-રચનાની સત્તાની હદ અંગે મોટી ખંડપીઠે વિચાર કર્યો. આ નિર્ણયને સામાન્ય રીતે મૂળભૂત માળખાના કેસ તરીકે ઓળખવામાં આવે છે.",
      practical: "આ બંધારણીય સમીક્ષાનો સિદ્ધાંત છે. દરેક સુધારાને પડકારવાનો સરળ માર્ગ નથી; તેનો ઉપયોગ કાયદા અને અસરગ્રસ્ત બંધારણીય લક્ષણ પર આધારિત છે.",
      tags: ["બંધારણ", "કલમ 368", "ન્યાયિક સમીક્ષા"],
    },
  },
  {
    slug: "maneka-gandhi-personal-liberty",
    category: "Fundamental rights",
    citation: "Maneka Gandhi v. Union of India, (1978) 1 SCC 248",
    court: "Supreme Court of India",
    year: "1978",
    sourceUrl: "https://digiscr.sci.gov.in/",
    reviewed: false,
    en: {
      title: "Fair procedure and personal liberty",
      summary: "The Court read the guarantees of life and personal liberty together with constitutional protections against arbitrary state action.",
      principle: "The judgment explained that a procedure affecting personal liberty must be fair, just, and reasonable rather than arbitrary. It also read Articles 14, 19, and 21 as connected protections, while the precise test depends on the legal context.",
      context: "Maneka Gandhi challenged the impounding of her passport and the process followed by the authorities. The decision broadened how courts examine state action affecting liberty.",
      practical: "The case is frequently cited in due-process and fairness arguments. A citation alone does not decide whether a particular government action is unlawful; the governing statute and facts still matter.",
      tags: ["Article 21", "Fair procedure", "Personal liberty"],
    },
    gu: {
      title: "વ્યક્તિગત સ્વતંત્રતા અને ન્યાયસંગત પ્રક્રિયા",
      summary: "જીવન અને વ્યક્તિગત સ્વતંત્રતાની ખાતરીઓને મનસ્વી સરકારી કાર્યવાહી સામેની બંધારણીય સુરક્ષાઓ સાથે વાંચવામાં આવી.",
      principle: "ચુકાદાએ સમજાવ્યું કે વ્યક્તિગત સ્વતંત્રતાને અસર કરતી પ્રક્રિયા ન્યાયસંગત, યોગ્ય અને વાજબી હોવી જોઈએ; મનસ્વી નહીં. કલમ 14, 19 અને 21ને પરસ્પર જોડાયેલી સુરક્ષાઓ તરીકે પણ વાંચવામાં આવી, જોકે ચોક્કસ કસોટી કાનૂની સંદર્ભ પર આધારિત છે.",
      context: "મેનકા ગાંધી દ્વારા પાસપોર્ટ જપ્ત કરવાની કાર્યવાહી અને સત્તાધિકારીઓએ અનુસરેલી પ્રક્રિયાને પડકારવામાં આવી હતી. આ નિર્ણયે સ્વતંત્રતાને અસર કરતી સરકારી કાર્યવાહી અંગેની ન્યાયિક તપાસનો વ્યાપ વધાર્યો.",
      practical: "ન્યાયપ્રક્રિયા અને વાજબીપણાની દલીલોમાં આ કેસનો વારંવાર ઉલ્લેખ થાય છે. માત્ર ચુકાદાનો ઉલ્લેખ કોઈ સરકારી પગલું ગેરકાયદેસર છે તે નક્કી કરતો નથી; લાગુ કાયદો અને હકીકતો પણ મહત્વના છે.",
      tags: ["કલમ 21", "ન્યાયસંગત પ્રક્રિયા", "વ્યક્તિગત સ્વતંત્રતા"],
    },
  },
  {
    slug: "vishaka-workplace-safety",
    category: "Workplace rights",
    citation: "Vishaka v. State of Rajasthan, (1997) 6 SCC 241",
    court: "Supreme Court of India",
    year: "1997",
    sourceUrl: "https://digiscr.sci.gov.in/",
    reviewed: false,
    en: {
      title: "Workplace safeguards against sexual harassment",
      summary: "Before dedicated legislation was enacted, the Court framed workplace safeguards grounded in equality and dignity.",
      principle: "The Court issued the Vishaka Guidelines to address sexual harassment at work, drawing on constitutional guarantees and India’s international commitments. Parliament later enacted the 2013 workplace-harassment law, which now supplies the statutory framework.",
      context: "The petition followed the assault of social worker Bhanwari Devi and addressed the lack of a specific legal framework for workplace sexual harassment at that time.",
      practical: "For current workplace complaints, consult the applicable 2013 Act and rules, including the Internal Committee or Local Committee process. The historical guidelines should not replace current statutory requirements.",
      tags: ["Workplace", "Equality", "Dignity"],
    },
    gu: {
      title: "કાર્યસ્થળે જાતીય સતામણી સામેની સુરક્ષા",
      summary: "વિશેષ કાયદો બન્યો તે પહેલાં અદાલતે સમાનતા અને ગૌરવ પર આધારિત કાર્યસ્થળ સુરક્ષાના માર્ગદર્શક નિયમો આપ્યા.",
      principle: "અદાલતે બંધારણીય ખાતરીઓ અને ભારતની આંતરરાષ્ટ્રીય પ્રતિબદ્ધતાઓના આધારે કાર્યસ્થળે જાતીય સતામણી માટે વિશાખા માર્ગદર્શિકા આપી. ત્યારબાદ સંસદે 2013નો કાર્યસ્થળ સતામણી કાયદો બનાવ્યો, જે હાલનું કાનૂની માળખું આપે છે.",
      context: "આ અરજી સામાજિક કાર્યકર ભંવરી દેવી પર થયેલા હુમલા પછી અને તે સમયના કાર્યસ્થળે જાતીય સતામણી અંગેના વિશિષ્ટ કાનૂની માળખાના અભાવને લઈને થઈ હતી.",
      practical: "હાલની કાર્યસ્થળ ફરિયાદ માટે 2013નો લાગુ કાયદો અને નિયમો, જેમાં આંતરિક સમિતિ અથવા સ્થાનિક સમિતિની પ્રક્રિયા સામેલ છે, તપાસો. ઐતિહાસિક માર્ગદર્શિકા હાલની કાનૂની જરૂરિયાતોનું સ્થાન લઈ શકતી નથી.",
      tags: ["કાર્યસ્થળ", "સમાનતા", "ગૌરવ"],
    },
  },
];

export const guideLabels = {
  en: {
    library: "Legal guide library",
    intro: "Plain-language notes on selected Indian judgments. Search by topic, principle, or case name.",
    search: "Search guides",
    all: "All topics",
    read: "Read explainer",
    source: "Find judgment on Supreme Court eSCR",
    citation: "Case citation",
    principle: "The principle",
    context: "Background",
    practical: "What to keep in mind",
    review: "Gujarati translation draft: legal and language review required before formal publication.",
    disclaimer: "General information only. This is not legal advice and does not create an advocate-client relationship.",
    back: "All guides",
  },
  gu: {
    library: "કાનૂની માર્ગદર્શિકાઓ",
    intro: "પસંદ કરેલા ભારતીય ચુકાદાઓ અંગે સરળ ભાષામાં નોંધો. વિષય, સિદ્ધાંત અથવા કેસના નામથી શોધો.",
    search: "માર્ગદર્શિકા શોધો",
    all: "બધા વિષયો",
    read: "સમજૂતી વાંચો",
    source: "સર્વોચ્ચ અદાલત eSCR પર ચુકાદો શોધો",
    citation: "કેસનો સંદર્ભ",
    principle: "સિદ્ધાંત",
    context: "પૃષ્ઠભૂમિ",
    practical: "ધ્યાનમાં રાખવાની બાબત",
    review: "ગુજરાતી અનુવાદનો પ્રારંભિક ડ્રાફ્ટ છે; પ્રકાશન પહેલાં કાનૂની અને ભાષાકીય સમીક્ષા જરૂરી છે.",
    disclaimer: "માત્ર સામાન્ય માહિતી. આ કાનૂની સલાહ નથી અને વકીલ-ક્લાયન્ટ સંબંધ સ્થાપિત કરતું નથી.",
    back: "બધી માર્ગદર્શિકાઓ",
  },
} as const;