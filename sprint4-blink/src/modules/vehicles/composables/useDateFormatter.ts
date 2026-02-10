import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Opcions de format per Intl.DateTimeFormat
 */
export type DateFormatOptions = Intl.DateTimeFormatOptions;

/**
 * Composable per formatar dates segons el locale actual.
 * 
 * @param options - Opcions opcionals de format per Intl.DateTimeFormat
 * @returns Object amb la funció formatDate per formatar dates
 * 
 * @example
 * // Format curt (per defecte)
 * const { formatDate } = useDateFormatter();
 * formatDate('2024-01-15T10:30:00Z'); // "15 gen. 2024"
 * 
 * @example
 * // Format llarg amb hora
 * const { formatDate } = useDateFormatter({
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 *   hour: '2-digit',
 *   minute: '2-digit'
 * });
 * formatDate('2024-01-15T10:30:00Z'); // "15 de gener de 2024, 10:30"
 */
export const useDateFormatter = (options?: DateFormatOptions) => {
  const { locale } = useI18n();

  /**
   * Mapa de locales Vue-i18n a locales Intl
   */
  const LOCALE_MAP: Record<string, string> = {
    ca: 'ca-ES',
    es: 'es-ES',
    en: 'en-GB',
  };

  /**
   * Opcions per defecte: format curt (day month year)
   */
  const DEFAULT_OPTIONS: DateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  /**
   * Computed que retorna el formatter Intl.DateTimeFormat
   * Es recalcula quan canvia el locale
   */
  const dateFormatter = computed(() => {
    const intlLocale = LOCALE_MAP[String(locale.value)] ?? 'ca-ES';
    const formatOptions = options ?? DEFAULT_OPTIONS;

    return new Intl.DateTimeFormat(intlLocale, formatOptions);
  });

  /**
   * Formata una data segons el locale i opcions configurades
   * 
   * @param date - String ISO de data o objecte Date
   * @returns String amb la data formatada
   */
  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateFormatter.value.format(dateObj);
  };

  return {
    formatDate,
  };
};
