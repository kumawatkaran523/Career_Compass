export interface Question {
  id: string;
  text: string;
  tags: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  contributor?: string;
  upvotes?: number;
  createdAt?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}
