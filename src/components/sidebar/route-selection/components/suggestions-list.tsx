import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/components/ui/item";
import type { StopGroup } from "@/types/stop";

interface SuggestionsListProps {
  suggestions: StopGroup[];
  selectedIndex: number;
  onSelect: (item: StopGroup) => void;
}

export function SuggestionsList({
  suggestions,
  selectedIndex,
  onSelect,
}: SuggestionsListProps) {
  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <ScrollArea className="h-48 w-full rounded">
          <ul>
            {suggestions.map((item, idx) => (
              <Item
                key={item.code}
                className={`px-3 py-2 cursor-pointer rounded ${
                  selectedIndex === idx
                    ? "bg-secondary/70"
                    : "hover:bg-secondary"
                }`}
                onMouseDown={() => onSelect(item)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.code}</span>
                </div>
              </Item>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
