import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { UEQSResponse } from "@/lib/evaluationStorage";

interface UEQSFormProps {
  responses: UEQSResponse;
  onChange: (responses: UEQSResponse) => void;
}

const UEQS_ITEMS = [
  { id: "obstructive_supportive", left: "Obstructive", right: "Supportive" },
  { id: "complicated_easy", left: "Complicated", right: "Easy" },
  { id: "inefficient_efficient", left: "Inefficient", right: "Efficient" },
  { id: "confusing_clear", left: "Confusing", right: "Clear" },
  { id: "boring_exciting", left: "Boring", right: "Exciting" },
  { id: "notinteresting_interesting", left: "Not interesting", right: "Interesting" },
  { id: "conventional_inventive", left: "Conventional", right: "Inventive" },
  { id: "usual_leadingedge", left: "Usual", right: "Leading edge" },
];

export function UEQSForm({ responses, onChange }: UEQSFormProps) {
  const handleResponseChange = (itemId: string, value: string) => {
    onChange({
      ...responses,
      [itemId]: Number(value)
    });
  };

  return (
    <Card className="border-terracotta/30 bg-parchment/5">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-terracotta" />
        </div>
        <CardTitle className="text-xl text-terracotta-foreground">
          User Experience Questionnaire (UEQ-S)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rate your overall experience on each scale from 1 to 7
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {UEQS_ITEMS.map((item, index) => (
          <div key={item.id} className="space-y-3 p-4 rounded-lg border border-border/50 bg-card/50">
            <div className="flex items-center justify-between text-sm">
              <Badge variant="outline" className="bg-coral/10 text-coral-foreground border-coral/30">
                {item.left}
              </Badge>
              <span className="text-xs text-muted-foreground">Q{index + 1}</span>
              <Badge variant="outline" className="bg-sage/10 text-sage-foreground border-sage/30">
                {item.right}
              </Badge>
            </div>
            <RadioGroup
              className="grid grid-cols-7 gap-2"
              value={responses[item.id]?.toString() || ''}
              onValueChange={(value) => handleResponseChange(item.id, value)}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} className="flex flex-col items-center space-y-1">
                  <RadioGroupItem 
                    id={`${item.id}-${n}`} 
                    value={String(n)}
                    className="data-[state=checked]:border-terracotta data-[state=checked]:bg-terracotta"
                  />
                  <Label 
                    htmlFor={`${item.id}-${n}`} 
                    className="text-xs font-normal cursor-pointer hover:text-terracotta"
                  >
                    {n}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        {/* Progress indicator */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            {Object.keys(responses).length} of {UEQS_ITEMS.length} questions answered
          </p>
        </div>
      </CardContent>
    </Card>
  );
}