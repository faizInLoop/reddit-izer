import type { Activity, Conversation, Insight, RedditAnalysis, RedditDataProvider } from "./types";

const topics = ["Design systems", "Urban gardening", "Open source", "Productivity", "Photography", "Climate tech", "Home cooking", "Indie games"];
const communities = ["DesignSystems", "gardening", "opensource", "productivity", "photography", "climatetech", "MealPrepSunday", "indiegames"];
const posts = [
  ["A small guide to building design tokens that actually scale", "After three rounds of cleanup, the biggest win was keeping the naming boring and predictable. Sharing the structure that worked for our team.", 184, 42],
  ["What’s growing well on a north-facing balcony this spring?", "I’ve got a few planters and about four hours of direct light. Curious what has worked for people with similar conditions.", 67, 31],
  ["We made our docs site open source — feedback welcome", "The project started as an internal handbook and grew into a resource we now use across three products. The search and navigation are the parts I’m still tuning.", 132, 26],
  ["A weekly review template that takes less than 15 minutes", "I’ve been testing a very lightweight reset on Friday afternoons: close loops, choose next week’s three priorities, and leave the rest for later.", 95, 38],
  ["Golden hour at the old harbor — shot on a compact camera", "Walked down to the water just before sunset and tried to keep the edit close to what it felt like in person.", 213, 19],
  ["Looking for practical examples of low-carbon home retrofits", "Most of what I find is either huge renovations or product marketing. Would love real-world notes on the smaller changes that made a measurable difference.", 54, 22],
  ["Batch cooking without eating the same lunch five days in a row", "A base ingredient plus two sauces has been a good middle ground for me. What are your go-to combinations?", 109, 47],
  ["A cozy puzzle game for people who like to tinker", "We’ve been prototyping a tiny game about restoring an abandoned greenhouse. Here’s a short clip of the planting loop.", 76, 18]
];
const replies = [
  "This is a really useful breakdown. The naming examples made it click for me.",
  "Have you tried adding a little shade cloth? It helped my seedlings through the warmer afternoons.",
  "We moved our docs to this setup last year and the contributor guide made a huge difference.",
  "I use a similar reset, but I do it on Sunday evening. Keeping it short is the key.",
  "The colors here are lovely. Did you use a polarizer or just wait for the light?",
  "The insulation rebate in my area covered most of the air sealing. Worth checking local programs.",
  "Freezing the sauces separately made this much easier to mix up during the week.",
  "The tiny interactions look great. Is there a public demo people can try?"
];
const replyReplies = ["That’s a good point — I’ll add it to the notes.", "Thanks! I hadn’t considered that angle.", "I did, and it made the whole process simpler.", "Appreciate the recommendation, I’ll give it a try."];
const dayOffsets = [0, 1, 2, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24, 26, 29, 32, 35, 38, 42, 45, 49, 53, 58, 62];
const fixedNow = new Date("2026-11-07T12:00:00Z");
function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619); return h >>> 0; }

function makeAnalysis(username: string): RedditAnalysis {
  const seed = hash(username.toLowerCase());
  const activities: Activity[] = [];
  const conversations: Conversation[] = [];
  for (let i = 0; i < 24; i++) {
    const idx = (i + seed % posts.length) % posts.length;
    const [title, body, score, comments] = posts[idx] as [string, string, number, number];
    const date = new Date(fixedNow.getTime() - dayOffsets[i] * 86400000 - ((seed + i * 937) % 14) * 3600000);
    const id = `p_${String(i + 1).padStart(3, "0")}`;
    const community = communities[idx];
    const post: Activity = { id, type: "post", subreddit: community, title, body, createdAt: date.toISOString(), score: Math.max(2, score + ((seed + i * 7) % 41) - 20), comments: Math.max(1, comments + ((seed + i * 3) % 13) - 6), topic: topics[idx], conversationId: id };
    activities.push(post);
    const tree: Activity[] = [];
    const count = 2 + (i % 3);
    for (let j = 0; j < count; j++) {
      const commentId = `c_${String(i + 1).padStart(3, "0")}_${j + 1}`;
      const comment: Activity = { id: commentId, type: "comment", subreddit: community, title: `Re: ${title}`, body: replies[idx], createdAt: new Date(date.getTime() + (j + 1) * 3600000).toISOString(), score: 4 + ((seed + i * 11 + j * 17) % 63), comments: j % 2 ? 1 : 2, topic: topics[idx], conversationId: id, parentId: id };
      tree.push(comment); activities.push(comment);
      if (j % 2 === 0) {
        const reply: Activity = { id: `${commentId}_r`, type: "comment", subreddit: community, title: `Re: ${title}`, body: replyReplies[(i + j + seed) % replyReplies.length], createdAt: new Date(date.getTime() + (j + 2) * 3600000).toISOString(), score: 2 + ((seed + i * 5 + j * 3) % 29), comments: 0, topic: topics[idx], conversationId: id, parentId: commentId };
        tree.push(reply); activities.push(reply);
      }
    }
    conversations.push({ id, post, replies: tree });
  }
  const insights: Insight[] = [
    { title: "Design and open source recur", description: `Design systems and open source appear across ${activities.filter(a => a.topic === "Design systems" || a.topic === "Open source").length} records, representing two recurring themes in this sample.`, evidence: activities.filter(a => a.topic === "Design systems" || a.topic === "Open source").slice(0, 3).map(a => a.id), icon: "trending" },
    { title: "Replies keep discussions moving", description: `${activities.filter(a => a.parentId && !a.parentId.startsWith("p_")).length} comments in this sample are replies to another comment, showing multi-level participation in threads.`, evidence: activities.filter(a => a.parentId && !a.parentId.startsWith("p_")).slice(0, 3).map(a => a.id), icon: "messages" },
    { title: "Activity spans multiple weeks", description: "Records in this generated sample span a 62-day window, with posts and replies represented at different points in time.", evidence: activities.slice(0, 3).map(a => a.id), icon: "clock" },
    { title: "Posts draw varied engagement", description: `Post scores range from ${Math.min(...activities.filter(a => a.type === "post").map(a => a.score))} to ${Math.max(...activities.filter(a => a.type === "post").map(a => a.score))} points in this synthetic sample.`, evidence: activities.filter(a => a.type === "post").sort((a, b) => b.score - a.score).slice(0, 2).map(a => a.id), icon: "sparkles" }
  ];
  return {
    profile: { username, createdAt: "2019-04-18T00:00:00Z", karma: 12840 + seed % 51000, verified: false, description: "Synthetic demo profile · activity generated for portfolio demonstration" },
    activities: activities.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), conversations, insights
  };
}

export class MockRedditProvider implements RedditDataProvider {
  async getAnalysis(username: string): Promise<RedditAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 650));
    return makeAnalysis(username);
  }
}
export const redditDataProvider: RedditDataProvider = new MockRedditProvider();
