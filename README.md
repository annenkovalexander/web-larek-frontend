# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

После клонирования проекта установить зависимости:
```
npm install
```
Запустить проект с помощью команды:
```
npm run start
```

или

```
yarn
yarn start
```
После запуска сервера, открыть приложение по адресу: http://localhost:8080/

## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код

### Класс _EventEmitter_

Данный класс необходим для реализации событийно-ориентированного подхода. В качестве слоя презентера выбран брокер, который и реализуется с помощью указанного класса. Данный класс реализует интерфейс _IEvents_. Инстация класса создаётся без передачи в неё входящий параметров. Конструктор инициализирует Map-объект событий и колбэк-функций. Класс содержит следующие методы:

    1. on -- позволяет подписаваться на событие
    2. off -- удаляет подписку
    3. emit -- вызывает событие с помощью вызова соответсвующей callback-функции, сохранённой методом _on_ данного класса.
    4. onAll -- вызывает для всех событий одну и ту же callback-функцию
    5. offAll -- инициализирует массив событий экземпляра класса, тем самым удалив события и подписчиков.

### Класс _Api_

Базовый класс описывает работу с API произвольной автоматизированной системой. Инстанция класса создаётся с помощью передачи базовой ссылки типа "string" и объекта заголовка запроса типа RequestInit. 

Тип RequestInit:

    - 

Класс содержит следующие публичные методы:

    1. get -- метод получения данных из API по URI. Возможно только операция:
```
    GET
```

    2. post -- метод записи данных в БД. Возможны следующие операции
```
    'POST' | 'PUT' | 'DELETE';
```
А также содержит следующий защищённый метод:

    1. handleResponse, который возвращает Promise c обработкой успешного и неуспешного случаев.

### Тип _ApiListResponse_

Тип является дженериком и служит для работы с данными, полученными из API системы системы заказов.

### Тип _ApiPostMethods_

Является перечислением следующих операций:

```
    'POST' | 'PUT' | 'DELETE';
```

Служит для передачи параметра указанного типа в функцию post данного API


### Класс _LarekAPI_

Данный класс наследуется от класса API и реализует интерфейс ILarekAPI.

Интерфейс ILarekAPI:

    - метод getAllProductItems(): возвращет Promise-объект типа ProductList (список всех товаров, доступных к продаже). Использует метод get родительского класса Api
    - метод getProductInfo(): возращает Promise-объект с данными по товару. Данные имеют тип ProductItem. Использует метод get родительского класса. Идентификатор товара прибавляется как строка к URI метода для получения данных по товарам.
    - метод orderProducts(): выполняет заказ содержащихся в корзине товаров в автоматизированной системе продаж. Метод принимает на вход список товаров в корзине. Список имеет тип ShoppingCartProductsList. Метод возвращает Promise типа OrderResult. Вызыает метод родительского класса post c типом операции POST.

Тип ProductData:

    - количество товаров всего: number
    - массив товаров: массив ProductItem

Тип ProductItem:

    - Идентификатор: string
    - Описание: string
    - URI на изображение: string
    - Наименование: string
    - Категория: string
    - Цена: number

Тип ShoppingCartProductsList:

    - вид платежа: enum 'online' | 'offline'
    - email: string
    - телефон пользователя: string
    - адрес доставки: string
    - общая сумма заказа: number
    - массив идентификаторов товаров: string[]

Тип OrderResult:

    - идентификатор заказа: string
    - итоговая сумма заказа: number

## Компоненты модели данных

### Абстрактный класс _Model_

Данный класс принимает на вход данные дженерик-типа и инстанцию класса _EventEmitter_.

Конструктор класса создаёт инстанцию, заполнением своего контекста значениями входных данных.

Методы класса:

    - emit(eventName: string, payload: object). Метод генерации события.


### Класс _ProductListModel_

Класс наследует класс _Model_, имеет тип ProductData.

Данные класса:

    - Данные продукта: ProductData

Конструктор класса принимает на вход следующие параметры:

    - Данные всех товаров к продаже: ProductData
    - Инстанция класса EventEmitter

