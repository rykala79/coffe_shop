export const getDate = (timestampOrStr) => {
    let parsedDate = timestampOrStr;
  
    // Convert timestamp to number
    if (/^\d*$/.test(parsedDate)) {
      parsedDate = Number(parsedDate);
    }
  
    return new Date(parsedDate);
  };
  
  export default {
    getDate,
  };

  /**
   * Date helper
Z racji, iż przekazywane w parametrach URL daty mogą mieć różny format (np. timestamp: 123456 bądź datestring: 2020-01-01T10:10:10) warto zabezpieczyć się przed takim przypadkiem i umożliwić użytkownikom zapis/odpytywanie dokumentów w obu formatach. Stwórz plik src/utils/date.js o następującej zawartości:
   
Plik ten sprawdzi, czy data przekazana w zmiennej znakowej jest timestampem, czy ma inną formę i odpowiednio przygotuje wyjściową datę (wyrażenie regularne w instrukcji warunkowej zwróci prawdę dla String-a złożonego tylko z cyfr). Zauważ, że new Date('123456') i new Date(123456) to nie to samo - przekazanie timestampa jako zmienna znakowa spowodowałoby błąd (i dlatego właśnie potrzebujemy takiej funkcji pomocniczej)! Używaj tej funkcji wszędzie, gdzie przygotowujesz zapytania do bazy danych zawierające daty (zalecane jest użycie jej w plikach db, ale możesz też przekonwertować dane wejściowe na daty na poziomie API - obie praktyki mogą być uznane za poprawne).
   */