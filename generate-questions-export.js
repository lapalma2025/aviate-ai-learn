// Pomocniczy skrypt do wygenerowania SQL INSERT dla wszystkich pytań
// Ten plik NIE jest częścią aplikacji - służy tylko do migracji

const escapeSQL = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
};

// To jest tylko szablon - dane będą wyeksportowane bezpośrednio z Supabase
console.log('Generator pytań - użyj supabase--read-query do eksportu danych');
