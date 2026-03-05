import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

// Knowledge base for St. Peter's Engineering College
const KNOWLEDGE_BASE = [
    {
        keywords: ['cour', 'program', 'degree', 'department', 'study'],
        answer: "St. Peter's Engineering College offers B.E/B.Tech in CSE, IT, ECE, EEE, Mech, Civil, and Biomedical. We also offer M.E, MBA, and MCA programs."
    },
    {
        keywords: ['fee', 'cost', 'pay', 'tuition'],
        answer: "The tuition fees vary by department. Generally, it's around ₹50,000 - ₹85,000 per year for merit seats. Hostel fees are separate (~₹70,000/year). Please contact the admissions office for the exact breakdown."
    },
    {
        keywords: ['locat', 'address', 'where', 'place', 'avadi'],
        answer: "We are located at: College Road, Avadi, Chennai, Tamil Nadu 600054. It is approximately 3km from Annanur Railway Station."
    },
    {
        keywords: ['admiss', 'join', 'apply', 'seat', 'cutoff'],
        answer: "Admissions are open! You can download the application form from our website or visit the campus in person. We accept TNEA counseling and management quota."
    },
    {
        keywords: ['bus', 'transport', 'route', 'travel'],
        answer: "We have a fleet of 50+ buses covering all major routes in Chennai, including Tambaram, Koyambedu, Thiruvallur, and Redhills. You can track them live in this app!"
    },
    {
        keywords: ['place', 'job', 'recruit', 'salary', 'company'],
        answer: "Our placement cell is very active. Top recruiters include TCS, Infosys, Wipro, HCL, and Amazon. The average package is around 4.5 LPA."
    },
    {
        keywords: ['contact', 'phone', 'email', 'reach'],
        answer: "You can reach us at 044-26558080 or email info@stpeters.edu."
    },
    {
        keywords: ['hello', 'hi', 'hey', 'start'],
        answer: "Hello! I am the St. Peter's College virtual assistant. Ask me anything about our courses, fees, admissions, or transport!"
    }
];

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to St. Peter's Engineering College! How can I help you regarding our campus today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Bot Logic
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let botResponse = "I'm sorry, I can only answer questions related to St. Peter's Engineering College, Avadi. Please ask about courses, admissions, fees, or our bus routes.";

            // Check keywords
            const match = KNOWLEDGE_BASE.find(item =>
                item.keywords.some(k => lowerInput.includes(k))
            );

            if (match) {
                botResponse = match.answer;
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            }]);
        }, 600);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 border border-slate-200 overflow-hidden flex flex-col h-[500px]"
                        >
                            {/* Header */}
                            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">St. Peter's Assistant</h3>
                                        <p className="text-xs text-indigo-200">Online | Reply instantly</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1 rounded-full transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask about admissions, bus..."
                                    className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
                                    disabled={!inputValue.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                {!isOpen && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center group relative"
                    >
                        <MessageSquare size={28} />
                        <span className="absolute right-0 top-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                    </motion.button>
                )}
            </div>
        </>
    );
};

export default ChatBot;
