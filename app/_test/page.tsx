import React from "react";

const TimelineCards = () => {
  const cards = [
    {
      quarter: "01",
      title: "Proposal",
      description: "Detailed outline of our service tailored for your needs.",
      color: "bg-orange-50",
      pinColor: "bg-orange-500",
      textColor: "text-orange-500",
      position: "left",
    },
    {
      quarter: "02",
      title: "Wireframe",
      description: "Ideation and wireframing to make sure UX flow is perfect.",
      color: "bg-blue-50",
      pinColor: "bg-blue-500",
      textColor: "text-blue-500",
      position: "right",
    },
    {
      quarter: "03",
      title: "Development",
      description: "Building the solution with latest technologies.",
      color: "bg-purple-50",
      pinColor: "bg-purple-500",
      textColor: "text-purple-500",
      position: "left",
    },
    {
      quarter: "04",
      title: "Launch",
      description: "Deploying and monitoring the final product.",
      color: "bg-green-50",
      pinColor: "bg-green-500",
      textColor: "text-green-500",
      position: "right",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 relative min-h-screen overflow-hidden">
      {/* SVG for zigzag line */}
      <svg
        className="absolute top-0 left-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 400 50 
             C 400 50, 600 50, 600 150
             C 600 250, 200 250, 200 350
             C 200 450, 600 450, 600 550
             C 600 650, 200 650, 200 750"
          stroke="#E5E7EB"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
        />
      </svg>

      {/* Cards Container */}
      <div className="relative z-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`flex justify-${
              card.position === "left" ? "start" : "end"
            } mb-24 relative`}
          >
            <div
              className={`w-80 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300 ${
                card.position === "right" ? "ml-auto" : ""
              }`}
            >
              {/* Pin */}
              <div
                className={`absolute -top-3 ${
                  card.position === "left" ? "right-6" : "left-6"
                } w-6 h-6 ${card.pinColor} rounded-full shadow-lg`}
              />

              {/* Content */}
              <div className={`${card.color} rounded-lg p-4`}>
                <div className={`${card.textColor} text-sm font-medium mb-1`}>
                  Q{card.quarter}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineCards;
