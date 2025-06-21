# 🕵️‍♂️ Neural Detective: Case of the Vanishing Heir

**Neural Detective** is a browser-based detective game where you play as a high-tech investigator aided by an AI system. Investigate crime scenes, interrogate suspects, and use deductive logic to solve the mystery of a missing heir. Featuring immersive dialogue trees, 2D visuals, and a branching narrative, your choices determine the outcome.

---

## 📚 Table of Contents

- [Introduction](#introduction)  
- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Tech Stack](#tech-stack)  
- [Game Flow](#game-flow)  
- [Configuration](#configuration)  
- [Development Notes](#development-notes)  
- [Contributing](#contributing)  
- [License](#license)

---

## 🧠 Introduction

Set in a noir-inspired universe, **Neural Detective** puts players in the shoes of a detective working with a powerful AI assistant. The AI helps analyze evidence, interrogate NPCs, and connect the dots in a complex mystery involving a wealthy family's missing heir.

Your investigation can lead to a right arrest, a wrong one, or even an unresolved case depending on your actions.

---

## ✨ Features

- 🎭 **Dialogue Trees**: Branching conversations with suspects  
- 🧩 **Evidence Analysis**: Gather and present clues during interrogations  
- 🌍 **Explorable Scenes**: Home, Office, Garage, Woods, and more  
- 🧠 **AI Interrogator**: Simulate logical, calm, or aggressive questioning styles  
- 🗺️ **Deduction Board**: Visualize relationships and evidence connections  
- 🎮 **Multiple Endings**: Based on your actions and deductions  
- 💾 **Save/Load Support**: Store progress locally with IndexedDB or LocalStorage  
- 🎨 **2D Canvas Art**: Custom scenes, sprites, and animations  
- 🔊 **Audio Effects**: Ambient sounds and feedback for immersive play  

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Chaitanyahoon/neural-detective.git
cd neural-detective

# Install dependencies
npm install

# Run the development server
npm run dev

```
# 🕹️ Usage
Start the game in your browser.

1. Read the case file and view the map.

2. Choose a location to investigate.

3. Collect clues and return to interrogate suspects.

4. Use the AI Interrogator to reveal truths and manipulate dialogue branches.

5. Build your case on the deduction board.

6. Accuse a suspect and see your results!





## Tech Stack


| Layer     |   Tech   | 
| :-------- | :------- | 
| `Frontend` | `Next.js, TypeScript, Tailwind CSS`| 
| `Rendering` | `HTML Canvas for 2D scenes` | 
| `Logic` | `Dialogue engine with branching trees` | 
| `Storage` | `LocalStorage / IndexedDB` | 
| `Optional API	` | `Flask or Node.js (future expansion)` | 
| `AI/NLP	` | `Simple rules + GPT-like structure` | 








## 🎮 Game Flow
1. Briefing Room – Case overview and map access

2. Investigation – Point-and-click clue collection

3. Interrogation – Use AI tone settings to unlock suspect insights

4. Deduction Board – Connect evidence to form theories

5. Accusation Phase – Final call based on your investigation




## 🙋‍♀️ Contributing
Pull requests and issue reports are welcome!

Fork the repo

Create a feature branch

Submit a PR with a clear description


## License


This project is under the [MIT](https://choosealicense.com/licenses/mit/) License.
