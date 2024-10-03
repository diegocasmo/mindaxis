import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function Dashboard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          MindAxis
        </CardTitle>
        <CardDescription className="text-center">
          Turn goals into actionable roadmaps
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
