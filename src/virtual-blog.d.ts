declare module 'virtual:blog-posts' {
  interface BlogPost {
    slug: string;
    title: string;
    badgeTitle?: string;
    date: string;
    description: string;
    author: string;
    featured: boolean;
    content: string;
    raw: string;
  }

  const posts: BlogPost[];
  export default posts;
}
