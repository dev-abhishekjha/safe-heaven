"use client";

import Image from "next/image";
import { useState } from "react";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#amenities", label: "Amenities" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-3 text-slate-900">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-sky-50 shadow-lg shadow-sky-200/50">
              <Image src="/logo.svg" alt="Safe Haven logo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Safe Haven</p>
            </div>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-sky-700">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href="#booking" className="hidden rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600 md:inline-flex">
              Book Now
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden"
            >
              <span className="h-0.5 w-6 bg-slate-900"></span>
              <span className="mt-1 h-0.5 w-6 bg-slate-900"></span>
              <span className="mt-1 h-0.5 w-6 bg-slate-900"></span>
            </button>
          </div>
        </div>
        {menuOpen ? (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <section id="home" className="relative overflow-hidden bg-white">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-orange-200/70 blur-3xl" />
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Welcome to Safe Haven Accomodations
            </span>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              A calm, secure stay for students and working professionals.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Comfortable single, double, and triple rooms with curated amenities, fast Wi-Fi, and easy booking support. Your next stay should feel like home.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#booking" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/60 transition hover:bg-orange-600">
                Book Your Stay
              </a>
              <a href="#amenities" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                View Amenities
              </a>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-slate-200 bg-sky-50/80 p-8 shadow-xl shadow-sky-200/50 md:max-w-md">
            <div className="mb-6 overflow-hidden rounded-[2rem] bg-white shadow-sm shadow-slate-200">
              <Image src="/home-card-illustration.svg" alt="Safe Haven booking card illustration" width={640} height={400} className="h-auto w-full" />
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Trusted stay image</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Warm rooms with friendly care</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Experience the home-like comfort we showcase in our guest spaces and welcome environment.
              </p>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
                <p className="font-semibold text-slate-900">Email</p>
                <p className="mt-2 text-slate-600">safehaven25482@gmail.com</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
                <p className="font-semibold text-slate-900">Phone</p>
                <p className="mt-2 text-slate-600">8273458926</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                About us
              </span>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Safe Haven is where comfort meets convenience.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
                We provide beautifully maintained accommodations with flexible stays, regular housekeeping, and secure facilities. Designed for students and professionals who want hassle-free living in a warm, welcoming environment.
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm shadow-slate-200">
              <Image src="/room-scene.svg" alt="Safe Haven room scene" width={720} height={520} className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section id="amenities" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Amenities
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Rooms for every stay.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Choose the room type that fits your needs: cosy single rooms, spacious double rooms, or budget-friendly triple rooms with shared warmth and care.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            <article className="transform-gpu rounded-3xl bg-sky-50 p-8 shadow-sm shadow-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 inline-flex rounded-3xl bg-sky-100 px-4 py-3 text-sky-700">Single Room</div>
              <h3 className="text-2xl font-semibold text-slate-900">Private and peaceful</h3>
              <p className="mt-4 text-slate-600">Ideal for a solo student or professional who wants a quiet private space with a comfy bed and study area.</p>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li>Single bed with storage</li>
                <li>Private wardrobe and desk</li>
                <li>Fast Wi-Fi and utilities included</li>
                <li>Weekly housekeeping</li>
              </ul>
            </article>

            <article className="transform-gpu rounded-3xl bg-sky-50 p-8 shadow-sm shadow-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 inline-flex rounded-3xl bg-orange-100 px-4 py-3 text-orange-700">Double Room</div>
              <h3 className="text-2xl font-semibold text-slate-900">Spacious and shared</h3>
              <p className="mt-4 text-slate-600">Perfect for friends or couples who want a roomy home base with extra comfort and privacy.</p>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li>Queen or two twin beds</li>
                <li>Large wardrobe and study zone</li>
                <li>Soft lighting and modern decor</li>
                <li>Inclusive cleaning and Wi-Fi</li>
              </ul>
            </article>

            <article className="transform-gpu rounded-3xl bg-sky-50 p-8 shadow-sm shadow-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 inline-flex rounded-3xl bg-sky-100 px-4 py-3 text-sky-700">Triple Room</div>
              <h3 className="text-2xl font-semibold text-slate-900">Friendly and affordable</h3>
              <p className="mt-4 text-slate-600">A warm, budget-friendly option for three guests with shared amenities and cosy community energy.</p>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li>Three comfortable beds</li>
                <li>Shared wardrobe and study nook</li>
                <li>All utilities included</li>
                <li>Great value for longer stays</li>
              </ul>
            </article>
          </div>

          <div className="mt-20 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm shadow-slate-200">
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Guest feedback</h2>
              <p className="mt-3 text-slate-600">Real experiences from guests who loved their stay at Safe Haven.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "The room was spotless, the staff were friendly, and I felt safe from day one.",
                  name: "Priya",
                  label: "Student",
                },
                {
                  quote: "Booking was simple and the location was great for my office commute.",
                  name: "Rahul",
                  label: "Professional",
                },
                {
                  quote: "Nice rooms, fast Wi-Fi, and the best support team when I needed it.",
                  name: "Aditi",
                  label: "Co-living guest",
                },
              ].map((item) => (
                <div key={item.name} className="transform-gpu rounded-3xl bg-sky-50 p-6 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <p className="text-4xl leading-none text-sky-600">“</p>
                  <p className="mt-4 text-slate-700">{item.quote}</p>
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="booking" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="transform-gpu rounded-[2rem] bg-sky-50 p-10 shadow-sm shadow-sky-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <p className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-orange-700">
                Booking
              </p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Reserve your room in minutes.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                Fill the booking request form and our team will contact you to confirm availability and details. Your booking request will be sent to safehaven25482@gmail.com.
              </p>
              <div className="mt-10 space-y-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</p>
                  <p className="mt-2 text-slate-700">safehaven25482@gmail.com</p>
                  <p className="text-slate-700">8273458926</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Location</p>
                  <p className="mt-2 text-slate-700">Premium accommodations across India’s major metro cities.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-50 p-8 shadow-sm shadow-slate-200">
              <form
                action="https://formsubmit.co/safehaven25482@gmail.com"
                method="POST"
                className="space-y-6"
              >
                <input type="hidden" name="_subject" value="Safe Haven Accommodation Booking Request" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="box" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Full name
                    <input name="name" required className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Email address
                    <input type="email" name="email" required className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                  </label>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number
                    <input name="phone" required className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Room type
                    <select name="room_type" required className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
                      <option value="Single Room">Single Room</option>
                      <option value="Double Room">Double Room</option>
                      <option value="Triple Room">Triple Room</option>
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred move-in date
                  <input type="date" name="move_in" className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Additional requests
                  <textarea name="message" rows={5} className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" placeholder="Let us know your preferences or questions."></textarea>
                </label>
                <button type="submit" className="w-full rounded-3xl bg-sky-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-sky-700">
                  Submit Booking Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr_1fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Safe Haven Accomodations</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Stay safe, stay supported.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Book a calm, convenient room with all essentials included and support that keeps every stay easy.
            </p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>Email: safehaven25482@gmail.com</p>
              <p>Phone: 8273458926</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick links</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <a href="#home" className="block hover:text-white">Home</a>
              <a href="#amenities" className="block hover:text-white">Amenities</a>
              <a href="#booking" className="block hover:text-white">Book Now</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Safe Haven Accomodations. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
