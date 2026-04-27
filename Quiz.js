const API_KEY = "AIzaSyBAvHbtYf4Nv4UxOmp1DYMeppzu48WNGP0";
const generateBtn = document.getElementById("generate");
const quizDiv = document.getElementById("quiz");

generateBtn.addEventListener("click", async () => {
  const topic = document.getElementById("topic").value;

  if (!topic) {
    alert("Please enter a topic");
    return;
  }

  quizDiv.innerHTML = "<p>Loading quiz... ⏳</p>";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 3 MCQ questions on ${topic}.
Return ONLY JSON array.Format:
[
  {
    "question": "string",
    "options": ["a", "b", "c", "d"],
    "answer": "correct option"
  }
]`
                }
              ]
            }
          ]
        })
      }
    );

  
    if (!res.ok) {
      const error = await res.text();
      console.log(error);
      quizDiv.innerHTML = "API Error ";
      return;
    }
    const data = await res.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      quizDiv.innerHTML = "No response from AI ";
      return;
    }
    const cleaned = text.replace(/```json|```/g, "").trim();

    let questions;

    try {
      questions = JSON.parse(cleaned);
    } catch {
      quizDiv.innerHTML = "Invalid AI response ";
      console.log(cleaned);
      return;
    }
    displayQuiz(questions);

  } catch (err) {
    console.log(err);
    quizDiv.innerHTML = "Error loading quiz ";
  }
});
function displayQuiz(questions) {
  quizDiv.innerHTML = questions.map((q, index) => `
    <div>
      <p><b>${index + 1}. ${q.question}</b></p>
      ${q.options.map(opt => `
        <label>
          <input type="radio" name="q${index}" value="${opt}">
          ${opt}
        </label><br>
      `).join("")}
    </div>
  `).join("");
}