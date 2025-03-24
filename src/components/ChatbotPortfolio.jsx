import React, { useState, useEffect, useRef } from "react";
import "../css/ChatbotPortfolio.css";
import resumeJsonData from "../data/resume_data.json";

const ChatbotPortfolio = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Welcome to my Chatbot Portfolio!\n I can help you explore my projects, skills, experience, and more. Just ask me anything!" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        setResumeData(resumeJsonData);
    }, []);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (selectedItem = null) => {
        if (!input.trim() && !selectedItem) return;

        const userMessage = { sender: "user", text: selectedItem || input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");

        setIsTyping(true);
        setIsLoading(true);

        setTimeout(() => {
            generateResponse(selectedItem || input);
        }, 1000);
    };

    const matchesIntroQuery = (input) => {
        const phrases = ["about yourself", "introduce", "who are you", "what do you do", "tell me about you"];
        return phrases.some((phrase) => input.includes(phrase));
    };

    const generateResponse = (input) => {
        if (!resumeData) return;

        const lowerInput = String(input).toLowerCase();
        let responseText = "";

        if (lowerInput.includes("experience")) {
            setIsTyping(false);
            setIsLoading(false);
            setMessages((prevMessages) => [...prevMessages, {
                sender: "bot",
                text: "Which company's experience are you looking for?",
                options: resumeData.experience.map(exp => `${exp.company} (${exp.duration})`)
            }]);
            return;
        } else if (lowerInput.includes("project")) {
            setIsTyping(false);
            setIsLoading(false);
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Which project details would you like to see?", options: resumeData.projects.map(proj => proj.title) }]);
            return;
        } else if (lowerInput.includes("skill")) {
            responseText = `
              🛠️ <b>Skills Overview:</b><br>
              🚀 <b>Languages:</b> ${resumeData.skills.Languages.join(", ")}<br>
              📚 <b>Frameworks & Libraries:</b> ${resumeData.skills["Frameworks & Libraries"].join(", ")}<br>
              📊 <b>BI & Monitoring:</b> ${resumeData.skills["BI & Monitoring"].join(", ")}<br>
              🗄️ <b>Databases:</b> ${resumeData.skills.Databases.join(", ")}<br>
              ☁️ <b>Cloud:</b> ${resumeData.skills.Cloud.join(", ")}<br>
              🛠️ <b>Tools & IDEs:</b> ${resumeData.skills["Tools & IDEs"].join(", ")}
            `;
        } else if (lowerInput.includes("resume")) {
            responseText = `📄 You can download my resume here: <a href="${resumeData.resume.link}" target="_blank">Click to View Resume</a>`;
        } else if (lowerInput.includes("contact")) {
            responseText = `📧 Email: ${resumeData.contact.email}\n📞 Phone: ${resumeData.contact.phone}\n🔗 LinkedIn: ${resumeData.contact.linkedin}`;
        } else if (lowerInput.includes("education")) {
            responseText = resumeData.education.map(edu => `🎓 ${edu.degree} from ${edu.institution} (${edu.year})`).join("\n\n");
        } else if (lowerInput.includes("certification")) {
            responseText = resumeData.certifications.map(cert =>
                `📜 <b>${cert.title}</b> (Issued: ${cert.issued})<br>🔗 <a href="${cert.badge_link}" target="_blank">View Badge</a>`
            ).join("<br><br>");
        } else if (matchesIntroQuery(lowerInput)) {
            responseText = `👋 Hi, I'm <b>Het Patel</b> — a passionate Software Engineer with over 4 years of experience, currently working at Tata Consultancy Services (TCS) for the client USAA.\n
                I specialize in full-stack development using <b>Java, Spring Boot, ReactJS, SQL</b>, and cloud technologies like <b>AWS</b>.\n
                I'm skilled in building scalable REST APIs, secure UI integrations, and modern web applications with a focus on performance and user experience.`;
        } else {
            responseText = "I'm not sure about that. Try asking about my skills, projects, experience, or contact details!";
        }

        setIsTyping(false);
        typeOutResponse(responseText);
    };

    const handleSelection = (selectedItem) => {
        if (resumeData) {
            const selectedExperience = resumeData.experience.find(exp => `${exp.company} (${exp.duration})` === selectedItem);
            if (selectedExperience) {
                setMessages((prevMessages) => [...prevMessages, { sender: "user", text: selectedItem }]);
                setIsLoading(true);
                setTimeout(() => {
                    typeOutResponse(`🏢 <b>${selectedExperience.title}</b> at ${selectedExperience.company}<br>📅 <b>Duration:</b> ${selectedExperience.duration}<br><br>${selectedExperience.description}`);
                }, 1000);
            } else if (resumeData.projects.some(proj => proj.title === selectedItem)) {
                const selectedProject = resumeData.projects.find(proj => proj.title === selectedItem);
                if (selectedProject) {
                    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: selectedItem }]);
                    setIsLoading(true);
                    setTimeout(() => {
                        typeOutResponse(`📌 ${selectedProject.title}\n\n💻 Technologies Used: ${selectedProject.technologies.join(", ")}\n\n${selectedProject.description}`);
                    }, 1000);
                }
            }
        }
    };

    const typeOutResponse = (text) => {
        let index = 0;
        let response = "";

        setIsTyping(true);

        const typingEffect = setInterval(() => {
            if (index < text.length) {
                response += text[index];
                setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.sender === "bot") {
                        return [...prevMessages.slice(0, -1), { sender: "bot", text: response }];
                    } else {
                        return [...prevMessages, { sender: "bot", text: response }];
                    }
                });
                index++;
            } else {
                clearInterval(typingEffect);
                setIsTyping(false);
                setIsLoading(false);
            }
        }, 30);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-wrapper">
            <h1 className="chat-title">HET PATEL</h1>
            <div className="chat-container">
                <div className="chat-box" ref={chatBoxRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
                            {/* {msg.sender === "bot" && <span>🤖 </span>} */}
                            <span dangerouslySetInnerHTML={{ __html: String(msg.text).replace(/\n/g, "<br />") }} />
                            {msg.options && (
                                <div className="options-container">
                                    {msg.options.map((option, idx) => (
                                        <button key={idx} className="option-button" onClick={() => handleSelection(option)}>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me about my projects, skills, experience, or certifications..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        className="send-button"
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="loader"></span> : "Send"}
                    </button>
                    {/* <button className={`stop-button ${isTyping ? "visible" : ""}`} onClick={() => setIsTyping(false)}>⛔</button> */}
                </div>
            </div>

        </div>
    );
};

export default ChatbotPortfolio;
