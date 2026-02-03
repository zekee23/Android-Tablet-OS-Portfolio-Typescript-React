import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const sampleImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://picsum.photos/400/300?random=1',
    alt: 'Project 1',
    title: 'Web Application',
    category: 'Development'
  },
  {
    id: '2',
    src: 'https://picsum.photos/400/300?random=2',
    alt: 'Project 2',
    title: 'Mobile Design',
    category: 'Design'
  },
  {
    id: '3',
    src: 'https://picsum.photos/400/300?random=3',
    alt: 'Project 3',
    title: 'Brand Identity',
    category: 'Branding'
  },
  {
    id: '4',
    src: 'https://picsum.photos/400/300?random=4',
    alt: 'Project 4',
    title: 'UI Components',
    category: 'Design'
  },
  {
    id: '5',
    src: 'https://picsum.photos/400/300?random=5',
    alt: 'Project 5',
    title: 'Data Visualization',
    category: 'Development'
  },
  {
    id: '6',
    src: 'https://picsum.photos/400/300?random=6',
    alt: 'Project 6',
    title: 'Marketing Campaign',
    category: 'Marketing'
  }
];

export function GalleryApp() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(sampleImages.map(img => img.category))];
  
  const filteredImages = filter === 'all' 
    ? sampleImages 
    : sampleImages.filter(img => img.category === filter);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentIndex + 1) % filteredImages.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Gallery
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            A collection of my work and projects
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openLightbox(image, index)}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-12 bg-gray-200 dark:bg-gray-700">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold">{image.title}</h3>
                  <p className="text-white/80 text-sm">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No images found for this category.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-center mt-4">
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
              <p className="text-white/80">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}