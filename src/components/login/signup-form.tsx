import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input
            id="name"
            type="text"
            placeholder="Imię i Nazwisko"
            autoComplete="off"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
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
          />
        </div>
        <Button type="submit" className="w-full mt-2">
          Zarejestruj się
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
