import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | Campus Dabba",
  description: "Get help and support for Campus Dabba services.",
};

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold mb-8">Support Center</h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Getting Help</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Phone Support</h3>
              <p className="mt-2 text-muted-foreground">
                <strong>Phone:</strong>{" "}
                <a href="tel:+919022392820" className="text-primary hover:text-primary/80">
                  +91 9022392820
                </a>
                <br />
                <strong>Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST
              </p>
            </div>
            <div>
              <h3 className="font-medium">Email Support</h3>
              <p className="mt-2 text-muted-foreground">
                <strong>Email:</strong>{" "}
                <a href="mailto:campusdabba@gmail.com" className="text-primary hover:text-primary/80">
                  campusdabba@gmail.com
                </a>
                <br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="mt-2 text-muted-foreground">
                Available on our website during business hours. Look for the chat icon in the bottom right corner.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Common Issues</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Account Issues</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/help/forgot-password" className="text-primary hover:text-primary/80">
                    Forgot Password
                  </Link>
                </li>
                <li>
                  <Link href="/help/account-verification" className="text-primary hover:text-primary/80">
                    Account Verification
                  </Link>
                </li>
                <li>
                  <Link href="/help/profile-updates" className="text-primary hover:text-primary/80">
                    Profile Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Order Issues</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/help/order-tracking" className="text-primary hover:text-primary/80">
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/help/order-cancellation" className="text-primary hover:text-primary/80">
                    Order Cancellation
                  </Link>
                </li>
                <li>
                  <Link href="/help/payment-issues" className="text-primary hover:text-primary/80">
                    Payment Issues
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">For Home Cooks</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Cook Support</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/help/registration-process" className="text-primary hover:text-primary/80">
                    Registration Process
                  </Link>
                </li>
                <li>
                  <Link href="/help/menu-management" className="text-primary hover:text-primary/80">
                    Menu Management
                  </Link>
                </li>
                <li>
                  <Link href="/help/payment-processing" className="text-primary hover:text-primary/80">
                    Payment Processing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Verification Support</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/help/document-verification" className="text-primary hover:text-primary/80">
                    Document Verification
                  </Link>
                </li>
                <li>
                  <Link href="/help/profile-verification" className="text-primary hover:text-primary/80">
                    Profile Verification
                  </Link>
                </li>
                <li>
                  <Link href="/help/kitchen-verification" className="text-primary hover:text-primary/80">
                    Kitchen Verification
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Emergency Support</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              For urgent issues that require immediate attention:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Call our emergency support line: +91 9022392820</li>
              <li>Use the "Emergency" option in our live chat</li>
              <li>Email with "URGENT" in the subject line</li>
            </ul>
            <div className="mt-4">
              <h3 className="font-medium">Office Location</h3>
              <p className="mt-2 text-muted-foreground">
                IIIT Dharwad Research Park<br />
                Dharwad, Karnataka<br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 