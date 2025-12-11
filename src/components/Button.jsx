export default function Button({ children, ...props }) {
  return (
    <button
      className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-medium"
      {...props}
    >
      {children}
    </button>
  );
}
