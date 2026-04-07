# PROJECT_RULES.md

## Product Vision
This project is a premium-feeling, Tamil-only language learning web app for an English- and Spanish-speaking beginner. The product should help the learner reach basic spoken conversational ability as efficiently as possible using evidence-based study methods, adaptive review, and excellent UX.

The app is NOT a generic language platform. Every design choice should support Tamil learning speed, retention, confidence, and pronunciation.

---

## Core Product Principles

1. **Conversation-first**
   - Prioritize spoken usefulness over academic completeness.
   - Teach words and phrases that combine into real mini-conversations quickly.

2. **Colloquial usefulness**
   - Prefer everyday spoken Tamil where practical.
   - Mark politeness/register when relevant.

3. **Evidence-based learning**
   - Use spaced repetition, retrieval practice, interleaving, and small lesson sizes.
   - Do not overload the learner with too many new items at once.

4. **Encouragement without childishness**
   - The tone should be motivating, warm, and human.
   - Avoid overly childish gamification language.
   - Progress should feel satisfying and premium.

5. **Reduce friction**
   - One-click continue.
   - Clear lesson flow.
   - Minimal confusing settings.
   - Fast loading and smooth transitions.

6. **Visible growth**
   - Always show progress meaningfully:
     - streak
     - mastery
     - difficult words
     - review due
     - recent wins

7. **Pronunciation support is essential**
   - Pronunciation playback should be prominent.
   - Show Tamil script, transliteration, English-friendly approximation, and Spanish-friendly approximation when available.
   - Be honest when pronunciation is approximate.

8. **Accessible and responsive**
   - Mobile-first but beautiful on desktop.
   - Strong contrast.
   - Clear typography.
   - Keyboard accessible.
   - Respect reduced motion preferences.

9. **Static-first architecture**
   - Must run locally with no backend.
   - Must be deployable to GitHub Pages.
   - No secrets in the frontend.

10. **Future-proofing**
   - Architect so later additions are easy:
     - Tamil script writing
     - speech recognition
     - cloud sync
     - accounts
     - richer analytics

---

## Visual Design Rules

### Overall Mood
- Modern
- Clean
- Warm
- Focused
- Premium
- Motivating
- Slightly playful but not childish

### UI Style
- Rounded cards
- Gentle shadows
- Spacious layouts
- High readability
- Subtle gradients allowed
- Minimal clutter
- Use iconography consistently
- Prefer clear hierarchy over decorative complexity

### Motion
- Use subtle transitions only
- Reward completion with tasteful motion
- Never use distracting animations during active recall
- Respect `prefers-reduced-motion`

### Color
- Maintain strong accessibility contrast
- Use a coherent primary accent and 1–2 support accents
- Success, warning, and review states must be visually distinct
- Dark mode must feel designed, not inverted

### Typography
- Highly legible
- Strong hierarchy
- Avoid overly decorative fonts
- Tamil text must render clearly and at a readable size
- Transliteration and pronunciation guides must be visually secondary but easy to scan

---

## Learning UX Rules

1. Introduce few new items at once.
2. Mix new material with review.
3. Show immediate corrective feedback.
4. Let users retry infinitely without shame.
5. Surface difficult words more often.
6. Reduce frequency of mastered words.
7. Include recap at the end of every lesson.
8. Build from words -> short phrases -> mini-dialogues.
9. Keep session lengths psychologically manageable.
10. Every lesson should feel like progress toward conversation.

---

## Content Rules

1. Tamil only as the target language.
2. Base learner languages are English and Spanish.
3. Every item should support:
   - tamil
   - transliteration
   - englishMeaning
   - spanishMeaning
   - englishApproxPronunciation
   - spanishApproxPronunciation
   - tags
   - frequencyPriority
   - difficulty
4. Prefer high-frequency, conversation-relevant content first.
5. Group content into meaningfully related lesson clusters.
6. Early lessons must combine well into mini-conversations.
7. Avoid random disconnected vocabulary dumps.
8. If a phrase is more useful than a standalone word, teach the phrase first.

---

## Engineering Rules

1. TypeScript strict mode required.
2. Favor small reusable components.
3. Business logic should be in testable pure functions.
4. Validate lesson/content data with schema validation.
5. Keep data structures explicit and documented.
6. Avoid overengineering.
7. Avoid unnecessary dependencies.
8. No secrets in client code.
9. No dangerous HTML injection patterns.
10. Keep the MVP static-first.

---

## Security Rules

1. Never commit secrets, tokens, or keys.
2. Never trust imported content blindly.
3. Sanitize or validate all content structures.
4. Avoid `dangerouslySetInnerHTML`.
5. Avoid `eval`, `new Function`, or dynamic script injection.
6. Keep third-party dependencies minimal and reputable.
7. Add a basic `SECURITY.md`.
8. Document privacy assumptions clearly.
9. Local MVP should store only learning progress and preferences.
10. If future APIs are introduced, they must go through a server-side boundary.

---

## Content Roadmap Rules

### Early roadmap priority
1. greetings
2. politeness
3. pronouns
4. yes/no
5. question words
6. essential verbs
7. daily needs
8. food/drink
9. directions/places
10. time/routine
11. feelings/states
12. family/social
13. mini-dialogues
14. review reinforcement
15. practical phrase variation

### Success definition
The MVP succeeds if the learner can:
- recognize and recall core spoken Tamil words/phrases
- pronounce them more confidently
- build simple practical conversations
- remember difficult items through adaptive review
- keep returning because the app feels rewarding and clear