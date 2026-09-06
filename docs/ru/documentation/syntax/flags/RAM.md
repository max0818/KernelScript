[Назад](../9_flags.md)

## RAM

- Доступен только на низком уровне

### Добавляет методы для работы с оперативной памятью

|**Метод**|**Описание**|
|-|-|
|`disableAutoFree(): bool`|Отключить автоматическую отчистку|
|`info(): object<any>`|Информация о памяти|
|`read(address: int, size: int): array<int>`|Чтение из памяти|
|`write(address: int, data: any): bool`|Запись в память|
|`free(address: int, size: int): bool`|Освобождение памяти|
