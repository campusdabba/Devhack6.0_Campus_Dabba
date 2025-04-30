import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers | Campus Dabba",
  description: "Join our team and help revolutionize the way people access home-cooked food.",
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold mb-8">Careers at Campus Dabba</h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Join Our Team</h2>
          <p className="text-muted-foreground">
            Campus Dabba is a startup pre-incubated at IIIT Dharwad's Research Park, revolutionizing the way people access home-cooked food. We're looking for passionate individuals to join our team and help us build the future of food delivery.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Why Join Us?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start space-x-2">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-medium">Work on cutting-edge technology</h3>
                <p className="text-muted-foreground">Build innovative solutions using modern tech stack</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-medium">Solve real-world problems</h3>
                <p className="text-muted-foreground">Make a direct impact on people's lives</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-2xl">🌱</span>
              <div>
                <h3 className="font-medium">Be part of a growing startup</h3>
                <p className="text-muted-foreground">Experience rapid growth and learning</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-2xl">🏢</span>
              <div>
                <h3 className="font-medium">Work from IIIT Dharwad Research Park</h3>
                <p className="text-muted-foreground">Access to research facilities and mentorship</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Current Openings</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium text-lg">Full Stack Developer</h3>
              <p className="text-muted-foreground">Location: Dharwad/Hybrid | Experience: 1-3 years</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Next.js/React</li>
                <li>• Node.js</li>
                <li>• PostgreSQL</li>
                <li>• TypeScript</li>
                <li>• REST APIs</li>
                <li>• Git</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium text-lg">Frontend Developer</h3>
              <p className="text-muted-foreground">Location: Dharwad/Hybrid | Experience: 1-3 years</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• React/Next.js</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• UI/UX principles</li>
                <li>• Git</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium text-lg">Backend Developer</h3>
              <p className="text-muted-foreground">Location: Dharwad/Hybrid | Experience: 1-3 years</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Node.js</li>
                <li>• PostgreSQL</li>
                <li>• REST APIs</li>
                <li>• TypeScript</li>
                <li>• Git</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">How to Apply</h2>
          <div className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Fill out our application form</li>
              <li>Attach your resume and portfolio (if applicable)</li>
              <li>Complete the assessment (if required)</li>
              <li>Interview process:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Initial screening</li>
                  <li>Technical assessment</li>
                  <li>Team interview</li>
                  <li>Final discussion</li>
                </ul>
              </li>
            </ol>
            <a
              href="https://forms.gle/DKhBZBuZQ3zBzZdu9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start space-x-2">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-medium">Competitive salary</h3>
                <p className="text-muted-foreground">Attractive compensation package</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="font-medium">Stock options</h3>
                <p className="text-muted-foreground">Own a piece of the company</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-2xl">🏥</span>
              <div>
                <h3 className="font-medium">Health insurance</h3>
                <p className="text-muted-foreground">Comprehensive medical coverage</p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="font-medium">Learning budget</h3>
                <p className="text-muted-foreground">Invest in your growth</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-medium mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <a
                href="mailto:careers@campusdabba.com"
                className="text-primary hover:text-primary/80"
              >
                careers@campusdabba.com
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