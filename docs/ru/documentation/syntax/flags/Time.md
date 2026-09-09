[Назад](../9_flags.md)

## Time

### Добавляет методы для работы с временем

|**Метод**|**Описание**|
|-|-|
|`sleep(seconds: float): bool`|Приостановить выполнение|
|`timeout(function: function<any>, seconds: float = 1.0): bool`|Вызвать функцию через время|
|`interval(function: function<any>, seconds: float = 1.0, maxSteps = Infinity): bool`|Вызывать функцию каждый раз через время|
|`stopTimeout(timeout): bool`|Принудительно остановить timeout|
|`stopInterval(interval): bool`|Принудительно остановить interval|

## Пример
```ks
var count: int = 0

# Прибавить 10 к переменной count
fn addTen() {
	count += 10
}

# 15 раз каждые 2 секунды вызывать addTen
var x = interval(addTen, 2, 15)

# Остановить интервал x
fn stop() {
	stopInterval(x)
}

# Вызвать stop через 30 секунд
timeout(stop, 30)
```
