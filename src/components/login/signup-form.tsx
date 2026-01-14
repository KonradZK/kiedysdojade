import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}

export function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Hasła muszą być identyczne");
      return;
    }

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      if (onSuccess) {
          onSuccess();
      }
    } catch (err: any) {
        // Safe check for error message
        const msg = err?.message || "Rejestracja nie powiodła się";
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Input
            id="name"
            type="text"
            placeholder="Imię i Nazwisko"
            autoComplete="off"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <p className="text-xs text-muted-foreground">
            Użyjemy tego do kontaktu. Nie będziemy dzielić się Twoim emailem.
          </p>
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
          <p className="text-xs text-muted-foreground">
            Minimum 8 znaków.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="confirm-password"
            type="password"
            placeholder="Potwierdź Hasło"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Rejestracja..." : "Zarejestruj się"}
        </Button>
        <div className="text-center text-xs pt-2">
          Masz już konto?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="underline hover:text-primary"
          >
            Zaloguj się
          </button>
        </div>
      </form>
    </div>
  )
}
