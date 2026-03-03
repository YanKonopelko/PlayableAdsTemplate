---
name: create_cocos_component
description: Правила и шаблоны для создания TypeScript компонентов в Cocos Creator 3.8.7
---

# Создание компонентов Cocos Creator

При создании новых скриптов для Cocos Creator 3.8.7 следуй этим правилам:

1. **Импорты**: Всегда импортируй необходимые классы из `cc`.
   ```typescript
   import { _decorator, Component, Node } from 'cc';
   const { ccclass, property } = _decorator;
   ```
2. **Декораторы**: Используй `@ccclass('ClassName')` для регистрации класса.
3. **Свойства (Properties)**: Для полей, видимых в инспекторе, используй `@property`. Обязательно указывай тип.
   ```typescript
   @property(Node)
   public targetNode: Node | null = null;
   
   @property({ type: cc.Float })
   public speed: number = 10;
   ```
4. **Методы жизненного цикла**: Используй стандартные методы: `onLoad`, `start`, `update(dt: number)`, `onDestroy`.
5. **Экспорт**: Экспортируй класс по умолчанию или как именованный экспорт.

Пример:
```typescript
import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Sprite)
    public graphic: Sprite | null = null;

    start() {
        // Инициализация
    }

    update(deltaTime: number) {
        // Логика каждого кадра
    }
}
```
