/*
  Flashcards - Spaced Repetition System
  Uses SM-2 algorithm to schedule reviews based on recall quality.
  Card flip UI with difficulty rating and progress tracking.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Brain, CheckCircle, ChevronLeft, ChevronRight,
  Loader2, RotateCcw, Sparkles, Trophy, Zap, BookOpen, Clock
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type FlashcardData = {
  id: number;
  term: string;
  definition: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewAt: Date;
  lastReviewedAt: Date | null;
};

const QUALITY_LABELS = [
  { quality: 0, label: "Blackout", desc: "No idea", color: "bg-red-600", icon: "😵" },
  { quality: 1, label: "Wrong", desc: "Incorrect", color: "bg-red-500", icon: "❌" },
  { quality: 2, label: "Hard", desc: "Barely recalled", color: "bg-orange-500", icon: "😓" },
  { quality: 3, label: "OK", desc: "Correct with effort", color: "bg-yellow-500", icon: "🤔" },
  { quality: 4, label: "Good", desc: "Correct easily", color: "bg-emerald-500", icon: "😊" },
  { quality: 5, label: "Perfect", desc: "Instant recall", color: "bg-green-500", icon: "🌟" },
];

export default function Flashcards() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  // Get course data
  const { data: courseData } = trpc.course.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );
  const course = courseData?.course;
  const courseId = course?.id ?? 0;

  // Initialize flashcards
  const initMutation = trpc.flashcard.initialize.useMutation({
    onSuccess: (data) => {
      if (data.cardsCreated && typeof data.cardsCreated === "number" && data.cardsCreated > 0) {
        toast.success(`Created ${data.cardsCreated} flashcards`);
      }
      utils.flashcard.due.invalidate();
      utils.flashcard.stats.invalidate();
      utils.flashcard.list.invalidate();
    },
  });

  // Get due cards
  const { data: dueCards, isLoading: dueLoading, refetch: refetchDue } = trpc.flashcard.due.useQuery(
    { courseId, limit: 30 },
    { enabled: courseId > 0 && isAuthenticated }
  );

  // Get all cards for stats
  const { data: allCards } = trpc.flashcard.list.useQuery(
    { courseId },
    { enabled: courseId > 0 && isAuthenticated }
  );

  // Get stats
  const { data: stats } = trpc.flashcard.stats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const utils = trpc.useUtils();

  // Review mutation
  const reviewMutation = trpc.flashcard.review.useMutation({
    onSuccess: () => {
      utils.flashcard.due.invalidate();
      utils.flashcard.stats.invalidate();
    },
  });

  const currentCard = dueCards?.[currentIndex];
  const totalDue = dueCards?.length ?? 0;
  const courseStats = stats?.find((s: { courseId: number }) => s.courseId === courseId);

  const masteredCount = useMemo(() => {
    if (!allCards) return 0;
    return allCards.filter((c: FlashcardData) => c.repetitions >= 5).length;
  }, [allCards]);

  const totalCards = allCards?.length ?? 0;

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const handleRate = useCallback(async (quality: number) => {
    if (!currentCard) return;
    try {
      await reviewMutation.mutateAsync({ cardId: currentCard.id, quality });
      setSessionReviewed((prev) => prev + 1);
      if (quality >= 3) setSessionCorrect((prev) => prev + 1);
      setFlipped(false);
      if (currentIndex < totalDue - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
        refetchDue();
      }
    } catch {
      toast.error("Error submitting review");
    }
  }, [currentCard, currentIndex, totalDue, reviewMutation, refetchDue]);

  const handleInitialize = useCallback(async () => {
    if (courseId > 0) {
      await initMutation.mutateAsync({ courseId });
    }
  }, [courseId, initMutation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      <div className="pt-28 pb-20 container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/learn/${slug}`}
            className="inline-flex items-center gap-2 text-[#0C3C3C] hover:text-[#D4AF37] font-['Montserrat'] text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl sm:text-3xl font-bold">
                Flashcards
              </h1>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
                Spaced Repetition System - Remember more, study less
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {totalCards > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-white/60 border border-[#D4CBBA] p-4 text-center">
              <BookOpen className="w-5 h-5 text-[#227C82] mx-auto mb-1" />
              <div className="text-[#0C3C3C] font-['Montserrat'] text-xl font-bold">{totalCards}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs">Total Cards</div>
            </div>
            <div className="bg-white/60 border border-[#D4AF37]/30 p-4 text-center">
              <Clock className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
              <div className="text-[#D4AF37] font-['Montserrat'] text-xl font-bold">{totalDue}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs">Due for Review</div>
            </div>
            <div className="bg-white/60 border border-[#D4CBBA] p-4 text-center">
              <Trophy className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
              <div className="text-[#0C3C3C] font-['Montserrat'] text-xl font-bold">{masteredCount}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs">Mastered</div>
            </div>
            <div className="bg-white/60 border border-[#D4CBBA] p-4 text-center">
              <Sparkles className="w-5 h-5 text-[#227C82] mx-auto mb-1" />
              <div className="text-[#0C3C3C] font-['Montserrat'] text-xl font-bold">
                {totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0}%
              </div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs">Mastery Rate</div>
            </div>
          </div>
        )}

        {/* Mastery Progress */}
        {totalCards > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">Mastery Progress</span>
              <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">
                {masteredCount}/{totalCards}
              </span>
            </div>
            <Progress
              value={totalCards > 0 ? (masteredCount / totalCards) * 100 : 0}
              className="h-2 bg-[#164A4A]"
            />
          </div>
        )}

        {/* No cards yet - initialize */}
        {totalCards === 0 && !dueLoading && (
          <div className="bg-white/40 border border-[#D4CBBA] p-10 text-center">
            <Brain className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-4" />
            <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-3">
              Start Your Flashcard Journey
            </h2>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm mb-6 max-w-md mx-auto">
              Flashcards will be automatically created from the glossary terms in this course. The system uses spaced repetition to help you remember terms more effectively over time.
            </p>
            <Button
              onClick={handleInitialize}
              disabled={initMutation.isPending}
              className="bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold hover:bg-[#B8962E] px-8 py-3"
            >
              {initMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate Flashcards
            </Button>
          </div>
        )}

        {/* Loading */}
        {dueLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        )}

        {/* All caught up */}
        {totalCards > 0 && totalDue === 0 && !dueLoading && (
          <div className="bg-white/40 border border-[#D4CBBA] p-10 text-center">
            <CheckCircle className="w-16 h-16 text-[#227C82] mx-auto mb-4" />
            <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-3">
              All Caught Up!
            </h2>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm mb-2">
              No cards are due for review right now. Come back later when cards become due.
            </p>
            {sessionReviewed > 0 && (
              <div className="mt-6 bg-[#164A4A]/30 border border-[#D4AF37]/20 p-4 inline-block">
                <p className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">
                  Today's Session: {sessionReviewed} cards | {sessionCorrect}/{sessionReviewed} correct
                </p>
              </div>
            )}
          </div>
        )}

        {/* Flashcard Review Area */}
        {currentCard && totalDue > 0 && (
          <div>
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
                Card {currentIndex + 1} of {totalDue}
              </span>
              {sessionReviewed > 0 && (
                <span className="text-[#227C82] font-['Montserrat'] text-xs font-semibold">
                  {sessionCorrect}/{sessionReviewed} correct
                </span>
              )}
            </div>

            {/* The Card */}
            <div
              onClick={handleFlip}
              className="relative cursor-pointer select-none mb-6"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "280px",
                }}
              >
                {/* Front - Term */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#1A5C5C] to-[#0C3C3C] border-2 border-[#D4AF37]/40 p-8 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-[#D4AF37]/40 font-['Montserrat'] text-xs uppercase tracking-widest mb-4">
                    TERM
                  </div>
                  <h2 className="text-white font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-center mb-3">
                    {currentCard.term}
                  </h2>
                  <div className="absolute bottom-4 text-white/40 font-['Work_Sans'] text-xs">
                    Click to flip
                  </div>
                </div>

                {/* Back - Definition */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#164A4A] to-[#1A5C5C] border-2 border-[#227C82]/60 p-8 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="text-[#227C82]/60 font-['Montserrat'] text-xs uppercase tracking-widest mb-4">
                    DEFINITION
                  </div>
                  <p className="text-white font-['Work_Sans'] text-base sm:text-lg text-center leading-relaxed max-w-lg">
                    {currentCard.definition}
                  </p>
                  <div className="absolute bottom-4 text-white/40 font-['Work_Sans'] text-xs">
                    Click to flip
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Buttons - only show when flipped */}
            {flipped && (
              <div className="space-y-3">
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm text-center mb-3">
                  How well did you recall?
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {QUALITY_LABELS.map((q) => (
                    <button
                      key={q.quality}
                      onClick={() => handleRate(q.quality)}
                      disabled={reviewMutation.isPending}
                      className={`${q.color} hover:opacity-90 text-white p-3 text-center transition-all duration-200 disabled:opacity-50`}
                    >
                      <div className="text-lg mb-1">{q.icon}</div>
                      <div className="font-['Montserrat'] text-xs font-bold">{q.label}</div>
                      <div className="font-['Work_Sans'] text-[10px] opacity-80">{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            {!flipped && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }}
                  disabled={currentIndex === 0}
                  className="p-2 text-[#0C3C3C] hover:text-[#D4AF37] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleFlip}
                  className="px-6 py-2 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] text-sm font-bold hover:bg-[#D4AF37] hover:text-[#0C3C3C] transition-all"
                >
                  Flip Card
                </button>
                <button
                  onClick={() => { setCurrentIndex(Math.min(totalDue - 1, currentIndex + 1)); setFlipped(false); }}
                  disabled={currentIndex >= totalDue - 1}
                  className="p-2 text-[#0C3C3C] hover:text-[#D4AF37] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        {totalCards > 0 && (
          <div className="mt-12 bg-white/30 border border-[#D4CBBA] p-6">
            <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-lg font-bold mb-4">
              How Spaced Repetition Works
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <div className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-1">
                  1. Review Cards
                </div>
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs leading-relaxed">
                  Read the term, try to recall the definition, then flip to check.
                </p>
              </div>
              <div>
                <div className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-1">
                  2. Rate Your Recall
                </div>
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs leading-relaxed">
                  Rate how easily you recalled it. Harder cards appear more frequently.
                </p>
              </div>
              <div>
                <div className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-1">
                  3. Master Over Time
                </div>
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs leading-relaxed">
                  Cards you master appear less often. Focus on what needs review.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
