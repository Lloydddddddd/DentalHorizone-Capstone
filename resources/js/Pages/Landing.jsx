import React, { useState, useEffect } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import "../../css/Landing.css";
import { Link, usePage, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import DHLogo from "@/Components/DHLogo";
import WhyChooseUs from "@/Components/WhyChooseUs";

const Landing = () => {
  const { services, flash } = usePage().props;

  const [showReceipt, setShowReceipt] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    patient_name: "",
    age: "",
    telephone: "",
    email: "",
    occupation: "",
    address: "",
    date_of_visit: "",
    services: [],
    complaint: "",
    note: "",
  });

  useEffect(() => {
    if (errors.date_of_visit) {
      document.getElementById("date_of_visit")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("appointments.publicStore"), {
      onSuccess: () => {
        setSubmittedData(data);   // keep a copy of what was submitted
        setShowReceipt(true);     // show the receipt modal
        reset();
        setData("services", []);
      },
    });
  };

  const cardColors = [
    "from-blue-50 to-blue-100 border-blue-200",
    "from-green-50 to-green-100 border-green-200",
    "from-pink-50 to-pink-100 border-pink-200",
    "from-orange-50 to-orange-100 border-orange-200",
    "from-purple-50 to-purple-100 border-purple-200",
    "from-teal-50 to-teal-100 border-teal-200",
    "from-red-50 to-red-100 border-red-200",
  ];

  return (
    <GuestLayout>
      <div className="landing-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">
            <DHLogo size={50} />
          </div>
          <ul className="nav-links flex items-center gap-6">
            
          </ul>
          <div className="nav-actions">
              {usePage().props.auth?.user ? (
                <Link
                  href={route("logout")}
                  method="post"
                  as="button"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </Link>
              ) : (
                <Link
                  href={route("login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              )}
          </div>
        </nav>

        {/* Hero */}
        <header className="hero">
          <div className="hero-text">
            <h1>Your Smile, Our Priority</h1>
            <p>
              Welcome to Dental Horizon, where your comfort comes first.
              Our caring team and modern approach make dental visits simple, safe, and effective — helping you smile with confidence every day.
            </p>
            <div className="hero-buttons flex gap-4">
              <button
                onClick={() =>
                  document.getElementById("appointment-section").scrollIntoView({ behavior: "smooth" })
                }
                className="btn primary"
              >
                Make Appointment
              </button>

              {usePage().props.auth?.user && (
                <Link
                  href={route("dashboard")}
                  className="btn primary"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </header>

        <WhyChooseUs />

        {/* Services */}
        <section id="services-section" className="services px-8 py-12">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-4">Our Services</h2>
          <div className="w-16 h-1 bg-accent-orange mx-auto mb-6"></div>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            From routine checkups to advanced treatments, we provide complete care for your smile.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {services.map((service, index) => {
              const bgColor = cardColors[index % cardColors.length];
              return (
                <div
                  key={service.id}
                  className={`rounded-lg shadow-md p-6 text-gray-800 border bg-gradient-to-r ${bgColor}`}
                >
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  <p className="text-gray-600 mt-2">{service.description}</p>
                  <p className="text-blue-700 font-bold mt-3">{service.price}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Appointment Form */}
        <section id="appointment-section" className="appointment px-8 py-12 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

          {/* ✅ Success alert */}
          {flash?.success && (
            <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
              {flash.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <TextInput placeholder="Full Name" value={data.patient_name} onChange={(e) => setData("patient_name", e.target.value)} required />
            <TextInput type="number" placeholder="Age" value={data.age || ""} onChange={(e) => setData("age", e.target.value)} required />
            <TextInput placeholder="Contact Number" value={data.telephone || ""} onChange={(e) => setData("telephone", e.target.value)} required />
            <TextInput placeholder="Email Address" type="email" value={data.email || ""} onChange={(e) => setData("email", e.target.value)} required />
            <TextInput placeholder="Occupation" value={data.occupation || ""} onChange={(e) => setData("occupation", e.target.value)} />
            <TextInput placeholder="Address" value={data.address || ""} onChange={(e) => setData("address", e.target.value)} />

            {/* Date of Visit (datetime-local) */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Date of Visit</label>
              <input
                id="date_of_visit"
                type="datetime-local"
                value={data.date_of_visit}
                onChange={(e) => setData("date_of_visit", e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
              {errors.date_of_visit && (
                <div className="text-red-600 text-sm mt-1">{errors.date_of_visit}</div>
              )}
            </div>

            {/* Services checkboxes */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Select Services</label>
              <div className="grid grid-cols-2 gap-3">
                {services.map((s) => (
                  <label key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={s.id}
                      checked={data.services.includes(String(s.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setData("services", [...data.services, String(s.id)]);
                        } else {
                          setData("services", data.services.filter((id) => id !== String(s.id)));
                        }
                      }}
                      className="accent-orange-500"
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <textarea placeholder="Complaint (optional)" value={data.complaint} onChange={(e) => setData("complaint", e.target.value)} className="col-span-2 border rounded p-2" />
            <textarea placeholder="Note (optional)" value={data.note} onChange={(e) => setData("note", e.target.value)} className="col-span-2 border rounded p-2" />

            <div className="col-span-2 mt-6">
              <PrimaryButton type="submit" disabled={processing}>
                {processing ? "Booking..." : "Submit Appointment"}
              </PrimaryButton>
            </div>
          </form>
        </section>

                  {/* Receipt Modal */}
          {showReceipt && submittedData && (
            <div className="bg-gray fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-xl p-6 max-w-lg w-full border border-orange-400">
                {/* Header with border accent */}
                <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-2 border-b-2 border-orange-500">
                  Appointment Receipt
                </h2>

                <p className="text-sm text-gray-700 mb-6 font-medium">
                  📌 This receipt is issued once only. Please screenshot now as proof of your appointment.

                </p>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-900">
                  <p><strong>Name:</strong> {submittedData.patient_name}</p>
                  <p><strong>Age:</strong> {submittedData.age}</p>
                  <p><strong>Contact:</strong> {submittedData.telephone}</p>
                  <p><strong>Email:</strong> {submittedData.email}</p>
                  <p><strong>Occupation:</strong> {submittedData.occupation}</p>
                  <p><strong>Address:</strong> {submittedData.address}</p>
                  <p><strong>Date of Visit:</strong> {submittedData.date_of_visit}</p>
                  <p>
                    <strong>Services:</strong>{" "}
                    {services
                      .filter(s => submittedData.services.includes(String(s.id)))
                      .map(s => s.name)
                      .join(", ")}
                  </p>
                  {submittedData.complaint && (
                    <p><strong>Complaint:</strong> {submittedData.complaint}</p>
                  )}
                  {submittedData.note && (
                    <p><strong>Note:</strong> {submittedData.note}</p>
                  )}
                </div>

                {/* Footer with Close button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-900 transition">
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}






                      </div>
                    </GuestLayout>
                  );
                };

export default Landing;
