

export default function InformBox({stageClear}: {stageClear: () => void}) {

    function handleSumbit() {
        stageClear();
    }

    return <div className="absolute inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-fade-in">
      <h2 className="text-2xl font-semibold text-red-600">⏰ Time's Up!</h2>
      <p className="mt-2 text-gray-700">The countdown has ended.</p>
      <button
        onClick={handleSumbit}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
      >
        Close
      </button>
    </div>
  </div>
}