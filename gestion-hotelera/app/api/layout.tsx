export default function RootLayout({
  children,
}: {
    children: React.ReactNode
}) {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen p-0.5 flex flex-col gap-6">
        {children}
    </div>
  )
}