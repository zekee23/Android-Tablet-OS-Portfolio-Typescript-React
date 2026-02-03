import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Phone, Mail, MessageCircle, Star, MoreVertical, ArrowLeft, ArrowRight } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  phone?: string;
  link?: string;
  email?: string;
  avatar?: string;
  isFavorite?: boolean;
}

export function ContactApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [navigationStack, setNavigationStack] = useState<string[]>(['main']);

  const contacts: Contact[] = useMemo(() => [
    { id: 1, name: 'Earl Jann Rivera (ME)', phone: '+639464741600', email: 'earlrivera00@gmail.com', isFavorite: true },
    { id: 2, name: 'LinkedIn', link: `${import.meta.env.VITE_LINKEDIN_URL}`, email: 'earlrivera00@gmail.com', isFavorite: true },
    { id: 3, name: 'GitHub', link: `${import.meta.env.VITE_GITHUB_URL}`, email: 'earlrivera00@gmail.com', isFavorite: true },
    { id: 4, name: 'Viber', phone: '+639464741600' },
    { id: 5, name: 'WhatsApp', phone: '+639464741600' },
  ], []);

  const filteredContacts = useMemo(() => 
    contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchQuery))
    ), [contacts, searchQuery]);

  const handleContactClick = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setNavigationStack(prev => [...prev, 'detail']);
  }, []);

  const handleBack = useCallback(() => {
    setNavigationStack(prev => {
      const newStack = [...prev];
      newStack.pop();
      
      if (newStack.length === 1) {
        setSelectedContact(null);
      }
      
      return newStack;
    });
  }, []);

  // Custom back handler to override OS back button
  useEffect(() => {
    const customBackHandler = () => {
      if (navigationStack.length > 1) {
        handleBack();
        return true;
      }
      return false;
    };

    (window as any).customBackHandler = customBackHandler;

    return () => {
      (window as any).customBackHandler = null;
    };
  }, [navigationStack, handleBack]);

  if (selectedContact) {
    return <ContactDetail contact={selectedContact} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center pt-10 justify-between mb-3">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Contacts</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto pt-5 px-4 py-2">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No contacts found
          </div>
        ) : (
          <div className="space-y-3 ">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {contact.name}
                    </h3>
                    {contact.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {contact.phone || contact.email || 'Link'}
                  </p>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactDetail({ contact, onBack }: { contact: Contact; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white flex-shrink-0">
        <div className="px-4 py-3 flex items-center">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-medium">Contact Details</h2>
        </div>
        
        <div className="px-4 pb-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-2">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-xl font-semibold mb-1 truncate px-2">{contact.name}</h1>
          {contact.isFavorite && (
            <div className="flex items-center justify-center gap-1 text-yellow-300">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs">Favorite</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {contact.phone && (
            <button className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Phone className="w-5 h-5 text-green-600 mb-1" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Call</span>
            </button>
          )}
          {contact.phone && (
            <button className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <MessageCircle className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Message</span>
            </button>
          )}
          {contact.email && (
            <button className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Mail className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Email</span>
            </button>
          )}
          {contact.link && (
            <button 
              onClick={() => window.open(contact.link, '_blank')}
              className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowRight  className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-xs text-gray-600 dark:text-gray-300">Open</span>
            </button>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          {contact.phone && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mobile</p>
                  <p className="text-sm text-gray-900 dark:text-white truncate">{contact.phone}</p>
                </div>
              </div>
            </div>
          )}
          {contact.email && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white truncate">{contact.email}</p>
                </div>
              </div>
            </div>
          )}
          {contact.link && (
            <div className="p-3">
              <div className="flex items-center gap-3">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profile</p>
                  <p className="text-sm text-gray-900 dark:text-white truncate">{contact.link}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
