import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, Eye, Heart, Lock, AlertTriangle } from "lucide-react";

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Legal Document
            </Badge>
            <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              IECA Code of Conduct
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to maintaining a safe, respectful, and professional environment for all IECA members and the communities we serve.
            </p>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Indian Error Cyber Army (IECA) is dedicated to protecting India's digital infrastructure and educating the cybersecurity community. This Code of Conduct outlines the standards of behavior expected from all members, volunteers, and participants in IECA activities.
              </p>
            </CardContent>
          </Card>

          {/* Core Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Core Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    Respect and Inclusion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We treat all individuals with dignity and respect, regardless of background, experience level, gender, race, religion, or personal characteristics.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    Transparency
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We operate with transparency in our actions, decisions, and communications while maintaining necessary confidentiality for security matters.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-orange-500" />
                    Responsible Disclosure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We follow responsible disclosure practices when reporting vulnerabilities and never exploit security flaws for personal gain.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Legal Compliance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All activities must comply with Indian laws and international cybersecurity regulations. We never engage in illegal activities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expected Behavior */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-green-600">All IECA members are expected to:</p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li className="list-disc">Demonstrate professionalism in all communications and interactions</li>
                <li className="list-disc">Share knowledge and mentor others in the cybersecurity community</li>
                <li className="list-disc">Respect intellectual property and give proper attribution</li>
                <li className="list-disc">Maintain confidentiality of sensitive information</li>
                <li className="list-disc">Use IECA resources and platforms responsibly</li>
                <li className="list-disc">Report security incidents and vulnerabilities through proper channels</li>
                <li className="list-disc">Collaborate constructively and accept feedback gracefully</li>
                <li className="list-disc">Support the mission of protecting India's digital infrastructure</li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Prohibited Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-red-600">The following behaviors are strictly prohibited:</p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li className="list-disc">Any form of harassment, discrimination, or abusive behavior</li>
                <li className="list-disc">Unauthorized access to systems or data</li>
                <li className="list-disc">Malicious activities including but not limited to malware distribution</li>
                <li className="list-disc">Disclosure of vulnerabilities without following responsible disclosure protocols</li>
                <li className="list-disc">Misrepresentation of credentials, experience, or affiliation with IECA</li>
                <li className="list-disc">Sharing or distributing illegal content</li>
                <li className="list-disc">Engaging in activities that could damage IECA's reputation</li>
                <li className="list-disc">Violation of privacy or confidentiality agreements</li>
                <li className="list-disc">Commercial solicitation without proper authorization</li>
              </ul>
            </CardContent>
          </Card>

          {/* Reporting Violations */}
          <Card>
            <CardHeader>
              <CardTitle>Reporting Violations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you witness or experience behavior that violates this Code of Conduct, please report it immediately:
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                <p className="font-medium">Report incidents to:</p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li className="list-disc">Email: conduct@ieca.in</li>
                  <li className="list-disc">Anonymous reporting form on our website</li>
                  <li className="list-disc">Direct message to IECA leadership team</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                All reports will be treated confidentially and investigated promptly. We do not tolerate retaliation against individuals who report violations in good faith.
              </p>
            </CardContent>
          </Card>

          {/* Enforcement */}
          <Card>
            <CardHeader>
              <CardTitle>Enforcement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Violations of this Code of Conduct may result in the following actions:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600">Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    Verbal or written warning for minor violations with guidance on expected behavior.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-600">Temporary Suspension</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporary removal from IECA activities, platforms, or communications.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Permanent Ban</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanent removal from IECA membership and all associated privileges.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600">Legal Action</h4>
                  <p className="text-sm text-muted-foreground">
                    Report to appropriate authorities for illegal activities or serious violations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Communication Standards</h4>
                  <p className="text-sm text-muted-foreground">
                    Use clear, professional language in all communications. Avoid jargon when possible and explain technical concepts for educational purposes.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Knowledge Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Encourage learning by sharing experiences, tools, and techniques. Provide constructive feedback and mentorship to newer members.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Work together respectfully on projects and initiatives. Credit collaborators appropriately and resolve conflicts through discussion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Questions and Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Code of Conduct or need clarification on any policies, please contact:
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-medium">IECA Leadership Team</p>
                <p className="text-sm text-muted-foreground">Email: leadership@ieca.in</p>
                <p className="text-sm text-muted-foreground">Website: www.ieca.in</p>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center text-sm text-muted-foreground">
                By participating in IECA activities, you agree to abide by this Code of Conduct and contribute to a positive, secure, and educational cybersecurity community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
