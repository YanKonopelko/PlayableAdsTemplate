---
name: cocos_ui_manipulation
description: Управление UI и узлами в Cocos Creator 3.8.7
---

# Управление UI и Node в Cocos Creator

При работе с UI и графикой:

1. **Взаимодействие с узлами (Nodes)**:
   - Получение компонента: `let sprite = this.node.getComponent(Sprite);`
   - Активация/деактивация: `this.node.active = true;` (не используй `opacity = 0` для полного скрытия, если не требуется анимация Fade, лучше `active = false`).
2. **Обработка ввода (Input)**:
   В Cocos Creator 3.x используется `input`:
   ```typescript
   import { input, Input, EventTouch } from 'cc';
   
   // ... в onLoad или start
   input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
   ```
   Или регистрация на конкретном узле (UI):
   ```typescript
   this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
   ```
3. **Tween анимации**:
   Для простых анимаций UI используй `tween`:
   ```typescript
   import { tween, Vec3 } from 'cc';
   
   tween(this.node)
       .to(1.0, { scale: new Vec3(1.2, 1.2, 1.2) })
       .start();
   ```
4. **Префабы (Prefabs)**:
   Для спавна объектов:
   ```typescript
   import { instantiate, Prefab, Node } from 'cc';
   
   @property(Prefab)
   public targetPrefab: Prefab | null = null;
   
   // ...
   let newNode = instantiate(this.targetPrefab);
   this.node.addChild(newNode);
   ```
