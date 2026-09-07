[Назад](../main.md)

## Типы

- *`int` в `float` - расширение допустимо*

### Автоопределение
- `any` - Неопределённый

### Простые
- `bool` - Логический
- `int` - Целочисленный
- `float` - Дробный

### Малые структуры
- `string` - Строка
- `array` - Массив
- `array<T>` - Массив с определёнными типами значений
- `object` - Объект
- `object<T>` - Объект с определёнными типами свойств

### Структуры
- `function` - Функция
- `function<T>` - Функция с определённым типом возврата

## Особенности
```ks
# У каждого типа свой null

var a: bool = null
var b: int = null
var c: float = null
var d: string = null
var e: array = null
var f: object = null
var g: function = null


print('Bool: ', a)
print('Int: ', b)
print('Float: ', c)
print('String: ', d)
print('Array: ', e)
print('Object: ', f)
print('Function: ', g)


/*
Вывод консоли:
Bool: false
Int: 0
Float: 0.0
String: ""
Array: []
Object: {}
Function: fn() {}

*/
```

## Составные типы
```ks
# Неправильно:

# Нельзя делать вложенные составные типы:
array<array<int>>

# Нельзя для возврата прописывать несколько типов:
function<int, string>


# Правильно:

array<int, float, bool, array>

function<string>
```
