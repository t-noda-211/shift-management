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

これにより、エラーハンドリングが統一され、将来的な拡張も容易になります。
