const startBtn = document.getElementById("startBtn");
const userText = document.getElementById("userText");
const aiResponse = document.getElementById("aiResponse");

const speechLanguage = document.getElementById("speechLanguage");
const responseLanguage = document.getElementById("language");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    // Start listening when the button is clicked
    startBtn.addEventListener("click", function () {

        recognition.lang = speechLanguage.value;

        userText.textContent = "Listening...";
        aiResponse.textContent = "";

        recognition.start();

    });

    // When speech is recognized
    recognition.onresult = async function (event) {

        const speech = event.results[0][0].transcript;

        userText.textContent = "You said: " + speech;

        aiResponse.textContent = "AI is thinking...";

        try {

            // Send the question to our Java backend
            const response = await fetch("/ask", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userText: speech,

                    responseLanguage:
                        responseLanguage.options[
                            responseLanguage.selectedIndex
                        ].text

                })

            });

            if (!response.ok) {
                throw new Error("Server error: " + response.status);
            }

            const data = await response.json();

            // Display Gemini's answer
            aiResponse.textContent = data.answer;

            // Speak the answer aloud
            const speechOutput = new SpeechSynthesisUtterance(data.answer);

            const selectedLanguage =
                responseLanguage.value.toLowerCase();

            const voiceLanguages = {
                english: "en-IN",
                en: "en-IN",
                kannada: "kn-IN",
                kn: "kn-IN",
                hindi: "hi-IN",
                hi: "hi-IN",
                telugu: "te-IN",
                te: "te-IN",
                tamil: "ta-IN",
                ta: "ta-IN"
            };

            speechOutput.lang =
                voiceLanguages[selectedLanguage] || "en-IN";

            window.speechSynthesis.speak(speechOutput);

        } catch (error) {

            aiResponse.textContent =
                "Sorry, something went wrong. Please try again.";

            console.error(error);

        }

    };

    recognition.onerror = function (event) {

        userText.textContent = "Error: " + event.error;

    };

} else {

    userText.textContent =
        "Speech recognition is not supported. Please use Google Chrome.";

}