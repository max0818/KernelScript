[Назад](../9_flags.md)

## String

### Добавляет методы для работа со строками

|**Метод**|**Описание**|
|-|-|
|||
|**Поиск**||
|`includes(subString: string)`|Содержит ли строка подстроку|
|`indexOf(subString: string, startPos: int)`|Получить индекс подстроки с *начала* строки|
|`lastIndexOf(subString: string, startPos: int)`|Получить индекс подстроки с *конца* строки|
|||
|**Изменение**||
|`slice(startPos: int, endPos: int)`|Обрезать строку|
|`repeat(n: int)`|Повторить строку *n* раз|
|`toUpperCase()`|Поменять регистр на *верхний*|
|`toLowerCase()`|Поменять регистр на *нижний*|
|||
|**Разное**||
|`toString(variant: any)`|Преобразовать в `string`|
|`size`|Получить длину строки|
|||
