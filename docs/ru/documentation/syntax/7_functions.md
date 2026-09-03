[Назад](../../main.md)

## Функции

## Обычные функции
```ks
# При указании типа возврата, добавить return необходимо

fn название(аргументы): тип {
	код
	return значение
}
```

## Короткая функция
```ks
# При указании типа возврата, добавить return необходимо

var название: function = fn(аргументы): тип {
	код
	return значение
}
```

## Вызов функции
```ks
название(аргументы)
```

## Вызов функции с возвратом
```ks
var переменная = функция(аргументы)
```

## Примеры

### Функция с формулой
```ks
flag Console

fn add(a: int, b: int, c: float): float {
	return a * b / c
}

print(add(2, 3, 4))

/*
Вывод в консоль:
1.5

*/
```

### Rest-параметр
```ks
flag Console
flag Array

fn max(...numbers: float): float {
	if (numbers.size > 1) {
		var temp: float = numbers[0]

		var i: int = 1

		while (i < numbers.size) {
			if (numbers[i] > temp) {
				temp = numbers[i]
				++i
			}
		}

		return temp
	}
}

print(max(1, 543, 654, 94))

/*
Вывод консоли:
654.0

*/
```
