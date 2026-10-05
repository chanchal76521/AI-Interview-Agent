// =====================================================
// AI INTERVIEW AGENT
// HTML + CSS + JavaScript + GROQ AI API
// =====================================================


// =====================================================
// 1. API CONFIGURATION
// =====================================================

// YAHAN APNI ACTUAL GROQ API KEY PASTE KARO
//
// Example:
// const API_KEY = "gsk_xxxxxxxxxxxxxxxxx";
//
// Apni key kisi ko share mat karna.

const API_KEY = "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";


// Groq Chat Completions API
const API_URL =
    "https://api.groq.com/openai/v1/chat/completions";


// Current supported model
const MODEL =
    "openai/gpt-oss-20b";


// =====================================================
// 2. GET HTML ELEMENTS
// =====================================================

const setupCard =
    document.getElementById("setupCard");

const interviewCard =
    document.getElementById("interviewCard");

const resultCard =
    document.getElementById("resultCard");


const topic =
    document.getElementById("topic");

const difficulty =
    document.getElementById("difficulty");


const startBtn =
    document.getElementById("startBtn");

const submitBtn =
    document.getElementById("submitBtn");

const nextBtn =
    document.getElementById("nextBtn");

const restartBtn =
    document.getElementById("restartBtn");


const question =
    document.getElementById("question");

const answer =
    document.getElementById("answer");


const feedback =
    document.getElementById("feedback");

const feedbackTitle =
    document.getElementById("feedbackTitle");

const feedbackText =
    document.getElementById("feedbackText");

const explanation =
    document.getElementById("explanation");


const questionScore =
    document.getElementById("questionScore");

const scoreElement =
    document.getElementById("score");

const questionNumber =
    document.getElementById("questionNumber");


const finalScore =
    document.getElementById("finalScore");

const finalMessage =
    document.getElementById("finalMessage");

const setupError =
    document.getElementById("setupError");


// =====================================================
// 3. INTERVIEW VARIABLES
// =====================================================

let currentQuestion = "";

let currentQuestionNumber = 1;

let totalScore = 0;

let questionsCompleted = 0;

const TOTAL_QUESTIONS = 5;


// =====================================================
// 4. CHECK API KEY
// =====================================================

function isApiKeyValid() {

    if (!API_KEY) {
        return false;
    }

    if (
        API_KEY.trim() === ""
    ) {
        return false;
    }

    if (
        API_KEY ===
        "PASTE_YOUR_GROQ_API_KEY_HERE"
    ) {
        return false;
    }

    return true;
}


// =====================================================
// 5. AI API FUNCTION
// =====================================================

async function callAI(prompt) {

    // Check API key first
    if (!isApiKeyValid()) {

        throw new Error(
            "API key missing. Please paste your Groq API key in script.js."
        );
    }


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        "Bearer " + API_KEY.trim()
                },

                body: JSON.stringify({

                    model: MODEL,

                    messages: [

                        {
                            role: "system",

                            content:
                                "You are a professional frontend developer interviewer. Ask clear technical questions and evaluate fresher-level answers fairly."
                        },

                        {
                            role: "user",

                            content: prompt
                        }

                    ],

                    temperature: 0.7,

                    max_completion_tokens: 700

                })
            }
        );


        // Get JSON response
        const data =
            await response.json();


        console.log(
            "Groq API Response:",
            data
        );


        // =================================================
        // ERROR HANDLING
        // =================================================

        if (!response.ok) {

            let message =
                "AI API request failed.";

            if (response.status === 401) {

                message =
                    "401 - Invalid API key. Check your Groq API key.";

            } else if (response.status === 403) {

                message =
                    "403 - Your account/project does not have permission to use this model.";

            } else if (response.status === 429) {

                message =
                    "429 - API rate limit reached. Try again later.";

            } else if (response.status === 400) {

                message =
                    "400 - Bad request. Check the model or API request.";

            } else if (
                data &&
                data.error &&
                data.error.message
            ) {

                message =
                    data.error.message;
            }


            throw new Error(message);
        }


        // =================================================
        // GET AI TEXT
        // =================================================

        const content =
            data?.choices?.[0]?.message?.content;


        if (!content) {

            throw new Error(
                "AI returned an empty response."
            );
        }


        return content;

    } catch (error) {

        console.error(
            "AI API Error:",
            error
        );

        throw error;
    }
}


