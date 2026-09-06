[Назад](../9_flags.md)

## String

### Добавляет методы для работы со строками

|**Метод**|**Описание**|
|-|-|
|||
|**Поиск**||
|`includes(subString: string): bool`|Содержит ли строка подстроку|
|`indexOf(subString: string, startPos: int): int`|Получить индекс подстроки с *начала* строки|
|`lastIndexOf(subString: string, startPos: int): int`|Получить индекс подстроки с *конца* строки|
|||
|**Изменение**||
|`slice(startPos: int, endPos: int): string`|Обрезать строку|
|`repeat(n: int): string`|Повторить строку *n* раз|
|`toUpperCase(): string`|Поменять регистр на *верхний*|
|`toLowerCase(): string`|Поменять регистр на *нижний*|
|||
|**Разное**||
|`toString(variant: any): string`|Преобразовать в `string`|
|`size: int`|Получить длину строки|
|||
