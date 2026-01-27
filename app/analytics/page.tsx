import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Analyse Graphique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-20 text-muted-foreground italic">
          Fonctionnalité Analytics bientôt disponible.
        </div>
      </CardContent>
    </Card>
  );
}
