import React from "react";

const WhyChooseUs = () => {
  const features = [
    { title: "Expert Dentists", desc: "Our team is skilled, caring, and ready to help you smile with confidence." },
    { title: "Modern Technology", desc: "We use safe, updated tools to make every visit easier and more comfortable." },
    { title: "Affordable Pricing", desc: "Fair and clear prices so you know exactly what to expect." },
    { title: "Patient-Centered Care", desc: "We listen, we care, and we put your comfort first every step of the way." },
  ];

  return (
    <section className="px-8 py-28 bg-gradient-to-r from-neutral-100 to-white">
      <h2 className="text-3xl font-bold text-center text-primary-blue mb-4">
        Why Choose Us
        </h2>
        <div className="w-16 h-1 bg-accent-orange mx-auto mb-6"></div>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
        At Dental Horizon, we combine expertise, modern care, and compassion to make every visit stress‑free and effective.
        </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-10 h-full rounded-xl bg-white shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100">
            <h3 className="text-lg font-semibold text-primary-blue">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
