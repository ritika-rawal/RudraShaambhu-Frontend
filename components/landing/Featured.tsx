const items = [
  { name: "5 Mukhi Rudraksha", price: "₹1,200" },
  { name: "7 Mukhi Rudraksha", price: "₹3,500" },
  { name: "1 Mukhi Rudraksha", price: "₹45,000" },
];

export default function Featured() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-orange-700">
        Featured Rudraksha
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 text-center hover:shadow-md"
          >
            <h3 className="text-xl font-medium">{item.name}</h3>
            <p className="mt-2 text-orange-600 font-semibold">
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
