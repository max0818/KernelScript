[Назад](../9_flags.md)

## Time

### Добавляет методы для работы с временем

|**Метод**|**Описание**|
|-|-|
|`sleep(seconds: float): bool`|Приостановить выполнение|
|`timeout(function: function<any>, seconds: float = 0.001): bool`|Вызвать функцию через время|
|`interval(function: function<any>, seconds: float = 0.001, maxSteps = Infinity): bool`|Вызывать функцию каждый раз через время|
|`stopTimeout(timeout): bool`|Принудительно остановить timeout|
|`stopInterval(interval): bool`|Принудительно остановить interval|