// =====================================================
// 6. START INTERVIEW
// =====================================================

startBtn.addEventListener(
    "click",
    async function () {

        setupError.textContent = "";


        // Check key
        if (!isApiKeyValid()) {

            setupError.textContent =
                "Please paste your Groq API key in script.js first.";

            return;
        }


        // Reset interview
        currentQuestionNumber = 1;

        totalScore = 0;

        questionsCompleted = 0;


        scoreElement.textContent =
            "Score: 0";


        // Change screens
        setupCard.classList.add(
            "hidden"
        );

        interviewCard.classList.remove(
            "hidden"
        );


        // Generate first question
        await generateQuestion();

    }
);


// =====================================================
// 7. GENERATE INTERVIEW QUESTION
// =====================================================

async function generateQuestion() {

    // Loading UI
    question.textContent =
        "🤖 AI is preparing your question...";


    questionNumber.textContent =
        `Question ${currentQuestionNumber} / ${TOTAL_QUESTIONS}`;


    answer.value = "";


    feedback.classList.add(
        "hidden"
    );


    submitBtn.disabled = true;

    nextBtn.disabled = true;


    // Prompt
    const prompt = `

You are a technical interviewer.

Candidate is applying for a Frontend Developer fresher position.

Technology:
${topic.value}

Difficulty:
${difficulty.value}

Generate ONE interview question.

Rules:

1. Ask only ONE question.
2. Do not provide the answer.
3. Do not number the question.
4. Keep it relevant to frontend development.
5. Make it suitable for a ${difficulty.value} candidate.
6. Return only the question.

`;


    try {

        const result =
            await callAI(prompt);


        currentQuestion =
            result.trim();


        question.textContent =
            currentQuestion;


        submitBtn.disabled =
            false;

    } catch (error) {

        question.textContent =
            "Unable to generate question.";

        showApiError(
            error.message
        );
    }
}


// =====================================================
// 8. SUBMIT ANSWER
// =====================================================

submitBtn.addEventListener(
    "click",
    async function () {

        const userAnswer =
            answer.value.trim();


        // Empty answer
        if (!userAnswer) {

            alert(
                "Please enter your answer first."
            );

            return;
        }


        submitBtn.disabled =
            true;

        nextBtn.disabled =
            true;


        feedback.classList.remove(
            "hidden"
        );


        feedback.classList.remove(
            "correct",
            "wrong"
        );


        feedbackTitle.textContent =
            "🤖 AI is evaluating your answer...";


        feedbackText.textContent =
            "Please wait...";


        explanation.textContent =
            "";


        questionScore.textContent =
            "Evaluating...";


        // =================================================
        // EVALUATION PROMPT
        // =================================================

        const prompt = `

You are evaluating a frontend developer interview answer.

Technology:
${topic.value}

Difficulty:
${difficulty.value}

Interview Question:
${currentQuestion}

Candidate Answer:
${userAnswer}

Evaluate the answer fairly for a fresher.

Return ONLY valid JSON.

Use exactly this format:

{
    "correct": true,
    "score": 8,
    "feedback": "Short feedback about the candidate answer.",
    "explanation": "Explain the correct concept and what the candidate should improve."
}

Rules:

- score must be a number from 0 to 10.
- correct must be true or false.
- If the answer is mostly correct, use true.
- If the answer is wrong, irrelevant, or does not answer the question, use false.
- Give beginner-friendly feedback.
- Do not use markdown.
- Do not add anything outside the JSON.

`;


        try {

            const result =
                await callAI(prompt);


            // =================================================
            // CLEAN AI RESPONSE
            // =================================================

            let cleanedResult =
                result.trim();


            // Remove markdown JSON blocks
            cleanedResult =
                cleanedResult
                    .replace(
                        /```json/gi,
                        ""
                    )
                    .replace(
                        /```/g,
                        ""
                    )
                    .trim();


            // Find JSON if AI adds extra text
            const firstBrace =
                cleanedResult.indexOf("{");

            const lastBrace =
                cleanedResult.lastIndexOf("}");


            if (
                firstBrace !== -1 &&
                lastBrace !== -1
            ) {

                cleanedResult =
                    cleanedResult.substring(
                        firstBrace,
                        lastBrace + 1
                    );
            }


            // Convert JSON
            const evaluation =
                JSON.parse(
                    cleanedResult
                );


            // =================================================
            // SCORE
            // =================================================

            let score =
                Number(
                    evaluation.score
                );


            if (
                Number.isNaN(score)
            ) {

                score = 0;
            }


            // Keep score between 0 and 10
            score =
                Math.max(
                    0,
                    Math.min(
                        10,
                        score
                    )
                );


            // Add total score
            totalScore += score;

            questionsCompleted++;


            // =================================================
            // DISPLAY SCORE
            // =================================================

            questionScore.textContent =
                `${score}/10`;


            scoreElement.textContent =
                `Score: ${totalScore}`;


            // =================================================
            // DISPLAY FEEDBACK
            // =================================================

            feedbackText.textContent =
                evaluation.feedback ||
                "No feedback provided.";


            explanation.textContent =
                evaluation.explanation ||
                "No explanation provided.";


            // =================================================
            // CORRECT / WRONG UI
            // =================================================

            if (
                evaluation.correct === true
            ) {

                feedback.classList.add(
                    "correct"
                );


                feedbackTitle.textContent =
                    "Correct Answer ✅";

            } else {

                feedback.classList.add(
                    "wrong"
                );


                feedbackTitle.textContent =
                    "Needs Improvement ❌";
            }


            // Enable next button
            nextBtn.disabled =
                false;


        } catch (error) {

            console.error(
                "Evaluation Error:",
                error
            );


            feedback.classList.add(
                "wrong"
            );


            feedbackTitle.textContent =
                "Evaluation Error ❌";


            feedbackText.textContent =
                error.message;


            questionScore.textContent =
                "0/10";
        }

    }
);


