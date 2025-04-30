import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Campus Dabba",
  description: "Learn about Campus Dabba's mission, vision, and team.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold mb-8">About Campus Dabba</h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Our Story</h2>
          <p className="text-muted-foreground">
            Campus Dabba is a startup pre-incubated at IIIT Dharwad's Research Park, revolutionizing the way people access home-cooked food. We're on a mission to connect students and professionals with authentic, homemade meals while supporting local home cooks.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-2">
            We aim to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Support local families by giving them a platform to share their culinary skills</li>
            <li>Limit the number of customers per household to ensure personalized, high-quality meals</li>
            <li>Provide healthy, home-cooked alternatives to commercial food options</li>
            <li>Create a sustainable ecosystem for home cooks and food lovers</li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Our Vision</h2>
          <p className="text-muted-foreground">
            We envision a world where everyone has access to healthy, home-cooked meals, and local cooks can earn a sustainable income by sharing their culinary talents. Through our platform, we're building a community that values quality, authenticity, and connection.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Join Our Team</h2>
          <p className="text-muted-foreground mb-4">
            We're actively hiring developers and other team members to help us build the future of food delivery. If you're passionate about solving real-world problems and making a difference, we'd love to hear from you!
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Current Openings</h3>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li>Full Stack Developer</li>
                <li>Frontend Developer</li>
                <li>Backend Developer</li>
                <li>UI/UX Designer</li>
                <li>Product Manager</li>
              </ul>
            </div>
            <div>
              <a
                href="https://forms.gle/DKhBZBuZQ3zBzZdu9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <a
                href="mailto:campusdabba@gmail.com"
                className="text-primary hover:text-primary/80"
              >
                campusdabba@gmail.com
              </a>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <a
                href="tel:+919022392820"
                className="text-primary hover:text-primary/80"
              >
                +91 9022392820
              </a>
            </div>
            <div>
              <h3 className="font-medium">Office Location</h3>
              <p className="text-muted-foreground">
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