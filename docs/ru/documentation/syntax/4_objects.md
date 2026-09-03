[Назад](../../main.md)

## Объекты

## Синтаксис
```ks
{ключ1: значение, ключ2: значение}
```

## Примеры

### Переменная с объектом
```ks
var x: object = {
	count: 1,
	isCreated: true,
	name: 'text'
}
```

### Переменная с объектом с определённым типом значений
```ks
var x: object<int> = {
	root: 1,
	admins: 2,
	users: 3
}
```

### Константа с объектом
```ks
const x: object = {
	mult: 2.4,
	isSub: false
}
```

### Константа с объектом с определённым типом значений
```ks
const x: object<string> = {
	name1: "text1",
	name2: 'text2',
	name3: `text3`
}
```
