// components/LocaleToggleButton.js
import { useLocale } from '@/context/LocaleContext';

const LocaleToggleButton = () => {
  const { locale, toggleLocale } = useLocale();

  return (
    <button onClick={toggleLocale}>
      {locale === 'en' ? 'Switch to Spanish' : 'Switch to English'}
    </button>
  );
};

export default LocaleToggleButton;