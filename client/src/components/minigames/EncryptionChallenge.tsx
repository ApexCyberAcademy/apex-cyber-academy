/*
  Encryption Challenge Mini-Game
  Students encrypt/decrypt messages using Caesar cipher and XOR to learn symmetric encryption.
  Maps to Security+ Module 1: Change Management and Cryptography (Day 3)
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Lock, Unlock, CheckCircle, XCircle, RotateCcw, ArrowRight, Key } from "lucide-react";
import { useLabLang } from "./labI18n";

type Challenge = {
  id: number;
  title: string;
  titleAr: string;
  type: "caesar-encrypt" | "caesar-decrypt" | "xor" | "identify";
  description: string;
  descriptionAr: string;
  plaintext?: string;
  ciphertext?: string;
  key: number | string;
  answer: string;
  hint: string;
  hintAr: string;
  explanation: string;
  explanationAr: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Caesar Cipher - Encrypt",
    titleAr: "شيفرة قيصر - تشفير",
    type: "caesar-encrypt",
    description: "Encrypt the message using a Caesar cipher with a shift of 3.\nEach letter shifts forward 3 positions in the alphabet (A→D, B→E, etc.).",
    descriptionAr: "شفّر الرسالة باستخدام شيفرة قيصر بإزاحة 3.\nكل حرف يتقدم 3 مواقع في الأبجدية (A→D, B→E, إلخ).",
    plaintext: "ATTACK AT DAWN",
    key: 3,
    answer: "DWWDFN DW GDZQ",
    hint: "A→D, T→W, C→F, K→N. Spaces stay as spaces.",
    hintAr: "A→D, T→W, C→F, K→N. المسافات تبقى كما هي.",
    explanation: "Caesar cipher shifts each letter by the key value. With shift 3: A→D, T→W, A→D, C→F, K→N. This is one of the simplest substitution ciphers.",
    explanationAr: "شيفرة قيصر تزيح كل حرف بقيمة المفتاح. بإزاحة 3: A→D, T→W, A→D, C→F, K→N. هذه واحدة من أبسط شيفرات الاستبدال.",
  },
  {
    id: 2,
    title: "Caesar Cipher - Decrypt",
    titleAr: "شيفرة قيصر - فك التشفير",
    type: "caesar-decrypt",
    description: "Decrypt this intercepted message. Intelligence suggests it uses a Caesar cipher with shift 7.",
    descriptionAr: "فكّ تشفير هذه الرسالة المعترضة. تشير المعلومات الاستخباراتية إلى أنها تستخدم شيفرة قيصر بإزاحة 7.",
    ciphertext: "JHLYL JHLZHY",
    key: 7,
    answer: "CEYRE CAESAR",
    hint: "Shift each letter BACKWARD by 7. J→C, H→A, L→E...",
    hintAr: "أزح كل حرف للخلف بمقدار 7. J→C, H→A, L→E...",
    explanation: "To decrypt a Caesar cipher, shift each letter backward by the key. J(10)→C(3), H(8)→A(1), L(12)→E(5). The answer reveals 'CAESAR' - fitting!",
    explanationAr: "لفك تشفير شيفرة قيصر، أزح كل حرف للخلف بقيمة المفتاح. J(10)→C(3), H(8)→A(1), L(12)→E(5). الإجابة تكشف 'CAESAR' - مناسب!",
  },
  {
    id: 3,
    title: "XOR Encryption",
    titleAr: "تشفير XOR",
    type: "xor",
    description: "XOR each character of 'HI' with the key byte 0x2A (42 in decimal).\nConvert each character to its ASCII value, XOR with 42, then convert back.\nH=72, I=73",
    descriptionAr: "طبّق XOR على كل حرف من 'HI' مع بايت المفتاح 0x2A (42 بالعشري).\nحوّل كل حرف إلى قيمة ASCII، ثم XOR مع 42، ثم حوّل مرة أخرى.\nH=72, I=73",
    plaintext: "HI",
    key: "0x2A",
    answer: "bc",
    hint: "H(72) XOR 42 = 98 = 'b', I(73) XOR 42 = 99 = 'c'",
    hintAr: "H(72) XOR 42 = 98 = 'b', I(73) XOR 42 = 99 = 'c'",
    explanation: "XOR is the foundation of modern symmetric encryption. 72 XOR 42 = 98 ('b'), 73 XOR 42 = 99 ('c'). XOR is reversible: 98 XOR 42 = 72 ('H') - this is why it's used in stream ciphers.",
    explanationAr: "XOR هو أساس التشفير المتماثل الحديث. 72 XOR 42 = 98 ('b'), 73 XOR 42 = 99 ('c'). XOR قابل للعكس: 98 XOR 42 = 72 ('H') - لهذا يُستخدم في شيفرات التدفق.",
  },
  {
    id: 4,
    title: "Identify the Cipher Type",
    titleAr: "حدد نوع الشيفرة",
    type: "identify",
    description: "A security analyst intercepts this encrypted traffic:\n\nOriginal: 'HELLO WORLD'\nEncrypted: 'KHOOR ZRUOG'\n\nWhat type of cipher was used and what is the key?",
    descriptionAr: "اعترض محلل أمني حركة مرور مشفرة:\n\nالأصل: 'HELLO WORLD'\nالمشفر: 'KHOOR ZRUOG'\n\nما نوع الشيفرة المستخدمة وما هو المفتاح؟",
    plaintext: "HELLO WORLD",
    ciphertext: "KHOOR ZRUOG",
    key: 3,
    answer: "CAESAR 3",
    hint: "Compare H→K (shift of 3), E→H (shift of 3), L→O (shift of 3)...",
    hintAr: "قارن H→K (إزاحة 3), E→H (إزاحة 3), L→O (إزاحة 3)...",
    explanation: "This is a Caesar cipher with shift 3. Each letter is shifted forward by exactly 3 positions. In real security, frequency analysis can break simple substitution ciphers - that's why modern encryption uses complex algorithms like AES.",
    explanationAr: "هذه شيفرة قيصر بإزاحة 3. كل حرف يتقدم بالضبط 3 مواقع. في الأمن الحقيقي، يمكن لتحليل التردد كسر شيفرات الاستبدال البسيطة - لهذا يستخدم التشفير الحديث خوارزميات معقدة مثل AES.",
  },
  {
    id: 5,
    title: "Symmetric vs Asymmetric",
    titleAr: "متماثل مقابل غير متماثل",
    type: "identify",
    description: "Match the scenario to the correct encryption type.\n\nScenario: Alice wants to send Bob a secret message. They've never met and have no shared secret.\n\nWhich encryption approach should they use?\n\nType: SYMMETRIC or ASYMMETRIC",
    descriptionAr: "طابق السيناريو مع نوع التشفير الصحيح.\n\nالسيناريو: تريد أليس إرسال رسالة سرية لبوب. لم يلتقيا أبداً وليس لديهما سر مشترك.\n\nأي نهج تشفير يجب استخدامه؟\n\nاكتب: SYMMETRIC أو ASYMMETRIC",
    key: "concept",
    answer: "ASYMMETRIC",
    hint: "If they have no shared secret, they can't use the same key for encryption and decryption...",
    hintAr: "إذا لم يكن لديهما سر مشترك، لا يمكنهما استخدام نفس المفتاح للتشفير وفك التشفير...",
    explanation: "Asymmetric encryption (public key cryptography) solves the key distribution problem. Bob shares his public key openly. Alice encrypts with Bob's public key, and only Bob's private key can decrypt it. No pre-shared secret needed!",
    explanationAr: "التشفير غير المتماثل (تشفير المفتاح العام) يحل مشكلة توزيع المفاتيح. يشارك بوب مفتاحه العام علناً. تشفّر أليس بمفتاح بوب العام، ومفتاح بوب الخاص فقط يمكنه فك التشفير. لا حاجة لسر مشترك مسبق!",
  },
];

export default function EncryptionChallenge({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = CHALLENGES[currentChallenge];

  const checkAnswer = useCallback(() => {
    const normalizedUser = userAnswer.trim().toUpperCase().replace(/\s+/g, " ");
    const normalizedAnswer = challenge.answer.toUpperCase().replace(/\s+/g, " ");

    if (normalizedUser === normalizedAnswer) {
      setResult("correct");
      setScore(prev => prev + 1);
      setShowExplanation(true);
    } else {
      setResult("incorrect");
    }
  }, [userAnswer, challenge]);

  const nextChallenge = useCallback(() => {
    if (currentChallenge < CHALLENGES.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setUserAnswer("");
      setResult(null);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  }, [currentChallenge]);

  const reset = useCallback(() => {
    setCurrentChallenge(0);
    setUserAnswer("");
    setResult(null);
    setShowHint(false);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
          <Key className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">
            {tx("Encryption Challenge", "تحدي التشفير")}
          </h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
            {tx("Challenge", "التحدي")} {currentChallenge + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}
          </p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Lock className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {tx("Encryption Master!", "خبير التشفير!")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">
            {tx(
              `You scored ${score}/${CHALLENGES.length}. You understand the fundamentals of encryption!`,
              `حصلت على ${score}/${CHALLENGES.length}. أنت تفهم أساسيات التشفير!`
            )}
          </p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Challenge */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <h4 className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold mb-2">
              {tx(challenge.title, challenge.titleAr)}
            </h4>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm whitespace-pre-line mb-3">
              {tx(challenge.description, challenge.descriptionAr)}
            </p>

            {challenge.plaintext && (
              <div className="flex items-center gap-2 mb-2">
                <Unlock className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-green-400 font-mono text-sm">{tx("Plaintext", "النص الأصلي")}: {challenge.plaintext}</span>
              </div>
            )}
            {challenge.ciphertext && (
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-red-400 font-mono text-sm">{tx("Ciphertext", "النص المشفر")}: {challenge.ciphertext}</span>
              </div>
            )}
            {challenge.key !== "concept" && (
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-[#D4AF37] font-mono text-sm">{tx("Key", "المفتاح")}: {String(challenge.key)}</span>
              </div>
            )}
          </div>

          {/* Answer Input */}
          <div className="mb-4">
            <label className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold block mb-2">
              {tx("Your Answer:", "إجابتك:")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={e => { setUserAnswer(e.target.value); setResult(null); }}
                onKeyDown={e => { if (e.key === "Enter" && !result) checkAnswer(); }}
                className="flex-1 bg-[#0A3D33] border border-[#0A6B5A]/50 text-[#E8E0D4] font-mono text-sm px-4 py-2.5 focus:border-[#D4AF37] outline-none"
                placeholder={tx("Type your answer...", "اكتب إجابتك...")}
                disabled={result === "correct"}
              />
              {result !== "correct" && (
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40"
                >
                  {tx("Check", "تحقق")}
                </button>
              )}
            </div>
          </div>

          {/* Result */}
          {result === "correct" && (
            <div className="bg-[#0A3D33]/40 border border-[#D4AF37]/30 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">{tx("Correct!", "صحيح!")}</span>
              </div>
              {showExplanation && (
                <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mt-2">
                  {tx(challenge.explanation, challenge.explanationAr)}
                </p>
              )}
              <button
                onClick={nextChallenge}
                className="flex items-center gap-2 mt-3 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
              >
                {currentChallenge < CHALLENGES.length - 1
                  ? tx("Next Challenge", "التحدي التالي")
                  : tx("See Results", "عرض النتائج")
                } <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {result === "incorrect" && (
            <div className="bg-[#3D0A0A]/20 border border-red-500/20 p-3 mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-['Montserrat'] text-sm font-bold">
                  {tx("Not quite - try again!", "ليس تماماً - حاول مرة أخرى!")}
                </span>
              </div>
            </div>
          )}

          {/* Hint */}
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[#C4B9A8] font-['Work_Sans'] text-xs hover:text-[#D4AF37] transition-colors"
          >
            {showHint ? tx("Hide hint", "إخفاء التلميح") : tx("Need a hint?", "تحتاج تلميح؟")}
          </button>
          {showHint && (
            <div className="bg-[#0A3D33]/30 border border-[#D4AF37]/20 p-3 mt-2">
              <p className="text-[#D4AF37] font-['Work_Sans'] text-sm">{tx(challenge.hint, challenge.hintAr)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
