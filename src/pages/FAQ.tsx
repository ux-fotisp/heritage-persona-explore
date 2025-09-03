import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles, MapPin, Shield, Users, Calendar } from "lucide-react";

const FAQ = () => {
  const faqSections = [
    {
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: "Getting Started",
      items: [
        {
          question: "What is a travel persona and why do I need one?",
          answer: "A travel persona is a profile that matches your personality, interests, and preferences to cultural heritage sites. It helps us recommend destinations that truly resonate with who you are, making your cultural experiences more meaningful and enjoyable."
        },
        {
          question: "How long does the persona assessment take?",
          answer: "The assessment typically takes 5-10 minutes to complete. It includes questions about your interests, travel style, and cultural preferences. The more thoughtfully you answer, the better your recommendations will be."
        },
        {
          question: "Can I change my persona later?",
          answer: "Absolutely! Your interests and preferences can evolve. You can retake the assessment anytime from your profile page or the main screen. Your new results will update all your recommendations."
        }
      ]
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Recommendations & Discovery",
      items: [
        {
          question: "How do you choose which sites to recommend?",
          answer: "Our recommendations are based on your persona profile, location preferences, and the cultural characteristics of heritage sites. We match sites that align with your interests, travel style, and the types of experiences you enjoy."
        },
        {
          question: "Can I find sites in different countries or regions?",
          answer: "Yes! You can explore heritage sites worldwide. Use the search and filter options to discover sites in specific countries, regions, or near your current location."
        },
        {
          question: "What if I don't like the recommended sites?",
          answer: "Your feedback helps improve future recommendations. Rate the sites you visit, and consider retaking the persona assessment if your interests have changed significantly."
        }
      ]
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: "Planning & Visits",
      items: [
        {
          question: "How do I plan a visit to a heritage site?",
          answer: "From any site's detail page, you can schedule a visit by selecting dates and times. The app will help you plan your itinerary and provide relevant information about opening hours, tickets, and accessibility."
        },
        {
          question: "Can I save sites for later?",
          answer: "Yes! Use the heart icon to save sites to your favorites list. You can access your saved sites anytime from the favorites section in the bottom navigation."
        },
        {
          question: "Does the app work offline?",
          answer: "Basic functionality works offline, including viewing saved sites and your persona information. However, you'll need an internet connection to discover new sites, get updated information, or sync your data."
        }
      ]
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Privacy & Data",
      items: [
        {
          question: "Is my personal data safe?",
          answer: "Yes, we take privacy seriously. Your persona data is stored securely and only used to provide personalized recommendations. We don't share your data with third parties without your consent. See our Privacy Policy for full details."
        },
        {
          question: "What are cookies and do I need them?",
          answer: "Cookies help us remember your preferences between visits. They're stored only on your device and aren't shared externally. You can decline cookies, but you'll need to retake the persona assessment each time you visit the app."
        },
        {
          question: "Can I delete my data?",
          answer: "Yes, you can delete your data anytime from your profile settings. This includes your persona profile, saved sites, and visit history. Note that this action cannot be undone."
        }
      ]
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Technical Support",
      items: [
        {
          question: "The app isn't working properly. What should I do?",
          answer: "Try refreshing the page first. If problems persist, clear your browser cache or try using a different browser. For ongoing issues, contact us through the app's support feature."
        },
        {
          question: "Can I use this app on my mobile device?",
          answer: "Yes! The app is designed to work seamlessly on smartphones, tablets, and desktop computers. For the best mobile experience, you can add it to your home screen like a native app."
        },
        {
          question: "Why can't I see some heritage sites?",
          answer: "Our database is constantly growing. If you know of a heritage site that should be included, you can suggest it through the 'Your Listings' feature. We review and add new sites regularly."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Frequently Asked Questions" backPath="/" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about using our cultural heritage discovery app.
          </p>
        </div>

        <div className="space-y-6">
          {faqSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  {section.icon}
                  <h2 className="text-xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`${sectionIndex}-${itemIndex}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              Still have questions?
            </h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? We're here to help!
            </p>
            <p className="text-sm text-muted-foreground">
              Contact us through the app's support feature or visit our About page to learn more about this research project.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;