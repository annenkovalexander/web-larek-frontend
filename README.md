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
    - метод orderProducts(): выполняет заказ содержащихся в корзине товаров в автоматизированной системе продаж. Метод принимает на вход список товаров в корзине. Список имеет тип ShoppingCartProductsList. Метод возвращает Promise типа ProductOrderResult. Вызыает метод родительского класса post c типом операции POST.

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

Тип ProductOrderResult:

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

Тип передаваемых данных: ProductData


### Класс _ShoppingCartProductListModel_

Класс наследует класс _Model_, имеет тип ShoppingCartProductsList.

Данные класса:

    - вид платежа: enum 'online' | 'offline'
    - email: string
    - телефон пользователя: string
    - адрес доставки: string
    - общая сумма заказа: number
    - массив идентификаторов товаров: string[]
    - количество выбранных товаров: number


Класс содержит set-функции для следующих параметров. В скобках указаны события, которые вызываются при изменений эти параметров:

    1. Количество выбранных товаров ()
    2. Вид платежа ()
    3. Почта пользователя ()
    4. Телефон пользователя ()
    5. Адрес доставки ()
    6. Массив товаров (chosenProducts: change) 

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
    2. Контейнер для корзины: HTMLElement
    3. Контейнер для кнопки корзины: HTMLElement
    4. Список карточек продуктов: HTMLElement[]
    5. Элемент, содержащий количество товаров в корзине: number
    6. Найстроки классов: PageSettings


Конструктор класса на вход принимает:

    1. Контейнер для обёртки, куда вставляется заголовок и содержимое страницы: HTMLElement
    2. Настройки классов: PageSettings
    3. Инстанцию класса IEvents

Класс содержит set-функции для следующих параметров: 

    - массива HTML-элементов карточек товаров: HTMLElement[]
    - значение количества товаров в корзине: number

Элемент корзины содержит слушатель клика, по которому вызывается событие shoppingCart:open с передачей в качестве параметров пустого объекта.

### Класс _ProductCard_

Класс наследует класс Component, входящий тип ProductItem.

Защищённые свойства:

    1. Идентификатор продукта: string
    2. Описание продукта: string
    3. Изображение: string
    4. Наименование продукта: string
    5. Категория продукта: string
    6. Цена продукта: number
    7. HTML-элемент для изображение: HTMLElement
    8. HTML-элемент для наименования продукта: HTMLElement
    9. HTML-элемент для категории продукта: HTMLElement
    10. HTML-элемент для цена продукта: HTMLElement

Конструктор класса на вход принимает следующие данные:

    1. Контейнер: HTMLElement
    2. Настройки классов: PageSettings
    3. Инстанцию класса IEvents


Содержит сеттеры для следующих изменяемых параметров карточки:

    - Идентификтор
    - Описание
    - URI на изображение
    - Наименование
    - Категория
    - Цена

Карточка товара содержит слушатель на клик. Он вызывает событие product:open с передачей в него данных типа ProductItem.

### Класс _ModalWindow_

Класс наследует класс Component, входящий тип ModalType. Конструктор класса принимает на вход:

    - Контейнер содержимого: HTMLElement
    - Монтируемый в контейнер элемент содержимого: HTMLElement
    - Флаг открытия окна: boolean
    - Настройки для работы с содержимым модального окна: ModalWindowSettings
    - Значения CSS-классов для изменяемых полей

Конструктор класса на вход принимает следующие данные:

    1. Контейнер: HTMLElement
    2. Настройки классов: ModalWindowSettings
    3. Инстанцию класса IEvents

Класс содержит следующие set-функции:

    contentElement(value: HTMLElement) - данная функция полностю удаляет всех дочерних элементов у контейнера содержимого. А затем дабавляет в качестве дочернего новый элемент value

    openFlag(value: boolean) - данная функция управляет классом активности модального окна. В случае если флаг -- истина, тогда модальное окно открывается, если ложь -- тогда закрывается

Кнопке «Закрыть» добавлен слушатель клика. По клику на кнопку у модального окна удаляется класс для активного состояния модального окна, и, в следствие этого, оно закрывается.

