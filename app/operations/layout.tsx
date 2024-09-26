export default function OperationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <div id="content" className="p-2">{children}</div>
    </div>
  );
}
