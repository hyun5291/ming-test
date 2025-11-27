export interface User {
    id: string;
    email: string | undefined;
    role: string | undefined;
    nickname?: string | undefined;
}

export interface AuthStore {
    user: User | null;
    setUser: (param: User | null) => void;
    reset: () => Promise<void>;

    session: any | null;
    setSession: (param: any | null) => void;
}

export interface Topic {
    id: number;
    created_at: Date;
    updated_at: Date;
    author: string;
    authorName: string;
    title: string;
    content: string;
    category: string;
    thumbnail: string;
    status: string;
    viewCounts: number;
    commentCounts: number;
    likeCounts: number;
}
