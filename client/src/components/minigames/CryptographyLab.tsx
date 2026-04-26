/*
  Cryptography Lab
  Students work with encryption, hashing, and PKI concepts.
  Maps to CEH Day 11: Cryptography & PKI
  Bilingual: English + Arabic
*/

import { useState, useCallback, useRef, useEffect } from "react";
import { Lock, CheckCircle, XCircle, RotateCcw, ArrowRight, Key } from "lucide-react";
import { useLabLang } from "./labI18n";

type CryptoChallenge = {
  id: number;
  title: string;
  titleAr: string;
  scenario: string;
  scenarioAr: string;
  terminalOutput: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const CHALLENGES: CryptoChallenge[] = [
  {
    id: 1, title: "Hash Identification", titleAr: "تحديد التجزئة",
    scenario: "You extracted password hashes from a compromised database. Identify the hash type to choose the right cracking approach.",
    scenarioAr: "استخرجت تجزئات كلمات المرور من قاعدة بيانات مخترقة. حدد نوع التجزئة لاختيار نهج الكسر الصحيح.",
    terminalOutput: [
      "$ cat /tmp/hashes.txt",
      "",
      "admin:$2b$12$LJ3m4ys3Lz0QhR7FZp8Oue7VBx5Kp3xN9mZwPqR2sT4uV6wX8yZ0",
      "user1:5f4dcc3b5aa765d61d8327deb882cf99",
      "user2:$6$rounds=5000$saltsalt$Nh8rft...",
      "user3:e10adc3949ba59abbe56e057f20f883e",
    ],
    question: "Which hash format is the MOST secure and hardest to crack?",
    questionAr: "أي تنسيق تجزئة هو الأكثر أماناً والأصعب في الكسر؟",
    options: ["user1: 5f4dcc3b... (MD5)", "admin: $2b$12$... (bcrypt)", "user3: e10adc39... (MD5)", "user2: $6$... (SHA-512crypt)"],
    optionsAr: ["user1: 5f4dcc3b... (MD5)", "admin: $2b$12$... (bcrypt)", "user3: e10adc39... (MD5)", "user2: $6$... (SHA-512crypt)"],
    correctIndex: 1,
    explanation: "bcrypt ($2b$) is the most secure. It's specifically designed for password hashing with: (1) built-in salt, (2) configurable work factor ($12$ = 2^12 iterations), (3) intentionally slow computation that resists GPU/ASIC attacks. MD5 is fast and unsalted, making it trivially crackable.",
    explanationAr: "bcrypt ($2b$) هو الأكثر أماناً. مصمم خصيصاً لتجزئة كلمات المرور مع: (1) ملح مدمج، (2) عامل عمل قابل للتكوين ($12$ = 2^12 تكرار)، (3) حساب بطيء عمداً يقاوم هجمات GPU/ASIC.",
  },
  {
    id: 2, title: "Symmetric vs Asymmetric", titleAr: "متماثل مقابل غير متماثل",
    scenario: "Your company needs to implement end-to-end encrypted communication between 1000 employees. Each pair needs a unique key.",
    scenarioAr: "شركتك تحتاج لتنفيذ اتصال مشفر من طرف إلى طرف بين 1000 موظف. كل زوج يحتاج مفتاح فريد.",
    terminalOutput: [
      "=== Key Management Analysis ===",
      "",
      "Symmetric encryption (AES-256):",
      "  Keys needed: n(n-1)/2 = 1000 * 999 / 2 = 499,500 keys",
      "  Key distribution: Each user stores 999 keys",
      "  New employee: Generate 999 new keys, distribute to all",
      "",
      "Asymmetric encryption (RSA-2048 / ECC):",
      "  Keys needed: 1000 key pairs (1 per user)",
      "  Key distribution: Public keys shared openly",
      "  New employee: Generate 1 key pair, publish public key",
    ],
    question: "Why do modern systems (TLS, PGP) use BOTH symmetric and asymmetric encryption?",
    questionAr: "لماذا تستخدم الأنظمة الحديثة (TLS، PGP) التشفير المتماثل وغير المتماثل معاً؟",
    options: ["Symmetric is more secure than asymmetric", "Asymmetric handles key exchange; symmetric handles bulk data (hybrid approach)", "They use asymmetric only for backward compatibility", "Symmetric encryption doesn't work over the internet"],
    optionsAr: ["المتماثل أكثر أماناً من غير المتماثل", "غير المتماثل يتعامل مع تبادل المفاتيح؛ المتماثل يتعامل مع البيانات الكبيرة (نهج هجين)", "يستخدمون غير المتماثل فقط للتوافق الخلفي", "التشفير المتماثل لا يعمل عبر الإنترنت"],
    correctIndex: 1,
    explanation: "Hybrid encryption combines the best of both: asymmetric (RSA/ECC) securely exchanges a session key, then symmetric (AES) encrypts the actual data. Asymmetric is too slow for bulk data but solves the key distribution problem. This is exactly how TLS/HTTPS works.",
    explanationAr: "التشفير الهجين يجمع أفضل ما في الاثنين: غير المتماثل (RSA/ECC) يتبادل مفتاح الجلسة بأمان، ثم المتماثل (AES) يشفر البيانات الفعلية. غير المتماثل بطيء جداً للبيانات الكبيرة لكنه يحل مشكلة توزيع المفاتيح.",
  },
  {
    id: 3, title: "Digital Certificate Validation", titleAr: "التحقق من الشهادة الرقمية",
    scenario: "A user reports a browser warning when visiting https://secure.company.com. You inspect the certificate.",
    scenarioAr: "مستخدم يبلغ عن تحذير متصفح عند زيارة https://secure.company.com. تفحص الشهادة.",
    terminalOutput: [
      "$ openssl s_client -connect secure.company.com:443",
      "",
      "Certificate chain:",
      " 0 s:CN = *.company.com",
      "   i:CN = Company Internal CA",
      "   Validity: Not After: Jan 15 2024 (EXPIRED)",
      "   Subject Alternative Name: *.company.com",
      "",
      "Verify return code: 10 (certificate has expired)",
      "---",
      "SSL handshake has read 2048 bytes",
    ],
    question: "What is the PRIMARY issue with this certificate?",
    questionAr: "ما هي المشكلة الأساسية مع هذه الشهادة؟",
    options: ["The certificate uses a wildcard domain", "The certificate has expired (Not After: Jan 15 2024)", "The certificate chain is too short", "The SSL handshake read too few bytes"],
    optionsAr: ["الشهادة تستخدم نطاق بدل", "الشهادة منتهية الصلاحية (Not After: Jan 15 2024)", "سلسلة الشهادات قصيرة جداً", "مصافحة SSL قرأت بايتات قليلة جداً"],
    correctIndex: 1,
    explanation: "The certificate expired on Jan 15, 2024 (Verify return code: 10). Expired certificates break the trust chain because the CA can no longer vouch for the certificate holder's identity. This could also indicate a compromised certificate that wasn't renewed. Automate renewal with tools like certbot/Let's Encrypt.",
    explanationAr: "الشهادة انتهت صلاحيتها في 15 يناير 2024. الشهادات المنتهية تكسر سلسلة الثقة لأن CA لم يعد بإمكانها ضمان هوية حامل الشهادة. أتمت التجديد بأدوات مثل certbot/Let's Encrypt.",
  },
  {
    id: 4, title: "Encryption Attack Identification", titleAr: "تحديد هجوم التشفير",
    scenario: "An attacker intercepts encrypted traffic and replaces the server's public key with their own during the TLS handshake.",
    scenarioAr: "مهاجم يعترض حركة مرور مشفرة ويستبدل المفتاح العام للخادم بمفتاحه الخاص أثناء مصافحة TLS.",
    terminalOutput: [
      "=== Attack Flow ===",
      "",
      "1. Client → [SYN] → Attacker → [SYN] → Server",
      "2. Server → [Certificate: PubKey_Server] → Attacker",
      "3. Attacker → [Certificate: PubKey_Attacker] → Client",
      "4. Client encrypts session key with PubKey_Attacker",
      "5. Attacker decrypts with PrivKey_Attacker",
      "6. Attacker re-encrypts with PubKey_Server → Server",
      "7. All traffic visible to attacker in plaintext!",
    ],
    question: "What type of attack is this, and what prevents it?",
    questionAr: "ما نوع هذا الهجوم، وما الذي يمنعه؟",
    options: ["Replay attack; prevented by timestamps", "Man-in-the-Middle (MITM); prevented by certificate pinning and CA validation", "Birthday attack; prevented by longer hash outputs", "Brute force; prevented by longer keys"],
    optionsAr: ["هجوم إعادة التشغيل؛ يُمنع بالطوابع الزمنية", "رجل في المنتصف (MITM)؛ يُمنع بتثبيت الشهادات والتحقق من CA", "هجوم عيد الميلاد؛ يُمنع بمخرجات تجزئة أطول", "القوة الغاشمة؛ يُمنع بمفاتيح أطول"],
    correctIndex: 1,
    explanation: "This is a Man-in-the-Middle (MITM) attack on TLS. The attacker substitutes their own certificate. Prevention: (1) CA validation - browsers verify the certificate is signed by a trusted CA, (2) Certificate pinning - apps remember the expected certificate, (3) HSTS - prevents downgrade to HTTP.",
    explanationAr: "هذا هجوم رجل في المنتصف (MITM) على TLS. المهاجم يستبدل شهادته الخاصة. المنع: (1) التحقق من CA، (2) تثبيت الشهادات، (3) HSTS يمنع التخفيض إلى HTTP.",
  },
  {
    id: 5, title: "Steganography Detection", titleAr: "كشف إخفاء المعلومات",
    scenario: "During a forensic investigation, you suspect a suspect is hiding data inside image files.",
    scenarioAr: "أثناء تحقيق جنائي رقمي، تشتبه أن مشتبهاً به يخفي بيانات داخل ملفات صور.",
    terminalOutput: [
      "$ ls -la suspect_images/",
      "  vacation.jpg    3.2 MB  (typical JPEG: ~2-4 MB)",
      "  sunset.jpg     12.8 MB  (suspiciously large!)",
      "  family.jpg      2.1 MB  (typical JPEG)",
      "",
      "$ steghide info sunset.jpg",
      "  format: jpeg",
      "  capacity: 1.2 MB",
      "  embedded data found!",
      "",
      "$ steghide extract -sf sunset.jpg -p 'password123'",
      "  wrote extracted data to 'secret_plans.zip'",
    ],
    question: "What technique was used to hide data, and what was the first clue?",
    questionAr: "ما التقنية المستخدمة لإخفاء البيانات، وما كان الدليل الأول؟",
    options: ["Encryption; the file was password-protected", "Steganography; the unusually large file size (12.8 MB for a JPEG)", "Obfuscation; the filename was misleading", "Compression; the file was zipped inside the image"],
    optionsAr: ["التشفير؛ الملف كان محمياً بكلمة مرور", "إخفاء المعلومات؛ حجم الملف الكبير بشكل غير عادي (12.8 MB لـ JPEG)", "التعتيم؛ اسم الملف كان مضللاً", "الضغط؛ الملف كان مضغوطاً داخل الصورة"],
    correctIndex: 1,
    explanation: "Steganography hides data within other files (images, audio, video) without visibly altering them. The first clue was the file size: sunset.jpg was 12.8 MB while typical JPEGs are 2-4 MB. Tools like steghide, OpenStego, and binwalk can detect and extract hidden data.",
    explanationAr: "إخفاء المعلومات يخفي البيانات داخل ملفات أخرى (صور، صوت، فيديو) بدون تغييرها بشكل مرئي. الدليل الأول كان حجم الملف: sunset.jpg كان 12.8 MB بينما JPEGs النموذجية 2-4 MB.",
  },
];

export default function CryptographyLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = CHALLENGES[current];

  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (selected === challenge.correctIndex) setScore(s => s + 1); }, [selected, challenge]);
  const handleNext = useCallback(() => { if (current < CHALLENGES.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setCompleted(true); } }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Lock className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Cryptography Lab", "مختبر التشفير")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Key className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Cryptography expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير تشفير!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <h4 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-1">{tx(challenge.title, challenge.titleAr)}</h4>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-green-400" : line.includes("EXPIRED") || line.includes("Attacker") ? "text-red-400" : line.includes("bcrypt") || line.includes("KEY FOUND") || line.includes("extracted") ? "text-yellow-400" : line.includes("===") ? "text-blue-300" : "text-gray-300"}>{line || "\u00A0"}</div>
            ))}
          </div>

          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(challenge.question, challenge.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(challenge.options.join("|"), challenge.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? i === challenge.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === challenge.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.explanation, challenge.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < CHALLENGES.length - 1 ? tx("Next Challenge", "التحدي التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