Методы класса:

    - метод set productData(data: ProductList). Вызывает событие productData:change

Тип передаваемых данных:

```
type ProductDataEvent = {
    productData: productData
}
```


### Класс _ShoppingCartProductListModel_

Класс наследует класс _Model_, имеет тип ShoppingCartProductsList.

Данные класса:

    - вид платежа: enum 'online' | 'offline'
    - email: string
    - телефон пользователя: string
    - адрес доставки: string
    - общая сумма заказа: number
    - массив идентификаторов товаров: string[]


Класс содержит set-функции для следующих параметров. В скобках указаны события, которые вызываются при изменений эти параметров:

    1. Количество выбранных товаров (shoppingCart: quantityChange)
    2. Вид платежа (shoppingCart: paymentTypeChange)
    3. Почта пользователя (shoppingCart: userEmailChange)
    4. Телефон пользователя (shoppingCart: userPhoneChange)
    5. Адрес доставки (shoppingCart: userAddressChange)
    6. Массив товаров: ProductList (shoppingCart: productsChange)

Остальные методы класса:

    1. Получение данных корзины: ShoppingCartProductsList
    2. Метод который вызывает set-функции посредством присвоения данных через Object.assign(this, data)

## Компоненты отображения

### Абстрактный класс _Component<T>_

Класс является дженериком и принмает в переменную T тип входящего HTML-элемента.
Класс содержит следующие публичные методы:

    1. toggleClass -- для включения/отключения CSS-класса на HTML-элементе
    2. setDisabled -- для установки/снятия атрибута disabled у HTML-элеманта

Защищённые методы:

    1. setText -- Для установки текста у HTML-элемента
    2. setHidden -- Для установки у HTML-элемента признака display: none

### Класс _Page_

Класс наследует класс Component, входящий тип ShoppingCartProductsList. 

Защищённые свойства:

    1. Контейнер для добавления карточек продуктов: HTMLElement
    2. Элемент, содержащий количество товаров в корзине: HTMLElement


Конструктор класса на вход принимает:

    1. HTML-элемент cодержимого обёртки страницы
    2. Массив HTML-элементов карточек
    3. Значение количества товаров в корзине
    4. Значения CSS-классов для изменяемых полей

Класс содержит set-функции для следующих параметров: 

    - массива HTML-элементов карточек товаров: HTMLElement[]
    - значение количества товаров в корзине: number

Элемент корзины содержит слушатель клика, по которому вызывается событие shoppingCart:open с передачей в качестве параметров пустого объекта.

### Класс _ProductCard_

Класс наследует класс Component, входящий тип ProductItem.

Защищённые свойства:

    1. Идентификатор продукта: string
    2. Описание продукта: HTMLElement
    3. Изображение: HTMLElement
    4. Наименование продукта: HTMLElement
    5. Категория продукта: HTMLElement
    6. Цена продукта

Конструктор класса на вход принимает следующие данные:

    1. HTML-элемент из клонированного шаблона для карточки каталога
    2. Значения CSS-классов для изменяемых полей
    3. Идентификатор


Содержит сеттеры для следующих изменяемых параметров карточки:

    - Описание
    - URI на изображение
    - Наименование
    - Категория
    - Цена

Карточка товара содержит слушатель на клик. Он вызывает событие product:open с передачей в него данных типа

```
type ProductOpenEvent = {
    cardId: number
}
```

### Класс _ModalWindow_

Класс наследует класс Component, входящий тип ModalType. Конструктор класса принимает на вход:

    - Контейнер модального окна
    - Контейнер содержимого модального окна
    - Флаг открытия окна
    - Значения CSS-классов для изменяемых полей

Кнопке «Закрыть» добавлен слушатель клика. По клику на кнопку вызывается событие modal:close

Класс содержит set-функцию для содержимого модального окна. Данная функция принимает на вход HTML-элемент содержимого и вставляет его в контейнер для содержимого модального окна.

```
type ModalType = {
    openModal: boolean
}
```

