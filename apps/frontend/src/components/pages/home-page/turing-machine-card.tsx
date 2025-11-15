import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useUsers } from "@/hooks/useUsers";

export function TuringMachineCard(props: { id: string; tape: string }) {
  const userApi = useUsers();
  const deleteMutation = userApi.useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    if (confirm("Are you sure you want to delete this machine?")) {
      deleteMutation.mutate(props.id, {
        onSuccess: () => {
          console.log("Machine deleted successfully");
        },
        onError: (error) => {
          console.error("Failed to delete machine:", error);
        },
      });
    }
  };

  return (
    <Link to={`/turing-machine/${props.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{props.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono">{props.tape}</p>
        </CardContent>
        {deleteMutation.isError && (
          <div className="px-6 pb-4">
            <p className="text-red-500 text-sm">
              Error: {deleteMutation.error.message}
            </p>
          </div>
        )}
        <CardAction className="px-6">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </CardAction>
      </Card>
    </Link>
  );
}
