# coffe_shop

Przed przystąpieniem do rozwiązywania zadań przeczytaj poniższe wskazówki

## Jak zacząć?

1. Stwórz [*fork*](https://guides.github.com/activities/forking/) repozytorium z zadaniami.
2. Sklonuj fork repozytorium (stworzony w punkcie 1) na swój komputer. Użyj do tego komendy `git clone adres_repozytorium`
Adres możesz znaleźć na stronie forka repozytorium po naciśnięciu w guzik "Clone or download".
3. Rozwiąż zadania i skomituj zmiany do swojego repozytorium. Użyj do tego komend `git add nazwa_pliku`.
Jeżeli chcesz dodać wszystkie zmienione pliki użyj `git add .` 
Pamiętaj że kropka na końcu jest ważna!
Następnie skommituj zmiany komendą `git commit -m "nazwa_commita"`
4. Wypchnij zmiany do swojego repozytorium na GitHubie.  Użyj do tego komendy `git push origin master`
5. Stwórz [*pull request*](https://help.github.com/articles/creating-a-pull-request) do oryginalnego repozytorium, gdy skończysz wszystkie zadania.

Poszczególne zadania rozwiązuj w odpowiednich plikach.

### Poszczególne zadania rozwiązuj w odpowiednich plikach.

**Repozytorium z ćwiczeniami zostanie usunięte 2 tygodnie po zakończeniu kursu. Spowoduje to też usunięcie wszystkich forków, które są zrobione z tego repozytorium.**


# 01. Aplikacja - początek

Pierwszym etapem budowy aplikacji będzie przygotowanie aplikacji ExpressJS. Będzie ona udostępniała informacje
w 3 obszarach:

- `orders`
- `products`
- `staff`

W folderze warsztatu znajdują się już niezbędne pliki. Uruchamiając apkę skryptem `npm start`, możesz na żywo
edytować API i obserwować zmiany. Do zapytań użyj Postmana - podobnie, jak w poprzednich modułach.

## Główny plik aplikacji - `app.js`

W pliku tym dodaj kod inicjalizujący aplikację. Z racji, iż klienci będą komunikować się z API, używając
danych przesłanych zarówno w querystring-u, jak i ciele zapytania, niezbędne będzie dodanie następujących middleware:

- `bodyParser` z opcjami `urlencoded()` i `json()` - [więcej o konfiguracji w repozytorium NPM](https://www.npmjs.com/package/body-parser)
- `cors`, dla zapytań międzydomenowych - [dokumentacja middleware tutaj](https://www.npmjs.com/package/cors)

Serwer powinien nasłuchiwać na porcie zadanym zmienną konfiguracyjną `APP_PORT`.

## Zmienne konfiguracyjne

Wszystkie zmienne konfiguracyjne przetrzymuj w katalogu `config` i nadawaj im domyślne wartości. Zazwyczaj, dla
odróżnienia od zmiennych lokalnych, nazywa się je używając zapisu `UPPER_CASE`, jak np. `APP_PORT` w powyższym
przykładzie.

Każda ze zmiennych konfiguracyjnych powinna mieć domyślną wartość, ustawioną na najpopularniejszą możliwą wartość,
np:

```javascript
export const APP_HOST = process.env.HOST || "localhost";
```

Poza wartością domyślną, aplikacja powinna mieć możliwość pobrania wartości zmiennej ze środowiska - 
w powyższym przykładzie jest to `process.env.HOST` - dzięki temu będziesz móc łatwo zmieniać konfigurację aplikacji,
zależnie od potrzeb.

Na tym etapie potrzebne Ci będą zmienne `APP_HOST` i `APP_PORT`.

## Inicjalizacja routingu

Czas zbudować solidną strukturę API! Będziemy do tego celu używać `Express Router` 
(niezbędne informacje znajdziesz między innymi [tutaj](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)).

Routery pozwalają na tworzenie zagnieżdżonych ścieżek, z których każdy poziom zagnieżdżenia może być niezależnie
obsłużony. W naszym wypadku chcemy otrzymać następującą strukturę:

```text
|- `/` - Main Router()
  |- `/api/1/` - Router() that groups all the other routers together
    |- `/api/1/orders` - Orders Router()
    |- `/api/1/products` - Products Router()
    |- `/api/1/staff` - Staff Router()
```

Do zaprogramowania jest więc łącznie... 5 routerów (z czego 3 będą bardzo do siebie podobne).
Poniżej znajdziesz krótki opis ścieżek, które musisz zaimplementować.

## `/` - Główny router

Router ten powinien zajmować się dwoma zadaniami:

- obsługa głównej ścieżki API - informuje ona o dostępnych ścieżkach. Powinna zwracać następującą odpowiedź:

```json
{
  "availablePaths": ["/orders", "/products", "/staff"]
}
```

- obsługa brakujących ścieżek - 404. W przypadku niedopasowania do innej ścieżki, powinien on zwrócić następujący
rezultat:

```json
{
    "message": "Not found",
    "status": 404
}
```

## `/api/1` - Router grupujący pozostałe

Jedynym zadaniem tego routera jest zgrupowanie wszystkich podrzędnych routerów (odpowiadających trzem obszarom aplikacji)
pod jedną ścieżką.

## Organizacja routingu - przykład

Zagnieżdżanie routingu jest możliwe dzięki funkcji budującej router - pozwala ona na tworzenie wielu instancji
routerów nawet w tym samym pliku.

Poniższy przykład przypomina nieco Twoje zadanie - tworzy on router główny, dostępny pod ścieżką `/main/1`,
który grupuje razem 2 obszary - `users` i `tasks`

```javascript
import express from "express";

import users from "./users";
import tasks from "./tasks";

const { Router } = express;

const groupingRouter = Router();
groupingRouter.use("/users", users);
groupingRouter.use("/tasks", tasks);

const mainRouter = Router();
mainRouter.use("/main/1", groupingRouter);

// Main API response - just informs about available paths
apiRouter.get("/main/1", (req, res) => {
  res.json({
    hello: "World"
  });
});

export default mainRouter;
```

Oprzyj swój kod na przykładzie, dodając obsługę wcześniej wspomnianych ścieżek i odpowiedzi, a także pliki 
routingu poszczególnych obszarów.

## Routing w obrębie obszarów - CRUD

Dla każdej z 3 ścieżek/obszarów, stwórz plik w folderze `api`, w którym umieścisz routing dla niego.
Każdy z obszarów powinien wspierać pełnię operacji CRUD:

- Tworzenie nowych wpisów z użyciem `PUT`
- Aktualizowanie istniejących wpisów z użyciem `POST`
- Usuwanie wpisów metodą `DELETE`
- Odpytywanie istniejących danych metodą `GET`

Dla każdego z obszarów zaimplementuj **5** ścieżek:

- Główną ścieżkę, np. `/api/1/orders`, która zwróci listę dostępnych metod, dla orders byłoby to np:

```json
{
  "availableMethods": ["GET /:id", "POST /:id", "PUT", "DELETE /:id"]
}
```

Zauważ, że informacja ta zawiera też detale każdej z metod, w tym wypadku - możliwość przekazania ID jako parametr zapytania.

- Cztery ścieżki, odpowiadające wymienionym wcześniej metodom HTTP, które będą zwracać rezultaty odpowiednie dla metody,
której używają

Każda ze ścieżek będzie zwracać obecnie tzw. mock - spreparowaną odpowiedź, zawsze tą samą. W kolejnych krokach warsztatu
będziemy przesuwać mocki coraz bliżej bazy danych, aż ostatecznie - w kroku 4 - zastąpimy je całkowicie prawdziwymi
interakcjami z bazą danych.

### GET /:id

Metoda ta na obecnym etapie prac powinna jedynie zwracać spreparowany statyczny dokument (zawsze ten sam) - przykładowe dokumenty
przedstawione były we wstępie/architekturze - możesz je wykorzystać. Wykorzystaj metodę `res.json()`, w której
przekażesz odpowiedni dokument dla każdej z trzech encji.

### POST /:id

Metoda ta docelowo będzie zwracać ilość zmodyfikowanych dokumentów. Obecnie może ona zwracać jedną z 2 odpowiedzi:

```json
{
  "ok": true
}
```

bądź:

```json
{
  "updated": 1
}
```

### PUT

Metoda ta, podobnie jak metoda aktualizująca dokumenty, powinna obecnie jedynie zwrócić odpowiedź o sukcesie bądź
`_id` stworzonego dokumentu (zauważ, że nie będziemy mieli jeszcze ID w momencie tworzenia danych do zapytania,
powinno one zostać zwrócone w odpowiedzi - jeszcze do tego dojdziemy).

```json
{
  "ok": true
}
```

bądź:

```json
{
  "id": "123123123123123123123123"
}
```

### DELETE /:id

Metoda ta powinna symulować usuwanie dokumentu i zwracać - podobnie jak poprzednie metody - sukces:

```json
{
  "ok": true
}
```

## Podsumowanie

Jeśli wykonasz zadanie poprawnie dla wszystkich trzech obszarów (póki co, poszczególne pliki znajdujące się w
folderze `/api` będą bardzo do siebie podobne - zmieni się to już niedługo), możesz już odpytywać pierwsze API!

Poniżej znajdziesz checklistę z celami tego etapu, która pomoże Ci łatwiej śledzić Twoje postępy:

| Wymaganie                                                                    |
|------------------------------------------------------------------------------|
| Folder konfiguracji zawiera konfigurację apki w `app.js`                     |
| Plik `app.js` uruchamia aplikację `ExpressJS`                                |
| Plik `api/index.js` eksponuje odpowiedni routing                             |
| Ścieżka `/api/1` zwraca informacje o metodach                                |
| Ścieżka `/api/1/orders` udostępnia operacje CRUD (plik `/api/orders.js`)     |
| Ścieżka `/api/1/products` udostępnia operacje CRUD (plik `/api/products.js`) |
| Ścieżka `/api/1/staff` udostępnia operacje CRUD (plik `/api/staff.js`)       |


# 02. Serwisy

Drugim etapem przygotowania aplikacji jest dodanie serwisów - będą one zajmować się logiką biznesową - walidacjami
danych, przygotowywaniem dokumentów przed zapisem do bazy danych (przez przyszłe metody bazodanowe) oraz 
sprawdzenie parametrów wejściowych każdej z metod.

Stwórz katalog `src/services` i umieść w nim odpowiadające obszarom pliki `orders.js`, `products.js` i `staff.js`.
W każdym z tych plików będziesz implementować klasę, opisującą serwis odpowiedzialny za dany obszar.

## Krok pierwszy - implementacja serwisów

Serwisy eksponować powinny metody powiązane z operacjami CRUD, np. dla serwisu `Orders`:

- `addOrder(orderData)`, który w przyszłości będzie dodawać nowe zamówienie
- `deleteOrder(orderId)`, który usuwa zamówienie o danym ID
- `getOrders(orderId, additionalParams)`, który zwróci powiązane zamówienia
- `updateOrder(orderId, orderData)`, który zaktualizuje wybrane zamówienie

Podobnie będą wyglądały serwisy dla pozostałych dwóch obszarów (i ponownie - na tym etapie nie będą się jeszcze
bardzo - poza nazewnictwem - różnić).

Przykładowy szkielet serwisu `Orders`:

```javascript
export default class Orders {
  async addOrder(orderData) {
  }

  async deleteOrder(orderId) {
  }

  async getOrders(orderId, dateFrom, dateTo) {
  }

  async updateOrder(orderId, orderData) {
  }
}
```

## Krok 1.5 - dodanie walidacji i obsługa błędów

Czas dodać proste walidacje - zagwarantują one odporność na krytyczne błędy.

Na początek - stwóz w folderze `src/constants` nowy plik `error.js` - będzie on eksportował dzielone między różnymi
częściami kodu typy błędów (np. brakujące dane, nie znaleziono zasobu itp.).

Przykładowy wpis w takim pliku mógłby wyglądać tak:

```javascript
export const CONFLICT = 'CONFLICT';
```

Taka stała może zostać potem użyta w serwisie i api do abstrakcyjnej obsługi błędów - moduły te użyją zmiennych nazw błędów
do komunikacji między sobą (serwis będzie błędy produkował, a API zareaguje na dany błąd odpowiednim komunikatem HTTP).

Teraz pozostaje zaimplementowanie mechanizmu błędów. Jego idea działania jest stosunkowo prosta:

1. Do aplikacji dociera zapytanie.
2. API przekazuje dane do serwisu i wywołuje odpowiednią metodę
3. Serwis waliduje dane wejściowe
4. Jeśli jakichś danych brakuje - tworzy nowy błąd. Błąd tworzony jest z wiadomością ze słownika błędów (naszego pliku `src/constants/error.js`).
5. API reaguje na błąd. Zależnie od jego typu, tłumaczy typ błędu na kod i HTTP  zwraca go do użytkownika (np. dla powyższego `CONFLICT` byłoby to `409 CONFLICT`).
6. Jeśli błąd nie wystąpi - serwis zwróci dane, a API przekaże je do użytkownika/konsumenta API

Listę błędów niezbędną na tym etapie można podsumować jako:

- `CONFLICT` (kod HTTP 409) - konflikt zasobów - próbujesz np. wstawić dokument z ID, które już istnieje
- `NOT_FOUND` (kod HTTP 404) - próbujesz wykonać operację na nieistniejącym zasobie
- `MISSING_DATA` (kod HTTP 400) - próbujesz wykonać operację bez przekazywania wystarczającej ilości danych (np. update bez danych do aktualizacji)

Zauważ, że poza powyższymi kodami, Twój serwer może zawsze napotkać nieoczekiwany błąd (będzie to każdy błąd, którego
wiadomość nie będzie się zawierała w powyższych). Dla takich przypadków należy zwrócić kod HTTP 500 oraz przekazać
wiadomość zawartą w błędzie.

Omówmy podstawowe walidacje dla poszczególnych operacji:

1. GET - ten zasób zawsze odpowiada rezultatem, w najgorszym wypadku - pustą odpowiedzią. Brak dodatkowej obsługi błędów
2. POST - serwis powinien sprawdzić, **czy dane do aktualizacji są przekazane (MISSING DATA)** oraz **czy istnieje jakikolwiek zasób do aktualizacji (NOT_FOUND)**
3. PUT - serwis powinien sprawdzić, czy dane nowej encji (np. zamówienie, produkt) zostały przekazane (MISSING_DATA). Bez danych nie da się stworzyć dokumentu!
4. DELETE - serwis powinien sprawdzić, czy id zostało podane i czy istnieje (MISSING_DATA dla brakującego id, NOT_FOUND jeśli id nie istnieje) (póki co - możesz sprawdzić, czy jest takie samo jak statycznego dokumentu/mocka)

## Krok drugi - przesunięcie mock-ów do serwisów

W tym kroku przeniesiemy mocki (statyczne odpowiedzi) dokumentów do serwisu. Pamiętaj o zasadzie KISS - każdy z plików powinien
wiedzieć jedynie tyle, ile potrzebuje.

Oznacza to, iż **powinnaś/powinieneś w serwisie zwracać dane związane z procesowaniem danych w jego obrębie** (np.
nie powinno zwracać się w serwisach danych, które wyglądają tak, jak rezultat zwracany w API).

Po przeniesieniu przykładowych statycznych dokumentów do serwisu, możemy zaimplementować resztę procesowania w API - tym
samym zbliżymy się jeden krok do finalnego "wyglądu" plików w folderze `/api`.

Aby ułatwić Ci implementację wszystkich metod oraz rozjaśnić niezbędne do wykonania kroki,
poniżej znajdziesz przykładową implementację zmodyfikowanej metody `PUT` i odpowiadającej metody z serwisu dla zamówień, w plikach `src/api/orders.js` i `src/services.orders.js`:

Przenieś dokumenty mocków do serwisu, przypisując je np. do właściwości klasy:

```javascript
export default class Orders {
  mockOrder = {
    _id: ObjectID('123123123123213123123'),
    date: new Date(),
    location: 2,
    paidIn: 'cash',
    staffId: '1',
    products: [
      {
        productId: '2',
        name: 'Mocha',
        amount: 2,
        unitPrice: 2.0,
        total: 4.0,
      },
    ],
    total: 4.0,
  };

  //... REST OF THE CLASS ...//
```

### Implementacja serwisu - `addOrder`

Metoda ta może zwrócić 2 błędy - brak danych (400/MISSING_DATA) bądź konflikt zasobów (409/CONFLICT).

Najprostsza jej implementacja może wyglądać tak:

```javascript
async addOrder(orderData) {
  if (!orderData) {
    throw new Error(MISSING_DATA);
  }
  
  if (this.defaultOrder._id === orderData._id) {
    throw new Error(CONFLICT);
  }
  
  return true;
}
```

Zauważ, że serwis nie wie, jakie kody błędów HTTP powiązane są z błędami walidacji - mapowanie tych błędów to już 
zadanie API - taka separacja odpowiedzialności to bardzo ważna cecha dobrych API!

### Modyfikacja API

Zmodyfikowane API powinno wywołać metodę serwisu (nie zapomnij o zinstancjonowaniu serwisu wcześniej!), 
a następnie zmapować każdy z błędów serwisu na błędy HTTP. W przypadku braku błędów - powinno ono zwrócić odpowiedź,
tak jak wcześniej.

**PRZED**

```javascript
router.put('/:id?', (req, res) => {
  console.log(`PUT ORDER ${req.params.id}`, req.body);

  res.json({
    ok: true,
  });
});
```

**PO**

```javascript
router.put('/:id?', async (req, res) => {
  console.log(`PUT ORDER ${req.params.id}`, req.body);

  try {
    await orders.addOrder({ _id: req.params.id, ...req.body });
    return res.json({
      ok: true,
    });
  } catch (err) {
    switch (err.message) {
      case MISSING_DATA:
        return res.status(400).json({
          error: 'Missing input parameters',
        });
      case CONFLICT:
        return res.status(409).json({
          error: 'Order already exists',
        });
      default:
        return res.status(500).json({
          error: 'Generic server error',
          message: err.message,
        });
    }
  }
});
```

Zauważ, w jaki sposób użyty jest blok `try/catch` w połączeniu z `async/await`. Każdy z rozpoznanych błędów
jest mapowany na odpowiedni kod HTTP, wraz z krótką informacją. W przypadku nieznalezienia mapowania zwracamy
kod 500.

Zaimplementuj podobne zachowanie - według opisanych wcześniej zasad - dla pozostałych operacji oraz pozostałych endpointów.
Pomoże Ci w tym checklista poniżej. Powodzenia!

## Checklista - etap 2

| Wymaganie                                                                                                     |
|---------------------------------------------------------------------------------------------------------------|
| Nowy plik `/src/constants/error.js` z wyeksponowanymi 3 błędami                                               |
| Stworzony nowy serwis dla zamówień                                                                            |
| Stworzony nowy serwis dla produktów                                                                           |
| Stworzony nowy serwis dla załogi (pracowników)                                                                |
| Mocki przeniesione do serwisów (i zwracane w odpowiednich metodach)                                           |
| Dodane niezbędne walidacje w serwisach (wg wyznaczników z zadania)                                            |
| Ścieżka `/api/1/orders` udostępnia operacje CRUD przez serwis i zmodyfikowane API (plik `/api/orders.js`)     |
| Ścieżka `/api/1/products` udostępnia operacje CRUD przez serwis i zmodyfikowane API (plik `/api/products.js`) |
| Ścieżka `/api/1/staff` udostępnia operacje CRUD przez serwis i zmodyfikowane API (plik `/api/staff.js`)       |



# 03. Walidacje

W tym kroku dodamy do serwisów walidacje danych z użyciem biblioteki `Joi`. Jest to jedna z najpopularniejszych 
bibliotek, używanych do walidacji w aplikacjach serwerowych (i nie tylko).
Biblioteka została już dodana do projektu wraz z niezbędnymi zależnościami.

Poza walidacją, w tym kroku zestandaryzujemy też do końca obsługę błędów tak, by wspierała ona walidację
z użyciem Joi.

## Joi - uniwersalne narzędzie walidacji

`Joi` to zestaw narzędzi, pozwalających na określenie kształtu danych, przechodzących przez Twój kod oraz
walidację poprawności danych wejściowych. Jej działanie sprowadza się do tworzenia schematów (trochę jak
"plany" budowy, tzw. blueprints), które są następnie porównywane z obiektami.

Joi wspiera wiele typów danych [więcej tutaj](https://hapi.dev/module/joi/):

- typ `any()` - dowolny rodzaj danych
- typ `array()` - tablice
- typ `binary()` - dane binarne
- typ `boolean()` - zmienne boolowskie
- typ `number()` - zmienne liczbowe
- typ `object()` - obiekty, pozwala na budowanie złożonych schematów z użyciem pozostałych typów
- typ `string()` - zmienne znakowe

Poza podstawowymi zmiennymi, Joi wspiera też wiele dodatkowych operacji, jest także rozszerzalny z użyciem 
dodatkowych pluginów.

Spróbujmy przedstawić działanie Joi na przykładzie z warsztatu - wyobraź sobie, iż chcesz zwalidować poprawność
danych pracownika. Wiesz już, iż dokument pracowników może wyglądać tak:

```javascript
const employee = {
    _id: ObjectId('123123123123123123123123'),
    firstName: 'Jan',
    lastName: 'Kowalski',
    startedAt: '2020-04-19T20:50:13.995Z',
    rating: 4.5,
    position: ['waiter'],
    monthlySalary: 4000
};
```

Wszystkie pola w dokumencie są wymagane - aby stworzyć nowego pracownika nie możesz pominąć żadnego z tych pól.
Możesz wobec tego stworzyć następujący schemat, z użyciem Joi:

```javascript
const employeeSchema = Joi.object().keys({
   _id: idSchema.required(),
   firstName: Joi.string().required(),
   lastName: Joi.string().required(),
   startedAt: Joi.date().required(),
   rating: Joi.number().required(),
   position: Joi.array().required(),
   monthlySalary: Joi.number().required(),
 }).required()
```

Taki schemat zwróci błąd podczas walidacji za każdym razem, gdy albo brakuje całego obiektu albo brakuje którejkolwiek
z wymaganych zmiennych. Udoskonalmy go jednak nieco:

- rating powinien zawierać się między 0 a 10 (zakładamy, iż jest on podawany w 10-stopniowej skali)
- pensja nie powinna być niższa, niż zadane minimum
- stanowiska, na których pracuje pracownik powinny pochodzić z zamkniętej listy.
- schemat aktualizacji danych powinien pozwalać na aktualizację **pojedynczych pól** podczas gdy schemat tworzenia
dokumentów **powinien wymagać wszystko poza `_id`**

Aby uzyskać taki rezultat, możemy udoskonalić nasz schemat i rozbić go na dwa podschematy:

```javascript
export class Staff {
    employeeUpdateSchema = Joi.object().keys({
        _id: idSchema.required(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        startedAt: Joi.date(),
        rating: Joi.number().min(0).max(10),
        position: Joi.array().items(
          Joi.string().valid('waiter'),
          Joi.string().valid('waitress'),
          Joi.string().valid('barista'),
          Joi.string().valid('cleaning'),
          Joi.string().valid('temp')
        ),
        monthlySalary: Joi.number().min(2000), // Optimistically setting this one :)
      });
    
    employeeSchema = this.employeeUpdateSchema.options({ presence: 'required' });

    // Rest of the class implementation
}
```

Pierwszy zapis uległ zmianie - obecnie żadne z pól nie jest wymagane, ale dodaliśmy do nich dodatkowe walidacje (
lepiej oddają one charakter poszczególnych pól i zapobiegają procesowaniu błędnych danych).

Drugi zapis modyfikuje pierwszy schemat - jest to niesamowicie ważna funkjonalność Joi - raz stworzony schemat
może być potem modyfikowany, rozszerzany, upraszczany itp. W powyższym przykładzie - użyliśmy opcji `presence: 'required'`,
która modyfikuje oryginalny schemat, zakładając, iż wszystkie pola są niezbędne.

Warto takie schematy trzymać blisko miejsc użycia (stąd słowo kluczowe this w powyższym przykładzie). 
Dzięki temu będą one dostępne tam, gdzie są potrzebne i łatwo będzie zarówno przepisać klasę w przyszłości,
jak i przenieść ją w inne miejsce. Drugim popularnym podejściem jest za to wydzielenie walidatorów do
innego folderu, prowadzi to jednak do zbyt dużego rozdrobnienia w małych projektach.
Dlatego właśnie zalecanym miejscem dla ich przetrzymywania w naszym przypadku jest klasa - możesz je zapisać jako właściwości klasy.

Finalnie otrzymaliśmy więc dwa schematy:
- pierwszy, idealny do **aktualizacji danych** - dzięki luźnej definicji (bez wymaganych pól), możliwe jest przekazanie
częściowych (niepełnych) obiektów i w rezultacie - aktualizacja części z pól dokumentów
- drugi, idealny do **wstawiania nowych danych**, w którym **każde pole jest wymagane**.

Schematy Joi można użyć w walidacji zarówno synchronicznie, jak i asynchronicznie (zalecane jednak jest podejście
asynchroniczne, chyba że przypadek stanowi inaczej). Aby użyć stworzonego schematu i sprawdzić, czy dokument przeszedł
walidację wystarczy kilka linijek kodu:

```javascript
try {
  await employeeSchema.validateAsync(employeeData); // Employee data consists of employee object that is going to be e.g. saved
} catch (err) {
  console.log(err);
  console.log(err.message);
}
```

Powyższy przykład może być użyty w serwisie np. w metodzie zapisującej nowego pracownika do bazy. Przekazany obiekt (`employeeData`)
zostanie zwalidowany i - w przypadku naruszenia zasad schematu (np. brakujących czy niepoprawnych danych),
zwróci błąd.

W przypadku walidacji asynchronicznej, gdy ta się nie powiedzie (zwróci Promise.reject()), wywołany zostanie blok
`catch (err)` z powyższego przykładu. Wiadomość w błędzie zawierać będzie informacje o nieudanej walidacji, np:

```text
"value" length must be 24 characters long
```

Powyższy błąd wystąpić może w przypadku przekazania np. błędnego parametru `_id` - każde `ObjectID()` w bazie MongoDB
powinno mieć długość 24 znaków.

Szersze omówienie biblioteki `Joi` dalece wychodzi poza zakres tego kursu, jednak powyższy przykład, wraz z
[linkiem do dokumentacji](https://hapi.dev/module/joi/api/) powinny Ci umożliwić szybkie rozpoczęcie pracy
z tą biblioteką.

Joi użyjemy na poziomie serwisów, do walidacji danych przekazanych przez API.

## Nowy kod błędu - VALIDATION_ERROR

Aby wesprzeć w każdym z obszarów walidacje, rozszerzymy słownik błędów o nowy błąd - `VALIDATION_ERROR`.

Użycie kodu tego błędu jest podobne, jak pozostałych błędów. Przepisując blok walidacji z poprzedniego paragrafu,
możemy walidację obsłużyć następująco:

```javascript
try {
  await employeeSchema.validateAsync(employeeData);
} catch (err) {
  const error = new Error(VALIDATION_ERROR);
  error.reason = err.message;
  throw error;
}
```

Kod, który wywoła metodę zawierającą taką walidację otrzyma błąd z wiadomością równą `VALIDATION_ERROR` oraz
polem `reason` zawierającym dokładniejsze informacje o błędzie.

## Standardowa obsługa błędów

Implementując poprzedni etap, mogłaś/mogłeś zauważyć, iż część z obsługi błędów się powtarza - nie dość, że te same
metody w różnych obszarach (np. `GET ORDERS` i `GET PRODUCTS`) mają podobną implementację, to do tego część z kodów
błędów powtarza się między różnymi metodami (np. zarówno `addEmployee`, jak i `updateEmployee` mogą zwrócić `VALIDATION_ERROR`).

W związku z tym, zanim przystąpisz do dodania walidacji do poszczególnych serwisów, warto wyekstrahować standardową obsługę
błędów do oddzielnego pliku.

Stwórz plik `src/utils/errorResponse.js`, a następnie zaimplementuj w nim metodę, która przyjmuje na wejściu
błąd z serwisu oraz obiekt `res` Express-a, a zwraca - używając `res.json()` kod błędu. Metoda ta będzie mogła
być re-użyta we wszystkich blokach `catch {}`, które wyłapują w API błędy wywołania serwisów:

**PRZED**

```javascript
router.put('/:id?', async (req, res) => {
  console.log(`PUT ORDER ${req.params.id}`, req.body);

  try {
    await orders.addOrder({ _id: req.params.id, ...req.body });
    return res.json({
      ok: true,
    });
  } catch (err) {
    switch (err.message) {
      case MISSING_DATA:
        return res.status(400).json({
          error: 'Missing input parameters',
        });
      case CONFLICT:
        return res.status(409).json({
          error: 'Order already exists',
        });
      default:
        return res.status(500).json({
          error: 'Generic server error',
          message: err.message,
        });
    }
  }
});
```

**PO**

```javascript
router.put('/:id?', async (req, res) => {
  const order = { _id: req.params.id, ...req.body };
  console.log(`PUT ORDER`, order);

  try {
    await orders.addOrder(order);
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});
```

Zauważ, o ile skróci się implementacja każdej z wystawionych metod - używając zasady **DRY** wynieśliśmy
powtarzający się wspólny kod do oddzielnej metody. Jej implementacja może wyglądać np. tak:

```javascript
import {
  CONFLICT,
  MISSING_DATA,
  NOT_FOUND,
  VALIDATION_ERROR,
} from '../constants/error';

export default (err, res) => {
  switch (err.message) {
    case MISSING_DATA:
      return res.status(400).json({
        error: 'Missing input parameters',
      })
    // Add missing case/default here
  }
};
```

Uzupełnij tę implementację o resztę odpowiedzi/błędów. Nie zapomnij o domyślnym błędzie z kodem `500`!

## Przygotowanie walidacji w serwisach

Teraz - po zapoznaniu się z Joi i stworzeniem generycznej obsługi błędów, możemy przygotować walidację na poziomie 
serwisów. Walidacja będzie niezbędna **dla każdej metody przyjmującej dane, które mogą być błędne**, a więc... Dla każdej 
metody serwisów używanej przez API:

- w przypadku PUT/dodawania, niezbędna jest walidacja całego obiektu (tak jak w powyższych przykładach)
- w przypadku DELETE/usuwania wystarczy sprawdzić, czy _id spełnia warunki (ma długość 24 znaków - taka walidacja wystarczy)
- w przypadku GET/get wystarczy sprawdzić, czy _id jest poprawne
- w przypadku POST/update należy sprawdzić, czy przekazano _id obiektu do aktualizacji oraz co najmniej jedną dodatkową
właściwość ze schematu. Schemat powinien być taki sam, jak dla PUT/dodawania, ale bez wymagalności pól

Wykorzystaj informacje z przykładów powyżej i zmodyfikuj je na potrzeby konkretnych metod tak, aby każdy z trzech
serwisów walidował dane wejściowe w każdej z metod używanych w API. Schematy obiektów, podobnie jak wcześniej 
mock-owane dokumenty, możesz przypiąć jako właściwość statyczna obiektu, np:

```javascript
export default class Staff {
 employeeUpdateSchema = Joi.object().keys({
    _id: idSchema.required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    startedAt: Joi.date(),
    rating: Joi.number().min(0).max(10),
    position: Joi.array().items(
    Joi.string().valid('waiter'),
    Joi.string().valid('waitress'),
    Joi.string().valid('barista'),
    Joi.string().valid('cleaning'),
    Joi.string().valid('temp')
    ),
    monthlySalary: Joi.number().min(2000), // Optimistically setting this one :)
  });

  //... REST OF THE CLASS ...//
```

## Checklista - etap 3

W tym etapie skupimy się głównie na modyfikacji istniejących plików, bez tworzenia nowych (z wyłączeniem nowego `util`-a):

| Wymaganie                                                                                              |
|--------------------------------------------------------------------------------------------------------|
| Stworzony nowy kod błędu (VALIDATION_ERROR)                                                            |
| Nowy plik `src/utils/errorResponse.js` wraz z poprawnymi odpowiedziami na błędy (łącznie 5 odpowiedzi) |
| Zastąpienie powtarzalnej obsługi błędów w każdym z plików API nowym `errorResponse`                    |
| Uzupełnienie serwisu `src/services/orders.js` o walidacje (+ ich użycie w metodach)                    |
| Uzupełnienie serwisu `src/services/products.js` o walidacje (+ ich użycie w metodach)                  |
| Uzupełnienie serwisu `src/services/staff.js` o walidacje (+ ich użycie w metodach)                     |


# 04. Baza danych

Najwyższy czas zbliżyć się do zagadnień z tego tygodnia - na tym etapie dodamy interakcje z bazą danych
oraz zestandaryzujemy pozostałe elementy aplikacji. 

Efektem pracy po tym etapie powinna być apka, będąca kompletnym **MVP** - minimalnym działającym produktem, która
- z drobnymi poprawkami - mogłaby funkcjonować w prawdziwej kawiarni!

## Połączenie z bazą - plik `src/db/index.js`

Aby umożliwić interakcje z bazą danych, musimy przygotować połączenie do niej - podobnie, jak robiliśmy to
w zadaniach. Stwórz plik `src/db/index.js`, który wystawi metodę, konfigurującą połączenie do Twojej bazy
danych w momencie uruchamiania aplikacji.

Aby połączyć się z bazą danych, potrzebujesz co najmniej:
- adresu hosta oraz portu
- nazwy bazy danych

Stwórz na potrzeby tych zmiennych nowy plik `src/config/db.js` i - jak to miało miejsce wcześniej - udostępnij
w nim zmienne `DB_PORT`, `DB_HOST` i `DB_NAME`, z następującymi wartościami domyślnymi:

- `DB_HOST` - `localhost`
- `DB_PORT` - `27017`
- `DB_NAME` - `coffeeShop`

Podobnie jak poprzednio każda ze zmiennych powinna próbować pobrać najpierw wartość zmiennej środowiskowej, a 
dopiero potem używać wartości domyślnej, np:

```javascript
export const DB_PORT = process.env.MONGO_PORT || 27017;
```

Zaimplementuj zawartość pliku `src/db/index.js` w taki sposób, aby eksportował on połączenie, basę danych oraz
metodę, pozwalającą na zbudowanie tego połączenia:

```javascript
import MongoDB from 'mongodb';

// This will expose DB and connection to consumers
let connection;
let db;

const connectToDB = async () => {
  /// IMPLEMENT
};

export { connectToDB, connection, db };

export default {
  connectToDB,
  connection,
  db,
};
```

Zaimplementuj brakującą metodę tak, aby po połączeniu z bazą, eksportowane zmienne `connection` i `db` miały odpowiednie
wartości. Następnie, użyj tej metody w `app.js` (w dowolnym miejscu, ale im wcześniej, tym lepiej - połączenie
będzie szybciej dostępne):

```javascript
await connectToDB();
```

Gratulacje! Twoja aplikacja właśnie zyskała możliwość wchodzenia w interakcje z bazą MongoDB!

## Operacje na bazie danych - trzy obszary na nowo

Czas stworzyć pliki operacji na bazie danych - podobnie, jak to miało miejsce z serwisami i API, stwórz trzy
pliki: `src/db/orders.js`, `src/db/products.js` oraz `src/db/staff.js` - będziemy w nich implementować
zapytania do bazy danych w postaci eksportowalnych metod, np:

```javascript
import Mongo from 'mongodb';
import { db } from '.';

const getCollection = () => db.collection('staff');

export const deleteEmployee = async (employeeId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectID(employeeId),
  });

  return result.deletedCount;
};
```

Przyjrzyj się powyższemu kodowi (jest to wycinek potencjalnej implementacji metody z warsztatu - możesz jej użyć
jako bazy do tworzenia pozostałych metod). Używa on prostej metody `getCollection()`, aby na potrzeby każdego zapytania
mieć aktualną referencję do używanej kolekcji. Wartym zauważenia jest wpis:

```text
_id: new ObjectId(employeeId)
```

Zauważ, że zmienna znakowa i `ObjectID` to dwa różne twory - aby móc odpytywać bazę danych z użyciem _id przekazanego
jako zmienna String, musimy przekonwertować je do postaci ObjectID.

Przykładowa metoda zwraca ilość skasowanych dokumentów i tylko tyle - ponownie zastosowaliśmy ideę **KISS** - 
nie obchodzi jej, jak wygląda kod, który ją "konsumuje", zwraca ona jedynie dane, które sama posiada.

Postaraj się przenieść kod, który wcześniej zwracał statyczne dane na poziomie każdego z serwisów do prawdziwych zapytań
do bazy danych, a następnie podmień stare odpowiedzi na poziomie serwisów na zapytania bazodanowe z plików w
folderze `src/db`.

**UWAGA**

Pamiętaj, że operacje bazodanowe powinny oddawać charakter oczekiwanych operacji wystawionych przez API. Oznacza 
to tyle, że np. operacja POST powinna przekładać się na **częściową (operator `$set`) aktualizację dokumentu
w bazie**, a operacja PUT powinna zawsze - zgodnie z założeniami - stworzyć nowy dokument!

**UWAGA 2**

Dodanie operacji bazodanowych wiąże się ze zmianą walidacji w serwisie `orders.js` - zauważ, iż pełna implementacja walidacji
powinna zakładać, iż produkty oraz pracownik, wspomniane w zamówieniu **istnieją w bazie danych**. W związku z tym:

1. Dodaj do słownika błędów nowy błąd:

```javascript
export const PEER_ERROR = 'PEER_ERROR';
```

2. Rozszerz walidator `errorResponse.js` o nowy przypadek (powinien on zwrócić 409, tak jak `CONFLICT`)
3. W samym serwisie `orders.js`, dodaj pobieranie pracownika oraz **wszystkich produktów, które zawiera zamówienie**
zanim zapiszesz zamówienie do bazy. Możesz do tego użyć poniższych metod, wyekstrahowanych z finalnej implementacji klasy:

```javascript
static async _checkIfEmployeeExists(employeeId) {
    const existingEmployee = await getEmployees(employeeId);
    if (!existingEmployee) {
      const error = new Error(PEER_ERROR);
      error.reason = 'Missing related employee';
      throw error;
    }
}

static async _checkIfProductsExist(products) {
    const productIds = products.map((product) => product.productId);
    const dbProducts = await getProducts(productIds);
    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        (productId) =>
          dbProducts.findIndex((product) => product._id === productId) === -1
      );
      const error = new Error(PEER_ERROR);
      error.reason = `Missing following products: ${missingIds.join(', ')}`;
      throw error;
    }
}
```

Walidatory te sprawdzą, czy pracownik/produkty użyte w danym zamówieniu istnieją w bazie i w przypadku braku którychkolwiek z nich -
zwrócą odpowiedni błąd.

## Usunięcie statycznych dokumentów z serwisów i wyczyszczenie serwisów

Teraz możesz usunąć stare statyczne dokumenty (mocki) z plików serwisów - od tego czasu Twoja aplikacja będzie
wchodziła w prawdziwe interakcje z bazą danych! Przeanalizujmy taką zmianę dla tej samej metody, co wcześniej (
pomijamy zmiany w API, gdyż zmian tam w zasadzie... nie ma - schodzimy jeden poziom niżej):

**PRZED**

```javascript
async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }
    
    if (this.defaultEmployee._id === employeeData._id) {
      throw new Error(CONFLICT);
    }
    
    try {
      await this.employeeSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    
    // We always return true - because of mocked data
    return true;
}
```

**PO**

```javascript
async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }
    
    try {
      await this.addEmployeeSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }
    
    return addEmployee(employeeData);
}
```

Zauważ, że w tym wypadku zmiana jest w zasadzie "kosmetyczna" - podmieniamy sztywną odpowiedź na odpowiedź z bazy danych,
zwracającą informacje o nowym _id w bazie. Implementacja DB dla tego zapytania może wyglądać tak:

```javascript
export const addEmployee = async (employee) => {
  const result = await getCollection().insertOne(employee);
  return result.insertedId;
};
```

Zwraca ona po prostu nowy ObjectID stworzonego dokumentu. Tyle wystarczy - w połączeniu z odpowiednim kodem API -
aby udostępnić konsumentom API możliwość tworzenia nowych dokumentów, podążających zadanym schematem!

Po aktualizacji reszty metod powinno być możliwe całkowite usunięcie mocka danych - nie powinien być on już nigdzie używany.

## Dodanie opcjonalnych parametrów - operacje GET

Przed przygotowaniem finalnego API warto rozszerzyć najpopularniejsze operacje bazodanowe (a także endpointy API)
o dodatkowe parametry. Rozwiązanie proponowane poniżej dodaje do trzech dostępnych w obszarach operacji `GET` nowe
parametry.

Pamiętaj, że parametry możesz przesłać dwojako:

- w przypadku operacji pobierania bądź usuwania danych (GET, DELETE) - jako querystring, w samym URL
- w przypadku operacji aktualizacji danych (PUT, POST) - zarówno jako querystring, jak i w ciele zapytania (body)

W ExpressJS parametry querystring-a dostępne są w obiekcie `req.params`, a parametry body - w `req.body`.

Dodatkowo - z racji, iż po wdrożeniu tego kroku zapytania te będą obsługiwały zwracanie **wielu wyników** - dodaj w serwisach
specjalne słowo kluczowe **all** (przesyłane jako `_id` w parametrze, np. `/api/1/orders/all`), które pozwoli
na filtrowanie i wyszukiwanie wielu dokumentów, np:

```javascript
export const getEmployees = async (
  employeeId
) => {
  const query = {};

  if (employeeId !== 'all') {
    query._id = new ObjectID(employeeId);
  }

  // REST OF THE CODE SKIPPED
  // ... 
  // QUERY ONLY BELOW 
  return getCollection()
      .find(query)
      .toArray();
```

**UWAGA**

*Zauważ użycie `toArray()` w powyższym przykładzie - ułatwia to zwracanie danych jako tablice w operatorach GET. Ponieważ
w następnych krokach dodamy do tych zapytań stronicowanie, metoda `toArray()` jest bezpieczna - nie powinna spowodować
nadmiernego zużycia zasobów.

### GET ORDERS

Rozszerz istniejące zapytanie `GET` o 2 parametry: `dateFrom` i `dateTo`, przekazane jako np. timestamp tak, aby
MongoDB było w stanie - z użyciem operatorów `$gte` i `$lte` - uzyskać zamówienia z zadanego przedziału dat

### GET PRODUCTS

Rozszerz istniejące zapytanie `GET` o 3 parametry:

- `amountAtLeast`, który wyszuka produkty, których ilość jest **co najmniej taka, jak zadana**
- `brand`, który wyszuka wszystkie produkty danej marki
- `categories`, oddzielone przecinkami, które ograniczą zwracaną ilość dokumentów do posiadających wszystkie zadane kategorie

### GET STAFF

Rozszerz istniejące zapytanie `GET` o 3 parametry:

- `ratingAbove` i `ratingBelow`, które pozwolą wyszukać pracowników o ocenie w określonym przedziale (podobnie jak z datami dla zamówień)
- `position`, czyli wyszukiwanie po zajmowanym stanowisku

## Date helper

Z racji, iż przekazywane w parametrach URL daty mogą mieć różny format (np. timestamp: `123456` bądź datestring: `2020-01-01T10:10:10`)
warto zabezpieczyć się przed takim przypadkiem i umożliwić użytkownikom zapis/odpytywanie dokumentów w obu formatach.
Stwórz plik `src/utils/date.js` o następującej zawartości:

```javascript
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
```

Plik ten sprawdzi, czy data przekazana w zmiennej znakowej jest timestampem, czy ma inną formę i odpowiednio przygotuje wyjściową datę
(wyrażenie regularne w instrukcji warunkowej zwróci prawdę dla String-a złożonego **tylko** z cyfr).
Zauważ, że `new Date('123456')` i `new Date(123456)` to nie to samo - przekazanie timestampa jako zmienna znakowa spowodowałoby
błąd (i dlatego właśnie potrzebujemy takiej funkcji pomocniczej)! Używaj tej funkcji wszędzie, gdzie przygotowujesz zapytania
do bazy danych zawierające daty (zalecane jest użycie jej w plikach `db`, ale możesz też przekonwertować dane wejściowe na daty
na poziomie `API` - obie praktyki mogą być uznane za poprawne).

## Paging - operacje GET

Aby operacje GET działały efektywnie dla dużych zbiorów, użyj znanej Ci z wykładów techniki - połącz operacje
`skip()` i `limit()` tak, aby umożliwić "kartkowanie" odpowiedzi. W rozwiązaniach wybrano `20` jako domyślny rozmiar strony -
użyj wartości, która Ci odpowiada (zwyczajowo strony nie mają więcej niż 100 rezultatów, a najpopularniejsze wartości to `20`, `50` i `100`).

Następnie, dodaj tą zmienną do nowego pliku `src/constants/db.js` jako `PAGE_SIZE`, podobnie jak inne stałe.

Jeśli nie wiesz, jak dokładnie użyć stronicowania w metodzie GET, znajdziesz odpowiedź w następnym podpunkcie.

## GET - przykładowa implementacja

Prześledźmy przykładową implementację najprostszego GET dla produktów.

**API**

```javascript
router.get('/:id?', async (req, res) => {
  console.log(`GET PRODUCTS ${req.params.id}`, req.query);

  try {
    const productData = await products.getProducts(req.params.id, {
      amountAtLeast: req.query.amountAtLeast,
      brand: req.query.brand,
      categories: req.query.categories,
      page: req.query.page,
    });

    return res.json({
      products: productData,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});
```

Implementacja API nie zmieniła się znacząco od kroków 2/3 od czasu przeniesienia obsługi błędów do generycznej metody.
Zauważ, iż nie przesyłamy całego obiektu `req.query` dalej - filtrujemy już na poziomie API parametry tak, aby nie dopuścić
do przypadkowego wstrzyknięcia niechcianego filtra/parametru. Kod "poniżej" (serwis i DB) otrzyma jedynie parametry, na które
pozwoliło API.

**SERWIS - PRODUCTS**

```javascript
async getProducts(productId, additionalParams) {
  return getProducts(productId, additionalParams);
}
```

Jak wspomniano wcześniej, w przypadku serwisu operacja GET jest najprostsza - nie walidujemy wejścia (chociaż można by się pokusić 
o walidację dodatkowych parametrów...), a jedynie przekazujemy parametry niżej - GET jest odporny na błędy schematów, bo w najgorszym
wypadku zwróci on pusty rezultat.

**DB - PRODUCTS**

```javascript
export const getProducts = (
  productIds,
  { amountAtLeast, brand, categories, page = 0 } = {}
) => {
  const query = {};

  if (productIds !== 'all') {
    query._id = { $in: productIds.map((productId) => new ObjectID(productId)) };
  }

  if (amountAtLeast) {
    query.available = { $gte: Number(amountAtLeast) };
  }

  if (brand) {
    query.brand = brand;
  }

  // Uses "and"!
  if (categories) {
    query.categories = { $all: categories.split(',') };
  }

  return getCollection()
    .find(query)
    .limit(PAGE_SIZE)
    .skip(Number(page) * PAGE_SIZE)
    .toArray();
};
```

Implementacja GET jest z kolei najbardziej skomplikowana na poziomie bazy danych - to tutaj następuje budowanie finalnego
filtra, który zadecyduje, jak przygotować finalne dane. Zauważ, że zaczynamy z pustym filtrem (czyli dopasowujemy wszystkie dokumenty),
a następnie - krok po kroku - uzupełniamy go o kolejne dane, w przypadku gdy **istnieją one na wejściu** (czyli w praktyce - zostały przekazane
przez API w zapytaniu).

Zapytanie o produkty jest skonstruowane tak, aby mogło zwrócić wiele wybranych produktów. O ile zarówno pracownicy, jak i zamówienia
to obszary, w których najczęściej pytamy albo o specyficzny dokument albo o dokumenty spełniające bardzo specyficzne kryteria,
o tyle produkty to obszar, w którym często chcemy uzyskać informacje o wybranych dokumentach - zapytanie z wieloma `_id` może być
np. rezultatem wyboru produktów z listy, które chce zamówić klient.

Zauważ jak zrealizowane jest stronicowanie - `.skip()` będzie przewijał rezultaty o wielokrotność wielkości strony, np.
`0-20`, `21-40`, `41-60` itd. dla rozmiaru strony równego `20`.

## Aplikacja a testy E2E

Z racji, że zbliżasz się już do końca warsztatu, czas przetestować Twoją aplikację!

W folderze `e2e-tests` znajdziesz przypadki testowe, które zawierają tzw. testy End-to-End - jest to zbiór 
scenariuszy, które starają się naśladować prawdziwe zachowania w aplikacji.

Możesz uruchomić je po uruchomieniu aplikacji w oddzielnym terminalu komendą `npm test`. Pliki te zawierają finalne
testy Twojej aplikacji i są samo-opisowe - spróbuj dostosować działanie Twojej aplikacji tak, aby odpowiedzi
(zarówno poprawne, jak i te zwracające błędy) zwracane przez Twoją aplikację zgadzały się z oczekiwaniami.

Jest to powszechna praktyka w przypadku rozwoju aplikacji zgodnie z paradygmatem tzw. Test-Driven developmentu, czyli
"rozwoju aplikacji napędzanego (definiowanego) przez testy". W paradygmacie tym pisanie aplikacji rozpoczyna się
od pisania testów, które sprawdzają, czy aplikacja reaguje tak, jak oczekuje programista.

Po implementacji testów w tym podejściu wszystkie (bądź duża większość) testów powinna zwracać błąd - wynika to 
z prostego faktu, że kod, który testują testy jest jeszcze... Nie napisany! 

W następnych etapach programiści implementują kolejne funkcjonalności, obserwując rezultaty testów i starając się
rozwiązać wszystkie przypadki testowe.

Zauważ, iż każdy kolejny etap tego warsztatu wpisuje się właśnie w taki paradygmat - zaczęliśmy od prostych "zaślepek"
na poziomie ExpressJS, następnie dodaliśmy serwisy i proste walidacje, usprawniliśmy i rozszerzyliśmy walidacje o 
schematy Joi, a teraz - będziemy finalnie dodawać interakcje z bazą danych. 

Jeśli wykonywałaś/wykonywałeś poprzednie zadania poprawnie, uruchomienie testów na każdym kolejnym etapie powinno
owocować coraz większą ilością testów, które się powiodą. Postaraj się zakończyć warsztat tak, aby wszystkie testy 
- jak to mawiają programiści i testerzy - "świeciły się na zielono" (przechodziły z sukcesem).

Jeśli nie wiesz, dlaczego dany test się nie udaje, sprawdź zawartość powiązanego przypadku testowego - spróbuj zrozumieć
interakcję, która jest w nim zdefiniowana i przełożyć ją na kod, który rozwiążę problem z przypadku.

Jeśli uda Ci się rozwiązać wszystkie przypadki testowe - gratulacje, właśnie udało Ci się stworzyć Twoje pierwsze
API, którego działanie potwierdzone jest testami (to naprawdę dużo)!

## Checklista - ostatni etap

Gratulacje - dotarłaś/dotarłeś naprawdę daleko! Spróbuj zrealizować wszystkie finalne podpunkty z poniższej listy.

| Wymaganie                                                                         |
|-----------------------------------------------------------------------------------|
| Plik `db/index.js` - połączenie do bazy danych                                    |
| Dodanie nowych zmiennych konfiguracyjnych - `DB_HOST, DB_PORT, DB_NAME`           |
| Dodanie bazowego pliku operacji na zamówieniach - `src/db/orders.js`              |
| Dodanie bazowego pliku operacji na produktach - `src/db/products.js`              |
| Dodanie bazowego pliku operacji na pracownikach - `src/db/staff.js`               |
| Modyfikacja walidacji w serwisie `orders.js` - products + staff                   |
| Ostateczne usunięcie mock-ów z serwisów                                           |
| Dodanie opcjonalnych parametrów do zapytań bazodanowych (orders, products, staff) |
| Dodanie pagingu do zapytań GET                                                    |
| (Opcjonalne) All green - dostosowanie kodu do testów E2E                          |
