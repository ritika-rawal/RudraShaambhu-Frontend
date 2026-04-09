const DEFAULT_WHATSAPP_NUMBER = "+919643744000";
const DEFAULT_WHATSAPP_MESSAGE = "Hi, I want to know more about Rudraksha products.";

function normalizePhoneNumber(value: string) {
  const normalized = value.replace(/\D/g, "");
  return normalized.length > 0 ? normalized : DEFAULT_WHATSAPP_NUMBER;
}

export default function WhatsAppChatButton() {
  const ownerNumber = normalizePhoneNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "");
  const initialMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || DEFAULT_WHATSAPP_MESSAGE;
  const chatUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(initialMessage)}`;

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with owner on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-20 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#25D366]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.92.55 3.8 1.6 5.4L2 22l4.9-1.77a9.78 9.78 0 0 0 5.14 1.46h.01c5.43 0 9.84-4.41 9.84-9.84A9.83 9.83 0 0 0 12.04 2Zm5.74 13.9c-.24.66-1.43 1.26-1.98 1.35-.53.08-1.2.12-1.94-.12-.45-.14-1.02-.34-1.76-.66-3.1-1.34-5.12-4.46-5.28-4.66-.15-.2-1.27-1.69-1.27-3.23 0-1.54.81-2.3 1.1-2.62.3-.32.66-.4.88-.4h.63c.2 0 .47-.08.73.55.24.58.83 2.02.9 2.16.07.14.12.31.02.5-.1.2-.14.31-.3.48-.15.17-.32.38-.45.5-.15.15-.3.31-.13.62.17.31.75 1.23 1.6 1.98 1.1.98 2.03 1.28 2.32 1.43.29.15.46.13.63-.08.17-.2.73-.85.93-1.14.2-.29.39-.24.66-.14.27.1 1.68.79 1.96.94.28.14.47.21.54.33.07.11.07.67-.17 1.34Z" />
      </svg>
    </a>
  );
}