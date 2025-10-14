import LoginForm from "./components/loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/login_bg.jpg"
        alt="Login Background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Login Form Section */}
      <div
        className="
          absolute top-0 right-48
          flex items-center justify-center
          h-full
          px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24
        "
      >
        <LoginForm />
      </div>
    </div>
  );
}
