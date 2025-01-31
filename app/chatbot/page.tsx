"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const Chatbot = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: "Hello! How can I assist you with Campus Dabba today?" }
  ]);
  const [input, setInput] = useState("");

  // Hardcoded menus for all states
  const menus = {
    maharashtra: `
      Monday – Poha, Chapati, Pithla, Bhakri, Koshimbir
      Tuesday – Upma, Varan Bhaat, Batata Bhaji, Thecha
      Wednesday – Thalipeeth, Bharli Vangi, Masoor Amti
      Thursday – Misal Pav, Zunka Bhakri, Kanda Bhaji
      Friday – Sabudana Khichdi, Puran Poli, Matki Usal
      Saturday – Kanda Poha, Aluchi Patal Bhaji, Solkadhi
      Sunday – Pav Bhaji, Ukdiche Modak, Masala Bhaat
    `,
    delhi: `
      Monday – Aloo Paratha, Rajma Chawal, Boondi Raita
      Tuesday – Chole Bhature, Paneer Butter Masala, Jeera Rice
      Wednesday – Bedmi Puri, Aloo Subzi, Kachumber Salad
      Thursday – Chana Kulcha, Bhindi Fry, Dal Tadka
      Friday – Methi Thepla, Aloo Gobhi, Masala Chaach
      Saturday – Soya Chaap, Baingan Bharta, Roti
      Sunday – Pindi Chole, Amritsari Kulcha, Kheer
    `,
    karnataka: `
      Monday – Thatte Idli, Bisi Bele Bath, Kosambari
      Tuesday – Neer Dosa, Sagu, Rasam Rice
      Wednesday – Ragi Mudde, Bassaru, Mangalore Buns
      Thursday – Khara Bath, Mysore Masala Dosa, Coconut Chutney
      Friday – Set Dosa, Vegetable Kurma, Curd Rice
      Saturday – Maddur Vada, Tomato Bath, Puliyogare
      Sunday – Rava Idli, Kharabath, Jolad Roti
    `,
    tamilNadu: `
      Monday – Pongal, Sambar, Coconut Chutney
      Tuesday – Idiyappam, Kurma, Rasam Rice
      Wednesday – Kothu Parotta, Kootu, Mor Kuzhambu
      Thursday – Appam, Kadala Curry, Lemon Rice
      Friday – Rava Kesari, Kara Kuzhambu, Dosa
      Saturday – Medu Vada, Keerai Masiyal, Curd Rice
      Sunday – Mini Tiffin (Idli, Dosa, Pongal, Vada)
    `,
    gujarat: `
      Monday – Thepla, Sev Tameta, Khichdi Kadhi
      Tuesday – Dhokla, Undhiyu, Bhakhri
      Wednesday – Handvo, Ringna Bateta Nu Shaak, Dal Dhokli
      Thursday – Khandvi, Patra, Rotla, Chaas
      Friday – Methi Thepla, Gujarati Kadhi, Suki Bhaji
      Saturday – Puran Poli, Kathiawadi Dal, Bajra Roti
      Sunday – Fafda Jalebi, Aloo Shaak, Khakhra
    `,
    telangana: `
      Monday – Ragi Sangati, Natukodi Pulusu, Pappu
      Tuesday – Pesarattu, Tomato Pappu, Chapati
      Wednesday – Sakinalu, Bagara Baingan, Jonna Roti
      Thursday – Punugulu, Majjiga Pulusu, Lemon Rice
      Friday – Sarva Pindi, Miryala Rasam, Curd Rice
      Saturday – Kodi Vepudu, Mudda Pappu, Roti
      Sunday – Hyderabadi Dum Biryani, Shahi Tukda
    `,
    westBengal: `
      Monday – Luchi, Aloo Dum, Cholar Dal
      Tuesday – Shukto, Dal, Bhaja, Rice
      Wednesday – Begun Bharta, Bhapa Ilish, Moong Dal
      Thursday – Radha Ballavi, Chana Dal, Alu Phoolkopir Tarkari
      Friday – Chingri Malai Curry, Basanti Pulao
      Saturday – Macher Jhol, Alu Posto, Dal
      Sunday – Kosha Mangsho, Luchi, Mishti Doi
    `,
    up: `
      Monday – Aloo Poori, Chana Dal, Boondi Raita
      Tuesday – Bedmi Poori, Mathura Ke Dubki Wale Aloo
      Wednesday – Dal Baati Churma, Gatte Ki Sabzi
      Thursday – Sattu Paratha, Baingan Bharta, Dahi
      Friday – Tehri, Baigan Ka Bharta, Papad
      Saturday – Paneer Makhani, Roti, Kachumber Salad
      Sunday – Nihari, Sheermal, Kheer
    `,
    rajasthan: `
      Monday – Bajra Roti, Ker Sangri, Lahsun Chutney
      Tuesday – Dal Baati Churma, Gatte Ki Sabzi
      Wednesday – Methi Bajra Poori, Panchmel Dal
      Thursday – Missi Roti, Pitod Ki Sabzi
      Friday – Khoba Roti, Papad Mangodi, Chhach
      Saturday – Moong Dal Halwa, Rajma Chawal
      Sunday – Laal Maas, Bajra Khichdi
    `,
    kerala: `
      Monday – Puttu, Kadala Curry, Pazham
      Tuesday – Idiyappam, Egg Roast, Sambar
      Wednesday – Appam, Vegetable Stew, Pappadam
      Thursday – Nadan Kozhi Curry, Kappa, Rasam
      Friday – Sadya (Rice, Avial, Thoran, Pachadi, Pappadam)
      Saturday – Malabar Parotta, Beef Fry, Sambharam
      Sunday – Kerala Prawn Curry, Matta Rice, Payasam
    `
  };

  // Queries for each state
  const queries = {
    maharashtra: [
      "What is the Maharashtra state cook's menu for this week?",
      "Can you show me Maharashtra's menu for this week?",
      "Maharashtra menu this week?",
      "What’s cooking in Maharashtra this week?",
      "Maharashtra weekly menu?"
    ],
    delhi: [
      "What is the Delhi state cook's menu for this week?",
      "Can you show me Delhi's menu for this week?",
      "Delhi menu this week?",
      "What’s cooking in Delhi this week?",
      "Delhi weekly menu?"
    ],
    karnataka: [
      "What is the Karnataka state cook's menu for this week?",
      "Can you show me Karnataka's menu for this week?",
      "Karnataka menu this week?",
      "What’s cooking in Karnataka this week?",
      "Karnataka weekly menu?"
    ],
    tamilNadu: [
      "What is the Tamil Nadu state cook's menu for this week?",
      "Can you show me Tamil Nadu's menu for this week?",
      "Tamil Nadu menu this week?",
      "What’s cooking in Tamil Nadu this week?",
      "Tamil Nadu weekly menu?"
    ],
    gujarat: [
      "What is the Gujarat state cook's menu for this week?",
      "Can you show me Gujarat's menu for this week?",
      "Gujarat menu this week?",
      "What’s cooking in Gujarat this week?",
      "Gujarat weekly menu?"
    ],
    telangana: [
      "What is the Telangana state cook's menu for this week?",
      "Can you show me Telangana's menu for this week?",
      "Telangana menu this week?",
      "What’s cooking in Telangana this week?",
      "Telangana weekly menu?"
    ],
    westBengal: [
      "What is the West Bengal state cook's menu for this week?",
      "Can you show me West Bengal's menu for this week?",
      "West Bengal menu this week?",
      "What’s cooking in West Bengal this week?",
      "West Bengal weekly menu?"
    ],
    up: [
      "What is the Uttar Pradesh state cook's menu for this week?",
      "Can you show me Uttar Pradesh's menu for this week?",
      "Uttar Pradesh menu this week?",
      "What’s cooking in Uttar Pradesh this week?",
      "Uttar Pradesh weekly menu?"
    ],
    rajasthan: [
      "What is the Rajasthan state cook's menu for this week?",
      "Can you show me Rajasthan's menu for this week?",
      "Rajasthan menu this week?",
      "What’s cooking in Rajasthan this week?",
      "Rajasthan weekly menu?"
    ],
    kerala: [
      "What is the Kerala state cook's menu for this week?",
      "Can you show me Kerala's menu for this week?",
      "Kerala menu this week?",
      "What’s cooking in Kerala this week?",
      "Kerala weekly menu?"
    ]
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Find the appropriate menu based on the user input
    const state = Object.keys(menus).find((state) => input.toLowerCase().includes(state));

    let botResponse = "I'm sorry, I don't have the menu for that state.";

    if (state) {
      botResponse = menus[state];
    }

    setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg h-[80vh] flex flex-col shadow-xl rounded-2xl bg-black/70 backdrop-blur-lg border border-gray-700 overflow-hidden"
      >
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`max-w-[75%] p-3 rounded-xl shadow-md text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-800 text-white"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </CardContent>
        <div className="p-4 flex items-center space-x-2 border-t bg-black/80 backdrop-blur-lg">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button onClick={sendMessage} className="rounded-full p-2 bg-blue-600 hover:bg-blue-700">
              <Send size={20} className="text-white" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
