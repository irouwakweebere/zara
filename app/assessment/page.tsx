import Link from "next/link";
import SkinQuiz from "./skin-quiz";

export default function AssessmentPage() {
  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <Link className="wordmark" href="/" aria-label="Skindrug Gist home">
          <span className="brand-skin">Skin</span>
          <span className="brand-drug">Drug</span>
          <span className="brand-gist">Gist</span>
        </Link>
        <Link className="quiz-home-link" href="/">Back to the website <span aria-hidden="true">↗</span></Link>
      </header>
      <SkinQuiz />
      <footer className="quiz-footer">
        Your consultation details are submitted securely through this website.
      </footer>
    </main>
  );
}
