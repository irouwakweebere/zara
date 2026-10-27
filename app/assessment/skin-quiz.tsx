"use client";

import { useState, type FormEvent } from "react";

const ageRanges = ["Under 18 years", "25-34 years", "35-44 years", "45-54 years", "55+"];
const genders = ["Female", "Male", "Prefer not to say"];
const skinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive", "Not sure"];
const skinTones = ["Very fair", "Fair", "Medium", "Tan/Caramel", "Deep", "Very deep"];
const concernLocations = ["Face", "Neck", "Chest", "Back", "Arm", "Leg", "Entire body"];
const mainConcerns = ["Acne", "Dark spots/post acne marks", "Hyperpigmentation", "Uneven skin tone", "Melasma", "Oily skin", "Dry skin", "Sun damage", "Sensitive", "Eczema", "Fine lines/wrinkles", "Textured skin", "Large pores", "Skin lighting cream damages", "Stretch mark"];
const concernDurations = ["Less than a month", "1-3 months", "3-6 months", "6-12 months", "1 year"];
const acneTypes = ["Black heads", "White heads", "Small head pimple", "Pus-filled pimple", "Cystic acne", "Acne scars", "I do not have acne"];
const periodOptions = ["Yes", "No", "I'm not sure", "Not applicable"];
const routineConsistency = ["Daily", "Most days", "Occasionally", "Rarely"];
const pastTreatments = ["Hydroquinone", "Kojic acid", "Tretinion", "Azelaic acid", "Vitamin c", "Chemical peels", "Steroidal cream"];
const knownAllergies = ["Yes", "No", "Not sure"];
const pregnancyOptions = ["Yes", "No", "Maybe"];
const skinConditions = ["Vitiligo", "Rosacea", "Eczema", "Psoriasis", "Seborrheic dermatitis", "None", "Other"];
const waterAmounts = ["Less than 1 litres", "2-3 litres", "More than 3 litres"];
const stressLevels = ["Low", "Moderate", "High"];
const sleepAmounts = ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8hours"];
const consultationGoals = ["Clear acne", "Fade Hyperpigmentation", "Repair skin barrier", "Control oilliness", "Reduce sensitivity", "Brghten skin", "Build a skin routine", "Maintain a healthy skin"];

const sectionTitles = ["CONSULTATION DETAILS", "SKIN PROFILE", "MAIN SKIN CONCERN", "ACNE ASSESSMENT (if applicable)", "CURRENT SKIN CARE ROUTINE", "PAST TREATMENT", "MEDICAL AND SAFETY SCREENING", "LIFESTYLE", "CONSULTATION GOAL & CONSENT"];

