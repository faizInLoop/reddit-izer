import Dashboard from "@/components/dashboard";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <Dashboard username={decodeURIComponent(username)} />;
}