// =====================================================
// 9. NEXT QUESTION
// =====================================================

nextBtn.addEventListener(
    "click",
    async function () {

        // Check if interview finished
        if (
            questionsCompleted >=
            TOTAL_QUESTIONS
        ) {

            showFinalResult();

            return;
        }


        // Next question
        currentQuestionNumber++;


        await generateQuestion();

    }
);


// =====================================================
// 10. FINAL RESULT
// =====================================================

function showFinalResult() {

    // Hide interview
    interviewCard.classList.add(
        "hidden"
    );


    // Show result
    resultCard.classList.remove(
        "hidden"
    );


    // Display total score
    finalScore.textContent =
        totalScore;


    // Calculate percentage
    const percentage =
        (
            totalScore /
            (TOTAL_QUESTIONS * 10)
        ) * 100;


    // Final message
    if (
        percentage >= 80
    ) {

        finalMessage.textContent =
            "Excellent performance! You are interview ready. 🚀";

    } else if (
        percentage >= 60
    ) {

        finalMessage.textContent =
            "Good performance! Keep practicing to improve further. 👍";

    } else {

        finalMessage.textContent =
            "Keep practicing your concepts and try again. 💪";
    }
}


// =====================================================
// 11. RESTART INTERVIEW
// =====================================================

restartBtn.addEventListener(
    "click",
    function () {

        currentQuestionNumber = 1;

        totalScore = 0;

        questionsCompleted = 0;

        currentQuestion = "";


        scoreElement.textContent =
            "Score: 0";


        finalScore.textContent =
            "0";


        // Hide result
        resultCard.classList.add(
            "hidden"
        );


        // Show setup
        setupCard.classList.remove(
            "hidden"
        );

    }
);


// =====================================================
// 12. API ERROR DISPLAY
// =====================================================

function showApiError(message) {

    feedback.classList.remove(
        "hidden"
    );


    feedback.classList.remove(
        "correct"
    );


    feedback.classList.add(
        "wrong"
    );


    feedbackTitle.textContent =
        "API Error ❌";


    feedbackText.textContent =
        message;


    explanation.textContent =
        "Please check your Groq API key and API settings.";


    questionScore.textContent =
        "0/10";


    nextBtn.disabled =
        true;
}


// =====================================================
// 13. INITIAL STATE
// =====================================================

submitBtn.disabled = true;

nextBtn.disabled = true;

console.log(
    "AI Interview Agent loaded successfully."
);