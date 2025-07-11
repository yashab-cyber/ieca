import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Scale, Shield, Target, Users, Lock, Eye, BookOpen, AlertCircle } from "lucide-react";

export default function EthicsPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-sm font-medium">
              <Scale className="w-4 h-4 mr-2" />
              Legal Document
            </Badge>
            <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              IECA Ethics Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive ethical framework governing all cybersecurity activities, research, and professional conduct within the Indian Error Cyber Army.
            </p>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Preamble */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Preamble
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Indian Error Cyber Army (IECA) recognizes the significant responsibility that comes with cybersecurity expertise. This Ethics Policy establishes the moral and professional standards that guide our actions in protecting India's digital infrastructure while advancing cybersecurity knowledge and education.
              </p>
              <p className="text-muted-foreground">
                Our ethical framework is built upon the principles of integrity, responsibility, transparency, and service to the greater good of digital security and national interest.
              </p>
            </CardContent>
          </Card>

          {/* Fundamental Ethical Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-500" />
                Fundamental Ethical Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    1. Do No Harm (Primum Non Nocere)
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    All cybersecurity activities must prioritize the prevention of harm to individuals, organizations, and digital infrastructure. We commit to protecting rather than exploiting vulnerabilities.
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    2. Public Interest
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    Our actions serve the broader public interest and national security of India. We prioritize collective digital safety over personal or organizational gain.
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    3. Professional Integrity
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    We maintain the highest standards of professional conduct, honesty, and competence in all cybersecurity activities and representations.
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4 text-red-500" />
                    4. Transparency and Accountability
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    We operate with transparency where possible while maintaining necessary confidentiality for security purposes. We accept accountability for our actions and decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ethical Guidelines for Cybersecurity Research */}
          <Card>
            <CardHeader>
              <CardTitle>Ethical Guidelines for Cybersecurity Research</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Research Conduct</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Conduct research with explicit permission when involving third-party systems</li>
                    <li className="list-disc">Use isolated test environments to prevent unintended harm</li>
                    <li className="list-disc">Obtain proper authorization before accessing any system or network</li>
                    <li className="list-disc">Document and report findings through appropriate channels</li>
                    <li className="list-disc">Share research results for the benefit of the cybersecurity community</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Vulnerability Disclosure</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Follow responsible disclosure timelines (typically 90 days)</li>
                    <li className="list-disc">Provide clear, actionable information to affected parties</li>
                    <li className="list-disc">Coordinate with relevant authorities when national security is involved</li>
                    <li className="list-disc">Respect confidentiality agreements and legal constraints</li>
                    <li className="list-disc">Prioritize critical infrastructure and public safety systems</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3 text-purple-600">Data Protection</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Minimize data collection to what is necessary for research purposes</li>
                    <li className="list-disc">Anonymize and protect any personal data encountered</li>
                    <li className="list-disc">Securely dispose of sensitive data after research completion</li>
                    <li className="list-disc">Comply with data protection laws and regulations</li>
                    <li className="list-disc">Respect individual privacy rights throughout the research process</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">To the Public</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="list-disc ml-4">Protect public safety and welfare</li>
                    <li className="list-disc ml-4">Educate about cybersecurity risks</li>
                    <li className="list-disc ml-4">Advocate for digital rights and privacy</li>
                    <li className="list-disc ml-4">Contribute to national cybersecurity</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600">To Clients/Employers</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="list-disc ml-4">Provide competent and diligent service</li>
                    <li className="list-disc ml-4">Maintain confidentiality</li>
                    <li className="list-disc ml-4">Avoid conflicts of interest</li>
                    <li className="list-disc ml-4">Deliver accurate assessments</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-orange-600">To the Profession</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="list-disc ml-4">Maintain professional competence</li>
                    <li className="list-disc ml-4">Share knowledge and expertise</li>
                    <li className="list-disc ml-4">Mentor emerging professionals</li>
                    <li className="list-disc ml-4">Uphold professional standards</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-purple-600">To Colleagues</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="list-disc ml-4">Treat with respect and fairness</li>
                    <li className="list-disc ml-4">Collaborate constructively</li>
                    <li className="list-disc ml-4">Provide honest feedback</li>
                    <li className="list-disc ml-4">Support professional development</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ethical Decision-Making Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Ethical Decision-Making Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                When facing ethical dilemmas, IECA members should follow this decision-making process:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Identify the Ethical Issue</h4>
                    <p className="text-sm text-muted-foreground">Clearly define the ethical dimensions of the situation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Gather Information</h4>
                    <p className="text-sm text-muted-foreground">Collect all relevant facts, stakeholder perspectives, and applicable guidelines.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Identify Stakeholders</h4>
                    <p className="text-sm text-muted-foreground">Consider all parties who may be affected by the decision.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Evaluate Options</h4>
                    <p className="text-sm text-muted-foreground">Consider alternative courses of action and their potential consequences.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">5</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Apply Ethical Principles</h4>
                    <p className="text-sm text-muted-foreground">Use our fundamental ethical principles to guide the decision.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">6</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Consult and Decide</h4>
                    <p className="text-sm text-muted-foreground">Seek guidance when needed and make an informed decision.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">7</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Implement and Monitor</h4>
                    <p className="text-sm text-muted-foreground">Execute the decision and monitor its outcomes for unintended consequences.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conflicts of Interest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Conflicts of Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                IECA members must identify, disclose, and appropriately manage conflicts of interest:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Financial Conflicts</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Disclose any financial interests in cybersecurity vendors or competitors</li>
                    <li className="list-disc">Avoid recommendations that primarily benefit personal financial interests</li>
                    <li className="list-disc">Recuse from decisions where financial bias may influence judgment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-orange-600">Professional Conflicts</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Disclose relationships with organizations under evaluation or assessment</li>
                    <li className="list-disc">Avoid using IECA resources for personal commercial activities</li>
                    <li className="list-disc">Separate personal opinions from IECA official positions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-blue-600">Information Conflicts</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Respect confidentiality agreements and insider information</li>
                    <li className="list-disc">Avoid trading on non-public security information</li>
                    <li className="list-disc">Prevent unauthorized disclosure of sensitive research or intelligence</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance and Enforcement */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance and Enforcement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Ethics Review Process</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The IECA Ethics Committee reviews:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li className="list-disc">Proposed research projects with ethical implications</li>
                    <li className="list-disc">Reported ethics violations</li>
                    <li className="list-disc">Policy updates and interpretations</li>
                    <li className="list-disc">Educational and training requirements</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Violation Consequences</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                      <h5 className="font-medium text-yellow-800 dark:text-yellow-200">Minor Violations</h5>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">Counseling and ethics training</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                      <h5 className="font-medium text-orange-800 dark:text-orange-200">Moderate Violations</h5>
                      <p className="text-sm text-orange-700 dark:text-orange-300">Suspension from activities</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                      <h5 className="font-medium text-red-800 dark:text-red-200">Serious Violations</h5>
                      <p className="text-sm text-red-700 dark:text-red-300">Termination of membership</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                      <h5 className="font-medium text-purple-800 dark:text-purple-200">Criminal Activity</h5>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Legal action and law enforcement referral</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting and Support */}
          <Card>
            <CardHeader>
              <CardTitle>Reporting Ethical Concerns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                IECA encourages the reporting of ethical concerns and provides multiple channels for doing so:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Ethics Committee</h4>
                  <p className="text-sm text-muted-foreground mb-2">ethics@ieca.in</p>
                  <p className="text-xs text-muted-foreground">Confidential review of ethics concerns</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Anonymous Reporting</h4>
                  <p className="text-sm text-muted-foreground mb-2">ethics-hotline@ieca.in</p>
                  <p className="text-xs text-muted-foreground">Anonymous submission system</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Leadership Team</h4>
                  <p className="text-sm text-muted-foreground mb-2">leadership@ieca.in</p>
                  <p className="text-xs text-muted-foreground">Direct communication with IECA leadership</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Ethics Consultation</h4>
                  <p className="text-sm text-muted-foreground mb-2">consult@ieca.in</p>
                  <p className="text-xs text-muted-foreground">Guidance on ethical dilemmas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commitment Statement */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Indian Error Cyber Army commits to upholding these ethical standards in all our activities. We recognize that ethical behavior is not just about following rules, but about making principled decisions that serve the greater good of cybersecurity and digital safety for all.
              </p>
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium text-center">
                  "With great power comes great responsibility. In cybersecurity, this responsibility extends to protecting not just systems and data, but the trust and safety of the digital world we all share."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
