App name: Oratoria

**Idea pitch**:  
Interactions between humans determine everything in our lifes \- material and psychical wellbeing, place in society, and every other aspect that extents beyond being an animal. In ancient Greece, sophists used to be trained in using words in impressive ways. They could persuade everyone towards their point. Later, the most educated individuals in our society underwent education in maneuvering social situations. They learned manners specific to certain context, they learned the rules, and they learned how to break them graciously. 

Given the development of our education-oriented technology, it is surprising that we don’t have a tool for analyzing, practicing, and preparing for challenging social interactions.

Social situations are like games. When learning how to play chess on a high level, playing other people is not enough. To be really good and impressive, you have to analyze your performance, practice difficult aspects, and refine your own style.

My tool (Oratoria) is like chess practice but for conversation mastery.You can refine your style, prepare for difficult conversations, and learn how to impress people and achieve your goals through conversations.

**App description**:

The user at the beginning can:

- Select their languages  
  - Native languages  
  - Languages they use in social situations  
  - Languages they use in professional environment  
- Describe their style  
  - What style do they want to present with themselves  
    - in professional environment  
    - in informal situations (friends, etc)  
  - What do they think their style is like right now  
    - in professional environment  
    - in informal situations  
- Select their courses  
  - The skills the user can learn are organized in courses. Each course has chapters. For now, we start with these:  
    - Small talk  
      - Coworkers  
      - Friends  
    - Taboo topics  
      - Health problems  
      - Mental health problems  
      - Other awkward situations  
    - Negotiations  
    - Interviews

**The app**:

- The app should be very simple and clean  
- It should consist of a few tabs:  
  - My courses (the user’s selected courses)  
  - Courses browsing  
  - Profile  
  - Quick training (for quiz-like, fast social situations training)  
- In each course, the user has chapters. Each chapter consists of a separate context. For example, for a course about small talk, there would be a chapter about small talk with coworkers.  
- Each chapter should consist of multiple situations (conversations with AI)  
- Although we have the ideas for courses already, the first course would be a “Trial Course”, which would showcase the power of the app. It should consist of two chapters. Each of these chapters should have three situations.

**Chapter structure:**

- Each chapter describes the course problem in a given context. For example, we might have a chapter about talking with random people in the course about small talk. The user can skip each chapter if it seems obvious.  
- Each chapter start with description of best practices in this case.  
- This is followed by a series of situations. Each chapter has a couple of these  
- Each situation is a voice conversation with the AI:  
  - The user gets a description of the situation in which they are and what they want to achieve  
  - Then, they talk with AI (OpenAI API \+ Elevenlabs voice), role-playing this situation and taking turns.  
  - After the conversation, the app displays a summary:  
    - How would the user be perceived by their conversation partner  
    - Strong points  
    - Weak points: what could be improved, what should they work on, and so on.  
  - There is memory between situations: summary of each situation is given to the next situation so the AI can give better tips  
  - After going through all situations in a chapter, the app should award the user with a score, give them a summary and outline areas that might be important to work on

**Tech stack**

- Next JS  
- Supabase (very simple structure for storing user progress and their description)  
- Tailwind CSS  
- Clerk for authentication  
- Vercel for hosting
- Elevenlabs for text-to-speech
- fal.ai for LLM (they have a wide selection of popular LLMs)
- fal.ai for speech-to-text



**Color scheme**:
Primary – Dark Blue/Charcoal:
Hex: #2C3E50

Secondary – Teal:
Hex: #27AE60

Accent – Warm Orange:
Hex: #F39C12

Background – Light Gray:
Hex: #ECF0F1

Text – Dark Charcoal:
Hex: #34495E