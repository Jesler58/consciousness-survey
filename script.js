// Data for the survey
const areas = {
    "Predominant Emotional State": {
      questions: [
        "Which of the following is closest to how you usually feel on a typical day?",
        "Which of the following best describes your emotional response when things don’t go as planned?",
        "When thinking about your life overall, which emotion feels the most familiar to you?",
        "Which of the following is closest to your emotional state in social or group settings?"
      ],
      outcomes: [
        "Ineffable", "Bliss", "Serenity", "Reverence", "Understanding",
        "Forgiveness", "Optimism", "Trust", "Affirmation", "Scorn",
        "Hate", "Craving", "Anxiety", "Regret", "Despair", "Blame", "Humiliation"
      ]
    },
    "View of Life": {
      questions: [
        "Which of the following is closest to your general view of life?",
        "How would you describe your perspective on the meaning of life?",
        "Which of the following best reflects how you see the world and its challenges?",
        "When thinking about life as a whole, which of the following feels most true to you?"
      ],
      outcomes: [
        "Is", "Perfect", "Complete", "Benign", "Meaningful", "Harmonious",
        "Hopeful", "Satisfactory", "Feasible", "Demanding", "Antagonistic",
        "Disappointing", "Frightening", "Tragic", "Hopeless", "Evil", "Miserable"
      ]
    },
    "God-View": {
      questions: [
        "Which of the following is closest to your view of God or a higher power?",
        "How do you feel God or a higher power interacts with the world?",
        "Which of the following best reflects how you see God’s role in your life?",
        "When considering the concept of God, which of the following feels most aligned with your belief?"
      ],
      outcomes: [
        "Self", "All-Being", "One", "Loving", "Wise", "Merciful",
        "Inspiring", "Enabling", "Permitting", "Indifferent", "Vengeful",
        "Denying", "Punitive", "Disdainful", "Condemning", "Vindictive", "Despising"
      ]
    }
  };
  
  // Tracking variables
  let usedOptions = {}; // Track used options for each area
  let selectedOption = {}; // Track the last selected option for each area
  let optionFrequency = {}; // Track how often each option is selected
  let round = 1; // Current round
  let currentAreaIndex = 0; // Index of the current area
  let userName = ""; // Store the user's name
  let results = {}; // Store the user's final results
  
  // Areas order
  const areaNames = Object.keys(areas);
  
  // Function to display the name prompt
  function askForName() {
    const questionDiv = document.getElementById("question");
    questionDiv.innerHTML = `
      <h2>Welcome to the Consciousness Survey!</h2>
      <p>Please enter your name to get started:</p>
      <input type="text" id="nameInput" placeholder="Your Name">
      <button onclick="startSurvey()">Start</button>
    `;
  }
  
  // Function to start the survey after getting the name
  function startSurvey() {
    const nameInput = document.getElementById("nameInput").value.trim();
    if (nameInput) {
      userName = nameInput;
      results["name"] = userName; // Save the name
      areaNames.forEach(area => {
        usedOptions[area] = [];
      });
      displayQuestion();
    } else {
      alert("Please enter your name to continue.");
    }
  }
  
  // Function to display the current question
  function displayQuestion() {
    const questionDiv = document.getElementById("question");
    questionDiv.innerHTML = ""; // Clear previous content
  
    // Get the current area
    const currentArea = areaNames[currentAreaIndex];
    const areaData = areas[currentArea];
  
    // Select a random question from the current area
    const randomQuestion = areaData.questions[Math.floor(Math.random() * areaData.questions.length)];
    questionDiv.innerHTML = `<h3>${randomQuestion}</h3>`;
  
    // Select options: one carried forward + five random from the remaining pool
    const currentOptions = [];
    if (selectedOption[currentArea]) {
      currentOptions.push(selectedOption[currentArea]); // Carry forward the previous selection
    }
    const remainingOptions = areaData.outcomes.filter(opt => !usedOptions[currentArea].includes(opt));
    while (currentOptions.length < 6 && remainingOptions.length > 0) {
      const randomOption = remainingOptions.splice(Math.floor(Math.random() * remainingOptions.length), 1)[0];
      currentOptions.push(randomOption);
    }
  
    // Shuffle options to randomize their order
    currentOptions.sort(() => Math.random() - 0.5);
  
    // Display options as buttons
    currentOptions.forEach(option => {
      const button = document.createElement("button");
      button.textContent = option;
      button.onclick = () => selectOption(option, currentArea);
      questionDiv.appendChild(button);
    });
  
    // Hide the Next button until an option is selected
    document.getElementById("next").style.display = "none";
  }
  
  // Handle option selection
  function selectOption(option, area) {
    selectedOption[area] = option; // Save the selected option for the area
    usedOptions[area].push(option); // Mark the option as used
    optionFrequency[option] = (optionFrequency[option] || 0) + 1; // Track frequency
    document.getElementById("next").style.display = "inline"; // Show the Next button
  }
  
  // Go to the next round
  function nextRound() {
    if (currentAreaIndex >= areaNames.length - 1) {
      currentAreaIndex = 0; // Reset to the first area
      round++;
    } else {
      currentAreaIndex++; // Move to the next area
    }
  
    if (round > 6) { // End after 6 full cycles
      displayResult();
    } else {
      displayQuestion();
    }
  }
  
  // Display the final result
  function displayResult() {
    const questionDiv = document.getElementById("question");
    questionDiv.innerHTML = `
      <h2>Thank you for completing the survey, ${userName}!</h2>
      <p>Your most resonant consciousness levels are:</p>
      <pre>${JSON.stringify(selectedOption, null, 2)}</pre>
      <p>Selection Frequency:</p>
      <pre>${JSON.stringify(optionFrequency, null, 2)}</pre>
    `;
    document.getElementById("next").style.display = "none";
  }
  
  // Initial setup
  document.getElementById("next").onclick = nextRound;
  askForName();
  