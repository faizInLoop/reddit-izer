export type ActivityType = "post" | "comment";
export type Activity = {
  id: string;
  type: ActivityType;
  subreddit: string;
  title: string;
  body: string;
  createdAt: string;
  score: number;
  comments: number;
  topic: string;
  conversationId: string;
  parentId?: string;
};
export type Profile = {
  username: string;
  createdAt: string;
  karma: number;
  verified: boolean;
  description: string;
};
export type Conversation = { id: string; post: Activity; replies: Activity[] };
export type Insight = { title: string; description: string; evidence: string[]; icon: "trending" | "clock" | "messages" | "sparkles" };
export type RedditAnalysis = { profile: Profile; activities: Activity[]; conversations: Conversation[]; insights: Insight[] };
export interface RedditDataProvider { getAnalysis(username: string): Promise<RedditAnalysis> }
