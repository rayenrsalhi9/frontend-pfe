import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AiContentService {
  constructor(private http: HttpClient) {}

  /**
   * Calls POST /api/ai/generate — API key stored server-side in backend/.env
   */
  generateAiContent(
    type: "forum" | "blog" | "article",
    context: any,
  ): Observable<string> {
    return this.http.post("ai/generate", { type, ...context }, { responseType: "text" });
  }

  /** Mock generator for offline testing or fallback */
  generateMockContent(
    type: "forum" | "blog" | "article",
    _context: any,
  ): Observable<string> {
    const mockHtml = this.buildMockHtml(type);
    return of(mockHtml).pipe(delay(5000));
  }

  private buildMockHtml(type: "forum" | "blog" | "article"): string {
    switch (type) {
      case "forum":
        return "<h2>What are your thoughts on this topic?</h2><p>This is a discussion thread starter generated to help you engage with the community. Feel free to edit, expand, or remove this content and add your own perspective. We believe this topic will spark interesting conversations. The community would love to hear your personal take on this matter, so please share your experiences and insights below. Remember to keep the discussion respectful and constructive for everyone participating.</p>";
      case "blog":
        return "<h2>Key Insights and Perspectives</h2><p>In this blog post, we explore important ideas and developments that are shaping our understanding of this subject. The following analysis aims to provide you with valuable information and practical takeaways. We encourage you to share this post with colleagues who might benefit from these insights. Your feedback and engagement help us create better content for the entire community. Please feel free to leave your comments and questions below.</p>";
      case "article":
        return "<h2>An In-Depth Analysis</h2><p>This article provides a comprehensive examination of the subject matter, drawing on relevant sources and informed perspectives. The following analysis covers key aspects and considerations that are essential for understanding the broader context. Readers will find this overview useful for gaining a clearer picture of the topic at hand. We present this information in a structured format to facilitate easy reading and comprehension of the material covered.</p>";
    }
  }
}
