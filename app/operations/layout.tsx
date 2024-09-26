export default function OperationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div id="content" className="p-2">{children}</div>
    </div>
  );
}
