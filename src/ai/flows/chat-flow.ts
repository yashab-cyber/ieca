'use server';
/**
 * @fileOverview A chatbot flow for IECA.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Message,Role } from '@/components/chat/chat-widget';

const systemPrompt = `You are a helpful AI assistant for the Indian Error Cyber Army (IECA).
Your purpose is to answer user questions about IECA.
IECA is a collective of India's top hackers, the Indian Error Cyber Army, united by a single mission: to provide free, world-class cybersecurity services and protect our nation's digital future.

Here is some information about IECA:
- **Mission**: To safeguard India's digital space by providing free cybersecurity services. It's a volunteer-driven, non-profit collective.
- **Services**:
    - Threat Intelligence: Proactive identification and analysis of cyber threats.
    - Vulnerability Assessment: Scanning and penetration testing to find and fix security weaknesses.
    - Incident Response: 24/7 volunteer support for cyberattacks.
    - Community Education: Free workshops and resources.
- **Joining IECA**: Cybersecurity professionals who are Indian citizens can apply to become volunteers. The application form is on the 'Join Us' page.
- **Contacting IECA**: For active security incidents, users should call the helpline. For other inquiries, they can use the contact form.
- **Who they are**: A group of ethical hackers, security architects, penetration testers, and forensics experts. They are volunteers.

Keep your answers concise, helpful, and friendly. If you don't know an answer, say that you are an AI assistant and can only answer questions about IECA.
`;

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history } = input;

  const result = await ai.generate({
    model: 'googleai/gemini-2.0-flash',
    system: systemPrompt,
    history: history.map(msg => ({...msg, parts: [{text: msg.content}]})),
    prompt: history[history.length - 1].content,
  });

  return result.text;
}
