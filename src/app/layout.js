import './globals.css'

export const metadata = {
  title: 'DigitalGate | Hostel Utility System',
  description: 'Role-Based Full-Stack Hostel Utility and Gate Pass System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="ambient-bg">
          <div className="ambient-orb orb-1"></div>
          <div className="ambient-orb orb-2"></div>
        </div>
        {children}
      </body>
    </html>
  )
}