### Класс _ProductFullInfo_

Класс наследует класс Component, входящий тип ProductItem. 

Защищённые свойства:

    1. Идентификатор продукта: string
    2. Описание продукта: HTMLElement
    3. Изображение: HTMLElement
    4. Наименование продукта: HTMLElement
    5. Категория продукта: HTMLElement
    6. Цена продукта

Конструктор класса принимает на вход:

    1. HTML-элемент, склонированный из шаблона для подробной информации по товару
    2. Значения CSS-классов для изменяемых полей
    3. Карточку продукта из модели данных.


Класс содержит set-функции для следующих данных продукта:

    - Описание
    - URI на изображение
    - Наименование
    - Категория
    - Цена в условных тугриках

На кнопке «В корзину» содержится слушатель клика. При клике на эту кнопку вызывается событие shoppingCart:add с передачей идентификатора добавленной карточки. 

Тип передаваемых данных:

```
type ProductOpenEvent = {
    cardId: number
}
```

### Класс _ShoppingCart_

Класс наследует класс Component, входищий тип ShoppingCartProductsList. 

Защищённые свойства:

    1. Контейнер для массива товаров в корзине: HTMLElement
    2. Элемент для общей суммы заказа: HTMLElement


Класс принимает на вход следующие данные:

    1. HTML-элемент, склонированный из шаблона для корзины
    2. Значения CSS-классов для изменяемых полей

Класс содержит set-функции для следующих параметров:

    1. Массив HTML-элементов товаров в корзине: HTMLElement[]
    2. Общая сумма заказа: number


Класс содержит кнопку «Оформить» со слушателем события по клику. Он вызывает событие shoppingCart:order с передачей в качестве данных пустого объекта.

### Класс _ProductCartItem_

Класс наследует класс Component, входящий тип ProductItem. 

Защищённые свойства:

    1. Идентификатор товара: string
    2. Элемент порядкового номера товара в корзине: HTMLElement
    3. Элемент для наименования товара: HTMLElement
    4. Элемент для стоимости товара: HTMLElement

Класс содержит set-функции для следующих параметров:

    - Порядковый номер товара: number
    - Наименование товара: string
    - Стоимость товара: number

На кнопку «Удалить» повешан слушатель события клика, который вызывает событие:  product:delete с передачей в него идентификатора товара.

Тип передаваемых данных:

```
type ProductOpenEvent = {
    cardId: number
}
```

### Класс _PaymentTypeAndAddressForm_

Класс наследует класс Component, входищий тип ShoppingCartProductsList. 

Защищённые свойства:

    1. Элемент для переключения между видом оплаты: HTMLElement
    2. Элемент для ввода адреса доставки: HTMLElement

Конструктор класса принимает на вход следующие данные:

    1. HTML-элемент, склонированный из соответсвующего шаблона
    2. Значения CSS-классов для изменяемых полей


На кнопку «Далее» повешан слушатель события order:next с передачей в него следующих параметров:

    - Способ оплаты: boolean
    - Адрес доставки: string

Тип передаваемых данных:

```
type OrderNextType = {
    paymentType: boolean,
    deliveryAddress: string
}
```

### Класс _PhoneAndEmailForm_

Класс наследует класс Component, входищий тип ShoppingCartProductsList. 

Защищённые свойства:

    1. Элемент для ввода электронной почты: HTMLElement
    2. Элемент для ввода телефона: HTMLElement

Конструктор класса принимает на вход следующие данные:

    1. HTML-элемент, склонированный из соответсвующего шаблона
    2. Значения CSS-классов для изменяемых полей

На кнопку «Оплатить» повешан слушатель клика, который вызывает событие order:pay с передачей в него следующих параметров

    - Количество выбранных товаров
    - Вид платежа
    - Почта пользователя
    - Телефон пользователя
    - Адрес доставки
    - Массив идентификаторов товаров:

Тип передаваемых данных:

```
type OrderData = {
    productsNumber: number,
    paymentType: boolean,
    email: string,
    phone: string,
    deliveryAddress: string,
    productListIds: string[]
}
```

