'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Loader2, 
  Download, 
  Search, 
  Eye,
  Users,
  FileText,
  Shield,
  Zap,
  Target,
  Wifi,
  Cpu,
  Smartphone,
  Bitcoin
} from "lucide-react";
import { useState, useEffect } from "react";

interface Book {
  id: string;
  title: string;
  filename: string;
  path: string;
  category: string;
  subcategory?: string;
  size: number;
  lastModified: string;
}

interface BookSubcategory {
  id: string;
  name: string;
  bookCount: number;
  books: Book[];
}

interface BookCategory {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'specialized';
  bookCount: number;
  subcategories: BookSubcategory[];
}

export default function LibraryPage() {
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/library/books');
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
        setTotalBooks(data.totalBooks);
      } else {
        setError(data.message || 'Failed to load books');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.includes('Beginner')) return Shield;
    if (categoryName.includes('Intermediate')) return Target;
    if (categoryName.includes('Advanced')) return Zap;
    if (categoryName.includes('Network')) return Wifi;
    if (categoryName.includes('Hardware')) return Cpu;
    if (categoryName.includes('Raspberry')) return Smartphone;
    if (categoryName.includes('Cryptocurrency')) return Bitcoin;
    return BookOpen;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      case 'specialized': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openBook = (book: Book) => {
    const viewUrl = `/api/library/books/view?path=${encodeURIComponent(book.path)}`;
    window.open(viewUrl, '_blank');
  };

  const downloadBook = (book: Book) => {
    const viewUrl = `/api/library/books/view?path=${encodeURIComponent(book.path)}`;
    const link = document.createElement('a');
    link.href = viewUrl;
    link.download = book.filename;
    link.click();
  };

  const filteredCategories = categories.filter(category => {
    if (selectedLevel !== 'all' && category.level !== selectedLevel) return false;
    if (searchQuery) {
      return category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             category.subcategories.some(sub => 
               sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               sub.books.some(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
             );
    }
    return true;
  });

  const filteredBooks = searchQuery ? 
    categories.flatMap(cat => 
      cat.subcategories.flatMap(sub => 
        sub.books.filter(book => 
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    ) : [];

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cybersecurity library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="text-center">
          <BookOpen className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchBooks} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cybersecurity Library</h1>
        <p className="text-muted-foreground">
          Comprehensive collection of cybersecurity books and resources for all skill levels
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{totalBooks} Books</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{categories.length} Categories</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books, categories, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedLevel === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('all')}
              >
                All Levels
              </Button>
              <Button
                variant={selectedLevel === 'beginner' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('beginner')}
              >
                Beginner
              </Button>
              <Button
                variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('intermediate')}
              >
                Intermediate
              </Button>
              <Button
                variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel('advanced')}
              >
                Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Browse by Category</TabsTrigger>
          <TabsTrigger value="search" disabled={!searchQuery}>
            Search Results {searchQuery && `(${filteredBooks.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            
            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getLevelColor(category.level)}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {category.level.charAt(0).toUpperCase() + category.level.slice(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {category.bookCount} books
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{subcategory.name}</h3>
                          <Badge variant="outline">
                            {subcategory.bookCount} books
                          </Badge>
                        </div>
                        <div className="grid gap-3">
                          {subcategory.books.map((book) => (
                            <div key={book.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                              <div className="flex-1">
                                <h4 className="font-medium">{book.title}</h4>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    PDF
                                  </span>
                                  <span>{formatFileSize(book.size)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openBook(book)}
                                  className="gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Read
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadBook(book)}
                                  className="gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {searchQuery && (
            <div className="grid gap-4">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{book.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{book.category}</span>
                          {book.subcategory && <span>• {book.subcategory}</span>}
                          <span>• {formatFileSize(book.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBook(book)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadBook(book)}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