### Класс _ProductFullInfo_

Класс наследует класс Component, входящий тип ProductItem. 

Защищённые свойства:

    
    1. Идентификатор продукта: string
    2. Описание продукта: string
    3. Изображение: string
    4. Наименование продукта: string
    5. Категория продукта: string
    6. Цена продукта: number
    7. HTML-элемент для изображение: HTMLElement
    8. HTML-элемент для наименования продукта: HTMLElement
    9. HTML-элемент для категории продукта: HTMLElement
    10. HTML-элемент для цена продукта: HTMLElement
    11. HTML-элемент для кнопки "В корзину": HTMLButtonElement

Конструктор класса принимает на вход:

    1. Контейнер: HTMLElement
    2. Настройки классов: CardFullSettings
    3. Инстанцию класса IEvents


Класс содержит set-функции для следующих данных продукта:

    - Идентификтор
    - Описание
    - URI на изображение
    - Наименование
    - Категория
    - Цена

На кнопке «В корзину» содержится слушатель клика. При клике на эту кнопку вызывается событие shoppingCart:add с передачей идентификатора добавленной карточки. 

Тип передаваемых данных:

```
type ProductOpenEvent = {
    productId: string
}
```

### Класс _ShoppingCart_

Класс наследует класс Component, входищий тип ShoppingCartComponentData. 

Защищённые свойства:

    1. Список заказываемых товаров: HTMLElemnet[]
    2. Контейнер для монтирования списка заказываемых товаров: HTMLElement
    3. Элемент для отображения суммы заказываемых товаров: HTMLElement
    4. Кнопка "Заказать": HTMLButtonElement
    5. Итоговая сумма заказа: number

Класс принимает на вход следующие данные:

    1. Контейнер: HTMLElement
    2. Настройки классов: CardFullSettings
    3. Инстанцию класса IEvents

Класс содержит set-функции для следующих параметров:

    1. Массив HTML-элементов товаров в корзине: HTMLElement[]
    2. Общая сумма заказа: number


Класс содержит кнопку «Оформить» со слушателем события по клику. Он вызывает событие shoppingCart:order с передачей в качестве данных пустого объекта.

### Класс _ProductCartItem_

Класс наследует класс Component, входящий тип ProductItem. 

Защищённые свойства:

    1. Идентификатор товара: string
    2. Порядковый номер товара: string
    3. Наименование товара: string
    4. Цена товара: string
    5. Элемент порядкового номера товара в корзине: HTMLElement
    6. Элемент для наименования товара: HTMLElement
    7. Элемент для стоимости товара: HTMLElement
    8. Кнопка "Удалить": HTMLButtonElement

Конструктор класса принимает на вход следующие данные:

    1. Контейнер: HTMLElement
    2. Настройки классов: ProductCartItemSettings
    3. Инстанцию класса IEvents

Класс содержит set-функции для следующих параметров:

    - Идентификтор товара: string
    - Порядковый номер товара: number
    - Наименование товара: string
    - Стоимость товара: string

На кнопку «Удалить» повешан слушатель события клика, который вызывает событие:  product:delete с передачей в него идентификатора товара.

Тип передаваемых данных:

```
type ProductOpenEvent = {
    id: string
}
```

### Класс _PaymentTypeAndAddressForm_

Класс наследует класс Component, входищий тип Partial<ShoppingCartProductsList>. 

Защищённые свойства:

    1. Тип оплаты: PaymentType
    2. Адрес доставки: string
    3. Кнопка "Далее": HTMLElement
    4. Элементы для формы заказа: HTMLFormElement
    5. Поле ввода адреса доставки: HTMLInputElement
    6. Кнопка "Онлайн": HTMLButtonElement
    7. Кнопка "При получении": HTMLButtonElement
    8. Элемент для отображения ошибки: HTMLElement 

Конструктор класса принимает на вход следующие данные:

    1. Контейнер: HTMLFormElement
    2. Настройки классов: PaymentTypeAndAddressFormSettings
    3. Инстанцию класса IEvents

