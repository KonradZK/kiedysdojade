import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="password"
            type="password"
            placeholder="Hasło"
            className="bg-secondary dark:bg-secondary focus-visible:h-12 transition-all duration-300 ease-in-out font-medium focus-visible:text-xl"
            required
          />
        </div>
        <Button type="submit" className="w-full mt-2">
          Zaloguj się
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
