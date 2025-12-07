# Backend

Express + TypeScript のバックエンドAPIサーバー

## 値オブジェクト

### エラーハンドリング

値オブジェクトのカスタムエラーは、すべて `ValueObjectError` 基底クラスを継承する必要があります。

例

```typescript
import { ValueObjectError } from './valueObjectError'

export class InvalidEmployeeFullNameError extends ValueObjectError {
  constructor() {
    super('Employee Full Name must be between 1 and 20 characters')
  }
}
```

## エンティティ（集約）

### エラーハンドリング

エンティティのカスタムエラーは、すべて `AggregateError` 基底クラスを継承する必要があります。

例

```typescript
import { AggregateError } from '../aggregateError'

export class EndTimeMustBeAfterStartTimeError extends AggregateError {
  constructor() {
    super('End time must be after start time')
  }
}
```

これにより、エラーハンドリングが統一され、将来的な拡張も容易になります。