export default function SkinQuiz() {
  const [section, setSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/skin-assessment", { method: "POST", body: new FormData(event.currentTarget) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We couldn't submit your consultation form.");
      event.currentTarget.reset();
      setSection(0);
      setStatus({ message: "Your consultation form was submitted successfully.", success: true });
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "We couldn't submit your consultation form.", success: false });
    } finally {
      setIsSubmitting(false);
    }
  }

  function nextSection(event: FormEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) return;
    const activeFields = form.querySelectorAll(`[data-section="${section}"]`);
    for (const field of Array.from(activeFields)) {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        if (!field.checkValidity()) { field.reportValidity(); return; }
      }
    }
    setSection((current) => Math.min(current + 1, sectionTitles.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setSection((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="quiz-content" aria-labelledby="quiz-title">
      <p className="eyebrow">SKINDRUG_GIST CONSULTATION FORM</p>
      <h1 id="quiz-title">SKIN <em>consultation.</em></h1>
      <p className="quiz-intro">Skindrug_gist welcomes you to this consultation session. Feel free to reach out to us via our WhatsApp number 08082884306.</p>
      <form className="quiz-card exact-assessment-form" onSubmit={handleSubmit}>
        <div className="assessment-progress"><span>SECTION {section + 1} OF {sectionTitles.length}</span><strong>{sectionTitles[section]}</strong><div><span style={{ width: `${((section + 1) / sectionTitles.length) * 100}%` }} /></div></div>

        <div hidden={section !== 0}>
          <label className="assessment-field">Full name *<input autoComplete="name" data-section="0" name="fullName" required /></label>
          <label className="assessment-field">Email address *<input autoComplete="email" data-section="0" name="emailAddress" required type="email" /></label>
          <label className="assessment-field">Phone number/ WhatsApp number *<input autoComplete="tel" data-section="0" name="phoneNumber" required type="tel" /></label>
          <fieldset className="assessment-fieldset"><legend>Age range</legend>{ageRanges.map((option) => <label className="assessment-radio" key={option}><input data-section="0" name="ageRange" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>Gender</legend>{genders.map((option) => <label className="assessment-radio" key={option}><input data-section="0" name="gender" type="radio" value={option} />{option}</label>)}</fieldset>
        </div>

        <div hidden={section !== 1}>
          <fieldset className="assessment-fieldset"><legend>How would you describe your skin type</legend>{skinTypes.map((option) => <label className="assessment-radio" key={option}><input data-section="1" name="skinType" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>Skin tone</legend>{skinTones.map((option) => <label className="assessment-radio" key={option}><input data-section="1" name="skinTone" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>Location of skin concern</legend>{concernLocations.map((option) => <label className="assessment-radio" key={option}><input data-section="1" name="concernLocation" type="radio" value={option} />{option}</label>)}</fieldset>
        </div>

        <div hidden={section !== 2}>
          <fieldset className="assessment-fieldset"><legend>What are your main skin concerns</legend>{mainConcerns.map((option) => <label className="assessment-checkbox" key={option}><input data-section="2" name="mainConcerns" type="checkbox" value={option} />{option}</label>)}</fieldset>
          <label className="assessment-field">Please describe your skin concern in your own words<textarea data-section="2" name="skinConcernDescription" rows={4} /></label>
          <fieldset className="assessment-fieldset"><legend>How long have you had this skin concern</legend>{concernDurations.map((option) => <label className="assessment-radio" key={option}><input data-section="2" name="concernDuration" type="radio" value={option} />{option}</label>)}</fieldset>
        </div>

        <div hidden={section !== 3}>
          <fieldset className="assessment-fieldset"><legend>What type of acne do you experience</legend>{acneTypes.map((option) => <label className="assessment-radio" key={option}><input data-section="3" name="acneType" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>Do your acne worsen during menstrual period</legend>{periodOptions.map((option) => <label className="assessment-radio" key={option}><input data-section="3" name="menstrualAcne" type="radio" value={option} />{option}</label>)}</fieldset>
        </div>

        <div hidden={section !== 4}>
          <label className="assessment-field">What cleanser are you using<input data-section="4" name="cleanser" /></label>
          <label className="assessment-field">What treatment products /serum are you using<input data-section="4" name="serum" /></label>
          <label className="assessment-field">What moisturizer are you using<input data-section="4" name="moisturizer" /></label>
          <fieldset className="assessment-fieldset"><legend>What sunscreen are you using</legend>{["Option 1"].map((option) => <label className="assessment-radio" key={option}><input data-section="4" name="sunscreen" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>How consistent are you with your routine</legend>{routineConsistency.map((option) => <label className="assessment-radio" key={option}><input data-section="4" name="routineConsistency" type="radio" value={option} />{option}</label>)}</fieldset>
        </div>

        <div hidden={section !== 5}>
          <fieldset className="assessment-fieldset"><legend>Have you used any of these products before</legend>{pastTreatments.map((option) => <label className="assessment-checkbox" key={option}><input data-section="5" name="pastTreatments" type="checkbox" value={option} />{option}</label>)}</fieldset>
          <label className="assessment-field">What treatment worked for you<textarea data-section="5" name="workedTreatment" rows={3} /></label>
          <label className="assessment-field">What treatment caused irritation or made skin worse<input data-section="5" name="irritatingTreatment" /></label>
        </div>

        <div hidden={section !== 6}>
          <fieldset className="assessment-fieldset"><legend>Do have any known allergies</legend>{knownAllergies.map((option) => <label className="assessment-radio" key={option}><input data-section="6" name="knownAllergies" type="radio" value={option} />{option}</label>)}</fieldset>
          <label className="assessment-field">If yes, specify<input data-section="6" name="allergyDetails" /></label>
          <fieldset className="assessment-fieldset"><legend>Are you pregnant</legend>{pregnancyOptions.map((option) => <label className="assessment-radio" key={option}><input data-section="6" name="pregnant" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>Are you breastfeeding</legend>{pregnancyOptions.map((option) => <label className="assessment-radio" key={option}><input data-section="6" name="breastfeeding" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>Do you have any diagnosed skin conditions</legend>{skinConditions.map((option) => <label className="assessment-radio" key={option}><input data-section="6" name="skinConditions" type="radio" value={option} />{option}</label>)}</fieldset>
          <label className="assessment-field">Are you on any Oral or topical medication<input data-section="6" name="medication" /></label>
        </div>

        <div hidden={section !== 7}>
          <fieldset className="assessment-fieldset"><legend>How many litres water do you take per day</legend>{waterAmounts.map((option) => <label className="assessment-radio" key={option}><input data-section="7" name="waterAmount" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>How stressed are you per day</legend>{stressLevels.map((option) => <label className="assessment-radio" key={option}><input data-section="7" name="stressLevel" type="radio" value={option} />{option}</label>)}</fieldset>
          <fieldset className="assessment-fieldset"><legend>How many hours of sleep do you get per day</legend>{sleepAmounts.map((option) => <label className="assessment-radio" key={option}><input data-section="7" name="sleepAmount" type="radio" value={option} />{option}</label>)}</fieldset>
        </div>

        <div hidden={section !== 8}>
          <fieldset className="assessment-fieldset"><legend>What's your primary goal</legend>{consultationGoals.map((option) => <label className="assessment-radio" key={option}><input data-section="8" name="primaryGoal" type="radio" value={option} />{option}</label>)}</fieldset>
          <label className="assessment-checkbox consent-question"><input data-section="8" name="consent" required type="checkbox" value="I understand that this consultation provides skincare guidance and does not replace a medical diagnosis or treatment from a licensed healthcare professional." />I understand that this consultation provides skincare guidance and does not replace a medical diagnosis or treatment from a licensed healthcare professional.</label>
          <label className="assessment-field">Upload clear photos of skin<input accept="image/*" data-section="8" multiple name="photos" type="file" /></label>
        </div>

        {status && <p className={`form-status${status.success ? " success" : ""}`} role="status">{status.message}</p>}
        <div className="quiz-controls">
          <button className="quiz-back-button" disabled={section === 0} onClick={goBack} type="button">← Back</button>
          {section < sectionTitles.length - 1 ? (
            <button className="primary-button quiz-next-button" onClick={nextSection} type="button">Next <span aria-hidden="true">→</span></button>
          ) : (
            <button className="primary-button quiz-next-button" disabled={isSubmitting} type="submit">{isSubmitting ? "Submitting..." : "Submit"}<span aria-hidden="true">→</span></button>
          )}
        </div>
      </form>
    </section>
  );
}