Класс содержит следующие методы:

    formValidate(address: string, paymenetType: PaymentType) - данная функция устанавливает у кнопки "Далее" признак disabled, если какое-либо из полей (адрес или тип оплаты) не заполнено
    toggleButtons(paymentType: Payment) - делает обводку вокруг кнопок в зависимости от типа оплаты
    getContainer() - возвращает контейнер


На кнопку «Далее» повешан слушатель события 'click'. На слушателе события повешан обработчик, который вызывает событие order:next с передачей в него следующих параметров:

    - Способ оплаты: PaymentType
    - Адрес доставки: string

Тип передаваемых данных:

```
type OrderNextType = {
    paymentType: boolean,
    deliveryAddress: string
}
```

На кнопку "Онлайн" повешан слушатель события 'click'. На слушателе события повешан обработчик, который вызывает событие paymentType:change с передачей в него следующих данных:

    - Способ оплаты: PaymentType
    - Адрес доставки: string

На кнопку "При получении" повешан слушатель события 'click'. На слушателе события повешан обработчик, который вызывает событие paymentType:change с передачей в него следующих данных:

    - Способ оплаты: PaymentType
    - Адрес доставки: string

Тип данных события является составным из типов AddressChangeEventData и PaymentTypeEventData

```
type AddressChangeEventData = {
    address: string
}
```

```
type PaymentTypeEventData = {
    paymentType: PaymentType
}
```

### Класс _PhoneAndEmailForm_

Класс наследует класс Component, входищий тип Partial<ShoppingCartProductsList>. 

Защищённые свойства:

    1. Телефон пользователя: string | number
    2. Почта пользователя: string
    3. Элемент для поля ввода телефона пользователя: HTMLInputElement
    4. Элемент для поля ввода почты пользователя: HTMLInputElement
    5. Кнопка "Оплатить": HTMLButtonElement
    6. Элемент для вывода ошибки валидации

Конструктор класса принимает на вход следующие данные:

    1. Контейнер: HTMLFormElement
    2. Настройки классов: PhoneAndEmailFormSettings
    3. Инстанцию класса IEvents


Методы класса:

    validateForm(userPhone: string | number, userEmail: string) - Данный метод ставит у кнопки "Оплатить" статус disabled и выводит текст ошибки, если хотя одно из полей: телефон или почта пользователя не заполнены

    getContainer() - возвращает контейнер

На кнопку «Оплатить» повешан слушатель клика, который вызывает событие order:pay с передачей в него следующих параметров

    - Почта пользователя
    - Телефон пользователя

Тип передаваемых данных:

```
type PhoneChangeEventData = {
    userPhone: string | number,
    userEmail: string
}
```

На поле ввода телефона пользователя повешан слушатель события 'input'. На событие повешан обработчик, который вызывает событие phone:change. Тип передаваемых данных PhoneChangeEventData
На поле ввода почты пользователя повешан слушатель события 'input'. На событие повешан обработчик, который вызывает событие email:change. Тип передаваемых данных PhoneChangeEventData

### Класс _OrderStatus_

Класс наследует класс Component, входищий тип Partial<ShoppingCartProductsList>. 

Защищённые свойства:

    1. Элемент для отображения статуса заказа: HTMLElement
    2. Элемент для отображения итоговой суммы заказа: HTMLElement
    3. Кнопка "К новым покупкам": HTMLButtonElement

Класс принимает на вход следующие данные:

    1. Контейнер: HTMLElement
    2. Настройки классов: OrderStatus
    3. Инстанцию класса IEvents

Класс содержит set-функции для следующих параметров

    - Итоговая сумма заказа: string

Класс содежит следующие методы:

    - getContainer() - возвращает контейнер

На кнопку "К новым покупкам" повешан слушатель события 'click'. На слушателе события повешан обработчик, который вызывает событие order: onceMore. В событии данные не отправляются


## Представление. Бизнес-логика

