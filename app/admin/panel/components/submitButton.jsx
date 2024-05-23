export default function SubmitButton({ pending }) {
  return (
    <div>
      <button
        disabled={pending}
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-800"
      >
        {pending ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
}