### Класс _OrderStatus_

Класс наследует класс Component, входищий тип ShoppingCartProductsList. 

Защищённые свойства:

    1. Элемент для отображения итоговой суммы заказа: HTMLElement

Класс принимает на вход следующие данные:

    1. HTML-элемент, склонированный из соответсвующего шаблона
    2. Значения CSS-классов для изменяемых полей

Класс содержит set-функции для следующих параметров

    - Сумма заказа


## Представление. Бизнес-логика

При открытии страницы создаём экземпляры следующих классов:

    1. Экземпляр класса слоя модели данных для корзины
    2. Экземпляр класса слоя отображения данных для страницы
    3. Экземпляр класса слоя отображения данных для модального окна
    4. Экземпляр класса для содержимого модального окна: заполнение адреса
    5. Экземпляр класса для содержимого модального окна: заполнение контактов


Добавляем слушатели на следующие события:

```
export enum Events {
    CHANGE_PRODUCT_DATA = "productData:change", // изменение массива данных по карточкам
    PRODUCT_OPEN = "product:open", // клик по карточке продукта
    SHOPPING_CART_ADD = "shoppingCart:add", // кнопка "Добавить" нажата
    SHOPPING_CART_OPEN = "shoppingCart:open", // Кнопка "Корзина" нажата
    SHOPPING_CART_ORDER = "shoppingCart:order", //Кнопка оформить нажата 
    SHOPPING_CART_ORDER_NEXT = "order:next", // Кнопка "Далее" нажата
    SHOPPING_CART_ORDER_PAY = "order:pay" // Кнопка "Оплатить" нажата
}
```


Далее получаем из API список данных для всех карточек товаров. В случае успеха создаём экземпляр класса слоя модели данных для списка. После обновления данных по карточкам, вызывается событие событие productData:change.


#### productData:change

В слушателе этого события:
	
Создаем массив HTML-элементов карточек товаров на основе данных по карточкам.
Делаем рендер страницы, передав в функцию рендера следующие параметры:

    1. Массив HTML-элементов карточек
    2. Значение количества товаров в корзине, которые получаются с помощью геттара класса корзины товаров

#### product:open

При получении события product:open из API по идентификатору карточки получаем данные выбранного продукта. После получения данных из API создаём экземпляр класса подробной информации по товару. Далее в экземпляре класса модального окна делаем рендер с передачей следующих параметров:

    1. HTML-элемент содержимого модального окна
    2. Флаг открытия окна

#### shoppingCart:add

При получении этого события из API по идентификатору карточки получаем данные добавленного в корзину продукта. После получения данных вызываем метод модели данных по обновлению массива добавленных в корзину товаров.


#### shoppingCart:open

В слушателе указанного события из экземпляра класса модели данных корзины получаем список желаемых товаров.
Из полученного массива данных по товарам формируем массив HTML-элементов товаров корзины.
Далее отрисовываем модальное окно с помощью метода render, передав ему следующие параметры:

    1. Массив HTML-элементов для заказанных товаров
    2. Флаг открытия окна


#### shoppingCart:order

В слушателе данного события вызв

Далее с помощью метода render класса модального окна:

    1. HTML-элемент формы ввода данных
    2. Флаг открытия окна

#### order:paymentType

В слушателе данного события:

Обновляем значение поля «Тип оплаты» в классе корзины
Вызываем метод render экземпляра класса вводу адреса, куда передаем значение параметра paymentType


#### order:next

В слушателе данного события в метод render класса модального окна передаем следующие данные:

    1. HTML-элемент формы ввода данных
    2. Флаг открытия окна

#### order:pay

С помощью метода получения данных класса корзины получаем необходимые параметры для метода заказа
Вызываем API с этими параметрами

В случае успешного ответа:

Получаем HTML-элемент экрана успеха, куда передаем сумму заказа

Вызываем метод render модального окна, куда передаем:

    1. HTML-элемент экрана успеха
    2. Флаг открытия

В случае ошибки выводим её в консоль

