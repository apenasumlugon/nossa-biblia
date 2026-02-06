import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BibleProvider } from './context/BibleContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import ChapterPage from './pages/ChapterPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <BibleProvider>
        <FavoritesProvider>
          <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-6 sm:py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:abbrev" element={<BookPage />} />
                <Route path="/book/:abbrev/:chapter" element={<ChapterPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </FavoritesProvider>
      </BibleProvider>
    </Router>
  );
}

export default App;
