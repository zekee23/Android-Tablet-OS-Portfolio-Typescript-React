import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactApp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement form submission logic
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Get In Touch
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Mail className="w-5 h-5" />
              <span>your.email@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Phone className="w-5 h-5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <MapPin className="w-5 h-5" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Send Me a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label 
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label 
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
