import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  increment,
  Timestamp,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface News {
  id?: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  image: string;
  category: 'football' | 'basketball' | 'volleyball';
  isAmateur: boolean;
  createdAt: any;
  clickCount: number;
  slug: string;
  tags: string[];
}

const NEWS_COL = 'news';
const CLICKS_COL = 'clicks';

export const newsService = {
  async getAllNews() {
    try {
      const q = query(collection(db, NEWS_COL), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, NEWS_COL);
    }
  },

  async getNewsByCategory(category: string, isAmateur: boolean = false) {
    try {
      const q = query(
        collection(db, NEWS_COL), 
        where('category', '==', category),
        where('isAmateur', '==', isAmateur),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, NEWS_COL);
    }
  },

  async getRecentNews(count: number = 5) {
    try {
      const q = query(collection(db, NEWS_COL), orderBy('createdAt', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, NEWS_COL);
    }
  },

  async getNewsBySlug(slug: string) {
    try {
      const q = query(collection(db, NEWS_COL), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docData = snapshot.docs[0];
      return { id: docData.id, ...docData.data() } as News;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, NEWS_COL);
    }
  },

  async createNews(news: Omit<News, 'id' | 'clickCount' | 'createdAt'>) {
    try {
      const data = {
        ...news,
        clickCount: 0,
        createdAt: Timestamp.now(),
      };
      return await addDoc(collection(db, NEWS_COL), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, NEWS_COL);
    }
  },

  async updateNews(id: string, news: Partial<News>) {
    try {
      const newsRef = doc(db, NEWS_COL, id);
      await updateDoc(newsRef, news);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${NEWS_COL}/${id}`);
    }
  },

  async deleteNews(id: string) {
    try {
      await deleteDoc(doc(db, NEWS_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${NEWS_COL}/${id}`);
    }
  },

  async getNewsByAuthor(author: string) {
    try {
      const q = query(
        collection(db, NEWS_COL), 
        where('author', '==', author),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    } catch (error) {
      // Fallback for case sensitivity or missing index
      const allNews = await this.getAllNews();
      return allNews?.filter(n => (n.author || '').toLowerCase() === author.toLowerCase()) || [];
    }
  },

  async getNewsByTag(tag: string) {
    try {
      const q = query(
        collection(db, NEWS_COL),
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    } catch (error) {
      console.error('Error getting news by tag:', error);
      const allNews = await this.getAllNews();
      return allNews?.filter(n => (n.tags || []).includes(tag)) || [];
    }
  },

  subscribeToRecentNews(limitCount: number, callback: (news: News[]) => void) {
    const q = query(
      collection(db, NEWS_COL),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
      callback(news);
    }, (error) => {
      console.error('Real-time subscription error:', error);
    });
  },

  async recordClick(newsId: string) {
    try {
      // Increment click counter in the news document
      const newsRef = doc(db, NEWS_COL, newsId);
      await updateDoc(newsRef, {
        clickCount: increment(1)
      });
      
      // Also record individual click for temporal analysis
      await addDoc(collection(db, CLICKS_COL), {
        newsId,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      // Fail silently for user metrics, or handle if needed
      console.warn('Could not record click', error);
    }
  },

  async getAnalyticsSummary() {
     try {
       const snapshot = await getDocs(collection(db, CLICKS_COL));
       return snapshot.docs.map(doc => doc.data());
     } catch (error) {
       handleFirestoreError(error, OperationType.LIST, CLICKS_COL);
     }
  },

  async getAuthors(): Promise<string[]> {
    try {
      const allNews = await this.getAllNews();
      if (!allNews) return ['Samet Büyük'];
      const authors = allNews.map(n => n.author).filter(Boolean);
      return Array.from(new Set([...authors, 'Samet Büyük']));
    } catch (error) {
      console.error('Error fetching authors:', error);
      return ['Samet Büyük'];
    }
  }
};
