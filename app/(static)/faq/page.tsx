import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Campus Dabba",
  description: "Find answers to common questions about Campus Dabba services.",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">General Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">What is Campus Dabba?</h3>
              <p className="mt-2 text-muted-foreground">
                Campus Dabba is a platform that connects students and professionals with local home cooks, providing access to authentic, homemade meals. We're pre-incubated at IIIT Dharwad's Research Park and are focused on revolutionizing the way people access home-cooked food.
              </p>
            </div>
            <div>
              <h3 className="font-medium">How does Campus Dabba work?</h3>
              <p className="mt-2 text-muted-foreground">
                1. Home cooks register on our platform and create their profiles<br />
                2. Customers browse nearby cooks and their menus<br />
                3. Orders are placed for specific days<br />
                4. Cooks prepare and deliver the meals<br />
                5. Customers enjoy fresh, home-cooked food
              </p>
            </div>
            <div>
              <h3 className="font-medium">What areas do you currently serve?</h3>
              <p className="mt-2 text-muted-foreground">
                We are currently operating in Dharwad and surrounding areas. We plan to expand to more locations soon.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">For Customers</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">How do I place an order?</h3>
              <p className="mt-2 text-muted-foreground">
                1. Create an account on Campus Dabba<br />
                2. Browse nearby cooks and their menus<br />
                3. Select your preferred meals and delivery time<br />
                4. Complete the payment<br />
                5. Receive your order at the specified time
              </p>
            </div>
            <div>
              <h3 className="font-medium">What payment methods do you accept?</h3>
              <p className="mt-2 text-muted-foreground">
                We accept various payment methods including UPI, credit/debit cards, and net banking.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I cancel my order?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, you can cancel your order up to 2 hours before the scheduled delivery time. Please refer to our cancellation policy for more details.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">For Home Cooks</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">How can I become a cook on Campus Dabba?</h3>
              <p className="mt-2 text-muted-foreground">
                1. Fill out our cook registration form<br />
                2. Complete the verification process (Aadhaar, Food Safety certification)<br />
                3. Set up your profile and menu<br />
                4. Start accepting orders
              </p>
            </div>
            <div>
              <h3 className="font-medium">What are the requirements to become a cook?</h3>
              <p className="mt-2 text-muted-foreground">
                - Valid Aadhaar card<br />
                - Basic Food Safety certification<br />
                - Clean and hygienic cooking space<br />
                - Willingness to maintain high-quality standards
              </p>
            </div>
            <div>
              <h3 className="font-medium">How do I get paid?</h3>
              <p className="mt-2 text-muted-foreground">
                Payments are processed automatically after order completion. You can withdraw your earnings to your bank account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Still have questions?</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              If you can't find the answer you're looking for, please contact our support team:
            </p>
            <div className="space-y-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 