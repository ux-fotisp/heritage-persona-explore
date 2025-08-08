import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { HERITAGE_SITES } from "@/data/heritageSites";

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

export default function RateExperience() {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const [search] = useSearchParams();
  const timeframe = search.get("timeframe") || "before"; // before | after | 24h
  const site = useMemo(() => HERITAGE_SITES.find((s) => s.id === siteId), [siteId]);

  const [responses, setResponses] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");

  const allAnswered = UEQS_ITEMS.every((q) => responses[q.id] !== undefined);

  const handleSubmit = () => {
    if (!site) return;
    if (!allAnswered) {
      toast.error("Please answer all UEQ-S items");
      return;
    }

    const entry = {
      id: `${site.id}-${Date.now()}`,
      siteId: site.id,
      timeframe,
      responses,
      comments,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("ueqsRatings") || "[]");
    existing.push(entry);
    localStorage.setItem("ueqsRatings", JSON.stringify(existing));
    toast.success("Thanks for your feedback!");
    navigate(-1);
  };

  if (!site) {
    return <div className="p-4">Site not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader backPath="/explore" />
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Rate: {site.name}</h1>
          <p className="text-sm text-muted-foreground">UEQ-S questionnaire ({timeframe === "before" ? "Before visit" : timeframe === "after" ? "Right after visit" : "24h after visit"})</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Experience (UEQ-S)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {UEQS_ITEMS.map((q) => (
              <div key={q.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{q.left}</span>
                  <span>{q.right}</span>
                </div>
                <RadioGroup
                  className="grid grid-cols-7 gap-2"
                  onValueChange={(v) => setResponses((r) => ({ ...r, [q.id]: Number(v) }))}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <div key={n} className="flex flex-col items-center">
                      <RadioGroupItem id={`${q.id}-${n}`} value={String(n)} />
                      <Label htmlFor={`${q.id}-${n}`} className="text-xs mt-1">{n}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="comments">Tell us more (optional)</Label>
              <Textarea
                id="comments"
                placeholder="Share your thoughts about the experience..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!allAnswered}>Submit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