При открытии страницы создаём экземпляры следующих классов:

    1. Экземпляр класса слоя модели данных для корзины
    2. Экземпляр класса слоя отображения данных для страницы
    3. Экземпляр класса слоя отображения данных для модального окна
    4. Экземпляр класса для содержимого модального окна: заполнение адреса
    5. Экземпляр класса для содержимого модального окна: заполнение контактов


#### productData:change

В слушателе этого события:
	
Создаем массив HTML-элементов карточек товаров на основе данных по карточкам.
Делаем рендер страницы, передав в функцию рендера следующие параметры:

    1. Массив HTML-элементов карточек
    2. Значение количества товаров в корзине, которые получаются с помощью геттара класса корзины товаров

#### product:open

При получении события product:open получаем данные выбранного продукта. Создаём экземпляр класса подробной информации по товару. Далее в экземпляре класса модального окна делаем рендер с передачей следующих параметров:

    1. HTML-элемент содержимого модального окна
    2. Флаг открытия окна

#### shoppingCart:add

В данном событие получаем идентификтор выбранного продукта. Добавляем данный идентификатор к списку выбранных продуктов инстанции класса корзины. Вызываем ререндер количества выбранных товаров.

#### chosenProducts:change

Данное событие вызывается при любом изменении выбранных товаров. Если получаем нулевое количество заказываемых товаров, тогда чистим содержимое корзины, передав в метод рендер корзины пустые данные. Также обноляем количество выбранных товаров в корзине в заголовке страницы.

Если массив товаров не пуст:

При получении указанного события из инстации класса модели данных по списку полученных идентификаторов получаем все данные по товарам
На основании полученных данных для каждого товара созадем инстанцию класса ProductCartItem, и с помощью функции render получаем HTMLElement
Массив полученных HTMLElement передаем в функцию рендера класса корзины
Также передаем туда значение суммы заказа

В модели данных по корзине также изменяем итогоую сумму заказа

#### shoppingCart:open

В слушателе указанного события из экземпляра класса модели данных корзины получаем список желаемых товаров.
Из полученного массива данных по товарам формируем массив HTML-элементов товаров корзины.
Далее отрисовываем модальное окно с помощью метода render, передав ему следующие параметры:

    1. Массив HTML-элементов для заказанных товаров
    2. Флаг открытия окна

#### product:delete

В модели данных корзины обновляем выбранные товары
На странице обновляем количество выбранных товаров


#### shoppingCart:order

 Вызываем метод render класса модального окна:

    1. HTML-элемент формы ввода данных
    2. Флаг открытия окна

#### address:change

Вызываем метод formValidate инстации класса paymentTypeAndAddressForm

#### paymentType:change

Вызываем метод formValidate инстации класса paymentTypeAndAddressForm

#### order:paymentType

В слушателе данного события:

Обновляем значение поля «Тип оплаты» в классе корзины
Вызываем метод render экземпляра класса вводу адреса, куда передаем значение параметра paymentType


#### order:next

Обноавляем данные по адресу доставки и виду оплаты в инстации класса данных для корзины. 

Открываем модальное окно с формой ввода телефона и почты пользователя:

    1. HTML-элемент формы ввода телефона и почты пользователя
    2. Флаг открытия окна

#### phone:change

Вызываем обновление данных по телефону в модели данных корзины. Вызываем функцию formValidate инстации класса формы ввода почты и телефона пользвоателя

#### email:change

Вызываем обновление данных по почте в модели данных корзины. Вызываем функцию formValidate инстации класса формы ввода почты и телефона пользвоателя

#### order:pay

С помощью метода получения данных класса корзины получаем необходимые параметры для метода заказа
Вызываем API с этими параметрами

В случае успешного ответа:

Обнуляем значения заказанных товаров в инстанции класса данных корзины

Получаем HTML-элемент экрана успеха, куда передаем сумму заказа

Вызываем метод render модального окна, куда передаем:

    1. HTML-элемент экрана успеха
    2. Флаг открытия

В случае ошибки выводим её в элемент вывода ошибки инстанции класса формы ввода почты и телефона пользователя

#### order:onceMore

Закрываем модальное окно, передав в него флаг открытия в значении false