import StudentCard from "./components/studentCard";

export default function StudentGroups() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Groups</h1>
        <p className="text-muted-foreground mt-2">
          Monitor student project groups and their progress throughout the
          semester.
        </p>
      </div>
      <StudentCard />
    </div>
  );
}
