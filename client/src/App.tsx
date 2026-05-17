import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Course from "./pages/Course";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import LecturePlayer from "./pages/LecturePlayer";
import QuizEngine from "./pages/QuizEngine";
import QuizList from "./pages/QuizList";
import PracticeExam from "./pages/PracticeExam";
import StudyPlanner from "./pages/StudyPlanner";
import Admin from "./pages/Admin";
import Certificates from "./pages/Certificates";
import Flashcards from "./pages/Flashcards";
import VerifyCertificate from "./pages/VerifyCertificate";
import Login from "./pages/Login";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public pages */}
        <Route path={"/"} component={Home} />
        <Route path={"/about"} component={About} />
        <Route path={"/course"} component={Course} />
        <Route path={"/contact"} component={Contact} />

        {/* Student LMS pages */}
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/learn/:slug"} component={Learn} />
        <Route path={"/learn/:slug/lecture/:lectureId"} component={LecturePlayer} />
        <Route path={"/learn/:slug/quiz/:quizId"} component={QuizEngine} />
        <Route path={"/learn/:slug/quizzes"} component={QuizList} />
        <Route path={"/learn/:slug/practice-exam"} component={PracticeExam} />
        <Route path={"/learn/:slug/study-planner"} component={StudyPlanner} />
        <Route path={"/learn/:slug/flashcards"} component={Flashcards} />

        {/* Credentials */}
        <Route path={"/certificates"} component={Certificates} />
        <Route path={"/verify/:certificateNumber"} component={VerifyCertificate} />

        {/* Auth pages */}
        <Route path={"/login"} component={Login} />
        {/* Admin pages */}
        <Route path={"/admin"} component={Admin} />

        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
