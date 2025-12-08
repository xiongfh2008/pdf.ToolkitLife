/**
 * Language Switcher Component
 * Displays a dropdown menu for language selection
 */

import { i18n } from '../i18n/index';
import { createIcons, icons } from 'lucide';

export class LanguageSwitcher {
  private container: HTMLElement | null = null;
  private isOpen: boolean = false;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (this.container) {
      this.render();
      this.attachEventListeners();
      
      // Listen for global language changes to keep all instances in sync
      window.addEventListener('languageChanged', (e: Event) => {
        const customEvent = e as CustomEvent;
        // Re-render to update the displayed language
        this.render();
        // We need to re-attach event listeners for the internal elements after re-render
        this.attachInternalListeners();
      });

      // Close dropdown when clicking outside - attached once
      document.addEventListener('click', (e) => {
        if (this.container && !this.container.contains(e.target as Node)) {
          this.closeDropdown();
        }
      });
    }
  }

  private render(): void {
    if (!this.container) return;

    const currentLang = i18n.getCurrentLanguage();
    const languages = i18n.getAvailableLanguages();
    const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

    this.container.innerHTML = `
      <div class="language-switcher relative">
        <button 
          id="language-button" 
          class="btn-tech-lang flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-colors"
          aria-label="Select Language"
        >
          <i data-lucide="globe" class="w-4 h-4"></i>
          <span class="hidden sm:inline">${currentLanguage.nativeName}</span>
          <i data-lucide="chevron-down" class="w-4 h-4 transition-transform" id="chevron-icon"></i>
        </button>
        
        <div 
          id="language-dropdown" 
          class="hidden absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          <div class="p-2">
            <input 
              type="text" 
              id="language-search" 
              placeholder="Search languages..." 
              class="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div class="py-1" id="language-list">
            ${languages.map(lang => `
              <button
                class="language-option w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center justify-between ${lang.code === currentLang ? 'bg-gray-800 text-indigo-400' : 'text-gray-300'}"
                data-lang="${lang.code}"
              >
                <span>${lang.nativeName}</span>
                ${lang.code === currentLang ? '<i data-lucide="check" class="w-4 h-4"></i>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Initialize Lucide icons
    createIcons({ icons });
  }

  // For backward compatibility if called externally, though internal use is preferred
  private attachEventListeners(): void {
    this.attachInternalListeners();
  }

  private attachInternalListeners(): void {
    if (!this.container) return;

    const button = this.container.querySelector('#language-button');
    const searchInput = this.container.querySelector('#language-search') as HTMLInputElement;
    const languageOptions = this.container.querySelectorAll('.language-option');

    // Toggle dropdown
    button?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Search functionality
    searchInput?.addEventListener('input', (e) => {
      const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
      const languages = i18n.getAvailableLanguages();
      
      languageOptions.forEach((option) => {
        const langCode = option.getAttribute('data-lang') || '';
        const language = languages.find(l => l.code === langCode);
        const matches = language?.nativeName.toLowerCase().includes(searchTerm) ||
                       language?.name.toLowerCase().includes(searchTerm);
        
        if (matches) {
          option.classList.remove('hidden');
        } else {
          option.classList.add('hidden');
        }
      });
    });

    // Language selection
    languageOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const langCode = option.getAttribute('data-lang');
        if (langCode) {
          i18n.setLanguage(langCode);
          this.closeDropdown();
          // Event listener will handle re-render
        }
      });
    });
  }

  private toggleDropdown(): void {
    const dropdown = this.container?.querySelector('#language-dropdown');
    const chevronIcon = this.container?.querySelector('#chevron-icon');
    
    if (this.isOpen) {
      dropdown?.classList.add('hidden');
      chevronIcon?.classList.remove('rotate-180');
    } else {
      dropdown?.classList.remove('hidden');
      chevronIcon?.classList.add('rotate-180');
    }
    
    this.isOpen = !this.isOpen;
  }

  private closeDropdown(): void {
    const dropdown = this.container?.querySelector('#language-dropdown');
    const chevronIcon = this.container?.querySelector('#chevron-icon');
    
    if (dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
        chevronIcon?.classList.remove('rotate-180');
        this.isOpen = false;
    }
  }
}
