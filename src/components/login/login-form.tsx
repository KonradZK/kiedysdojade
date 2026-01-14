import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      if (onSuccess) {
          onSuccess();
      }
    } catch (err: any) {
      setError("Nieprawidłowy email lub hasło");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="password"
            type="password"
            placeholder="Hasło"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj się"}
        </Button>
        <div className="text-center text-xs pt-2">
          Nie masz konta?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="underline hover:text-primary"
          >
            Zarejestruj się
          </button>
        </div>
      </form>
    </div>
  )
}
