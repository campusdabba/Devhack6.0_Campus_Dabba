import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center | Campus Dabba",
  description: "Get help with your Campus Dabba account, orders, and more.",
};

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold mb-8">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Getting Started</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/help/account" className="text-primary hover:text-primary/80">
                Creating an Account
              </Link>
            </li>
            <li>
              <Link href="/help/ordering" className="text-primary hover:text-primary/80">
                Placing an Order
              </Link>
            </li>
            <li>
              <Link href="/help/payments" className="text-primary hover:text-primary/80">
                Payment Methods
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Common Issues</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/help/troubleshooting" className="text-primary hover:text-primary/80">
                Troubleshooting Guide
              </Link>
            </li>
            <li>
              <Link href="/help/refunds" className="text-primary hover:text-primary/80">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/help/technical" className="text-primary hover:text-primary/80">
                Technical Support
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Contact Support</h2>
          <div className="space-y-3">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:campusdabba@gmail.com" className="text-primary hover:text-primary/80">
                campusdabba@gmail.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+919022392820" className="text-primary hover:text-primary/80">
                +91 9022392820
              </a>
            </p>
            <p>
              <strong>Office Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/faq" className="text-primary hover:text-primary/80">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-primary hover:text-primary/80">
                Support Center
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-primary hover:text-primary/80">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 