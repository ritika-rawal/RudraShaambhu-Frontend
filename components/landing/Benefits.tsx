const benefits = [
  "Reduces stress & anxiety",
  "Improves focus & clarity",
  "Supports meditation",
  "Positive energy & protection",
];

export default function Benefits() {
  return (
    <section className="py-20 bg-gray-50 px-6">
      <h2 className="text-3xl font-semibold text-center text-orange-700">
        Benefits
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-sm text-center"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
