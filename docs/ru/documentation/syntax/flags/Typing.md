[Назад](../9_flags.md)

## Typing

### Добавляет методы для работы с типами

|**Метод**|**Описание**|
|-|-|
|`disableAutoTyping(): bool`|Отключение автоматической проверки типов|
|`typeOf(value: any, expectType: string): string`|Получение типа|
|`swapType(newType: string): bool`|Явное изменение типа|

### Что требуется после вызова метода disableAutoTyping:

- Указывать тип объявляемым переменным
```ks
var x: int
```
- Указывать тип объявляемым константам
```ks
const y: float = 3.14
```
- Указывать тип параметрам функций и методов
```ks
fn isGreater(a: int, b: int): bool {
	return a > b
}
```
- Указывать тип rest-параметрам функций и методов
```ks
flag Array

fn add(...numbers: float): float {
	if (numbers.size > 1) {
		var temp: float = 0

		var i: int = 1
		while (i < numbers.size) {
			temp += numbers[i]
			i++
		}

		return temp
	} elif (numbers.size === 1) {
		return numbers[0]
	} else {
		return 0
	}
}
```
- Указывать тип возврата функциям
```ks
flag Console

fn log(message: string): bool {
	if (not message) return false

	const tempMessage: string = '[LOG] ' + message

	print(tempMessage)
	return tempMessage
}
```
- Указывать вложенные типы в составных типах
```ks
var data: array<int, string, bool> = [
	'KernelScript',
	67,
	true
]
```
- Нельзя использовать тип `any`
```ks
flag Typing

Typing.disableAutoTyping()


# Неправильно:

var x: any

const y: array<any> = ['text', 123]
```
