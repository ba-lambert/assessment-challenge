export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl mt-2">Page not found</p>
      <a href="/" className="text-blue-500 hover:underline mt-4">
        Go back home
      </a>
    </div>
  );
} 