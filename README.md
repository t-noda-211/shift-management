# Shift Management

pnpmモノレポ構成のシフト管理アプリケーション

## 構成

- `frontend`: Next.js + TypeScript のフロントエンドアプリケーション
- `backend`: Express + TypeScript のバックエンドAPIサーバー
- `shared`: 共有型定義とユーティリティ関数（Viteでビルド）

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 全パッケージのビルド
pnpm build

# 開発サーバーの起動（frontend + backend）
pnpm dev
```

## 各パッケージのコマンド

### Frontend

```bash
cd frontend
pnpm dev      # 開発サーバー起動（http://localhost:3000）
pnpm build    # プロダクションビルド
pnpm start    # プロダクションサーバー起動
```

### Backend

```bash
cd backend
pnpm dev      # 開発サーバー起動（http://localhost:3001）
pnpm build    # TypeScriptコンパイル
pnpm start    # プロダクションサーバー起動
```

### Shared

```bash
cd shared
pnpm build    # Viteでビルド
pnpm dev      # ウォッチモードでビルド
```

## ワークスペース内でのパッケージ使用

`frontend`と`backend`は`shared`パッケージを`workspace:*`で参照しています。

```typescript
// frontend または backend から
import { User, Shift, formatDate } from 'shared';
```

