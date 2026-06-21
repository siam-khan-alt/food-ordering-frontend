import { Star, Quote } from "lucide-react";
import SectionHeader from "../common/SectionHeader";

export default function Testimonials() {
  const reviews = [
    { name: "Tanvir Ahmed", role: "Regular Customer", text: "BiteBox delivers the fastest and tastiest food in town. The pizza always arrives hot!", rating: 5 },
    { name: "Nusrat Jahan", role: "Food Blogger", text: "Their burger selection is unmatched. Fresh ingredients and quick delivery every single time.", rating: 5 },
    { name: "Rafiq Islam", role: "Office Worker", text: "Ordering lunch has never been easier. The app is smooth and payment is super secure.", rating: 4 }
  ];

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16 relative">
      <div className="absolute top-[10%] right-[15%] w-[280px] h-[280px] bg-brand/8 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <SectionHeader 
      tag="Customer Love"
      titleNormal="What Our"
      titleItalic="Foodies"
      titleEnd="Say"
      align="center"
    />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div
            key={review.name}
            className={`bg-card-bg border border-card-border rounded-2xl p-6 relative ${
              idx === 1 ? "md:-translate-y-4 shadow-xl border-brand/20" : ""
            }`}
          >
            <Quote className="w-8 h-8 text-brand/20 absolute top-4 right-4" />

            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-card-border"}`}
                />
              ))}
            </div>

            <p className="text-sm text-muted leading-relaxed mb-5">"{review.text}"</p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-black text-brand text-sm">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-text-main text-sm">{review.name}</p>
                <p className="text-xs text-muted">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}