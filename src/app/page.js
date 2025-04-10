import Weather from "@/components/Weather";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white py-8 px-4">
      <div className="container mx-auto">
        <Weather />
      </div>
    </main>
  );
}
